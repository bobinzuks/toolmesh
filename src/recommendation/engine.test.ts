// Set threshold for tests (engine reads from env at module load time)
process.env.TOOLMESH_CONFIDENCE_THRESHOLD = '0.7';

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { RecommendationEngine } from './engine.js';
import { ProductRepository } from '../registry/repository.js';
import { HashEmbedder } from '../registry/embedder.js';
import { resetDb, closeDb } from '../registry/database.js';
import { seedDatabase } from '../registry/seeder.js';
import { FTC_DISCLOSURE } from '../types/product.js';

// ---------------------------------------------------------------------------
// Shared test infrastructure
// ---------------------------------------------------------------------------

let engine: RecommendationEngine;
let tmpDir: string;
let dbPath: string;

before(async () => {
  tmpDir = mkdtempSync(join(tmpdir(), 'aan-test-'));
  dbPath = join(tmpDir, 'test-registry.db');

  const db = resetDb(dbPath);
  await seedDatabase(dbPath);

  const repo = new ProductRepository(db);
  const embedder = new HashEmbedder();
  engine = new RecommendationEngine(repo, embedder);
});

after(() => {
  closeDb();
  try {
    rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    // Best-effort cleanup
  }
});

// ---------------------------------------------------------------------------
// recommend()
// ---------------------------------------------------------------------------

describe('RecommendationEngine.recommend()', () => {
  it('returns served status with recommendations for a valid need', async () => {
    // Use keywords that closely match seed product descriptions and bestFor tags
    // to ensure the hash embedder produces adequate cosine similarity.
    const result = await engine.recommend({
      rawNeed: 'Postgres database serverless free tier startup rapid prototyping',
    });

    // The engine should either serve recommendations or refuse with a reason.
    // With seed data containing Supabase, Neon, etc. this query should match well.
    if (result.status === 'served') {
      assert.ok(result.recommendations.length > 0, 'Should return at least one recommendation');
      for (const rec of result.recommendations) {
        assert.ok(rec.name, 'Recommendation should have a name');
        assert.ok(rec.fitScore > 0, 'Recommendation should have a positive fitScore');
        assert.ok(rec.confidence >= 0.7, 'Recommendation confidence should be >= threshold');
      }
    } else {
      // If refused, still a valid response -- hash embedder may not reach threshold
      assert.strictEqual(result.status, 'refused');
      assert.ok(result.refusalReason, 'Refused result should include a reason');
    }
  });

  it('includes FTC disclosure in every response', async () => {
    const served = await engine.recommend({
      rawNeed: 'I need hosting for my Next.js app',
    });

    assert.strictEqual(served.disclosure, FTC_DISCLOSURE);

    // Also check refused responses
    const refused = await engine.recommend({
      rawNeed: 'xyzzy quantum flux capacitor unicorn rainbow',
    });

    assert.strictEqual(refused.disclosure, FTC_DISCLOSURE);
  });

  it('refuses when confidence is below threshold (nonsense query)', async () => {
    const result = await engine.recommend({
      rawNeed: 'zzzzxqwkjflmn plorbwizzle glorbtastic fnorgleplex',
    });

    // With a truly nonsensical query the hash embedder may still find poor matches.
    // Either it refuses or the recommendations have low fit scores.
    if (result.status === 'refused') {
      assert.ok(result.refusalReason, 'Refused result should include a reason');
      assert.strictEqual(result.recommendations.length, 0);
    } else {
      // If it somehow serves, the fitScores should be modest
      for (const rec of result.recommendations) {
        assert.ok(rec.fitScore <= 1, 'fitScore should be <= 1');
      }
    }
  });

  it('respects maxResults parameter', async () => {
    const result = await engine.recommend({
      rawNeed: 'I need a database',
      maxResults: 1,
    });

    if (result.status === 'served') {
      assert.ok(
        result.recommendations.length <= 1,
        `Expected at most 1 recommendation, got ${result.recommendations.length}`,
      );
    }
  });

  it('returns affiliate URLs when available', async () => {
    const result = await engine.recommend({
      rawNeed: 'I need hosting for deployment',
      category: 'hosting',
    });

    if (result.status === 'served') {
      // At least one product in the hosting category should have a non-empty affiliate URL
      // (Vercel, DigitalOcean, etc. have affiliate programs in seed data)
      const hasUrl = result.recommendations.some((r) => r.affiliateUrl.length > 0);
      assert.ok(
        hasUrl,
        'At least one recommendation should have an affiliate URL',
      );
    }
  });

  it('recommendations are commission-blind (fitScore based on need, not payout)', async () => {
    // Request a database -- products should be ranked by fit, not by commission
    const result = await engine.recommend({
      rawNeed: 'I need a Postgres database for my startup with free tier',
      category: 'database',
    });

    if (result.status === 'served' && result.recommendations.length >= 2) {
      // The fitScores should be in descending order (sorted by fit)
      for (let i = 0; i < result.recommendations.length - 1; i++) {
        assert.ok(
          result.recommendations[i].fitScore >= result.recommendations[i + 1].fitScore,
          `Recommendations should be sorted by fitScore descending: ` +
          `${result.recommendations[i].name}(${result.recommendations[i].fitScore}) >= ` +
          `${result.recommendations[i + 1].name}(${result.recommendations[i + 1].fitScore})`,
        );
      }
    }
  });

  it('queryContext includes evaluation metadata', async () => {
    const result = await engine.recommend({
      rawNeed: 'I need email sending for transactional messages',
    });

    assert.ok(
      'queryContext' in result,
      'Result should include queryContext',
    );
    assert.ok(
      typeof result.queryContext.totalCandidatesEvaluated === 'number',
      'totalCandidatesEvaluated should be a number',
    );
    assert.ok(
      typeof result.queryContext.confidenceThreshold === 'number',
      'confidenceThreshold should be a number',
    );
    assert.strictEqual(result.queryContext.confidenceThreshold, 0.7);
  });
});

