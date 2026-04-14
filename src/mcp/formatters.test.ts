import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  formatRecommendation,
  formatComparison,
  formatAlternative,
  formatStack,
} from './formatters.js';
import { FTC_DISCLOSURE } from '../types/product.js';
import type { RecommendationResult, ProductRecommendation } from '../types/product.js';
import type { CompareResult, StackResult } from '../types/results.js';

// ---------------------------------------------------------------------------
// Helpers to build test fixtures
// ---------------------------------------------------------------------------

function makeRecommendation(overrides?: Partial<ProductRecommendation>): ProductRecommendation {
  return {
    name: 'Supabase',
    category: 'database',
    fitScore: 0.92,
    confidence: 0.88,
    trustScore: 0.85,
    pricingSummary: 'Free tier, then $25/mo',
    reasoning: 'Best overall fit for your needs.',
    affiliateUrl: 'https://example.com/ref/supabase',
    topDimensions: [
      { dimension: 'semantic', score: 0.95, explanation: 'excellent match to your described need' },
      { dimension: 'budgetary', score: 0.80, explanation: 'good fit for your budget' },
    ],
    ...overrides,
  };
}

function makeServedResult(overrides?: Partial<RecommendationResult>): RecommendationResult {
  return {
    status: 'served',
    recommendations: [makeRecommendation()],
    disclosure: FTC_DISCLOSURE,
    queryContext: {
      totalCandidatesEvaluated: 10,
      confidenceThreshold: 0.7,
      candidatesBelowThreshold: 3,
    },
    ...overrides,
  };
}

