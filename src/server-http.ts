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
