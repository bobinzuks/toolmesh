import { describe, it } from 'node:test';
import assert from 'node:assert';
import { computeConfidence } from './confidence.js';
import { scorePerspectives } from './perspectives.js';
import type {
  CandidateProduct,
  PerspectiveScores,
  RecommendationRequest,
} from '../types/product.js';

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
    features: ['Feature A', 'Feature B'],
    integrations: ['Next.js', 'React'],
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

describe('computeConfidence', () => {
  it('returns a value in [0, 1]', () => {
    const candidate = makeCandidate();
    const request = makeRequest();
    const perspectives = scorePerspectives(candidate, request);
    const confidence = computeConfidence(candidate, request, perspectives);

    assert.ok(confidence >= 0, `Confidence should be >= 0, got ${confidence}`);
    assert.ok(confidence <= 1, `Confidence should be <= 1, got ${confidence}`);
  });

  it('high cosine similarity increases confidence', () => {
    const request = makeRequest();

    const highSim = makeCandidate({ cosineSimilarity: 0.95 });
    const lowSim = makeCandidate({ cosineSimilarity: 0.35 });

    const perspHigh = scorePerspectives(highSim, request);
    const perspLow = scorePerspectives(lowSim, request);

    const confHigh = computeConfidence(highSim, request, perspHigh);
    const confLow = computeConfidence(lowSim, request, perspLow);

    assert.ok(
      confHigh > confLow,
      `High similarity confidence (${confHigh}) should exceed low similarity confidence (${confLow})`,
    );
  });

  it('budget satisfaction increases confidence', () => {
    const request = makeRequest({
      budget: { maxMonthlyUsd: 100, prefersFreeeTier: false },
    });

    const withinBudget = makeCandidate({ pricing: '$20/mo' });
    const overBudget = makeCandidate({ pricing: '$500/mo' });

    const perspWithin = scorePerspectives(withinBudget, request);
    const perspOver = scorePerspectives(overBudget, request);

    const confWithin = computeConfidence(withinBudget, request, perspWithin);
    const confOver = computeConfidence(overBudget, request, perspOver);

    assert.ok(
      confWithin > confOver,
      `Within-budget confidence (${confWithin}) should exceed over-budget confidence (${confOver})`,
    );
  });

  it('category match increases confidence', () => {
    const requestWithCategory = makeRequest({ category: 'database' });

    const matching = makeCandidate({ category: 'database' });
    const nonMatching = makeCandidate({ category: 'hosting' });

    const perspMatch = scorePerspectives(matching, requestWithCategory);
    const perspNoMatch = scorePerspectives(nonMatching, requestWithCategory);

    const confMatch = computeConfidence(matching, requestWithCategory, perspMatch);
    const confNoMatch = computeConfidence(nonMatching, requestWithCategory, perspNoMatch);

    assert.ok(
      confMatch > confNoMatch,
      `Category-match confidence (${confMatch}) should exceed non-match confidence (${confNoMatch})`,
    );
  });

  it('products in worstFor for the need decrease confidence', () => {
    const request = makeRequest({ rawNeed: 'enterprise workloads' });

    const worstForMatch = makeCandidate({ worstFor: ['enterprise workloads'] });
    const noWorstFor = makeCandidate({ worstFor: [] });

    const perspWorst = scorePerspectives(worstForMatch, request);
    const perspClean = scorePerspectives(noWorstFor, request);

    const confWorst = computeConfidence(worstForMatch, request, perspWorst);
    const confClean = computeConfidence(noWorstFor, request, perspClean);

    assert.ok(
      confClean > confWorst,
      `No worst-for match confidence (${confClean}) should exceed worst-for match confidence (${confWorst})`,
    );
  });

  it('low perspective variance (agreement) increases confidence', () => {
    const candidate = makeCandidate();
    const request = makeRequest();

    // All implemented dimensions agree at 0.7
    const agreedPerspectives: PerspectiveScores = {
      semantic: 0.7,
      budgetary: 0.7,
      technicalFit: 0.7,
      scalability: 0.7,
      communityEcosystem: 0.7,
      integrationDensity: 0.7,
      freshness: 0.7,
      causal: 0.5,
      temporal: 0.5,
      migrationCost: 0.5,
      vendorStability: 0.5,
      sentiment: 0.5,
      competitivePosition: 0.5,
    };

    // Wildly disagreeing dimensions
    const disagreedPerspectives: PerspectiveScores = {
      semantic: 1.0,
      budgetary: 0.0,
      technicalFit: 1.0,
      scalability: 0.0,
      communityEcosystem: 1.0,
      integrationDensity: 0.0,
      freshness: 1.0,
      causal: 0.5,
      temporal: 0.5,
      migrationCost: 0.5,
      vendorStability: 0.5,
      sentiment: 0.5,
      competitivePosition: 0.5,
    };

    const confAgreed = computeConfidence(candidate, request, agreedPerspectives);
    const confDisagreed = computeConfidence(candidate, request, disagreedPerspectives);

    assert.ok(
      confAgreed > confDisagreed,
      `Agreed perspectives confidence (${confAgreed}) should exceed disagreed (${confDisagreed})`,
    );
  });

  it('bestFor tag matching increases confidence', () => {
    const request = makeRequest({ rawNeed: 'rapid prototyping for startups' });

    const matchingBestFor = makeCandidate({
      bestFor: ['startups', 'rapid prototyping', 'indie hackers'],
    });
    const noMatchBestFor = makeCandidate({
      bestFor: ['large enterprises', 'compliance-heavy industries'],
    });

    const perspMatch = scorePerspectives(matchingBestFor, request);
    const perspNoMatch = scorePerspectives(noMatchBestFor, request);

    const confMatch = computeConfidence(matchingBestFor, request, perspMatch);
    const confNoMatch = computeConfidence(noMatchBestFor, request, perspNoMatch);

    assert.ok(
      confMatch > confNoMatch,
      `bestFor-matching confidence (${confMatch}) should exceed non-matching (${confNoMatch})`,
    );
  });

  it('very low similarity produces low confidence', () => {
    const candidate = makeCandidate({ cosineSimilarity: 0.05 });
    const request = makeRequest();
    const perspectives = scorePerspectives(candidate, request);
    const confidence = computeConfidence(candidate, request, perspectives);

    // With sim < 0.3, passSemantic returns 0. This heavily drags down confidence.
    assert.ok(
      confidence < 0.6,
      `Very low similarity should produce low confidence, got ${confidence}`,
    );
  });
});
