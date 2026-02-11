# WC26 Custom GPT Configuration

This directory contains everything needed to create a **FIFA World Cup 2026 Companion** Custom GPT in ChatGPT.

## Files

| File | Purpose |
|---|---|
| `instructions.md` | System instructions to paste into the GPT's "Instructions" field |
| `openapi.json` | OpenAPI 3.1 spec defining 12 API actions (matches, teams, venues, etc.) |
| `conversation-starters.json` | 4 suggested conversation starters for the GPT interface |

## Setup Steps

### 1. Create the GPT

1. Go to [ChatGPT](https://chat.openai.com)
2. Click **Explore GPTs** in the sidebar
3. Click **Create** (top right)
4. Give it a name: **World Cup 2026 Companion**
5. Add a description: *Your AI guide to the FIFA World Cup 2026. Matches, teams, venues, travel tips, visa info, fan zones, and more across the USA, Mexico, and Canada.*

### 2. Paste the Instructions

1. In the **Configure** tab, find the **Instructions** field
2. Open `instructions.md` and copy the entire contents
3. Paste it into the Instructions field

### 3. Add Conversation Starters

1. In the **Configure** tab, find **Conversation starters**
2. Open `conversation-starters.json` and add each of the 4 strings as a starter:
   - "What's happening with the World Cup right now?"
   - "Show me the USA's full match schedule in my timezone"
   - "I'm traveling to Dallas for a match -- give me the city guide and nearby fan zones"
   - "Compare the World Cup history of Brazil vs Argentina"

### 4. Add the API Action

1. Scroll down to **Actions** and click **Create new action**
2. In the **Schema** field, paste the entire contents of `openapi.json`
3. Set **Authentication** to **None** (the API serves public data)
4. The schema defines 12 endpoints -- ChatGPT will auto-detect them from the spec
5. Click **Save**

### 5. Publish

1. Review everything in the **Preview** pane on the right
2. Choose your publishing preference (Only me, Anyone with a link, or Public)
3. Click **Save** / **Update**

## API Deployment

The OpenAPI spec uses `https://api.wc26.ai` as the server URL. This is a **placeholder** -- you need to deploy an actual API that serves these endpoints before the GPT actions will work.

### Recommended: Vercel Serverless Functions

Since the WC26 MCP server uses static bundled data with zero runtime dependencies, the simplest deployment path is Vercel serverless functions wrapping the same data:

1. Create API route handlers in `/api/matches.ts`, `/api/teams.ts`, etc.
2. Each handler imports the same data files from `src/data/`
3. Parse query parameters and apply the same filtering logic from `src/index.ts`
4. Return JSON responses
5. Deploy to Vercel and point `api.wc26.ai` to the deployment

The project already has a `vercel.json` in the root, so it may already be partially configured for deployment.

### Alternative Options

- **Cloudflare Workers** -- lightweight, global edge deployment
- **AWS Lambda + API Gateway** -- if you prefer AWS
- **Express/Fastify server** -- wrap the data in a simple Node.js HTTP server

## Links

- **Website**: [wc26.ai](https://wc26.ai)
- **npm**: [wc26-mcp](https://www.npmjs.com/package/wc26-mcp)
- **MCP Registry**: [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io)
