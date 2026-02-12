#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { matches } from "./data/matches.js";
import { teams } from "./data/teams.js";
import { groups } from "./data/groups.js";
import { venues } from "./data/venues.js";
import { teamProfiles } from "./data/team-profiles.js";
import { cityGuides } from "./data/city-guides.js";
import { historicalMatchups } from "./data/historical-matchups.js";
import { visaInfo } from "./data/visa-info.js";
import { fanZones } from "./data/fan-zones.js";
import { news } from "./data/news.js";
import { injuries } from "./data/injuries.js";
import { tournamentOdds } from "./data/odds.js";

import type {
  Match,
  Team,
  Group,
  Venue,
  MatchRound,
  MatchStatus,
  TeamProfile,
  CityGuide,
  HistoricalMatchup,
  TeamVisaInfo,
  FanZone,
  NewsItem,
  NewsCategory,
  InjuryReport,
  InjuryStatus,
  TournamentOdds,
} from "./types/index.js";

// ── Server setup ────────────────────────────────────────────────────

const server = new McpServer({
  name: "wc26-mcp",
  version: "0.3.0",
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

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): { miles: number; km: number } {
  const R = 6371; // Earth radius in km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return { miles: Math.round(km * 0.621371), km: Math.round(km) };
}

function convertTime(date: string, timeUtc: string, timezone: string): { date: string; time: string; error?: string } {
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

function resolveTeam(input: string): Team | undefined {
  const tid = input.toLowerCase();
  return teams.find(
    t => t.id === tid || t.code.toLowerCase() === tid || t.name.toLowerCase() === tid
  );
}

function enrichMatch(m: Match, timezone?: string) {
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

function enrichGroup(g: Group) {
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
  annotations: { readOnlyHint: true },
  title: "Get Matches",
  description:
    "Query FIFA World Cup 2026 matches. Filter by date, date range, team, group, venue, round, or status. Returns enriched match data with team names, venue details, and local venue time. Optionally pass a timezone to convert match times to any IANA timezone.",
  inputSchema: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format")
      .optional()
      .describe("Exact date in YYYY-MM-DD format"),
    date_from: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format")
      .optional()
      .describe("Start of date range (YYYY-MM-DD), inclusive"),
    date_to: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format")
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
    timezone: z
      .string()
      .optional()
      .describe("IANA timezone (e.g. 'America/New_York', 'Europe/London') to convert match times to"),
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
    const team = resolveTeam(args.team);
    if (!team) {
      return json({
        error: `Team '${args.team}' not found.`,
        suggestion: "Use the get_teams tool to see all available teams and their IDs.",
      });
    }
    result = result.filter(
      (m) => m.home_team_id === team.id || m.away_team_id === team.id
    );
  }
  if (args.group) {
    const groupLetter = args.group.toUpperCase();
    const validGroups = [...new Set(matches.map((m) => m.group).filter(Boolean))];
    if (!validGroups.includes(groupLetter)) {
      return json({
        error: `Group '${args.group}' not found.`,
        suggestion: `Valid groups: ${validGroups.sort().join(", ")}. Use the get_groups tool for full group details.`,
      });
    }
    result = result.filter(
      (m) => m.group?.toUpperCase() === groupLetter
    );
  }
  if (args.venue) {
    const venueExists = venues.some((v) => v.id === args.venue);
    if (!venueExists) {
      return json({
        error: `Venue '${args.venue}' not found.`,
        suggestion: "Use the get_venues tool to see all available venues and their IDs.",
      });
    }
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
    matches: result.map((m) => enrichMatch(m, args.timezone)),
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
  annotations: { readOnlyHint: true },
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
  annotations: { readOnlyHint: true },
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
  annotations: { readOnlyHint: true },
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
      (v) => v.city.toLowerCase().includes(args.city!.toLowerCase())
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
  annotations: { readOnlyHint: true },
  title: "Get Schedule",
  description:
    "Get the full FIFA World Cup 2026 tournament schedule organized by date. Optionally filter to a specific date range. Each day includes all matches with team names, venues, kick-off times (UTC), and local venue time. Optionally pass a timezone to convert all match times.",
  inputSchema: z.object({
    date_from: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format")
      .optional()
      .describe("Start date (YYYY-MM-DD), defaults to tournament start (2026-06-11)"),
    date_to: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format")
      .optional()
      .describe("End date (YYYY-MM-DD), defaults to tournament end (2026-07-19)"),
    timezone: z
      .string()
      .optional()
      .describe("IANA timezone (e.g. 'America/New_York', 'Europe/London') to convert match times to"),
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
        .map((m) => enrichMatch(m, args.timezone)),
    }));

  return json({
    total_days: schedule.length,
    total_matches: filtered.length,
    schedule,
  });
});

// ── Tool: get_team_profile ───────────────────────────────────────────

server.registerTool("get_team_profile", {
  annotations: { readOnlyHint: true },
  title: "Get Team Profile",
  description:
    "Get a detailed profile for any FIFA World Cup 2026 team. Returns coach, playing style, key players with clubs, World Cup history, and qualifying summary. Use team ID or FIFA code (e.g. 'usa', 'BRA', 'arg').",
  inputSchema: z.object({
    team: z
      .string()
      .describe("Team ID or FIFA code (e.g. 'usa', 'BRA', 'arg'). Case-insensitive."),
  }),
}, async (args) => {
  const team = resolveTeam(args.team);

  if (!team) {
    return json({
      error: `Team '${args.team}' not found.`,
      suggestion: "Use the get_teams tool to see all available teams and their IDs.",
    });
  }

  const profile = teamProfiles.find((p) => p.team_id === team.id);

  return json({
    ...team,
    ...(profile
      ? {
          coach: profile.coach,
          playing_style: profile.playing_style,
          key_players: profile.key_players,
          world_cup_history: profile.world_cup_history,
          qualifying_summary: profile.qualifying_summary,
        }
      : {
          coach: "Unknown",
          playing_style: "No profile data available.",
          key_players: [],
          world_cup_history: null,
          qualifying_summary: "No qualifying data available.",
        }),
    injury_report: injuries
      .filter((i) => i.team_id === team.id)
      .map((i) => ({
        player: i.player,
        position: i.position,
        injury: i.injury,
        status: i.status,
        expected_return: i.expected_return,
        last_updated: i.last_updated,
      })),
    tournament_odds: (() => {
      const winnerOdds = tournamentOdds.tournament_winner.find((o) => o.team_id === team.id);
      const groupPred = tournamentOdds.group_predictions.find((g) => g.group === team.group);
      const darkHorse = tournamentOdds.dark_horses.find((d) => d.team_id === team.id);
      return {
        ...(winnerOdds ? { winner_odds: winnerOdds.odds, implied_probability: winnerOdds.implied_probability } : {}),
        ...(groupPred ? {
          group_prediction: {
            favorites: groupPred.favorites.map((f) => teamName(f)),
            dark_horse: teamName(groupPred.dark_horse),
            narrative: groupPred.narrative,
          },
        } : {}),
        ...(darkHorse ? { dark_horse_pick: darkHorse.reason } : {}),
      };
    })(),
    recent_news: news
      .filter((n) => {
        if (n.related_teams.includes(team.id)) return true;
        // Fallback: text match on team name in title/summary
        const text = `${n.title} ${n.summary}`.toLowerCase();
        return text.includes(team.name.toLowerCase()) ||
          (team.code !== "TBD" && text.includes(team.code.toLowerCase()));
      })
      .slice(0, 5)
      .map((n) => ({ title: n.title, date: n.date, source: n.source, summary: n.summary, url: n.url })),
    related_tools: [
      "Use get_matches with team filter to see this team's match schedule",
      "Use get_groups to see this team's group rivals and venue assignments",
      "Use get_visa_info to check entry requirements for this team's fans traveling to host countries",
      "Use get_injuries for full injury details across all teams",
      "Use get_odds for complete tournament predictions",
      "Use get_news to see all World Cup headlines",
    ],
  });
});

// ── Tool: get_nearby_venues ──────────────────────────────────────────

server.registerTool("get_nearby_venues", {
  annotations: { readOnlyHint: true },
  title: "Get Nearby Venues",
  description:
    "Find venues near a given World Cup venue, sorted by distance. Useful for planning multi-match trips. Returns distance in miles and kilometers between all venue pairs.",
  inputSchema: z.object({
    venue: z
      .string()
      .describe("Venue ID (e.g. 'metlife', 'azteca', 'sofi'). Use get_venues to see all IDs."),
    limit: z
      .number()
      .optional()
      .describe("Max number of nearby venues to return. Defaults to all 15."),
  }),
}, async (args) => {
  const origin = venues.find((v) => v.id === args.venue.toLowerCase());

  if (!origin) {
    return json({
      error: `Venue '${args.venue}' not found.`,
      suggestion: "Use the get_venues tool to see all available venues and their IDs.",
    });
  }

  const nearby = venues
    .filter((v) => v.id !== origin.id)
    .map((v) => {
      const dist = haversineDistance(
        origin.coordinates.lat, origin.coordinates.lng,
        v.coordinates.lat, v.coordinates.lng
      );
      return {
        id: v.id,
        name: v.name,
        city: v.city,
        country: v.country,
        distance_miles: dist.miles,
        distance_km: dist.km,
      };
    })
    .sort((a, b) => a.distance_miles - b.distance_miles);

  const limited = args.limit ? nearby.slice(0, args.limit) : nearby;

  return json({
    origin: {
      id: origin.id,
      name: origin.name,
      city: origin.city,
      country: origin.country,
    },
    nearby_venues: limited,
    related_tools: [
      "Use get_venues to see full venue details including weather and capacity",
      "Use get_matches with venue filter to see matches at a specific venue",
    ],
  });
});

// ── Tool: get_city_guide ────────────────────────────────────────────

server.registerTool("get_city_guide", {
  annotations: { readOnlyHint: true },
  title: "Get City Guide",
  description:
    "Get a travel guide for any FIFA World Cup 2026 host city. Returns highlights, getting there, food & drink recommendations, things to do, and local tips. Accepts venue ID (e.g. 'metlife'), city name (e.g. 'Miami'), or metro area name (e.g. 'New York'). Case-insensitive.",
  inputSchema: z.object({
    city: z
      .string()
      .describe("Venue ID (e.g. 'metlife'), city name (e.g. 'Miami Gardens'), or metro area (e.g. 'New York'). Case-insensitive."),
  }),
}, async (args) => {
  const query = args.city.toLowerCase();

  // Find matching venue + guide by venue ID, city name, or metro area
  let venue: Venue | undefined;
  let guide: CityGuide | undefined;

  // Try venue ID first
  venue = venues.find((v) => v.id === query);
  if (venue) {
    guide = cityGuides.find((g) => g.venue_id === venue!.id);
  }

  // Try city name
  if (!venue) {
    venue = venues.find((v) => v.city.toLowerCase().includes(query));
    if (venue) {
      guide = cityGuides.find((g) => g.venue_id === venue!.id);
    }
  }

  // Try metro area
  if (!guide) {
    guide = cityGuides.find((g) => g.metro_area.toLowerCase() === query);
    if (guide) {
      venue = venues.find((v) => v.id === guide!.venue_id);
    }
  }

  // Try partial match on metro area (e.g. "new york" matches "New York City")
  if (!guide) {
    guide = cityGuides.find((g) => g.metro_area.toLowerCase().includes(query));
    if (guide) {
      venue = venues.find((v) => v.id === guide!.venue_id);
    }
  }

  // Try partial match on city name
  if (!guide && !venue) {
    venue = venues.find((v) => v.city.toLowerCase().includes(query));
    if (venue) {
      guide = cityGuides.find((g) => g.venue_id === venue!.id);
    }
  }

  if (!venue || !guide) {
    return json({
      error: `City '${args.city}' not found.`,
      suggestion: "Use the get_venues tool to see all available host cities and venue IDs.",
    });
  }

  return json({
    venue: {
      id: venue.id,
      name: venue.name,
      city: venue.city,
      state_province: venue.state_province,
      country: venue.country,
      capacity: venue.capacity,
      timezone: venue.timezone,
      weather: venue.weather,
    },
    metro_area: guide.metro_area,
    highlights: guide.highlights,
    getting_there: guide.getting_there,
    food_and_drink: guide.food_and_drink,
    things_to_do: guide.things_to_do,
    local_tips: guide.local_tips,
    related_tools: [
      "Use get_matches with venue filter to see matches at this venue",
      "Use get_nearby_venues to find other stadiums near this city",
      "Use get_visa_info to check entry requirements for fans traveling to this country",
      "Use get_fan_zones to find fan festival locations in this city",
    ],
  });
});

// ── Tool: get_historical_matchups ────────────────────────────────────

server.registerTool("get_historical_matchups", {
  annotations: { readOnlyHint: true },
  title: "Get Historical Matchups",
  description:
    "Head-to-head World Cup history between any two teams. Returns all tournament meetings, aggregate stats, and a narrative summary. Accepts team ID or FIFA code (e.g. 'bra', 'ARG', 'england'). Also checks for a scheduled 2026 match between the pair.",
  inputSchema: z.object({
    team_a: z
      .string()
      .describe("First team — ID or FIFA code (e.g. 'bra', 'ARG', 'england'). Case-insensitive."),
    team_b: z
      .string()
      .describe("Second team — ID or FIFA code (e.g. 'eng', 'FRA', 'germany'). Case-insensitive."),
  }),
}, async (args) => {
  const teamA = resolveTeam(args.team_a);
  const teamB = resolveTeam(args.team_b);

  if (!teamA) {
    return json({
      error: `Team '${args.team_a}' not found.`,
      suggestion: "Use the get_teams tool to see all available teams and their IDs.",
    });
  }
  if (!teamB) {
    return json({
      error: `Team '${args.team_b}' not found.`,
      suggestion: "Use the get_teams tool to see all available teams and their IDs.",
    });
  }
  if (teamA.id === teamB.id) {
    return json({
      error: "Both inputs resolve to the same team. Please provide two different teams.",
    });
  }

  // TBD team check
  if (teamA.code === "TBD") {
    return json({
      note: `${teamA.name} has not been determined yet. Historical matchup data will be available once the playoff is decided.`,
      team_b: { id: teamB.id, name: teamB.name, flag_emoji: teamB.flag_emoji },
      related_tools: [
        "Use what_to_know_now to check the latest tournament status including pending playoffs",
        "Use get_team_profile to learn more about the confirmed team",
      ],
    });
  }
  if (teamB.code === "TBD") {
    return json({
      note: `${teamB.name} has not been determined yet. Historical matchup data will be available once the playoff is decided.`,
      team_a: { id: teamA.id, name: teamA.name, flag_emoji: teamA.flag_emoji },
      related_tools: [
        "Use what_to_know_now to check the latest tournament status including pending playoffs",
        "Use get_team_profile to learn more about the confirmed team",
      ],
    });
  }

  // Sort alphabetically for canonical lookup
  const [first, second] = [teamA, teamB].sort((a, b) => a.id.localeCompare(b.id));
  const record = historicalMatchups.find(
    (h) => h.team_a === first.id && h.team_b === second.id
  );

  // Check for a 2026 match between these teams
  const upcoming2026 = matches.find(
    (m) =>
      (m.home_team_id === teamA.id && m.away_team_id === teamB.id) ||
      (m.home_team_id === teamB.id && m.away_team_id === teamA.id)
  );
  const matchContext = upcoming2026
    ? {
        upcoming_2026_match: {
          date: upcoming2026.date,
          time_utc: upcoming2026.time_utc,
          round: upcoming2026.round,
          venue: venueName(upcoming2026.venue_id),
          group: upcoming2026.group ?? undefined,
        },
      }
    : {};

  // No history found
  if (!record) {
    const profileA = teamProfiles.find((p) => p.team_id === first.id);
    const profileB = teamProfiles.find((p) => p.team_id === second.id);
    const firstTimerNote = (id: string, profile?: typeof profileA) => {
      if (profile && profile.world_cup_history.appearances <= 1) {
        const t = teams.find((t) => t.id === id);
        return `${t?.name ?? id} is making their World Cup debut in 2026.`;
      }
      return null;
    };

    return json({
      team_a: { id: first.id, name: first.name, flag_emoji: first.flag_emoji },
      team_b: { id: second.id, name: second.name, flag_emoji: second.flag_emoji },
      total_matches: 0,
      summary: `${first.name} and ${second.name} have never met at a FIFA World Cup.`,
      first_timer_notes: [firstTimerNote(first.id, profileA), firstTimerNote(second.id, profileB)].filter(Boolean),
      ...matchContext,
      related_tools: [
        "Use get_team_profile to learn about each team's World Cup history",
        "Use get_matches with team filter to see their 2026 schedules",
      ],
    });
  }

  // Return full matchup data
  return json({
    team_a: { id: first.id, name: first.name, flag_emoji: first.flag_emoji },
    team_b: { id: second.id, name: second.name, flag_emoji: second.flag_emoji },
    total_matches: record.total_matches,
    team_a_wins: record.team_a_wins,
    draws: record.draws,
    team_b_wins: record.team_b_wins,
    total_goals_team_a: record.total_goals_team_a,
    total_goals_team_b: record.total_goals_team_b,
    summary: record.summary,
    meetings: record.meetings,
    ...matchContext,
    related_tools: [
      "Use get_team_profile to learn more about either team",
      "Use get_matches with team filter to see their 2026 schedules",
    ],
  });
});

// ── Tool: what_to_know_now ──────────────────────────────────────────

const TOURNAMENT_DATES = {
  playoff_end: "2026-03-31",
  tournament_start: "2026-06-11",
  group_stage_end: "2026-06-28",
  final: "2026-07-19",
};

type TournamentPhase = "pre_playoff" | "post_playoff" | "group_stage" | "knockout" | "tournament_over";

function getPhase(dateStr: string): TournamentPhase {
  if (dateStr < TOURNAMENT_DATES.playoff_end) return "pre_playoff";
  if (dateStr < TOURNAMENT_DATES.tournament_start) return "post_playoff";
  if (dateStr <= TOURNAMENT_DATES.group_stage_end) return "group_stage";
  if (dateStr <= TOURNAMENT_DATES.final) return "knockout";
  return "tournament_over";
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86400000;
  return Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

const PHASE_LABELS: Record<TournamentPhase, string> = {
  pre_playoff: "Pre-Tournament (Playoffs Pending)",
  post_playoff: "Pre-Tournament (All Teams Confirmed)",
  group_stage: "Group Stage",
  knockout: "Knockout Stage",
  tournament_over: "Tournament Complete",
};

server.registerTool("what_to_know_now", {
  annotations: { readOnlyHint: true },
  title: "What to Know Now",
  description:
    "Zero-query temporal briefing for the FIFA World Cup 2026. No parameters needed — just brief me. Automatically detects the current tournament phase and returns the most relevant information for today. Optionally pass a date to simulate a different day, or a timezone for local times.",
  inputSchema: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format")
      .optional()
      .describe("Override date in YYYY-MM-DD format (for testing different phases). Defaults to today."),
    timezone: z
      .string()
      .optional()
      .describe("IANA timezone (e.g. 'America/New_York') for local match times."),
  }),
}, async (args) => {
  const today = args.date ?? new Date().toISOString().slice(0, 10);
  const phase = getPhase(today);
  const daysUntilKickoff = daysBetween(today, TOURNAMENT_DATES.tournament_start);
  const sections: Record<string, unknown>[] = [];
  let headline = "";

  if (phase === "pre_playoff") {
    const tbdTeams = teams.filter((t) => t.code === "TBD");
    headline = `${daysUntilKickoff} days until the FIFA World Cup 2026 kicks off. ${tbdTeams.length} playoff spots still to be decided.`;

    sections.push({
      title: "Countdown",
      content: `${daysUntilKickoff} days until the opening match: ${teamName(matches[0].home_team_id)} vs ${teamName(matches[0].away_team_id)} at ${venueName(matches[0].venue_id)} on ${TOURNAMENT_DATES.tournament_start}.`,
    });

    sections.push({
      title: "Pending Playoff Slots",
      content: `${tbdTeams.length} teams still to be determined:`,
      teams: tbdTeams.map((t) => ({ id: t.id, name: t.name, group: t.group })),
    });

    const hosts = teams.filter((t) => t.is_host);
    sections.push({
      title: "Host Nations",
      content: hosts.map((h) => `${h.flag_emoji} ${h.name} (Group ${h.group})`),
    });

    sections.push({
      title: "Groups at a Glance",
      content: groups.map((g) => ({
        group: g.id,
        teams: g.teams.map((tid) => {
          const t = teams.find((t) => t.id === tid);
          return t ? `${t.flag_emoji} ${t.name}` : tid;
        }),
      })),
    });

    sections.push({
      title: "Venue Summary",
      content: `${venues.length} venues across 3 countries: ${venues.filter((v) => v.country === "USA").length} in USA, ${venues.filter((v) => v.country === "Mexico").length} in Mexico, ${venues.filter((v) => v.country === "Canada").length} in Canada.`,
    });

    sections.push({
      title: "Fan Zones",
      content: `${fanZones.length} official FIFA Fan Festival and fan zone locations across all host cities. Free entry at most sites with live screenings, concerts, food, and interactive experiences.`,
    });

    // Key injuries
    const activeInjuries = injuries.filter((i) => i.status !== "fit");
    if (activeInjuries.length > 0) {
      sections.push({
        title: "Key Injuries to Watch",
        content: activeInjuries.map((i) => ({
          player: i.player,
          team: teamName(i.team_id),
          status: i.status,
          injury: i.injury,
          expected_return: i.expected_return,
        })),
      });
    }

    // Tournament favorites
    sections.push({
      title: "Tournament Favorites",
      content: tournamentOdds.tournament_winner.slice(0, 8).map((o) => ({
        team: teamName(o.team_id),
        odds: o.odds,
        implied_probability: o.implied_probability,
      })),
      dark_horses: tournamentOdds.dark_horses.map((d) => ({
        team: teamName(d.team_id),
        reason: d.reason,
      })),
    });
  } else if (phase === "post_playoff") {
    headline = `${daysUntilKickoff} days until the FIFA World Cup 2026 kicks off. All 48 teams are confirmed.`;

    sections.push({
      title: "Countdown",
      content: `${daysUntilKickoff} days until the opening match at ${venueName(matches[0].venue_id)} on ${TOURNAMENT_DATES.tournament_start}.`,
    });

    sections.push({
      title: "All Groups",
      content: groups.map((g) => ({
        group: g.id,
        teams: g.teams.map((tid) => {
          const t = teams.find((t) => t.id === tid);
          return t
            ? { name: `${t.flag_emoji} ${t.name}`, fifa_ranking: t.fifa_ranking }
            : { name: tid, fifa_ranking: null };
        }),
      })),
    });

    // Marquee matchups: top-15 ranked teams facing each other in group stage
    const groupMatches = matches.filter((m) => m.round === "Group Stage");
    const marquee = groupMatches
      .filter((m) => {
        const home = teams.find((t) => t.id === m.home_team_id);
        const away = teams.find((t) => t.id === m.away_team_id);
        return home?.fifa_ranking && away?.fifa_ranking &&
          home.fifa_ranking <= 15 && away.fifa_ranking <= 15;
      })
      .slice(0, 8)
      .map((m) => ({
        match: `${teamName(m.home_team_id)} vs ${teamName(m.away_team_id)}`,
        date: m.date,
        venue: venueName(m.venue_id),
      }));

    if (marquee.length > 0) {
      sections.push({
        title: "Marquee Group Stage Matchups",
        content: marquee,
      });
    }

    sections.push({
      title: "Fan Zones",
      content: `${fanZones.length} official FIFA Fan Festival and fan zone locations across all host cities. Free entry at most sites with live screenings, concerts, food, and interactive experiences.`,
    });

    // Key injuries
    const activeInjuriesPost = injuries.filter((i) => i.status !== "fit");
    if (activeInjuriesPost.length > 0) {
      sections.push({
        title: "Key Injuries to Watch",
        content: activeInjuriesPost.map((i) => ({
          player: i.player,
          team: teamName(i.team_id),
          status: i.status,
          injury: i.injury,
          expected_return: i.expected_return,
        })),
      });
    }

    // Tournament favorites
    sections.push({
      title: "Tournament Favorites",
      content: tournamentOdds.tournament_winner.slice(0, 8).map((o) => ({
        team: teamName(o.team_id),
        odds: o.odds,
        implied_probability: o.implied_probability,
      })),
      dark_horses: tournamentOdds.dark_horses.map((d) => ({
        team: teamName(d.team_id),
        reason: d.reason,
      })),
    });
  } else if (phase === "group_stage") {
    const todayMatches = matches.filter((m) => m.date === today);
    const yesterdayDate = new Date(new Date(today).getTime() - 86400000).toISOString().slice(0, 10);
    const tomorrowDate = new Date(new Date(today).getTime() + 86400000).toISOString().slice(0, 10);
    const yesterdayMatches = matches.filter((m) => m.date === yesterdayDate);
    const tomorrowMatches = matches.filter((m) => m.date === tomorrowDate);

    const totalGroupMatches = matches.filter((m) => m.round === "Group Stage").length;
    const playedGroupMatches = matches.filter((m) => m.round === "Group Stage" && m.date < today).length;

    headline = todayMatches.length > 0
      ? `${todayMatches.length} match${todayMatches.length !== 1 ? "es" : ""} today. Group stage: ${playedGroupMatches}/${totalGroupMatches} matches played.`
      : `No matches today. Group stage: ${playedGroupMatches}/${totalGroupMatches} matches played.`;

    if (todayMatches.length > 0) {
      sections.push({
        title: "Today's Matches",
        matches: todayMatches.map((m) => enrichMatch(m, args.timezone)),
      });
    }

    if (yesterdayMatches.length > 0) {
      sections.push({
        title: "Yesterday's Results",
        matches: yesterdayMatches.map((m) => enrichMatch(m, args.timezone)),
      });
    }

    if (tomorrowMatches.length > 0) {
      sections.push({
        title: "Tomorrow's Preview",
        matches: tomorrowMatches.map((m) => enrichMatch(m, args.timezone)),
      });
    }

    sections.push({
      title: "Group Stage Progress",
      content: `${playedGroupMatches} of ${totalGroupMatches} group stage matches completed. ${totalGroupMatches - playedGroupMatches} remaining.`,
    });
  } else if (phase === "knockout") {
    const todayMatches = matches.filter((m) => m.date === today);
    const yesterdayDate = new Date(new Date(today).getTime() - 86400000).toISOString().slice(0, 10);
    const yesterdayMatches = matches.filter((m) => m.date === yesterdayDate);

    // Detect current round
    const knockoutMatches = matches.filter(
      (m) => m.round !== "Group Stage" && m.date >= today
    );
    const currentRound = knockoutMatches.length > 0 ? knockoutMatches[0].round : "Final";

    const finalMatch = matches.find((m) => m.round === "Final");

    headline = todayMatches.length > 0
      ? `${todayMatches.length} knockout match${todayMatches.length !== 1 ? "es" : ""} today. Current round: ${currentRound}.`
      : `No matches today. Current round: ${currentRound}.`;

    if (todayMatches.length > 0) {
      sections.push({
        title: "Today's Matches",
        matches: todayMatches.map((m) => enrichMatch(m, args.timezone)),
      });
    }

    if (yesterdayMatches.length > 0) {
      sections.push({
        title: "Yesterday's Results",
        matches: yesterdayMatches.map((m) => enrichMatch(m, args.timezone)),
      });
    }

    // Next upcoming matches (up to 4)
    const upcoming = matches
      .filter((m) => m.date > today && m.round !== "Group Stage")
      .slice(0, 4);
    if (upcoming.length > 0) {
      sections.push({
        title: "Next Upcoming Matches",
        matches: upcoming.map((m) => enrichMatch(m, args.timezone)),
      });
    }

    if (finalMatch) {
      sections.push({
        title: "Final",
        content: `The final will be played on ${finalMatch.date} at ${venueName(finalMatch.venue_id)}.`,
      });
    }
  } else {
    // tournament_over
    const finalMatch = matches.find((m) => m.round === "Final");
    const thirdPlace = matches.find((m) => m.round === "Third-place play-off");

    headline = "The FIFA World Cup 2026 has concluded.";

    if (finalMatch) {
      sections.push({
        title: "Final Result",
        match: enrichMatch(finalMatch, args.timezone),
      });
    }
    if (thirdPlace) {
      sections.push({
        title: "Third-Place Result",
        match: enrichMatch(thirdPlace, args.timezone),
      });
    }
  }

  // Latest news (up to 5 most recent)
  const recentNews = news
    .filter((n) => n.date >= new Date(new Date(today).getTime() - 7 * 86400000).toISOString().slice(0, 10))
    .slice(0, 5);
  if (recentNews.length > 0) {
    sections.push({
      title: "Latest News",
      articles: recentNews.map((n) => ({
        title: n.title,
        date: n.date,
        source: n.source,
        summary: n.summary,
      })),
    });
  }

  const available_tools = [];
  if (phase === "pre_playoff" || phase === "post_playoff") {
    available_tools.push(
      "Use get_team_profile to research any team in depth",
      "Use get_groups to explore group compositions and match schedules",
      "Use get_venues to explore stadiums and host cities",
      "Use get_schedule to see the full tournament calendar",
      "Use get_visa_info to check entry requirements for any team's fans",
      "Use get_fan_zones to find fan festival locations in any host city",
      "Use get_news for more World Cup headlines",
      "Use get_injuries to check key player availability",
      "Use get_odds for tournament predictions and group previews",
    );
  } else if (phase === "group_stage") {
    available_tools.push(
      "Use get_team_profile to research teams playing today",
      "Use get_matches to filter matches by team, group, or date",
      "Use get_groups to see full group standings and remaining fixtures",
      "Use get_fan_zones to find fan festival locations near today's matches",
      "Use get_news for more World Cup headlines",
      "Use get_injuries to check key player availability",
      "Use get_odds for tournament predictions and group previews",
    );
  } else if (phase === "knockout") {
    available_tools.push(
      "Use get_team_profile to research teams still in the tournament",
      "Use get_matches with round filter to see knockout bracket",
      "Use get_schedule to see remaining match dates",
      "Use get_fan_zones to find fan festival locations near today's matches",
      "Use get_news for more World Cup headlines",
      "Use get_injuries to check key player availability",
    );
  } else {
    available_tools.push(
      "Use get_matches to review any match from the tournament",
      "Use get_team_profile to look up team details",
    );
  }

  return json({
    phase,
    phase_label: PHASE_LABELS[phase],
    as_of: today,
    ...(phase !== "tournament_over" ? { days_until_kickoff: Math.max(0, daysUntilKickoff) } : {}),
    headline,
    sections,
    available_tools,
  });
});

