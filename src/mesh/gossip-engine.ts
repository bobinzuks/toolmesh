/**
 * A2A Gossip Mesh -- Gossip Engine
 *
 * SWIM-like gossip protocol for peer discovery and propagation.
 *
 * For MVP the network layer is SIMULATED -- sendMessage() and fetchCard()
 * log to stderr what they would transmit over the wire.  All gossip logic
 * (peer selection, delta exchange, failure detection) is real.
 */

import type { Embedder } from '../registry/embedder.js';
import type { PeerStore } from './peer-store.js';
import type {
  AgentCard,
  AgentSkill,
  GossipMessage,
  MeshConfig,
  PeerEntry,
} from './types.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Number of consecutive failures before marking a peer dead. */
const MAX_FAILURES = 3;

/** Jitter range applied to gossip interval (plus/minus 20%). */
const JITTER_FACTOR = 0.2;

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export class GossipEngine {
  private readonly config: MeshConfig;
  private readonly peerStore: PeerStore;
  private readonly embedder: Embedder;

  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;
  private rounds = 0;

  /** Tracks consecutive send failures per peer URL. */
  private readonly failureCounts = new Map<string, number>();

  constructor(config: MeshConfig, peerStore: PeerStore, embedder: Embedder) {
    this.config = config;
    this.peerStore = peerStore;
    this.embedder = embedder;
  }

  // ---------- Lifecycle -----------------------------------------------------

  start(): void {
    if (this.running) return;
    this.running = true;

    // Bootstrap: discover seed peers.
    for (const url of this.config.seedPeers) {
      void this.discoverPeer(url);
    }

    // Schedule gossip rounds with jitter.
    this.scheduleNext();
    stderr(`[gossip] started -- interval ${this.config.gossipIntervalMs}ms, ` +
           `${this.config.seedPeers.length} seed peer(s)`);
  }

  stop(): void {
    this.running = false;
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    stderr('[gossip] stopped');
  }

  isRunning(): boolean {
    return this.running;
  }

  getStats(): { totalPeers: number; activePeers: number; gossipRounds: number } {
    return {
      totalPeers: this.peerStore.peerCount(),
      activePeers: this.peerStore.getActivePeers().length,
      gossipRounds: this.rounds,
    };
  }

  // ---------- Discovery -----------------------------------------------------

  /**
   * Discover a new peer by URL.
   *
   * 1. Fetch their agent card (stub).
   * 2. Embed each of their skills.
   * 3. Add to the peer store.
   * 4. Announce ourselves to them (stub).
   */
  async discoverPeer(url: string): Promise<void> {
    // Don't discover ourselves.
    if (url === this.config.selfUrl) return;

    // Already know this peer and they're alive? Skip.
    const existing = this.peerStore.getPeer(url);
    if (existing && existing.status === 'active' && existing.agentCard.name !== 'unknown') {
      return;
    }

    stderr(`[gossip] discovering peer: ${url}`);

    const card = await this.fetchAgentCard(url);
    if (!card) {
      stderr(`[gossip] failed to fetch card from ${url}`);
      return;
    }

    // Embed each skill.
    const skillVectors = new Map<string, Float32Array>();
    for (const skill of card.skills) {
      const text = `${skill.name} ${skill.description} ${skill.tags.join(' ')}`;
      const vec = await this.embedder.embed(text);
      skillVectors.set(skill.id, vec);
    }

    const entry: PeerEntry = {
      url,
      agentCard: card,
      skillVectors,
      trustScore: 0.5, // Initial trust -- neutral.
      lastSeen: new Date().toISOString(),
      generation: 1,
      status: 'active',
    };

    this.peerStore.addPeer(entry);
    this.failureCounts.delete(url);

    // Announce ourselves to the new peer.
    await this.sendAnnouncement(url);
  }

  // ---------- Incoming gossip -----------------------------------------------

  handleGossip(message: GossipMessage): void {
    stderr(`[gossip] received ${message.type} from ${message.sender} ` +
           `with ${message.peers.length} peer update(s)`);

    switch (message.type) {
      case 'peer_announcement':
      case 'peer_exchange':
        this.peerStore.importGossipUpdates(message.peers);

        // Discover any new peers we learned about.
        for (const update of message.peers) {
          const peer = this.peerStore.getPeer(update.url);
          if (peer && peer.agentCard.name === 'unknown') {
            void this.discoverPeer(update.url);
          }
        }
        break;

      case 'peer_departure': {
        for (const update of message.peers) {
          this.peerStore.markDead(update.url);
        }
        break;
      }
    }
  }

  // ---------- Gossip round --------------------------------------------------

  private async gossipRound(): Promise<void> {
    this.rounds++;

    const target = this.peerStore.getRandomPeer();
    if (!target) {
      stderr(`[gossip] round ${this.rounds}: no active peers to gossip with`);
      return;
    }

    stderr(`[gossip] round ${this.rounds}: exchanging with ${target.url}`);

    const updates = this.peerStore.exportGossipUpdates();

    // Include ourselves in the update list.
    const selfUpdate = {
      url: this.config.selfUrl,
      skillsSummary: this.config.selfCard.skills.map((s) => s.name),
      skillsHash: '00000000', // Our own hash -- peers will verify.
      lastSeen: new Date().toISOString(),
      generation: this.rounds, // Use round count as our generation.
      trustScore: 1.0, // We trust ourselves fully.
    };

    const message: GossipMessage = {
      type: 'peer_exchange',
      sender: this.config.selfUrl,
      timestamp: new Date().toISOString(),
      peers: [selfUpdate, ...updates],
    };

    const success = await this.sendGossip(target.url, message);

    if (success) {
      this.failureCounts.delete(target.url);
    } else {
      const failures = (this.failureCounts.get(target.url) ?? 0) + 1;
      this.failureCounts.set(target.url, failures);

      if (failures >= MAX_FAILURES) {
        stderr(`[gossip] marking ${target.url} as dead after ${failures} failures`);
        this.peerStore.markDead(target.url);
        this.failureCounts.delete(target.url);
      } else {
        stderr(`[gossip] marking ${target.url} as suspect (failure ${failures}/${MAX_FAILURES})`);
        this.peerStore.markSuspect(target.url);
      }
    }
  }

  // ---------- Scheduling with jitter ----------------------------------------

  private scheduleNext(): void {
    if (!this.running) return;

    const base = this.config.gossipIntervalMs;
    const jitter = base * JITTER_FACTOR * (Math.random() * 2 - 1);
    const delay = Math.max(1000, Math.round(base + jitter));

    this.timer = setTimeout(async () => {
      try {
        await this.gossipRound();
      } catch (err) {
        stderr(`[gossip] round failed: ${String(err)}`);
      }
      this.scheduleNext();
    }, delay);
  }

  // ---------- Stub network layer (MVP) --------------------------------------

  /**
   * STUB: Fetch an agent card from a remote peer.
   *
   * In production this would be an HTTP GET to `${url}/.well-known/agent.json`.
   * For MVP we return a synthetic card so the gossip logic can be exercised.
   */
  private async fetchAgentCard(url: string): Promise<AgentCard | null> {
    stderr(`[net/stub] GET ${url}/.well-known/agent.json`);

    // Simulate network latency.
    await delay(5);

    // Return a plausible synthetic card.
    return {
      name: `agent-${urlToSlug(url)}`,
      description: `Remote agent at ${url}`,
      version: '1.0.0',
      url,
      skills: [
        {
          id: `${urlToSlug(url)}-default`,
          name: 'general',
          description: 'General purpose agent skill',
          tags: ['general'],
        },
      ],
    };
  }

  /**
   * STUB: Send a gossip message to a remote peer.
   * Returns true if the "send" succeeds.
   */
  private async sendGossip(targetUrl: string, message: GossipMessage): Promise<boolean> {
    stderr(`[net/stub] POST ${targetUrl}/a2a/gossip  ` +
           `type=${message.type} peers=${message.peers.length}`);
    await delay(5);
    // Simulate 90% success rate.
    return Math.random() < 0.9;
  }

  /**
   * STUB: Announce ourselves to a remote peer.
   */
  private async sendAnnouncement(targetUrl: string): Promise<void> {
    const message: GossipMessage = {
      type: 'peer_announcement',
      sender: this.config.selfUrl,
      timestamp: new Date().toISOString(),
      peers: [
        {
          url: this.config.selfUrl,
          skillsSummary: this.config.selfCard.skills.map((s) => s.name),
          skillsHash: '00000000',
          lastSeen: new Date().toISOString(),
          generation: 1,
          trustScore: 1.0,
        },
      ],
    };

    stderr(`[net/stub] POST ${targetUrl}/a2a/gossip  type=peer_announcement`);
    await delay(5);

    // In production we would check the response and handle errors.
    // For MVP we just log it.
    void message;
  }
}

