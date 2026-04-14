import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import crypto from 'node:crypto';
import { ProductRepository } from './repository.js';
import { resetDb, closeDb } from './database.js';
import { embedText } from './embedder.js';
import type { Product, AffiliateProgram } from '../types/product.js';

function makeTestProduct(overrides?: Partial<Product>): {
  product: Product;
  embedding: Float32Array;
  programs: AffiliateProgram[];
} {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const product: Product = {
    id,
    name: `Test Product ${id.slice(0, 8)}`,
    category: 'database',
    description: 'A test product for unit testing purposes',
    pricing: 'Free tier; Pro $10/mo',
    features: ['feature-a', 'feature-b'],
    integrations: ['node', 'python'],
    bestFor: ['testing', 'development'],
    worstFor: ['production at scale'],
    trustScore: 0.75,
    active: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };

  const text = [product.name, product.category, product.description].join(' ');
  const embedding = embedText(text);

  const programs: AffiliateProgram[] = [
    {
      id: crypto.randomUUID(),
      productId: product.id,
      network: 'test-network',
      affiliateLink: `https://example.com/aff/${product.id}`,
      payoutType: 'per-signup',
      payoutAmount: 5.0,
      payoutCurrency: 'USD',
      cookieDays: 30,
      approved: true,
    },
  ];

  return { product, embedding, programs };
}