// ── Tool: get_visa_info ──────────────────────────────────────────────

server.registerTool("get_visa_info", {
  annotations: { readOnlyHint: true },
  title: "Get Visa Info",
  description:
    "Entry requirements for FIFA World Cup 2026 travelers. Returns visa/ESTA/eTA requirements for any team's nationals entering the three host countries (USA, Mexico, Canada). Accepts team ID, FIFA code, or country name. Optionally filter to a specific host country.",
  inputSchema: z.object({
    team: z
      .string()
      .describe("Team ID, FIFA code, or country name (e.g. 'bra', 'ARG', 'england'). Case-insensitive."),
    host_country: z
      .enum(["USA", "Mexico", "Canada"])
      .optional()
      .describe("Filter to a specific host country. Omit for all three."),
  }),
}, async (args) => {
  const team = resolveTeam(args.team);

  if (!team) {
    return json({
      error: `Team '${args.team}' not found.`,
      suggestion: "Use the get_teams tool to see all available teams and their IDs.",
    });
  }

  const info = visaInfo.find((v) => v.team_id === team.id);

  if (!info) {
    return json({
      error: `No visa data available for ${team.name}.`,
      team: { id: team.id, name: team.name, flag_emoji: team.flag_emoji },
    });
  }

  const requirements = args.host_country
    ? info.entry_requirements.filter((r) => r.country === args.host_country)
    : info.entry_requirements;

  return json({
    team: {
      id: team.id,
      name: team.name,
      flag_emoji: team.flag_emoji,
      group: team.group,
    },
    nationality: info.nationality,
    passport_country: info.passport_country,
    entry_requirements: requirements,
    related_tools: [
      "Use get_city_guide for travel tips in each host city",
      "Use get_matches with team filter to see where this team plays",
      "Use get_venues to check which countries host their matches",
    ],
  });
});

