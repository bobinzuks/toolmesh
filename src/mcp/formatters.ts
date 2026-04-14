import type { RecommendationResult, ProductRecommendation } from '../types/product.js';
import type { CompareResult, StackResult } from '../types/results.js';

export function formatRecommendation(result: RecommendationResult): string {
  if (result.status === 'refused') {
    return [
      '--- No Recommendations ---',
      '',
      result.refusalReason ?? 'Unable to find matching products.',
      '',
      `Evaluated ${result.queryContext.totalCandidatesEvaluated} candidates.`,
      '',
      result.disclosure,
    ].join('\n');
  }

  const sections: string[] = [];

  for (let i = 0; i < result.recommendations.length; i++) {
    const rec = result.recommendations[i];
    sections.push(formatSingleRecommendation(rec, i + 1));
  }

  const footer = [
    '---',
    `Evaluated ${result.queryContext.totalCandidatesEvaluated} candidates | ` +
      `Confidence threshold: ${(result.queryContext.confidenceThreshold * 100).toFixed(0)}% | ` +
      `Below threshold: ${result.queryContext.candidatesBelowThreshold}`,
    '',
    result.disclosure,
  ].join('\n');

  return [...sections, footer].join('\n\n');
}

function formatSingleRecommendation(rec: ProductRecommendation, rank: number): string {
  const lines: string[] = [
    `#${rank}: ${rec.name}`,
    `Category: ${rec.category}`,
    `Fit Score: ${formatScore(rec.fitScore)} | Confidence: ${formatScore(rec.confidence)} | Trust: ${formatScore(rec.trustScore)}`,
    `Pricing: ${rec.pricingSummary}`,
    '',
    rec.reasoning,
  ];

  if (rec.topDimensions.length > 0) {
    lines.push('');
    lines.push('Score Breakdown:');
    for (const dim of rec.topDimensions) {
      lines.push(`  - ${dim.dimension}: ${formatScore(dim.score)} — ${dim.explanation}`);
    }
  }

  if (rec.affiliateUrl) {
    lines.push('');
    lines.push(`Link: ${rec.affiliateUrl}`);
  }

  return lines.join('\n');
}

export function formatComparison(result: CompareResult): string {
  const sections: string[] = ['--- Product Comparison ---', ''];

  for (const product of result.products) {
    const lines = [
      `## ${product.name}`,
      `Category: ${product.category}`,
      `Fit Score: ${formatScore(product.fitScore)} | Trust: ${formatScore(product.trustScore)}`,
      `Pricing: ${product.pricing}`,
    ];

    if (product.strengths.length > 0) {
      lines.push(`Strengths: ${product.strengths.join(', ')}`);
    }
    if (product.weaknesses.length > 0) {
      lines.push(`Weaknesses: ${product.weaknesses.join(', ')}`);
    }
    if (product.affiliateUrl) {
      lines.push(`Link: ${product.affiliateUrl}`);
    }

    sections.push(lines.join('\n'));
  }

  sections.push('---');
  sections.push(`Winner: ${result.winner}`);
  sections.push(result.winnerReason);
  sections.push('');
  sections.push(result.disclosure);

  return sections.join('\n\n');
}

export function formatAlternative(result: RecommendationResult): string {
  if (result.status === 'refused') {
    return [
      '--- No Alternatives Found ---',
      '',
      result.refusalReason ?? 'Unable to find matching alternatives.',
      '',
      result.disclosure,
    ].join('\n');
  }

  const sections = ['--- Recommended Alternatives ---', ''];

  for (let i = 0; i < result.recommendations.length; i++) {
    const rec = result.recommendations[i];
    sections.push(formatSingleRecommendation(rec, i + 1));
  }

  sections.push('---');
  sections.push(result.disclosure);

  return sections.join('\n\n');
}

export function formatStack(result: StackResult): string {
  const sections = ['--- Recommended Stack ---', ''];

  for (const layer of result.layers) {
    const lines = [
      `[${layer.category}] ${layer.recommended}`,
      `  Fit Score: ${formatScore(layer.fitScore)}`,
      `  Pricing: ${layer.pricing}`,
      `  Reasoning: ${layer.reasoning}`,
    ];
    if (layer.affiliateUrl) {
      lines.push(`  Link: ${layer.affiliateUrl}`);
    }
    sections.push(lines.join('\n'));
  }

  sections.push('---');
  sections.push(`Estimated Total Cost: ${result.totalEstimatedCost}`);
  sections.push('');
  sections.push(result.disclosure);

  return sections.join('\n\n');
}

function formatScore(score: number): string {
  return `${(score * 100).toFixed(0)}%`;
}
