import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  checkAntiSycophancy,
  logAudit,
  getAuditLog,
} from './anti-sycophancy.js';
import type {
  AffiliateProgram,
  CandidateProduct,
  RecommendationRequest,
} from '../types/product.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCandidate(overrides: Partial<CandidateProduct> = {}): CandidateProduct {
  return {
    id: 'product-1',
    name: 'TestDB',
    category: 'database',
    description: 'A test product',
    pricing: '$29/mo',
    features: ['Feature A'],
    integrations: ['Next.js'],
    bestFor: ['startups'],
    worstFor: [],
    trustScore: 0.8,
    fitScore: 0.8,
    cosineSimilarity: 0.7,
    ...overrides,
  };
}

function makeAffiliateProgram(
  overrides: Partial<AffiliateProgram> = {},
): AffiliateProgram {
  return {
    id: 'prog-1',
    productId: 'product-1',
    network: 'direct',
    affiliateLink: 'https://example.com/ref',
    payoutType: 'per-sale',
    payoutAmount: 50,
    payoutCurrency: 'USD',
    cookieDays: 30,
    approved: true,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests: checkAntiSycophancy
// ---------------------------------------------------------------------------

describe('checkAntiSycophancy', () => {
  it('passes when no affiliate data exists', () => {
    const candidates = [makeCandidate({ id: 'a', fitScore: 0.9 })];
    const affiliateData = new Map<string, AffiliateProgram[]>();

    const result = checkAntiSycophancy(candidates, affiliateData);
    assert.strictEqual(result.passed, true);
    assert.ok(result.reason?.includes('No commission data'));
  });

  it('passes when fit-leader equals commission-leader', () => {
    const candidates = [
      makeCandidate({ id: 'a', fitScore: 0.9 }),
      makeCandidate({ id: 'b', fitScore: 0.7 }),
    ];

    const affiliateData = new Map<string, AffiliateProgram[]>([
      ['a', [makeAffiliateProgram({ productId: 'a', payoutAmount: 100 })]],
      ['b', [makeAffiliateProgram({ productId: 'b', payoutAmount: 20 })]],
    ]);

    const result = checkAntiSycophancy(candidates, affiliateData);
    assert.strictEqual(result.passed, true);
    assert.ok(result.reason?.includes('no conflict'));
  });

  it('passes when fit-leader has large gap over commission-leader', () => {
    const candidates = [
      makeCandidate({ id: 'a', fitScore: 0.95 }),
      makeCandidate({ id: 'b', fitScore: 0.6 }),
    ];

    const affiliateData = new Map<string, AffiliateProgram[]>([
      ['a', [makeAffiliateProgram({ productId: 'a', payoutAmount: 10 })]],
      ['b', [makeAffiliateProgram({ productId: 'b', payoutAmount: 200 })]],
    ]);

    const result = checkAntiSycophancy(candidates, affiliateData);
    assert.strictEqual(result.passed, true);
    assert.ok(result.reason?.includes('outscores'));
  });

  it('warns on close margins (within 0.05)', () => {
    const candidates = [
      makeCandidate({ id: 'a', fitScore: 0.82 }),
      makeCandidate({ id: 'b', fitScore: 0.80 }),
    ];

    const affiliateData = new Map<string, AffiliateProgram[]>([
      ['a', [makeAffiliateProgram({ productId: 'a', payoutAmount: 5 })]],
      ['b', [makeAffiliateProgram({ productId: 'b', payoutAmount: 200 })]],
    ]);

    const result = checkAntiSycophancy(candidates, affiliateData);
    // Close margin => passes with a warning reason
    assert.strictEqual(result.passed, true);
    assert.ok(result.reason?.includes('Close margin'));
  });

  it('fails if higher-fit product is not ranked first (sorting anomaly)', () => {
    // Simulate a bug: product b has higher fitScore but is listed second
    const candidates = [
      makeCandidate({ id: 'a', fitScore: 0.70 }),
      makeCandidate({ id: 'b', fitScore: 0.85 }),
    ];

    const affiliateData = new Map<string, AffiliateProgram[]>([
      ['a', [makeAffiliateProgram({ productId: 'a', payoutAmount: 10 })]],
      ['b', [makeAffiliateProgram({ productId: 'b', payoutAmount: 200 })]],
    ]);

    const result = checkAntiSycophancy(candidates, affiliateData);
    assert.strictEqual(result.passed, false);
    assert.ok(result.reason?.includes('Ranking anomaly'));
  });

  it('handles empty candidate list', () => {
    const result = checkAntiSycophancy([], new Map());
    assert.strictEqual(result.passed, true);
  });
});

// ---------------------------------------------------------------------------
// Tests: Audit log
// ---------------------------------------------------------------------------

describe('logAudit', () => {
  it('creates an entry in the audit log', () => {
    const request: RecommendationRequest = { rawNeed: 'test need for audit' };
    const candidates = [makeCandidate({ id: 'x', fitScore: 0.9 })];
    const affiliateData = new Map<string, AffiliateProgram[]>();

    const countBefore = getAuditLog().length;
    logAudit(request, candidates, 'x', affiliateData);
    const countAfter = getAuditLog().length;

    assert.ok(countAfter > countBefore, 'Audit log should have a new entry');
  });

  it('getAuditLog returns logged entries', () => {
    const request: RecommendationRequest = { rawNeed: 'audit retrieval test' };
    const candidates = [makeCandidate({ id: 'y', fitScore: 0.8 })];
    const affiliateData = new Map<string, AffiliateProgram[]>();

    logAudit(request, candidates, 'y', affiliateData);

    const log = getAuditLog();
    const lastEntry = log[log.length - 1];

    assert.ok(lastEntry, 'Should have at least one entry');
    assert.strictEqual(lastEntry.requestNeed, 'audit retrieval test');
    assert.strictEqual(lastEntry.selectedProductId, 'y');
    assert.ok(lastEntry.timestamp, 'Entry should have a timestamp');
    assert.strictEqual(lastEntry.candidateCount, 1);
  });

  it('audit log is bounded at 1000 entries', () => {
    const request: RecommendationRequest = { rawNeed: 'bound test' };
    const candidates = [makeCandidate({ id: 'z', fitScore: 0.5 })];
    const affiliateData = new Map<string, AffiliateProgram[]>();

    // Push enough entries to exceed 1000 total
    // The log may already have entries from previous tests, so we push a known large number
    for (let i = 0; i < 1010; i++) {
      logAudit(request, candidates, 'z', affiliateData);
    }

    const log = getAuditLog();
    assert.ok(
      log.length <= 1000,
      `Audit log should be bounded at 1000, got ${log.length}`,
    );
  });
});
