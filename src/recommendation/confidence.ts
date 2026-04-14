import type {
  CandidateProduct,
  PerspectiveScores,
  RecommendationRequest,
} from '../types/product.js';

// ---------- Pass 1: Semantic Match ----------

/**
 * Checks whether the raw cosine similarity crosses the minimum threshold.
 * Returns a 0-1 score: 0 if below 0.3, scales linearly from 0.3 to 1.0
 * as similarity goes from 0.3 to 0.9+.
 */
function passSemantic(candidate: CandidateProduct): number {
  const sim = candidate.cosineSimilarity;
  if (sim >= 0.9) return 1.0;
  if (sim < 0.3) return 0.0;
  // Linear scale between 0.3 and 0.9
  return (sim - 0.3) / 0.6;
}

// ---------- Pass 2: Constraint Satisfaction ----------

/**
 * Hard constraint checks:
 * - Budget: is the product price within the user's budget?
 * - Category: does the product match the requested category?
 * - Worst-for: is the user's need mentioned in worstFor?
 *
 * Returns 0-1: each satisfied constraint adds to the score.
 */
function passConstraints(
  candidate: CandidateProduct,
  request: RecommendationRequest,
): number {
  let checks = 0;
  let passed = 0;

  // Budget check
  if (request.budget) {
    checks++;
    const price = parseMonthlyPrice(candidate.pricing);
    if (price !== null && price <= request.budget.maxMonthlyUsd) {
      passed++;
    } else if (price === null) {
      passed += 0.5; // Unknown price -- partial credit
    }
  }

  // Category check
  if (request.category) {
    checks++;
    if (candidate.category.toLowerCase() === request.category.toLowerCase()) {
      passed++;
    }
  }

  // Worst-for check (negative constraint)
  checks++;
  const needWords = request.rawNeed.toLowerCase().split(/\s+/);
  const worstForLower = candidate.worstFor.map((w) => w.toLowerCase());
  const worstMatch = worstForLower.some((wf) =>
    needWords.some((word) => wf.includes(word)),
  );
  if (!worstMatch) {
    passed++;
  }

  return checks > 0 ? passed / checks : 1.0;
}

// ---------- Pass 3: Perspective Agreement ----------

/**
 * Measures how much the various perspective scores agree with each other.
 * Low variance = high agreement = high confidence.
 * High variance = perspectives disagree = lower confidence.
 */
function passPerspectiveAgreement(scores: PerspectiveScores): number {
  // Use the 7 implemented dimensions (not stubs)
  const implemented = [
    scores.semantic,
    scores.budgetary,
    scores.technicalFit,
    scores.scalability,
    scores.communityEcosystem,
    scores.integrationDensity,
    scores.freshness,
  ];

  const mean = implemented.reduce((a, b) => a + b, 0) / implemented.length;
  const variance =
    implemented.reduce((sum, v) => sum + (v - mean) ** 2, 0) /
    implemented.length;

  // Variance ranges from 0 (perfect agreement) to ~0.25 (max disagreement for 0-1 values).
  // Map to a 0-1 confidence score: low variance -> high score.
  const maxVariance = 0.25;
  return Math.max(0, 1 - variance / maxVariance);
}

// ---------- Pass 4: Cross-Validation ----------

/**
 * Checks whether the product's bestFor tags match the user's stated need.
 * More overlap = higher confidence that this product is genuinely relevant.
 */
function passCrossValidation(
  candidate: CandidateProduct,
  request: RecommendationRequest,
): number {
  if (candidate.bestFor.length === 0) return 0.3;

  const needWords = new Set(
    request.rawNeed
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );

  if (needWords.size === 0) return 0.5;

  const bestForLower = candidate.bestFor.map((b) => b.toLowerCase());

  let matchScore = 0;
  for (const bf of bestForLower) {
    const bfWords = bf.split(/\s+/);
    const overlap = bfWords.filter((w) => needWords.has(w)).length;
    if (overlap > 0) {
      matchScore += overlap / bfWords.length;
    }
  }

  // Normalise: perfect match would be matchScore >= bestFor.length
  const normalised = Math.min(matchScore / candidate.bestFor.length, 1);
  // Floor at 0.2 so products without matching tags aren't zeroed out
  return 0.2 + normalised * 0.8;
}

// ---------- Helpers ----------

function parseMonthlyPrice(pricing: string): number | null {
  const lower = pricing.toLowerCase();
  if (/free/i.test(lower) || /\$\s*0(?:\b|[^0-9])/.test(lower)) return 0;

  const match = lower.match(/\$\s*([\d,]+(?:\.\d+)?)\s*(?:\/\s*)?(\w*)/);
  if (!match) return null;

  const amount = parseFloat(match[1].replace(/,/g, ''));
  const period = match[2] ?? '';
  if (/year|yr|annual/.test(period)) return amount / 12;
  return amount;
}

// ---------- Public API ----------

/**
 * Compute a confidence score (0-1) through the 4-pass pipeline.
 *
 * Weights:
 *   Pass 1 (semantic):       30%
 *   Pass 2 (constraints):    20%
 *   Pass 3 (agreement):      25%
 *   Pass 4 (cross-validate): 25%
 */
export function computeConfidence(
  candidate: CandidateProduct,
  request: RecommendationRequest,
  perspectives: PerspectiveScores,
): number {
  const p1 = passSemantic(candidate);
  const p2 = passConstraints(candidate, request);
  const p3 = passPerspectiveAgreement(perspectives);
  const p4 = passCrossValidation(candidate, request);

  return 0.3 * p1 + 0.2 * p2 + 0.25 * p3 + 0.25 * p4;
}
