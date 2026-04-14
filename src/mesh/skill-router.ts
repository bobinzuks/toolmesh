/**
 * A2A Gossip Mesh -- Skill Router
 *
 * Routes natural language queries to the best matching agent in the mesh
 * based on skill vector similarity and trust score.
 */

import type { Embedder } from '../registry/embedder.js';
import type { PeerStore } from './peer-store.js';
import type { PeerEntry, RoutingResult } from './types.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum trust score required for a peer to be routable. */
const MIN_TRUST_SCORE = 0.5;

/** Number of candidates to retrieve from the peer store before filtering. */
const CANDIDATE_K = 20;

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export class SkillRouter {
  private readonly peerStore: PeerStore;

  constructor(peerStore: PeerStore) {
    this.peerStore = peerStore;
  }

  /**
   * Find the single best agent to handle a natural language query.
   *
   * Steps:
   *   1. Embed the query.
   *   2. Search the peer store for the top-k skill matches.
   *   3. Filter out peers below the trust threshold.
   *   4. Return the best remaining match, or null.
   */
  async route(query: string, embedder: Embedder): Promise<RoutingResult | null> {
    const candidates = await this.peerStore.findBySkill(query, embedder, CANDIDATE_K);

    for (const candidate of candidates) {
      if (candidate.peer.trustScore >= MIN_TRUST_SCORE) {
        return {
          peer: candidate.peer,
          skill: candidate.skill,
          similarity: candidate.similarity,
          trustScore: candidate.peer.trustScore,
        };
      }
    }

    return null;
  }

  /**
   * Find all active peers that have at least one skill with a tag
   * matching the given category (case-insensitive substring match).
   */
  routeToCategory(category: string): PeerEntry[] {
    const lower = category.toLowerCase();

    return this.peerStore.getActivePeers().filter((peer) =>
      peer.agentCard.skills.some((skill) =>
        skill.tags.some((tag) => tag.toLowerCase().includes(lower)),
      ),
    );
  }
}
