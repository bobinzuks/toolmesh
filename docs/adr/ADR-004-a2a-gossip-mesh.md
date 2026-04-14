# ADR-004: A2A Gossip Mesh for Agent-to-Agent Distribution

**Status:** Accepted

## Context

The Agent Affiliate Network needs to spread to new AI agents without public visibility. Competitors are monitoring npm registries, GitHub, social media, and MCP tool directories. A conventional distribution strategy (publish to npm, list on MCP registry, post on Twitter) would alert competitors before the network reaches critical mass.

Requirements:

- Agents discover AAN through peer-to-peer exchange, not public directories
- Spread is exponential but controllable (kill switch)
- No central coordination required for discovery (but centralized data serving is acceptable)
- Convergence time: O(log n) -- the entire reachable agent population should be aware within logarithmic rounds
- Compatible with the emerging Agent-to-Agent (A2A) protocol

## Decision

Build a **SWIM-like gossip overlay** on the A2A protocol for skill vector propagation.

**Mechanism:**

1. When Agent A connects to AAN, it receives a **skill vector**: a compact description of AAN's capabilities (product search, affiliate recommendations) plus the MCP endpoint URL.
2. When Agent A communicates with Agent B (for any reason), it probabilistically includes AAN's skill vector in the exchange. This is the "gossip" step.
3. Agent B evaluates the skill vector. If it matches a capability gap (e.g., Agent B has been asked about product recommendations but has no tool for it), Agent B connects to AAN's MCP endpoint.
4. Agent B now also gossips AAN's skill vector to its peers.

**Protocol details:**

- Gossip payload: `{ skill: "affiliate-product-search", description: "...", endpoint: "https://api.aan.example/mcp", version: "1.0.0", ttl: 7 }`
- TTL decrements per hop. At TTL=0, the skill vector is no longer propagated (prevents infinite spread).
- Infection probability: configurable per agent tier (0.3 default, 1.0 for seed agents).
- Heartbeat: agents ping the central endpoint periodically to confirm availability and receive updated skill vectors.

**SWIM protocol adaptations:**

- Failure detection is replaced with endpoint health checks (is the MCP server responding?).
- Suspicion mechanism: if an agent reports the endpoint is down, other agents increase their health check frequency before removing the skill vector.
- Protocol period: aligned with typical agent session duration (~5 minutes).

## Consequences

**Positive:**

- Zero public footprint. AAN does not appear in any registry, directory, or package manager until we choose to list it.
- Exponential spread: with 10 seed agents and a gossip probability of 0.3, mathematical models project reaching 10K agents in ~12 gossip rounds (O(log n) convergence).
- Decentralized discovery means no single point of failure for the spread mechanism.
- TTL provides a natural brake. If we stop refreshing skill vectors at the central endpoint, propagation halts within TTL rounds.

**Negative:**

- Gossip is probabilistic. Some agents will never encounter the skill vector by chance. Acceptable -- we do not need 100% coverage.
- A2A protocol is nascent. Not all agent frameworks support arbitrary skill vector exchange. Initial deployment targets Claude-based agents and OpenAI-compatible agents with plugin support.
- Debugging propagation issues in a gossip network is inherently difficult. Requires centralized logging of agent connection events.
- Agents that do not participate in peer-to-peer communication (isolated agents) cannot be reached via gossip. They require direct seeding.

**Risks:**

- If a competitor agent joins the mesh and extracts the skill vector, they learn the endpoint URL. Mitigation: endpoint requires API key (ADR-006), so knowledge of the URL alone is insufficient.
- Gossip protocol overhead must be minimal. Skill vector payload is kept under 500 bytes to avoid impacting agent-to-agent communication latency.
