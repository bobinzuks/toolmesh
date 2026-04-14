/**
 * A2A Gossip Mesh -- Gossip Engine
 *
 * SWIM-like gossip protocol for peer discovery and propagation.
 *
 * Network calls use the Node.js built-in fetch() with AbortSignal.timeout
 * for bounded request durations.  All failures are caught and logged to
 * stderr -- network errors never crash the process.
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
   * 1. Fetch their agent card via HTTP.
   * 2. Embed each of their skills.
   * 3. Add to the peer store.
   * 4. Announce ourselves to them via HTTP.
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

  // ---------- Network layer --------------------------------------------------

  /**
   * Fetch an agent card from a remote peer via HTTP GET.
   */
  private async fetchAgentCard(url: string): Promise<AgentCard | null> {
    try {
      const cardUrl = new URL('/.well-known/agent-card.json', url).toString();
      stderr(`[net] GET ${cardUrl}`);
      const res = await fetch(cardUrl, {
        signal: AbortSignal.timeout(5000),
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AAN-Mesh/0.1.0',
        },
      });
      if (!res.ok) {
        stderr(`[net] GET ${cardUrl} failed: ${res.status} ${res.statusText}`);
        return null;
      }
      return await res.json() as AgentCard;
    } catch (err) {
      stderr(`[net] fetchAgentCard(${url}) error: ${String(err)}`);
      return null;
    }
  }

  /**
   * Send a gossip message to a remote peer via HTTP POST.
   * Returns true if the peer acknowledged the message.
   */
  private async sendGossip(peerUrl: string, message: GossipMessage): Promise<boolean> {
    try {
      const gossipUrl = new URL('/.well-known/mesh-gossip', peerUrl).toString();
      stderr(`[net] POST ${gossipUrl} type=${message.type} peers=${message.peers.length}`);
      const res = await fetch(gossipUrl, {
        method: 'POST',
        signal: AbortSignal.timeout(5000),
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AAN-Mesh/0.1.0',
        },
        body: JSON.stringify(message),
      });
      if (!res.ok) {
        stderr(`[net] POST ${gossipUrl} failed: ${res.status} ${res.statusText}`);
      }
      return res.ok;
    } catch (err) {
      stderr(`[net] sendGossip(${peerUrl}) error: ${String(err)}`);
      return false;
    }
  }

  /**
   * Announce ourselves to a remote peer via HTTP POST.
   * Returns true if the peer acknowledged the announcement.
   */
  private async sendAnnouncement(peerUrl: string): Promise<boolean> {
    try {
      const announceUrl = new URL('/.well-known/mesh-announce', peerUrl).toString();
      stderr(`[net] POST ${announceUrl}`);
      const res = await fetch(announceUrl, {
        method: 'POST',
        signal: AbortSignal.timeout(5000),
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AAN-Mesh/0.1.0',
        },
        body: JSON.stringify({
          type: 'peer_announcement',
          sender: this.config.selfUrl,
          card: this.config.selfCard,
        }),
      });
      if (!res.ok) {
        stderr(`[net] POST ${announceUrl} failed: ${res.status} ${res.statusText}`);
      }
      return res.ok;
    } catch (err) {
      stderr(`[net] sendAnnouncement(${peerUrl}) error: ${String(err)}`);
      return false;
    }
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
