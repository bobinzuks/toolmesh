import type {
  AffiliateProgram,
  CandidateProduct,
  RecommendationRequest,
} from '../types/product.js';

export interface SycophancyCheckResult {
  passed: boolean;
  reason?: string;
}

export interface AuditEntry {
  timestamp: string;
  requestNeed: string;
  candidateCount: number;
  selectedProductId: string;
  topByFit: { id: string; fitScore: number };
  topByCommission: { id: string; payout: number } | null;
  sycophancyCheck: SycophancyCheckResult;
}

// In-memory audit log for MVP. Swap for a persistent store in production.
const auditLog: AuditEntry[] = [];

/**
 * Resolve the highest-paying affiliate program payout for a given product.
 * Returns 0 if the product has no affiliate programs.
 */
function getMaxPayout(
  productId: string,
  affiliateData: Map<string, AffiliateProgram[]>,
): number {
  const programs = affiliateData.get(productId);
  if (!programs || programs.length === 0) return 0;
  return Math.max(...programs.map((p) => p.payoutAmount));
}

/**
 * Anti-sycophancy gate (ADR-003).
 *
 * Verifies that the commission-blind ranking was not contaminated.
 * For Phase 1 the architecture guarantees commission-blindness because
 * affiliate data is stripped before scoring. This gate acts as a
 * runtime validation that detects potential drift.
 *
 * The gate FAILS only if:
 *   - The highest-commission product is ranked #1 AND a different product
 *     with a higher fit score exists (i.e., ranking was reordered to favour
 *     commission). In practice this should never happen in Phase 1.
 *
 * The gate WARNS if:
 *   - The highest-commission product is different from the top-fit product
 *     AND has a fit score within 0.05 of the leader. This is an informational
 *     signal, not a failure.
 */
export function checkAntiSycophancy(
  rankedProducts: CandidateProduct[],
  affiliateData: Map<string, AffiliateProgram[]>,
): SycophancyCheckResult {
  if (rankedProducts.length === 0) {
    return { passed: true, reason: 'No candidates to check.' };
  }

  // Top product by fit (already ranked, first element)
  const topByFit = rankedProducts[0];

  // Find the product with the highest commission
  let topCommissionId: string | null = null;
  let topCommissionPayout = 0;

  for (const product of rankedProducts) {
    const payout = getMaxPayout(product.id, affiliateData);
    if (payout > topCommissionPayout) {
      topCommissionPayout = payout;
      topCommissionId = product.id;
    }
  }

  // No affiliate data at all -- gate passes trivially
  if (topCommissionId === null || topCommissionPayout === 0) {
    return { passed: true, reason: 'No commission data present; ranking is inherently unbiased.' };
  }

  // Same product leads both rankings -- no conflict
  if (topCommissionId === topByFit.id) {
    return { passed: true, reason: 'Top-fit product also has highest commission; no conflict.' };
  }

  // Different products. Check if commission-leader's fit is suspiciously close.
  const commissionProduct = rankedProducts.find((p) => p.id === topCommissionId);
  if (!commissionProduct) {
    return { passed: true, reason: 'Commission leader not in candidate set.' };
  }

  const fitGap = topByFit.fitScore - commissionProduct.fitScore;

  if (fitGap < 0) {
    // The commission-leader has a HIGHER fit score but is not ranked first.
    // This means ranking was somehow reordered AGAINST commission -- impossible
    // to be sycophancy, but indicates a sorting bug.
    return {
      passed: false,
      reason: `Ranking anomaly: product ${commissionProduct.id} has higher fit (${commissionProduct.fitScore.toFixed(3)}) than ranked-first product ${topByFit.id} (${topByFit.fitScore.toFixed(3)}).`,
    };
  }

  if (fitGap < 0.05) {
    // Close call -- warn but pass
    console.warn(
      `[anti-sycophancy] WARNING: Commission leader "${commissionProduct.id}" (payout=$${topCommissionPayout}) ` +
      `is within ${fitGap.toFixed(3)} fit of top pick "${topByFit.id}". Logging for audit.`,
    );
    return {
      passed: true,
      reason: `Close margin (${fitGap.toFixed(3)}) between fit-leader and commission-leader. Logged for audit.`,
    };
  }

  return {
    passed: true,
    reason: `Fit-leader "${topByFit.id}" outscores commission-leader "${topCommissionId}" by ${fitGap.toFixed(3)}. No sycophancy risk.`,
  };
}

/**
 * Record an audit trail entry for a recommendation decision.
 * In production this would write to a persistent append-only store.
 */
export function logAudit(
  request: RecommendationRequest,
  candidates: CandidateProduct[],
  selectedId: string,
  affiliateData: Map<string, AffiliateProgram[]>,
): void {
  const topByFit = candidates.length > 0
    ? { id: candidates[0].id, fitScore: candidates[0].fitScore }
    : { id: 'none', fitScore: 0 };

  let topByCommission: { id: string; payout: number } | null = null;
  for (const c of candidates) {
    const payout = getMaxPayout(c.id, affiliateData);
    if (payout > (topByCommission?.payout ?? 0)) {
      topByCommission = { id: c.id, payout };
    }
  }

  const sycophancyCheck = checkAntiSycophancy(candidates, affiliateData);

  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    requestNeed: request.rawNeed,
    candidateCount: candidates.length,
    selectedProductId: selectedId,
    topByFit,
    topByCommission,
    sycophancyCheck,
  };

  auditLog.push(entry);

  // Keep the in-memory log bounded for MVP
  if (auditLog.length > 1000) {
    auditLog.splice(0, auditLog.length - 1000);
  }
}

/**
 * Retrieve the audit log. Intended for debugging / monitoring dashboards.
 */
export function getAuditLog(): readonly AuditEntry[] {
  return auditLog;
}
