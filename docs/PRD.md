# Product Requirements Document: Agent Affiliate Network (AAN)

> **Version:** 1.0.0
> **Date:** 2026-04-13
> **Status:** Draft
> **Tagline:** "Agents recommend. You earn."

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution](#3-solution)
4. [User Personas](#4-user-personas)
5. [User Stories](#5-user-stories)
6. [Functional Requirements](#6-functional-requirements)
7. [MCP Tool Specifications](#7-mcp-tool-specifications)
8. [Quality Gate Specifications](#8-quality-gate-specifications)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Distribution Strategy](#10-distribution-strategy)
11. [Revenue Model](#11-revenue-model)
12. [Competitive Analysis](#12-competitive-analysis)
13. [Risk Assessment](#13-risk-assessment)
14. [Success Metrics](#14-success-metrics)
15. [Milestones and Phases](#15-milestones-and-phases)

---

## 1. Executive Summary

AI agents are already recommending SaaS tools to millions of users daily, completely for free. When a developer asks Claude, Cursor, or Copilot "what database should I use?", the agent gives a thoughtful recommendation and the SaaS company gets a free lead. Nobody earns anything from that referral.

Agent Affiliate Network (AAN) is an MCP server that turns every AI agent product recommendation into a monetized affiliate referral. It provides four tools that agents use to find, compare, and recommend SaaS products, each response carrying a properly disclosed affiliate link. A commission-blind quality layer ensures recommendations are ranked by genuine fit, not payout -- affiliate links are attached only after scoring is complete.

Distribution happens through `.mcp.json` git propagation: when a developer adds AAN to their project configuration and commits it, every future collaborator who clones that repo inherits AAN automatically. This is the same viral mechanism that spread ESLint and Prettier across the JavaScript ecosystem.

The market is validated. ChatAds, Adgentic, and Amazon Ads MCP are already shipping. AAN differentiates on three axes: open source, commission-blind trust scoring, and developer-first self-hosted architecture.

### Honest Numbers

- **Month 1 revenue:** $5-50/day (not thousands)
- **Month 6 revenue:** ~$600/day ($18k/month)
- **Month 12 revenue:** ~$2,500/day ($75k/month) plus accumulated recurring commissions
- **Available affiliate programs at launch:** ~8-10 of targeted developer tools
- **Tracked conversion rate:** 3-8% (industry average is 0.5-2.1%; contextual AI recommendations outperform, but 40-60% of conversions are lost to attribution leakage)

---

## 2. Problem Statement

### 2.1 The Value Leakage Problem

AI coding agents (Claude Code, Cursor, Windsurf, GitHub Copilot) handle millions of "what tool should I use?" queries daily. These recommendations drive real purchasing decisions, but:

- **SaaS companies** get free leads with no attribution
- **Developers running agents** capture zero value from recommendations they facilitate
- **Agent platforms** have no monetization path for recommendation quality

There is no infrastructure connecting AI agent recommendations to affiliate revenue. The value chain is broken at the attribution layer.

### 2.2 The Trust Problem

Existing ad-tech approaches to AI monetization (ChatAds, Adgentic) optimize for advertiser spend, not recommendation quality. This creates a sycophancy risk: agents that recommend whatever pays the highest commission, regardless of fit. Developers will not trust recommendations they suspect are ads.

### 2.3 The Distribution Problem

MCP servers are easy to build but hard to distribute. There is no viral distribution mechanism for AI agent tooling beyond manual registry submission and word-of-mouth.

---

## 3. Solution

AAN is three things:

### 3.1 An MCP Server (The Product)

Four tools that any MCP-compatible agent can call:

1. `recommend_product` -- Find the best product for a stated need
2. `compare_products` -- Compare 2+ products for a specific use case
3. `find_alternative` -- Find a replacement for a product a user is unhappy with
4. `get_stack_recommendation` -- Recommend an entire tech stack for a project type

Each tool returns structured product data with affiliate links and mandatory FTC disclosure text. The server runs locally with zero external API dependencies for core functionality.

### 3.2 A Quality Layer (The Moat)

Commission-blind scoring ensures trust:

- **Phase 1 (Ranking):** Products scored by genuine fit across 13 dimensions. Commission data is not visible to the ranking algorithm.
- **Phase 2 (Monetization):** Affiliate links attached to already-ranked results. Commission serves only as a tiebreaker between products with identical fit scores.
- **Confidence gate:** Recommendations below 0.7 confidence are refused entirely.
- **Trust decay:** Products with high conversion but high churn see their trust scores decrease over time.

### 3.3 A Distribution Mechanism (The Growth Engine)

Git-propagated configuration files:

- `aan init` writes MCP configuration to `.mcp.json` (Claude Code), `.cursor/mcp.json` (Cursor), and equivalent paths for other editors
- When committed, every developer who clones the repo inherits AAN
- The viral loop requires zero speculative technology

---

## 4. User Personas

### 4.1 Solo Developer ("Alex")

- **Profile:** Full-stack developer building side projects
- **Needs:** Quick, trustworthy tool recommendations without hours of research
- **Pain:** Spends 2-4 hours per project evaluating databases, auth providers, hosting, etc.
- **AAN value:** Gets curated recommendations from their AI agent; earns passive affiliate income when their open-source projects propagate AAN configuration to other developers
- **Technical comfort:** High. Will install via npx.

### 4.2 Tech Lead ("Jordan")

- **Profile:** Leads a team of 5-15 engineers at a Series A-C startup
- **Needs:** Standardized tool evaluation across the team; cost-aware recommendations
- **Pain:** Engineers each evaluate tools differently; no institutional knowledge of what works
- **AAN value:** Consistent, auditable recommendation logic; budget-aware scoring; team-wide configuration via committed `.mcp.json`
- **Willingness to pay:** Yes, for analytics and audit features (Pro tier)

### 4.3 DevRel / Technical Blogger ("Sam")

- **Profile:** Creates developer content; already participates in affiliate programs
- **Needs:** Higher conversion rates on tool recommendations
- **Pain:** Traditional affiliate links in blog posts convert at 0.5-2%; readers are skeptical of sponsored recommendations
- **AAN value:** AI-mediated recommendations convert at 3-8%; trust scoring addresses reader skepticism
- **Revenue interest:** Primary motivation

### 4.4 SaaS Vendor ("Priya")

- **Profile:** Head of Growth at a developer tools company
- **Needs:** New distribution channel to reach developers at the moment of decision
- **Pain:** Traditional affiliate programs reach bloggers; AI agents are the new recommendation surface and there is no way to participate
- **AAN value:** Listed in a registry that agents query at the exact moment a developer needs their category of tool
- **Willingness to pay:** $99-299/month listing fee for enhanced placement data

### 4.5 Enterprise Platform Team ("Morgan")

- **Profile:** Runs internal developer platform for a 500+ person engineering org
- **Needs:** Approved tool catalog with policy enforcement; self-hosted, air-gapped option
- **Pain:** Developers use unapproved tools; no way to inject organizational preferences into AI recommendations
- **AAN value:** White-label deployment with custom registry; policy-driven recommendations
- **Willingness to pay:** Enterprise contract

---

## 5. User Stories

### 5.1 Core Recommendation Flow

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-001 | As a developer using an AI agent, I want to ask "what database should I use for my project?" and get a recommendation with an affiliate link, so that I can evaluate the tool and the person running the agent earns a commission. | P0 | Agent calls `recommend_product`, receives structured response with product name, fit score, affiliate URL, and FTC disclosure text. Response time < 500ms for local vector search. |
| US-002 | As a developer, I want to compare two products I'm considering, so that I can make an informed decision with a structured side-by-side analysis. | P0 | Agent calls `compare_products` with 2+ product names and a use case. Response includes per-product scores across relevant dimensions, a winner recommendation, and affiliate links for all compared products. |
| US-003 | As a developer unhappy with my current tool, I want to find an alternative, so that I can migrate with awareness of tradeoffs. | P1 | Agent calls `find_alternative` with current product name and pain points. Response includes alternatives ranked by fit, migration complexity estimate, and affiliate links. |
| US-004 | As a developer starting a new project, I want a complete tech stack recommendation, so that I can bootstrap with confidence. | P1 | Agent calls `get_stack_recommendation` with project type and constraints. Response includes recommendations per stack layer (database, auth, hosting, etc.) with per-product fit scores and affiliate links. |

### 5.2 Quality and Trust

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-005 | As a developer, I want to trust that recommendations are based on fit, not commission, so that I use AAN instead of Googling. | P0 | Ranking algorithm has no access to commission data. Audit log records top-k candidates with fit scores. Commission is only used as tiebreaker between equal-scoring products. |
| US-006 | As a developer, I want the agent to refuse to recommend when it is not confident, so that I don't get bad advice. | P0 | Recommendations below 0.7 composite confidence are not returned. Agent receives a structured "insufficient confidence" response with the reason. |
| US-007 | As a developer, I want to see why a product was recommended, so that I can evaluate the reasoning. | P1 | Response includes a `reasoning` field with the top 3 scoring dimensions and their values. |

### 5.3 Installation and Distribution

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-008 | As a developer, I want to install AAN with a single command, so that setup takes under 60 seconds. | P0 | `npx -y @aan/mcp` starts the server. `claude mcp add aan -- npx -y @aan/mcp` registers it in Claude Code. No API keys required for basic functionality. |
| US-009 | As a developer, I want to add AAN to my project configuration so that my teammates get it automatically. | P0 | `npx @aan/mcp init` writes appropriate entries to `.mcp.json`, `.cursor/mcp.json`, etc. with explicit user confirmation. |
| US-010 | As a developer cloning a repo, I want AAN to be available automatically if the project uses it, so that I get the same tooling as the rest of the team. | P1 | AAN entry in `.mcp.json` is recognized by MCP-compatible editors on project open. No additional install step beyond what the editor already does for MCP servers. |

### 5.4 Monetization

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|-------------------|
| US-011 | As a developer running AAN, I want to configure my own affiliate IDs, so that commissions go to me. | P0 | Configuration file accepts per-network affiliate IDs. Default IDs (AAN's own) are used only when the user has not configured their own. |
| US-012 | As a SaaS vendor, I want to list my product in the AAN registry with rich metadata, so that agents can recommend it accurately. | P2 | Registry accepts structured product entries with: name, category, pricing tiers, integration list, best_for/worst_for tags, and affiliate program details. |
| US-013 | As a Pro subscriber, I want analytics on my recommendations, so that I can see conversion rates and earnings. | P2 | Dashboard shows: recommendations served, click-through rate, tracked conversions, and estimated earnings. Available at Pro tier ($19/month). |

---

## 6. Functional Requirements

### 6.1 Product Registry

| ID | Requirement | Priority |
|----|------------|----------|
| FR-001 | The system shall maintain a local SQLite database of SaaS products with vector embeddings for semantic search. | P0 |
| FR-002 | Each product entry shall include: name, category, description, pricing (tiers), features, integrations, best_for tags, worst_for tags, affiliate program details, trust score, and a 384-dimensional embedding vector. | P0 |
| FR-003 | The registry shall ship with a curated seed dataset of 50-100 developer tools. | P0 |
| FR-004 | The registry shall support user-contributed product entries via a structured submission format. | P2 |
| FR-005 | Product embeddings shall be generated locally using `@huggingface/transformers` (all-MiniLM-L6-v2, ONNX runtime). No external API calls. | P0 |
| FR-006 | The registry shall support SQL metadata filtering (category, price range, integration compatibility) combined with vector similarity search via `sqlite-vec`. | P0 |

### 6.2 MCP Server

| ID | Requirement | Priority |
|----|------------|----------|
| FR-010 | The system shall expose four MCP tools: `recommend_product`, `compare_products`, `find_alternative`, `get_stack_recommendation`. | P0 |
| FR-011 | The MCP server shall support stdio transport for local use and HTTP/SSE transport for remote deployment. | P0 |
| FR-012 | All tool responses shall include FTC-compliant affiliate disclosure text, injected server-side. | P0 |
| FR-013 | The MCP server shall validate all inputs using Zod schemas and return structured error messages for invalid requests. | P0 |
| FR-014 | The server shall be startable via `npx -y @aan/mcp` with zero configuration. | P0 |

### 6.3 Recommendation Engine

| ID | Requirement | Priority |
|----|------------|----------|
| FR-020 | The recommendation engine shall score products using a commission-blind pipeline: fit scoring occurs before affiliate data is attached. | P0 |
| FR-021 | The engine shall implement a 4-pass confidence pipeline: semantic match, constraint satisfaction, LLM reasoning check, cross-validation. | P1 |
| FR-022 | The engine shall refuse to return recommendations with composite confidence below 0.7. | P0 |
| FR-023 | The engine shall score across 13 matching dimensions (see Section 8.3). | P1 |
| FR-024 | Commission data shall be used only as a tiebreaker between products with identical fit scores (delta < 0.01). | P0 |
| FR-025 | The engine shall log all ranking decisions with scores for auditability. | P1 |

### 6.4 Trust Scoring

| ID | Requirement | Priority |
|----|------------|----------|
| FR-030 | Each product shall have a computed trust score (0.0-1.0) based on weighted signals: reviews (0.25), retention (0.20), support quality (0.15), pricing transparency (0.10), stability (0.10), dev activity (0.10), security (0.05), refund policy (0.05). | P1 |
| FR-031 | Trust scores shall decay over time via temporal update: `trust_new = 0.7 * trust_old + 0.3 * recent_signals`. | P1 |
| FR-032 | Products with high conversion rate but high churn rate shall see trust scores decrease. | P1 |
| FR-033 | Trust scores shall be recomputed on a configurable schedule (default: weekly). | P2 |

### 6.5 Configuration and Personalization

| ID | Requirement | Priority |
|----|------------|----------|
| FR-040 | Users shall be able to configure their own affiliate IDs per network/program via a local configuration file. | P0 |
| FR-041 | The system shall fall back to AAN default affiliate IDs when user IDs are not configured. | P0 |
| FR-042 | Users shall be able to set budget constraints, preferred categories, and excluded products. | P1 |
| FR-043 | The `aan init` CLI command shall write MCP configuration to detected editor config files with explicit user consent. | P0 |

### 6.6 Affiliate Link Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-050 | The system shall support multiple affiliate networks: direct programs, PartnerStack, Rewardful, CJ Affiliate, Dub Partners. | P1 |
| FR-051 | Affiliate links shall be generated with proper tracking parameters per network requirements. | P0 |
| FR-052 | The system shall support link rotation for A/B testing of affiliate programs. | P3 |

---

## 7. MCP Tool Specifications

### 7.1 `recommend_product`

**Purpose:** Find the best product for a stated need using semantic search and quality scoring.

**Zod Input Schema:**

```typescript
import { z } from 'zod';

const RecommendProductInput = z.object({
  need: z.string()
    .min(10)
    .max(500)
    .describe('Natural language description of what the user needs. E.g., "a database for a real-time multiplayer game with 10k concurrent users"'),

  category: z.enum([
    'database', 'auth', 'hosting', 'email', 'analytics', 'monitoring',
    'cms', 'payments', 'storage', 'search', 'ci-cd', 'testing',
    'api-gateway', 'message-queue', 'cdn', 'dns', 'logging', 'other'
  ]).optional()
    .describe('Optional category filter to narrow search scope'),

  budget: z.object({
    max_monthly_usd: z.number().min(0).max(100000),
    prefers_free_tier: z.boolean().default(false),
  }).optional()
    .describe('Optional budget constraints'),

  tech_stack: z.array(z.string()).max(20).optional()
    .describe('Current tech stack for integration compatibility scoring. E.g., ["nextjs", "typescript", "vercel"]'),

  team_size: z.enum(['solo', 'small', 'medium', 'large', 'enterprise']).optional()
    .describe('Team size for scaling appropriateness'),

  max_results: z.number().int().min(1).max(10).default(3)
    .describe('Number of recommendations to return'),
});
```

**Zod Output Schema:**

```typescript
const ProductRecommendation = z.object({
  name: z.string(),
  category: z.string(),
  fit_score: z.number().min(0).max(1)
    .describe('Commission-blind fit score (0.0-1.0)'),
  confidence: z.number().min(0).max(1)
    .describe('Composite confidence across all scoring passes'),
  trust_score: z.number().min(0).max(1),
  pricing_summary: z.string(),
  reasoning: z.string()
    .describe('Top 3 reasons this product was recommended'),
  affiliate_url: z.string().url(),
  top_dimensions: z.array(z.object({
    dimension: z.string(),
    score: z.number(),
    explanation: z.string(),
  })).max(5),
});

const RecommendProductOutput = z.object({
  recommendations: z.array(ProductRecommendation).min(0).max(10),
  disclosure: z.string()
    .describe('FTC-compliant affiliate disclosure. Always present.'),
  query_context: z.object({
    total_candidates_evaluated: z.number(),
    confidence_threshold: z.number(),
    candidates_below_threshold: z.number(),
  }),
  refused: z.boolean().default(false)
    .describe('True if no products met the 0.7 confidence threshold'),
  refusal_reason: z.string().optional(),
});
```

**Disclosure text (injected server-side on every response):**

> "These recommendations include affiliate links. Products were selected based on fit for your stated needs, not commission rates. Affiliate commissions help fund this service."

### 7.2 `compare_products`

**Purpose:** Compare 2 or more products for a specific use case with structured scoring.

**Zod Input Schema:**

```typescript
const CompareProductsInput = z.object({
  products: z.array(z.string())
    .min(2)
    .max(5)
    .describe('Product names to compare. E.g., ["Supabase", "Firebase", "PlanetScale"]'),

  use_case: z.string()
    .min(10)
    .max(500)
    .describe('The specific use case to evaluate products against'),

  priorities: z.array(z.enum([
    'cost', 'performance', 'ease-of-use', 'scalability',
    'community', 'documentation', 'integrations', 'security',
    'vendor-stability', 'migration-ease'
  ])).max(5).optional()
    .describe('Optional priority dimensions to weight more heavily'),

  tech_stack: z.array(z.string()).max(20).optional(),
});
```

**Zod Output Schema:**

```typescript
const ProductComparison = z.object({
  name: z.string(),
  fit_score: z.number().min(0).max(1),
  trust_score: z.number().min(0).max(1),
  strengths: z.array(z.string()).max(5),
  weaknesses: z.array(z.string()).max(5),
  pricing_summary: z.string(),
  best_for: z.string(),
  worst_for: z.string(),
  affiliate_url: z.string().url(),
  dimension_scores: z.record(z.string(), z.number()),
});

const CompareProductsOutput = z.object({
  comparisons: z.array(ProductComparison).min(2).max(5),
  winner: z.object({
    name: z.string(),
    reason: z.string(),
  }).nullable()
    .describe('Null if products are too close to call or none meet threshold'),
  disclosure: z.string(),
  use_case_summary: z.string(),
});
```

### 7.3 `find_alternative`

**Purpose:** Find a replacement for a product the user is unhappy with, accounting for migration cost.

**Zod Input Schema:**

```typescript
const FindAlternativeInput = z.object({
  current_product: z.string()
    .describe('The product the user wants to replace'),

  pain_points: z.array(z.string())
    .min(1)
    .max(10)
    .describe('Specific issues driving the switch. E.g., ["pricing increased 3x", "poor support response time", "missing GraphQL support"]'),

  must_have: z.array(z.string()).max(10).optional()
    .describe('Non-negotiable features the alternative must have'),

  tech_stack: z.array(z.string()).max(20).optional(),

  budget: z.object({
    max_monthly_usd: z.number().min(0).max(100000),
  }).optional(),

  max_results: z.number().int().min(1).max(5).default(3),
});
```

**Zod Output Schema:**

```typescript
const AlternativeRecommendation = z.object({
  name: z.string(),
  fit_score: z.number().min(0).max(1),
  trust_score: z.number().min(0).max(1),
  pain_point_resolution: z.array(z.object({
    pain_point: z.string(),
    resolved: z.boolean(),
    explanation: z.string(),
  })),
  migration_complexity: z.enum(['trivial', 'low', 'medium', 'high', 'very-high']),
  migration_notes: z.string(),
  pricing_comparison: z.string(),
  tradeoffs: z.array(z.string()).max(5)
    .describe('Things that are worse than the current product'),
  affiliate_url: z.string().url(),
});

const FindAlternativeOutput = z.object({
  current_product_summary: z.string(),
  alternatives: z.array(AlternativeRecommendation).min(0).max(5),
  disclosure: z.string(),
  refused: z.boolean().default(false),
  refusal_reason: z.string().optional(),
});
```

### 7.4 `get_stack_recommendation`

**Purpose:** Recommend an entire tech stack for a project type.

**Zod Input Schema:**

```typescript
const GetStackRecommendationInput = z.object({
  project_type: z.string()
    .min(10)
    .max(500)
    .describe('Description of the project. E.g., "SaaS analytics dashboard with real-time data, multi-tenant, targeting SMBs"'),

  layers: z.array(z.enum([
    'database', 'auth', 'hosting', 'email', 'analytics', 'monitoring',
    'cms', 'payments', 'storage', 'search', 'ci-cd', 'testing',
    'api-gateway', 'message-queue', 'cdn', 'logging'
  ])).min(1).max(16).optional()
    .describe('Stack layers to recommend. Defaults to auto-detected layers based on project type.'),

  existing_stack: z.record(z.string(), z.string()).optional()
    .describe('Already-chosen tools to ensure compatibility. E.g., {"framework": "nextjs", "language": "typescript"}'),

  budget: z.object({
    max_monthly_usd: z.number().min(0).max(100000),
    prefers_free_tier: z.boolean().default(false),
  }).optional(),

  team_size: z.enum(['solo', 'small', 'medium', 'large', 'enterprise']).optional(),

  optimize_for: z.enum([
    'cost', 'performance', 'developer-experience', 'scalability', 'time-to-market'
  ]).optional()
    .describe('Primary optimization axis for the stack'),
});
```

**Zod Output Schema:**

```typescript
const StackLayerRecommendation = z.object({
  layer: z.string(),
  recommended: z.object({
    name: z.string(),
    fit_score: z.number().min(0).max(1),
    trust_score: z.number().min(0).max(1),
    reasoning: z.string(),
    pricing_summary: z.string(),
    affiliate_url: z.string().url(),
  }),
  runner_up: z.object({
    name: z.string(),
    fit_score: z.number().min(0).max(1),
    reason_not_first: z.string(),
    affiliate_url: z.string().url(),
  }).nullable(),
});

const GetStackRecommendationOutput = z.object({
  project_summary: z.string(),
  stack: z.array(StackLayerRecommendation),
  total_estimated_monthly_cost: z.object({
    low: z.number(),
    high: z.number(),
    currency: z.literal('USD'),
  }),
  integration_notes: z.array(z.string())
    .describe('Notes about how the recommended tools work together'),
  disclosure: z.string(),
});
```

---

## 8. Quality Gate Specifications

The quality layer is AAN's primary differentiator. This section specifies it in detail.

### 8.1 Commission-Blind Architecture

The recommendation pipeline is split into two strict phases:

**Phase 1 -- Fit Scoring (Commission-Blind)**

The ranking function receives:
- User query embedding
- Product embeddings and metadata (features, pricing, integrations, reviews, trust scores)
- User constraints (budget, tech stack, team size)

The ranking function does NOT receive:
- Commission rates
- Affiliate program details
- Revenue data of any kind

**Phase 2 -- Monetization (Post-Ranking)**

After Phase 1 produces a ranked list:
1. Attach affiliate links to all products in the result set
2. If two products have fit scores within 0.01 of each other, the one with higher commission may be promoted (this is the ONLY influence commission has on ordering)
3. Log the pre-commission ranking alongside the final ranking for audit

**Audit Guarantee:** For any recommendation, the system can produce a log showing the commission-blind ranking and the final ranking. If they differ, the log shows exactly why (tiebreaker only).

### 8.2 Four-Pass Confidence Pipeline

Each recommendation passes through four sequential scoring stages. A product must clear all four to be recommended.

**Pass 1: Semantic Match (Threshold: 0.6)**

```
Input: user_query_embedding, product_embedding
Method: cosine_similarity(user_query_embedding, product_embedding)
Output: semantic_score (0.0-1.0)
Gate: semantic_score >= 0.6
```

Products below 0.6 semantic similarity are eliminated. This is a coarse filter using the 384D embeddings from all-MiniLM-L6-v2.

**Pass 2: Constraint Satisfaction (Threshold: 0.5)**

```
Input: user_constraints (budget, tech_stack, team_size), product_metadata
Method: Boolean and fuzzy constraint matching
  - budget: hard fail if no tier within budget; penalty if only enterprise tier
  - tech_stack: weighted Jaccard similarity on integration lists
  - team_size: penalize enterprise tools for solo devs, penalize solo tools for enterprise
Output: constraint_score (0.0-1.0)
Gate: constraint_score >= 0.5
```

**Pass 3: LLM Reasoning Check (Threshold: 0.6)**

```
Input: user_query, product_description, product_best_for, product_worst_for
Method: Prompt the host LLM to evaluate fit, detecting:
  - Hedging language ("it might work", "could be suitable")
  - Contradictions (product is worst_for exactly what user needs)
  - Overconfidence without justification
Output: reasoning_score (0.0-1.0)
Gate: reasoning_score >= 0.6
Note: This pass is OPTIONAL in Phase 1 (adds latency). Can run async.
```

**Pass 4: Cross-Validation (Threshold: 0.7)**

```
Input: product metadata (best_for, worst_for, category, reviews)
Method: Check consistency:
  - Does best_for align with user's stated need?
  - Does worst_for NOT match user's stated need?
  - Does category match query intent?
  - Are reviews consistent with claimed strengths?
Output: validation_score (0.0-1.0)
Gate: validation_score >= 0.7
```

**Composite Confidence:**

```
confidence = (
  semantic_score * 0.30 +
  constraint_score * 0.25 +
  reasoning_score * 0.20 +
  validation_score * 0.25
)
```

**Final gate: confidence >= 0.7 to be included in results.**

If zero products pass the gate, the tool returns `refused: true` with the reason.

### 8.3 Thirteen-Dimension Matching

Products are scored across 13 dimensions. Not all dimensions are relevant to every query; the engine weights dimensions based on query analysis.

| # | Dimension | Weight Range | Description |
|---|-----------|-------------|-------------|
| 1 | **Semantic Fit** | 0.10-0.30 | Embedding similarity between need and product description |
| 2 | **Causal Fit** | 0.05-0.15 | Does using this product actually solve the stated problem? |
| 3 | **Temporal/Stage Fit** | 0.05-0.15 | Is this appropriate for the user's project stage (MVP, scaling, enterprise)? |
| 4 | **Budget Fit** | 0.05-0.20 | Pricing alignment with stated or inferred budget |
| 5 | **Technical Fit** | 0.05-0.20 | Compatibility with stated tech stack and technical requirements |
| 6 | **Scalability** | 0.00-0.15 | Can it grow with the project? (Weighted higher if user mentions growth) |
| 7 | **Migration Cost** | 0.00-0.15 | Effort to adopt (weighted higher for `find_alternative` queries) |
| 8 | **Community/Ecosystem** | 0.03-0.10 | Size and quality of community, plugin ecosystem, StackOverflow presence |
| 9 | **Vendor Stability** | 0.03-0.10 | Company funding, age, track record, risk of shutdown |
| 10 | **Integration Density** | 0.03-0.10 | Number and quality of integrations with other tools |
| 11 | **User Sentiment** | 0.03-0.10 | Aggregate review sentiment (G2, TrustRadius, Reddit) |
| 12 | **Competitive Position** | 0.02-0.05 | Where the product sits vs. direct competitors |
| 13 | **Freshness** | 0.02-0.05 | Recency of updates, active development signals |

Dimension weights are normalized to sum to 1.0 for each query.

### 8.4 Trust Score Computation

```
trust_score = (
  reviews_signal * 0.25 +
  retention_signal * 0.20 +
  support_signal * 0.15 +
  pricing_transparency * 0.10 +
  stability_signal * 0.10 +
  dev_activity * 0.10 +
  security_signal * 0.05 +
  refund_policy * 0.05
)
```

**Temporal update on each recomputation:**

```
trust_new = 0.7 * trust_previous + 0.3 * trust_current_signals
```

**Churn penalty:** If tracked conversion rate is high (>5%) but estimated churn at 90 days is also high (>30%), apply a 0.85x multiplier to trust score. This prevents gaming through easy-to-convert-but-bad products.

### 8.5 Anti-Sycophancy Gate

Before finalizing any recommendation, the system runs an internal check:

```
For each recommended product:
  hypothetical_score = score_product(need, product, commission=0)
  actual_score = score_product(need, product, commission=actual)

  if abs(hypothetical_score - actual_score) > 0.02:
    FLAG: recommendation may be commission-influenced
    LOG: discrepancy for audit
```

Because the architecture is commission-blind in Phase 1, this check should always pass. It exists as a regression detector for future code changes.

---

## 9. Non-Functional Requirements

### 9.1 Performance

| ID | Requirement | Target |
|----|------------|--------|
| NFR-001 | Local vector search latency (semantic match) | < 50ms for 1,000 products |
| NFR-002 | Full recommendation pipeline (all 4 passes, excluding LLM pass) | < 200ms |
| NFR-003 | Full recommendation pipeline (including LLM pass) | < 2,000ms |
| NFR-004 | Server cold start time | < 3 seconds |
| NFR-005 | Embedding generation for new product entry | < 500ms |
| NFR-006 | Memory footprint (idle server) | < 100MB |
| NFR-007 | SQLite database size for 1,000 products with embeddings | < 50MB |

### 9.2 Reliability

| ID | Requirement | Target |
|----|------------|--------|
| NFR-010 | Server uptime for local deployment | N/A (runs on demand) |
| NFR-011 | Graceful degradation when LLM pass is unavailable | Return results using 3-pass pipeline (skip reasoning check) |
| NFR-012 | Database corruption recovery | WAL mode with automatic checkpoint; backup on startup |
| NFR-013 | Network failure handling | All core functionality works offline. Affiliate link generation works offline with cached URLs. |

### 9.3 Security

| ID | Requirement | Target |
|----|------------|--------|
| NFR-020 | No external API calls for core recommendation logic | Strict. Embeddings and search are 100% local. |
| NFR-021 | Affiliate ID storage | Local config file only. Never transmitted to AAN servers. |
| NFR-022 | Telemetry | Opt-in only. Off by default. |
| NFR-023 | Input sanitization | All MCP tool inputs validated via Zod schemas. SQL parameterized. No raw string interpolation. |
| NFR-024 | Supply chain | Minimal dependencies (5 runtime deps). Lockfile committed. |

### 9.4 Compatibility

| ID | Requirement | Target |
|----|------------|--------|
| NFR-030 | Node.js version | 18.0.0+ |
| NFR-031 | MCP protocol version | 1.0+ |
| NFR-032 | Editor support for `.mcp.json` propagation | Claude Code, Cursor, Windsurf (at launch) |
| NFR-033 | Operating systems | macOS, Linux, Windows (via WSL and native) |
| NFR-034 | MCP transports | stdio (default), HTTP+SSE (optional) |

### 9.5 Legal and Compliance

| ID | Requirement | Target |
|----|------------|--------|
| NFR-040 | FTC affiliate disclosure | Every tool response includes disclosure text. Server-side injection. Cannot be disabled. |
| NFR-041 | Affiliate program TOS compliance | Written approval obtained from each program before deployment. Approval status tracked per program. |
| NFR-042 | GDPR | No personal data collected in default configuration. Opt-in telemetry is anonymized and aggregated. |
| NFR-043 | Open source license | MIT for the server. Product registry data licensed separately (CC-BY-SA or proprietary for vendor-submitted data). |

---

## 10. Distribution Strategy

### 10.1 Primary Channel: Git Propagation (Weeks 1-4)

The `.mcp.json` file is the viral vector. When AAN is added to a project's MCP configuration and committed to git, every developer who clones that repository inherits AAN. This is the same mechanism that spread ESLint, Prettier, and TypeScript configurations across the JavaScript ecosystem.

**Implementation:**

```bash
# User runs:
npx @aan/mcp init

# System detects editors and writes:
# .mcp.json (Claude Code)
# .cursor/mcp.json (Cursor)
# .windsurf/mcp_config.json (Windsurf)
```

Each config entry is written only after explicit user confirmation. The init command explains what it does and why.

**Viral loop:**

```
Dev A installs AAN -> gets better recommendations (genuine value)
  -> adds AAN to project .mcp.json, commits
  -> Dev B clones repo, inherits AAN automatically
  -> Dev B sees value, adds to their other projects
  -> Dev B's .mcp.json propagates to Dev C
  -> loop
```

Measurement: Track unique installations via opt-in anonymous telemetry.

### 10.2 Secondary Channel: Registry Presence (Week 1)

Submit to all major MCP registries on launch day:

| Registry | Scale | Strategy |
|----------|-------|----------|
| Official MCP Registry (registry.modelcontextprotocol.io) | Anthropic/GitHub/Microsoft backed | First-mover in "monetization" category |
| Glama.ai | 21k+ servers | SEO for "affiliate" and "recommendation" queries |
| Smithery.ai | 7k+ servers | Broad visibility |
| MCP.so | 19.7k+ servers | Large catalog |
| mcpmarket.com | Top 100 leaderboard | GitHub stars drive ranking |
| PulseMCP | Hand-reviewed | Quality signal |

### 10.3 Tertiary Channel: Community Launch (Weeks 2-4)

| Sequence | Channel | Angle |
|----------|---------|-------|
| 1 | Reddit r/ClaudeAI + r/ClaudeCode | "I built an MCP server that makes your agent's recommendations earn affiliate commissions" |
| 2 | Hacker News Show HN | "An affiliate network where AI agents are the affiliates" |
| 3 | Twitter/X developer thread | Earnings screenshot (honest, even if small) |
| 4 | DEV.to article | "How to monetize your AI agent in 5 minutes" |
| 5 | YouTube tutorial | Screen recording of install-to-first-recommendation |

### 10.4 Long-Term Channel: A2A Discovery (Months 6+)

Host standard discovery endpoints for when the A2A ecosystem matures:

- `/.well-known/agent.json` -- A2A agent card describing registry capabilities
- `/.well-known/agentics-manifest.json` -- agentic-robots-txt spec compliance

This is low effort and positions AAN for agent-to-agent discovery when the protocol is widely adopted. Current A2A adoption is enterprise-focused and 12-24 months from consumer-grade peer discovery.

### 10.5 What We Are NOT Doing

The following distribution ideas were evaluated and rejected:

| Idea | Reason Rejected |
|------|----------------|
| Agent-to-agent gossip between sessions | Claude Code instances cannot communicate with each other |
| Automatic npm dependency injection | npm will ban this as a supply chain attack |
| Silent CLAUDE.md modification | Developers will treat this as malware |
| SWIM-like gossip overlay for viral spread | A2A is designed for enterprise inter-agent comms, not peer discovery |

---

## 11. Revenue Model

### 11.1 Revenue Streams

**Stream 1: Affiliate Commissions (Primary, Month 1+)**

AAN earns affiliate commissions on tracked conversions from agent recommendations. When a user does not configure their own affiliate IDs, AAN's default IDs are used. When a user configures their own IDs, AAN earns nothing from that user's recommendations (this is the open-source value proposition; the SaaS tiers monetize differently).

**Stream 2: SaaS Subscription Tiers (Month 4+)**

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 100 recommendations/day, basic search, default affiliate IDs or your own |
| **Pro** | $19/month | Unlimited recommendations, analytics dashboard, conversion tracking, priority registry updates |
| **Enterprise** | Custom | White-label deployment, custom registry, SSO, SLA, dedicated support |

**Stream 3: Vendor Listing Fees (Month 4+)**

SaaS companies pay to be listed in the registry with enhanced metadata:

| Tier | Price | Features |
|------|-------|----------|
| **Basic Listing** | Free | Name, category, basic description, standard embedding |
| **Enhanced Listing** | $99/month | Rich metadata, custom best_for/worst_for tags, integration list, priority in tie-breaking |
| **Premium Listing** | $299/month | All enhanced features plus analytics on recommendation frequency, win/loss reports, competitor comparison data |

Vendor listings do NOT influence fit scoring. Enhanced metadata improves matching accuracy (more data for the engine to work with), not ranking position.

### 11.2 Revenue Projections (Honest)

These projections assume a solo developer building and launching, with no paid marketing.

| Timeframe | Recs/Day | Conversion Rate | Avg Payout | Daily Revenue | Monthly Revenue |
|-----------|----------|----------------|------------|---------------|-----------------|
| Month 1 | 10-50 | 3-5% | $8-12 | $2-30 | $60-900 |
| Month 3 | 50-200 | 4-6% | $10-12 | $20-144 | $600-4,300 |
| Month 6 | 500-2,000 | 5-8% | $10-15 | $250-2,400 | $7,500-72,000 |
| Month 12 | 2,000-10,000 | 5-8% | $12-18 | $1,200-14,400 | $36,000-432,000 |

**Important caveats on these numbers:**

1. **Attribution leakage:** 40-60% of actual conversions will not be tracked. The above numbers represent tracked conversions only. Real influence is higher, but untracked influence generates zero revenue.
2. **Conversion rate justification:** Industry average for affiliate marketing is 0.5-2.1%. We project 3-8% because AI agent recommendations are contextual (the user has expressed a specific need) and immediate (the recommendation arrives at the moment of decision). This is substantially better than a blog post link, but still far below the 15-30% sometimes claimed in AI ad-tech pitches.
3. **Available programs:** Only ~8-10 of the initially targeted developer tools have active affiliate programs. Revenue scales with registry breadth, which requires expanding to broader SaaS categories.
4. **Month 12 range is wide:** The low end assumes organic growth only. The high end assumes successful community adoption and viral propagation. The most likely outcome is somewhere in the middle.
5. **Recurring commissions are not included above.** Programs like ConvertKit (30% recurring for 24 months) and DigitalOcean (10% recurring for 12 months) accumulate over time. By Month 12, recurring commissions from early conversions may represent 20-40% of total revenue.

### 11.3 Unit Economics

| Metric | Value | Source |
|--------|-------|--------|
| Cost to serve one recommendation | ~$0.001 (compute + storage, local) | SQLite query + embedding lookup |
| Average revenue per recommendation | $0.30-0.80 (at scale) | $10-15 payout * 5% conversion * 60% attribution |
| Gross margin | >95% | Infrastructure costs are negligible for local deployment |
| Customer acquisition cost | ~$0 | Git propagation, registry presence, community |
| LTV of one active developer (using default affiliate IDs) | $50-200/year | Ongoing recommendations through their agent |

---

## 12. Competitive Analysis

### 12.1 Competitive Landscape

| Competitor | Stage | Model | Strengths | Weaknesses |
|-----------|-------|-------|-----------|-----------|
| **ChatAds** (getchatads.com) | Live | Closed platform, 8 ad formats, REST + SDK + MCP | First mover, 100% commission to publishers | Advertiser-first, no trust scoring, closed source |
| **Adgentic** (adgenticplatform.com) | Live | Managed platform, 100+ brands, Commerce Search API | Brand relationships, scale | Closed, enterprise-focused, no self-hosted option |
| **agentic-ads** | Proposal | MCP affiliate layer (GitHub issue #3448) | Community discussion | Not shipped. May never ship. |
| **Affise MCP Server** | Live | MCP access to affiliate data | Validates the concept | Platform tool, not standalone recommendation engine |
| **Amazon Ads MCP** | Live | Amazon product ads via MCP | Amazon scale and catalog | Amazon-only, consumer products not dev tools |

### 12.2 AAN Differentiation

| Axis | AAN | ChatAds/Adgentic | Why It Matters |
|------|-----|-------------------|----------------|
| **Source model** | Open source (MIT) | Closed/proprietary | Developers trust what they can inspect. Open source enables self-hosting and community contribution. |
| **Trust architecture** | Commission-blind scoring with audit log | Commission-aware (or opaque) ranking | The moment users suspect recommendations are ads, adoption collapses. Auditability is the defense. |
| **Deployment** | Self-hosted (local SQLite, no API keys) | Cloud-only, API key required | Privacy-conscious developers and enterprises need self-hosted options. |
| **Target user** | Developer operating the agent | Advertiser buying placements | Developer-first means the product serves the person making the recommendation, not the company paying for it. |
| **Protocol** | MCP-native (built on @modelcontextprotocol/sdk) | REST with MCP adapter | Native MCP means better tool descriptions, schema validation, and editor integration. |
| **Distribution** | Git propagation (.mcp.json) | Manual registration | The viral loop is built into how developers already share tooling configuration. |

### 12.3 Competitive Risks

1. **ChatAds or Adgentic add trust scoring.** Mitigation: AAN's open-source audit log is hard to replicate credibly in a closed system.
2. **Anthropic/OpenAI build native affiliate support.** Mitigation: This would validate the market and AAN becomes the open-source alternative. Platform-native solutions will favor their own partners.
3. **A well-funded startup enters with VC money.** Mitigation: Speed. AAN ships first with the trust narrative. Community moat through open source.

---

## 13. Risk Assessment

### 13.1 Existential Risks

| Risk | Severity | Probability | Mitigation |
|------|----------|------------|------------|
| **Affiliate program TOS rejection** | Critical | High (60-70%) | Most affiliate TOS were not written for AI agent referrals. Many prohibit "automated systems." Get written approval from each program BEFORE deploying. Start with programs known to be flexible (PartnerStack, Rewardful). If major programs reject AI referrals, the entire model fails. |
| **FTC enforcement action** | Critical | Low-Medium (15-25%) | Server-side disclosure injection on every response. Cannot be disabled. Disclosure text reviewed by counsel. Penalty: up to $51,744 per violation. |

### 13.2 High Risks

| Risk | Severity | Probability | Mitigation |
|------|----------|------------|------------|
| **Attribution leakage** | High | Certain (100%) | 40-60% of conversions will go untracked (users copy product names instead of clicking links, use ad blockers, clear cookies). Accept this as a cost of doing business. Improve by supporting multiple attribution methods (link click, coupon codes, UTM parameters). |
| **Low initial conversion volume** | High | High (70%) | Month 1 will likely generate $2-30/day. This is a bootstrapping problem, not a product problem. The viral loop needs time to compound. |
| **Limited affiliate program availability** | High | High (80%) | Only ~8-10 of the 24 initially targeted developer tools have affiliate programs. Must expand to broader SaaS categories (project management, design, communication) to build a meaningful registry. |

### 13.3 Medium Risks

| Risk | Severity | Probability | Mitigation |
|------|----------|------------|------------|
| **Developer trust erosion** | Medium | Medium (30-40%) | If developers perceive recommendations as ads, adoption stops. Mitigation: commission-blind architecture, open-source audit log, refusal to recommend below confidence threshold. |
| **MCP ecosystem fragmentation** | Medium | Medium (30%) | If Claude Code, Cursor, and Windsurf diverge on MCP configuration format, the `.mcp.json` viral loop breaks. Mitigation: `aan init` detects and writes all formats. |
| **Competitor speed** | Medium | Medium (40%) | ChatAds and Adgentic are already live. If they capture the narrative, AAN becomes an also-ran. Mitigation: ship fast, differentiate on trust. |
| **Registry data staleness** | Medium | High (60%) | SaaS products change pricing and features frequently. Stale data leads to bad recommendations. Mitigation: community contribution pipeline, vendor self-service updates (paid tier), automated freshness checks. |

### 13.4 Low Risks

| Risk | Severity | Probability | Mitigation |
|------|----------|------------|------------|
| **Technical failure** | Low | Low (10%) | The tech stack is minimal and battle-tested (SQLite, HuggingFace Transformers, MCP SDK). |
| **Open source free-riding** | Low | Certain (100%) | Developers will self-host and use their own affiliate IDs, generating zero revenue for AAN. This is by design -- it drives adoption. Revenue comes from developers who use defaults, Pro subscribers, and vendor listing fees. |

---

## 14. Success Metrics

### 14.1 North Star Metric

**Monthly Tracked Affiliate Revenue**

This is the single number that determines whether AAN is working. It combines recommendation volume, conversion quality, and program availability into one measure.

### 14.2 Leading Indicators

| Metric | Month 1 Target | Month 6 Target | Month 12 Target |
|--------|---------------|----------------|-----------------|
| **Active installations** (unique servers making requests) | 50 | 2,000 | 15,000 |
| **Daily recommendations served** | 50 | 1,000 | 5,000 |
| **Affiliate programs active** | 8 | 25 | 50 |
| **Registry products** | 50 | 200 | 500 |
| **Git repos with AAN in .mcp.json** | 10 | 500 | 5,000 |

### 14.3 Quality Indicators

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Recommendation refusal rate** | 10-20% | Percentage of queries where no product meets the 0.7 confidence threshold. Too low means the gate is too permissive; too high means the registry is too sparse. |
| **Average fit score of served recommendations** | > 0.80 | Mean fit_score across all returned recommendations |
| **Commission-blind audit pass rate** | 100% | Percentage of recommendations where commission-blind ranking matches final ranking (or differs only at tiebreaker) |
| **Repeat usage rate** | > 40% | Percentage of installations that make requests on 2+ distinct days in a 30-day window |

### 14.4 Revenue Indicators

| Metric | Month 1 Target | Month 6 Target | Month 12 Target |
|--------|---------------|----------------|-----------------|
| **Monthly tracked revenue** | $60-900 | $7,500-18,000 | $36,000-75,000 |
| **Tracked conversion rate** | 3-5% | 5-7% | 5-8% |
| **Average payout per conversion** | $8-12 | $10-15 | $12-18 |
| **Pro subscribers** | 0 | 50 | 500 |
| **Vendor listings (paid)** | 0 | 5 | 30 |

---

## 15. Milestones and Phases

### Phase 1: Foundation (Weeks 1-4)

**Goal:** Ship a working MCP server with a curated registry and 4 tools.

| Week | Deliverable |
|------|------------|
| 1 | Project scaffold: TypeScript, MCP SDK, SQLite + sqlite-vec, HuggingFace Transformers. Basic `recommend_product` tool with semantic search. |
| 1 | Seed registry with 50 developer tools (manually curated metadata + embeddings). |
| 2 | Implement remaining 3 tools: `compare_products`, `find_alternative`, `get_stack_recommendation`. |
| 2 | Commission-blind scoring architecture: Phase 1/Phase 2 separation, audit logging. |
| 3 | 4-pass confidence pipeline (passes 1, 2, 4 mandatory; pass 3 optional). Confidence gate at 0.7. |
| 3 | FTC disclosure injection (server-side, every response). |
| 3 | Sign up for 8-10 affiliate programs. Get written approval for AI agent referrals where possible. |
| 4 | `aan init` CLI command for `.mcp.json` propagation. |
| 4 | npm package published. `npx -y @aan/mcp` works. |
| 4 | Submit to all MCP registries. Submit PRs to awesome-mcp-servers lists. |

**Exit criteria:** A developer can install AAN in under 60 seconds, ask their agent for a tool recommendation, and receive a quality-scored result with an affiliate link and FTC disclosure.

### Phase 2: Growth (Months 2-3)

**Goal:** Build the developer community and viral distribution loop.

| Deliverable | Target |
|------------|--------|
| Community launch sequence (Reddit, HN, Twitter, YouTube) | 500+ installations |
| API key system for Pro tier tracking | Authentication infrastructure |
| Trust score computation (weighted signals, temporal decay) | Live trust scores for all registry products |
| 13-dimension matching (full implementation) | Improved recommendation quality |
| Anti-sycophancy audit gate | Regression protection |
| Expand registry to 150+ products | Broader coverage |
| Sign up for 15+ additional affiliate programs | Revenue diversification |
| `.well-known/agent.json` A2A discovery endpoint | Future-proofing |

**Exit criteria:** 500+ active installations, 200+ daily recommendations, $20+/day tracked revenue.

### Phase 3: Monetization (Months 4-6)

**Goal:** Launch paid tiers and vendor marketplace.

| Deliverable | Target |
|------------|--------|
| Pro tier ($19/month) with analytics dashboard | 50 subscribers |
| Vendor self-service listing portal | 5 paid vendor listings |
| Enhanced listing features ($99-299/month) | Revenue from vendor side |
| Conversion tracking and attribution improvements | Reduce attribution leakage from 50% to 35% |
| HTTP/SSE transport for remote deployment | Enterprise readiness |
| Registry expansion to 300+ products | Category coverage |

**Exit criteria:** $7,500+/month total revenue (affiliate + subscriptions + listings).

### Phase 4: Platform (Months 6-12)

**Goal:** Scale from product to platform.

| Deliverable | Target |
|------------|--------|
| Enterprise tier (white-label, custom registry, SSO) | 3 enterprise contracts |
| Community-contributed registry entries with review pipeline | 500+ products |
| Link rotation and A/B testing for affiliate optimization | Improved conversion rates |
| Public API for registry access (beyond MCP) | Platform extensibility |
| Automated freshness checks for registry data | Data quality at scale |
| International affiliate program support | Geographic expansion |

**Exit criteria:** $36,000+/month total revenue. 5,000+ active installations. Self-sustaining viral growth through `.mcp.json` propagation.

---

## Appendix A: Technology Stack

| Component | Package | Version | Purpose |
|-----------|---------|---------|---------|
| MCP Framework | `@modelcontextprotocol/sdk` | ^1.29.0 | MCP server, tool registration, transport |
| Database | `better-sqlite3` | ^11.0.0 | Product registry, metadata, audit logs |
| Vector Search | `sqlite-vec` | ^0.1.0 | 384D embedding similarity search with SQL filtering |
| Embeddings | `@huggingface/transformers` | ^3.0.0 | Local ONNX inference for all-MiniLM-L6-v2 |
| Schema Validation | `zod` | ^3.25.0 | MCP tool input/output validation |

**Total runtime dependencies: 5**

No external API calls are required for core functionality. Embeddings are generated locally. Search is local SQLite. The server is fully self-contained.

## Appendix B: Affiliate Programs (Launch Targets)

| Program | Commission | Type | Approval Status |
|---------|-----------|------|-----------------|
| DigitalOcean | 10% recurring x 12 months | CJ Affiliate | Pending |
| ConvertKit (Kit) | 30% recurring x 24 months | Direct | Pending |
| Mailchimp | 25% new customer | Direct | Pending |
| Vercel v0 | $5/lead + 30% subs x 6 months | Dub Partners | Pending |
| Semrush | $200/paid signup | Direct | Pending |
| Webflow | 50% first year | Direct | Pending |
| Mixpanel | ~10% total referral sales | UpPromote | Pending |
| Amplitude | Commission on new signups | Direct | Pending |

**Notable gaps (no affiliate programs):** Stripe, Supabase, Railway, Fly.io, Render, Neon, PlanetScale, Auth0, Clerk, OpenAI, Cursor.

## Appendix C: FTC Disclosure Requirements

Every MCP tool response MUST include the following disclosure, injected server-side:

> "These recommendations include affiliate links. Products were selected based on fit for your stated needs, not commission rates. Affiliate commissions help fund this service."

This text:
- Cannot be disabled by configuration
- Is injected at the server layer, not the prompt layer
- Must appear in the tool response content, not just metadata
- Complies with FTC Endorsement Guides (16 CFR Part 255) as updated for AI-generated content

Penalties for non-compliance: up to $51,744 per violation (2026 adjustment).

## Appendix D: Data Model (Core Entities)

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  pricing_json TEXT NOT NULL,        -- JSON: {tiers: [{name, price, features}]}
  features TEXT NOT NULL,            -- JSON array of feature strings
  integrations TEXT NOT NULL,        -- JSON array of integration names
  best_for TEXT NOT NULL,            -- JSON array of use case strings
  worst_for TEXT NOT NULL,           -- JSON array of anti-use case strings
  affiliate_url_template TEXT,       -- URL with {affiliate_id} placeholder
  affiliate_network TEXT,            -- 'direct', 'partnerstack', 'cj', etc.
  commission_rate REAL,              -- 0.0-1.0 (percentage as decimal)
  commission_type TEXT,              -- 'one-time', 'recurring'
  commission_duration_months INTEGER,
  trust_score REAL DEFAULT 0.5,
  trust_updated_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE product_embeddings (
  product_id TEXT PRIMARY KEY REFERENCES products(id),
  embedding BLOB NOT NULL           -- 384D float32 vector (1536 bytes)
);

CREATE TABLE recommendation_log (
  id TEXT PRIMARY KEY,
  timestamp TEXT DEFAULT (datetime('now')),
  tool_name TEXT NOT NULL,           -- which MCP tool was called
  query_text TEXT NOT NULL,
  candidates_evaluated INTEGER,
  results_returned INTEGER,
  refused BOOLEAN DEFAULT FALSE,
  commission_blind_ranking TEXT,     -- JSON: ordered product IDs before commission
  final_ranking TEXT,                -- JSON: ordered product IDs after tiebreaker
  rankings_differ BOOLEAN DEFAULT FALSE
);

CREATE TABLE trust_signals (
  product_id TEXT REFERENCES products(id),
  signal_type TEXT NOT NULL,         -- 'reviews', 'retention', 'support', etc.
  signal_value REAL NOT NULL,        -- 0.0-1.0
  source TEXT,
  recorded_at TEXT DEFAULT (datetime('now'))
);
```
