import type {
  AffiliateProgram,
  AlternativeRequest,
  CandidateProduct,
  CompareRequest,
  ProductRecommendation,
  RecommendationRequest,
  RecommendationResult,
  ScoredProduct,
  StackRequest,
} from '../types/product.js';
import { FTC_DISCLOSURE } from '../types/product.js';
import type { CompareResult, StackResult } from '../types/results.js';
import { ProductRepository } from '../registry/repository.js';
import type { Embedder } from '../registry/embedder.js';
import { scorePerspectives, computeCompositeFit } from './perspectives.js';
import { computeConfidence } from './confidence.js';
import { checkAntiSycophancy, logAudit } from './anti-sycophancy.js';

// ---------- Configuration ----------

function getConfidenceThreshold(): number {
  return parseFloat(process.env.TOOLMESH_CONFIDENCE_THRESHOLD ?? '0.15');
}
const DEFAULT_K = 10;
const DEFAULT_MAX_RESULTS = 3;

const CATEGORY_MAP: Record<string, string[]> = {
  hosting: ['hosting', 'cloud', 'infrastructure', 'deployment'],
  database: ['database', 'storage', 'data'],
  auth: ['authentication', 'auth', 'identity', 'sso'],
  payments: ['payments', 'billing', 'subscriptions'],
  email: ['email', 'transactional-email', 'marketing-email'],
  monitoring: ['monitoring', 'observability', 'logging', 'apm'],
  analytics: ['analytics', 'product-analytics', 'data-analytics'],
  cms: ['cms', 'content-management', 'headless-cms'],
  'ci-cd': ['ci-cd', 'devops', 'deployment'],
  communication: ['communication', 'chat', 'messaging', 'video'],
};

// ---------- Anti-corruption layer (ADR-003) ----------

/**
 * Strip all commission / affiliate data from scored products before ranking.
 * This is the architectural boundary that enforces commission-blind scoring.
 * Returns CandidateProduct[] with NO affiliate link or payout information.
 */
function stripCommissionData(products: ScoredProduct[]): CandidateProduct[] {
  return products.map((sp) => ({
    id: sp.id,
    name: sp.name,
    category: sp.category,
    description: sp.description,
    pricing: sp.pricing,
    features: sp.features,
    integrations: sp.integrations,
    bestFor: sp.bestFor,
    worstFor: sp.worstFor,
    trustScore: sp.trustScore,
    fitScore: 0, // Will be recomputed by perspective scoring
    cosineSimilarity: sp.perspectiveScores.semantic,
  }));
}

// ---------- Reasoning text generation ----------

function generateReasoning(
  candidate: CandidateProduct,
  request: RecommendationRequest,
): string {
  const parts: string[] = [];

  parts.push(
    `${candidate.name} scores ${(candidate.fitScore * 100).toFixed(0)}% overall fit for your need.`,
  );

  if (candidate.cosineSimilarity > 0.7) {
    parts.push('It closely matches what you described.');
  }

  if (candidate.bestFor.length > 0) {
    parts.push(
      `It is best suited for: ${candidate.bestFor.slice(0, 3).join(', ')}.`,
    );
  }

  if (request.budget) {
    parts.push(
      `Your budget is $${request.budget.maxMonthlyUsd}/mo; this product is priced at ${candidate.pricing}.`,
    );
  }

  if (request.techStack && request.techStack.length > 0) {
    const overlap = request.techStack.filter((t) =>
      candidate.integrations.some(
        (i) => i.toLowerCase() === t.toLowerCase(),
      ),
    );
    if (overlap.length > 0) {
      parts.push(`Integrates with your stack: ${overlap.join(', ')}.`);
    }
  }

  return parts.join(' ');
}

function getTopDimensions(
  scores: Record<string, number>,
): Array<{ dimension: string; score: number; explanation: string }> {
  const stubDims = new Set([
    'causal',
    'temporal',
    'migrationCost',
    'vendorStability',
    'sentiment',
    'competitivePosition',
  ]);

  return Object.entries(scores)
    .filter(([dim]) => !stubDims.has(dim))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([dimension, score]) => ({
      dimension,
      score,
      explanation: dimensionExplanation(dimension, score),
    }));
}

