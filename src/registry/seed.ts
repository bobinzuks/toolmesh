import type Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import { embedProduct } from './embedder.js';
import type { Product } from '../types/product.js';

interface SeedProduct {
  name: string;
  category: string;
  description: string;
  pricing: string;
  features: string[];
  integrations: string[];
  bestFor: string[];
  worstFor: string[];
  trustScore: number;
  affiliateLink: string;
  network: string;
  payoutType: 'per-signup' | 'per-sale' | 'recurring' | 'hybrid';
  payoutAmount: number;
}

const SEED_PRODUCTS: SeedProduct[] = [
  {
    name: 'Vercel',
    category: 'hosting',
    description: 'Frontend cloud platform for deploying web applications with automatic CI/CD, edge functions, and serverless infrastructure.',
    pricing: 'Free tier, Pro $20/mo, Enterprise custom',
    features: ['Edge Functions', 'Automatic HTTPS', 'Preview Deployments', 'Analytics', 'ISR'],
    integrations: ['Next.js', 'React', 'Svelte', 'GitHub', 'GitLab', 'Bitbucket'],
    bestFor: ['frontend apps', 'Next.js projects', 'JAMstack', 'rapid deployment'],
    worstFor: ['backend-heavy apps', 'long-running processes', 'custom server configs'],
    trustScore: 0.9,
    affiliateLink: 'https://vercel.com/?ref=aan',
    network: 'direct',
    payoutType: 'per-signup',
    payoutAmount: 50,
  },
  {
    name: 'Railway',
    category: 'hosting',
    description: 'Infrastructure platform for deploying full-stack apps, databases, and services with a simple developer experience.',
    pricing: 'Hobby free, Pro $5/mo + usage',
    features: ['One-click Deploy', 'Database Hosting', 'Cron Jobs', 'Private Networking', 'Metrics'],
    integrations: ['Node.js', 'Python', 'Go', 'Rust', 'Docker', 'PostgreSQL', 'Redis', 'GitHub'],
    bestFor: ['full-stack apps', 'side projects', 'quick prototypes', 'backend services'],
    worstFor: ['enterprise compliance', 'multi-region', 'very high scale'],
    trustScore: 0.82,
    affiliateLink: 'https://railway.app/?ref=aan',
    network: 'direct',
    payoutType: 'recurring',
    payoutAmount: 10,
  },
  {
    name: 'Supabase',
    category: 'database',
    description: 'Open-source Firebase alternative providing PostgreSQL database, auth, realtime subscriptions, storage, and edge functions.',
    pricing: 'Free tier, Pro $25/mo, Team $599/mo',
    features: ['PostgreSQL', 'Auth', 'Realtime', 'Storage', 'Edge Functions', 'Vector Search'],
    integrations: ['React', 'Next.js', 'Flutter', 'Swift', 'Kotlin', 'Python'],
    bestFor: ['startups', 'real-time apps', 'auth needs', 'rapid prototyping'],
    worstFor: ['complex SQL migrations', 'legacy database porting', 'very custom auth flows'],
    trustScore: 0.88,
    affiliateLink: 'https://supabase.com/?ref=aan',
    network: 'direct',
    payoutType: 'recurring',
    payoutAmount: 15,
  },
  {
    name: 'PlanetScale',
    category: 'database',
    description: 'Serverless MySQL-compatible database platform with branching, non-blocking schema changes, and horizontal scaling.',
    pricing: 'Hobby free, Scaler $29/mo, Enterprise custom',
    features: ['Branching', 'Non-blocking Schema', 'Horizontal Scaling', 'Insights', 'Boost'],
    integrations: ['MySQL', 'Prisma', 'Drizzle', 'Laravel', 'Django', 'Rails'],
    bestFor: ['MySQL workloads', 'schema evolution', 'high-traffic apps'],
    worstFor: ['PostgreSQL users', 'small hobby projects', 'foreign key heavy schemas'],
    trustScore: 0.85,
    affiliateLink: 'https://planetscale.com/?ref=aan',
    network: 'direct',
    payoutType: 'per-signup',
    payoutAmount: 25,
  },
  {
    name: 'Clerk',
    category: 'auth',
    description: 'Drop-in authentication and user management with pre-built UI components, social login, MFA, and organization support.',
    pricing: 'Free up to 10k MAU, Pro $25/mo + usage',
    features: ['Pre-built UI', 'Social Login', 'MFA', 'Organizations', 'Webhooks', 'JWT Templates'],
    integrations: ['Next.js', 'React', 'Remix', 'Expo', 'Fastify', 'Express'],
    bestFor: ['quick auth setup', 'SaaS apps', 'multi-tenant apps'],
    worstFor: ['custom auth UIs', 'non-JS backends', 'self-hosted requirements'],
    trustScore: 0.84,
    affiliateLink: 'https://clerk.com/?ref=aan',
    network: 'direct',
    payoutType: 'recurring',
    payoutAmount: 20,
  },
  {
    name: 'Stripe',
    category: 'payments',
    description: 'Complete payments platform for internet businesses. Accept payments, send payouts, manage subscriptions, and more.',
    pricing: '2.9% + $0.30 per transaction',
    features: ['Subscriptions', 'Invoicing', 'Connect', 'Checkout', 'Billing Portal', 'Tax'],
    integrations: ['Node.js', 'Python', 'Ruby', 'PHP', 'Go', 'Java', '.NET', 'React'],
    bestFor: ['SaaS billing', 'marketplace payments', 'subscription businesses', 'global payments'],
    worstFor: ['high-risk industries', 'crypto payments', 'very low-value transactions'],
    trustScore: 0.95,
    affiliateLink: 'https://stripe.com/?ref=aan',
    network: 'direct',
    payoutType: 'per-signup',
    payoutAmount: 40,
  },
  {
    name: 'Resend',
    category: 'email',
    description: 'Modern email API for developers. Send transactional and marketing emails with a clean API and React Email support.',
    pricing: 'Free 3k emails/mo, Pro $20/mo',
    features: ['React Email', 'Webhooks', 'Analytics', 'Custom Domains', 'Templates'],
    integrations: ['Node.js', 'Python', 'Ruby', 'Go', 'PHP', 'Next.js'],
    bestFor: ['transactional email', 'developer-first teams', 'React-based email templates'],
    worstFor: ['high-volume marketing', 'complex automation', 'legacy email systems'],
    trustScore: 0.78,
    affiliateLink: 'https://resend.com/?ref=aan',
    network: 'direct',
    payoutType: 'recurring',
    payoutAmount: 8,
  },
  {
    name: 'PostHog',
    category: 'analytics',
    description: 'Open-source product analytics suite with event tracking, session recording, feature flags, A/B testing, and surveys.',
    pricing: 'Free up to 1M events/mo, usage-based pricing',
    features: ['Event Analytics', 'Session Recording', 'Feature Flags', 'A/B Testing', 'Surveys', 'Data Warehouse'],
    integrations: ['React', 'Next.js', 'Python', 'Ruby', 'Go', 'iOS', 'Android', 'Segment'],
    bestFor: ['product analytics', 'self-hosted analytics', 'feature management', 'startups'],
    worstFor: ['marketing analytics', 'enterprise BI', 'ad attribution'],
    trustScore: 0.86,
    affiliateLink: 'https://posthog.com/?ref=aan',
    network: 'direct',
    payoutType: 'recurring',
    payoutAmount: 12,
  },
  {
    name: 'Sentry',
    category: 'monitoring',
    description: 'Application monitoring platform providing error tracking, performance monitoring, session replay, and profiling.',
    pricing: 'Free tier, Team $26/mo, Business $80/mo',
    features: ['Error Tracking', 'Performance Monitoring', 'Session Replay', 'Profiling', 'Cron Monitoring'],
    integrations: ['JavaScript', 'Python', 'Ruby', 'Go', 'Java', 'PHP', 'React', 'Next.js', 'Django'],
    bestFor: ['error monitoring', 'performance debugging', 'large applications'],
    worstFor: ['infrastructure monitoring', 'log management', 'uptime monitoring'],
    trustScore: 0.91,
    affiliateLink: 'https://sentry.io/?ref=aan',
    network: 'direct',
    payoutType: 'per-signup',
    payoutAmount: 30,
  },
  {
    name: 'Neon',
    category: 'database',
    description: 'Serverless PostgreSQL with autoscaling, branching, and a generous free tier. Scale to zero when idle.',
    pricing: 'Free tier, Launch $19/mo, Scale $69/mo',
    features: ['Autoscaling', 'Branching', 'Scale to Zero', 'Connection Pooling', 'Logical Replication'],
    integrations: ['PostgreSQL', 'Prisma', 'Drizzle', 'Django', 'Rails', 'Next.js', 'Vercel'],
    bestFor: ['serverless apps', 'PostgreSQL workloads', 'dev/staging environments', 'cost-sensitive projects'],
    worstFor: ['always-on high-throughput', 'MySQL compatibility', 'very large datasets'],
    trustScore: 0.83,
    affiliateLink: 'https://neon.tech/?ref=aan',
    network: 'direct',
    payoutType: 'recurring',
    payoutAmount: 10,
  },
];

