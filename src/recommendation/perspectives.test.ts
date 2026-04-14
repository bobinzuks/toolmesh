import { describe, it } from 'node:test';
import assert from 'node:assert';
import { scorePerspectives, computeCompositeFit } from './perspectives.js';
import type { CandidateProduct, RecommendationRequest } from '../types/product.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCandidate(overrides: Partial<CandidateProduct> = {}): CandidateProduct {
  return {
    id: 'test-product',
    name: 'TestDB',
    category: 'database',
    description: 'A test database product',
    pricing: '$29/mo',
    features: ['Feature A', 'Feature B', 'Feature C'],
    integrations: ['Next.js', 'React', 'Python'],
    bestFor: ['startups', 'small team'],
    worstFor: ['enterprise workloads'],
    trustScore: 0.85,
    fitScore: 0,
    cosineSimilarity: 0.75,
    ...overrides,
  };
}

function makeRequest(overrides: Partial<RecommendationRequest> = {}): RecommendationRequest {
  return {
    rawNeed: 'I need a database for my startup',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('scorePerspectives', () => {
  it('returns all 13 dimensions', () => {
    const scores = scorePerspectives(makeCandidate(), makeRequest());

    const expectedDimensions = [
      'semantic',
      'budgetary',
      'technicalFit',
      'scalability',
      'communityEcosystem',
      'integrationDensity',
      'freshness',
      'causal',
      'temporal',
      'migrationCost',
      'vendorStability',
      'sentiment',
      'competitivePosition',
    ];

    for (const dim of expectedDimensions) {
      assert.ok(
        dim in scores,
        `Missing dimension: ${dim}`,
      );
      assert.strictEqual(typeof scores[dim], 'number', `${dim} should be a number`);
    }
  });

  it('semantic score equals candidate.cosineSimilarity', () => {
    const candidate = makeCandidate({ cosineSimilarity: 0.92 });
    const scores = scorePerspectives(candidate, makeRequest());
    assert.strictEqual(scores.semantic, 0.92);
  });

  it('budgetary score is 0.5 when no budget provided', () => {
    const scores = scorePerspectives(makeCandidate(), makeRequest());
    assert.strictEqual(scores.budgetary, 0.5);
  });

  it('budgetary score is high when product is within budget', () => {
    const candidate = makeCandidate({ pricing: '$10/mo' });
    const request = makeRequest({
      budget: { maxMonthlyUsd: 50, prefersFreeeTier: false },
    });
    const scores = scorePerspectives(candidate, request);
    // $10 is well within $50 budget => should be > 0.7
    assert.ok(scores.budgetary > 0.7, `Expected budgetary > 0.7, got ${scores.budgetary}`);
  });

  it('budgetary score is low when product exceeds budget', () => {
    const candidate = makeCandidate({ pricing: '$200/mo' });
    const request = makeRequest({
      budget: { maxMonthlyUsd: 50, prefersFreeeTier: false },
    });
    const scores = scorePerspectives(candidate, request);
    // $200 greatly exceeds $50 budget => should be low
    assert.ok(scores.budgetary < 0.3, `Expected budgetary < 0.3, got ${scores.budgetary}`);
  });

  it('budgetary score handles free tier products', () => {
    const candidate = makeCandidate({ pricing: 'Free tier available' });
    const request = makeRequest({
      budget: { maxMonthlyUsd: 50, prefersFreeeTier: true },
    });
    const scores = scorePerspectives(candidate, request);
    // Free product with prefersFreeeTier => should be 1.0
    assert.strictEqual(scores.budgetary, 1.0);
  });

  it('technicalFit is 0.5 when no tech stack provided', () => {
    const scores = scorePerspectives(makeCandidate(), makeRequest());
    assert.strictEqual(scores.technicalFit, 0.5);
  });

  it('technicalFit scores based on integration overlap', () => {
    const candidate = makeCandidate({ integrations: ['Next.js', 'React', 'Python', 'Deno'] });
    const request = makeRequest({ techStack: ['Next.js', 'React'] });
    const scores = scorePerspectives(candidate, request);
    // 2 out of 2 tech stack items match => 1.0
    assert.strictEqual(scores.technicalFit, 1.0);
  });

  it('technicalFit is partial when some integrations match', () => {
    const candidate = makeCandidate({ integrations: ['Next.js', 'React', 'Python'] });
    const request = makeRequest({ techStack: ['Next.js', 'Vue', 'Angular', 'Svelte'] });
    const scores = scorePerspectives(candidate, request);
    // 1 out of 4 => 0.25
    assert.strictEqual(scores.technicalFit, 0.25);
  });

  it('scalability matches team size to bestFor tags', () => {
    const candidate = makeCandidate({ bestFor: ['startups', 'small team'], worstFor: [] });
    const request = makeRequest({ teamSize: 'small' });
    const scores = scorePerspectives(candidate, request);
    // 'small' should match 'small team' in bestFor => 0.9
    assert.strictEqual(scores.scalability, 0.9);
  });

  it('scalability returns 0.5 when no teamSize provided', () => {
    const scores = scorePerspectives(makeCandidate(), makeRequest());
    assert.strictEqual(scores.scalability, 0.5);
  });

  it('communityEcosystem increases with feature and integration count', () => {
    const small = makeCandidate({ features: ['A'], integrations: ['B'] });
    const large = makeCandidate({
      features: Array.from({ length: 15 }, (_, i) => `Feature ${i}`),
      integrations: Array.from({ length: 10 }, (_, i) => `Integration ${i}`),
    });

    const scoresSmall = scorePerspectives(small, makeRequest());
    const scoresLarge = scorePerspectives(large, makeRequest());

    assert.ok(
      scoresLarge.communityEcosystem > scoresSmall.communityEcosystem,
      `Large ecosystem (${scoresLarge.communityEcosystem}) should beat small (${scoresSmall.communityEcosystem})`,
    );
  });

  it('stub dimensions (causal, temporal, etc.) return 0.5', () => {
    const scores = scorePerspectives(makeCandidate(), makeRequest());
    const stubs = ['causal', 'temporal', 'migrationCost', 'vendorStability', 'sentiment', 'competitivePosition'];

    for (const dim of stubs) {
      assert.strictEqual(scores[dim], 0.5, `Expected ${dim} to be 0.5`);
    }
  });
});

describe('computeCompositeFit', () => {
  it('returns weighted average in [0, 1]', () => {
    const scores = scorePerspectives(makeCandidate(), makeRequest());
    const composite = computeCompositeFit(scores);

    assert.ok(composite >= 0, `Composite fit should be >= 0, got ${composite}`);
    assert.ok(composite <= 1, `Composite fit should be <= 1, got ${composite}`);
  });

  it('returns higher composite for better all-around candidate', () => {
    const goodCandidate = makeCandidate({
      cosineSimilarity: 0.95,
      trustScore: 0.95,
      features: Array.from({ length: 15 }, (_, i) => `F${i}`),
      integrations: ['Next.js', 'React', 'Python', 'Deno', 'Vue', 'Angular', 'Rails', 'Django', 'Go', 'Rust'],
    });
    const poorCandidate = makeCandidate({
      cosineSimilarity: 0.1,
      trustScore: 0.1,
      features: [],
      integrations: [],
    });

    const request = makeRequest({
      budget: { maxMonthlyUsd: 100, prefersFreeeTier: false },
      techStack: ['Next.js', 'React'],
    });

    const goodScore = computeCompositeFit(scorePerspectives(goodCandidate, request));
    const poorScore = computeCompositeFit(scorePerspectives(poorCandidate, request));

    assert.ok(
      goodScore > poorScore,
      `Good candidate (${goodScore}) should outscore poor candidate (${poorScore})`,
    );
  });

  it('returns 0.5 when all dimensions are 0.5 (neutral)', () => {
    const neutralScores = {
      semantic: 0.5,
      budgetary: 0.5,
      technicalFit: 0.5,
      scalability: 0.5,
      communityEcosystem: 0.5,
      integrationDensity: 0.5,
      freshness: 0.5,
      causal: 0.5,
      temporal: 0.5,
      migrationCost: 0.5,
      vendorStability: 0.5,
      sentiment: 0.5,
      competitivePosition: 0.5,
    };

    const composite = computeCompositeFit(neutralScores);
    assert.ok(
      Math.abs(composite - 0.5) < 0.001,
      `Expected composite ~0.5 for neutral scores, got ${composite}`,
    );
  });
});
