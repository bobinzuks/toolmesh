/**
 * Affiliate link generator.
 *
 * Builds tracked affiliate URLs with the correct parameter format for each
 * supported network. Always appends AAN-specific UTM parameters so that
 * downstream analytics can attribute traffic to agent-driven recommendations.
 */

import { NETWORKS } from './types.js';
import type { AffiliateLink } from './types.js';

export interface GenerateLinkOptions {
  /** The base affiliate URL (e.g. https://toolmesh.dev/go/digitalocean). */
  baseLink: string;
  /** Network slug — must match a key in NETWORKS. */
  network: string;
  /** The developer/partner's own sub-affiliate ID for revenue sharing. */
  subAffiliateId?: string;
  /** Campaign identifier for grouping conversions. */
  campaignId?: string;
  /** Which MCP tool triggered this link. */
  source?: 'mcp-recommend' | 'mcp-compare' | 'mcp-alternative' | 'mcp-stack';
  /** Optional product ID to attach to the returned AffiliateLink. */
  productId?: string;
}

/**
 * Build network-specific tracking parameters.
 *
 * Each network uses a different convention:
 *   CJ Affiliate : sid (sub-ID) + aid (advertiser/campaign)
 *   PartnerStack  : ps_partner_key + ps_xid
 *   Rewardful     : via (referral code)
 *   Dub Partners  : ref (partner ID)
 *   Impact.com    : irclickid (click identifier)
 *   Direct / other: ref + standard UTM tags
 */
function buildNetworkParams(
  network: string,
  subAffiliateId?: string,
  campaignId?: string,
): Record<string, string> {
  const params: Record<string, string> = {};

  switch (network) {
    case 'cj-affiliate':
      if (subAffiliateId) params['sid'] = subAffiliateId;
      if (campaignId) params['aid'] = campaignId;
      break;

    case 'partnerstack':
      if (subAffiliateId) params['ps_partner_key'] = subAffiliateId;
      if (campaignId) params['ps_xid'] = campaignId;
      break;

    case 'rewardful':
      if (subAffiliateId) params['via'] = subAffiliateId;
      break;

    case 'dub-partners':
      if (subAffiliateId) params['ref'] = subAffiliateId;
      break;

    case 'impact':
      if (subAffiliateId) params['irclickid'] = subAffiliateId;
      if (campaignId) params['iradid'] = campaignId;
      break;

    case 'direct':
    default:
      if (subAffiliateId) params['ref'] = subAffiliateId;
      break;
  }

  return params;
}

/**
 * Append UTM parameters that are always present on AAN-generated links.
 */
function buildUtmParams(source?: string): Record<string, string> {
  return {
    utm_source: 'aan',
    utm_medium: 'agent-recommendation',
    ...(source ? { utm_campaign: source } : {}),
  };
}

/**
 * Combine a base URL with a set of query parameters, respecting any existing
 * query string on the base URL.
 */
function appendParams(baseUrl: string, params: Record<string, string>): string {
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

/**
 * Generate a fully tracked affiliate URL.
 *
 * @example
 * ```ts
 * const url = generateLink({
 *   baseLink: 'https://toolmesh.dev/go/digitalocean',
 *   network: 'cj-affiliate',
 *   subAffiliateId: 'dev-abc123',
 *   source: 'mcp-recommend',
 * });
 * // => "https://toolmesh.dev/go/digitalocean?sid=dev-abc123&utm_source=aan&utm_medium=agent-recommendation&utm_campaign=mcp-recommend"
 * ```
 */
export function generateLink(options: GenerateLinkOptions): AffiliateLink {
  const {
    baseLink,
    network,
    subAffiliateId,
    campaignId,
    source,
    productId,
  } = options;

  // Validate the network exists (fall back to 'direct' conventions if unknown)
  const resolvedNetwork = NETWORKS[network] ? network : 'direct';

  const networkParams = buildNetworkParams(resolvedNetwork, subAffiliateId, campaignId);
  const utmParams = buildUtmParams(source);
  const allParams = { ...networkParams, ...utmParams };
  const generatedUrl = appendParams(baseLink, allParams);

  return {
    productId: productId ?? '',
    network: resolvedNetwork,
    rawLink: baseLink,
    trackingParams: allParams,
    generatedUrl,
  };
}

/**
 * Generate links for multiple networks at once (useful when a product is
 * listed on more than one affiliate network).
 */
export function generateLinks(
  optionsList: GenerateLinkOptions[],
): AffiliateLink[] {
  return optionsList.map(generateLink);
}
