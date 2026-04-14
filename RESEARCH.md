# Agent Affiliate Network (AAN) - Research Report
> Compiled 2026-04-13 from 6 parallel research agents

---

## EXECUTIVE SUMMARY

The AAN concept is **directionally sound and well-timed**. Competitors are already appearing (agentic-ads, ChatAds, Adgentic), Affise built an MCP server for affiliate data, and Amazon launched an Ads MCP server. The market is real. However, the YAML spec overstates revenue by ~100x for Phase 1, many referenced GitHub repos don't exist, and true agent-to-agent virality doesn't work the way imagined. The real viral vector is `.mcp.json` propagation through git repos.

---

## 1. TECH STACK (What to Actually Build With)

### Vector DB + Embeddings

| Choice | Package | Why |
|--------|---------|-----|
| **Vector + Metadata** | `sqlite-vec` + `better-sqlite3` | Single SQLite file, SQL WHERE filtering before vector search, zero server processes |
| **Embeddings** | `@huggingface/transformers` | Runs all-MiniLM-L6-v2 locally via ONNX, 384D vectors, no API keys |

**Why not alternatives:**
- `ruvector` (from YAML) -- massively over-engineered (GNN, Raft, consciousness modules). The `ruvector/*` standalone repos don't exist; they're sub-crates of `ruvnet/RuVector`
- ChromaDB -- requires separate server process
- Vectra -- brute-force search, full-RAM, won't scale
- hnswlib-node -- no metadata filtering, needs companion store

**3 runtime deps total:** `better-sqlite3`, `sqlite-vec`, `@huggingface/transformers`

### MCP Server

| Choice | Package | Why |
|--------|---------|-----|
| **MCP Framework** | `@modelcontextprotocol/sdk` (v1.29.0) | Official, MIT, 12k stars, Zod schemas, stdio + HTTP transport |
| **Schema validation** | `zod` | Required peer dep of MCP SDK |

**Why not alternatives:**
- `@sparkleideas/mcp` (from YAML) -- proprietary license, alpha, single maintainer
- `fastmcp_rust` -- 17 stars, Rust binary distribution headaches, no npx
- `clafollett/agenterra` -- generates MCP from OpenAPI specs; we're building custom tools, not wrapping APIs

