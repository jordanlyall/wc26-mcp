# wc26-mcp

[![npm version](https://img.shields.io/npm/v/wc26-mcp.svg)](https://www.npmjs.com/package/wc26-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP server for FIFA World Cup 2026 data — 104 matches, 48 teams, 16 venues, 12 groups. Team profiles, timezone support, and a smart briefing tool that knows what's relevant right now. All data included, no API keys needed.

**[Website](https://wc26-mcp.vercel.app)** | **[npm](https://www.npmjs.com/package/wc26-mcp)**

## Quick Start

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "wc26": {
      "command": "npx",
      "args": ["-y", "wc26-mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add wc26 -- npx -y wc26-mcp
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "wc26": {
      "command": "npx",
      "args": ["-y", "wc26-mcp"]
    }
  }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "wc26": {
      "command": "npx",
      "args": ["-y", "wc26-mcp"]
    }
  }
}
```

### Other MCP Clients

The server communicates over stdio using the [Model Context Protocol](https://modelcontextprotocol.io):

```bash
npx -y wc26-mcp
```

## Tools

| Tool | Description | Filters |
|------|-------------|---------|
| `what_to_know_now` | Zero-query temporal briefing — detects tournament phase and returns the most relevant info for today | `date`, `timezone` |
| `get_team_profile` | Coach, key players, playing style, World Cup history, and qualifying summary for any team | `team` |
| `get_matches` | Query matches with enriched team names, flags, venue details, and timezone conversion | `date`, `date_from`, `date_to`, `team`, `group`, `venue`, `round`, `status`, `timezone` |
| `get_teams` | All 48 qualified nations with FIFA rankings and confederations | `group`, `confederation`, `is_host` |
| `get_groups` | Group details with teams, venues, and match schedules | `group` |
| `get_venues` | 16 stadiums across USA, Mexico, and Canada with weather data | `country`, `city`, `region` |
| `get_schedule` | Tournament schedule organized by date with timezone conversion | `date_from`, `date_to`, `timezone` |

## Example Prompts

- "Brief me on the World Cup"
- "Tell me about Argentina's squad and playing style"
- "When does the USA play their first match?"
- "Show me all venues in Texas"
- "What teams are in Group C with Brazil?"
- "What's the schedule for the knockout rounds?"
- "Which matches are at MetLife Stadium?"
- "Show me tomorrow's matches in my timezone (America/New_York)"

## Data Notes

- All kick-off times are in **UTC** (pass `timezone` to convert)
- Tournament runs **June 11 – July 19, 2026**
- Some teams are listed as **TBD** (intercontinental playoff winners)
- 3 host nations: USA (11 venues), Mexico (3 venues), Canada (2 venues)
- Team profiles include coach, 3 key players, playing style, and World Cup history for all 48 teams
- Each venue includes average June/July weather (highs, lows, climate description)

## License

MIT
