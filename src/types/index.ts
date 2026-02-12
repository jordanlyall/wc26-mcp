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

export interface HistoricalMeeting {
  year: number;
  host_country: string;
  round: string;
  score: string; // team_a score first
  penalty_score?: string; // only if decided on penalties
  result: "team_a" | "team_b" | "draw";
  venue_city: string;
}

export interface VisaRequirement {
  country: "USA" | "Mexico" | "Canada";
  requirement: "visa-free" | "esta" | "eta" | "e-visa" | "visa-required";
  max_stay_days: number;
  document: string;
  note: string;
}

export interface TeamVisaInfo {
  team_id: string;
  nationality: string;
  passport_country: string;
  entry_requirements: VisaRequirement[];
}

export interface HistoricalMatchup {
  team_a: string; // team ID, alphabetically first
  team_b: string; // team ID, alphabetically second
  total_matches: number;
  team_a_wins: number;
  draws: number;
  team_b_wins: number;
  total_goals_team_a: number;
  total_goals_team_b: number;
  summary: string;
  meetings: HistoricalMeeting[];
}

export type NewsCategory =
  | "roster" | "venue" | "schedule" | "injury" | "analysis"
  | "transfer" | "qualifying" | "fan-content" | "logistics" | "general";

export interface NewsItem {
  id: string;              // sha256(url).slice(0, 12)
  title: string;
  date: string;            // YYYY-MM-DD
  source: string;          // "ESPN" | "BBC Sport" | "Reddit r/worldcup" | "Reddit r/soccer"
  url: string;
  summary: string;         // 1-2 sentences from Claude Haiku
  categories: NewsCategory[];
  related_teams: string[]; // team IDs (e.g. "usa", "bra")
  fetched_at: string;      // ISO timestamp
}

export interface FanZone {
  id: string;
  venue_id: string;
  city: string;
  country: "USA" | "Mexico" | "Canada";
  name: string;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number };
  capacity: number;
  free_entry: boolean;
  hours: string;
  activities: string[];
  highlights: string;
  transportation: string;
  amenities: string[];
  family_friendly: boolean;
  status: "confirmed" | "expected";
}

export type InjuryStatus = "out" | "doubtful" | "recovering" | "fit";

export interface InjuryReport {
  player: string;
  team_id: string;
  position: string;
  injury: string;
  status: InjuryStatus;
  expected_return: string;     // e.g. "March 2026", "Before tournament", "Unknown"
  last_updated: string;        // YYYY-MM-DD
  source: string;
}

export interface OddsEntry {
  team_id: string;
  odds: string;                // e.g. "+450", "5/1"
  implied_probability: string; // e.g. "18.2%"
}

export interface GroupPrediction {
  group: string;
  favorites: string[];         // team IDs in predicted finishing order
  dark_horse: string;          // team ID
  narrative: string;
}

export interface TournamentOdds {
  last_updated: string;
  source: string;
  tournament_winner: OddsEntry[];
  golden_boot: Array<{ player: string; team_id: string; odds: string }>;
  group_predictions: GroupPrediction[];
  dark_horses: Array<{ team_id: string; reason: string }>;
}