function makeRefusedResult(overrides?: Partial<RecommendationResult>): RecommendationResult {
  return {
    status: 'refused',
    recommendations: [],
    disclosure: FTC_DISCLOSURE,
    queryContext: {
      totalCandidatesEvaluated: 5,
      confidenceThreshold: 0.7,
      candidatesBelowThreshold: 5,
    },
    refusalReason: 'No products met the confidence threshold.',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// formatRecommendation
// ---------------------------------------------------------------------------

describe('formatRecommendation', () => {
  it('includes product names and fit scores', () => {
    const result = makeServedResult({
      recommendations: [
        makeRecommendation({ name: 'Supabase', fitScore: 0.92 }),
        makeRecommendation({ name: 'PlanetScale', fitScore: 0.85 }),
      ],
    });
    const output = formatRecommendation(result);

    assert.ok(output.includes('Supabase'), 'Should include product name Supabase');
    assert.ok(output.includes('PlanetScale'), 'Should include product name PlanetScale');
    assert.ok(output.includes('92%'), 'Should include fit score for Supabase');
    assert.ok(output.includes('85%'), 'Should include fit score for PlanetScale');
  });

  it('includes confidence and trust scores', () => {
    const result = makeServedResult();
    const output = formatRecommendation(result);

    assert.ok(output.includes('Confidence:'), 'Should include confidence label');
    assert.ok(output.includes('Trust:'), 'Should include trust label');
    assert.ok(output.includes('88%'), 'Should include confidence value');
    assert.ok(output.includes('85%'), 'Should include trust value');
  });

  it('includes FTC disclosure', () => {
    const result = makeServedResult();
    const output = formatRecommendation(result);
    assert.ok(output.includes(FTC_DISCLOSURE), 'Should include the FTC disclosure');
  });

  it('includes ranking numbers', () => {
    const result = makeServedResult({
      recommendations: [
        makeRecommendation({ name: 'First' }),
        makeRecommendation({ name: 'Second' }),
      ],
    });
    const output = formatRecommendation(result);
    assert.ok(output.includes('#1:'), 'Should include rank #1');
    assert.ok(output.includes('#2:'), 'Should include rank #2');
  });

  it('includes score breakdown dimensions', () => {
    const result = makeServedResult();
    const output = formatRecommendation(result);
    assert.ok(output.includes('Score Breakdown:'), 'Should include score breakdown header');
    assert.ok(output.includes('semantic'), 'Should include dimension name');
  });

  it('includes affiliate link', () => {
    const result = makeServedResult();
    const output = formatRecommendation(result);
    assert.ok(output.includes('https://example.com/ref/supabase'), 'Should include affiliate URL');
  });

  it('includes query context stats', () => {
    const result = makeServedResult();
    const output = formatRecommendation(result);
    assert.ok(output.includes('Evaluated 10 candidates'), 'Should include candidates evaluated');
    assert.ok(output.includes('70%'), 'Should include confidence threshold');
  });

  it('handles refused recommendations', () => {
    const result = makeRefusedResult();
    const output = formatRecommendation(result);

    assert.ok(output.includes('No Recommendations'), 'Should include refusal heading');
    assert.ok(
      output.includes('No products met the confidence threshold.'),
      'Should include refusal reason',
    );
    assert.ok(output.includes(FTC_DISCLOSURE), 'Refused output should still include FTC disclosure');
  });

  it('handles refused with custom refusal reason', () => {
    const result = makeRefusedResult({
      refusalReason: 'No products found matching your criteria.',
    });
    const output = formatRecommendation(result);
    assert.ok(output.includes('No products found matching your criteria.'));
  });

  it('handles refused with no refusal reason (uses fallback)', () => {
    const result = makeRefusedResult({ refusalReason: undefined });
    const output = formatRecommendation(result);
    assert.ok(output.includes('Unable to find matching products.'));
  });

  it('handles empty recommendations array with served status', () => {
    const result = makeServedResult({ recommendations: [] });
    const output = formatRecommendation(result);
    // Should still produce the footer with disclosure
    assert.ok(output.includes(FTC_DISCLOSURE), 'Empty served should still have FTC disclosure');
  });

  it('handles recommendation with no topDimensions', () => {
    const rec = makeRecommendation({ topDimensions: [] });
    const result = makeServedResult({ recommendations: [rec] });
    const output = formatRecommendation(result);
    assert.ok(!output.includes('Score Breakdown:'), 'Should not include score breakdown when empty');
  });

  it('handles recommendation with no affiliate URL', () => {
    const rec = makeRecommendation({ affiliateUrl: '' });
    const result = makeServedResult({ recommendations: [rec] });
    const output = formatRecommendation(result);
    assert.ok(!output.includes('Link:'), 'Should not include Link label when URL is empty');
  });
});

// ---------------------------------------------------------------------------
// formatComparison
// ---------------------------------------------------------------------------

describe('formatComparison', () => {
  const compareResult: CompareResult = {
    products: [
      {
        name: 'Supabase',
        category: 'database',
        fitScore: 0.9,
        trustScore: 0.85,
        pricing: 'Free tier, then $25/mo',
        strengths: ['semantic', 'communityEcosystem'],
        weaknesses: ['scalability'],
        affiliateUrl: 'https://example.com/ref/supabase',
      },
      {
        name: 'Firebase',
        category: 'database',
        fitScore: 0.75,
        trustScore: 0.8,
        pricing: 'Pay as you go',
        strengths: ['technicalFit'],
        weaknesses: ['budgetary'],
        affiliateUrl: 'https://example.com/ref/firebase',
      },
    ],
    winner: 'Supabase',
    winnerReason: 'Supabase scores highest for "backend" with a 90% composite fit.',
    disclosure: FTC_DISCLOSURE,
  };

  it('includes winner name', () => {
    const output = formatComparison(compareResult);
    assert.ok(output.includes('Winner: Supabase'), 'Should include winner declaration');
  });

  it('includes comparison heading', () => {
    const output = formatComparison(compareResult);
    assert.ok(output.includes('Product Comparison'), 'Should include comparison heading');
  });

  it('includes all product names', () => {
    const output = formatComparison(compareResult);
    assert.ok(output.includes('Supabase'), 'Should include Supabase');
    assert.ok(output.includes('Firebase'), 'Should include Firebase');
  });

  it('includes strengths and weaknesses', () => {
    const output = formatComparison(compareResult);
    assert.ok(output.includes('Strengths:'), 'Should include strengths');
    assert.ok(output.includes('Weaknesses:'), 'Should include weaknesses');
  });

  it('includes fit scores', () => {
    const output = formatComparison(compareResult);
    assert.ok(output.includes('90%'), 'Should include Supabase fit score');
    assert.ok(output.includes('75%'), 'Should include Firebase fit score');
  });

  it('includes winner reason', () => {
    const output = formatComparison(compareResult);
    assert.ok(output.includes('90% composite fit'), 'Should include winner reason text');
  });

  it('includes affiliate links', () => {
    const output = formatComparison(compareResult);
    assert.ok(output.includes('https://example.com/ref/supabase'));
    assert.ok(output.includes('https://example.com/ref/firebase'));
  });

  it('includes FTC disclosure', () => {
    const output = formatComparison(compareResult);
    assert.ok(output.includes(FTC_DISCLOSURE), 'Should include FTC disclosure');
  });

  it('omits strengths line when strengths array is empty', () => {
    const result: CompareResult = {
      ...compareResult,
      products: [
        { ...compareResult.products[0], strengths: [], weaknesses: [] },
      ],
    };
    const output = formatComparison(result);
    // When strengths is empty, the "Strengths:" line should not appear for that product
    // (the formatter only adds it if strengths.length > 0)
    const lines = output.split('\n');
    const supabaseSection = lines.slice(
      lines.findIndex((l) => l.includes('## Supabase')),
      lines.findIndex((l, i) => i > lines.findIndex((l2) => l2.includes('## Supabase')) && l.startsWith('---')),
    );
    const hasStrengths = supabaseSection.some((l) => l.includes('Strengths:'));
    assert.ok(!hasStrengths, 'Should not include Strengths: when array is empty');
  });
});

// ---------------------------------------------------------------------------
// formatAlternative
// ---------------------------------------------------------------------------

describe('formatAlternative', () => {
  it('includes alternatives heading for served result', () => {
    const result = makeServedResult();
    const output = formatAlternative(result);
    assert.ok(output.includes('Recommended Alternatives'), 'Should include alternatives heading');
  });

  it('includes alternative product details', () => {
    const result = makeServedResult({
      recommendations: [
        makeRecommendation({ name: 'PlanetScale' }),
        makeRecommendation({ name: 'Neon' }),
      ],
    });
    const output = formatAlternative(result);
    assert.ok(output.includes('PlanetScale'));
    assert.ok(output.includes('Neon'));
  });

  it('handles refused alternatives', () => {
    const result = makeRefusedResult();
    const output = formatAlternative(result);
    assert.ok(output.includes('No Alternatives Found'), 'Should include refusal heading');
    assert.ok(output.includes(FTC_DISCLOSURE));
  });

  it('includes FTC disclosure for served result', () => {
    const result = makeServedResult();
    const output = formatAlternative(result);
    assert.ok(output.includes(FTC_DISCLOSURE));
  });
});

// ---------------------------------------------------------------------------
// formatStack
// ---------------------------------------------------------------------------

describe('formatStack', () => {
  const stackResult: StackResult = {
    layers: [
      {
        category: 'database',
        recommended: 'Supabase',
        fitScore: 0.9,
        reasoning: 'Best match for database needs.',
        affiliateUrl: 'https://example.com/ref/supabase',
        pricing: '$25/mo',
      },
      {
        category: 'auth',
        recommended: 'Clerk',
        fitScore: 0.85,
        reasoning: 'Best match for auth needs.',
        affiliateUrl: 'https://example.com/ref/clerk',
        pricing: 'Free tier, then $35/mo',
      },
      {
        category: 'hosting',
        recommended: 'Vercel',
        fitScore: 0.88,
        reasoning: 'Best match for hosting needs.',
        affiliateUrl: '',
        pricing: 'Free for hobby, $20/mo pro',
      },
    ],
    totalEstimatedCost: '~$80/mo',
    disclosure: FTC_DISCLOSURE,
  };

  it('includes all layers with category and product', () => {
    const output = formatStack(stackResult);
    assert.ok(output.includes('[database] Supabase'), 'Should include database layer');
    assert.ok(output.includes('[auth] Clerk'), 'Should include auth layer');
    assert.ok(output.includes('[hosting] Vercel'), 'Should include hosting layer');
  });

  it('includes fit scores for layers', () => {
    const output = formatStack(stackResult);
    assert.ok(output.includes('90%'), 'Should include Supabase fit score');
    assert.ok(output.includes('85%'), 'Should include Clerk fit score');
  });

  it('includes pricing for layers', () => {
    const output = formatStack(stackResult);
    assert.ok(output.includes('$25/mo'), 'Should include Supabase pricing');
    assert.ok(output.includes('Free tier, then $35/mo'), 'Should include Clerk pricing');
  });

  it('includes reasoning for layers', () => {
    const output = formatStack(stackResult);
    assert.ok(output.includes('Best match for database needs.'));
    assert.ok(output.includes('Best match for auth needs.'));
  });

  it('includes total estimated cost', () => {
    const output = formatStack(stackResult);
    assert.ok(output.includes('Estimated Total Cost: ~$80/mo'));
  });

  it('includes affiliate links when present', () => {
    const output = formatStack(stackResult);
    assert.ok(output.includes('https://example.com/ref/supabase'));
    assert.ok(output.includes('https://example.com/ref/clerk'));
  });

  it('omits Link line when affiliate URL is empty', () => {
    const output = formatStack(stackResult);
    // Vercel has no affiliate URL, so its section should not have a "Link:" line
    const lines = output.split('\n');
    const vercelIdx = lines.findIndex((l) => l.includes('[hosting] Vercel'));
    // Check the lines after Vercel until the next separator
    let foundLink = false;
    for (let i = vercelIdx + 1; i < lines.length; i++) {
      if (lines[i].startsWith('---') || lines[i].startsWith('[')) break;
      if (lines[i].includes('Link:')) foundLink = true;
    }
    assert.ok(!foundLink, 'Should not include Link: for Vercel (empty URL)');
  });

  it('includes recommended stack heading', () => {
    const output = formatStack(stackResult);
    assert.ok(output.includes('Recommended Stack'), 'Should include stack heading');
  });

  it('includes FTC disclosure', () => {
    const output = formatStack(stackResult);
    assert.ok(output.includes(FTC_DISCLOSURE));
  });
});

// ---------------------------------------------------------------------------
// FTC Disclosure consistency
// ---------------------------------------------------------------------------

describe('FTC disclosure text', () => {
  it('matches the constant from types/product.ts', () => {
    assert.ok(FTC_DISCLOSURE.includes('affiliate links'));
    assert.ok(FTC_DISCLOSURE.includes('not commission rates'));
    assert.strictEqual(
      FTC_DISCLOSURE,
      'These recommendations include affiliate links. Products were selected based on fit for your stated needs, not commission rates. Affiliate commissions help fund this service.',
    );
  });

  it('is included in all formatter outputs', () => {
    const served = makeServedResult();
    const refused = makeRefusedResult();
    const compare: CompareResult = {
      products: [],
      winner: 'None',
      winnerReason: 'No products.',
      disclosure: FTC_DISCLOSURE,
    };
    const stack: StackResult = {
      layers: [],
      totalEstimatedCost: '~$0/mo',
      disclosure: FTC_DISCLOSURE,
    };

    assert.ok(formatRecommendation(served).includes(FTC_DISCLOSURE), 'served recommendation');
    assert.ok(formatRecommendation(refused).includes(FTC_DISCLOSURE), 'refused recommendation');
    assert.ok(formatComparison(compare).includes(FTC_DISCLOSURE), 'comparison');
    assert.ok(formatAlternative(served).includes(FTC_DISCLOSURE), 'alternative served');
    assert.ok(formatAlternative(refused).includes(FTC_DISCLOSURE), 'alternative refused');
    assert.ok(formatStack(stack).includes(FTC_DISCLOSURE), 'stack');
  });
});
