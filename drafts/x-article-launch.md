# WC26 MCP Launch Post

## Launch Tweet

120 days until the World Cup.

I built an AI companion so your AI actually knows things about it. Schedules, rosters, city guides, head-to-head records, fan zones, visa info. 18 tools. Zero API keys.

"Brief me on the World Cup" and it just works.

Works with Claude, ChatGPT, Cursor, Telegram — or try it right now: wc26.ai/try

Here's how I built it and why 👇

---

## X Thread (alt format)

1/ 120 days until the World Cup kicks off in Mexico City.

I built an AI companion that makes your AI actually useful for it. 18 tools. Full data. Zero API keys.

Works with Claude, ChatGPT, Cursor, Telegram, and any MCP client.

wc26.ai

2/ The problem: ask your AI about the World Cup schedule. You get hedging, outdated info, or a web search that pulls random articles.

I wanted real answers. Structured data. Not guesses.

3/ So I built wc26-mcp — an MCP server that ships with everything bundled.

104 matches. 48 teams. 16 venues. City guides. Fan zones. Visa info. Head-to-head records. Team profiles.

One line to install: npx wc26-mcp

4/ The killer feature: say "brief me on the World Cup" and it auto-detects the tournament phase, surfaces what matters today, and suggests what to ask next. Zero parameters.

Right now it tells you: 120 days out, 6 playoff spots pending, here are the groups to watch.

5/ Other highlights:

"Argentina vs France history" → 4 meetings, 2022 final details, 17 goals
"City guide for Dallas" → food, transit, weather warning, fan zones
"Do I need a visa for Mexico?" → visa-free, 180 days, no registration

All from structured data. No hallucination.

6/ Don't use MCP? No problem:

ChatGPT GPT — same 18 tools, live in the GPT Store: chatgpt.com/g/g-698d038f171481919ada44947304a196-world-cup-2026-companion

Telegram bot — slash commands for everything: t.me/wc26ai_bot

No setup. Just open and start asking.

7/ Want to see it before you install? There's an interactive playground with 16 pre-built demos:

wc26.ai/try

See the actual API responses for briefings, team profiles, city guides, historical matchups, and more.

8/ The tech: TypeScript, MCP SDK, Zod schemas. All data compiled at build time. Zero runtime dependencies. Runs locally via stdio. Also deployed as a REST API on Vercel for the ChatGPT GPT.

Open source under MIT: github.com/jordanlyall/wc26-mcp

9/ What's next:

- UEFA & intercontinental playoffs are March 26 & 31 — 6 teams still to qualify
- Trip planning tools: multi-city routing, transit between venues
- Live updates once the tournament starts June 11

10/ 120 days. 48 teams. 16 cities. 3 countries.

If you want your AI ready for the biggest sporting event on Earth:

🌐 wc26.ai
💬 ChatGPT GPT: World Cup 2026 Companion
🤖 Telegram: t.me/wc26ai_bot
📦 npm: wc26-mcp
🧑‍💻 GitHub: jordanlyall/wc26-mcp

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

I also built a **ChatGPT GPT** so you don't even need to install anything — just open it and start chatting: [World Cup 2026 Companion](https://chatgpt.com/g/g-698d038f171481919ada44947304a196-world-cup-2026-companion)

### 18 tools, zero API keys

Everything ships with the package. No external APIs, no rate limits, no auth tokens. It works offline.

Here's what's inside:

**The smart briefing.** Say "brief me on the World Cup" and it detects the current tournament phase, surfaces what matters right now, and suggests what to ask next. Zero parameters. It just knows.

**Team profiles.** Coach, key players with current clubs, playing style, World Cup history, qualifying record. All 48 teams.

**City guides.** All 16 host cities. Highlights, food and drink, how to get there, local tips. Written for fans, not tourists.

**Head-to-head records.** "What's the history between Argentina and France?" Every World Cup meeting. Penalty results. Aggregate stats. Narrative context. 30 pairings covering the biggest rivalries.

**Fan zones.** 18 FIFA Fan Festival locations across all host cities. Capacity, hours, activities, how to get there.

