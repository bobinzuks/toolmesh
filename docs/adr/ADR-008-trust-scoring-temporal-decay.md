# ADR-008: Trust Scoring with Temporal Decay

**Status:** Accepted

## Context

Product quality changes over time. A SaaS tool that was excellent six months ago may have degraded (price increases, feature removal, support decline, acquisition). Static trust scores become stale and misleading.

A particularly dangerous pattern: a product with high conversion rate but high churn. High conversion means agents recommend it frequently (it looks good on paper). High churn means users cancel quickly (the product fails to deliver). Without temporal decay and churn tracking, this product would maintain a high trust score indefinitely.

The trust scoring system must:

- Reflect current product quality, not historical quality
- Penalize high-conversion + high-churn products
- Reward sustained positive outcomes (conversion + retention)
- Decay toward a neutral baseline in the absence of new signals
- Be resistant to gaming (fake positive signals)

## Decision

Implement a **weighted trust formula with temporal decay**, tracking both conversion and retention signals.

**Trust score formula:**

```
trust_score(t) = decay(t) * (
    w_conversion * conversion_rate
  + w_retention * retention_rate
  + w_satisfaction * satisfaction_signal
  - w_churn * churn_rate
  - w_complaint * complaint_rate
)
```

Where:

- `decay(t) = e^(-lambda * days_since_last_signal)` with `lambda = 0.01` (half-life ~69 days)
- `conversion_rate` = successful purchases / total recommendations
- `retention_rate` = users still active after 30 days / total conversions
- `satisfaction_signal` = positive agent feedback / total feedback (from `report_outcome` tool)
- `churn_rate` = cancellations within 30 days / total conversions
- `complaint_rate` = negative feedback / total feedback

**Weights (initial, tunable):**

| Weight | Value | Rationale |
|--------|-------|-----------|
| w_conversion | 0.20 | Moderate -- conversion alone is insufficient signal |
| w_retention | 0.35 | Highest weight -- retention is the strongest quality signal |
| w_satisfaction | 0.20 | Direct feedback from agents/users |
| w_churn | 0.30 | Heavy penalty -- churn is the strongest negative signal |
| w_complaint | 0.15 | Lighter than churn because complaints are noisier |

**Score range:** 0.0 to 1.0, initialized at 0.5 (neutral) for new products.

**Temporal decay behavior:**

- A product with no new signals decays toward 0.5 (neutral) over ~6 months
- Fresh signals reset the decay clock
- Burst of negative signals causes rapid score drop (no smoothing on negative signals)
- Positive signals are smoothed with exponential moving average to prevent gaming

**Data collection via `report_outcome` tool:**

```typescript
server.tool(
  "report_outcome",
  "Report conversion, retention, or churn outcome for a recommended product",
  {
    productId: z.number(),
    outcome: z.enum(["converted", "retained_30d", "churned", "positive_feedback", "negative_feedback"]),
    details: z.string().optional(),
  },
  async ({ productId, outcome, details }) => {
    await trustScorer.recordOutcome(productId, outcome, details);
    return { content: [{ type: "text", text: "Outcome recorded." }] };
  }
);
```

## Consequences

**Positive:**

- Registry self-corrects. Bad products drop out naturally without manual intervention.
- High-conversion + high-churn products are penalized by the formula. The churn weight (0.30) counteracts the conversion weight (0.20).
- Temporal decay ensures stale products do not hold artificially high scores.
- New products start at 0.5 (neutral), giving them a fair chance without privileging incumbents.
- Agents can contribute to trust scoring via `report_outcome`, creating a feedback loop.

**Negative:**

- Requires sufficient signal volume per product for trust scores to be meaningful. Products with fewer than 10 outcomes retain their 0.5 default.
- Churn data depends on agents (or their users) reporting outcomes. If reporting is sparse, trust scores converge to neutral via decay.
- Temporal decay means a genuinely great product that stops being recommended (low volume) will decay toward neutral. Acceptable -- if it is not being recommended, its score is irrelevant.
- Gaming risk: an adversary could submit fake positive outcomes via `report_outcome`. Mitigation: rate limiting per API key, anomaly detection on outcome patterns.

**Mitigations:**

- Minimum outcome threshold: trust score only diverges from 0.5 after 10+ outcomes.
- Rate limiting: max 10 outcomes per product per API key per day.
- Anomaly detection: flag API keys that submit statistically unusual outcome patterns (e.g., 100% positive for all products).
- Weight tuning: initial weights are based on domain reasoning. After sufficient data collection, weights should be calibrated against actual user satisfaction data.
