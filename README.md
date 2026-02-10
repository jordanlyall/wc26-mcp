# wc26-mcp

MCP server for FIFA World Cup 2026 data — 104 matches, 48 teams, 16 venues, 12 groups. All data included, no API keys needed.

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

### Cursor / Other MCP Clients

Run the server directly:

```bash
npx -y wc26-mcp
```

The server communicates over stdio using the [Model Context Protocol](https://modelcontextprotocol.io).

## Tools

| Tool | Description | Filters |
|------|-------------|---------|
| `get_matches` | Query matches with enriched team names, flags, and venue details | `date`, `date_from`, `date_to`, `team`, `group`, `venue`, `round`, `status` |
| `get_teams` | All 48 qualified nations with FIFA rankings and confederations | `group`, `confederation`, `is_host` |
| `get_groups` | Group details with teams, venues, and match schedules | `group` |
| `get_venues` | 16 stadiums across USA, Mexico, and Canada | `country`, `city`, `region` |
| `get_schedule` | Tournament schedule organized by date | `date_from`, `date_to` |

## Example Prompts

- "When does the USA play their first match?"
- "Show me all venues in Texas"
- "What teams are in Group C with Brazil?"
- "What's the schedule for the knockout rounds?"
- "Which matches are at MetLife Stadium?"
- "List all CONCACAF teams in the tournament"

## Data Notes

- All kick-off times are in **UTC**
- Tournament runs **June 11 – July 19, 2026**
- Some teams are listed as **TBD** (intercontinental playoff winners)
- 3 host nations: USA (11 venues), Mexico (3 venues), Canada (2 venues)

## License

MIT
