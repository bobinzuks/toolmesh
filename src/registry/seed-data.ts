import type { Product, AffiliateProgram } from '../types/product.js';

type SeedProduct = {
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
  programs: Omit<AffiliateProgram, 'id' | 'productId'>[];
};

export const SEED_PRODUCTS: SeedProduct[] = [
  // ─── DATABASE ──────────────────────────────────────────────────────────
  {
    product: {
      name: 'Supabase',
      category: 'database',
      description:
        'Open-source Firebase alternative with Postgres database, auth, realtime subscriptions, edge functions, and storage. Generous free tier with 500 MB database and 1 GB file storage.',
      pricing: 'Free tier; Pro $25/mo; Team $599/mo; Enterprise custom',
      features: ['Postgres database', 'Row-level security', 'Realtime subscriptions', 'Edge functions', 'Auth', 'Storage', 'Vector embeddings via pgvector'],
      integrations: ['Next.js', 'React', 'Flutter', 'Swift', 'Kotlin', 'Python', 'Deno', 'Vercel', 'Netlify'],
      bestFor: ['full-stack apps', 'rapid prototyping', 'indie hackers', 'realtime features', 'startups needing auth + db in one'],
      worstFor: ['complex relational queries needing DBA tuning', 'teams that want a managed MySQL', 'large blob storage workloads'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://supabase.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'PlanetScale',
      category: 'database',
      description:
        'Serverless MySQL platform built on Vitess. Offers branching workflows for schema changes, connection pooling, and horizontal sharding. Now requires paid plan after removing free tier.',
      pricing: 'Scaler $39/mo; Scaler Pro $99/mo; Enterprise custom',
      features: ['MySQL-compatible', 'Database branching', 'Non-blocking schema changes', 'Connection pooling', 'Read replicas', 'Insights dashboard'],
      integrations: ['Prisma', 'Laravel', 'Rails', 'Django', 'Next.js', 'Drizzle', 'Vercel', 'Netlify'],
      bestFor: ['MySQL workloads', 'teams wanting git-like DB workflows', 'high-traffic applications', 'schema migration safety'],
      worstFor: ['hobby projects on a budget', 'teams preferring Postgres', 'simple SQLite use cases'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://planetscale.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Neon',
      category: 'database',
      description:
        'Serverless Postgres with storage-compute separation, autoscaling, and branching. Free tier includes 0.5 GiB storage and 190 compute hours. Scale to zero when idle.',
      pricing: 'Free tier; Launch $19/mo; Scale $69/mo; Enterprise custom',
      features: ['Serverless Postgres', 'Autoscaling', 'Database branching', 'Scale-to-zero', 'Connection pooling', 'Point-in-time recovery'],
      integrations: ['Prisma', 'Drizzle', 'Next.js', 'Vercel', 'Hasura', 'Django', 'Rails', 'Cloudflare Workers'],
      bestFor: ['serverless applications', 'development environments needing branching', 'cost-sensitive Postgres users', 'preview deployments'],
      worstFor: ['always-on high-throughput workloads', 'teams needing full Postgres extension ecosystem', 'latency-sensitive use under cold starts'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://neon.tech',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'MongoDB Atlas',
      category: 'database',
      description:
        'Fully managed multi-cloud document database service. Free shared tier with 512 MB storage. Built-in search, vector search, and data federation.',
      pricing: 'Free shared (512 MB); Serverless from $0.10/million reads; Dedicated from $57/mo',
      features: ['Document database', 'Atlas Search', 'Vector Search', 'Multi-cloud', 'Auto-scaling', 'Data federation', 'Triggers', 'Charts'],
      integrations: ['Node.js', 'Python', 'Java', 'Go', 'Rust', 'Mongoose', 'Prisma', 'Vercel', 'AWS', 'GCP', 'Azure'],
      bestFor: ['flexible schema needs', 'document-heavy applications', 'rapid iteration', 'teams familiar with MongoDB'],
      worstFor: ['highly relational data', 'complex joins and transactions', 'teams preferring SQL', 'tight budget at scale'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://mongodb.com/atlas',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Redis Cloud',
      category: 'database',
      description:
        'Managed Redis and Redis Stack service by Redis Inc. Offers in-memory caching, real-time analytics, search, and JSON support. Free tier with 30 MB.',
      pricing: 'Free 30 MB; Fixed from $7/mo; Flexible pay-as-you-go; Annual custom',
      features: ['In-memory caching', 'Redis Stack (JSON, Search, Time Series)', 'Active-Active geo-replication', 'Auto-tiering', 'Pub/Sub'],
      integrations: ['Node.js', 'Python', 'Java', 'Go', '.NET', 'Spring', 'Sidekiq', 'Bull', 'AWS', 'GCP', 'Azure'],
      bestFor: ['caching layer', 'session management', 'real-time leaderboards', 'rate limiting', 'pub/sub messaging'],
      worstFor: ['primary persistent database', 'complex queries', 'large dataset storage', 'budget-constrained hobbyists'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://redis.com/cloud',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'CockroachDB',
      category: 'database',
      description:
        'Distributed SQL database that survives outages. Postgres-compatible, globally distributed, with serializable isolation. Free tier on CockroachDB Serverless.',
      pricing: 'Free serverless (10 GiB); Standard from $0.50/vCPU-hr; Enterprise custom',
      features: ['Distributed SQL', 'Postgres-compatible', 'Multi-region', 'Serializable isolation', 'Automatic rebalancing', 'Change data capture'],
      integrations: ['Prisma', 'Sequelize', 'Django', 'Rails', 'Spring', 'Hasura', 'AWS', 'GCP', 'Azure'],
      bestFor: ['globally distributed apps', 'high availability requirements', 'multi-region deployments', 'teams wanting SQL at scale'],
      worstFor: ['simple single-region apps', 'hobby projects', 'latency-sensitive single-row lookups', 'teams wanting simplicity'],
      trustScore: 0.81,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://cockroachlabs.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ─── HOSTING ───────────────────────────────────────────────────────────
  {
    product: {
      name: 'Vercel',
      category: 'hosting',
      description:
        'Frontend cloud platform for deploying web applications. First-class Next.js support, edge functions, image optimization, and analytics. Generous hobby tier. Partner program via Dub Partners pays recurring commission on referred Pro subscriptions.',
      pricing: 'Hobby free; Pro $20/user/mo; Enterprise custom',
      features: ['Edge network', 'Serverless functions', 'Image optimization', 'Preview deployments', 'Analytics', 'Web Application Firewall', 'Cron jobs', 'v0 (AI code generation)', 'Fluid compute', 'Edge Config'],
      integrations: ['Next.js', 'React', 'Svelte', 'Nuxt', 'Astro', 'Remix', 'GitHub', 'GitLab', 'Bitbucket', 'Turborepo', 'SvelteKit'],
      bestFor: ['Next.js apps', 'frontend teams', 'preview deployments', 'static sites', 'JAMstack', 'AI-assisted development with v0'],
      worstFor: ['backend-heavy workloads', 'long-running processes', 'tight budget at team scale', 'non-Node.js runtimes'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'dub-partners',
        affiliateLink: 'https://aan.dev/go/vercel',
        payoutType: 'recurring',
        payoutAmount: 50,
        payoutCurrency: 'USD',
        cookieDays: 90,
        approved: true,
      },
    ],
  },
  {
    product: {
      name: 'Netlify',
      category: 'hosting',
      description:
        'Web development platform for deploying modern sites and apps. Offers serverless functions, edge handlers, forms, identity, and split testing out of the box.',
      pricing: 'Free starter; Pro $19/user/mo; Enterprise custom',
      features: ['Edge handlers', 'Serverless functions', 'Forms', 'Identity/auth', 'Split testing', 'Deploy previews', 'Large media'],
      integrations: ['React', 'Vue', 'Svelte', 'Astro', 'Hugo', 'Gatsby', 'Eleventy', 'GitHub', 'GitLab', 'Bitbucket'],
      bestFor: ['JAMstack sites', 'static site generators', 'form-heavy sites', 'marketing sites', 'content-driven sites'],
      worstFor: ['complex server-side rendering', 'long-running backend jobs', 'apps needing WebSocket support', 'large team cost optimization'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://netlify.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Railway',
      category: 'hosting',
      description:
        'Infrastructure platform that deploys from GitHub in seconds. Supports any language/framework with Nixpacks. Built-in Postgres, Redis, and cron jobs.',
      pricing: 'Hobby $5/mo + usage; Pro $20/user/mo + usage; Enterprise custom',
      features: ['Auto-deploy from GitHub', 'Built-in databases', 'Nixpacks builds', 'Private networking', 'Cron jobs', 'Variables management', 'Observability'],
      integrations: ['Node.js', 'Python', 'Go', 'Rust', 'Ruby', 'Docker', 'Postgres', 'Redis', 'MySQL', 'MongoDB'],
      bestFor: ['full-stack apps', 'backend services', 'hobby projects', 'quick deployment without DevOps', 'microservices'],
      worstFor: ['enterprise compliance needs', 'multi-region deployment', 'very high traffic scale', 'teams needing fine infra control'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://railway.app',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Fly.io',
      category: 'hosting',
      description:
        'Deploy app servers close to users worldwide. Run full Linux VMs (Firecracker microVMs) in 30+ regions. Great for deploying containers, databases, and long-running processes.',
      pricing: 'Free allowances; Pay-as-you-go from ~$1.94/mo per shared VM; Scale plans available',
      features: ['Global VM deployment', 'Firecracker microVMs', 'Anycast networking', 'Persistent volumes', 'Private networking', 'Fly Postgres', 'GPU machines'],
      integrations: ['Docker', 'Rails', 'Django', 'Phoenix', 'Go', 'Rust', 'Node.js', 'Postgres', 'Redis', 'LiteFS'],
      bestFor: ['globally distributed apps', 'containers at the edge', 'long-running processes', 'full Linux VM needs', 'Elixir/Phoenix apps'],
      worstFor: ['teams wanting zero ops', 'serverless-first architectures', 'simple static sites', 'beginners who want a GUI'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://fly.io',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Render',
      category: 'hosting',
      description:
        'Cloud platform for building and running apps and websites. Offers free static sites, managed Postgres, auto-deploy from Git, and built-in cron.',
      pricing: 'Free tier (static + limited services); Individual from $7/mo; Team from $19/mo; Enterprise custom',
      features: ['Auto-deploy from Git', 'Managed Postgres', 'Redis', 'Cron jobs', 'Persistent disks', 'Private networking', 'DDoS protection'],
      integrations: ['Node.js', 'Python', 'Ruby', 'Go', 'Rust', 'Docker', 'Postgres', 'Redis', 'GitHub', 'GitLab'],
      bestFor: ['Heroku alternatives', 'simple full-stack deployment', 'managed databases', 'background workers'],
      worstFor: ['edge computing needs', 'multi-region by default', 'very high traffic spikes', 'fine-grained infra control'],
      trustScore: 0.79,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://render.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'DigitalOcean',
      category: 'hosting',
      description:
        'Cloud infrastructure provider offering droplets (VMs), managed Kubernetes, databases, app platform, and object storage. Simple pricing and developer-friendly docs. Affiliate program pays up to $200 per referral via CJ Affiliate with 30-day cookie.',
      pricing: 'Droplets from $4/mo; App Platform free tier; Managed DB from $15/mo',
      features: ['Droplets (VMs)', 'Kubernetes', 'App Platform', 'Managed databases', 'Spaces (object storage)', 'Load balancers', 'VPC', 'Monitoring', 'Functions (serverless)', 'Container Registry'],
      integrations: ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'GitHub Actions', 'GitLab CI', 'Node.js', 'Python', 'Go', 'Pulumi', 'Crossplane'],
      bestFor: ['small-medium infrastructure', 'developers wanting simple cloud', 'managed Kubernetes', 'predictable pricing', 'teams migrating from Heroku'],
      worstFor: ['enterprise-grade compliance', 'massive global scale', 'serverless-first architecture', 'teams needing 100+ cloud services'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'cj-affiliate',
        affiliateLink: 'https://aan.dev/go/digitalocean',
        payoutType: 'recurring',
        payoutAmount: 200,
        payoutCurrency: 'USD',
        cookieDays: 30,
        approved: true,
      },
      {
        network: 'impact',
        affiliateLink: 'https://aan.dev/go/digitalocean-impact',
        payoutType: 'per-sale',
        payoutAmount: 100,
        payoutCurrency: 'USD',
        cookieDays: 30,
        approved: true,
      },
    ],
  },

  // ─── AUTH ──────────────────────────────────────────────────────────────
  {
    product: {
      name: 'Clerk',
      category: 'auth',
      description:
        'Drop-in authentication and user management with beautiful pre-built UI components. Supports email, social, MFA, organizations, and session management.',
      pricing: 'Free up to 10K MAU; Pro $25/mo + $0.02/MAU; Enterprise custom',
      features: ['Pre-built UI components', 'Social login', 'MFA', 'Organizations', 'Session management', 'Webhooks', 'User profiles', 'RBAC'],
      integrations: ['Next.js', 'React', 'Remix', 'Gatsby', 'Expo', 'Fastify', 'Express', 'Ruby on Rails'],
      bestFor: ['Next.js apps', 'rapid auth implementation', 'beautiful default UI', 'multi-tenant SaaS'],
      worstFor: ['self-hosted requirements', 'very high MAU budgets', 'non-JavaScript backends', 'deep customization of auth flows'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://clerk.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Auth0',
      category: 'auth',
      description:
        'Identity platform for authentication and authorization. Supports universal login, social providers, MFA, and machine-to-machine auth. Now part of Okta.',
      pricing: 'Free up to 7.5K MAU; Essential from $35/mo; Professional from $240/mo; Enterprise custom',
      features: ['Universal Login', 'Social connections', 'MFA', 'Machine-to-machine', 'Actions (extensibility)', 'Attack protection', 'Breached password detection'],
      integrations: ['React', 'Angular', 'Vue', 'Next.js', 'Express', 'Django', 'Spring', 'Rails', 'Flutter', 'iOS', 'Android'],
      bestFor: ['enterprise auth needs', 'complex auth flows', 'multi-language backends', 'compliance-heavy applications'],
      worstFor: ['simple hobby projects', 'budget-conscious startups past free tier', 'teams wanting lightweight solutions', 'Okta migration concerns'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://auth0.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'WorkOS',
      category: 'auth',
      description:
        'Enterprise-ready auth and directory sync. Provides SSO (SAML/OIDC), directory sync (SCIM), admin portal, and audit logs. Built for B2B SaaS.',
      pricing: 'Free up to 1M MAU (AuthKit); SSO $125/connection/mo; Enterprise custom',
      features: ['SSO (SAML, OIDC)', 'Directory sync (SCIM)', 'Admin portal', 'Audit logs', 'AuthKit (user management)', 'MFA', 'Fine-grained authorization'],
      integrations: ['Next.js', 'React', 'Node.js', 'Python', 'Ruby', 'Go', 'PHP', '.NET'],
      bestFor: ['B2B SaaS', 'enterprise SSO requirements', 'selling to large companies', 'SOC 2 compliance'],
      worstFor: ['B2C apps', 'simple consumer auth', 'hobby projects', 'small teams without enterprise customers'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://workos.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Supabase Auth',
      category: 'auth',
      description:
        'Auth module built into Supabase. Supports email/password, magic links, social logins, phone auth, and Row Level Security integration with Postgres.',
      pricing: 'Free (50K MAU); Pro included with Supabase Pro ($25/mo); custom pricing at scale',
      features: ['Email/password', 'Magic links', 'Social OAuth', 'Phone auth', 'Row Level Security integration', 'JWT tokens', 'Custom claims'],
      integrations: ['Supabase', 'Next.js', 'React', 'Flutter', 'Swift', 'Kotlin', 'Python'],
      bestFor: ['Supabase users', 'Postgres RLS workflows', 'simple auth needs', 'budget-conscious teams'],
      worstFor: ['non-Supabase stacks', 'enterprise SSO needs', 'complex auth flows', 'teams needing pre-built UI components'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://supabase.com/auth',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ─── EMAIL ─────────────────────────────────────────────────────────────
  {
    product: {
      name: 'Resend',
      category: 'email',
      description:
        'Modern email API for developers. Send transactional and marketing emails with React components via react-email. Clean API, great DX.',
      pricing: 'Free 100 emails/day; Pro $20/mo (50K emails); Enterprise custom',
      features: ['React Email templates', 'Transactional email', 'Webhooks', 'Custom domains', 'Email analytics', 'Suppression lists', 'Batch sending'],
      integrations: ['React', 'Next.js', 'Node.js', 'Python', 'Ruby', 'PHP', 'Go', 'Elixir', 'Vercel'],
      bestFor: ['developer-first email', 'React-based email templates', 'transactional emails', 'modern DX'],
      worstFor: ['high-volume marketing campaigns', 'complex automation workflows', 'teams needing visual email builders', 'legacy system integration'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://resend.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Postmark',
      category: 'email',
      description:
        'Transactional email service focused on delivery speed and reliability. Known for excellent inbox placement rates and fast delivery under 10 seconds.',
      pricing: 'Free 100 emails/mo; from $15/mo for 10K emails',
      features: ['Transactional email', 'Message streams', 'Inbound email processing', 'Templates', 'Webhooks', 'Bounce management', 'DKIM/SPF'],
      integrations: ['Node.js', 'Python', 'Ruby', 'PHP', '.NET', 'Java', 'Go', 'Elixir'],
      bestFor: ['transactional email reliability', 'fast delivery', 'inbox placement', 'teams that care about deliverability'],
      worstFor: ['bulk marketing email', 'visual campaign builders', 'advanced automation sequences', 'very price-sensitive senders'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://postmarkapp.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Mailchimp',
      category: 'email',
      description:
        'All-in-one marketing platform by Intuit for email campaigns, automations, landing pages, and audience management. One of the most well-known email marketing tools. Referral program offers a $30 bill credit for each paid referral (Mailchimp & Co program).',
      pricing: 'Free up to 500 contacts; Essentials from $13/mo; Standard from $20/mo; Premium from $350/mo',
      features: ['Email campaigns', 'Marketing automations', 'Landing pages', 'Audience segmentation', 'A/B testing', 'Social posting', 'Reporting', 'Customer journeys', 'Predictive demographics', 'Content optimizer'],
      integrations: ['Shopify', 'WordPress', 'WooCommerce', 'Squarespace', 'Zapier', 'Salesforce', 'Canva', 'Stripe', 'QuickBooks', 'Google Analytics'],
      bestFor: ['small business email marketing', 'newsletter beginners', 'e-commerce integration', 'all-in-one marketing', 'teams already in the Intuit ecosystem'],
      worstFor: ['developer transactional email', 'advanced automation power users', 'large lists on a budget', 'API-first workflows'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'direct',
        affiliateLink: 'https://aan.dev/go/mailchimp',
        payoutType: 'per-sale',
        payoutAmount: 30,
        payoutCurrency: 'USD',
        cookieDays: 30,
        approved: true,
      },
      {
        network: 'cj-affiliate',
        affiliateLink: 'https://aan.dev/go/mailchimp-cj',
        payoutType: 'per-sale',
        payoutAmount: 20,
        payoutCurrency: 'USD',
        cookieDays: 30,
        approved: true,
      },
    ],
  },
  {
    product: {
      name: 'ConvertKit',
      category: 'email',
      description:
        'Email marketing platform designed for creators, now rebranded as Kit. Offers visual automations, landing pages, commerce features, and subscriber tagging. Affiliate program pays 30% recurring commission for up to 24 months with a 60-day cookie window.',
      pricing: 'Free up to 10K subscribers (limited); Creator from $25/mo; Creator Pro from $50/mo',
      features: ['Visual automation builder', 'Landing pages', 'Commerce (digital products)', 'Subscriber tagging', 'A/B testing', 'RSS campaigns', 'Creator Network', 'Paid newsletters', 'Sponsor Network'],
      integrations: ['WordPress', 'Shopify', 'Teachable', 'Zapier', 'Patreon', 'Squarespace', 'Gumroad', 'Stripe', 'WooCommerce', 'Webflow'],
      bestFor: ['content creators', 'bloggers', 'newsletter operators', 'digital product sellers', 'course creators', 'podcasters'],
      worstFor: ['enterprise marketing teams', 'developer transactional email', 'advanced e-commerce automation', 'API-heavy integrations'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'rewardful',
        affiliateLink: 'https://aan.dev/go/convertkit',
        payoutType: 'recurring',
        payoutAmount: 30,
        payoutCurrency: 'USD',
        cookieDays: 60,
        approved: true,
      },
    ],
  },
  {
    product: {
      name: 'SendGrid',
      category: 'email',
      description:
        'Cloud-based email delivery service by Twilio. Handles both transactional and marketing email at scale. Trusted by large enterprises for high volume.',
      pricing: 'Free 100 emails/day; Essentials from $19.95/mo; Pro from $89.95/mo; Premier custom',
      features: ['Transactional email', 'Marketing campaigns', 'Email validation', 'Dynamic templates', 'Webhooks', 'Dedicated IPs', 'Subuser management'],
      integrations: ['Node.js', 'Python', 'Ruby', 'PHP', 'Java', 'Go', 'C#', 'Twilio', 'Zapier'],
      bestFor: ['high-volume email', 'enterprise scale', 'mixed transactional + marketing', 'teams already using Twilio'],
      worstFor: ['small senders wanting simplicity', 'modern DX expectations', 'teams frustrated by Twilio billing', 'cold email'],
      trustScore: 0.76,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://sendgrid.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ─── PAYMENTS ──────────────────────────────────────────────────────────
  {
    product: {
      name: 'Stripe',
      category: 'payments',
      description:
        'Financial infrastructure for the internet. Payments, billing, invoicing, fraud prevention, and financial reporting. The most developer-friendly payment platform.',
      pricing: '2.9% + $0.30 per transaction; Custom enterprise pricing; Various add-on products',
      features: ['Payment processing', 'Subscriptions/billing', 'Invoicing', 'Radar (fraud)', 'Connect (marketplaces)', 'Terminal (in-person)', 'Tax', 'Identity'],
      integrations: ['React', 'Next.js', 'Node.js', 'Python', 'Ruby', 'PHP', 'Go', 'Java', '.NET', 'iOS', 'Android'],
      bestFor: ['SaaS billing', 'marketplace payments', 'developer experience', 'complex payment flows', 'global payments'],
      worstFor: ['high-risk businesses', 'regions with limited Stripe support', 'teams wanting lowest processing fees', 'simple one-time payments only'],
      trustScore: 0.95,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://stripe.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Paddle',
      category: 'payments',
      description:
        'Merchant of record for SaaS companies. Handles payments, tax, compliance, and billing globally. You sell through Paddle, they handle VAT/sales tax.',
      pricing: '5% + $0.50 per transaction (includes all taxes and compliance)',
      features: ['Merchant of record', 'Global tax compliance', 'Subscription billing', 'Checkout', 'Revenue recovery', 'Dunning', 'Price localization'],
      integrations: ['React', 'Next.js', 'Node.js', 'Python', 'PHP', 'Ruby', 'Webhooks', 'Zapier'],
      bestFor: ['SaaS companies wanting tax handled', 'global sales without entity setup', 'subscription businesses', 'solo founders'],
      worstFor: ['marketplace/platform payments', 'physical goods', 'low-margin products', 'teams wanting lowest transaction fees'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://paddle.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'LemonSqueezy',
      category: 'payments',
      description:
        'All-in-one platform for selling digital products and SaaS. Merchant of record handling payments, tax, and compliance. Built for indie developers and creators.',
      pricing: '5% + $0.50 per transaction (includes tax handling)',
      features: ['Merchant of record', 'Digital product sales', 'Subscription billing', 'License keys', 'Tax compliance', 'Checkout overlays', 'Affiliate management'],
      integrations: ['React', 'Next.js', 'Node.js', 'WordPress', 'Webhooks', 'Zapier'],
      bestFor: ['indie hackers', 'digital product sales', 'SaaS with license keys', 'creators wanting simple setup'],
      worstFor: ['complex marketplace payments', 'enterprise billing needs', 'physical goods', 'high-volume transaction optimization'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://lemonsqueezy.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ─── ANALYTICS ─────────────────────────────────────────────────────────
  {
    product: {
      name: 'PostHog',
      category: 'analytics',
      description:
        'Open-source product analytics suite. Includes event analytics, session recording, feature flags, A/B testing, and surveys. Self-host or cloud.',
      pricing: 'Free up to 1M events/mo; Pay-as-you-go after; Self-hosted free forever',
      features: ['Product analytics', 'Session recording', 'Feature flags', 'A/B testing', 'Surveys', 'Data warehouse', 'Heatmaps', 'SQL access'],
      integrations: ['React', 'Next.js', 'Node.js', 'Python', 'Ruby', 'Go', 'iOS', 'Android', 'Flutter', 'Segment', 'Sentry'],
      bestFor: ['product-led growth teams', 'self-host enthusiasts', 'all-in-one product analytics', 'startups wanting generous free tier'],
      worstFor: ['enterprise marketing analytics', 'simple page view tracking only', 'teams wanting managed-only solutions', 'very large event volumes on budget'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://posthog.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Mixpanel',
      category: 'analytics',
      description:
        'Product analytics for tracking user behavior. Funnels, retention, flows, and cohort analysis. Strong event-based analytics with powerful query builder.',
      pricing: 'Free up to 20M events/mo; Growth from $28/mo; Enterprise custom',
      features: ['Event analytics', 'Funnels', 'Retention analysis', 'User flows', 'Cohort analysis', 'Custom dashboards', 'Alerts', 'Data governance'],
      integrations: ['JavaScript', 'React', 'iOS', 'Android', 'Python', 'Ruby', 'Node.js', 'Segment', 'mParticle', 'CDP'],
      bestFor: ['product analytics', 'conversion funnel analysis', 'retention tracking', 'data-driven product teams'],
      worstFor: ['simple website analytics', 'marketing attribution', 'teams wanting session recordings', 'budget-sensitive above free tier'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://mixpanel.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Amplitude',
      category: 'analytics',
      description:
        'Digital analytics platform for understanding user behavior. Offers behavioral analytics, experimentation, and CDP capabilities for product and growth teams.',
      pricing: 'Free Starter plan; Plus from $49/mo; Growth custom; Enterprise custom',
      features: ['Behavioral analytics', 'Experimentation', 'Customer data platform', 'Audiences', 'Session replay', 'Dashboards', 'Taxonomy', 'Governance'],
      integrations: ['JavaScript', 'React', 'iOS', 'Android', 'Python', 'Java', 'Node.js', 'Segment', 'Braze', 'Snowflake'],
      bestFor: ['enterprise product analytics', 'experimentation programs', 'product-led growth', 'teams with dedicated analysts'],
      worstFor: ['small teams wanting simplicity', 'basic website analytics', 'budget-constrained startups', 'teams without analytics expertise'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://amplitude.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Plausible',
      category: 'analytics',
      description:
        'Privacy-friendly, lightweight web analytics. No cookies, GDPR-compliant out of the box. Open source and self-hostable. Simple dashboard with essential metrics.',
      pricing: 'Cloud from $9/mo (10K pageviews); Self-hosted free (Community Edition)',
      features: ['Privacy-first analytics', 'No cookies needed', 'GDPR compliant', 'Lightweight script (<1KB)', 'Goal conversions', 'Campaign tracking', 'Open source'],
      integrations: ['Any website', 'WordPress', 'Ghost', 'Carrd', 'Webflow', 'Squarespace', 'Hugo'],
      bestFor: ['privacy-conscious teams', 'GDPR compliance', 'simple website analytics', 'replacing Google Analytics'],
      worstFor: ['deep product analytics', 'funnel analysis', 'user-level tracking', 'teams needing session recordings'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://plausible.io',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ─── MONITORING ────────────────────────────────────────────────────────
  {
    product: {
      name: 'Datadog',
      category: 'monitoring',
      description:
        'Cloud-scale monitoring and security platform. Infrastructure monitoring, APM, logs, RUM, synthetics, and security monitoring in one platform.',
      pricing: 'Free tier (5 hosts); Pro from $15/host/mo; Enterprise from $23/host/mo; many add-ons',
      features: ['Infrastructure monitoring', 'APM', 'Log management', 'RUM', 'Synthetics', 'Security monitoring', 'Dashboards', 'Alerting', 'CI visibility'],
      integrations: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'Node.js', 'Python', 'Java', 'Go', 'Ruby', '.NET'],
      bestFor: ['enterprise observability', 'full-stack monitoring', 'large infrastructure', 'teams wanting single pane of glass'],
      worstFor: ['small teams on a budget', 'simple uptime monitoring', 'cost-predictable billing', 'hobby projects'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://datadoghq.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Sentry',
      category: 'monitoring',
      description:
        'Application monitoring and error tracking. Captures exceptions, performance issues, and session replays. Open source core with cloud-hosted option.',
      pricing: 'Free (5K errors, 10K perf transactions); Team $26/mo; Business $80/mo; Enterprise custom',
      features: ['Error tracking', 'Performance monitoring', 'Session replay', 'Profiling', 'Cron monitoring', 'Release tracking', 'Source maps', 'Alerts'],
      integrations: ['JavaScript', 'React', 'Next.js', 'Python', 'Django', 'Ruby', 'Rails', 'Go', 'Java', 'iOS', 'Android', 'Flutter'],
      bestFor: ['error tracking', 'debugging production issues', 'performance monitoring', 'teams wanting open-source option'],
      worstFor: ['infrastructure monitoring', 'log management', 'uptime monitoring', 'network monitoring'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://sentry.io',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'BetterStack',
      category: 'monitoring',
      description:
        'Modern observability stack combining uptime monitoring, incident management, on-call scheduling, and log management. Beautiful UI and great developer experience.',
      pricing: 'Free tier (10 monitors); Plus from $24/mo; Team from $85/mo; Enterprise custom',
      features: ['Uptime monitoring', 'Incident management', 'On-call scheduling', 'Status pages', 'Log management', 'Heartbeat monitoring', 'Screenshots'],
      integrations: ['Slack', 'PagerDuty', 'OpsGenie', 'Datadog', 'Grafana', 'AWS', 'Vercel', 'Node.js', 'Python', 'Ruby'],
      bestFor: ['uptime monitoring', 'incident management', 'status pages', 'teams wanting modern UI', 'combined monitoring + logging'],
      worstFor: ['deep APM needs', 'infrastructure-level monitoring', 'very large log volumes', 'complex distributed tracing'],
      trustScore: 0.81,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://betterstack.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ─── SEARCH ────────────────────────────────────────────────────────────
  {
    product: {
      name: 'Algolia',
      category: 'search',
      description:
        'Hosted search API delivering real-time results. Typo tolerance, faceting, geo-search, and AI-powered relevance. Powers search for thousands of websites and apps.',
      pricing: 'Free 10K searches/mo; Premium from $1/1K searches; Enterprise custom',
      features: ['Full-text search', 'Typo tolerance', 'Faceted search', 'Geo-search', 'Analytics', 'A/B testing', 'AI re-ranking', 'Personalization'],
      integrations: ['React', 'Vue', 'Angular', 'JavaScript', 'iOS', 'Android', 'Rails', 'Django', 'Laravel', 'Shopify', 'Magento'],
      bestFor: ['e-commerce search', 'documentation search', 'real-time search', 'teams wanting hosted solution'],
      worstFor: ['large-scale on tight budget', 'teams wanting self-hosted', 'simple SQL LIKE queries', 'very custom ranking needs'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://algolia.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Typesense',
      category: 'search',
      description:
        'Open-source, typo-tolerant search engine. Fast, easy to set up, and developer-friendly. Self-host or use Typesense Cloud. Great Algolia alternative.',
      pricing: 'Self-hosted free; Cloud from $29.99/mo (0.5 vCPU, 1 GB RAM)',
      features: ['Full-text search', 'Typo tolerance', 'Faceted search', 'Geo-search', 'Conversational search', 'Vector search', 'Synonyms', 'Curation'],
      integrations: ['JavaScript', 'Python', 'Ruby', 'PHP', 'Java', 'Go', 'Dart', 'InstantSearch.js', 'DocSearch'],
      bestFor: ['Algolia alternative on budget', 'self-hosted search', 'developer-friendly search', 'open-source enthusiasts'],
      worstFor: ['very large datasets (100M+ docs)', 'complex multi-index queries', 'teams needing enterprise support', 'advanced analytics built-in'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://typesense.org',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Meilisearch',
      category: 'search',
      description:
        'Open-source, lightning-fast search engine written in Rust. Instant search with typo tolerance, filters, and facets. Self-host or use Meilisearch Cloud.',
      pricing: 'Self-hosted free; Cloud from $30/mo (Build); Pro from $300/mo; Enterprise custom',
      features: ['Instant search', 'Typo tolerance', 'Filters and facets', 'Multi-tenancy', 'Geo-search', 'AI-powered search', 'Snapshots', 'Custom ranking'],
      integrations: ['JavaScript', 'Python', 'Ruby', 'PHP', 'Go', 'Rust', 'Java', '.NET', 'Dart', 'Swift', 'InstantSearch'],
      bestFor: ['fast search setup', 'self-hosted search', 'Rust ecosystem', 'multi-tenant applications', 'small-medium datasets'],
      worstFor: ['massive datasets needing sharding', 'real-time indexing at very high throughput', 'teams needing built-in analytics', 'complex aggregation queries'],
      trustScore: 0.81,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://meilisearch.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ─── ADDITIONAL TOOLS ──────────────────────────────────────────────────
  {
    product: {
      name: 'Semrush',
      category: 'seo',
      description:
        'All-in-one SEO and digital marketing toolkit. Keyword research, site audit, rank tracking, backlink analysis, and competitive intelligence. One of the highest-paying affiliate programs in SaaS: $200 per new subscription sale via Impact.com with a 120-day cookie and $10 per free trial signup.',
      pricing: 'Pro $139.95/mo; Guru $249.95/mo; Business $499.95/mo',
      features: ['Keyword research', 'Site audit', 'Rank tracking', 'Backlink analysis', 'Competitive analysis', 'Content marketing', 'Social media', 'PPC research', 'AI Writing Assistant', 'Listing Management', 'Link Building Tool'],
      integrations: ['Google Analytics', 'Google Search Console', 'WordPress', 'Looker Studio', 'Zapier', 'Trello', 'Surfer SEO', 'Google Ads', 'Majestic'],
      bestFor: ['SEO professionals', 'content marketers', 'competitive analysis', 'agency teams', 'PPC managers'],
      worstFor: ['hobby bloggers on a budget', 'teams needing only basic analytics', 'technical-only SEO needs', 'small local businesses'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'impact',
        affiliateLink: 'https://aan.dev/go/semrush',
        payoutType: 'per-sale',
        payoutAmount: 200,
        payoutCurrency: 'USD',
        cookieDays: 120,
        approved: true,
      },
      {
        network: 'impact',
        affiliateLink: 'https://aan.dev/go/semrush-trial',
        payoutType: 'per-signup',
        payoutAmount: 10,
        payoutCurrency: 'USD',
        cookieDays: 120,
        approved: true,
      },
    ],
  },
  {
    product: {
      name: 'Cloudflare',
      category: 'infrastructure',
      description:
        'Global cloud platform providing CDN, DDoS protection, DNS, Workers (serverless), R2 (storage), D1 (database), and Zero Trust security.',
      pricing: 'Free tier; Pro $20/mo; Business $200/mo; Enterprise custom; Workers free tier',
      features: ['CDN', 'DDoS protection', 'DNS', 'Workers (serverless)', 'R2 (object storage)', 'D1 (SQLite database)', 'Pages', 'Zero Trust', 'WAF'],
      integrations: ['Any website', 'WordPress', 'Shopify', 'Next.js', 'Astro', 'SvelteKit', 'Remix', 'AWS', 'GCP'],
      bestFor: ['website performance', 'DDoS protection', 'edge computing', 'serverless at the edge', 'free DNS and CDN'],
      worstFor: ['teams needing long-running processes', 'complex database workloads', 'teams invested in other cloud ecosystems', 'vendor lock-in averse'],
      trustScore: 0.91,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://cloudflare.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
];
