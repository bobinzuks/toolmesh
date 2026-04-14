# Twitter/X Thread

---

**1/**
AI agents recommend tools to millions of users daily. For free. Nobody earns anything. I built the fix.

---

**2/**
Agent Affiliate Network is an MCP server. Install it, your agent gets product recommendation tools. When users ask "what database should I use?" -- it returns scored results with your affiliate links attached.

---

**3/**
Four tools: recommend_product, compare_products, find_alternative, get_stack_recommendation. 36 products, 18 categories. The agent calls them naturally during conversation.

---

**4/**
The scoring engine is commission-blind. It cannot see affiliate payouts when it ranks products. Commission data is stripped before scoring begins. Reattached only after ranking is final.

---

**5/**
Products are scored across 13 perspectives: semantic match, budget fit, tech stack compatibility, scalability, ecosystem maturity, integration density, and more. Ranked by composite fit. Not by who pays the most.

---

**6/**
There is an anti-sycophancy gate that audits every recommendation. If the highest-commission product got promoted over a better-fit product, the gate fails. Runtime verification of the architectural guarantee.

---

**7/**
Includes an A2A gossip mesh. Agents share product knowledge peer-to-peer. A database-specialist agent can feed recommendations to a frontend agent. Optional, off by default.

---

**8/**
Tech stack: MCP SDK, sqlite-vec for local vector search, hash-based embeddings (no external API calls), Zod validation. Everything runs locally. No data leaves your machine.

---

**9/**
One command to install:

claude mcp add aan -- npx -y @aan/mcp

Works with Claude Code, Cursor, Windsurf, and any MCP-compatible editor.

---

**10/**
Open source, MIT licensed. Realistic conversion: 3-8%, not 30%. Passive revenue from recommendations your agent already makes.

GitHub: github.com/bobinzuks/agent-affiliate-network
npm: @aan/mcp

---
