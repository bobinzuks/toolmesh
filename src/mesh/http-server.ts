/**
 * A2A Gossip Mesh -- HTTP Server
 *
 * Receives inbound mesh traffic over HTTP so that remote peers can:
 *   - Fetch our Agent Card
 *   - Send us gossip messages
 *   - Announce themselves
 *   - Query our known peer list
 *
 * All endpoints live under /.well-known/ to follow the A2A convention.
 */

import { createServer, type IncomingMessage, type ServerResponse, type Server } from 'node:http';
import type { GossipEngine } from './gossip-engine.js';
import type { PeerStore } from './peer-store.js';
import type { AgentCard, GossipMessage, MeshConfig } from './types.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maximum request body size in bytes (256 KB). */
const MAX_BODY_BYTES = 256 * 1024;

/** Maximum number of peers to return in the peer list endpoint. */
const MAX_PEER_LIST = 50;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface MeshServerOptions {
  port: number;
  config: MeshConfig;
  gossipEngine: GossipEngine;
  peerStore: PeerStore;
  /**
   * When true, bind to 0.0.0.0 instead of 127.0.0.1.
   * Use only when the mesh server must be reachable from other machines.
   * Defaults to false (localhost only).
   */
  expose?: boolean;
}

/**
 * Start the mesh HTTP server that receives gossip traffic from remote peers.
 *
 * Returns the `http.Server` instance so the caller can close it on shutdown.
 */
export function startMeshServer(options: MeshServerOptions): Server {
  const { port, config, gossipEngine, peerStore, expose = false } = options;

  const server = createServer((req, res) => {
    void handleRequest(req, res, config, gossipEngine, peerStore);
  });

  // Security: bind to localhost by default. Only bind to all interfaces
  // when the caller explicitly sets `expose: true` (e.g. via --expose flag).
  const host = expose ? '0.0.0.0' : '127.0.0.1';

  server.listen(port, host, () => {
    stderr(`[mesh-http] listening on ${host}:${port}`);
  });

  server.on('error', (err) => {
    stderr(`[mesh-http] server error: ${String(err)}`);
  });

  return server;
}

// ---------------------------------------------------------------------------
// Request router
// ---------------------------------------------------------------------------

async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  config: MeshConfig,
  gossipEngine: GossipEngine,
  peerStore: PeerStore,
): Promise<void> {
  const url = req.url ?? '/';
  const method = (req.method ?? 'GET').toUpperCase();

  try {
    // GET /.well-known/agent-card.json -- serve our Agent Card.
    if (method === 'GET' && url === '/.well-known/agent-card.json') {
      return sendJson(res, 200, config.selfCard);
    }

    // POST /.well-known/mesh-gossip -- receive gossip messages.
    if (method === 'POST' && url === '/.well-known/mesh-gossip') {
      const body = await readBody(req);
      if (body === null) {
        return sendJson(res, 413, { error: 'Request body too large' });
      }

      let message: GossipMessage;
      try {
        message = JSON.parse(body) as GossipMessage;
      } catch {
        return sendJson(res, 400, { error: 'Invalid JSON' });
      }

      if (!isValidGossipMessage(message)) {
        return sendJson(res, 400, { error: 'Invalid gossip message structure' });
      }

      stderr(`[mesh-http] gossip from ${message.sender}: type=${message.type} peers=${message.peers.length}`);
      gossipEngine.handleGossip(message);
      return sendJson(res, 200, { ok: true });
    }

    // POST /.well-known/mesh-announce -- receive peer announcements.
    if (method === 'POST' && url === '/.well-known/mesh-announce') {
      const body = await readBody(req);
      if (body === null) {
        return sendJson(res, 413, { error: 'Request body too large' });
      }

      let announcement: { type?: string; sender?: string; card?: AgentCard };
      try {
        announcement = JSON.parse(body) as { type?: string; sender?: string; card?: AgentCard };
      } catch {
        return sendJson(res, 400, { error: 'Invalid JSON' });
      }

      if (!announcement.sender || typeof announcement.sender !== 'string') {
        return sendJson(res, 400, { error: 'Missing or invalid sender field' });
      }

      stderr(`[mesh-http] announcement from ${announcement.sender}`);

      // Trigger peer discovery for the sender.
      void gossipEngine.discoverPeer(announcement.sender);
      return sendJson(res, 200, { ok: true });
    }

    // GET /.well-known/mesh-peers -- return our known peer list (limited).
    if (method === 'GET' && url === '/.well-known/mesh-peers') {
      const activePeers = peerStore.getActivePeers();
      const peerList = activePeers.slice(0, MAX_PEER_LIST).map((p) => ({
        url: p.url,
        name: p.agentCard.name,
        skills: p.agentCard.skills.map((s) => s.name),
        trustScore: p.trustScore,
        lastSeen: p.lastSeen,
      }));
      return sendJson(res, 200, { peers: peerList, total: activePeers.length });
    }

    // Not found.
    sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    stderr(`[mesh-http] unhandled error on ${method} ${url}: ${String(err)}`);
    if (!res.headersSent) {
      sendJson(res, 500, { error: 'Internal server error' });
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Read the full request body up to MAX_BODY_BYTES.
 * Returns null if the body exceeds the limit.
 */
function readBody(req: IncomingMessage): Promise<string | null> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    req.on('data', (chunk: Buffer) => {
      totalBytes += chunk.length;
      if (totalBytes > MAX_BODY_BYTES) {
        req.destroy();
        resolve(null);
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf-8'));
    });

    req.on('error', (err) => {
      stderr(`[mesh-http] body read error: ${String(err)}`);
      resolve(null);
    });
  });
}

/**
 * Send a JSON response with the given status code.
 */
function sendJson(res: ServerResponse, status: number, data: unknown): void {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'User-Agent': 'ToolMesh/0.1.0',
  });
  res.end(body);
}

/**
 * Basic structural validation for incoming gossip messages.
 */
function isValidGossipMessage(msg: unknown): msg is GossipMessage {
  if (typeof msg !== 'object' || msg === null) return false;
  const m = msg as Record<string, unknown>;
  if (typeof m.type !== 'string') return false;
  if (typeof m.sender !== 'string') return false;
  if (!Array.isArray(m.peers)) return false;
  const validTypes = ['peer_announcement', 'peer_exchange', 'peer_departure'];
  if (!validTypes.includes(m.type)) return false;
  return true;
}

function stderr(msg: string): void {
  process.stderr.write(msg + '\n');
}