describe('ProductRepository', () => {
  let repo: ProductRepository;
  let tmpDir: string;
  let dbPath: string;

  before(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'aan-repo-test-'));
    dbPath = join(tmpDir, `test-${crypto.randomUUID()}.db`);
    const db = resetDb(dbPath);
    repo = new ProductRepository(db);
  });

  after(() => {
    closeDb();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('insert and findById', () => {
    it('stores a product that can be retrieved by findById', () => {
      const { product, embedding, programs } = makeTestProduct();
      repo.insert(product, embedding, programs);

      const found = repo.findById(product.id);
      assert.ok(found, 'product should be found');
      assert.strictEqual(found.id, product.id);
      assert.strictEqual(found.name, product.name);
      assert.strictEqual(found.category, product.category);
      assert.strictEqual(found.description, product.description);
      assert.deepStrictEqual(found.features, product.features);
      assert.deepStrictEqual(found.bestFor, product.bestFor);
      assert.strictEqual(found.active, true);
    });

    it('returns null for unknown ID', () => {
      const found = repo.findById('non-existent-id-12345');
      assert.strictEqual(found, null);
    });
  });

  describe('findByName', () => {
    it('finds a product case-insensitively', () => {
      const { product, embedding, programs } = makeTestProduct({
        name: 'UniqueTestProduct',
      });
      repo.insert(product, embedding, programs);

      const found = repo.findByName('uniquetestproduct');
      assert.ok(found, 'should find with lowercase');
      assert.strictEqual(found.id, product.id);

      const foundUpper = repo.findByName('UNIQUETESTPRODUCT');
      assert.ok(foundUpper, 'should find with uppercase');
      assert.strictEqual(foundUpper.id, product.id);

      const foundMixed = repo.findByName('UniqueTestProduct');
      assert.ok(foundMixed, 'should find with original case');
      assert.strictEqual(foundMixed.id, product.id);
    });

    it('returns null for unknown name', () => {
      const found = repo.findByName('NoSuchProductName999');
      assert.strictEqual(found, null);
    });
  });

  describe('searchByEmbedding', () => {
    // Insert several products with distinct descriptions for search tests
    const insertedProducts: Array<{ product: Product; embedding: Float32Array }> = [];

    before(() => {
      const specs = [
        { name: 'SearchDB Alpha', category: 'database', description: 'Fast relational SQL database for web applications' },
        { name: 'SearchDB Beta', category: 'database', description: 'NoSQL document store for mobile apps', trustScore: 0.3 },
        { name: 'SearchMail Gamma', category: 'email', description: 'Transactional email delivery service for developers' },
        { name: 'SearchHost Delta', category: 'hosting', description: 'Serverless hosting platform for frontend apps' },
        { name: 'SearchDB Inactive', category: 'database', description: 'Deprecated database product', active: false },
      ];

      for (const spec of specs) {
        const { product, embedding, programs } = makeTestProduct(spec);
        repo.insert(product, embedding, programs);
        insertedProducts.push({ product, embedding });
      }
    });

    it('returns results sorted by similarity', () => {
      const queryEmb = embedText('SQL relational database web');
      const results = repo.searchByEmbedding(queryEmb, 10);

      assert.ok(results.length > 0, 'should return at least one result');

      // Verify descending similarity (fitScore)
      for (let i = 1; i < results.length; i++) {
        assert.ok(
          results[i - 1].fitScore >= results[i].fitScore,
          `results should be sorted by similarity: ${results[i - 1].fitScore} >= ${results[i].fitScore}`,
        );
      }
    });

    it('with category filter only returns matching category', () => {
      const queryEmb = embedText('some general query');
      const results = repo.searchByEmbedding(queryEmb, 20, {
        category: 'email',
      });

      for (const r of results) {
        assert.strictEqual(r.category, 'email', `expected category email, got ${r.category}`);
      }
    });

    it('with minTrust filter excludes low-trust products', () => {
      const queryEmb = embedText('database document store');
      const results = repo.searchByEmbedding(queryEmb, 20, {
        minTrust: 0.5,
      });

      for (const r of results) {
        assert.ok(
          r.trustScore >= 0.5,
          `expected trustScore >= 0.5, got ${r.trustScore} for ${r.name}`,
        );
      }
    });

    it('respects k parameter', () => {
      const queryEmb = embedText('database');
      const results = repo.searchByEmbedding(queryEmb, 2);
      assert.ok(results.length <= 2, `expected at most 2 results, got ${results.length}`);
    });

    it('excludes deactivated products', () => {
      const queryEmb = embedText('deprecated database');
      const results = repo.searchByEmbedding(queryEmb, 20);

      const names = results.map((r) => r.name);
      assert.ok(
        !names.some((n) => n.includes('Inactive')),
        `deactivated product should not appear in results: ${names.join(', ')}`,
      );
    });

    it('includes affiliate programs in results', () => {
      const queryEmb = embedText('database');
      const results = repo.searchByEmbedding(queryEmb, 5);

      assert.ok(results.length > 0);
      for (const r of results) {
        assert.ok(Array.isArray(r.affiliatePrograms), 'should have affiliatePrograms array');
      }
    });
  });

  describe('updateTrustScore', () => {
    it('changes the trust score', () => {
      const { product, embedding, programs } = makeTestProduct({
        trustScore: 0.5,
      });
      repo.insert(product, embedding, programs);

      repo.updateTrustScore(product.id, 0.9);
      const updated = repo.findById(product.id);
      assert.ok(updated);
      assert.strictEqual(updated.trustScore, 0.9);
    });

    it('clamps score to [0, 1] range', () => {
      const { product, embedding, programs } = makeTestProduct({
        trustScore: 0.5,
      });
      repo.insert(product, embedding, programs);

      repo.updateTrustScore(product.id, 1.5);
      let updated = repo.findById(product.id);
      assert.ok(updated);
      assert.strictEqual(updated.trustScore, 1.0, 'should clamp to 1.0');

      repo.updateTrustScore(product.id, -0.3);
      updated = repo.findById(product.id);
      assert.ok(updated);
      assert.strictEqual(updated.trustScore, 0.0, 'should clamp to 0.0');
    });
  });

  describe('updateAffiliateLink', () => {
    it('changes the affiliate link', () => {
      const { product, embedding, programs } = makeTestProduct();
      repo.insert(product, embedding, programs);

      const programId = programs[0].id;
      const newLink = 'https://example.com/new-link';

      repo.updateAffiliateLink(programId, newLink);

      const fetched = repo.getAffiliatePrograms(product.id);
      const updated = fetched.find((p) => p.id === programId);
      assert.ok(updated, 'program should still exist');
      assert.strictEqual(updated.affiliateLink, newLink);
    });
  });

  describe('deactivate', () => {
    it('makes product invisible to search', () => {
      const { product, embedding, programs } = makeTestProduct({
        name: 'DeactivateMe',
        description: 'very unique deactivation test product xyzzy',
      });
      repo.insert(product, embedding, programs);

      // Verify it appears before deactivation
      const queryEmb = embedText('very unique deactivation test product xyzzy');
      const beforeResults = repo.searchByEmbedding(queryEmb, 20);
      const beforeNames = beforeResults.map((r) => r.name);
      assert.ok(beforeNames.includes('DeactivateMe'), 'should appear before deactivation');

      repo.deactivate(product.id);

      // Verify it no longer appears
      const afterResults = repo.searchByEmbedding(queryEmb, 20);
      const afterNames = afterResults.map((r) => r.name);
      assert.ok(!afterNames.includes('DeactivateMe'), 'should not appear after deactivation');

      // But findById still returns it
      const found = repo.findById(product.id);
      assert.ok(found, 'findById should still return deactivated product');
      assert.strictEqual(found.active, false);
    });
  });

  describe('listAll', () => {
    it('returns only active products', () => {
      const products = repo.listAll();
      for (const p of products) {
        assert.strictEqual(p.active, true, `listAll should only return active products, got inactive: ${p.name}`);
      }
    });
  });

  describe('count', () => {
    it('returns correct number of active products', () => {
      const count = repo.count();
      const all = repo.listAll();
      assert.strictEqual(count, all.length, 'count should match listAll length');
    });
  });

  describe('getAffiliatePrograms', () => {
    it('returns programs for a product', () => {
      const { product, embedding, programs } = makeTestProduct();
      repo.insert(product, embedding, programs);

      const fetched = repo.getAffiliatePrograms(product.id);
      assert.strictEqual(fetched.length, programs.length);
      assert.strictEqual(fetched[0].productId, product.id);
      assert.strictEqual(fetched[0].network, 'test-network');
      assert.strictEqual(fetched[0].payoutAmount, 5.0);
    });

    it('returns empty array for unknown product', () => {
      const fetched = repo.getAffiliatePrograms('non-existent-product');
      assert.deepStrictEqual(fetched, []);
    });
  });

  describe('transactional insert', () => {
    it('inserts embedding, product, and programs atomically', () => {
      const { product, embedding, programs } = makeTestProduct();
      // Add a second program
      programs.push({
        id: crypto.randomUUID(),
        productId: product.id,
        network: 'second-network',
        affiliateLink: 'https://example.com/second',
        payoutType: 'recurring',
        payoutAmount: 10.0,
        payoutCurrency: 'USD',
        cookieDays: 60,
        approved: false,
      });

      repo.insert(product, embedding, programs);

      const found = repo.findById(product.id);
      assert.ok(found, 'product should exist');

      const fetchedPrograms = repo.getAffiliatePrograms(product.id);
      assert.strictEqual(fetchedPrograms.length, 2, 'both programs should be inserted');

      // Verify the embedding works for search
      const results = repo.searchByEmbedding(embedding, 5);
      const names = results.map((r) => r.name);
      assert.ok(names.includes(product.name), 'product should be searchable by its own embedding');
    });
  });
});
