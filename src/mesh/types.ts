/**
 * A2A Gossip Mesh -- Type definitions
 *
 * Types for the SWIM-like gossip overlay that propagates agent skill
 * vectors across the mesh.  See ADR-004 and ADR-006.
 */

// ---------------------------------------------------------------------------
// Agent Card (A2A protocol)
// ---------------------------------------------------------------------------

export interface AgentCard {
  name: string;
  description: string;
  version: string;
  /** The agent's A2A endpoint URL. */
  url: string;
  skills: AgentSkill[];
  extensions?: MeshExtension[];
  /** JWS signature of the card (optional for MVP). */
  signature?: string;
}

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  examples?: string[];
}

export interface MeshExtension {
  uri: string;
  data: unknown;
}

// ---------------------------------------------------------------------------
// Peer tracking
// ---------------------------------------------------------------------------

export interface PeerEntry {
  url: string;
  agentCard: AgentCard;
  /** skill.id -> 384-dimensional embedding vector */
  skillVectors: Map<string, Float32Array>;
  /** 0-1 trust score (see ADR-008 / trust-engine) */
  trustScore: number;
  /** ISO-8601 timestamp of last successful contact */
  lastSeen: string;
  /** Lamport clock -- incremented on every state change */
  generation: number;
  status: 'active' | 'suspect' | 'dead';
}

// ---------------------------------------------------------------------------
// Gossip protocol messages
// ---------------------------------------------------------------------------

export interface GossipMessage {
  type: 'peer_announcement' | 'peer_exchange' | 'peer_departure';
  /** Sender's A2A endpoint URL */
  sender: string;
  timestamp: string;
  peers: GossipPeerUpdate[];
}

export interface GossipPeerUpdate {
  url: string;
  skillsSummary: string[];
  /** Hash of the full skill set -- used for change detection */
  skillsHash: string;
  lastSeen: string;
  generation: number;
  trustScore: number;
}

// ---------------------------------------------------------------------------
// Trust signals (consumed by trust-engine)
// ---------------------------------------------------------------------------

export interface TrustSignals {
  successfulInteractions: number;
  failedInteractions: number;
  /** How many other trusted peers also know this peer */
  voucherCount: number;
  /** Hours since we first learned about this peer */
  ageHours: number;
}

// ---------------------------------------------------------------------------
// Routing result (returned by skill-router)
// ---------------------------------------------------------------------------

export interface RoutingResult {
  peer: PeerEntry;
  skill: AgentSkill;
  similarity: number;
  trustScore: number;
}

// ---------------------------------------------------------------------------
// Mesh configuration
// ---------------------------------------------------------------------------

export interface MeshConfig {
  /** This node's publicly reachable A2A endpoint */
  selfUrl: string;
  /** This node's agent card */
  selfCard: AgentCard;
  /** Gossip round interval in milliseconds (default 30 000) */
  gossipIntervalMs: number;
  /** Maximum peers to track (default 200) */
  maxPeers: number;
  /** Trust decay multiplier per hour (default 0.99) */
  trustDecayRate: number;
  /** Bootstrap peer URLs for initial discovery */
  seedPeers: string[];
  /** Directory for optional on-disk persistence */
  dataDir: string;
}
