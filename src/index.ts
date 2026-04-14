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
import { join } from 'node:path';

async function main(): Promise<void> {
  // All startup logging goes to stderr — stdout is reserved for MCP protocol
  const log = (...args: unknown[]) => console.error('[aan]', ...args);

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
    try {
      embedder = new TransformerEmbedder();
      log('Loading embedding model (first run downloads ~22MB)...');
      await embedder.embed('warmup');
      log('Embedding model ready.');
    } catch (e) {
      log('Transformer embeddings unavailable, using hash embedder.');
      embedder = new HashEmbedder();
    }

    // 4. Seed if empty (uses the active embedder for better vectors when available)
    const seedResult = await seedDatabase(dbPath, embedder);
    if (seedResult.inserted > 0) {
      log(`Seeded ${seedResult.inserted} products.`);
    }
    const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    log(`Products in registry: ${count.count}`);

    // 5. Create repository, engine
    const repository = new ProductRepository(db);
    const engine = new RecommendationEngine(repository, embedder);

    // 6. Create MCP server with tools
    const server = createServer(engine);

    // 7. Connect to stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    log('MCP server running on stdio. Ready for connections.');
  } catch (error) {
    console.error('[aan] Fatal error during startup:', error);
    process.exit(1);
  }
}

main();
