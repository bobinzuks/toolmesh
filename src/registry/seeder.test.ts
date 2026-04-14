import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import crypto from 'node:crypto';
import { seedDatabase } from './seeder.js';
import { resetDb, closeDb } from './database.js';
import { ProductRepository } from './repository.js';
import { embedText } from './embedder.js';

describe('seedDatabase', () => {
  let tmpDir: string;
  let dbPath: string;

  before(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'aan-seeder-test-'));
    dbPath = join(tmpDir, `test-${crypto.randomUUID()}.db`);
  });

  after(() => {
    closeDb();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('creates products in an empty database', () => {
    resetDb(dbPath);
    const result = seedDatabase(dbPath);

    assert.ok(result.inserted > 0, `should insert at least one product, got ${result.inserted}`);
    assert.strictEqual(result.skipped, 0, 'nothing should be skipped on first run');

    const db = resetDb(dbPath);
    const repo = new ProductRepository(db);
    const count = repo.count();
    assert.strictEqual(count, result.inserted, 'count should match inserted');
  });

  it('is idempotent (running twice does not duplicate)', () => {
    // Reset to a fresh db
    const freshPath = join(tmpDir, `test-idempotent-${crypto.randomUUID()}.db`);
    resetDb(freshPath);

    const first = seedDatabase(freshPath);
    assert.ok(first.inserted > 0);

    // Reset the module-level singleton so seedDatabase can use the same path
    resetDb(freshPath);
    const second = seedDatabase(freshPath);
    assert.strictEqual(second.inserted, 0, 'second run should insert nothing');
    assert.strictEqual(second.skipped, first.inserted, 'second run should skip all');

    const db = resetDb(freshPath);
    const repo = new ProductRepository(db);
    const count = repo.count();
    assert.strictEqual(count, first.inserted, 'total count should remain the same');
  });

  it('seeded products have valid embeddings (can be searched)', () => {
    const searchPath = join(tmpDir, `test-search-${crypto.randomUUID()}.db`);
    resetDb(searchPath);
    seedDatabase(searchPath);

    const db = resetDb(searchPath);
    const repo = new ProductRepository(db);

    const queryEmb = embedText('serverless database postgres');
    const results = repo.searchByEmbedding(queryEmb, 5);

    assert.ok(results.length > 0, 'search should return results from seeded data');
    assert.ok(results[0].fitScore > 0, 'results should have positive similarity scores');
  });

  it('seeded products span multiple categories', () => {
    const catPath = join(tmpDir, `test-categories-${crypto.randomUUID()}.db`);
    resetDb(catPath);
    seedDatabase(catPath);

    const db = resetDb(catPath);
    const repo = new ProductRepository(db);
    const all = repo.listAll();

    const categories = new Set(all.map((p) => p.category));
    assert.ok(
      categories.size >= 3,
      `expected at least 3 categories, got ${categories.size}: ${[...categories].join(', ')}`,
    );
  });
});
