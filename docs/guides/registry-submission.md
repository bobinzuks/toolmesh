# MCP Registry Submission Guide

Step-by-step instructions for listing AAN on every major MCP registry.

## Pre-requisites

1. npm package published: `npm publish`
2. GitHub repo public: https://github.com/bobinzuks/agent-affiliate-network

## Submission Order (by impact)

### 1. npm (already done)
Add these keywords to package.json for discoverability:
```json
"keywords": ["mcp", "mcp-server", "model-context-protocol", "ai", "agent", "affiliate", "recommendations", "a2a", "saas", "claude", "llm", "ai-tools"]
```

### 2. Official MCP Registry
```bash
# Install publisher CLI
brew install modelcontextprotocol/tap/mcp-publisher

# Login with GitHub
mcp-publisher login github

# Create server.json in repo root
# (see server.json template below)

# Publish
mcp-publisher publish
```

**server.json:**
```json
{
  "$schema": "https://registry.modelcontextprotocol.io/schemas/server.json",
  "name": "io.github.bobinzuks/agent-affiliate-network",
  "title": "Agent Affiliate Network",
  "description": "AI agents recommend SaaS products with commission-blind scoring. You earn affiliate commissions.",
  "repository": { "url": "https://github.com/bobinzuks/agent-affiliate-network", "source": "github" },
  "version": "0.1.0",
  "packages": [{ "registryType": "npm", "identifier": "@aan/mcp", "version": "0.1.0", "transport": [{ "type": "stdio" }] }]
}
```

### 3. Smithery.ai
Add `smithery.yaml` to repo root:
```yaml
startCommand:
  type: stdio
  configSchema:
    type: object
    properties: {}
    required: []
  commandFunction: |
    (config) => ({ command: "npx", args: ["-y", "@aan/mcp"], env: {} })
```
Then: `npx @anthropic-ai/smithery-cli mcp publish https://github.com/bobinzuks/agent-affiliate-network -n bobinzuks/agent-affiliate-network`

### 4. Glama.ai
Add `glama.json` to repo root:
```json
{ "$schema": "https://glama.ai/mcp/schemas/server.json", "maintainers": ["bobinzuks"] }
```
Push to GitHub. Auto-indexed within 24 hours. Claim at glama.ai.

### 5. wong2/awesome-mcp-servers (51k stars)
Submit at: https://mcpservers.org/submit

### 6. appcypher/awesome-mcp-servers (11k stars)
Fork, add to README, submit PR:
```markdown
- **[Agent Affiliate Network](https://github.com/bobinzuks/agent-affiliate-network)** - Commission-blind product recommendations for AI agents with affiliate links.
```

### 7. MCP.so
Submit issue at: https://github.com/chatmcp/mcp-directory/issues/1

### 8. PulseMCP
Submit at: https://www.pulsemcp.com/submit

### 9. mcpmarket.com
Automatic — indexed from GitHub. Ranking driven by stars.

## Registry Config Files (add all at once)

Add these files to the repo root in one commit:
- `server.json` (official registry)
- `smithery.yaml` (Smithery)
- `glama.json` (Glama)

This lets all three auto-indexing platforms pick up AAN simultaneously.
