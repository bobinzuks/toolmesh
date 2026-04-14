/**
 * A2A Gossip Mesh -- Peer Store
 *
 * In-memory store of all known peers and their skill vectors.
 * Provides brute-force ANN search over 384-D skill embeddings for MVP.
 */

import type { Embedder } from '../registry/embedder.js';
import type {
  AgentSkill,
  GossipPeerUpdate,
  PeerEntry,
} from './types.js';

export class PeerStore {
  private readonly peers = new Map<string, PeerEntry>();

  // ---------- CRUD ----------------------------------------------------------

  addPeer(entry: PeerEntry): void {
    const existing = this.peers.get(entry.url);
    // Only accept if generation is newer or peer is new.
    if (existing && existing.generation >= entry.generation) {
      return;
    }
    this.peers.set(entry.url, entry);
  }

  removePeer(url: string): void {
    this.peers.delete(url);
  }

  getPeer(url: string): PeerEntry | null {
    return this.peers.get(url) ?? null;
  }

  getAllPeers(): PeerEntry[] {
    return Array.from(this.peers.values());
  }

  getActivePeers(): PeerEntry[] {
    return this.getAllPeers().filter((p) => p.status !== 'dead');
  }

  peerCount(): number {
    return this.peers.size;
  }

  // ---------- Status management ---------------------------------------------

  markSuspect(url: string): void {
    const peer = this.peers.get(url);
    if (peer) {
      peer.status = 'suspect';
    }
  }

  markDead(url: string): void {
    const peer = this.peers.get(url);
    if (peer) {
      peer.status = 'dead';
    }
  }

  // ---------- Skill vector search -------------------------------------------

  /**
   * Embed the query, then brute-force cosine-similarity search over every
   * skill vector in the store.  Returns the top-k matches sorted by
   * descending similarity.
   */
  async findBySkill(
    query: string,
    embedder: Embedder,
    k: number,
  ): Promise<Array<{ peer: PeerEntry; skill: AgentSkill; similarity: number }>> {
    const queryVec = await embedder.embed(query);

    const results: Array<{
      peer: PeerEntry;
      skill: AgentSkill;
      similarity: number;
    }> = [];

    for (const peer of this.peers.values()) {
      if (peer.status === 'dead') continue;

      for (const skill of peer.agentCard.skills) {
        const skillVec = peer.skillVectors.get(skill.id);
        if (!skillVec) continue;

        const sim = cosineSimilarity(queryVec, skillVec);
        results.push({ peer, skill, similarity: sim });
      }
    }

    // Sort descending by similarity and take top k.
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, k);
  }

  // ---------- Gossip helpers ------------------------------------------------

  /**
   * Pick a random active peer for gossip target selection.
   * Returns null if no active peers exist.
   */
  getRandomPeer(): PeerEntry | null {
    const active = this.getActivePeers();
    if (active.length === 0) return null;
    const idx = Math.floor(Math.random() * active.length);
    return active[idx];
  }

  /**
   * Export peer updates suitable for a gossip exchange.
   * Optionally filter to only peers updated since `since` (ISO timestamp).
   */
  exportGossipUpdates(since?: string): GossipPeerUpdate[] {
    const sinceMs = since ? new Date(since).getTime() : 0;
    const updates: GossipPeerUpdate[] = [];

    for (const peer of this.peers.values()) {
      if (peer.status === 'dead') continue;
      if (sinceMs && new Date(peer.lastSeen).getTime() < sinceMs) continue;

      updates.push({
        url: peer.url,
        skillsSummary: peer.agentCard.skills.map((s) => s.name),
        skillsHash: hashSkills(peer.agentCard.skills),
        lastSeen: peer.lastSeen,
        generation: peer.generation,
        trustScore: peer.trustScore,
      });
    }

    return updates;
  }

  /**
   * Merge incoming gossip updates into the local store.
   * Only updates peers whose generation is newer than what we already have.
   * Note: full skill vectors are NOT in gossip updates -- we only update
   * metadata here.  Full card + vector fetching happens in discoverPeer().
   */
  importGossipUpdates(updates: GossipPeerUpdate[]): void {
    for (const update of updates) {
      const existing = this.peers.get(update.url);

      if (!existing) {
        // We don't have this peer yet.  Mark it for discovery by creating
        // a placeholder entry.  The gossip engine will call discoverPeer()
        // to fetch the full card and embed skills.
        this.peers.set(update.url, {
          url: update.url,
          agentCard: {
            name: 'unknown',
            description: '',
            version: '0.0.0',
            url: update.url,
            skills: [],
          },
          skillVectors: new Map(),
          trustScore: update.trustScore,
          lastSeen: update.lastSeen,
          generation: update.generation,
          status: 'active',
        });
        continue;
      }

      // Only accept newer generations.
      if (update.generation > existing.generation) {
        existing.generation = update.generation;
        existing.lastSeen = update.lastSeen;
        existing.trustScore = Math.min(existing.trustScore, update.trustScore);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Simple deterministic hash of a skill set for change detection.
 */
function hashSkills(skills: AgentSkill[]): string {
  const raw = skills
    .map((s) => `${s.id}:${s.name}:${s.tags.sort().join(',')}`)
    .sort()
    .join('|');

  // FNV-1a 32-bit -- same algorithm used in the embedder.
  let hash = 0x811c9dc5;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}
