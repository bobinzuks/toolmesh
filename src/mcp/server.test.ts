import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync, rmSync } from 'node:fs';
import crypto from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { resetDb, closeDb } from '../registry/database.js';
import { ProductRepository } from '../registry/repository.js';
import { HashEmbedder } from '../registry/embedder.js';
import { RecommendationEngine } from '../recommendation/engine.js';
import { seedDatabase } from '../registry/seeder.js';
import { createServer } from './server.js';

// ---------------------------------------------------------------------------
// Test-scoped temp database
// ---------------------------------------------------------------------------

let tmpDbDir: string;
let tmpDbPath: string;
let engine: RecommendationEngine;

before(async () => {
  tmpDbDir = join(tmpdir(), `aan-server-test-${crypto.randomUUID()}`);
  mkdirSync(tmpDbDir, { recursive: true });
  tmpDbPath = join(tmpDbDir, 'test-registry.db');

  const db = resetDb(tmpDbPath);
  await seedDatabase(tmpDbPath);

  const embedder = new HashEmbedder();
  const repository = new ProductRepository(db);
  engine = new RecommendationEngine(repository, embedder);
});

after(() => {
  closeDb();
  try {
    rmSync(tmpDbDir, { recursive: true, force: true });
  } catch {
    // Cleanup is best-effort in tests
  }
});

// ---------------------------------------------------------------------------
// createServer
// ---------------------------------------------------------------------------

describe('createServer', () => {
  it('returns an McpServer instance', () => {
    const server = createServer(engine);
    assert.ok(server instanceof McpServer, 'Should return an McpServer instance');
  });

  it('can be created without errors', () => {
    assert.doesNotThrow(() => createServer(engine));
  });

  it('can create multiple independent servers', () => {
    const server1 = createServer(engine);
    const server2 = createServer(engine);
    assert.ok(server1 instanceof McpServer);
    assert.ok(server2 instanceof McpServer);
    assert.notStrictEqual(server1, server2, 'Each call should return a new instance');
  });
});

// ---------------------------------------------------------------------------
// Tool registration verification
//
// McpServer does not expose a public tool listing method without a transport
// connection, so we verify indirectly by creating the server and confirming
// it does not throw. The tool names are the string literals passed to
// server.tool() in server.ts.
// ---------------------------------------------------------------------------

describe('Server tool registration', () => {
  it('registers all 4 tools without error', () => {
    // The createServer function calls server.tool() 4 times.
    // If any registration fails, createServer would throw.
    const server = createServer(engine);
    assert.ok(server, 'Server should be truthy after registering all tools');
  });
});
