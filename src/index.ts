#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './types/config.js';
import { getDb } from './registry/database.js';
import type { Embedder } from './registry/embedder.js';
import { HashEmbedder, TransformerEmbedder } from './registry/embedder.js';
import { ProductRepository } from './registry/repository.js';
import { RecommendationEngine } from './recommendation/engine.js';
import { createServer } from './mcp/server.js';
import { seedDatabase } from './registry/seeder.js';
import { verifyAllLinks } from './registry/link-integrity.js';
import { ProductGraph } from './graph/product-graph.js';
import { SonaEngine } from './learning/sona-engine.js';
import { join } from 'node:path';

async function main(): Promise<void> {
  // All startup logging goes to stderr — stdout is reserved for MCP protocol
  const log = (...args: unknown[]) => console.error('[toolmesh]', ...args);

  try {
    log('Starting Agent Affiliate Network MCP server...');

    // 1. Load config
    const config = loadConfig();
    const dbPath = join(config.dataDir, 'registry.db');
    log(`Data directory: ${config.dataDir}`);

    // 2. Initialize database
    const db = getDb(dbPath);
    log('Database initialized.');

    // 3. Create embedder -- prefer real semantic embeddings, fall back to hash
    let embedder: Embedder;
    if (process.env.TOOLMESH_EMBEDDER === 'hash') {
      log('Using hash embedder (TOOLMESH_EMBEDDER=hash).');
      embedder = new HashEmbedder();
    } else {
      try {
        embedder = new TransformerEmbedder();
        log('Loading embedding model (first run downloads ~22MB)...');
        await embedder.embed('warmup');
        log('Embedding model ready.');
      } catch (e) {
        log('Transformer embeddings unavailable, using hash embedder.');
        embedder = new HashEmbedder();
      }
    }

    // 4. Seed if empty (uses the active embedder for better vectors when available)
    const seedResult = await seedDatabase(dbPath, embedder);
    if (seedResult.inserted > 0) {
      log(`Seeded ${seedResult.inserted} products.`);
    }
    const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    log(`Products in registry: ${count.count}`);

    // Verify link integrity at startup
    const integrity = verifyAllLinks(db);
    if (integrity.tampered > 0) {
      log(`WARNING: ${integrity.tampered} affiliate link(s) failed integrity check!`);
      log(`Tampered products: ${integrity.tampered_products.join(', ')}`);
      log('These links will NOT be served. Run "toolmesh seed" to re-sign.');
    } else if (integrity.unsigned > 0) {
      log(`${integrity.unsigned} unsigned link(s). Run "toolmesh seed" to sign them.`);
    } else if (integrity.valid > 0) {
      log(`All ${integrity.valid} affiliate links verified.`);
    }

    // 5. Create repository, product graph, engine
    const repository = new ProductRepository(db);

    // Build product relationship graph for coherent stack recommendations
    const allProducts = repository.listAll();
    const productGraph = new ProductGraph(allProducts);
    productGraph.buildGraph();
    const graphStats = productGraph.getStats();
    log(`Product graph: ${graphStats.nodes} nodes, ${graphStats.edges} edges, ${graphStats.clusters} clusters.`);

    // Initialize SONA learning engine (uses the same SQLite database)
    const sona = new SonaEngine(db);
    const sonaStats = sona.getStats();
    log(`SONA learning engine: ${sonaStats.completedTrajectories} completed trajectories, ${sonaStats.patterns} patterns.`);

    // Abandon stale trajectories from previous runs
    const abandoned = sona.abandonStale();
    if (abandoned > 0) {
      log(`Abandoned ${abandoned} stale SONA trajectories.`);
    }

    const engine = new RecommendationEngine(repository, embedder, productGraph, sona);

    // 6. Create MCP server with tools
    const server = createServer(engine);

    // 7. Connect to stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    log('MCP server running on stdio. Ready for connections.');
  } catch (error) {
    console.error('[toolmesh] Fatal error during startup:', error);
    process.exit(1);
  }
}

main();
