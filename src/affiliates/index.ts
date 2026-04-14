/**
 * Affiliate network integrations.
 *
 * Re-exports types, link generation, conversion tracking, and network-specific
 * API clients so consumers can import from a single entry point:
 *
 *   import { generateLink, ConversionTracker, NETWORKS } from '../affiliates/index.js';
 */

// ── Types & constants ─────────────────────────────────────────────────
export type {
  AffiliateNetwork,
  AffiliateLink,
  ConversionEvent,
  AffiliateProgram as AffiliateNetworkProgram,
} from './types.js';

export { NETWORKS } from './types.js';

// ── Link generation ───────────────────────────────────────────────────
export type { GenerateLinkOptions } from './link-generator.js';
export { generateLink, generateLinks } from './link-generator.js';

// ── Conversion tracking ───────────────────────────────────────────────
export type { TrackerStats } from './tracker.js';
export { ConversionTracker } from './tracker.js';

// ── Network API clients ───────────────────────────────────────────────
export type {
  PartnerStackProgram,
  PartnerStackReferral,
} from './partnerstack.js';
export { PartnerStackClient } from './partnerstack.js';

export type {
  RewardfulCampaign,
  RewardfulAffiliate,
  RewardfulReferral,
} from './rewardful.js';
export { RewardfulClient } from './rewardful.js';