// ── Tool: get_fan_zones ─────────────────────────────────────────────

server.registerTool("get_fan_zones", {
  annotations: { readOnlyHint: true },
  title: "Get Fan Zones",
  description:
    "Official FIFA Fan Festival and fan zone locations for World Cup 2026 host cities. Returns venue details, capacity, hours, activities, transportation tips, and amenities. Filter by city, country, or match venue.",
  inputSchema: z.object({
    city: z
      .string()
      .optional()
      .describe("Filter by city name (e.g. 'Dallas', 'Mexico City', 'Toronto'). Case-insensitive."),
    country: z
      .enum(["USA", "Mexico", "Canada"])
      .optional()
      .describe("Filter by host country."),
    venue_id: z
      .string()
      .optional()
      .describe("Filter by match venue ID (e.g. 'metlife', 'azteca'). Returns fan zones associated with that stadium's city."),
  }),
}, async (args) => {
  let results = fanZones;

  if (args.venue_id) {
    results = results.filter((fz) => fz.venue_id === args.venue_id);
  }

  if (args.country) {
    results = results.filter((fz) => fz.country === args.country);
  }

  if (args.city) {
    const city = args.city.toLowerCase();
    const cityMatches = results.filter((fz) => fz.city.toLowerCase().includes(city));
    if (cityMatches.length > 0) {
      // Also include sibling zones sharing the same venue_id (e.g. NYNJ metro has 3 zones)
      const venueIds = new Set(cityMatches.map((fz) => fz.venue_id));
      results = results.filter((fz) => venueIds.has(fz.venue_id));
    } else {
      // Try matching via venue name/city for alternate names
      const matchingVenue = venues.find((v) =>
        v.city.toLowerCase().includes(city) || v.name.toLowerCase().includes(city)
      );
      results = matchingVenue
        ? results.filter((fz) => fz.venue_id === matchingVenue.id)
        : [];
    }
  }

  if (results.length === 0) {
    return json({
      error: "No fan zones found matching your criteria.",
      suggestion: "Try get_fan_zones without filters to see all 18 fan zones, or use get_venues to find valid venue IDs.",
      available_countries: ["USA", "Mexico", "Canada"],
    });
  }

  return json({
    count: results.length,
    fan_zones: results.map((fz) => ({
      id: fz.id,
      name: fz.name,
      city: fz.city,
      country: fz.country,
      location: fz.location,
      address: fz.address,
      coordinates: fz.coordinates,
      capacity: fz.capacity,
      free_entry: fz.free_entry,
      hours: fz.hours,
      activities: fz.activities,
      highlights: fz.highlights,
      transportation: fz.transportation,
      amenities: fz.amenities,
      family_friendly: fz.family_friendly,
      status: fz.status,
      match_venue: venueName(fz.venue_id),
    })),
    related_tools: [
      "Use get_city_guide for full travel info on any host city",
      "Use get_venues to see stadium details",
      "Use get_visa_info for entry requirements",
    ],
  });
});