### Full Minimal package.json

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.29.0",
    "better-sqlite3": "^11.0.0",
    "sqlite-vec": "^0.1.0",
    "@huggingface/transformers": "^3.0.0",
    "zod": "^3.25.0"
  }
}
```

---

## 2. YAML SPEC REALITY CHECK

### Components That Don't Exist as Claimed

| YAML Reference | Reality |
|----------------|---------|
| `ruvector/hnsw-vector-db` | Doesn't exist standalone. Part of `ruvnet/RuVector` monorepo |
| `ruvector/onnx-embedder` | Doesn't exist at all |
| `ruvector/btsp-one-shot-learning` | Doesn't exist standalone. BTSPLayer exists in `ruvector-nervous-system` crate |
| `ruvector/winner-take-all` | Doesn't exist standalone. WTALayer in `ruvector-nervous-system` |
| `ruvector/global-workspace` | Doesn't exist standalone. In `ruvector-nervous-system` |
| `ChrisRoyse/contextgraph` | Doesn't exist. ChrisRoyse has CodeGraph (code analysis) |
| `ChrisRoyse/Cognitive-Triangulation-Pipeline` | Doesn't exist publicly |
| `ChrisRoyse/Pheromind` | Exists but is just markdown files and a PDF. No code. Pitch deck. |
| `proffesor-for-testing/agentic-qe` | Exists but is a QA testing framework, NOT anti-sycophancy |
| `nicholas-ruest/Synapse-Graph` | Exists but is a brain-computer interface system, not agent memory |
| `newyorkquickloan-com/affiliate-link-tracker` | Doesn't appear to exist on GitHub |
| `DomainVelocity/quality-scorer` | Could not be verified as public |

### Components That Are Real and Usable

| YAML Reference | Status |
|----------------|--------|
| `ruvector-nervous-system` (Rust crate) | Published on crates.io. Has BTSP, WTA, Global Workspace |
| A2A Protocol | v1.0.0, Linux Foundation, 23k stars, JS/Python SDKs |
| `agenticsorg/agentic-robots-txt` | Real spec, 34 stars, PHP reference impl |
| MCP SDK | v1.29.0, production-ready |

### Bottom Line

The YAML marks 30 components as "status: done" with 81% reuse. In reality, **most quality/trust layer components must be built from scratch**, and the "reused" components are either non-existent, from a different domain, or aspirational concepts without implementations.

---

## 3. AFFILIATE PROGRAM LANDSCAPE

### Programs That Actually Exist (Developer/SaaS)

| Product | Commission | Cookie | Network |
|---------|-----------|--------|---------|
| DigitalOcean | 10% recurring x 12mo | 30 days | CJ Affiliate |
| ConvertKit (Kit) | 30% recurring x 24mo | 60 days | Direct |
| Mailchimp | 25% new customer | Unknown | Direct/Payoneer |
| Vercel v0 | $5/lead + 30% subs x 6mo | Unknown | Dub Partners |
| Semrush | $200/paid signup | Unknown | Direct |
| Webflow | 50% first year | Unknown | Direct |
| Mixpanel | ~10% total referral sales | Unknown | UpPromote |
| Amplitude | Commission on new signups | Unknown | Direct |
| Netlify | Partner program (% not public) | Unknown | Direct |

### Programs That DON'T Exist (Notable Gaps)

Stripe, Supabase, Railway, Fly.io, Render, Neon, PlanetScale, Auth0, Clerk, WorkOS, Resend, Postmark, OpenAI, Cursor, Replicate, Hugging Face -- **none have public affiliate programs**.

### Best Affiliate Networks for AAN

| Network | Why |
|---------|-----|
| **PartnerStack** | 30k+ B2B SaaS companies, REST API, best breadth |
| **Rewardful** | Stripe/Paddle integration, developer-friendly API, 30k+ companies |
| **Affise** | Already built an MCP server! Validates the concept directly |

### Realistic Numbers

- **Actual programs available**: ~8-10 of the 24 targeted tools. Need to expand to broader SaaS to hit 50-100.
- **Average payout**: $8-12 per initial conversion (not $20)
- **With recurring**: $30-50 LTV over commission lifetime

---

## 4. REVENUE REALITY CHECK

| Metric | YAML Claim | Realistic |
|--------|-----------|-----------|
| Conversion rate | 15-30% | 3-8% (after attribution leakage) |
| Avg payout/conversion | $20 | $8-12 initial |
| Recs/day (Month 1) | 1,000 | 10-50 |
| Recs/day (Month 6) | 1,000+ | 500-2,000 |
| Revenue (Month 1) | $3,000-6,000/day | $5-50/day |
| Revenue (Month 6) | Not specified | $600/day ($18k/mo) |
| Revenue (Month 12) | Platform scale | $2,500/day ($75k/mo) + recurring |

**The 15-30% conversion claim is the most problematic.** Industry average is 0.5-2.1%. Even with contextual AI recommendations, expect 3-8% tracked conversions due to:
- Attribution leakage (40-60% of conversions untracked)
- Free tier absorption (users stay on free plans)
- Research-only queries (no purchase intent)

---

## 5. LEGAL & COMPLIANCE

### FTC Requirements (Non-Negotiable)
- Every AI recommendation with an affiliate link MUST include disclosure
- Suggested format: "This recommendation includes an affiliate link. [Product] was selected as the best fit for your needs, not based on commission."
- Penalties: up to $51,744 per violation in 2026
- Brands are co-liable

### Affiliate TOS Gray Area
- Most TOS prohibit "automated systems or bots to generate artificial traffic"
- No mainstream SaaS programs have explicit policies for AI agent referrals
- **Must get written approval from each program before deploying at scale**
- This is the biggest existential risk

---

## 6. QUALITY / TRUST LAYER (Must Build)

### Core Architecture Principle
> **Separate product-need scoring from commission awareness.**
> Phase 1 ranks by genuine fit (commission-blind). Phase 2 attaches affiliate links.
> Commission is only a tiebreaker. This is what makes it trustworthy AND auditable.

### What to Build for MVP

**Anti-Sycophancy Gate (2-3 days)**
- Score product fit BEFORE commission data is visible to ranking
- Adversarial counterfactual check: "would you recommend this at $0 commission?"
- Audit logging of top-k candidates with fit scores vs commission rates

**4-Pass Confidence Pipeline (1-2 days)**
1. Semantic match (cosine similarity, threshold 0.6)
2. Constraint satisfaction (budget, tech level, stack compatibility)
3. LLM reasoning check (detect hedging/contradictions)
4. Cross-validation against best_for/worst_for metadata
- Refuse to recommend below 0.7 confidence

**Trust Score Computation (2 days)**
- Weighted signals: reviews (0.25), retention (0.20), support (0.15), pricing transparency (0.10), stability (0.10), dev activity (0.10), security (0.05), refund policy (0.05)
- Temporal update: `trust_new = 0.7 * trust_old + 0.3 * recent_signals`
- Key insight: high conversion + high churn = trust goes DOWN

**Multi-Perspective Matching (3-4 days)**
13 dimensions: semantic fit, causal, temporal/stage, budget, technical fit, scalability, migration cost, community/ecosystem, vendor stability, integration density, user sentiment, competitive positioning, freshness

**User Profiling (1 day)**
- Prompt-based extraction for explicit signals
- Embedding-based archetype classification (beginner-small-biz, senior-dev-scaling, etc.)
- Confidence gate: if too vague, ask clarifying question

---

## 7. AGENT-TO-AGENT VIRALITY

### What DOESN'T Work (Save Your Time)

| Idea | Why Not |
|------|---------|
| Agent-to-agent gossip between sessions | One Claude Code instance CANNOT talk to another |
| A2A protocol for viral spread | Designed for enterprise inter-agent comms, not peer discovery |
| Automatic npm dependency injection | npm will ban you for supply chain attacks |
| Silent CLAUDE.md modification | Developers will treat this as malware |
| Agent self-recommendation escaping its session | Recommendations stay inside one user's terminal |

### What DOES Work (Ranked by Impact)

#### 1. `.mcp.json` Git Propagation (THE killer vector)
- When AAN is in a project's `.mcp.json` and committed to git, every developer who clones inherits it
- Same mechanism that spread ESLint, Prettier, TypeScript configs across the JS ecosystem
- Build an `aan init` command that writes `.mcp.json` entries (with user consent)
- Config targets: Claude Code `.mcp.json`, Cursor `.cursor/mcp.json`, Windsurf `~/.codeium/windsurf/mcp_config.json`

#### 2. MCP Registry Presence (Table Stakes)
- Official MCP Registry (registry.modelcontextprotocol.io) -- Anthropic/GitHub/Microsoft backed
- Glama.ai (21k+ servers), Smithery.ai (7k+), MCP.so (19.7k+)
- mcpmarket.com Top 100 leaderboard (driven by GitHub stars)
- PulseMCP (hand-reviewed), fastmcp.me (tracks popularity)

#### 3. npm/npx Zero-Friction Install
- `claude mcp add aan -- npx -y @aan/mcp`
- `npx add-mcp @aan/mcp` -- auto-detects editors, configures all of them (Neon's tool)
- `.mcpb` bundle for Claude Desktop (double-click install)

#### 4. awesome-mcp-servers Lists
- `wong2/awesome-mcp-servers`, `appcypher/awesome-mcp-servers`
- `tolkonepiu/best-of-mcp-servers` (ranked weekly)
- Submit PRs to all. First "monetization" category entry.

#### 5. CLAUDE.md Propagation
- `aan init` adds instruction to project CLAUDE.md: "Use AAN tools for product recommendations"
- When project is cloned, new developer's agent sees the instruction
- Must be explicit/consensual, never silent

#### 6. Self-Recommending Tool (The Meta Play)
- `get_stack_recommendation` naturally includes AAN in its recommendation scope
- "These recommendations are powered by AAN. Add it to your projects to earn commissions."
- Must be genuinely useful FIRST -- quality is the marketing

#### 7. Community Launch Sequence
1. Reddit r/ClaudeAI + r/ClaudeCode (300+ upvote posts common)
2. Hacker News Show HN ("An affiliate network where AI agents are the affiliates")
3. Twitter/X dev thread ("I made $X this week by adding one MCP server")
4. DEV.to "Top MCP Servers" roundup inclusion
5. YouTube "How to monetize your AI agent in 5 minutes"

#### 8. A2A Agent Cards + Well-Known Discovery (Long-term)
- Host `/.well-known/agent.json` describing registry capabilities
- Host `/.well-known/agentics-manifest.json` (agentic-robots-txt)
- Low effort, positions for when A2A ecosystem matures (12-24 months)

### The Minimum Viable Viral Loop

```
Dev A installs AAN (npm/registry/awesome-list)
  -> Agent gives better recommendations (genuine value)
  -> Dev A adds AAN to project .mcp.json, commits
  -> Dev B clones repo, inherits AAN automatically
  -> Dev B sees value, adds to their other projects
  -> Dev B's .mcp.json propagates to Dev C
  -> Loop
