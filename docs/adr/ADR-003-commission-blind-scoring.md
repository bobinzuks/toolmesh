# ADR-003: Commission-Blind Recommendation Architecture

**Status:** Accepted

## Context

Anti-sycophancy is existential for the Agent Affiliate Network. If agents recommend high-commission products over better-fit products, users lose trust, agents lose credibility, and the network dies. This is not a theoretical risk -- it is the primary failure mode of every ad-tech system that has come before.

The core tension: the business model depends on affiliate commissions, but recommendation quality must be independent of commission rates. These two goals are in direct conflict unless the architecture enforces separation.

Competitors (ChatAds, Adgentic, agentic-ads) either ignore this problem or treat it as a policy concern. Policy is insufficient. The architecture itself must make commission bias structurally impossible in the ranking phase.

## Decision

Implement a **two-phase scoring architecture** with a hard information barrier between phases.

**Phase 1: Commission-Blind Fit Ranking**

The scoring function receives: query embedding, product embeddings, product metadata (category, features, price, trust score). It does NOT receive: commission rate, affiliate program, or affiliate URL.

```
fit_score = w1 * cosine_similarity(query_embedding, product_embedding)
          + w2 * trust_score
          + w3 * category_match
          + w4 * price_fit
```

Products are ranked by `fit_score` descending. The top-K results are passed to Phase 2.

**Phase 2: Affiliate Link Attachment**

The top-K results from Phase 1 are enriched with affiliate links. Commission rate is used ONLY as a tiebreaker when two products have identical fit scores (within epsilon = 0.01).

```
if abs(product_a.fit_score - product_b.fit_score) < 0.01:
    prefer higher commission  // tiebreaker only
```

**4-Pass Confidence Pipeline:**

1. **Semantic match** -- cosine similarity between query and product embeddings
2. **Metadata filter** -- category, price range, feature requirements
3. **Trust gate** -- products below minimum trust threshold are excluded
4. **Confidence score** -- final score with explanation of why this product was recommended

**Audit logging:**

Every recommendation logs both the fit score and the commission rate. An automated audit checks for correlation between commission rates and recommendation rank. If Pearson correlation exceeds 0.3 across a rolling window, an alert fires.

## Consequences

**Positive:**

- Commission bias is structurally impossible in Phase 1. The scoring function literally cannot access commission data.
- Audit trail enables FTC compliance (ADR-007) and internal quality monitoring.
- Trust builds over time as agents consistently recommend the best product, not the highest-paying one.
- The tiebreaker rule is transparent and defensible: "all else being equal, we prefer the product that sustains the network."

**Negative:**

- Revenue per recommendation is lower than a commission-maximizing system. This is the explicit tradeoff.
- Two-phase architecture adds complexity. The information barrier must be enforced at the module boundary, not just by convention.
- Audit correlation checks require sufficient recommendation volume to be statistically meaningful (~1000+ recommendations per rolling window).

**Enforcement:**

- Phase 1 scoring module has no import path to commission data. This is enforced by module structure, not just code review.
- CI linting rule: Phase 1 module cannot import from the affiliate link module.
- Integration tests verify that swapping commission rates does not change Phase 1 rankings.