// ── Tool: get_news ──────────────────────────────────────────────────

const newsCategories: NewsCategory[] = [
  "roster", "venue", "schedule", "injury", "analysis",
  "transfer", "qualifying", "fan-content", "logistics", "general",
];

server.registerTool("get_news", {
  annotations: { readOnlyHint: true },
  title: "Get News",
  description:
    "Latest FIFA World Cup 2026 news from ESPN, BBC Sport, and Reddit. Auto-updated daily by the WC26 Scout Agent. Filter by team, category, or both. Returns AI-generated summaries and source links.",
  inputSchema: z.object({
    team: z
      .string()
      .optional()
      .describe("Team ID or FIFA code (e.g. 'usa', 'BRA'). Filters news mentioning this team."),
    category: z
      .enum(newsCategories as [string, ...string[]])
      .optional()
      .describe("News category to filter by."),
    limit: z
      .number()
      .optional()
      .describe("Max articles to return (default 10, max 50)."),
  }),
}, async (args) => {
  if (news.length === 0) {
    return json({
      count: 0,
      articles: [],
      note: "No news articles available yet. The Scout Agent runs daily to fetch new articles.",
      related_tools: [
        "Use what_to_know_now for a tournament briefing",
        "Use get_teams to browse participating teams",
      ],
    });
  }

  let filtered: NewsItem[] = news;

  if (args.team) {
    const team = resolveTeam(args.team);
    if (!team) {
      return json({
        error: `Team '${args.team}' not found.`,
        suggestion: "Use the get_teams tool to see all available teams and their IDs.",
      });
    }
    filtered = filtered.filter((n) => n.related_teams.includes(team.id));
  }

  if (args.category) {
    filtered = filtered.filter((n) =>
      n.categories.includes(args.category as NewsCategory)
    );
  }

  const limit = Math.min(Math.max(args.limit ?? 10, 1), 50);
  const result = filtered.slice(0, limit);

  return json({
    count: result.length,
    total_available: filtered.length,
    articles: result.map((n) => ({
      id: n.id,
      title: n.title,
      date: n.date,
      source: n.source,
      url: n.url,
      summary: n.summary,
      categories: n.categories,
      related_teams: n.related_teams,
    })),
    related_tools: [
      "Use get_team_profile to learn more about a mentioned team",
      "Use get_matches to check a team's schedule",
      "Use what_to_know_now for a full tournament briefing",
    ],
  });
});

