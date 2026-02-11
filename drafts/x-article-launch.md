# WC26 MCP Launch Post

## Launch Tweet

~120 days until the World Cup.

I built an MCP server so your AI actually knows things about it. Schedules, rosters, city guides, head-to-head records, fan zones, visa info. 12 tools. Zero API keys.

"Brief me on the World Cup" and it just works.

Here's how I built it and why:

---

## X Article

**Title: I built an AI companion for the 2026 World Cup**

The 2026 World Cup starts June 11. 48 teams. 104 matches. 16 stadiums across 3 countries.

It's going to be the biggest sporting event in history, and right now your AI knows almost nothing about it.

I wanted to fix that.

### The problem

Try asking Claude or ChatGPT about the World Cup schedule. You'll get hedging, outdated info, or a "let me search the web" response that pulls random articles.

That's not useful. I wanted structured, queryable data. Real answers, not web scraping guesses.

### The solution

I built an MCP server called wc26-mcp. MCP (Model Context Protocol) lets AI assistants call external tools natively. Think of it as a plugin system for AI.

One line to install:

```
npx wc26-mcp
```

Then start asking questions. Your AI handles the rest.

### 12 tools, zero API keys

Everything ships with the package. No external APIs, no rate limits, no auth tokens. It works offline.

Here's what's inside:

**The smart briefing.** Say "brief me on the World Cup" and it detects the current tournament phase, surfaces what matters right now, and suggests what to ask next. Zero parameters. It just knows.

**Team profiles.** Coach, key players with current clubs, playing style, World Cup history, qualifying record. All 48 teams.

**City guides.** All 16 host cities. Highlights, food and drink, how to get there, local tips. Written for fans, not tourists.

**Head-to-head records.** "What's the history between Argentina and France?" Every World Cup meeting. Penalty results. Aggregate stats. Narrative context. 30 pairings covering the biggest rivalries.

**Fan zones.** 18 FIFA Fan Festival locations across all host cities. Capacity, hours, activities, how to get there.

**Visa info.** Entry requirements for any nationality traveling to the US, Mexico, or Canada. ESTA, eTA, visa-free, or visa required.

Plus match schedules with timezone conversion, group details, venue info with weather data, and a venue distance tool for planning multi-city trips.

### What it actually looks like

You: "When does the USA play?"

Your AI calls `get_matches`, filters by team, converts to your timezone, and gives you the full schedule with venues and opponents.

You: "City guide for Dallas"

Your AI calls `get_city_guide` and returns highlights, food picks, transit info, and a heads up that summer heat in Texas is no joke.

You: "Do I need a visa for Mexico as a UK citizen?"

Your AI calls `get_visa_info` and tells you it's visa-free for up to 180 days, no advance registration needed.

No copy-pasting. No tab switching. Just a conversation.

### Why I built it

I'm a builder. I spend most of my time as CPO at Art Blocks, working on generative art infrastructure. But I've been deep in the MCP ecosystem and wanted a real project to push it.

The World Cup felt perfect. Time-bounded, data-rich, genuinely useful. And the data problem is real... try planning a multi-city World Cup trip across 3 countries using Google. It's a mess.

I also wanted to prove out a pattern: curated static data, bundled with the package, zero runtime dependencies. No API keys to manage, no rate limits to hit, no services to keep running. Install it once and it just works.

### The tech

TypeScript, MCP SDK, Zod for schemas. All data compiled at build time into the npm package. Runs locally via stdio. Compatible with Claude Desktop, Claude Code, Cursor, Windsurf, ChatGPT, and anything else that speaks MCP.

The whole thing is open source under MIT.

### What's next

The UEFA and intercontinental playoffs are March 26 and 31. Six teams still need to qualify. Once they're in, I'll add their profiles, matchup histories, and update the briefing system.

After that, trip planning tools. Multi-city routing, transit between venues, budget estimation. 16 cities across 3 countries is a logistics puzzle, and AI is actually good at that kind of reasoning when you give it the right data.

120 days to kickoff. If you want your AI ready:

**Website:** wc26.ai
**GitHub:** github.com/jordanlyall/wc26-mcp
**npm:** wc26-mcp
