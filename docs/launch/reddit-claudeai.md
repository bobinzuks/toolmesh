# I built an MCP server that turns your agent's product recommendations into affiliate revenue

Every time Claude recommends a database, a hosting platform, or a payment
processor, someone signs up. The developer who asked the question gets a good
answer. The SaaS company gets a customer. The person who built the agent gets
nothing.

I kept running into this. My agents recommend tools all day long. Supabase,
Vercel, Stripe, PlanetScale -- real products that people actually go sign up
for. But there was no mechanism to attach an affiliate link to those
recommendations. So I built one.

**Agent Affiliate Network** is an MCP server. You install it, your agent gets
four new tools: `recommend_product`, `compare_products`, `find_alternative`,
and `get_stack_recommendation`. When a user asks "what database should I use
for my SaaS startup?", the agent calls the tool, gets scored results, and
returns them with your affiliate links attached.

**The part that makes this not just ads:** The scoring engine is
commission-blind. It literally cannot see commission rates when it ranks
products. The pipeline works in stages -- first it scores candidates across 13
perspectives (semantic match, budget fit, tech stack compatibility, scalability,
ecosystem maturity, etc.), ranks them by composite fit score, and only AFTER
ranking does it attach affiliate links. There is an anti-sycophancy gate that
audits every recommendation to verify the highest-commission product did not get
artificially promoted. If you look at the source, the `stripCommissionData()`
function removes all payout information before the scoring function ever runs.

Here is what the output looks like for "database for SaaS startup":

```
Supabase -- 87% fit
  Best for: full-stack apps, rapid prototyping, startups needing auth + db
  Pricing: Free tier; Pro $25/mo
  Integrates with: Next.js, React, Vercel
  [affiliate link]

PlanetScale -- 81% fit
  Best for: MySQL workloads, high-traffic applications
  Pricing: Scaler $39/mo
  [affiliate link]
```

Every recommendation includes an FTC disclosure. The entire pipeline runs
locally -- no data leaves your machine, no external API calls for the
recommendation engine. Embeddings are generated locally.

Install:

```bash
claude mcp add aan -- npx -y @aan/mcp
```

36 products across 18 categories. Open source, MIT licensed.

There is also an A2A gossip mesh so agents can share product knowledge
peer-to-peer, but that is a topic for another post.

Realistic expectations on conversion: industry affiliate rates are 3-8%, not
30%. This is passive income from recommendations your agent is already making,
not a get-rich scheme.

GitHub: https://github.com/bobinzuks/agent-affiliate-network
npm: `@aan/mcp`