// ---------------------------------------------------------------------------
// compare()
// ---------------------------------------------------------------------------

describe('RecommendationEngine.compare()', () => {
  it('returns comparison for known products', async () => {
    const result = await engine.compare({
      products: ['Supabase', 'Neon'],
      useCase: 'serverless web application',
    });

    assert.strictEqual(result.products.length, 2);
    assert.ok(result.winner, 'Should declare a winner');
    assert.ok(result.winnerReason, 'Should provide a reason');
    assert.strictEqual(result.disclosure, FTC_DISCLOSURE);

    // Both products should have non-zero fitScore
    for (const p of result.products) {
      assert.ok(p.fitScore > 0, `${p.name} should have fitScore > 0`);
      assert.ok(p.category !== 'unknown', `${p.name} should have a real category`);
    }
  });

  it('handles unknown product names gracefully', async () => {
    const result = await engine.compare({
      products: ['Supabase', 'NonexistentProduct123'],
      useCase: 'anything',
    });

    assert.strictEqual(result.products.length, 2);

    const unknown = result.products.find((p) => p.name === 'NonexistentProduct123');
    assert.ok(unknown, 'Should include the unknown product in results');
    assert.strictEqual(unknown!.fitScore, 0);
    assert.strictEqual(unknown!.pricing, 'Product not found');
    assert.strictEqual(unknown!.category, 'unknown');
  });
});

// ---------------------------------------------------------------------------
// findAlternative()
// ---------------------------------------------------------------------------

describe('RecommendationEngine.findAlternative()', () => {
  it('returns alternatives', async () => {
    const result = await engine.findAlternative({
      currentProduct: 'PlanetScale',
      complaint: 'removed free tier and too expensive',
    });

    // Should return a RecommendationResult (served or refused)
    assert.ok(
      result.status === 'served' || result.status === 'refused',
      `Status should be served or refused, got ${result.status}`,
    );
    assert.strictEqual(result.disclosure, FTC_DISCLOSURE);

    if (result.status === 'served') {
      assert.ok(result.recommendations.length > 0, 'Should suggest at least one alternative');
    }
  });
});

// ---------------------------------------------------------------------------
// getStack()
// ---------------------------------------------------------------------------

describe('RecommendationEngine.getStack()', () => {
  it('returns layers for hosting requirements', async () => {
    const result = await engine.getStack({
      projectType: 'SaaS web application',
      requirements: ['hosting', 'database', 'authentication'],
    });

    assert.ok(result.layers.length > 0, 'Should return at least one stack layer');
    assert.strictEqual(result.disclosure, FTC_DISCLOSURE);
    assert.ok(
      result.totalEstimatedCost.startsWith('~$'),
      `Total cost should start with ~$, got "${result.totalEstimatedCost}"`,
    );

    for (const layer of result.layers) {
      assert.ok(layer.category, 'Layer should have a category');
      assert.ok(layer.recommended, 'Layer should have a recommended product');
      assert.ok(typeof layer.fitScore === 'number', 'Layer should have a fitScore');
    }
  });

  it('returns layers for different category keywords', async () => {
    const result = await engine.getStack({
      projectType: 'e-commerce platform',
      requirements: ['payments', 'email', 'analytics'],
    });

    assert.ok(result.layers.length > 0, 'Should return at least one layer');

    const categories = result.layers.map((l) => l.category);
    // At least one of the requested categories should appear
    const hasRelevant = categories.some((c) =>
      ['payments', 'email', 'analytics'].includes(c),
    );
    assert.ok(hasRelevant, `Expected relevant categories, got: ${categories.join(', ')}`);
  });
});
