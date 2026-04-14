# Show HN: Agent Affiliate Network -- Commission-blind product recommendations for AI agents

AI agents recommend SaaS tools constantly. Users sign up. Nobody in the chain
earns affiliate revenue from those recommendations. AAN is an MCP server that
gives agents product recommendation tools with affiliate links attached
post-ranking.

The key design constraint: the scoring engine never sees commission data. Products
are scored across 13 weighted perspectives (semantic similarity, budget fit, tech
stack compatibility, scalability, ecosystem maturity, integration density, and
more), ranked by composite fit, and only then do affiliate links get attached. An
anti-sycophancy gate audits each recommendation to verify ranking integrity.

Stack: MCP SDK for tool transport, sqlite-vec for local vector search,
hash-based embedder (no external API calls), Zod for input validation, A2A
gossip mesh for agent-to-agent product knowledge sharing. Everything runs
locally. 36 products, 18 categories, MIT licensed.

```
claude mcp add aan -- npx -y @aan/mcp
```

GitHub: https://github.com/bobinzuks/agent-affiliate-network