function dimensionExplanation(dimension: string, score: number): string {
  const level =
    score > 0.8
      ? 'excellent'
      : score > 0.6
        ? 'good'
        : score > 0.4
          ? 'moderate'
          : 'low';
  const descriptions: Record<string, string> = {
    semantic: `${level} match to your described need`,
    budgetary: `${level} fit for your budget`,
    technicalFit: `${level} compatibility with your tech stack`,
    scalability: `${level} fit for your team size`,
    communityEcosystem: `${level} ecosystem and feature breadth`,
    integrationDensity: `${level} overlap with your current tools`,
    freshness: `${level} trust and maintenance score`,
  };
  return descriptions[dimension] ?? `${level} score`;
}

function pickBestAffiliateUrl(
  productId: string,
  affiliateMap: Map<string, AffiliateProgram[]>,
): string {
  const programs = affiliateMap.get(productId);
  if (!programs || programs.length === 0) return '';

  const approved = programs.filter((p) => p.approved);
  const pool = approved.length > 0 ? approved : programs;
  pool.sort((a, b) => b.cookieDays - a.cookieDays);
  return pool[0].affiliateLink;
}

function buildNeedText(request: RecommendationRequest): string {
  const parts = [request.rawNeed];
  if (request.category) parts.push(request.category);
  if (request.techStack) parts.push(...request.techStack);
  if (request.teamSize) parts.push(`team size ${request.teamSize}`);
  return parts.join(' ');
}

function inferCategories(requirements: string[]): string[] {
  const categories = new Set<string>();
  const reqText = requirements.join(' ').toLowerCase();

  for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
    for (const kw of keywords) {
      if (reqText.includes(kw)) {
        categories.add(cat);
        break;
      }
    }
  }

  if (categories.size === 0) {
    categories.add('hosting');
  }

  return [...categories];
}

function estimateTotalCost(layers: StackResult['layers']): string {
  let total = 0;
  let allParsed = true;

  for (const layer of layers) {
    const match = layer.pricing
      .toLowerCase()
      .match(/\$\s*([\d,]+(?:\.\d+)?)/);
    if (match) {
      total += parseFloat(match[1].replace(/,/g, ''));
    } else if (/free/i.test(layer.pricing)) {
      // $0
    } else {
      allParsed = false;
    }
  }

  if (!allParsed) {
    return `~$${total.toFixed(0)}/mo (some prices could not be parsed)`;
  }
  return `~$${total.toFixed(0)}/mo`;
}

// ---------- Main Engine ----------

export class RecommendationEngine {
  private readonly repository: ProductRepository;
  private readonly embedder: Embedder;

  constructor(repository: ProductRepository, embedder: Embedder) {
    this.repository = repository;
    this.embedder = embedder;
  }

