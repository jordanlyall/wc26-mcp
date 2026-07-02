# Setup & Integration Guide

How to run this World Cup 2026 MCP server and integrate it into your own
system — either as a tool server for an MCP client (Claude Desktop, Claude
Code, Cursor, …) or called programmatically from your own code.

This fork adds a **free live-results layer** on top of upstream
`wc26-mcp`: real scores, live match status, and computed group tables. See
[README.md](README.md) for the full feature list.

---

## 1. Prerequisites

- **Node.js ≥ 18** (uses the built-in global `fetch` and `AbortController`)
- **git**
- An MCP client (e.g. Claude Desktop) — or your own app using the MCP SDK

```bash
node --version   # must be v18 or higher
```

---

## 2. Install & build

```bash
git clone https://github.com/novastate/wc26-mcp.git
cd wc26-mcp
git checkout feat/live-results-layer   # the branch with the live layer
npm install
npm run build                          # compiles TypeScript → dist/
```

After this, the server entry point is `dist/index.js`. Quick smoke check:

```bash
npm test                               # runs the live-layer test suite
node dist/index.js                     # starts the stdio server (Ctrl-C to exit)
```

---

## 3. Choose your data source (optional but recommended)

The server runs in two modes, selected automatically at runtime:

| Mode | How to enable | What you get |
|------|---------------|--------------|
| **Live** | set `FOOTBALL_DATA_KEY` | Full WC2026 results **with live `IN_PLAY` status** — "which matches are playing right now". |
| **Fallback** | *(no key)* | Public-domain final scores from openfootball, committed post-match. No key, no rate limit. |

**To enable live mode**, get a free token (takes ~1 minute):

1. Register at **<https://www.football-data.org/client/register>**
2. The token arrives by email (header name: `X-Auth-Token`)
3. Pass it to the server via the `FOOTBALL_DATA_KEY` environment variable (see below)

> The free tier allows ~10 requests/minute. The server caches upstream
> results for 60 seconds and makes at most one call per window, so a single
> instance stays well under the limit. It also reads the API's throttle
> headers and backs off automatically.

Without a key the server still works fully — it just uses openfootball and
has no in-match live status.

---

## 4. Connect it to an MCP client

> Replace `/ABSOLUTE/PATH/TO/wc26-mcp` with the real path where you cloned it.

### Claude Desktop

Edit `claude_desktop_config.json`
(macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "wc26": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/wc26-mcp/dist/index.js"],
      "env": { "FOOTBALL_DATA_KEY": "your-token-here" }
    }
  }
}
```

Restart Claude Desktop. (Omit the `env` block to run key-less.)

### Claude Code

```bash
claude mcp add wc26 \
  --env FOOTBALL_DATA_KEY=your-token-here \
  -- node /ABSOLUTE/PATH/TO/wc26-mcp/dist/index.js
```

### Cursor / Windsurf

Add to `.cursor/mcp.json` (or `~/.codeium/windsurf/mcp_config.json`):

```json
{
  "mcpServers": {
    "wc26": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/wc26-mcp/dist/index.js"],
      "env": { "FOOTBALL_DATA_KEY": "your-token-here" }
    }
  }
}
```

### Any other MCP client

The server speaks the [Model Context Protocol](https://modelcontextprotocol.io)
over **stdio**. Launch it with `node dist/index.js` and set the
`FOOTBALL_DATA_KEY` env var in the process environment.

---

## 5. Call it programmatically (your own system)

If your system is custom code rather than a chat client, use the official
MCP SDK to spawn and call the server. The SDK is already a dependency.

```ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["/ABSOLUTE/PATH/TO/wc26-mcp/dist/index.js"],
  env: { ...process.env, FOOTBALL_DATA_KEY: "your-token-here" },
});

const client = new Client({ name: "my-app", version: "1.0.0" }, { capabilities: {} });
await client.connect(transport);

// List available tools
const { tools } = await client.listTools();

// Today's matches in the user's timezone
const res = await client.callTool({
  name: "get_matches",
  arguments: { date: "2026-06-14", timezone: "Europe/Stockholm" },
});
const data = JSON.parse(res.content[0].text);
console.log(data.live_source, data.matches);

// Live group table
const standings = await client.callTool({
  name: "get_standings",
  arguments: { group: "A" },
});

await client.close();
```

Every tool returns a single text block containing a JSON string — parse
`res.content[0].text` to get the structured object.

---

## 6. Tools you'll likely use

All 18 tools are listed in [README.md](README.md). The ones touched by the
live layer:

| Tool | Key arguments | Returns |
|------|---------------|---------|
| `get_matches` | `date`, `date_from`/`date_to`, `team`, `group`, `status`, `timezone` | Matches with team names, venue, **local time** (any IANA timezone), and **real score + `live`/`completed` status** once played. Includes `live_source`. |
| `get_standings` | `group` | Per-group **live `table`** (position, P/W/D/L, GF/GA/GD, points) from played matches, plus pre-tournament `power_ranking`. Includes `tournament_started`. |
| `what_to_know_now` | `timezone`, `date` | Auto-phased briefing (countdown → group stage → knockout) with today's/yesterday's matches in your timezone. |
| `get_schedule` | `date_from`/`date_to`, `timezone` | Full calendar grouped by date, timezone-converted. |

**Timezone** uses IANA names: `Europe/Stockholm`, `America/New_York`,
`Asia/Tokyo`, etc.

---

## 7. How the live layer behaves (good to know)

- **Fail-safe:** if the data source is unreachable or returns an error, the
  tool falls back to the static schedule and **never throws**. A flaky
  network degrades gracefully; it never breaks a tool call.
- **Caching:** results are cached in-memory for 60 s with single-flight, so
  a burst of tool calls hits the network at most once per window.
- **Standings:** ordered by points → goal difference → goals scored. (FIFA's
  full tiebreaker chain starts with head-to-head; this first-order ordering
  matches the official table the vast majority of the time.)
- **Before kickoff (June 11, 2026):** all scores are unset, `get_standings`
  tables read all-zero, and matches show `status: "scheduled"` — expected.

---

## 8. Troubleshooting

| Symptom | Cause / fix |
|--------|-------------|
| Server won't start | Run `npm run build` first; check `node --version` ≥ 18. |
| `live_source` is `openfootball` but you set a key | The env var must reach the **server** process. In client configs it goes in the `env` block, not your shell. Restart the client after editing config. |
| No live scores during a match | Free tiers are **delayed**, not second-by-second. `IN_PLAY` status appears, but scores lag. openfootball updates post-match (≈daily commits). |
| Hitting football-data.org rate limit | Don't run many instances against one key; the 60 s cache keeps a single instance safe. |
| Tool returns `results_available: 0` | Normal before the tournament starts, or if the source is briefly unreachable (fail-safe). |

---

## 9. Updating

```bash
git pull
npm install
npm run build
```

Restart your MCP client to pick up the new build.
