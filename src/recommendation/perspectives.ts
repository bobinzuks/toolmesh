import type {
  CandidateProduct,
  PerspectiveScores,
  RecommendationRequest,
} from '../types/product.js';

// ---------- Perspective weights for composite score ----------
const WEIGHTS: Record<string, number> = {
  semantic: 0.25,
  budgetary: 0.15,
  technicalFit: 0.15,
  scalability: 0.10,
  communityEcosystem: 0.10,
  integrationDensity: 0.10,
  freshness: 0.05,
  // Stub dimensions -- neutral until data is available
  causal: 0.02,
  temporal: 0.02,
  migrationCost: 0.02,
  vendorStability: 0.02,
  sentiment: 0.01,
  competitivePosition: 0.01,
};

/**
 * Parse a monthly USD price from a pricing string.
 * Returns null when the string cannot be parsed.
 *
 * Handles patterns like:
 *   "Free", "Free tier", "$0"
 *   "$29/mo", "$29 / month"
 *   "From $10/mo", "Starts at $49/month"
 *   "$99/year" (divided by 12)
 */
function parseMonthlyPrice(pricing: string): number | null {
  const lower = pricing.toLowerCase();

  if (/free/i.test(lower) || /\$\s*0(?:\b|[^0-9])/.test(lower)) {
    return 0;
  }

  // Match dollar amounts with optional period indicator
  const match = lower.match(/\$\s*([\d,]+(?:\.\d+)?)\s*(?:\/\s*)?(\w*)/);
  if (!match) return null;

  const amount = parseFloat(match[1].replace(/,/g, ''));
  const period = match[2] ?? '';

  if (/year|yr|annual/.test(period)) return amount / 12;
  // Default to monthly for /mo, /month, or no period
  return amount;
}

/**
 * Map a team-size label to a numeric range midpoint for comparison.
 */
function teamSizeToNumber(
  size: 'solo' | 'small' | 'medium' | 'large' | 'enterprise',
): number {
  const map: Record<string, number> = {
    solo: 1,
    small: 5,
    medium: 25,
    large: 100,
    enterprise: 500,
  };
  return map[size] ?? 10;
}

// ---------- Individual perspective scorers ----------

function scoreBudgetary(
  candidate: CandidateProduct,
  request: RecommendationRequest,
): number {
  if (!request.budget) return 0.5; // No budget constraint -> neutral

  const price = parseMonthlyPrice(candidate.pricing);
  if (price === null) return 0.4; // Can't parse -> slight penalty

  if (price === 0 && request.budget.prefersFreeeTier) return 1.0;
  if (price === 0) return 0.9;

  const max = request.budget.maxMonthlyUsd;
  if (price <= max) {
    // The more headroom the better, but diminishing returns
    return 0.7 + 0.3 * (1 - price / max);
  }
  // Over budget -- drop off steeply
  const overRatio = price / max;
  return Math.max(0, 0.7 - (overRatio - 1) * 0.7);
}

function scoreTechnicalFit(
  candidate: CandidateProduct,
  request: RecommendationRequest,
): number {
  if (!request.techStack || request.techStack.length === 0) return 0.5;

  const integrations = new Set(
    candidate.integrations.map((i) => i.toLowerCase()),
  );
  const matched = request.techStack.filter((t) =>
    integrations.has(t.toLowerCase()),
  ).length;

  return matched / request.techStack.length;
}

function scoreScalability(
  candidate: CandidateProduct,
  request: RecommendationRequest,
): number {
  if (!request.teamSize) return 0.5;

  const size = teamSizeToNumber(request.teamSize);

  // Use bestFor / worstFor as signals
  const bestForLower = candidate.bestFor.map((b) => b.toLowerCase());
  const worstForLower = candidate.worstFor.map((w) => w.toLowerCase());

  const sizeLabels: string[] = [];
  if (size <= 1) sizeLabels.push('solo', 'individual', 'freelancer');
  if (size <= 10) sizeLabels.push('small team', 'startup', 'small');
  if (size <= 50) sizeLabels.push('medium', 'growing');
  if (size > 50) sizeLabels.push('enterprise', 'large team', 'large');

  const bestMatch = sizeLabels.some((label) =>
    bestForLower.some((b) => b.includes(label)),
  );
  const worstMatch = sizeLabels.some((label) =>
    worstForLower.some((w) => w.includes(label)),
  );

  if (bestMatch && !worstMatch) return 0.9;
  if (bestMatch && worstMatch) return 0.5;
  if (worstMatch) return 0.2;
  return 0.5; // No signal
}

function scoreCommunityEcosystem(candidate: CandidateProduct): number {
  // Use feature count + integration count as a proxy for ecosystem maturity
  const featureSignal = Math.min(candidate.features.length / 15, 1);
  const integrationSignal = Math.min(candidate.integrations.length / 10, 1);
  return featureSignal * 0.5 + integrationSignal * 0.5;
}

function scoreIntegrationDensity(
  candidate: CandidateProduct,
  request: RecommendationRequest,
): number {
  if (!request.techStack || request.techStack.length === 0) return 0.5;

  // What fraction of the product's integrations overlap with the user's stack
  if (candidate.integrations.length === 0) return 0;

  const stack = new Set(request.techStack.map((t) => t.toLowerCase()));
  const overlapping = candidate.integrations.filter((i) =>
    stack.has(i.toLowerCase()),
  ).length;

  return overlapping / candidate.integrations.length;
}

function scoreFreshness(candidate: CandidateProduct): number {
  // Trust score as proxy for active maintenance / freshness
  return candidate.trustScore;
}

// ---------- Public API ----------

/**
 * Score a candidate product against a user request across 13 perspectives.
 * Seven are computed from available data; six return a neutral 0.5.
 */
export function scorePerspectives(
  candidate: CandidateProduct,
  request: RecommendationRequest,
): PerspectiveScores {
  return {
    semantic: candidate.cosineSimilarity,
    budgetary: scoreBudgetary(candidate, request),
    technicalFit: scoreTechnicalFit(candidate, request),
    scalability: scoreScalability(candidate, request),
    communityEcosystem: scoreCommunityEcosystem(candidate),
    integrationDensity: scoreIntegrationDensity(candidate, request),
    freshness: scoreFreshness(candidate),
    // Stub dimensions -- neutral until Phase 2+ data sources are wired in
    causal: 0.5,
    temporal: 0.5,
    migrationCost: 0.5,
    vendorStability: 0.5,
    sentiment: 0.5,
    competitivePosition: 0.5,
  };
}

/**
 * Compute a single composite fit score as a weighted average across all
 * perspective dimensions.
 */
export function computeCompositeFit(scores: PerspectiveScores): number {
  let sum = 0;
  let totalWeight = 0;

  for (const [dim, weight] of Object.entries(WEIGHTS)) {
    const value = scores[dim] ?? 0.5;
    sum += value * weight;
    totalWeight += weight;
  }

  // Normalise in case weights don't sum to exactly 1
  return totalWeight > 0 ? sum / totalWeight : 0;
}
