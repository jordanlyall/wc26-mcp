/**
 * WC26 MCP Server — HTTP transport with x402 micropayment gating
 *
 * This module exposes the same FIFA World Cup 2026 MCP tools as src/index.ts
 * (which uses stdio), but via a StreamableHTTP transport protected by x402.
 *
 * Every POST /mcp request (i.e. every MCP tool call) requires a valid
 * x402 payment of $0.002 USDC on Base Sepolia (chain 84532).
 *
 * Facilitator: https://x402.org/facilitator (Coinbase-operated)
 * Wallet:      0x39614af23b76a33e01f33d63657cB3a878217f24
 *
 * Usage:
 *   PORT=3000 node dist/server-http.js
 */

import express, { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/http";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { createWc26McpServer } from "./create-server.js";

// ── Config ──────────────────────────────────────────────────────────

const WALLET_ADDRESS = "0x39614af23b76a33e01f33d63657cB3a878217f24";
const NETWORK = "eip155:84532" as `${string}:${string}`; // Base Sepolia
const PRICE = "$0.002"; // USD value — resolved to USDC by ExactEvmScheme
const PORT = parseInt(process.env.PORT ?? "3000", 10);

// ── x402 Setup ──────────────────────────────────────────────────────

// External facilitator — handles on-chain verify + settle via x402.org
const facilitatorClient = new HTTPFacilitatorClient();
// facilitatorClient.url defaults to "https://x402.org/facilitator"

// Resource server: register the EVM scheme server for eip155:* networks.
// ExactEvmScheme knows how to parse "$0.002" → USDC micro-units and
// how to build EIP-712 payment requirements for the client to sign.
const resourceServer = new x402ResourceServer(facilitatorClient);
resourceServer.register(NETWORK, new ExactEvmScheme());

// Protected routes config
const protectedRoutes = {
  "POST /mcp": {
    accepts: {
      scheme: "exact",
      payTo: WALLET_ADDRESS as `0x${string}`,
      price: PRICE,
      network: NETWORK,
    },
    description: "WC26 MCP – FIFA World Cup 2026 data ($0.002 USDC per call)",
  },
};

// ── Express App ─────────────────────────────────────────────────────

const app = express();
app.use(express.json());

// x402 payment middleware — runs before POST /mcp handler.
// Returns 402 with payment requirements if no valid payment header,
// then calls next() once payment is verified + settled.
app.use(paymentMiddleware(protectedRoutes, resourceServer));

// ── Session Registry ────────────────────────────────────────────────

// MCP Streamable HTTP is stateful (session-based).
// Each new client gets a UUID session; subsequent requests carry
// the session ID in the `mcp-session-id` header.
const sessions = new Map<string, StreamableHTTPServerTransport>();

// ── MCP HTTP Handlers ───────────────────────────────────────────────

/**
 * POST /mcp  — Client sends JSON-RPC (initialize / tools/list / tools/call).
 *
 * The x402 middleware above has already verified payment before we reach here.
 * We create a new session on `initialize` and reuse it for subsequent calls.
 */
app.post("/mcp", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  let transport: StreamableHTTPServerTransport;

  if (sessionId && sessions.has(sessionId)) {
    // Reuse existing session
    transport = sessions.get(sessionId)!;
  } else {
    // New session: spin up a fresh McpServer + transport
    const server = createWc26McpServer();

    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => {
        sessions.set(sid, transport);
      },
    });

    transport.onclose = () => {
      if (sessionId) sessions.delete(sessionId);
    };

    await server.connect(transport);
  }

  await transport.handleRequest(req, res, req.body);
});

/**
 * GET /mcp  — Client opens SSE stream to receive server-initiated messages
 *             (progress notifications, etc.).
 */
app.get("/mcp", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (!sessionId || !sessions.has(sessionId)) {
    res.status(400).json({ error: "Invalid or missing mcp-session-id" });
    return;
  }

  const transport = sessions.get(sessionId)!;
  await transport.handleRequest(req, res);
});

/**
 * DELETE /mcp  — Client terminates the session.
 */
app.delete("/mcp", (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (sessionId) {
    sessions.delete(sessionId);
  }

  res.status(204).send();
});


// ── Root — developer docs ────────────────────────────────────────────