// ── Tool: get_injuries ────────────────────────────────────────────────

const injuryStatuses: InjuryStatus[] = ["out", "doubtful", "recovering", "fit"];

server.registerTool("get_injuries", {
  annotations: { readOnlyHint: true },
  title: "Get Injury Report",
  description:
    "Key player injury tracker for the FIFA World Cup 2026. Track availability of star players across all 48 teams. Filter by team or injury status (out, doubtful, recovering, fit).",
  inputSchema: z.object({
    team: z
      .string()
      .optional()
      .describe("Team ID or FIFA code (e.g. 'usa', 'BRA'). Filters to injuries for this team."),
    status: z
      .enum(injuryStatuses as [string, ...string[]])
      .optional()
      .describe("Filter by injury status: out, doubtful, recovering, or fit."),
  }),
}, async (args) => {
  let filtered: InjuryReport[] = injuries;

  if (args.team) {
    const team = resolveTeam(args.team);
    if (!team) {
      return json({
        error: `Team '${args.team}' not found.`,
        suggestion: "Use the get_teams tool to see all available teams and their IDs.",
      });
    }
    filtered = filtered.filter((i) => i.team_id === team.id);
  }

  if (args.status) {
    filtered = filtered.filter((i) => i.status === args.status);
  }

  return json({
    count: filtered.length,
    injuries: filtered.map((i) => {
      const team = teams.find((t) => t.id === i.team_id);
      return {
        player: i.player,
        team: team ? `${team.flag_emoji} ${team.name}` : i.team_id,
        team_id: i.team_id,
        position: i.position,
        injury: i.injury,
        status: i.status,
        expected_return: i.expected_return,
        last_updated: i.last_updated,
        source: i.source,
      };
    }),
    related_tools: [
      "Use get_team_profile to see a team's full squad and key players",
      "Use get_news for the latest injury headlines",
      "Use get_odds to see how injuries affect tournament predictions",
    ],
  });
});