// ---------------------------------------------------------------------------
// AAN Agent Card factory
// ---------------------------------------------------------------------------

/**
 * Create the Agent Affiliate Network's own agent card with its four
 * core skills described for A2A discovery.
 */
export function createAanAgentCard(config: { url: string; version: string }): AgentCard {
  const skills: AgentSkill[] = [
    {
      id: 'aan-product-search',
      name: 'Product Search',
      description:
        'Search a curated catalog of SaaS tools, APIs, and developer products. ' +
        'Returns semantically matched results ranked by fit score.',
      tags: ['search', 'products', 'saas', 'tools', 'recommendations'],
      examples: [
        'Find me a CI/CD tool for a small team',
        'What are the best email APIs?',
      ],
    },
    {
      id: 'aan-recommendation',
      name: 'Product Recommendation',
      description:
        'Get personalized product recommendations based on use case, budget, ' +
        'tech stack, and team size. Multi-perspective scoring with FTC-compliant disclosures.',
      tags: ['recommendation', 'advice', 'comparison', 'affiliate'],
      examples: [
        'Recommend a database for my serverless project',
        'What monitoring tool should I use under $50/month?',
      ],
    },
    {
      id: 'aan-compare',
      name: 'Product Comparison',
      description:
        'Compare multiple products side by side across dimensions like pricing, ' +
        'features, integrations, and community ecosystem.',
      tags: ['compare', 'versus', 'comparison', 'analysis'],
      examples: [
        'Compare Supabase vs Firebase vs PlanetScale',
        'Vercel vs Netlify for a Next.js app',
      ],
    },
    {
      id: 'aan-stack-builder',
      name: 'Stack Builder',
      description:
        'Build a complete tech stack recommendation for a project type. ' +
        'Considers inter-product compatibility and integration density.',
      tags: ['stack', 'architecture', 'full-stack', 'project-setup'],
      examples: [
        'Build me a stack for a real-time SaaS app',
        'What tools do I need for a data pipeline?',
      ],
    },
  ];

  return {
    name: 'Agent Affiliate Network',
    description:
      'Curated product discovery and affiliate recommendations for AI agents. ' +
      'Semantic search across SaaS tools with multi-perspective scoring.',
    version: config.version,
    url: config.url,
    skills,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stderr(msg: string): void {
  process.stderr.write(msg + '\n');
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function urlToSlug(url: string): string {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32);
}
