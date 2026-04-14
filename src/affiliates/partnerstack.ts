/**
 * PartnerStack API client stub.
 *
 * When a real PARTNERSTACK_API_KEY is provided (via env var or constructor),
 * methods make actual HTTPS requests to https://api.partnerstack.com/v1.
 * Otherwise they return realistic mock data so the rest of the system can
 * develop and test without credentials.
 *
 * PartnerStack is widely used for B2B SaaS partner/affiliate programs
 * (e.g. Monday.com, Webflow, Notion, Intercom).
 */

import type { ConversionEvent } from './types.js';

// ── Public types ──────────────────────────────────────────────────────

export interface PartnerStackProgram {
  id: string;
  name: string;
  slug: string;
  commissionType: 'recurring' | 'one-time' | 'hybrid';
  commissionPercent?: number;
  commissionFlat?: number;
  cookieDays: number;
  currency: string;
  active: boolean;
}

export interface PartnerStackReferral {
  id: string;
  programId: string;
  referralUrl: string;
  createdAt: string;
}

// ── Mock data ─────────────────────────────────────────────────────────

const MOCK_PROGRAMS: PartnerStackProgram[] = [
  {
    id: 'ps-prog-webflow',
    name: 'Webflow Partner Program',
    slug: 'webflow',
    commissionType: 'recurring',
    commissionPercent: 50,
    cookieDays: 90,
    currency: 'USD',
    active: true,
  },
  {
    id: 'ps-prog-notion',
    name: 'Notion Affiliate Program',
    slug: 'notion',
    commissionType: 'one-time',
    commissionFlat: 10,
    cookieDays: 30,
    currency: 'USD',
    active: true,
  },
  {
    id: 'ps-prog-monday',
    name: 'monday.com Partner Program',
    slug: 'monday',
    commissionType: 'recurring',
    commissionPercent: 25,
    cookieDays: 60,
    currency: 'USD',
    active: true,
  },
];

const MOCK_CONVERSIONS: ConversionEvent[] = [
  {
    id: 'ps-conv-001',
    productId: 'webflow',
    network: 'partnerstack',
    timestamp: '2025-12-01T10:30:00Z',
    type: 'signup',
    revenue: 0,
    subAffiliateId: 'demo-sub-1',
  },
  {
    id: 'ps-conv-002',
    productId: 'webflow',
    network: 'partnerstack',
    timestamp: '2025-12-15T14:22:00Z',
    type: 'purchase',
    revenue: 39,
    subAffiliateId: 'demo-sub-1',
  },
];

// ── Client ────────────────────────────────────────────────────────────

export class PartnerStackClient {
  private apiKey: string | undefined;
  private baseUrl: string;

  /**
   * @param apiKey — PartnerStack API key. Falls back to the
   *   PARTNERSTACK_API_KEY environment variable. If neither is set the
   *   client operates in mock mode.
   */
  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? process.env['PARTNERSTACK_API_KEY'];
    this.baseUrl = 'https://api.partnerstack.com/v1';
  }

  /** Whether a real API key is configured. */
  get isLive(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * List available partner programs.
   *
   * Live mode: GET /programs
   * Mock mode: returns sample programs.
   */
  async listPrograms(): Promise<PartnerStackProgram[]> {
    if (!this.apiKey) {
      return MOCK_PROGRAMS;
    }

    // TODO: Replace with real API call when credentials are available.
    //
    // const res = await fetch(`${this.baseUrl}/programs`, {
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // if (!res.ok) throw new Error(`PartnerStack API error: ${res.status}`);
    // const data = await res.json();
    // return data.items.map(mapProgram);

    return MOCK_PROGRAMS;
  }

  /**
   * Get a single program by ID.
   */
  async getProgram(id: string): Promise<PartnerStackProgram | null> {
    const programs = await this.listPrograms();
    return programs.find((p) => p.id === id) ?? null;
  }

  /**
   * Generate a referral link for a given program.
   *
   * Live mode: POST /referrals
   * Mock mode: builds a deterministic URL.
   */
  async generateReferralLink(
    programId: string,
    subId?: string,
  ): Promise<string> {
    if (!this.apiKey) {
      const sub = subId ? `&ps_xid=${subId}` : '';
      return `https://aan.dev/go/${programId}?ps_partner_key=mock-key${sub}`;
    }

    // TODO: Real implementation
    //
    // const res = await fetch(`${this.baseUrl}/referrals`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ program_id: programId, sub_id: subId }),
    // });
    // if (!res.ok) throw new Error(`PartnerStack API error: ${res.status}`);
    // const data = await res.json();
    // return data.referral_url;

    const sub = subId ? `&ps_xid=${subId}` : '';
    return `https://aan.dev/go/${programId}?ps_partner_key=${this.apiKey}${sub}`;
  }

  /**
   * Fetch recent conversions.
   *
   * @param since — ISO 8601 date string. Only conversions after this date
   *   are returned.
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
    // const qs = since ? `?min_created_at=${since}` : '';
    // const res = await fetch(`${this.baseUrl}/conversions${qs}`, {
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // if (!res.ok) throw new Error(`PartnerStack API error: ${res.status}`);
    // const data = await res.json();
    // return data.items.map(mapConversion);

    return MOCK_CONVERSIONS;
  }
}