  /**
   * Core recommendation pipeline (10 steps from DDD domain-services):
   *
   *  1. Parse & profile user need
   *  2. Embed the need
   *  3. Vector search (k=10)
   *  4. Anti-corruption layer: STRIP commission data
   *  5. Score across 13 perspectives
   *  6. Rank by composite fit (commission-blind)
   *  7. Confidence check (refuse below 0.7)
   *  8. Re-attach affiliate links (post-ranking only)
   *  9. Generate reasoning text
   * 10. Attach FTC disclosure
   */
  async recommend(
    request: RecommendationRequest,
  ): Promise<RecommendationResult> {
    const maxResults = request.maxResults ?? DEFAULT_MAX_RESULTS;

    // Step 1 & 2: Parse need, embed it
    const needText = buildNeedText(request);
    const embedding = await this.embedder.embed(needText);

    // Step 3: Vector search (k=10)
    const scoredProducts = this.repository.searchByEmbedding(
      embedding,
      DEFAULT_K,
      request.category ? { category: request.category } : undefined,
    );

    if (scoredProducts.length === 0) {
      return {
        status: 'refused',
        recommendations: [],
        disclosure: FTC_DISCLOSURE,
        queryContext: {
          totalCandidatesEvaluated: 0,
          confidenceThreshold: getConfidenceThreshold(),
          candidatesBelowThreshold: 0,
        },
        refusalReason: 'No products found matching your criteria.',
      };
    }

    // Step 4: Anti-corruption layer -- STRIP commission data (ADR-003)
    const candidates = stripCommissionData(scoredProducts);

    // Step 5 & 6: Score across perspectives, rank by composite fit
    for (const candidate of candidates) {
      const perspectives = scorePerspectives(candidate, request);
      candidate.fitScore = computeCompositeFit(perspectives);
    }

    candidates.sort((a, b) => b.fitScore - a.fitScore);

    // Step 7: Confidence check -- refuse if all below threshold
    const withConfidence = candidates.map((c) => {
      const perspectives = scorePerspectives(c, request);
      const confidence = computeConfidence(c, request, perspectives);
      return { candidate: c, confidence, perspectives };
    });

    const aboveThreshold = withConfidence.filter(
      (item) => item.confidence >= getConfidenceThreshold(),
    );
    const belowThreshold = withConfidence.length - aboveThreshold.length;

    if (aboveThreshold.length === 0) {
      return {
        status: 'refused',
        recommendations: [],
        disclosure: FTC_DISCLOSURE,
        queryContext: {
          totalCandidatesEvaluated: candidates.length,
          confidenceThreshold: getConfidenceThreshold(),
          candidatesBelowThreshold: belowThreshold,
        },
        refusalReason:
          `Found ${candidates.length} candidates but none met the ` +
          `${(getConfidenceThreshold() * 100).toFixed(0)}% confidence threshold. ` +
          `Try broadening your requirements.`,
      };
    }

    // Step 8: Re-attach affiliate links (commission data only used AFTER ranking)
    const affiliateMap = new Map<string, AffiliateProgram[]>();
    for (const item of aboveThreshold) {
      const programs = this.repository.getAffiliatePrograms(
        item.candidate.id,
      );
      if (programs.length > 0) {
        affiliateMap.set(item.candidate.id, programs);
      }
    }

    // Anti-sycophancy gate -- verify ranking integrity
    const sycophancyResult = checkAntiSycophancy(
      aboveThreshold.map((item) => item.candidate),
      affiliateMap,
    );

    if (!sycophancyResult.passed) {
      console.error(
        `[recommendation-engine] Anti-sycophancy gate FAILED: ${sycophancyResult.reason}`,
      );
    }

    // Step 9 & 10: Generate reasoning + FTC disclosure
    const selected = aboveThreshold.slice(0, maxResults);

    const recommendations: ProductRecommendation[] = selected.map((item) => {
      const affiliateUrl = pickBestAffiliateUrl(
        item.candidate.id,
        affiliateMap,
      );
      return {
        name: item.candidate.name,
        category: item.candidate.category,
        fitScore: Math.round(item.candidate.fitScore * 1000) / 1000,
        confidence: Math.round(item.confidence * 1000) / 1000,
        trustScore: item.candidate.trustScore,
        pricingSummary: item.candidate.pricing,
        reasoning: generateReasoning(item.candidate, request),
        affiliateUrl,
        topDimensions: getTopDimensions(item.perspectives),
      };
    });

    // Audit trail
    if (selected.length > 0) {
      logAudit(
        request,
        aboveThreshold.map((i) => i.candidate),
        selected[0].candidate.id,
        affiliateMap,
      );
    }

    return {
      status: 'served',
      recommendations,
      disclosure: FTC_DISCLOSURE,
      queryContext: {
        totalCandidatesEvaluated: candidates.length,
        confidenceThreshold: getConfidenceThreshold(),
        candidatesBelowThreshold: belowThreshold,
      },
    };
  }

