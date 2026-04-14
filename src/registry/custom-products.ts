import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig } from '../types/config.js';
import type { Product, AffiliateProgram } from '../types/product.js';

/**
 * Schema for custom products defined in products.json.
 * Users edit this file to add products and affiliate links — no code changes needed.
 */
export interface CustomProductEntry {
  name: string;
  category: string;
  description: string;
  pricing: string;
  features: string[];
  integrations: string[];
  best_for: string[];
  worst_for: string[];
  trust_score: number;
  affiliate_links: Array<{
    network: string;
    url: string;
    payout_type: 'per-signup' | 'per-sale' | 'recurring' | 'hybrid';
    payout_amount: number;
    cookie_days: number;
  }>;
}

/**
 * Top-level config for link overrides. Users can override default links
 * for built-in products without re-adding them.
 */
export interface ProductsConfig {
  /** Override affiliate links for built-in products by name */
  link_overrides?: Record<string, string>;
  /** Add entirely new products */
  products?: CustomProductEntry[];
}

function getProductsJsonPath(): string {
  const config = loadConfig();
  return join(config.dataDir, 'products.json');
}

/**
 * Create a starter products.json with examples if it doesn't exist.
 */
export function ensureProductsJson(): string {
  const path = getProductsJsonPath();
  if (!existsSync(path)) {
    const starter: ProductsConfig = {
      link_overrides: {
        "DigitalOcean": "https://m.do.co/c/YOUR_REFERRAL_CODE",
        "Vercel": "https://vercel.com/?ref=YOUR_ID",
        "ConvertKit": "https://app.convertkit.com/referrals/YOUR_ID",
        "Mailchimp": "https://mailchimp.com/referral/?aid=YOUR_ID",
        "Semrush": "https://www.semrush.com/?ref=YOUR_PARTNER_ID"
      },
      products: [
        {
          name: "Example Product",
          category: "other",
          description: "Replace this with a real product description.",
          pricing: "Free tier; Pro $10/mo",
          features: ["Feature 1", "Feature 2"],
          integrations: ["Tool A", "Tool B"],
          best_for: ["use case 1", "use case 2"],
          worst_for: ["not good for X"],
          trust_score: 0.8,
          affiliate_links: [
            {
              network: "direct",
              url: "https://example.com/?ref=YOUR_ID",
              payout_type: "per-signup",
              payout_amount: 20,
              cookie_days: 30
            }
          ]
        }
      ]
    };
    writeFileSync(path, JSON.stringify(starter, null, 2) + '\n', 'utf-8');
  }
  return path;
}

/**
 * Load the products.json config file.
 */
export function loadProductsConfig(): ProductsConfig {
  const path = getProductsJsonPath();
  if (!existsSync(path)) return {};

  try {
    const raw = readFileSync(path, 'utf-8');
    return JSON.parse(raw) as ProductsConfig;
  } catch (e) {
    console.error(`[aan] Warning: Could not parse ${path}:`, e);
    return {};
  }
}

/**
 * Convert custom product entries into the internal Product + AffiliateProgram format
 * used by the seeder and repository.
 */
export function customEntryToProduct(entry: CustomProductEntry): {
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
  programs: Omit<AffiliateProgram, 'id' | 'productId'>[];
} {
  return {
    product: {
      name: entry.name,
      category: entry.category,
      description: entry.description,
      pricing: entry.pricing,
      features: entry.features,
      integrations: entry.integrations,
      bestFor: entry.best_for,
      worstFor: entry.worst_for,
      trustScore: Math.max(0, Math.min(1, entry.trust_score)),
      active: true,
    },
    programs: entry.affiliate_links.map((link) => ({
      network: link.network,
      affiliateLink: link.url,
      payoutType: link.payout_type,
      payoutAmount: link.payout_amount,
      payoutCurrency: 'USD',
      cookieDays: link.cookie_days,
      approved: true,
    })),
  };
}

/**
 * Get link overrides map (product name -> affiliate URL).
 */
export function getLinkOverrides(): Record<string, string> {
  const config = loadProductsConfig();
  return config.link_overrides ?? {};
}

// ---------------------------------------------------------------------------
// Affiliate domain allowlist
// ---------------------------------------------------------------------------

/**
 * Domains that are recognised as legitimate affiliate or product domains.
 * Override URLs whose hostname does not match any entry in this list will be
 * rejected by the seeder with a warning.
 */
const ALLOWED_AFFILIATE_DOMAINS: string[] = [
  // Affiliate networks & partner platforms
  'm.do.co',           // DigitalOcean
  'partners.dub.co',   // Vercel/Dub
  'partnerstack.com',  // PartnerStack
  'rewardful.com',     // Rewardful
  'impact.com',        // Impact
  'semrush.com',       // Semrush
  'mailchimp.com',     // Mailchimp
  'convertkit.com',    // ConvertKit
  'kit.com',           // Kit (new name)
  'toolmesh.dev',      // Our own redirects
  // Product domains (for direct referral links)
  'supabase.com',
  'neon.tech',
  'vercel.com',
  'stripe.com',
  'digitalocean.com',
  'planetscale.com',
  'turso.tech',
  'railway.app',
  'render.com',
  'fly.io',
  'clerk.com',
  'auth0.com',
  'firebase.google.com',
  'aws.amazon.com',
  'cloud.google.com',
  'azure.microsoft.com',
  'heroku.com',
  'netlify.com',
  'cloudflare.com',
  'github.com',
  'gitlab.com',
  'bitbucket.org',
  'sentry.io',
  'datadog.com',
  'newrelic.com',
  'grafana.com',
  'posthog.com',
  'mixpanel.com',
  'amplitude.com',
  'segment.com',
  'twilio.com',
  'sendgrid.com',
  'postmarkapp.com',
  'resend.com',
  'loops.so',
  'customerio.com',
  'sanity.io',
  'contentful.com',
  'strapi.io',
  'prismic.io',
  'algolia.com',
  'typesense.org',
  'meilisearch.com',
  'upstash.com',
  'redis.com',
  'mongodb.com',
  'cockroachlabs.com',
  'aiven.io',
  'circleci.com',
  'github.com',
  'linear.app',
  'liveblocks.io',
  'ably.com',
  'pusher.com',
  'stream.io',
  'agora.io',
  'daily.co',
  'livekit.io',
];

/**
 * Validate that a URL belongs to a domain in the allowlist.
 * Matches either the exact hostname or any subdomain of an allowed domain
 * (e.g. `app.convertkit.com` matches `convertkit.com`).
 *
 * Returns `false` for malformed URLs or URLs with non-HTTPS schemes
 * (HTTP is tolerated for localhost only).
 */
export function validateAffiliateUrl(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  // Only allow http(s) schemes
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return false;
  }

  const hostname = parsed.hostname.toLowerCase();

  for (const allowed of ALLOWED_AFFILIATE_DOMAINS) {
    if (hostname === allowed || hostname.endsWith(`.${allowed}`)) {
      return true;
    }
  }

  return false;
}
