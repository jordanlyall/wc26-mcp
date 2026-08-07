// ── Live results layer ──────────────────────────────────────────────
//
// Overlays REAL match results + status on top of the static schedule.
// Two interchangeable free sources, selected at runtime:
//
//   1. football-data.org  (preferred — set FOOTBALL_DATA_KEY)
//      • Full WC 2026 coverage, 104 matches + standings.
//      • Carries a live STATUS field (IN_PLAY/PAUSED/FINISHED) — this is
//        what answers "which matches are playing right now".
//      • Free tier: ~10 requests/min. We honour the throttle headers the
//        maintainer asks clients to read, and a single matches call per
//        cache window (60s) feeds both get_matches and get_standings, so
//        we sit at ~1 req/min.
//
//   2. openfootball/worldcup.json  (fallback — no key, no rate limit)
//      • Public-domain JSON. Final scores only, committed post-match.
//      • No live in-match status.
//
// Design rules (both sources):
//   • Fail-safe: any network/parse error returns an empty result set so
//     the server keeps serving the static schedule. The live layer can
//     never crash a tool call.
//   • Cached in-memory with a short TTL + single-flight, so a burst of
//     tool calls hits the network at most once per TTL window.

import { teams } from "./teams.js";

const OPENFOOTBALL_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";
const FOOTBALL_DATA_URL =
  "https://api.football-data.org/v4/competitions/WC/matches?season=2026";
const CACHE_TTL_MS = 60_000; // 60s — one upstream call per window
const FETCH_TIMEOUT_MS = 6_000;

/** A real result for one match, mapped to wc26 team IDs. */
export interface LiveResult {
  home_team_id: string; // wc26 id of the home side
  away_team_id: string; // wc26 id of the away side
  home_score: number;
  away_score: number;
  ht_home?: number;
  ht_away?: number;
  status: "live" | "completed"; // in-progress vs finished
}

// ── Team name/code → wc26 id resolution ─────────────────────────────

function normalize(name: string): string {
  // Strip diacritics so "Curaçao" === "Curacao", "Türkiye" === "Turkiye",
  // "Côte d'Ivoire" === "Cote d'Ivoire" — sources spell accented names
  // differently and an exact match would silently drop those results.
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// Common name variants that differ from wc26's spelling → wc26 team id.
const NAME_ALIASES: Record<string, string> = {
  "united states": "usa",
  "usa": "usa",
  "south korea": "kor",
  "korea republic": "kor",
  "ir iran": "irn",
  "iran": "irn",
  "ivory coast": "civ",
  "cote d'ivoire": "civ",
};

const nameToId: Map<string, string> = (() => {
  const m = new Map<string, string>();
  for (const t of teams) {
    m.set(normalize(t.name), t.id);
    m.set(normalize(t.code), t.id); // FIFA 3-letter code / tla
  }
  for (const [alias, id] of Object.entries(NAME_ALIASES)) {
    m.set(normalize(alias), id);
  }
  return m;
})();

/** Resolve a team by name or 3-letter code to a wc26 id, or undefined. */
export function resolveTeamId(...candidates: Array<string | undefined>): string | undefined {
  for (const c of candidates) {
    if (!c) continue;
    const id = nameToId.get(normalize(c));
    if (id) return id;
  }
  return undefined;
}

// ── Result keying ───────────────────────────────────────────────────
//
// Group-stage pairs are unique, so an unordered team-pair key is a
// reliable join between a feed and the static schedule even if home/away
// order or the exact date differ slightly between sources.

function pairKey(idA: string, idB: string): string {
  return [idA, idB].sort().join("|");
}

// ── Source: openfootball ────────────────────────────────────────────

interface OpenFootballMatch {
  team1?: string;
  team2?: string;
  score?: { ft?: [number, number]; ht?: [number, number] };
}

async function fetchOpenFootball(): Promise<Map<string, LiveResult>> {
  const byPair = new Map<string, LiveResult>();
  const raw = await getJson<{ matches?: OpenFootballMatch[] }>(OPENFOOTBALL_URL);
  if (!raw) return byPair;

  for (const m of raw.matches ?? []) {
    const ft = m.score?.ft;
    if (!ft || ft.length !== 2) continue; // not played yet
    const homeId = resolveTeamId(m.team1);
    const awayId = resolveTeamId(m.team2);
    if (!homeId || !awayId) continue; // unmappable (e.g. knockout placeholder)

    const ht = m.score?.ht;
    byPair.set(pairKey(homeId, awayId), {
      home_team_id: homeId,
      away_team_id: awayId,
      home_score: ft[0],
      away_score: ft[1],
      ht_home: ht?.[0],
      ht_away: ht?.[1],
      status: "completed", // openfootball publishes finals only
    });
  }
  return byPair;
}

// ── Source: football-data.org ───────────────────────────────────────

interface FDMatch {
  status?: string; // SCHEDULED | TIMED | IN_PLAY | PAUSED | FINISHED | ...
  homeTeam?: { name?: string; shortName?: string; tla?: string };
  awayTeam?: { name?: string; shortName?: string; tla?: string };
  score?: {
    fullTime?: { home?: number | null; away?: number | null };
    halfTime?: { home?: number | null; away?: number | null };
  };
}

const FD_LIVE = new Set(["IN_PLAY", "PAUSED"]);
const FD_DONE = new Set(["FINISHED", "AWARDED"]);

// Daniel (football-data.org) asks clients to read the throttle headers to
// avoid hammering the limiter. We track the last seen remaining-this-minute
// and skip an upstream call when it's exhausted, falling back to cache.
let fdRequestsAvailable = Infinity;

async function fetchFootballData(key: string): Promise<Map<string, LiveResult>> {
  const byPair = new Map<string, LiveResult>();

  if (fdRequestsAvailable <= 0) return byPair; // throttled → keep static/cached

  const raw = await getJson<{ matches?: FDMatch[] }>(FOOTBALL_DATA_URL, {
    "X-Auth-Token": key,
  });
  if (!raw) return byPair;

  for (const m of raw.matches ?? []) {
    const status = m.status ?? "";
    const isLive = FD_LIVE.has(status);
    const isDone = FD_DONE.has(status);
    if (!isLive && !isDone) continue; // not started → leave as scheduled

    const home = m.score?.fullTime?.home;
    const away = m.score?.fullTime?.away;
    if (home == null || away == null) continue;

    const homeId = resolveTeamId(m.homeTeam?.tla, m.homeTeam?.name, m.homeTeam?.shortName);
    const awayId = resolveTeamId(m.awayTeam?.tla, m.awayTeam?.name, m.awayTeam?.shortName);
    if (!homeId || !awayId) continue;

    const ht = m.score?.halfTime;
    byPair.set(pairKey(homeId, awayId), {
      home_team_id: homeId,
      away_team_id: awayId,
      home_score: home,
      away_score: away,
      ht_home: ht?.home ?? undefined,
      ht_away: ht?.away ?? undefined,
      status: isLive ? "live" : "completed",
    });
  }
  return byPair;
}

// ── Shared fetch helper (timeout + fail-safe + throttle capture) ─────

async function getJson<T>(url: string, headers?: Record<string, string>): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers });
    // Capture football-data.org's throttle hint when present.
    const remaining = res.headers.get("x-requests-available-minute");
    if (remaining != null) fdRequestsAvailable = Number(remaining);
    if (!res.ok) return null; // fail-safe: static schedule still serves
    return (await res.json()) as T;
  } catch {
    return null; // network error / timeout → null, never throw
  } finally {
    clearTimeout(timer);
  }
}

