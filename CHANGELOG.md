# Changelog

## 0.3.1 (unreleased)

### Added
- `get_news` tool: Latest World Cup news headlines curated daily by the Scout Agent.
- `get_injuries` tool: Key player availability tracker with injury status, expected return dates, and impact assessment.
- `get_odds` tool: Tournament favorites, golden boot predictions, group previews, and dark horse picks.
- `compare_teams` tool: Side-by-side comparison of any two teams with rankings, odds, injuries, and head-to-head.
- `get_standings` tool: Group power rankings based on FIFA rankings, betting odds, and predictions.
- `get_bracket` tool: Knockout bracket visualization from Round of 32 through the Final.
- 4 new historical matchups for group pairings: Morocco-Scotland, Saudi Arabia-Uruguay, Japan-Tunisia, Algeria-Austria.
- `/news`, `/injuries`, `/odds` Telegram slash commands.
- Scout Agent: `scripts/scout.ts` with daily GitHub Actions cron (`scout.yml`, 8:00 UTC).

### Fixed
- Group C schedule: Matchday 3 had duplicate pairings (bra-sco, mar-hai repeated from MD2). Corrected to hai-bra and sco-mar.
- Invalid timezone input no longer crashes the server. Returns a helpful error message instead.
- Smoke test for match team references was silently passing (wrong property name). Fixed and added group pairing completeness test.

### Improved
- `get_matches` now returns helpful error messages for unrecognized team, venue, or group inputs instead of empty results.
- Date parameters validated against YYYY-MM-DD format. Invalid dates are rejected with a clear message.
- TypeScript types now importable: `import type { Match } from 'wc26-mcp'`
- Source maps removed from npm package (~146KB smaller).
- `readOnlyHint: true` annotation on all 18 tools.
- Injuries and odds wired into `what_to_know_now` briefings and `get_team_profile` responses.
- Injury data expanded from 6 to 18 entries across 15 teams.

## 0.3.0 (2026-02-11)

### Added
- `get_fan_zones` tool: 18 FIFA Fan Festival locations across all 16 host cities with capacity, hours, activities, and transit tips.
- `get_visa_info` tool: Entry requirements for 42 nationalities across USA, Mexico, and Canada.
- Fan zone summary wired into `what_to_know_now` briefings for pre-tournament phases.
- Smoke test suite: 34 tests covering data counts, referential integrity, and data quality.
- `readOnlyHint: true` annotations on all tool registrations.
- Privacy policy page at wc26.ai/privacy.
- `server.json` for MCP Registry, `glama.json` for Glama.ai auto-indexing.
- `.mcpb` desktop extension package for Anthropic's Claude Desktop directory.

### Fixed
- 38 roster updates across 20 teams (coaching changes and player transfers).

## 0.2.0 (2026-02-11)

### Added
- `what_to_know_now` tool: Phase-aware temporal briefing, zero parameters needed.
- `get_team_profile` tool: Coach, key players, playing style, WC history for all 48 teams.
- `get_city_guide` tool: Travel guides for all 16 host cities.
- `get_historical_matchups` tool: Head-to-head WC records for 30 team pairings.
- `get_nearby_venues` tool: Venue-to-venue distances sorted by proximity.
- Timezone support across all time-based tools.
- Venue weather data (average June/July highs, lows, climate).
- Polished website with countdown, conversation demos, prompt pills.

## 0.1.0 (2026-02-09)

### Added
- Initial release with 5 tools: `get_matches`, `get_teams`, `get_groups`, `get_venues`, `get_schedule`.
- Complete dataset: 48 teams, 104 matches, 16 venues, 12 groups.
- Enriched responses with team names, flag emoji, venue details.
- Flexible filtering by date, date range, team, group, venue, round, status.
- Landing page at wc26.ai with setup instructions and tool cards.