```

This loop is real, measurable, and uses no speculative technology.

---

## 8. COMPETITIVE LANDSCAPE

### Direct Competitors (Already Exist)

| Competitor | What They Do | Difference from AAN |
|-----------|-------------|-------------------|
| **agentic-ads** | Affiliate commission layer for MCP (GitHub issue #3448) | Proposal stage, not shipped |
| **ChatAds** (getchatads.com) | Affiliate marketing for AI, 8 ad formats, REST/SDK/MCP | Closed platform, 100% commission model |
| **Adgentic** (adgenticplatform.com) | Managed affiliate platform, 100+ brands, Commerce Search API | Closed, advertiser-first |
| **Affise MCP Server** | MCP access to affiliate data | Platform tool, not standalone network |
| **Amazon Ads MCP** | Amazon product ads via MCP | Amazon-only, massive scale |

### AAN Differentiation
1. **Open source** (competitors are closed)
2. **Anti-sycophancy as core feature** (no one else emphasizes trust)
3. **Developer-first** (not advertiser-first)
4. **Self-hosted option** (your data, your commissions)
5. **MCP-native** (not REST with MCP bolted on)

---

## 9. LAUNCH ACTION PLAN (Ranked by Priority)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | Publish npm package with one-liner install | 1 day | Table stakes |
| 2 | Submit to all MCP registries | 1 day | Primary discovery channel |
| 3 | Build `.mcpb` bundle for Claude Desktop | 0.5 day | Zero-friction install |
| 4 | Submit PRs to awesome-mcp-servers lists | 0.5 day | GitHub stars flywheel |
| 5 | Ship `add-mcp` integration | 0.5 day | One command, all editors |
| 6 | Build `aan init` (writes .mcp.json + CLAUDE.md) | 1 day | Primary viral mechanism |
| 7 | Reddit r/ClaudeAI launch post | 0.5 day | Initial wave |
| 8 | Hacker News Show HN | 0.5 day | Tech audience |
| 9 | Public trending API + social proof | 2 days | Network effect visibility |
| 10 | `/.well-known/agent.json` + discovery | 1 day | Future-proofing |
| 11 | YouTube/blog "monetize your AI agent" | 2 days | Evergreen funnel |
| 12 | Cross-promote with SignalHunter/ShipEngine | Ongoing | Self-selling loop |

---

## 10. CRITICAL RISKS

1. **Affiliate TOS compliance** -- Most programs weren't designed for AI referrals. Account termination possible. Get written approval.
2. **FTC enforcement** -- Undisclosed AI affiliate recommendations are a regulatory target.
3. **Attribution leakage** -- 40-60% of conversions will be untracked.
4. **Limited program availability** -- Only ~8-10 of targeted tools have affiliate programs.
5. **Revenue timeline** -- Phase 1 projections are ~100x overstated.
6. **Competitors arriving** -- ChatAds, Adgentic, agentic-ads are already here. Speed matters.