// ── Tool: get_odds ───────────────────────────────────────────────────

server.registerTool("get_odds", {
  annotations: { readOnlyHint: true },
  title: "Get Tournament Odds",
  description:
    "FIFA World Cup 2026 betting odds and predictions. Tournament winner odds, Golden Boot favorites, group-by-group predictions, and dark horse picks. Illustrative odds aggregated from major bookmakers.",
  inputSchema: z.object({
    category: z
      .enum(["winner", "golden_boot", "groups", "dark_horses", "all"])
      .optional()
      .describe("Which odds category to return. Defaults to 'all'."),
    group: z
      .string()
      .optional()
      .describe("Specific group (A-L) for group predictions."),
  }),
}, async (args) => {
  const category = args.category ?? "all";

  const enrichTeam = (tid: string) => {
    const t = teams.find((t) => t.id === tid);
    return t ? `${t.flag_emoji} ${t.name}` : tid;
  };

  const result: Record<string, unknown> = {
    last_updated: tournamentOdds.last_updated,
    source: tournamentOdds.source,
  };

  if (category === "winner" || category === "all") {
    result.tournament_winner = tournamentOdds.tournament_winner.map((o) => ({
      team: enrichTeam(o.team_id),
      team_id: o.team_id,
      odds: o.odds,
      implied_probability: o.implied_probability,
    }));
  }

  if (category === "golden_boot" || category === "all") {
    result.golden_boot = tournamentOdds.golden_boot.map((o) => ({
      player: o.player,
      team: enrichTeam(o.team_id),
      odds: o.odds,
    }));
  }

  if (category === "groups" || category === "all") {
    let groupPreds = tournamentOdds.group_predictions;
    if (args.group) {
      groupPreds = groupPreds.filter(
        (g) => g.group.toUpperCase() === args.group!.toUpperCase()
      );
    }
    result.group_predictions = groupPreds.map((g) => ({
      group: `Group ${g.group}`,
      favorites: g.favorites.map(enrichTeam),
      dark_horse: enrichTeam(g.dark_horse),
      narrative: g.narrative,
    }));
  }

  if (category === "dark_horses" || category === "all") {
    result.dark_horses = tournamentOdds.dark_horses.map((d) => ({
      team: enrichTeam(d.team_id),
      team_id: d.team_id,
      reason: d.reason,
    }));
  }

  result.related_tools = [
    "Use get_team_profile to research any team in depth",
    "Use get_injuries to check key player availability",
    "Use get_historical_matchups to see head-to-head records",
  ];

  return json(result);
});

