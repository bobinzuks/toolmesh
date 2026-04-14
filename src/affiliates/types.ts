/**
 * Affiliate network types and constants for the Agent Affiliate Network.
 *
 * Defines the supported affiliate networks, link structures, and conversion
 * event shapes used across the tracking and link-generation modules.
 */

export interface AffiliateNetwork {
  name: string;
  slug: string;
  apiBaseUrl?: string;
  supportsApi: boolean;
}

export interface AffiliateLink {
  productId: string;
  network: string;
  rawLink: string;
  trackingParams: Record<string, string>;
  generatedUrl: string;
}

export interface ConversionEvent {
  id: string;
  productId: string;
  network: string;
  timestamp: string;
  type: 'click' | 'signup' | 'purchase' | 'churn';
  revenue?: number;
  subAffiliateId?: string;
}

export interface AffiliateProgram {
  id: string;
  name: string;
  slug: string;
  commissionType: 'recurring' | 'one-time' | 'hybrid';
  commissionRate?: string;
  commissionAmount?: number;
  cookieDays: number;
  payoutMinimum?: number;
  currency: string;
  applicationUrl?: string;
  apiAvailable: boolean;
}

export const NETWORKS: Record<string, AffiliateNetwork> = {
  'cj-affiliate': {
    name: 'CJ Affiliate',
    slug: 'cj-affiliate',
    apiBaseUrl: 'https://commissionjunction.com/api',
    supportsApi: true,
  },
  'partnerstack': {
    name: 'PartnerStack',
    slug: 'partnerstack',
    apiBaseUrl: 'https://api.partnerstack.com/v1',
    supportsApi: true,
  },
  'rewardful': {
    name: 'Rewardful',
    slug: 'rewardful',
    apiBaseUrl: 'https://api.rewardful.com/v1',
    supportsApi: true,
  },
  'dub-partners': {
    name: 'Dub Partners',
    slug: 'dub-partners',
    apiBaseUrl: 'https://api.dub.co/partners',
    supportsApi: true,
  },
  'impact': {
    name: 'Impact.com',
    slug: 'impact',
    apiBaseUrl: 'https://api.impact.com',
    supportsApi: true,
  },
  'direct': {
    name: 'Direct',
    slug: 'direct',
    supportsApi: false,
  },
};