**Visa info.** Entry requirements for any nationality traveling to the US, Mexico, or Canada. ESTA, eTA, visa-free, or visa required.

**News.** A Scout Agent runs daily, curating the latest World Cup headlines -- roster changes, venue updates, qualifying results. Ask "What's the latest World Cup news?" and get real headlines, not search results.

**Injuries.** Key player availability tracker. Who's fit, who's doubtful, who's out. Expected return dates and impact assessment for star players across all 48 teams.

**Odds & predictions.** Tournament favorites with implied probabilities, golden boot predictions, group-by-group previews with narratives, and dark horse picks with reasoning. Aggregated from major bookmakers.

Plus match schedules with timezone conversion, group details, venue info with weather data, and a venue distance tool for planning multi-city trips.

### What it actually looks like

You: "When does the USA play?"

Your AI calls `get_matches`, filters by team, converts to your timezone, and gives you the full schedule with venues and opponents.

You: "City guide for Dallas"

Your AI calls `get_city_guide` and returns highlights, food picks, transit info, and a heads up that summer heat in Texas is no joke.

You: "Do I need a visa for Mexico as a UK citizen?"

Your AI calls `get_visa_info` and tells you it's visa-free for up to 180 days, no advance registration needed.

No copy-pasting. No tab switching. Just a conversation.

You can see all of this in action on the [interactive playground](https://wc26.ai/try) — 16 real demos with actual API responses.

### Four ways to use it

**MCP (Claude, Cursor, Windsurf):** `npx wc26-mcp` — installs in seconds, runs locally, zero dependencies.

**ChatGPT:** [World Cup 2026 Companion](https://chatgpt.com/g/g-698d038f171481919ada44947304a196-world-cup-2026-companion) — same 18 tools, live in the GPT Store. No setup.

**Telegram:** [@wc26ai_bot](https://t.me/wc26ai_bot) — 17 slash commands, instant responses. `/team brazil`, `/city miami`, `/history argentina france`.

**REST API:** All 18 endpoints are live at `wc26.ai/api` for anyone who wants to build on top.

### Why I built it

I'm a builder. I spend most of my time as CPO at Art Blocks, working on generative art infrastructure. But I've been deep in the MCP ecosystem and wanted a real project to push it.

The World Cup felt perfect. Time-bounded, data-rich, genuinely useful. And the data problem is real — try planning a multi-city World Cup trip across 3 countries using Google. It's a mess.

I also wanted to prove out a pattern: curated static data, bundled with the package, zero runtime dependencies. No API keys to manage, no rate limits to hit, no services to keep running. Install it once and it just works.

### The tech

TypeScript, MCP SDK, Zod for schemas. All data compiled at build time into the npm package. Runs locally via stdio. Compatible with Claude Desktop, Claude Code, Cursor, Windsurf, ChatGPT, and anything else that speaks MCP.

The REST API runs on Vercel as serverless functions wrapping the same bundled data. The ChatGPT GPT hits these endpoints via an OpenAPI spec.

The whole thing is open source under MIT.

### What's next

The UEFA and intercontinental playoffs are March 26 and 31. Six teams still need to qualify. Once they're in, I'll add their profiles, matchup histories, and update the briefing system.

After that, trip planning tools. Multi-city routing, transit between venues, budget estimation. 16 cities across 3 countries is a logistics puzzle, and AI is actually good at that kind of reasoning when you give it the right data.

120 days to kickoff. If you want your AI ready:

**Website:** [wc26.ai](https://wc26.ai)
**ChatGPT:** [World Cup 2026 Companion](https://chatgpt.com/g/g-698d038f171481919ada44947304a196-world-cup-2026-companion)
**Telegram:** [@wc26ai_bot](https://t.me/wc26ai_bot)
**Playground:** [wc26.ai/try](https://wc26.ai/try)
**GitHub:** [github.com/jordanlyall/wc26-mcp](https://github.com/jordanlyall/wc26-mcp)
**npm:** [wc26-mcp](https://www.npmjs.com/package/wc26-mcp)