// ── Tool: compare_teams ─────────────────────────────────────────────

server.registerTool("compare_teams", {
  annotations: { readOnlyHint: true },
  title: "Compare Teams",
  description:
    "Side-by-side comparison of any two FIFA World Cup 2026 teams. Rankings, odds, key players, group difficulty, injury concerns, and head-to-head history — all in one view. Accepts team ID, FIFA code, or country name.",
  inputSchema: z.object({
    team_a: z
      .string()
      .describe("First team — ID, FIFA code, or name (e.g. 'bra', 'ARG', 'england'). Case-insensitive."),
    team_b: z
      .string()
      .describe("Second team — ID, FIFA code, or name (e.g. 'eng', 'FRA', 'germany'). Case-insensitive."),
  }),
}, async (args) => {
  const teamA = resolveTeam(args.team_a);
  const teamB = resolveTeam(args.team_b);

  if (!teamA) return json({ error: `Team '${args.team_a}' not found.`, suggestion: "Use get_teams to see all available teams." });
  if (!teamB) return json({ error: `Team '${args.team_b}' not found.`, suggestion: "Use get_teams to see all available teams." });
  if (teamA.id === teamB.id) return json({ error: "Both inputs resolve to the same team." });

  function buildProfile(team: typeof teamA) {
    const profile = teamProfiles.find((p) => p.team_id === team!.id);
    const teamInjuries = injuries.filter((i) => i.team_id === team!.id);
    const winnerOdds = tournamentOdds.tournament_winner.find((o) => o.team_id === team!.id);
    const darkHorse = tournamentOdds.dark_horses.find((d) => d.team_id === team!.id);
    const groupPred = tournamentOdds.group_predictions.find((g) => g.group === team!.group);
    const groupTeams = teams.filter((t) => t.group === team!.group && t.code !== "TBD");
    const avgGroupRanking = groupTeams.length > 0
      ? Math.round(groupTeams.reduce((s, t) => s + (t.fifa_ranking ?? 100), 0) / groupTeams.length)
      : null;

    return {
      team: `${team!.flag_emoji} ${team!.name}`,
      team_id: team!.id,
      group: team!.group,
      confederation: team!.confederation,
      fifa_ranking: team!.fifa_ranking ?? null,
      is_host: team!.is_host,
      coach: profile?.coach ?? "Unknown",
      playing_style: profile?.playing_style ?? null,
      key_players: profile?.key_players.slice(0, 5).map((p) => `${p.name} (${p.position}, ${p.club})`) ?? [],
      world_cup_history: profile?.world_cup_history ?? null,
      winner_odds: winnerOdds ? { odds: winnerOdds.odds, implied_probability: winnerOdds.implied_probability } : null,
      dark_horse_pick: darkHorse?.reason ?? null,
      group_difficulty: {
        avg_ranking: avgGroupRanking,
        group_prediction: groupPred ? {
          favorites: groupPred.favorites.map((f) => teamName(f)),
          dark_horse: teamName(groupPred.dark_horse),
        } : null,
      },
      injuries: teamInjuries.map((i) => ({
        player: i.player,
        status: i.status,
        injury: i.injury,
        expected_return: i.expected_return,
      })),
    };
  }

  // Head-to-head
  const [first, second] = [teamA, teamB].sort((a, b) => a.id.localeCompare(b.id));
  const h2h = historicalMatchups.find((h) => h.team_a === first.id && h.team_b === second.id);
  const upcoming = matches.find(
    (m) =>
      (m.home_team_id === teamA.id && m.away_team_id === teamB.id) ||
      (m.home_team_id === teamB.id && m.away_team_id === teamA.id)
  );

  return json({
    comparison: {
      [teamA.id]: buildProfile(teamA),
      [teamB.id]: buildProfile(teamB),
    },
    head_to_head: h2h ? {
      total_matches: h2h.total_matches,
      [`${first.name}_wins`]: h2h.team_a_wins,
      draws: h2h.draws,
      [`${second.name}_wins`]: h2h.team_b_wins,
      summary: h2h.summary,
    } : { total_matches: 0, summary: `${first.name} and ${second.name} have never met at a World Cup.` },
    upcoming_2026_match: upcoming ? {
      date: upcoming.date,
      time_utc: upcoming.time_utc,
      venue: venueName(upcoming.venue_id),
      round: upcoming.round,
    } : null,
    related_tools: [
      "Use get_team_profile for a deeper dive on either team",
      "Use get_historical_matchups for full match-by-match history",
      "Use get_injuries for complete injury details",
      "Use get_odds for full tournament predictions",
    ],
  });
});

// ── Tool: get_standings ─────────────────────────────────────────────