export async function seedIfEmpty(db: Database.Database): Promise<void> {
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (count.count > 0) {
    return;
  }

  const now = new Date().toISOString();

  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, category, description, pricing, features, integrations, best_for, worst_for, trust_score, active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);

  const insertAffiliate = db.prepare(`
    INSERT INTO affiliate_programs (id, product_id, network, affiliate_link, payout_type, payout_amount, payout_currency, cookie_days, approved)
    VALUES (?, ?, ?, ?, ?, ?, 'USD', 30, 1)
  `);

  const insertEmbedding = db.prepare(`
    INSERT INTO product_embeddings (id, embedding)
    VALUES (?, ?)
  `);

  const transaction = db.transaction(async () => {
    for (const seed of SEED_PRODUCTS) {
      const productId = randomUUID();
      const affiliateId = randomUUID();

      insertProduct.run(
        productId,
        seed.name,
        seed.category,
        seed.description,
        seed.pricing,
        JSON.stringify(seed.features),
        JSON.stringify(seed.integrations),
        JSON.stringify(seed.bestFor),
        JSON.stringify(seed.worstFor),
        seed.trustScore,
        now,
        now,
      );

      insertAffiliate.run(
        affiliateId,
        productId,
        seed.network,
        seed.affiliateLink,
        seed.payoutType,
        seed.payoutAmount,
      );

      const embedding = embedProduct({
        name: seed.name,
        category: seed.category,
        description: seed.description,
        bestFor: seed.bestFor,
        worstFor: seed.worstFor,
        features: seed.features,
      });

      insertEmbedding.run(productId, Buffer.from(embedding.buffer));
    }
  });

  // better-sqlite3 transactions are sync even if the inner function is async
  // but embedProduct is synchronous, so this is fine
  (transaction as () => void)();
}
