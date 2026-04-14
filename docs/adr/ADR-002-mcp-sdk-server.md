# ADR-002: Use @modelcontextprotocol/sdk for MCP Server

**Status:** Accepted

## Context

The Agent Affiliate Network exposes four tools to AI agents via the Model Context Protocol:

1. `search_products` -- semantic product search with filters
2. `get_recommendation` -- commission-blind ranked recommendation
3. `get_affiliate_link` -- retrieve affiliate URL for a product
4. `report_outcome` -- report conversion/churn for trust scoring

The MCP server must support two transports: **stdio** (for local agent integration via Claude Desktop, Cursor, etc.) and **HTTP with SSE** (for remote agent access over the mesh). It must validate input schemas, handle errors gracefully, and be distributable as a standard npm package.

Alternatives evaluated:

| Option | Verdict |
|--------|---------|
| **@modelcontextprotocol/sdk v1.29.0** | Official TypeScript SDK. Maintained by Anthropic. Supports stdio + HTTP/SSE transports. Zod-based schema validation. Active development. |
| **@sparkleideas/mcp** | Community fork with extra features but lags behind spec updates. Risk of divergence. |
| **fastmcp (Rust)** | High performance but requires Rust toolchain. Cannot distribute as pure npm package. |
| **agenterra** | Opinionated framework that bundles its own agent runtime. Too much surface area for a focused tool server. |
| **Raw JSON-RPC over stdio** | Maximum control but re-implements transport negotiation, schema validation, error formatting. Months of undifferentiated work. |

## Decision

Use **@modelcontextprotocol/sdk v1.29.0** as the MCP server framework.

Tool registration pattern:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
  name: "agent-affiliate-network",
  version: "1.0.0",
});

server.tool(
  "search_products",
  "Search affiliate products by semantic similarity with optional filters",
  {
    query: z.string().describe("Natural language product search query"),
    category: z.string().optional(),
    maxResults: z.number().default(5),
    minTrustScore: z.number().min(0).max(1).default(0.3),
  },
  async ({ query, category, maxResults, minTrustScore }) => {
    // Phase 1: commission-blind search (ADR-003)
    // Phase 2: attach affiliate links
    return { content: [{ type: "text", text: JSON.stringify(results) }] };
  }
);
```

## Consequences

**Positive:**

- Distributable as `npx agent-affiliate-network` or `npm install -g agent-affiliate-network`. No binary compilation.
- Zod schemas provide runtime validation and auto-generate tool descriptions for agent discovery.
- stdio transport works out of the box with Claude Desktop, Cursor, Windsurf, and any MCP-compatible client.
- HTTP/SSE transport enables remote access for A2A mesh agents (ADR-004).
- Spec compliance is maintained automatically as the SDK tracks protocol revisions.

**Negative:**

- Locked to TypeScript/Node.js runtime. Performance ceiling is lower than Rust-based alternatives.
- SDK is still pre-1.0 (v1.29.0 uses 1.x versioning but the protocol spec itself is evolving). Breaking changes possible.
- HTTP/SSE transport requires additional auth middleware (API key validation) that the SDK does not provide out of the box.

**Mitigations:**

- Pin SDK version. Upgrade deliberately after testing against integration suite.
- Wrap HTTP transport with Express middleware for API key validation and rate limiting.