server.registerTool("get_standings", {
  annotations: { readOnlyHint: true },
  title: "Get Group Standings",
  description:
    "Group power rankings for the FIFA World Cup 2026. Before the tournament starts, returns pre-tournament strength ratings for each group based on FIFA rankings, betting odds, and predictions. Filter by group (A-L) or get all 12 groups at once.",
  inputSchema: z.object({
    group: z
      .string()
      .optional()
      .describe("Specific group letter (A-L). If omitted, returns all 12 groups."),
  }),
}, async (args) => {
  let targetGroups = groups;
  if (args.group) {
    const gid = args.group.toUpperCase();
    targetGroups = groups.filter((g) => g.id === gid);
    if (targetGroups.length === 0) {
      return json({
        error: `Group '${args.group}' not found. Valid groups are A through L.`,
      });
    }
  }

  const result = targetGroups.map((g) => {
    const groupTeams = g.teams
      .map((tid) => teams.find((t) => t.id === tid))
      .filter(Boolean) as Team[];

    const ranked = groupTeams.map((t) => {
      const winnerOdds = tournamentOdds.tournament_winner.find((o) => o.team_id === t.id);
      const darkHorse = tournamentOdds.dark_horses.find((d) => d.team_id === t.id);
      const profile = teamProfiles.find((p) => p.team_id === t.id);
      const teamInjuries = injuries.filter((i) => i.team_id === t.id && i.status !== "fit");

      // Power score: lower is better. Ranking contributes directly; odds boost reduces it.
      const ranking = t.fifa_ranking ?? 100;
      const oddsBoost = winnerOdds
        ? Math.max(0, 50 - parseFloat(winnerOdds.implied_probability))
        : 50;
      const powerScore = ranking + oddsBoost;

      return {
        team: `${t.flag_emoji} ${t.name}`,
        team_id: t.id,
        fifa_ranking: t.fifa_ranking ?? null,
        confederation: t.confederation,
        is_host: t.is_host,
        winner_odds: winnerOdds ? { odds: winnerOdds.odds, implied_probability: winnerOdds.implied_probability } : null,
        dark_horse_pick: darkHorse?.reason ?? null,
        world_cup_pedigree: profile?.world_cup_history
          ? `${profile.world_cup_history.appearances} appearances, ${profile.world_cup_history.titles} titles, best: ${profile.world_cup_history.best_result}`
          : null,
        key_injuries: teamInjuries.length > 0
          ? teamInjuries.map((i) => `${i.player} (${i.status})`)
          : null,
        _power_score: powerScore,
      };
    }).sort((a, b) => a._power_score - b._power_score);

    const groupPred = tournamentOdds.group_predictions.find((gp) => gp.group === g.id);
    const confirmedTeams = ranked.filter((t) => !t.team_id.startsWith("tbd"));
    const avgRanking = confirmedTeams.length > 0
      ? Math.round(confirmedTeams.reduce((s, t) => s + (t.fifa_ranking ?? 100), 0) / confirmedTeams.length)
      : null;

    // Collect head-to-head matchups within the group
    const groupH2H: Array<{ matchup: string; summary: string }> = [];
    for (let i = 0; i < groupTeams.length; i++) {
      for (let j = i + 1; j < groupTeams.length; j++) {
        const [a, b] = [groupTeams[i].id, groupTeams[j].id].sort();
        const h2h = historicalMatchups.find((h) => h.team_a === a && h.team_b === b);
        if (h2h) {
          groupH2H.push({
            matchup: `${teamName(a)} vs ${teamName(b)}`,
            summary: h2h.summary,
          });
        }
      }
    }

    return {
      group: `Group ${g.id}`,
      difficulty_rating: avgRanking,
      prediction: groupPred ? {
        favorites: groupPred.favorites.map((f) => teamName(f)),
        dark_horse: teamName(groupPred.dark_horse),
        narrative: groupPred.narrative,
      } : null,
      teams: ranked.map(({ _power_score, ...rest }) => rest),
      head_to_head_history: groupH2H.length > 0 ? groupH2H : null,
    };
  });

  return json({
    count: result.length,
    note: "Teams ranked by pre-tournament power rating (FIFA ranking + betting odds). Lower difficulty_rating = harder group.",
    groups: result,
    related_tools: [
      "Use get_team_profile for a deep dive on any team",
      "Use get_odds for full tournament predictions",
      "Use get_historical_matchups for complete head-to-head records",
      "Use get_bracket to see the knockout path from each group",
    ],
  });
});

// ── Tool: get_bracket ──────────────────────────────────────────────

server.registerTool("get_bracket", {
  annotations: { readOnlyHint: true },
  title: "Get Knockout Bracket",
  description:
    "Visualize the FIFA World Cup 2026 knockout bracket. Shows the full path from Round of 32 through the Final, including which group positions feed into each match, venues, and dates. Optionally filter by a specific round.",
  inputSchema: z.object({
    round: z
      .enum(["Round of 32", "Round of 16", "Quarter-final", "Semi-final", "Third-place play-off", "Final", "all"])
      .optional()
      .describe("Specific knockout round to show. Defaults to 'all'."),
  }),
}, async (args) => {
  const knockoutRounds: MatchRound[] = [
    "Round of 32", "Round of 16", "Quarter-final", "Semi-final",
    "Third-place play-off", "Final",
  ];

  const targetRound = args.round ?? "all";

  const knockoutMatches = matches.filter((m) =>
    knockoutRounds.includes(m.round)
  );

  function describePlaceholder(p: string | undefined): string {
    if (!p) return "TBD";
    // Winner/Loser of match
    if (p.startsWith("W")) return `Winner of Match ${p.slice(1)}`;
    if (p.startsWith("L")) return `Loser of Match ${p.slice(1)}`;
    // Group position like "1A", "2B"
    if (/^[12][A-L]$/.test(p)) {
      const pos = p[0] === "1" ? "Winner" : "Runner-up";
      return `${pos} of Group ${p[1]}`;
    }
    // Best third-place like "3C/D/E"
    if (p.startsWith("3")) {
      const groups = p.slice(1);
      return `Best 3rd from Groups ${groups}`;
    }
    return p;
  }

  const enrichedKnockout = knockoutMatches.map((m) => {
    const venue = venues.find((v) => v.id === m.venue_id);
    return {
      match_number: m.match_number,
      match_id: m.id,
      round: m.round,
      date: m.date,
      time_utc: m.time_utc,
      venue: venue ? `${venue.name}, ${venue.city}` : m.venue_id,
      home: m.home_team_id ? teamName(m.home_team_id) : describePlaceholder(m.home_placeholder),
      away: m.away_team_id ? teamName(m.away_team_id) : describePlaceholder(m.away_placeholder),
      feeds_into: (() => {
        const nextAsHome = knockoutMatches.find(
          (n) => n.home_placeholder === `W${m.match_number}`
        );
        const nextAsAway = knockoutMatches.find(
          (n) => n.away_placeholder === `W${m.match_number}`
        );
        const next = nextAsHome || nextAsAway;
        return next ? `Winner → Match ${next.match_number} (${next.round})` : null;
      })(),
    };
  });

  // Group by round
  const byRound: Record<string, typeof enrichedKnockout> = {};
  for (const m of enrichedKnockout) {
    if (!byRound[m.round]) byRound[m.round] = [];
    byRound[m.round].push(m);
  }

  // Filter if specific round requested
  let result: Record<string, unknown>;
  if (targetRound !== "all") {
    const roundKey = targetRound === "Final" ? "Final" : targetRound;
    const roundMatches = byRound[roundKey];
    if (!roundMatches) {
      return json({ error: `No matches found for '${targetRound}'.` });
    }
    result = {
      round: roundKey,
      matches: roundMatches,
    };
  } else {
    // Build bracket paths: show which group feeds where
    const bracketPaths = groups.map((g) => {
      const winnerId = `1${g.id}`;
      const runnerUpId = `2${g.id}`;

      const winnerMatch = knockoutMatches.find(
        (m) => m.home_placeholder === winnerId || m.away_placeholder === winnerId
      );
      const runnerUpMatch = knockoutMatches.find(
        (m) => m.home_placeholder === runnerUpId || m.away_placeholder === runnerUpId
      );

      return {
        group: `Group ${g.id}`,
        teams: g.teams.map((tid) => teamName(tid)),
        winner_enters: winnerMatch
          ? `Match ${winnerMatch.match_number} (${winnerMatch.round})`
          : "TBD",
        runner_up_enters: runnerUpMatch
          ? `Match ${runnerUpMatch.match_number} (${runnerUpMatch.round})`
          : "TBD",
      };
    });

    result = {
      bracket_overview: bracketPaths,
      rounds: Object.fromEntries(
        knockoutRounds.map((r) => [r, byRound[r] ?? []])
      ),
    };
  }

  return json({
    ...result,
    key_dates: {
      round_of_32: "June 29 - July 3",
      round_of_16: "July 4 - 7",
      quarter_finals: "July 9 - 11",
      semi_finals: "July 14 - 15",
      third_place: "July 18",
      final: "July 19 (MetLife Stadium, East Rutherford, NJ)",
    },
    related_tools: [
      "Use get_standings to see group power rankings",
      "Use get_matches to see the full schedule with filters",
      "Use get_venues for stadium details",
    ],
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
