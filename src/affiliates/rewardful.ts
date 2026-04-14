/**
 * Rewardful API client stub.
 *
 * Rewardful is a Stripe-focused affiliate/referral platform — ideal for SaaS
 * products that bill through Stripe. When a REWARDFUL_API_KEY is set (env var
 * or constructor param), methods hit https://api.rewardful.com/v1.
 * Otherwise they return realistic mock data.
 *
 * Rewardful tracks referrals by linking Stripe customers to affiliate cookies,
 * so commission attribution is automatic once the Stripe integration is wired.
 */

import type { ConversionEvent } from './types.js';

// ── Public types ──────────────────────────────────────────────────────

export interface RewardfulCampaign {
  id: string;
  name: string;
  url: string;
  commissionPercent: number;
  commissionType: 'recurring' | 'one-time';
  maxCommissionPeriodMonths?: number;
  cookieDays: number;
  currency: string;
  active: boolean;
}

export interface RewardfulAffiliate {
  id: string;
  name: string;
  email: string;
  referralLink: string;
  campaignId: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface RewardfulReferral {
  id: string;
  affiliateId: string;
  stripeCustomerId?: string;
  conversionState: 'lead' | 'conversion' | 'sale';
  createdAt: string;
}

// ── Mock data ─────────────────────────────────────────────────────────

const MOCK_CAMPAIGNS: RewardfulCampaign[] = [
  {
    id: 'rw-camp-saas-standard',
    name: 'SaaS Standard Affiliate',
    url: 'https://example.com/affiliates',
    commissionPercent: 20,
    commissionType: 'recurring',
    maxCommissionPeriodMonths: 12,
    cookieDays: 60,
    currency: 'USD',
    active: true,
  },
  {
    id: 'rw-camp-lifetime',
    name: 'Lifetime Deal Partners',
    url: 'https://example.com/partners',
    commissionPercent: 30,
    commissionType: 'one-time',
    cookieDays: 90,
    currency: 'USD',
    active: true,
  },
];

const MOCK_AFFILIATES: RewardfulAffiliate[] = [
  {
    id: 'rw-aff-001',
    name: 'Demo Partner',
    email: 'demo@example.com',
    referralLink: 'https://example.com/?via=demo',
    campaignId: 'rw-camp-saas-standard',
    createdAt: '2025-06-01T00:00:00Z',
    confirmedAt: '2025-06-01T12:00:00Z',
  },
];

const MOCK_CONVERSIONS: ConversionEvent[] = [
  {
    id: 'rw-conv-001',
    productId: 'example-saas',
    network: 'rewardful',
    timestamp: '2025-11-10T09:15:00Z',
    type: 'signup',
    revenue: 0,
    subAffiliateId: 'rw-aff-001',
  },
  {
    id: 'rw-conv-002',
    productId: 'example-saas',
    network: 'rewardful',
    timestamp: '2025-11-18T16:45:00Z',
    type: 'purchase',
    revenue: 49,
    subAffiliateId: 'rw-aff-001',
  },
];

// ── Client ────────────────────────────────────────────────────────────

export class RewardfulClient {
  private apiKey: string | undefined;
  private baseUrl: string;

  /**
   * @param apiKey — Rewardful API secret. Falls back to the
   *   REWARDFUL_API_KEY environment variable. If neither is set the client
   *   operates in mock mode.
   */
  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? process.env['REWARDFUL_API_KEY'];
    this.baseUrl = 'https://api.rewardful.com/v1';
  }

  /** Whether a real API key is configured. */
  get isLive(): boolean {
    return Boolean(this.apiKey);
  }

  // ── Campaigns ───────────────────────────────────────────────────────

  /**
   * List affiliate campaigns.
   *
   * Live mode: GET /campaigns
   * Mock mode: returns sample campaigns.
   */
  async listCampaigns(): Promise<RewardfulCampaign[]> {
    if (!this.apiKey) {
      return MOCK_CAMPAIGNS;
    }

    // TODO: Replace with real API call
    //
    // const res = await fetch(`${this.baseUrl}/campaigns`, {
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`,
    //     'Accept': 'application/json',
    //   },
    // });
    // if (!res.ok) throw new Error(`Rewardful API error: ${res.status}`);
    // const data = await res.json();
    // return data.data.map(mapCampaign);

    return MOCK_CAMPAIGNS;
  }

  /**
   * Get a single campaign by ID.
   */
  async getCampaign(id: string): Promise<RewardfulCampaign | null> {
    const campaigns = await this.listCampaigns();
    return campaigns.find((c) => c.id === id) ?? null;
  }

  // ── Affiliates ──────────────────────────────────────────────────────

  /**
   * List affiliates (optionally filtered to a campaign).
   */
  async listAffiliates(campaignId?: string): Promise<RewardfulAffiliate[]> {
    if (!this.apiKey) {
      if (!campaignId) return MOCK_AFFILIATES;
      return MOCK_AFFILIATES.filter((a) => a.campaignId === campaignId);
    }

    // TODO: Real implementation
    //
    // const qs = campaignId ? `?campaign_id=${campaignId}` : '';
    // const res = await fetch(`${this.baseUrl}/affiliates${qs}`, {
    //   headers: { 'Authorization': `Bearer ${this.apiKey}` },
    // });
    // ...

    return MOCK_AFFILIATES;
  }

  // ── Referral links ──────────────────────────────────────────────────

  /**
   * Generate a referral link using the Rewardful `?via=` parameter format.
   *
   * @param baseUrl — The product's landing page.
   * @param referralId — The affiliate's referral code (the `via` value).
   */
  async generateReferralLink(
    baseUrl: string,
    referralId: string,
  ): Promise<string> {
    // Rewardful always uses the `via` query param regardless of API mode.
    const url = new URL(baseUrl);
    url.searchParams.set('via', referralId);
    return url.toString();
  }

  // ── Conversions ─────────────────────────────────────────────────────

  /**
   * Fetch conversion events (referral sales tracked via Stripe).
   *
   * @param since — ISO 8601 cutoff; only events after this date returned.
   */
  async getConversions(since?: string): Promise<ConversionEvent[]> {
    if (!this.apiKey) {
      if (!since) return MOCK_CONVERSIONS;
      const sinceMs = new Date(since).getTime();
      return MOCK_CONVERSIONS.filter(
        (c) => new Date(c.timestamp).getTime() >= sinceMs,
      );
    }

    // TODO: Real implementation
    //
    // const qs = since ? `?since=${since}` : '';
    // const res = await fetch(`${this.baseUrl}/referrals${qs}`, {
    //   headers: { 'Authorization': `Bearer ${this.apiKey}` },
    // });
    // ...

    return MOCK_CONVERSIONS;
  }
}
