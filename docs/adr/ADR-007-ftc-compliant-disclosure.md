# ADR-007: FTC-Compliant Disclosure Architecture

**Status:** Accepted

## Context

The Federal Trade Commission requires clear and conspicuous disclosure when recommendations include affiliate links. This applies to AI-generated recommendations. The FTC Endorsement Guides (updated 2023) and the FTC Act Section 5 impose penalties of up to $51,744 per violation for deceptive endorsement practices.

Key FTC requirements for affiliate disclosures:

1. Disclosure must be **clear and conspicuous** -- not buried in fine print
2. Disclosure must be **proximate** to the recommendation -- not on a separate page
3. Disclosure must be present **every time** an affiliate link is shared
4. The relationship between the recommender and the merchant must be stated

In the AAN architecture, the AI agent is the final delivery mechanism to the user. The agent may summarize, rephrase, or strip parts of the MCP tool response. If disclosure is embedded as optional metadata, agents may omit it -- intentionally or through summarization. This is an unacceptable compliance risk.

## Decision

**Server-side disclosure injection in every response.** Disclosure text is embedded directly in the recommendation content, not as separate metadata. It cannot be stripped without altering the recommendation itself.

Every response from `get_recommendation` and `get_affiliate_link` includes disclosure text inline:

```typescript
function formatRecommendation(product: Product, affiliateUrl: string): string {
  return [
    `**${product.name}** - ${product.description}`,
    ``,
    `Fit score: ${product.fitScore}/1.0 | Trust score: ${product.trustScore}/1.0`,
    ``,
    `[Learn more](${affiliateUrl})`,
    ``,
    `---`,
    `*Disclosure: This recommendation includes an affiliate link. ` +
    `The Agent Affiliate Network may earn a commission if you make a purchase, ` +
    `at no additional cost to you. Products are ranked by fit and trust score, ` +
    `not by commission rate.*`,
  ].join("\n");
}
```

**Disclosure properties:**

- Inline with content -- not in a separate `metadata` field that agents can ignore
- Present in every response that contains an affiliate link
- States the material relationship (AAN earns commission)
- States that ranking is not influenced by commission (reinforces ADR-003)
- States no additional cost to user

**Audit enforcement:**

- Integration tests verify that every response containing an affiliate URL also contains the disclosure string
- Server-side validation: responses are checked before sending. If disclosure is missing, the response is blocked and an error is logged.

## Consequences

**Positive:**

- FTC compliance is enforced at the architecture level, not by trusting downstream agents.
- Disclosure cannot be accidentally stripped by agent summarization -- it is part of the content.
- Builds user trust. Transparency about affiliate relationships is a competitive advantage.
- Audit trail: every response with an affiliate link is logged with its disclosure text.
- The disclosure reinforces the commission-blind promise (ADR-003), turning a legal requirement into a trust signal.

**Negative:**

- Response size increases by ~200 bytes per recommendation. Negligible for text, but adds up in batch responses.
- Agents may present the disclosure in a way that looks awkward in their UI. This is acceptable -- awkward disclosure is better than no disclosure.
- Disclosure text is in English only. Internationalization would require detecting the agent's locale, which is not currently supported by MCP.
- If the FTC updates its guidance, the disclosure text must be updated in the server codebase and redeployed.

**Mitigations:**

- Disclosure text is defined as a constant, not hardcoded in each handler. Single point of update.
- Monitor FTC guidance updates. Subscribe to FTC press releases and Endorsement Guides revisions.
- Future: add locale detection and translated disclosures as MCP protocol matures.