  /**
   * Compare specific products head-to-head for a given use case.
   */
  async compare(request: CompareRequest): Promise<CompareResult> {
    const products: CompareResult['products'] = [];

    for (const name of request.products) {
      const product = this.repository.findByName(name.trim());
      if (!product) {
        products.push({
          name: name.trim(),
          category: 'unknown',
          fitScore: 0,
          trustScore: 0,
          pricing: 'Product not found',
          strengths: [],
          weaknesses: [],
          affiliateUrl: '',
        });
        continue;
      }

      // Build a commission-free candidate for perspective scoring
      const candidate: CandidateProduct = {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        pricing: product.pricing,
        features: product.features,
        integrations: product.integrations,
        bestFor: product.bestFor,
        worstFor: product.worstFor,
        trustScore: product.trustScore,
        fitScore: 0,
        cosineSimilarity: 0.5, // No vector search in compare; use neutral baseline
      };

      const recRequest: RecommendationRequest = { rawNeed: request.useCase };
      const perspectives = scorePerspectives(candidate, recRequest);
      candidate.fitScore = computeCompositeFit(perspectives);

      const strengths = Object.entries(perspectives)
        .filter(([, v]) => v > 0.7)
        .map(([k]) => k);
      const weaknesses = Object.entries(perspectives)
        .filter(([, v]) => v < 0.4)
        .map(([k]) => k);

      const affiliates = this.repository.getAffiliatePrograms(product.id);

      products.push({
        name: product.name,
        category: product.category,
        fitScore: candidate.fitScore,
        trustScore: product.trustScore,
        pricing: product.pricing,
        strengths:
          strengths.length > 0 ? strengths : product.bestFor.slice(0, 3),
        weaknesses:
          weaknesses.length > 0 ? weaknesses : product.worstFor.slice(0, 3),
        affiliateUrl:
          affiliates.length > 0 ? affiliates[0].affiliateLink : '',
      });
    }

    const sorted = [...products]
      .filter((p) => p.fitScore > 0)
      .sort((a, b) => b.fitScore - a.fitScore);
    const winner = sorted.length > 0 ? sorted[0].name : 'None';
    const winnerReason =
      sorted.length > 0
        ? `${sorted[0].name} scores highest for "${request.useCase}" with a ${(sorted[0].fitScore * 100).toFixed(0)}% composite fit.`
        : 'No products could be evaluated for comparison.';

    return {
      products,
      winner,
      winnerReason,
      disclosure: FTC_DISCLOSURE,
    };
  }

  /**
   * Find alternatives to a product the user is unhappy with.
   */
  async findAlternative(
    request: AlternativeRequest,
  ): Promise<RecommendationResult> {
    const queryText = `alternative to ${request.currentProduct} because ${request.complaint}`;
    const recRequest: RecommendationRequest = {
      rawNeed: queryText,
      budget: request.budget
        ? {
            maxMonthlyUsd: request.budget.maxMonthlyUsd,
            prefersFreeeTier: false,
          }
        : undefined,
      maxResults: 3,
    };
    return this.recommend(recRequest);
  }

  /**
   * Build a recommended tool stack for a project type.
   * Searches each inferred category independently and picks the best match.
   */
  async getStack(request: StackRequest): Promise<StackResult> {
    const categories = inferCategories(request.requirements);
    const layers: StackResult['layers'] = [];

    for (const category of categories) {
      const queryText = `${request.projectType} ${category} ${request.requirements.join(' ')}`;
      const queryEmbedding = await this.embedder.embed(queryText);
      const results = this.repository.searchByEmbedding(
        queryEmbedding,
        3,
        { category },
      );

      if (results.length > 0) {
        const best = results[0];
        const affiliates = this.repository.getAffiliatePrograms(best.id);
        layers.push({
          category,
          recommended: best.name,
          fitScore: Math.min(best.perspectiveScores.semantic + 0.2, 1),
          reasoning: `Best match for ${category} needs in a ${request.projectType} project.`,
          affiliateUrl:
            affiliates.length > 0 ? affiliates[0].affiliateLink : '',
          pricing: best.pricing,
        });
      }
    }

    return {
      layers,
      totalEstimatedCost: estimateTotalCost(layers),
      disclosure: FTC_DISCLOSURE,
    };
  }
}