// ── Public: cached, source-selecting result fetch ───────────────────

let cache: { at: number; byPair: Map<string, LiveResult> } | null = null;
let inflight: Promise<Map<string, LiveResult>> | null = null;

/** Which free source is active, for surfacing in tool output. */
export function liveSource(): "football-data.org" | "openfootball" {
  return process.env.FOOTBALL_DATA_KEY ? "football-data.org" : "openfootball";
}

/**
 * Returns real results keyed by unordered team-pair, cached for TTL.
 * Always resolves (never rejects) — an empty map means "no live data
 * available right now", and callers fall back to the static schedule.
 */
export async function getLiveResults(): Promise<Map<string, LiveResult>> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) return cache.byPair;
  if (inflight) return inflight;

  const key = process.env.FOOTBALL_DATA_KEY;

  inflight = (async () => {
    try {
      const byPair = key ? await fetchFootballData(key) : await fetchOpenFootball();
      cache = { at: Date.now(), byPair };
      return byPair;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

/**
 * Look up a real result for a wc26 match by its team IDs, normalising the
 * score to the match's own home/away orientation.
 */
export function lookupResult(
  live: Map<string, LiveResult>,
  homeTeamId: string | null,
  awayTeamId: string | null
):
  | { home_score: number; away_score: number; ht_home?: number; ht_away?: number; status: "live" | "completed" }
  | undefined {
  if (!homeTeamId || !awayTeamId) return undefined;
  const r = live.get(pairKey(homeTeamId, awayTeamId));
  if (!r) return undefined;

  const sameOrientation = r.home_team_id === homeTeamId;
  return {
    home_score: sameOrientation ? r.home_score : r.away_score,
    away_score: sameOrientation ? r.away_score : r.home_score,
    ht_home: sameOrientation ? r.ht_home : r.ht_away,
    ht_away: sameOrientation ? r.ht_away : r.ht_home,
    status: r.status,
  };
}

// ── Standings computation ───────────────────────────────────────────

export interface TableRow {
  team_id: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

/**
 * Build a real group table from COMPLETED results among the group's teams.
 * In-progress (live) matches are intentionally excluded — a match only
 * enters the table once it's finished, matching how official tables work.
 * Ordered by points, then goal difference, then goals scored. (FIFA's full
 * tiebreaker chain begins with head-to-head; points→GD→GF is a faithful
 * first-order ordering and matches the table the vast majority of the time.)
 */
export function computeGroupTable(
  teamIds: string[],
  groupMatches: Array<{ home_team_id: string | null; away_team_id: string | null }>,
  live: Map<string, LiveResult>
): TableRow[] {
  const rows = new Map<string, TableRow>();
  for (const id of teamIds) {
    rows.set(id, {
      team_id: id,
      played: 0, won: 0, drawn: 0, lost: 0,
      goals_for: 0, goals_against: 0, goal_difference: 0, points: 0,
    });
  }

  for (const m of groupMatches) {
    const res = lookupResult(live, m.home_team_id, m.away_team_id);
    if (!res || res.status !== "completed") continue; // skip unplayed + in-progress
    const home = rows.get(m.home_team_id!);
    const away = rows.get(m.away_team_id!);
    if (!home || !away) continue;

    home.played++; away.played++;
    home.goals_for += res.home_score; home.goals_against += res.away_score;
    away.goals_for += res.away_score; away.goals_against += res.home_score;

    if (res.home_score > res.away_score) {
      home.won++; home.points += 3; away.lost++;
    } else if (res.home_score < res.away_score) {
      away.won++; away.points += 3; home.lost++;
    } else {
      home.drawn++; away.drawn++; home.points++; away.points++;
    }
  }

  for (const r of rows.values()) {
    r.goal_difference = r.goals_for - r.goals_against;
  }

  return [...rows.values()].sort(
    (a, b) =>
      b.points - a.points ||
      b.goal_difference - a.goal_difference ||
      b.goals_for - a.goals_for
  );
}
