#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { matches } from "./data/matches.js";
import { teams } from "./data/teams.js";
import { groups } from "./data/groups.js";
import { venues } from "./data/venues.js";

import type {
  Match,
  Team,
  Group,
  Venue,
  MatchRound,
  MatchStatus,
} from "./types/index.js";

// ── Server setup ────────────────────────────────────────────────────

const server = new McpServer({
  name: "wc26-mcp",
  version: "0.1.0",
});

// ── Helpers ─────────────────────────────────────────────────────────

function json(data: unknown): { content: Array<{ type: "text"; text: string }> } {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

function teamName(id: string | null): string {
  if (!id) return "TBD";
  const t = teams.find((t) => t.id === id);
  return t ? `${t.flag_emoji} ${t.name}` : id;
}

function venueName(id: string): string {
  const v = venues.find((v) => v.id === id);
  return v ? `${v.name}, ${v.city}` : id;
}

function enrichMatch(m: Match) {
  return {
    ...m,
    home_team_name: teamName(m.home_team_id),
    away_team_name: teamName(m.away_team_id),
    venue_name: venueName(m.venue_id),
  };
}

function enrichGroup(g: Group) {
  const groupTeams = g.teams
    .map((tid) => teams.find((t) => t.id === tid))
    .filter(Boolean) as Team[];
  const groupVenues = g.venue_ids
    .map((vid) => venues.find((v) => v.id === vid))
    .filter(Boolean) as Venue[];
  const groupMatches = matches
    .filter((m) => m.group === g.id)
    .map(enrichMatch);

  return {
    id: g.id,
    teams: groupTeams.map((t) => ({
      id: t.id,
      name: t.name,
      code: t.code,
      flag_emoji: t.flag_emoji,
      confederation: t.confederation,
      fifa_ranking: t.fifa_ranking,
      is_host: t.is_host,
    })),
    venues: groupVenues.map((v) => ({
      id: v.id,
      name: v.name,
      city: v.city,
      country: v.country,
    })),
    matches: groupMatches,
  };
}

// ── Tool: get_matches ───────────────────────────────────────────────

const matchRounds: MatchRound[] = [
  "Group Stage",
  "Round of 32",
  "Round of 16",
  "Quarter-final",
  "Semi-final",
  "Third-place play-off",
  "Final",
];

const matchStatuses: MatchStatus[] = [
  "scheduled",
  "live",
  "completed",
  "postponed",
  "cancelled",
];

server.registerTool("get_matches", {
  title: "Get Matches",
  description:
    "Query FIFA World Cup 2026 matches. Filter by date, date range, team, group, venue, round, or status. Returns enriched match data with team names and venue details.",
  inputSchema: z.object({
    date: z
      .string()
      .optional()
      .describe("Exact date in YYYY-MM-DD format"),
    date_from: z
      .string()
      .optional()
      .describe("Start of date range (YYYY-MM-DD), inclusive"),
    date_to: z
      .string()
      .optional()
      .describe("End of date range (YYYY-MM-DD), inclusive"),
    team: z
      .string()
      .optional()
      .describe(
        "Team ID or FIFA code (e.g. 'usa', 'BRA', 'arg'). Matches where this team plays home or away."
      ),
    group: z
      .string()
      .optional()
      .describe("Group letter A through L"),
    venue: z
      .string()
      .optional()
      .describe("Venue ID (e.g. 'metlife', 'azteca')"),
    round: z
      .enum(matchRounds as [string, ...string[]])
      .optional()
      .describe("Tournament round"),
    status: z
      .enum(matchStatuses as [string, ...string[]])
      .optional()
      .describe("Match status"),
  }),
}, async (args) => {
  let result = matches;

  if (args.date) {
    result = result.filter((m) => m.date === args.date);
  }
  if (args.date_from) {
    result = result.filter((m) => m.date >= args.date_from!);
  }
  if (args.date_to) {
    result = result.filter((m) => m.date <= args.date_to!);
  }
  if (args.team) {
    const tid = args.team.toLowerCase();
    const team = teams.find(
      (t) => t.id === tid || t.code.toLowerCase() === tid
    );
    const teamId = team?.id ?? tid;
    result = result.filter(
      (m) => m.home_team_id === teamId || m.away_team_id === teamId
    );
  }
  if (args.group) {
    result = result.filter(
      (m) => m.group?.toUpperCase() === args.group!.toUpperCase()
    );
  }
  if (args.venue) {
    result = result.filter((m) => m.venue_id === args.venue);
  }
  if (args.round) {
    result = result.filter((m) => m.round === args.round);
  }
  if (args.status) {
    result = result.filter((m) => m.status === args.status);
  }

  return json({
    count: result.length,
    matches: result.map(enrichMatch),
  });
});

// ── Tool: get_teams ─────────────────────────────────────────────────

const confederations = [
  "UEFA",
  "CONMEBOL",
  "CONCACAF",
  "CAF",
  "AFC",
  "OFC",
] as const;

server.registerTool("get_teams", {
  title: "Get Teams",
  description:
    "Query FIFA World Cup 2026 teams. Filter by group, confederation, or host status. Returns team details including FIFA ranking and flag emoji.",
  inputSchema: z.object({
    group: z
      .string()
      .optional()
      .describe("Group letter A through L"),
    confederation: z
      .enum(confederations)
      .optional()
      .describe("FIFA confederation (UEFA, CONMEBOL, CONCACAF, CAF, AFC, OFC)"),
    is_host: z
      .boolean()
      .optional()
      .describe("Filter for host nations only (USA, Mexico, Canada)"),
  }),
}, async (args) => {
  let result = teams;

  if (args.group) {
    result = result.filter(
      (t) => t.group.toUpperCase() === args.group!.toUpperCase()
    );
  }
  if (args.confederation) {
    result = result.filter((t) => t.confederation === args.confederation);
  }
  if (args.is_host !== undefined) {
    result = result.filter((t) => t.is_host === args.is_host);
  }

  return json({
    count: result.length,
    teams: result,
  });
});

// ── Tool: get_groups ────────────────────────────────────────────────

server.registerTool("get_groups", {
  title: "Get Groups",
  description:
    "Get FIFA World Cup 2026 group details. Returns teams, venues, and match schedule for each group. Optionally filter to a specific group.",
  inputSchema: z.object({
    group: z
      .string()
      .optional()
      .describe("Specific group letter A through L. Omit for all groups."),
  }),
}, async (args) => {
  let result = groups;

  if (args.group) {
    result = result.filter(
      (g) => g.id.toUpperCase() === args.group!.toUpperCase()
    );
  }

  return json({
    count: result.length,
    groups: result.map(enrichGroup),
  });
});

// ── Tool: get_venues ────────────────────────────────────────────────

server.registerTool("get_venues", {
  title: "Get Venues",
  description:
    "Query FIFA World Cup 2026 venues across the USA, Mexico, and Canada. Filter by country, city, or region. Returns full venue details including capacity, coordinates, and notable events.",
  inputSchema: z.object({
    country: z
      .enum(["USA", "Mexico", "Canada"])
      .optional()
      .describe("Host country"),
    city: z
      .string()
      .optional()
      .describe("City name (e.g. 'Miami Gardens', 'Mexico City')"),
    region: z
      .enum(["Western", "Central", "Eastern"])
      .optional()
      .describe("Geographic region"),
  }),
}, async (args) => {
  let result = venues;

  if (args.country) {
    result = result.filter((v) => v.country === args.country);
  }
  if (args.city) {
    result = result.filter(
      (v) => v.city.toLowerCase() === args.city!.toLowerCase()
    );
  }
  if (args.region) {
    result = result.filter((v) => v.region === args.region);
  }

  return json({
    count: result.length,
    venues: result,
  });
});

// ── Tool: get_schedule ──────────────────────────────────────────────

server.registerTool("get_schedule", {
  title: "Get Schedule",
  description:
    "Get the full FIFA World Cup 2026 tournament schedule organized by date. Optionally filter to a specific date range. Each day includes all matches with team names, venues, and kick-off times (UTC).",
  inputSchema: z.object({
    date_from: z
      .string()
      .optional()
      .describe("Start date (YYYY-MM-DD), defaults to tournament start (2026-06-11)"),
    date_to: z
      .string()
      .optional()
      .describe("End date (YYYY-MM-DD), defaults to tournament end (2026-07-19)"),
  }),
}, async (args) => {
  let filtered = matches;

  if (args.date_from) {
    filtered = filtered.filter((m) => m.date >= args.date_from!);
  }
  if (args.date_to) {
    filtered = filtered.filter((m) => m.date <= args.date_to!);
  }

  // Group matches by date
  const byDate = new Map<string, typeof filtered>();
  for (const m of filtered) {
    const existing = byDate.get(m.date) ?? [];
    existing.push(m);
    byDate.set(m.date, existing);
  }

  const schedule = Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayMatches]) => ({
      date,
      match_count: dayMatches.length,
      matches: dayMatches
        .sort((a, b) => a.time_utc.localeCompare(b.time_utc))
        .map(enrichMatch),
    }));

  return json({
    total_days: schedule.length,
    total_matches: filtered.length,
    schedule,
  });
});

// ── Start server ────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
