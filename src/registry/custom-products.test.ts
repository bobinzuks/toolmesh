import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateAffiliateUrl } from './custom-products.js';

// ---------------------------------------------------------------------------
// validateAffiliateUrl — domain allowlist validation
// ---------------------------------------------------------------------------

describe('validateAffiliateUrl', () => {
  describe('accepts known affiliate network domains', () => {
    const affiliateDomains = [
      'https://m.do.co/c/abc123',
      'https://partnerstack.com/signup?ref=xyz',
      'https://rewardful.com/invite/test',
      'https://impact.com/partner/campaign',
      'https://partners.dub.co/ref/abc',
    ];

    for (const url of affiliateDomains) {
      it(`accepts ${new URL(url).hostname}`, () => {
        assert.strictEqual(validateAffiliateUrl(url), true, `Should accept ${url}`);
      });
    }
  });

  describe('accepts known product domains', () => {
    const productDomains = [
      'https://supabase.com/dashboard?ref=partner',
      'https://stripe.com/partners/abc',
      'https://vercel.com/?ref=toolmesh',
      'https://neon.tech/ref/abc',
      'https://railway.app/ref/test',
      'https://fly.io/ref/abc',
      'https://sentry.io/signup/?ref=partner',
      'https://posthog.com/ref/abc',
      'https://resend.com/ref/test',
    ];

    for (const url of productDomains) {
      it(`accepts ${new URL(url).hostname}`, () => {
        assert.strictEqual(validateAffiliateUrl(url), true, `Should accept ${url}`);
      });
    }
  });

  it('accepts toolmesh.dev', () => {
    assert.strictEqual(
      validateAffiliateUrl('https://toolmesh.dev/ref/abc'),
      true,
    );
  });

  describe('handles subdomains correctly', () => {
    it('accepts app.convertkit.com (subdomain of convertkit.com)', () => {
      assert.strictEqual(
        validateAffiliateUrl('https://app.convertkit.com/referrals/abc'),
        true,
      );
    });

    it('accepts firebase.google.com', () => {
      assert.strictEqual(
        validateAffiliateUrl('https://firebase.google.com/pricing'),
        true,
      );
    });

    it('accepts aws.amazon.com', () => {
      assert.strictEqual(
        validateAffiliateUrl('https://aws.amazon.com/free'),
        true,
      );
    });

    it('accepts cloud.google.com', () => {
      assert.strictEqual(
        validateAffiliateUrl('https://cloud.google.com/run'),
        true,
      );
    });

    it('accepts dashboard.stripe.com as subdomain of stripe.com', () => {
      assert.strictEqual(
        validateAffiliateUrl('https://dashboard.stripe.com/test'),
        true,
      );
    });
  });

  describe('rejects unknown domains', () => {
    const badDomains = [
      'https://malicious-site.com/steal?ref=abc',
      'https://not-a-real-partner.org/ref',
      'https://phishing-stripe.com/login',
      'https://example.com/ref/abc',
    ];

    for (const url of badDomains) {
      it(`rejects ${new URL(url).hostname}`, () => {
        assert.strictEqual(validateAffiliateUrl(url), false, `Should reject ${url}`);
      });
    }
  });

  describe('rejects non-URL strings', () => {
    it('rejects plain text', () => {
      assert.strictEqual(validateAffiliateUrl('not a url'), false);
    });

    it('rejects empty string', () => {
      assert.strictEqual(validateAffiliateUrl(''), false);
    });

    it('rejects javascript: protocol', () => {
      assert.strictEqual(
        validateAffiliateUrl('javascript:alert(1)'),
        false,
      );
    });

    it('rejects data: URIs', () => {
      assert.strictEqual(
        validateAffiliateUrl('data:text/html,<h1>Hi</h1>'),
        false,
      );
    });

    it('rejects ftp: protocol', () => {
      assert.strictEqual(
        validateAffiliateUrl('ftp://stripe.com/file'),
        false,
      );
    });
  });
});
