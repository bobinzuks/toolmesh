# Agent Affiliate Network (AAN)

**Agents recommend. You earn.**

AAN is an MCP server that gives AI agents the ability to recommend SaaS products
based on what users actually need. Recommendations are scored by fit, not by
commission rate. When users follow a recommendation, your affiliate links are
attached automatically. The entire pipeline runs locally -- no data leaves your
machine.

## Quick Install

For Claude Code:

```bash
claude mcp add aan -- npx -y @aan/mcp
```

For Cursor, Windsurf, and other MCP-compatible editors:

```bash
npx add-mcp @aan/mcp
```

## What It Does

AAN exposes four MCP tools to any connected agent:

| Tool                       | Description                                              |
|----------------------------|----------------------------------------------------------|
| `recommend_product`        | Get scored product recommendations based on a need       |
| `compare_products`         | Compare multiple products side-by-side for a use case    |
| `find_alternative`         | Find alternatives to a product you are unhappy with      |
| `get_stack_recommendation` | Get a full-stack recommendation covering multiple categories |

Agents call these tools naturally during conversation. When a user asks "What
database should I use for this project?" the agent calls `recommend_product`,
gets scored results, and presents them with your affiliate links embedded.

## How Recommendations Work

AAN uses a commission-blind scoring pipeline. The recommendation engine does
not know or consider affiliate commission rates when ranking products. Here is
the pipeline:

1. **Need analysis** -- The user's request is parsed into structured criteria:
   category, budget, team size, tech stack requirements.
2. **Semantic search** -- The need is embedded locally and matched against the
   product registry using sqlite-vec vector similarity.
3. **Fit scoring** -- Each candidate is scored on category match, budget fit,
   integration compatibility, and feature coverage. Commission data is not
   part of the scoring function.
4. **Affiliate linking** -- Only after scoring and ranking are affiliate links
   attached to the results. Links come from your `.aanrc.json` configuration
   or fall back to default program links.

This trust-first design means agents always recommend the best product for the
user. You earn when good recommendations convert, not by gaming the ranking.

## Configuration

Create a `.aanrc.json` file in your project root or home directory to configure
custom affiliate IDs:

```json
{
  "affiliateIds": {
    "vercel": "your-vercel-partner-id",
    "supabase": "your-supabase-ref",
    "stripe": "your-stripe-ref"
  },
  "dataDir": "~/.aan/data"
}
```

AAN looks for configuration in this order:

1. `.aanrc.json` in the current working directory
2. `.aanrc.json` in your home directory
3. Built-in defaults

## CLI Commands

```
aan init       Write MCP config entries for detected editors
aan seed       Seed the database with initial products
aan status     Show database stats (product count, categories, programs)
aan serve      Start the MCP server on stdio
aan help       Show help
```

### Typical setup

```bash
npx @aan/mcp init     # Configure your editors
npx @aan/mcp seed     # Populate the product registry
npx @aan/mcp status   # Verify everything is loaded
```

After running `init`, restart your editor. The agent will have access to all
four recommendation tools.

## Architecture

AAN is designed to run entirely on your local machine with no external API
calls for the recommendation pipeline.

- **MCP SDK** -- Built on `@modelcontextprotocol/sdk` for standard tool
  transport over stdio.
- **SQLite + sqlite-vec** -- Product registry and vector similarity search
  stored in a single local database file.
- **Local embeddings** -- Hash-based embedder generates vectors without
  calling any external embedding API.
- **Zod schemas** -- All tool inputs are validated with Zod schemas before
  reaching the recommendation engine.

```
src/
  mcp/             MCP server and tool definitions
  recommendation/  Scoring engine and recommendation logic
  registry/        Product database, embedder, seeder
  types/           Configuration and shared types
```

## Development

```bash
git clone https://github.com/anthropic/agent-affiliate-network.git
cd agent-affiliate-network
npm install
npm run build
npm start
```

Run in watch mode during development:

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