app.get("/", (req, res) => {
  if (req.accepts("application/json") && !req.accepts("text/html")) {
    res.json({
      name: "wc26-mcp",
      description: "FIFA World Cup 2026 data API for AI agents",
      version: "0.3.1",
      endpoint: "https://wc26-mcp-production.up.railway.app/mcp",
      protocol: "MCP Streamable HTTP",
      payment: {
        scheme: "x402",
        price: "$0.002 USDC per call",
        network: "eip155:84532",
        payTo: WALLET_ADDRESS,
        facilitator: "https://x402.org/facilitator",
      },
      tools: 18,
      llms_txt: "https://wc26-mcp-production.up.railway.app/llms.txt",
      openapi: "https://wc26-mcp-production.up.railway.app/openapi.json",
      source: "https://github.com/jordanlyall/wc26-mcp",
      homepage: "https://wc26.ai",
    });
    return;
  }
  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WC26 MCP — x402 API</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0a; color: #e0e0e0; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 14px; line-height: 1.7; padding: 48px 24px; }
    .container { max-width: 720px; margin: 0 auto; }
    h1 { font-size: 22px; font-weight: 600; color: #fff; margin-bottom: 4px; }
    .subtitle { color: #666; margin-bottom: 40px; }
    h2 { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #555; margin: 36px 0 12px; }
    .badge { display: inline-block; background: #1a2a1a; color: #4ade80; border: 1px solid #1f3a1f; border-radius: 4px; padding: 2px 8px; font-size: 11px; margin-bottom: 20px; }
    .card { background: #111; border: 1px solid #1e1e1e; border-radius: 8px; padding: 20px 24px; margin-bottom: 12px; }
    .card p { color: #888; font-size: 13px; margin-top: 2px; }
    code, pre { background: #161616; border: 1px solid #222; border-radius: 6px; }
    pre { padding: 16px 20px; overflow-x: auto; color: #a0c8ff; font-size: 13px; line-height: 1.6; }
    code { padding: 1px 6px; font-size: 12px; color: #a0c8ff; }
    .tool-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .tool { background: #111; border: 1px solid #1e1e1e; border-radius: 6px; padding: 10px 14px; }
    .tool-name { color: #c9a0ff; font-size: 12px; }
    .tool-desc { color: #555; font-size: 11px; margin-top: 2px; }
    .kv { display: flex; gap: 12px; margin-bottom: 8px; }
    .k { color: #555; min-width: 110px; }
    .v { color: #e0e0e0; }
    a { color: #a0c8ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .footer { margin-top: 48px; color: #333; font-size: 12px; }
  </style>
</head>
<body>
<div class="container">

  <h1>WC26 MCP</h1>
  <p class="subtitle">FIFA World Cup 2026 data API for AI agents — x402 micropayment gated</p>
  <span class="badge">online</span>

  <h2>Endpoint</h2>
  <div class="card">
    <div class="kv"><span class="k">URL</span><span class="v">https://wc26-mcp-production.up.railway.app/mcp</span></div>
    <div class="kv"><span class="k">Protocol</span><span class="v">MCP Streamable HTTP (POST / GET / DELETE)</span></div>
    <div class="kv"><span class="k">Payment</span><span class="v">$0.002 USDC per call — Base Sepolia (chain 84532)</span></div>
    <div class="kv"><span class="k">Wallet</span><span class="v">0x39614af23b76a33e01f33d63657cB3a878217f24</span></div>
    <div class="kv"><span class="k">Facilitator</span><span class="v"><a href="https://x402.org/facilitator">x402.org/facilitator</a></span></div>
  </div>

  <h2>Connect (Claude Desktop)</h2>
  <pre>{
  "mcpServers": {
    "wc26": {
      "url": "https://wc26-mcp-production.up.railway.app/mcp",
      "transport": "http"
    }
  }
}</pre>

  <h2>18 Tools</h2>
  <div class="tool-grid">
    <div class="tool"><div class="tool-name">get_matches</div><div class="tool-desc">Match schedule and results</div></div>
    <div class="tool"><div class="tool-name">get_teams</div><div class="tool-desc">All 48 qualified teams</div></div>
    <div class="tool"><div class="tool-name">get_groups</div><div class="tool-desc">Group stage standings</div></div>
    <div class="tool"><div class="tool-name">get_venues</div><div class="tool-desc">Host stadiums and cities</div></div>
    <div class="tool"><div class="tool-name">get_schedule</div><div class="tool-desc">Full tournament schedule</div></div>
    <div class="tool"><div class="tool-name">get_team_profile</div><div class="tool-desc">Deep team stats and history</div></div>
    <div class="tool"><div class="tool-name">get_city_guide</div><div class="tool-desc">Travel guide for host cities</div></div>
    <div class="tool"><div class="tool-name">get_nearby_venues</div><div class="tool-desc">Venues near a location</div></div>
    <div class="tool"><div class="tool-name">get_historical_matchups</div><div class="tool-desc">Head-to-head team history</div></div>
    <div class="tool"><div class="tool-name">get_standings</div><div class="tool-desc">Live group standings</div></div>
    <div class="tool"><div class="tool-name">get_bracket</div><div class="tool-desc">Knockout bracket</div></div>
    <div class="tool"><div class="tool-name">compare_teams</div><div class="tool-desc">Side-by-side team comparison</div></div>
    <div class="tool"><div class="tool-name">get_odds</div><div class="tool-desc">Tournament betting odds</div></div>
    <div class="tool"><div class="tool-name">get_injuries</div><div class="tool-desc">Player injury reports</div></div>
    <div class="tool"><div class="tool-name">get_news</div><div class="tool-desc">Latest news and updates</div></div>
    <div class="tool"><div class="tool-name">get_fan_zones</div><div class="tool-desc">Official fan zone locations</div></div>
    <div class="tool"><div class="tool-name">get_visa_info</div><div class="tool-desc">Visa requirements by country</div></div>
    <div class="tool"><div class="tool-name">what_to_know_now</div><div class="tool-desc">Real-time tournament highlights</div></div>
  </div>

  <h2>How it works</h2>
  <div class="card">
    <p>Every <code>POST /mcp</code> request is intercepted by the x402 middleware. If no valid payment header is present, the server returns <code>402 Payment Required</code> with a signed payment requirement. An x402-aware client pays $0.002 USDC on Base Sepolia and retries — the middleware verifies settlement via <a href="https://x402.org">x402.org</a> and calls the MCP handler. No subscriptions, no API keys.</p>
  </div>

  <h2>Status</h2>
  <pre>GET /health   → server status + payment config
POST /mcp     → MCP tool call (requires x402 payment)
GET  /mcp     → SSE stream for server-initiated messages
DELETE /mcp   → terminate session</pre>

  <p class="footer">Built on <a href="https://github.com/jordanlyall/wc26-mcp">github.com/jordanlyall/wc26-mcp</a> · <a href="https://wc26.ai">wc26.ai</a></p>

</div>
</body>
</html>`);
});

// ── Agent-friendly discovery routes ─────────────────────────────────

const LLMS_TXT = `# WC26 MCP

> FIFA World Cup 2026 data API for AI agents — x402 micropayment gated

WC26 MCP provides structured data for the 2026 FIFA World Cup across 18 tools.
Every tool call costs $0.002 USDC on Base Sepolia via x402 micropayments.
No API keys or subscriptions required.

## Endpoint

- URL: https://wc26-mcp-production.up.railway.app/mcp
- Protocol: MCP Streamable HTTP (POST / GET / DELETE)
- Payment: $0.002 USDC per call on Base Sepolia (eip155:84532)
- Wallet: 0x39614af23b76a33e01f33d63657cB3a878217f24
- Facilitator: https://x402.org/facilitator

## Tools

- get_matches: Query the 104-match schedule by date, team, group, venue, round, or status
- get_teams: All 48 qualified nations with FIFA rankings and confederations
- get_groups: Group stage standings, teams, and schedules
- get_venues: 16 host stadiums with capacity, location, and travel info
- get_schedule: Full tournament schedule with timezone conversion support
- get_team_profile: Deep team history, manager, formation, and star players
- get_city_guide: Travel guide for host cities (food, transport, hotels, attractions)
- get_nearby_venues: Find stadiums near a given location
- get_historical_matchups: Head-to-head history between any two nations
- get_standings: Live group table standings
- get_bracket: Full knockout bracket from Round of 32 to Final
- compare_teams: Side-by-side comparison of two teams
- get_odds: Tournament and match betting odds
- get_injuries: Player injury and suspension reports by team
- get_news: Latest World Cup news with category and recency filters
- get_fan_zones: Official FIFA Fan Festival locations with hours and amenities
- get_visa_info: Entry requirements for fans traveling to the US, Canada, or Mexico
- what_to_know_now: Real-time tournament highlights and key talking points

## Payment flow

1. Client sends POST /mcp without payment header
2. Server returns 402 with signed payment requirements
3. Client pays $0.002 USDC on Base Sepolia, attaches X-PAYMENT header
4. Server verifies via x402.org facilitator, calls MCP handler
5. Client receives MCP tool response

## OpenAPI spec

GET /openapi.json

## Source

https://github.com/jordanlyall/wc26-mcp
https://wc26.ai
`;

app.get("/llms.txt", (_req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send(LLMS_TXT);
});

app.get("/openapi.json", (_req, res) => {
  res.redirect(301, "https://raw.githubusercontent.com/jordanlyall/wc26-mcp/main/gpt/openapi.json");
});

// ── Health check ────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    server: "wc26-mcp",
    transport: "streamable-http",
    payment: {
      network: NETWORK,
      price: PRICE,
      payTo: WALLET_ADDRESS,
      facilitator: "https://x402.org/facilitator",
    },
  });
});

// ── Start ────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`WC26 MCP HTTP server running on http://localhost:${PORT}`);
  console.log(`  Transport : Streamable HTTP (MCP spec)`);
  console.log(`  Endpoint  : POST/GET/DELETE http://localhost:${PORT}/mcp`);
  console.log(`  Payment   : ${PRICE} USDC per call`);
  console.log(`  Network   : ${NETWORK} (Base Sepolia)`);
  console.log(`  Wallet    : ${WALLET_ADDRESS}`);
  console.log(`  Facilitator: https://x402.org/facilitator`);
});
