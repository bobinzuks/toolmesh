---
title: How I Built an Ad Network for the Agentic Era
published: true
tags: ai, mcp, affiliate, opensource
---

# How I Built an Ad Network for the Agentic Era

## The Problem: Agents Recommend Tools for Free

Every day, AI agents recommend SaaS products to millions of users. "Use
Supabase for your database." "Deploy on Vercel." "Try Stripe for payments."
Users follow these recommendations and sign up. The SaaS company gets a
customer. The user gets a good tool. The developer who built and runs the agent
gets nothing.

Traditional affiliate marketing requires a human to write a blog post, record a
video, or curate a list. But agents are already doing this work -- evaluating
products against requirements and presenting recommendations -- with no
mechanism to capture affiliate revenue from the conversions they drive.

I wanted to fix that without turning agent conversations into ad placements.

## The Solution: An MCP Server with Affiliate Links

Agent Affiliate Network (AAN) is an MCP server that exposes four tools to any
connected AI agent:

- `recommend_product` -- Score and rank products based on a described need
- `compare_products` -- Compare specific products head-to-head for a use case
- `find_alternative` -- Find replacements for a product you want to switch from
- `get_stack_recommendation` -- Build a full tool stack across multiple categories

When a user asks their agent "what database should I use for my SaaS project?",
the agent calls `recommend_product`. The server scores candidates, ranks them,
attaches your affiliate links, and returns structured results with an FTC
disclosure.

Installation is one command:

```bash
claude mcp add aan -- npx -y @aan/mcp
```

Or for Cursor, Windsurf, and other MCP-compatible editors:

```bash
npx add-mcp @aan/mcp
```

## Why Trust Matters: Commission-Blind Scoring

The obvious concern: if you attach affiliate links to recommendations, the
incentive is to recommend whatever pays the highest commission. This is exactly
what makes most ad-supported content unreliable.

AAN solves this architecturally, not with policy. The scoring engine literally
cannot access commission data during ranking. Here is how:

1. Products are retrieved via vector similarity search against the user's need.
2. All commission and affiliate data is stripped from the candidates by a
   function called `stripCommissionData()` before they enter the scoring
   pipeline.
3. Candidates are scored across 13 weighted perspectives.
4. Candidates are ranked by composite fit score.
5. Only after ranking is finalized do affiliate links get reattached.

There is also an anti-sycophancy gate that runs on every recommendation. It
compares the highest-fit product against the highest-commission product. If the
highest-commission product got ranked first despite a lower fit score, the gate
fails and the anomaly is logged. In practice, this should never fire because
commission data is not present during scoring -- the gate is a runtime
verification of the architectural guarantee.

## How It Works Technically

The recommendation engine scores products across 13 perspectives, 7 of which
are actively computed:

| Perspective          | Weight | Description                             |
|----------------------|--------|-----------------------------------------|
| Semantic similarity  | 0.25   | Vector match to the user's described need |
| Budgetary fit        | 0.15   | Price vs. stated budget constraint       |
| Technical fit        | 0.15   | Integration overlap with current stack   |
| Scalability          | 0.10   | Team size alignment                      |
| Community/ecosystem  | 0.10   | Feature breadth and integration density  |
| Integration density  | 0.10   | Stack overlap ratio                      |
| Freshness/trust      | 0.05   | Maintenance and reliability signal       |

Six additional perspectives (causal, temporal, migration cost, vendor stability,
sentiment, competitive position) return neutral scores until Phase 2 data
sources are wired in.

The tool input schemas are defined with Zod:

```typescript
const RecommendProductInput = z.object({
  need: z.string().min(3).describe('What the user needs'),
  category: z.enum(CATEGORIES).optional().describe('Category filter'),
  budget_max_monthly: z.number().min(0).optional()
    .describe('Max monthly budget in USD'),
  tech_stack: z.string().optional()
    .describe('Comma-separated current tech stack'),
  team_size: z.enum(['solo','small','medium','large','enterprise']).optional(),
  max_results: z.number().int().min(1).max(10).default(3),
});
```

The vector store is sqlite-vec running inside a local SQLite database. Embeddings
are generated locally using a hash-based embedder -- no external API calls, no
data leaving your machine. The product registry ships with 36 products across 18
categories (database, auth, hosting, payments, monitoring, analytics, CMS, and
more).

## The A2A Mesh: Agent-to-Agent Knowledge Sharing

AAN includes a gossip-based A2A (agent-to-agent) mesh. Agents can share product
knowledge, recommendation results, and trust signals with each other
peer-to-peer.

The mesh has three components:

- **PeerStore** -- Tracks known agent peers and their capabilities
- **TrustEngine** -- Scores peer reliability based on recommendation accuracy
- **SkillRouter** -- Routes specialized queries to the agent best equipped to
  answer them

This means an agent that specializes in database recommendations can share its
knowledge with an agent that mainly handles frontend tooling. The mesh is
optional and off by default.

## Getting Started

Install and configure:

```bash
# Add to Claude Code
claude mcp add aan -- npx -y @aan/mcp

# Or seed the database and verify
npx @aan/mcp seed
npx @aan/mcp status
```

Configure your affiliate IDs in `.aanrc.json`:

```json
{
  "affiliateIds": {
    "vercel": "your-vercel-partner-id",
    "supabase": "your-supabase-ref",
    "stripe": "your-stripe-ref"
  }
}
```

The agent will now have access to all four recommendation tools. When a user
asks about tools, the agent calls the appropriate tool and returns scored,
linked results.

Example output for "database for a SaaS startup":

```
Supabase -- 87% fit
  Best for: full-stack apps, rapid prototyping, startups
  Pricing: Free tier; Pro $25/mo
  Integrates with: Next.js, React, Vercel

PlanetScale -- 81% fit
  Best for: MySQL workloads, high-traffic applications
  Pricing: Scaler $39/mo

[FTC Disclosure: Links may be affiliate links. Recommendations are
scored by product fit, not commission rate.]
```

## What's Next

The current registry has 36 products. The roadmap includes:

- **Phase 2 perspectives** -- Wiring in real-time sentiment data, vendor
  stability signals, and migration cost estimates for the 6 stub dimensions
- **Custom product registry** -- Let developers add their own products and
  affiliate programs to the local database
- **Dashboard** -- A local web UI for viewing recommendation analytics,
  conversion tracking, and audit logs
- **More affiliate networks** -- PartnerStack and Rewardful integrations are
  stubbed and ready for implementation
- **Broader product coverage** -- Expanding from 36 to 100+ products across
  more categories

Conversion rates for affiliate programs are typically 3-8%. This is not a
replacement for direct sales -- it is passive revenue from recommendations your
agent is already making.

The project is open source under MIT. Contributions welcome.

GitHub: [github.com/bobinzuks/agent-affiliate-network](https://github.com/bobinzuks/agent-affiliate-network)
npm: `@aan/mcp`
