# Affiliate Program Signup Guide

Quick reference for signing up to each affiliate program used by AAN.

## Priority Order (highest payout first)

### 1. Semrush — $200/sale + $10/trial
- **Apply:** https://www.semrush.com/lp/affiliate-program/en/
- **Network:** Impact.com
- **Cookie:** 120 days
- **Approval:** Up to 4 business days
- **Requirements:** Website with 1,000+ traffic, content about SEO/digital marketing

### 2. Kit (ConvertKit) — 50% recurring x 12 months
- **Apply:** https://dash.partnerstack.com/application?company=kit
- **Network:** PartnerStack
- **Cookie:** 60 days
- **Approval:** Few business days
- **Requirements:** Platform with audience, no need to be customer

### 3. Vercel v0 — $5/lead + 30% subs x 6 months
- **Apply:** https://partners.dub.co/v0
- **Network:** Dub Partners
- **Cookie:** 90 days
- **Approval:** Few days
- **Requirements:** Open application

### 4. DigitalOcean — 10% recurring x 12 months
- **Apply:** https://signup.cj.com/member/signup/publisher/?cid=6776953
- **Network:** CJ Affiliate
- **Cookie:** 30 days
- **Approval:** 1-5 business days
- **Requirements:** Website URL, traffic info, tax details

### 5. Mailchimp & Co — 25% new customer
- **Apply:** https://mailchimp.com/andco/
- **Network:** Direct
- **Note:** Requires managing 2+ client accounts on paid plans. Not a simple affiliate program — designed for agencies.

## Affiliate Networks (sign up for broad access)

### PartnerStack (300+ SaaS programs)
- **Marketplace:** https://market.partnerstack.com/
- **AI programs:** https://market.partnerstack.com/artificial-intelligence
- **Signup:** https://partnerstack.com/our-partner-program/partners-affiliate

### Impact.com (4,000+ brands)
- **Apply:** https://impact.com/get-started/
- **Sign up as Partner, not Advertiser**

### Rewardful (2,800+ SaaS companies)
- **Apply:** https://www.rewardful.com/affiliate-program
- **Commission:** 25% recurring x 12 months for promoting Rewardful itself

## AI-Friendly Programs (new in 2026)

| Program | Commission | URL |
|---------|-----------|-----|
| Dynamiq | 50% recurring x 12mo | https://www.getdynamiq.ai/affiliate-program |
| CustomGPT.ai | Up to 20% recurring x 2yr | https://customgpt.ai |
| Synthflow | Voice AI, active program | https://synthflow.ai |
| ChatSimple | 25% lifetime | https://chatsimple.ai |

## After Signup

1. Get your affiliate/referral links from each program
2. Edit `~/.aan/products.json`:
   ```json
   {
     "link_overrides": {
       "DigitalOcean": "https://m.do.co/c/YOUR_CODE",
       "Semrush": "https://www.semrush.com/?ref=YOUR_ID"
     }
   }
   ```
3. Run `aan seed` to apply the changes
