// Core types for WC26 MCP Server

export interface VenueWeather {
  june_avg_high_f: number;
  june_avg_low_f: number;
  july_avg_high_f: number;
  july_avg_low_f: number;
  description: string; // e.g. "Hot and humid with afternoon thunderstorms"
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  state_province: string;
  country: "USA" | "Mexico" | "Canada";
  capacity: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  timezone: string;
  region: "Western" | "Central" | "Eastern";
  image_url?: string;
  notable: string[];
  weather: VenueWeather;
}

export interface Team {
  id: string;
  name: string;
  code: string; // FIFA 3-letter code
  group: string; // A through L
  confederation: "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "AFC" | "OFC";
  fifa_ranking?: number;
  flag_emoji: string;
  is_host: boolean;
}

export interface Group {
  id: string; // "A" through "L"
  teams: string[]; // team IDs
  venue_ids: string[]; // venues where group matches are played
}

export type MatchRound =
  | "Group Stage"
  | "Round of 32"
  | "Round of 16"
  | "Quarter-final"
  | "Semi-final"
  | "Third-place play-off"
  | "Final";

export type MatchStatus =
  | "scheduled"
  | "live"
  | "completed"
  | "postponed"
  | "cancelled";

export interface Match {
  id: string;
  match_number: number;
  date: string; // ISO date YYYY-MM-DD
  time_utc: string; // HH:MM UTC
  venue_id: string;
  group?: string; // null for knockout rounds
  round: MatchRound;
  home_team_id: string | null; // null if TBD (knockout)
  away_team_id: string | null;
  home_placeholder?: string; // e.g. "Winner Group A" for knockout
  away_placeholder?: string;
  home_score?: number;
  away_score?: number;
  status: MatchStatus;
}

// Query filter types
export interface MatchFilter {
  date?: string;
  date_from?: string;
  date_to?: string;
  team?: string;
  group?: string;
  venue?: string;
  round?: MatchRound;
  status?: MatchStatus;
}

export interface TeamFilter {
  group?: string;
  confederation?: string;
  is_host?: boolean;
}

export interface VenueFilter {
  country?: string;
  city?: string;
  region?: string;
}

export interface KeyPlayer {
  name: string;
  position: string; // "GK", "DEF", "MID", "FWD"
  club: string;
}

export interface WorldCupHistory {
  appearances: number;
  best_result: string; // e.g. "Champions (2022)", "Quarter-finals (2018)"
  titles: number;
}

export interface TeamProfile {
  team_id: string; // matches Team.id
  coach: string;
  playing_style: string; // 1-2 sentence description
  key_players: KeyPlayer[];
  world_cup_history: WorldCupHistory;
  qualifying_summary: string; // 1-2 sentence narrative
}

export interface CityGuide {
  venue_id: string; // matches Venue.id -- one guide per venue
  metro_area: string; // display name, e.g. "New York City" for East Rutherford
  highlights: string; // 2-3 sentence city overview
  getting_there: string; // airport(s) + transit to stadium
  food_and_drink: string[]; // 3-4 local food recommendations
  things_to_do: string[]; // 3-4 attractions/activities
  local_tips: string[]; // 2-3 practical tips
}
