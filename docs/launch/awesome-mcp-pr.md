# awesome-mcp-servers PR Template

## Suggested Category

**Monetization** (or **Commerce** if Monetization does not exist)

## List Entry

```markdown
- [Agent Affiliate Network](https://github.com/bobinzuks/agent-affiliate-network) - Commission-blind product recommendations with affiliate links for AI agents. Scores products across 13 perspectives without seeing commission rates, attaches affiliate links post-ranking. `@aan/mcp`
```

## PR Title

Add Agent Affiliate Network -- commission-blind affiliate recommendations

## PR Body

### What this server does

Agent Affiliate Network (AAN) is an MCP server that gives AI agents product
recommendation capabilities with affiliate link attachment. It exposes four
tools:

- `recommend_product` -- Scored product recommendations based on user need
- `compare_products` -- Head-to-head product comparison for a use case
- `find_alternative` -- Find alternatives to a product the user wants to replace
- `get_stack_recommendation` -- Full-stack tool recommendations across categories

### Why it belongs on this list

AAN addresses a gap in the MCP ecosystem: monetization of agent-driven product
recommendations. It introduces a commission-blind scoring architecture where
affiliate commission rates are architecturally separated from the ranking
pipeline. Products are scored across 13 weighted perspectives and ranked by
composite fit before affiliate links are attached.

Key technical details:

- Built on `@modelcontextprotocol/sdk`
- Local vector search via sqlite-vec (no external API calls)
- Anti-sycophancy gate audits every recommendation for ranking integrity
- 36 products across 18 categories in the default registry
- A2A gossip mesh for agent-to-agent knowledge sharing
- Runs entirely locally, MIT licensed

### Install

```bash
claude mcp add aan -- npx -y @aan/mcp
```

### Links

- Repository: https://github.com/bobinzuks/agent-affiliate-network
- npm: https://www.npmjs.com/package/@aan/mcp
