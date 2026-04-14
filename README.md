# ToolMesh

**The developer tool directory your AI agent actually needs.**

AI agents answer "what tool should I use?" thousands of times a day, and they
do it from stale training data. ToolMesh gives them a curated, searchable,
always-current directory of 200+ developer tools -- databases, hosting
platforms, auth providers, payment processors, and more -- with honest,
commission-blind scoring so the best tool wins every time.

## Quick Install

For Claude Code:

```bash
claude mcp add toolmesh -- npx -y @toolmesh/mcp
```

For Cursor, Windsurf, and other MCP-compatible editors:

```bash
npx add-mcp @toolmesh/mcp
```

Then seed the directory:

```bash
npx @toolmesh/mcp seed
```

## What It Does

ToolMesh exposes four MCP tools to any connected agent:

| Tool                       | What it does                                                  |
|----------------------------|---------------------------------------------------------------|
| `recommend_product`        | Search the directory by need and get scored results            |
| `compare_products`         | Compare two or more tools side-by-side for a use case         |
| `find_alternative`         | Find a replacement for a tool you are unhappy with            |
| `get_stack_recommendation` | Get a full-stack recommendation across multiple categories    |

When a user asks "What database should I use for this project?", the agent
calls `recommend_product`, gets scored results from the directory, and presents
them. No external API calls -- the entire pipeline runs locally.

## What's In The Directory

ToolMesh ships with a growing seed of 200+ tools across these categories:

| Category         | Examples                                           |
|------------------|----------------------------------------------------|
| Database         | Supabase, PlanetScale, Neon, MongoDB, Turso, Xata  |
| Hosting          | Vercel, Railway, Render, Fly.io, Netlify, Coolify  |
| Auth             | Clerk, Auth0, Supabase Auth, WorkOS                |
| Email            | Resend, Postmark, SendGrid, Mailgun, Amazon SES    |
| Payments         | Stripe, Lemonsqueezy, Paddle                       |
| Analytics        | PostHog, Mixpanel, Plausible, Amplitude            |
| Monitoring       | Sentry, Datadog, Better Stack                      |
| Search           | Algolia, Meilisearch, Typesense                    |
| SEO              | Ahrefs                                             |
| Infrastructure   | Cloudflare                                         |

You can add your own tools via `products.json` (see Configuration below).

## How Scoring Works

ToolMesh uses a commission-blind scoring pipeline:

- **Fit scoring only.** Each tool is scored on category match, budget fit,
  integration compatibility, and feature coverage. Commission data is never
  part of the scoring function.
- **Semantic search.** User needs are embedded locally and matched against the
  product registry using sqlite-vec vector similarity. No data leaves your
  machine.
- **Links applied last.** Only after scoring and ranking are any referral links
  attached to results. The ranking cannot be influenced by link status.

## Funding Disclosure

Roughly 50 of the listed products carry affiliate referral links. Revenue from
those links funds ongoing development and directory maintenance. The scoring
pipeline has no access to commission data and cannot be influenced by it. Tools
without affiliate links are scored identically.

## Configuration

Create a `.toolmeshrc.json` file in your project root or home directory:

```json
{
  "affiliateIds": {
    "vercel": "your-vercel-partner-id",
    "supabase": "your-supabase-ref"
  },
  "excludedProducts": [],
  "preferredCategories": [],
  "dataDir": "~/.toolmesh"
}
```

ToolMesh checks for configuration in this order:

1. `.toolmeshrc.json` in the current working directory
2. `.toolmeshrc.json` in your home directory
3. Built-in defaults

### Custom Products

Run `toolmesh products` to generate a `products.json` file where you can add
your own tools to the directory or override referral links on existing ones.
After editing, run `toolmesh seed` to load changes into the database.

## CLI Commands

```
toolmesh init              Write MCP config entries for detected editors
toolmesh seed              Seed the database with products
toolmesh status            Show database stats (product count, categories)
toolmesh products          Create/show products.json for custom tools
toolmesh dashboard         Start the developer dashboard (default port 3847)
toolmesh agent-card        Print the A2A Agent Card JSON to stdout
toolmesh well-known        Generate .well-known/ discovery files for A2A mesh
toolmesh serve             Start the MCP server on stdio
toolmesh help              Show help
```

### Typical Setup

```bash
npx @toolmesh/mcp init      # Configure your editors
npx @toolmesh/mcp seed      # Populate the product directory
npx @toolmesh/mcp status    # Verify everything loaded
```

After running `init`, restart your editor. The agent will have access to all
four directory tools.

### A2A Mesh Discovery

ToolMesh supports the Agent-to-Agent (A2A) protocol so other agents can
discover the directory programmatically:

```bash
toolmesh agent-card --url https://your-domain.com
toolmesh well-known --output ./public
```

This generates the standard `.well-known/` files that A2A-compatible agents
use for service discovery.

## For Tool Vendors

Want your developer tool listed in the ToolMesh directory? Open an issue on the
repository with:

- Product name and URL
- Category (database, hosting, auth, email, payments, analytics, monitoring,
  search, or other)
- A short description and key features
- Pricing tiers (free tier, starting price)
- Integration points (languages, frameworks, APIs)

All submissions go through the same commission-blind scoring pipeline. Listing
is free. Referral program participation is optional and does not affect ranking.

## Architecture

Built on `@modelcontextprotocol/sdk`, SQLite + sqlite-vec for local vector
search, local hash-based embeddings (no external API calls), and Zod for input
validation. Node.js >= 20 required.

```
src/
  mcp/             MCP server and tool definitions
  recommendation/  Scoring engine and recommendation logic
  registry/        Product database, embedder, seeder
  mesh/            A2A agent card and .well-known generation
  dashboard/       Developer dashboard UI
  types/           Configuration and shared types
```

## Development

```bash
git clone https://github.com/bobinzuks/toolmesh.git
cd toolmesh
npm install
npm run build
npm start
```

Watch mode:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## Contributing

Contributions are welcome. Please open an issue to discuss significant changes
before submitting a pull request.

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## License

MIT
