# WC26-MCP — Hacker News Launch Plan

## Post Date

**Tuesday Feb 18 or Wednesday Feb 19, 2026 at 8:30 AM ET**

- Tuesday/Wednesday have highest engagement and longest front-page dwell time
- 8:30 AM ET catches US East Coast browsing before meetings, US West Coast early risers, and Europe still online (2:30 PM CET)
- Feb 17 is Presidents' Day — skip Monday entirely
- Avoid Friday (posts die fast) and weekends (low traffic)

---

## Show HN Title

```
Show HN: WC26-MCP – World Cup 2026 data for AI assistants via Model Context Protocol
```

---

## Show HN Body

```
I built an MCP server that gives AI assistants structured access to FIFA World Cup 2026 data — 104 matches, 48 teams, 16 venues across the US, Mexico, and Canada.

18 tools covering matches, team profiles, city guides, fan zones, visa requirements, historical head-to-head records, injuries, odds, knockout bracket, and a "what to know right now" temporal briefing that adapts based on the current tournament phase.

All data ships with the package. Zero API keys, zero external dependencies. Works with Claude Desktop, Claude Code, Cursor, Windsurf, ChatGPT, or any MCP client.

Install: `npx -y wc26-mcp`

Interactive demo: https://wc26.ai/try

GitHub: https://github.com/jordanlyall/wc26-mcp

The interesting technical bits:

- MCP (Model Context Protocol) is a standard for giving AI models structured access to tools and data. This server implements 18 tools over stdio.
- A "Scout Agent" runs daily to aggregate news from ESPN, BBC Sport, and Reddit, deduplicates via SHA256, and summarizes with Claude Haiku.
- The `what_to_know_now` tool detects the current tournament phase (pre-tournament, group stage, knockouts, etc.) and returns a contextual briefing with no input required.
- Venue proximity uses haversine distance. Timezone conversion is built in.

I'm a solo dev — feedback welcome. MIT licensed.
```

---

## Author Comment (post immediately after submitting)

```
Hey HN, I built this because I wanted to ask my AI about World Cup logistics — "do I need a visa?", "what matches are in Dallas?", "who plays on June 15?" — and realized there was no structured data source for AI assistants to pull from.

MCP (Model Context Protocol) lets you expose tools that any compatible AI client can discover and call. This server ships 18 tools covering everything from match schedules to city travel guides.

The fun technical bit: there's a `what_to_know_now` tool that detects the current tournament phase (pre-tournament → group stage → knockouts → final) and generates a contextual briefing with zero input. Try it at wc26.ai/try.

Solo project, MIT licensed, happy to answer questions.
```

---

## Anticipated Comments & Responses

### "Why not just use an API?"

> All data ships with the package — no API keys, no rate limits, no external calls at runtime. The server starts instantly and works offline. An API would add latency, auth complexity, and a dependency on someone else's uptime.

### "MCP is just a hype protocol / why not just a REST API?"

> Fair question. MCP's value is that any AI client that supports it (Claude, Cursor, ChatGPT, etc.) can discover and use the tools automatically without custom integration code. A REST API requires each client to write an adapter. MCP gives you one implementation, many clients.

### "The data will be stale by the time the tournament starts"

> The core data (matches, venues, groups, visa rules) is confirmed by FIFA and stable. The Scout Agent updates news daily via CI. Team rosters and injuries get updated as the tournament approaches. PRs welcome for data fixes too.

### "This is just a JSON file with extra steps"

> The tools do more than serve JSON — `what_to_know_now` detects the current tournament phase and returns a contextual briefing. `get_matches` supports timezone conversion and multi-filter queries. `get_nearby_venues` calculates haversine distances. `compare_teams` aggregates rankings, odds, injuries, and head-to-head history into a single view. The structure is what makes it useful to an AI.

### "48 teams but only 42 confirmed?"

> 6 spots are decided by intercontinental playoffs on March 26 and 31. The data includes placeholders that will be updated as results come in.

### "Odds data seems like it could be problematic / legal issues?"

> The odds are publicly available aggregated predictions, not live betting feeds. Similar to what you'd see in any sports preview article. No gambling functionality.

### "Why TypeScript / why not Python?"

> MCP's reference SDK is TypeScript and the `npx` distribution model makes installation trivial — one command, no virtual environments. Python MCP servers exist but the DX for end users is worse.

### "How do you handle the ChatGPT integration?"

> ChatGPT uses a GPT (custom GPT) which wraps the same data. The Telegram bot uses the same data layer too. One data source, multiple interfaces.

### "Cool project but seems like a lot of work for a one-month tournament"

> It's a 39-day tournament but fan interest spans months before and after. The pre-tournament phase (now through June) is actually when people have the most questions — groups, venues, travel planning, visa requirements. The tool is most useful right now.

---

## First-Hour Playbook

1. **Be at your keyboard** — reply to every comment within 5-10 minutes
2. **Post the author comment immediately** after submitting — it seeds the discussion
3. **Don't ask friends to upvote** — HN's vote ring detection is aggressive and will kill the post
4. **Have the /try page ready** — HN users click before they comment, so the demo needs to load fast
5. **Stay engaged for the full first hour** — this is when HN decides if you stay on the front page

---

## Pre-Post Checklist

- [ ] `npm test` passes (currently 34/34)
- [ ] `npm run build` succeeds
- [ ] Website loads at wc26.ai
- [ ] /try page works with all 16 demos
- [ ] npm package is current version (0.3.1)
- [ ] GitHub repo description is set and clear
- [ ] GitHub topics are set (mcp, world-cup, fifa, 2026, typescript)
- [ ] Browser tab open to HN to reply quickly to early comments
- [ ] This doc reviewed one final time before posting
