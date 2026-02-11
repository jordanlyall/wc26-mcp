import type { VercelRequest, VercelResponse } from "@vercel/node";

import { matches } from "../src/data/matches.js";
import { teams } from "../src/data/teams.js";
import { venues } from "../src/data/venues.js";

import type { Match, Team, Venue } from "../src/types/index.js";

// Re-export data for route handlers
export { matches, teams, venues };
export { groups } from "../src/data/groups.js";
export { teamProfiles } from "../src/data/team-profiles.js";
export { cityGuides } from "../src/data/city-guides.js";
export { historicalMatchups } from "../src/data/historical-matchups.js";
export { visaInfo } from "../src/data/visa-info.js";
export { fanZones } from "../src/data/fan-zones.js";

export type { Match, Team, Venue };

// ── CORS wrapper ──

export function handler(fn: (req: VercelRequest, res: VercelResponse) => Promise<void>) {
  return async (req: VercelRequest, res: VercelResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(200).end();
    try {
      await fn(req, res);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

// ── Shared helpers ──

export function teamName(id: string | null): string {
  if (!id) return "TBD";
  const t = teams.find((t) => t.id === id);
  return t ? `${t.flag_emoji} ${t.name}` : id;
}

export function venueName(id: string): string {
  const v = venues.find((v) => v.id === id);
  return v ? `${v.name}, ${v.city}` : id;
}

export function resolveTeam(input: string): Team | undefined {
  const tid = input.toLowerCase();
  return teams.find(
    (t) => t.id === tid || t.code.toLowerCase() === tid || t.name.toLowerCase() === tid
  );
}

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): { miles: number; km: number } {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return { miles: Math.round(km * 0.621371), km: Math.round(km) };
}

export function convertTime(date: string, timeUtc: string, timezone: string): { date: string; time: string; error?: string } {
  try {
    const dt = new Date(`${date}T${timeUtc}:00Z`);
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
      hour12: false,
    });
    const parts = Object.fromEntries(
      formatter.formatToParts(dt).map((p) => [p.type, p.value])
    );
    return {
      date: `${parts.year}-${parts.month}-${parts.day}`,
      time: `${parts.hour}:${parts.minute}`,
    };
  } catch {
    return { date, time: timeUtc, error: `Invalid timezone "${timezone}". Use IANA format like "America/New_York" or "Europe/London".` };
  }
}

export function enrichMatch(m: Match, timezone?: string) {
  const venue = venues.find((v) => v.id === m.venue_id);
  const venueTimezone = venue?.timezone ?? "UTC";
  const venueLocal = convertTime(m.date, m.time_utc, venueTimezone);

  const enriched: Record<string, unknown> = {
    ...m,
    home_team_name: teamName(m.home_team_id),
    away_team_name: teamName(m.away_team_id),
    venue_name: venueName(m.venue_id),
    time_venue: venueLocal.time,
    venue_timezone: venueTimezone,
  };

  if (timezone) {
    const local = convertTime(m.date, m.time_utc, timezone);
    enriched.time_local = local.time;
    enriched.local_date = local.date;
    enriched.local_timezone = timezone;
  }

  return enriched;
}

export function enrichGroup(g: { id: string; teams: string[]; venue_ids: string[] }) {
  const groupTeams = g.teams
    .map((tid) => teams.find((t) => t.id === tid))
    .filter(Boolean) as Team[];
  const groupVenues = g.venue_ids
    .map((vid) => venues.find((v) => v.id === vid))
    .filter(Boolean) as Venue[];
  const groupMatches = matches
    .filter((m) => m.group === g.id)
    .map((m) => enrichMatch(m));

  return {
    id: g.id,
    teams: groupTeams.map((t) => ({
      id: t.id, name: t.name, code: t.code, flag_emoji: t.flag_emoji,
      confederation: t.confederation, fifa_ranking: t.fifa_ranking, is_host: t.is_host,
    })),
    venues: groupVenues.map((v) => ({ id: v.id, name: v.name, city: v.city, country: v.country })),
    matches: groupMatches,
  };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateDate(value: string | undefined, name: string): string | null {
  if (!value) return null;
  if (!DATE_RE.test(value)) return `${name} must be YYYY-MM-DD format`;
  return null;
}

export function param(req: VercelRequest, key: string): string | undefined {
  const val = req.query[key];
  if (Array.isArray(val)) return val[0];
  return val ?? undefined;
}
