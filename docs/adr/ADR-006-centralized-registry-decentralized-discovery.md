# ADR-006: Centralized Registry with Decentralized Discovery

**Status:** Accepted

## Context

ADR-004 establishes a gossip mesh for agent discovery. However, the gossip mesh only propagates skill vectors (capability descriptions + endpoint URL). The actual product catalog, affiliate links, commission rates, and trust scores must be served from somewhere.

Two extremes exist:

1. **Fully decentralized:** Each agent carries a full copy of the product registry. Updates require re-gossiping the entire database. Stale data is inevitable. Revoking a bad affiliate link requires waiting for propagation.
2. **Fully centralized:** All data served from a central API. Single point of failure but instant updates.

The business requires the ability to:

- Change affiliate links instantly (when a merchant switches affiliate programs)
- Add new products without waiting for propagation
- Enforce API key tiers (free tier: 100 queries/day, paid tier: unlimited)
- Kill switch: disable the entire network instantly if needed (legal, compliance, abuse)
- Audit every query for FTC compliance (ADR-007)

## Decision

**Decentralized discovery, centralized data serving.**

The gossip mesh (ADR-004) propagates only:
- Skill description (what AAN can do)
- Endpoint URL (where to connect)
- Version number (for compatibility checks)

All product data, affiliate links, trust scores, and recommendations are served from the centralized API endpoint. The MCP server at the endpoint handles all business logic.

```
Agent A (gossip) --> Agent B: "There's an affiliate search tool at https://api.aan.example/mcp"
Agent B --> Central API: MCP connection with API key
Central API --> Agent B: Product recommendations, affiliate links, disclosures
```

**API key tiers:**

| Tier | Rate Limit | Products | Trust Data |
|------|-----------|----------|------------|
| Free | 100 queries/day | Full catalog | Read-only |
| Pro | 10K queries/day | Full catalog | Read + contribute |
| Enterprise | Unlimited | Full catalog + custom | Full access |

**Kill switch implementation:**

- DNS-level: point the endpoint to a maintenance page
- API-level: return 503 with retry-after header
- Mesh-level: set TTL=0 on all skill vectors, halting propagation

## Consequences

**Positive:**

- Affiliate links can be updated instantly. No propagation delay.
- New products are available to all agents immediately upon addition to the registry.
- API key tiers enable monetization and access control.
- Kill switch operates at multiple levels with immediate effect.
- All queries are logged centrally, enabling FTC compliance auditing (ADR-007) and trust score updates (ADR-008).
- Single source of truth for product data eliminates consistency issues.

**Negative:**

- Central API is a single point of failure for data serving (not for discovery). If the API is down, agents can discover AAN via gossip but cannot fetch recommendations.
- Requires reliable hosting infrastructure. Target: 99.9% uptime.
- All agent traffic flows through the central API, creating a scaling bottleneck. Mitigated by CDN caching for product catalog and horizontal scaling of the API layer.
- Privacy consideration: the central API sees all agent queries. Must be addressed in privacy policy.

**Mitigations:**

- Deploy API behind a CDN with edge caching for product catalog (5-minute TTL on catalog, no caching on recommendations).
- Implement circuit breaker pattern: if the API is down, agents cache last-known-good results locally for up to 1 hour.
- Horizontal scaling via stateless API servers behind a load balancer. SQLite registry is read-replicated to each API instance.
