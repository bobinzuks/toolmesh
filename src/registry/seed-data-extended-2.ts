import type { Product, AffiliateProgram } from '../types/product.js';

type SeedProduct = {
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
  programs: Omit<AffiliateProgram, 'id' | 'productId'>[];
};

export const EXTENDED_PRODUCTS_2: SeedProduct[] = [
  // ─── APIS & SERVICES ─────────────────────────────────────────────────

  {
    product: {
      name: 'Twilio',
      category: 'communications',
      description:
        'Programmable communications platform providing APIs for SMS, voice, video, WhatsApp, and email (via SendGrid). Powers millions of businesses with reliable global infrastructure.',
      pricing: 'Pay-as-you-go; SMS from $0.0079/msg; Voice from $0.0085/min; Video from $0.004/participant/min',
      features: ['SMS/MMS API', 'Voice API', 'Video API', 'WhatsApp Business API', 'Verify (2FA)', 'Conversations API', 'Programmable messaging', 'Studio (visual workflow builder)', 'Segment integration'],
      integrations: ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Salesforce', 'Zapier', 'SendGrid'],
      bestFor: ['transactional SMS/voice', 'two-factor authentication', 'customer notifications', 'contact centers', 'WhatsApp integration'],
      worstFor: ['budget-sensitive startups', 'simple email-only needs', 'teams wanting flat-rate pricing', 'very low-volume use cases'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'impact',
        affiliateLink: 'https://www.twilio.com/referral',
        payoutType: 'per-sale',
        payoutAmount: 10,
        payoutCurrency: 'USD',
        cookieDays: 30,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Plaid',
      category: 'fintech',
      description:
        'Financial data infrastructure connecting apps to users bank accounts. Provides account verification, transaction data, identity verification, and income/employment checks. Used by Venmo, Robinhood, and thousands of fintech apps.',
      pricing: 'Pay-per-connection; Auth from $0.30/verification; Transactions custom pricing; free sandbox',
      features: ['Account linking', 'Transaction data', 'Identity verification', 'Balance checks', 'Income verification', 'Asset reports', 'Transfer (ACH)', 'Investments data', 'Liabilities data'],
      integrations: ['Node.js', 'Python', 'Ruby', 'Java', 'Go', 'React', 'iOS SDK', 'Android SDK', 'Stripe', 'Dwolla'],
      bestFor: ['fintech apps', 'bank account verification', 'personal finance tools', 'lending platforms', 'payment initiation'],
      worstFor: ['non-financial use cases', 'teams outside US/Canada/UK/EU', 'very simple payment needs', 'budget-conscious MVPs'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://plaid.com',
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
      name: 'Mapbox',
      category: 'maps',
      description:
        'Location data platform for maps, navigation, and spatial analysis. Provides customizable map tiles, geocoding, routing, and satellite imagery. Powers maps for Instacart, Strava, and The Washington Post.',
      pricing: 'Free up to 50K map loads/mo; pay-as-you-go from $5/1K loads; Enterprise custom',
      features: ['Custom map styles', 'Geocoding API', 'Directions/routing API', 'Static maps', 'Satellite imagery', 'Terrain data', 'Isochrone API', 'Map matching', 'Tilesets'],
      integrations: ['React', 'React Native', 'iOS SDK', 'Android SDK', 'Flutter', 'Unity', 'JavaScript GL', 'Python', 'Tableau'],
      bestFor: ['custom map styling', 'logistics/routing apps', 'data visualization on maps', 'mobile navigation', 'location-based services'],
      worstFor: ['simple embed-a-map needs', 'teams wanting free unlimited usage', 'Street View equivalent needs', 'zero-JavaScript environments'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://mapbox.com',
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
      name: 'Cloudinary',
      category: 'media',
      description:
        'Cloud-based image and video management platform. Provides upload, storage, transformation, optimization, and CDN delivery. Supports AI-powered tagging, background removal, and responsive images.',
      pricing: 'Free 25 credits/mo (~25K transformations); Plus $89/mo; Advanced $224/mo; Enterprise custom',
      features: ['Image transformations', 'Video transcoding', 'AI background removal', 'Auto-format/quality', 'DAM (digital asset management)', 'Upload widget', 'Face detection', 'Lazy loading', 'Responsive images'],
      integrations: ['React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Python', 'Ruby', 'PHP', 'iOS', 'Android', 'Shopify', 'WordPress'],
      bestFor: ['image-heavy apps', 'e-commerce product images', 'media-rich websites', 'on-the-fly transformations', 'DAM needs'],
      worstFor: ['simple static file hosting', 'very large video streaming', 'teams wanting open-source solutions', 'minimal transformation needs'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'impact',
        affiliateLink: 'https://cloudinary.com/partners',
        payoutType: 'recurring',
        payoutAmount: 50,
        payoutCurrency: 'USD',
        cookieDays: 60,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'imgix',
      category: 'media',
      description:
        'Real-time image processing and CDN service. Transforms, optimizes, and delivers images via URL parameters. Excellent for performance-focused teams wanting fine-grained control over image delivery.',
      pricing: 'Free up to 1K origin images; Basic $10/mo; Growth from $50/mo; Enterprise custom',
      features: ['URL-based transformations', 'Auto-format (WebP/AVIF)', 'Face detection/cropping', 'Watermarking', 'PDF rendering', 'Color palette extraction', 'CDN delivery', 'Purging API'],
      integrations: ['React', 'Next.js', 'Vue', 'Gatsby', 'Ruby on Rails', 'Python', 'PHP', 'iOS', 'Contentful', 'Sanity'],
      bestFor: ['performance-focused image delivery', 'URL-based image transformation', 'CMS-backed media', 'responsive images', 'headless CMS setups'],
      worstFor: ['video processing', 'DAM-heavy workflows', 'teams wanting visual editors', 'very small projects not needing CDN'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://imgix.com',
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
      name: 'Pusher',
      category: 'realtime',
      description:
        'Hosted APIs for building realtime features including WebSockets, pub/sub channels, presence detection, and push notifications. Simple integration with client and server SDKs.',
      pricing: 'Free up to 200K messages/day + 100 connections; Starter $49/mo; Business $99/mo; Enterprise custom',
      features: ['WebSocket channels', 'Presence channels', 'Client events', 'Push notifications (Beams)', 'Webhooks', 'End-to-end encryption', 'Channel occupancy queries', 'REST API'],
      integrations: ['JavaScript', 'React', 'React Native', 'iOS', 'Android', 'Node.js', 'Python', 'Ruby', 'PHP', 'Go', 'Java', '.NET', 'Laravel'],
      bestFor: ['chat features', 'live notifications', 'realtime dashboards', 'collaborative features', 'quick WebSocket setup'],
      worstFor: ['very high message volume on a budget', 'complex event streaming', 'teams wanting self-hosted', 'multi-region guaranteed ordering'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://pusher.com',
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
      name: 'Ably',
      category: 'realtime',
      description:
        'Enterprise-grade realtime messaging platform. Provides pub/sub, presence, message history, and guaranteed delivery with global edge network. 99.999% SLA available on enterprise plans.',
      pricing: 'Free 6M messages/mo; Standard from $29/mo; Enterprise custom',
      features: ['Pub/sub messaging', 'Presence', 'Message history', 'Guaranteed delivery', 'Global edge network', 'SSE/WebSocket/MQTT', 'Token auth', 'Channel rules'],
      integrations: ['JavaScript', 'React', 'Node.js', 'Python', 'Ruby', 'Java', 'Go', '.NET', 'iOS', 'Android', 'Flutter', 'MQTT clients'],
      bestFor: ['enterprise realtime needs', 'guaranteed message delivery', 'IoT messaging', 'high-reliability systems', 'global realtime apps'],
      worstFor: ['simple notification-only needs', 'very cost-sensitive projects', 'teams not needing delivery guarantees', 'purely serverless architectures'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://ably.com',
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
      name: 'Stream',
      category: 'realtime',
      description:
        'API for building chat messaging and activity feeds. Provides pre-built UI components for React, React Native, Flutter, and more. Powers chat in thousands of apps with moderation, threads, and reactions built in.',
      pricing: 'Free Maker plan (100 MAU); Starter $499/mo; Enterprise custom',
      features: ['Chat messaging API', 'Activity feeds', 'Pre-built UI components', 'Moderation (AI + manual)', 'Threads and replies', 'Reactions', 'Typing indicators', 'Read receipts', 'File/image attachments'],
      integrations: ['React', 'React Native', 'Flutter', 'iOS', 'Android', 'Angular', 'Node.js', 'Python', 'Go', 'Ruby', 'PHP', '.NET'],
      bestFor: ['in-app chat', 'social feeds', 'team messaging features', 'apps needing moderation', 'rapid chat MVP'],
      worstFor: ['simple notification needs', 'budget-constrained startups past free tier', 'custom protocol requirements', 'teams wanting to build from scratch'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://getstream.io',
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
      name: 'LaunchDarkly',
      category: 'feature-flags',
      description:
        'Enterprise feature management platform. Provides feature flags, progressive rollouts, A/B testing, and experimentation. Used by IBM, Atlassian, and NBC. Supports server-side, client-side, and mobile SDKs.',
      pricing: 'Free developer plan (1K MAU); Foundation $10.50/seat/mo; Enterprise custom',
      features: ['Feature flags', 'Progressive rollouts', 'A/B testing', 'Targeting rules', 'Audit log', 'Approvals workflow', 'Experimentation', 'Code references', 'Flag insights'],
      integrations: ['Node.js', 'Python', 'Java', 'Go', 'Ruby', '.NET', 'React', 'iOS', 'Android', 'Terraform', 'Datadog', 'Slack', 'Jira'],
      bestFor: ['enterprise feature management', 'progressive rollouts', 'A/B testing', 'trunk-based development', 'kill switches'],
      worstFor: ['very small teams', 'budget-constrained startups', 'teams wanting open-source only', 'simple on/off flags'],
      trustScore: 0.89,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://launchdarkly.com',
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
      name: 'Split.io',
      category: 'feature-flags',
      description:
        'Feature delivery platform combining feature flags with measurement. Automatically measures the impact of every feature release. Acquired by Harness in 2023.',
      pricing: 'Free up to 10 seats; Growth from $33/seat/mo; Enterprise custom',
      features: ['Feature flags', 'Impact measurement', 'Targeting rules', 'Traffic allocation', 'Integrations hub', 'Audit trail', 'SDK telemetry', 'Gradual rollouts'],
      integrations: ['Node.js', 'Python', 'Java', 'Go', 'Ruby', '.NET', 'React', 'Angular', 'iOS', 'Android', 'Datadog', 'Slack', 'Jira'],
      bestFor: ['measuring feature impact', 'data-driven releases', 'enterprise feature delivery', 'teams wanting built-in metrics'],
      worstFor: ['teams wanting simple flag toggles', 'very small projects', 'open-source purists', 'teams already using Harness'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://split.io',
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
      name: 'Segment',
      category: 'cdp',
      description:
        'Customer data platform (CDP) that collects, cleans, and routes event data to hundreds of downstream tools. Single API for analytics, marketing, and data warehousing. Now part of Twilio.',
      pricing: 'Free up to 1K visitors/mo; Team $120/mo (10K sources); Business custom',
      features: ['Event tracking', 'Identity resolution', 'Connections (300+ integrations)', 'Protocols (data governance)', 'Personas (user profiles)', 'Functions (custom transforms)', 'Privacy controls'],
      integrations: ['Google Analytics', 'Mixpanel', 'Amplitude', 'BigQuery', 'Snowflake', 'Salesforce', 'HubSpot', 'Braze', 'Slack', 'AWS S3', 'Datadog'],
      bestFor: ['multi-tool analytics stacks', 'data governance', 'identity resolution', 'marketing data routing', 'warehouse-first analytics'],
      worstFor: ['simple single-analytics setups', 'very tight budgets', 'teams not using multiple downstream tools', 'privacy-first teams wanting self-hosted'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://segment.com',
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
      name: 'RudderStack',
      category: 'cdp',
      description:
        'Open-source customer data platform and warehouse-native alternative to Segment. Collects and routes event data with warehouse-first architecture. Self-hosted or cloud options.',
      pricing: 'Free up to 25K events/mo; Starter $150/mo (5M events); Growth custom; Enterprise custom',
      features: ['Event streaming', 'Warehouse-first architecture', 'Reverse ETL', 'Identity resolution', 'Transformations', '200+ integrations', 'Data governance', 'Open-source core'],
      integrations: ['Snowflake', 'BigQuery', 'Redshift', 'Databricks', 'Mixpanel', 'Amplitude', 'HubSpot', 'Salesforce', 'Braze', 'S3', 'Kafka'],
      bestFor: ['warehouse-first data teams', 'Segment alternatives', 'open-source preference', 'privacy-conscious teams', 'high-volume event streaming'],
      worstFor: ['non-technical teams wanting GUI setup', 'very small projects', 'teams needing extensive managed support', 'no-warehouse setups'],
      trustScore: 0.81,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://rudderstack.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ─── DEV TOOLS & EDITORS ─────────────────────────────────────────────

  {
    product: {
      name: 'Cursor',
      category: 'dev-tools',
      description:
        'AI-powered code editor built on VS Code. Features AI code completion, inline editing, codebase-aware chat, and multi-file editing. Supports GPT-4o, Claude, and other models.',
      pricing: 'Free (Hobby, 2K completions); Pro $20/mo (unlimited); Business $40/user/mo',
      features: ['AI code completion', 'Inline AI editing (Cmd+K)', 'Codebase-aware chat', 'Multi-file editing', 'VS Code extension compatibility', 'Model selection (GPT-4o, Claude)', 'Terminal AI', 'Docs context'],
      integrations: ['VS Code extensions', 'GitHub', 'GitLab', 'Python', 'TypeScript', 'JavaScript', 'Rust', 'Go', 'All VS Code languages'],
      bestFor: ['AI-assisted development', 'VS Code users wanting AI', 'rapid prototyping', 'large codebase navigation', 'solo developers'],
      worstFor: ['teams wanting Vim/Emacs', 'air-gapped environments', 'developers avoiding AI tooling', 'organizations with strict data policies'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://cursor.com',
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
      name: 'Zed',
      category: 'dev-tools',
      description:
        'High-performance code editor written in Rust. Focuses on speed with GPU-accelerated rendering, collaborative editing, and built-in AI assistant. Open source under GPL.',
      pricing: 'Free (open source); Zed Pro for teams TBD',
      features: ['GPU-accelerated rendering', 'Collaborative editing', 'Built-in AI assistant', 'Multi-buffer editing', 'Vim mode', 'Language server support', 'Terminal', 'Themes', 'Extensions'],
      integrations: ['GitHub Copilot', 'Claude', 'OpenAI', 'Ollama', 'Tree-sitter', 'LSP servers', 'Git', 'Terminal'],
      bestFor: ['speed-focused developers', 'collaborative coding', 'Rust enthusiasts', 'developers wanting native performance', 'open-source advocates'],
      worstFor: ['heavy extension ecosystem needs', 'Windows users (Linux/macOS only)', 'teams needing mature plugin marketplace', 'VS Code extension dependency'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://zed.dev',
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
      name: 'Warp',
      category: 'dev-tools',
      description:
        'Modern GPU-accelerated terminal with AI command search, collaborative features, and IDE-like editing. Built in Rust with native performance. AI can explain errors and suggest commands.',
      pricing: 'Free (individual); Team $15/user/mo; Enterprise custom',
      features: ['GPU-accelerated rendering', 'AI command search', 'Block-based output', 'Workflows (saved commands)', 'Warp Drive (shared commands)', 'IDE-like editing', 'Themes', 'Split panes'],
      integrations: ['zsh', 'bash', 'fish', 'tmux', 'SSH', 'Docker', 'Kubernetes', 'Git', 'VS Code', 'iTerm2 themes'],
      bestFor: ['developers wanting modern terminal UX', 'teams sharing terminal workflows', 'AI-assisted CLI usage', 'macOS/Linux developers'],
      worstFor: ['Windows users', 'minimal terminal purists', 'air-gapped environments', 'developers preferring traditional terminals'],
      trustScore: 0.79,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://warp.dev',
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
      name: 'Raycast',
      category: 'dev-tools',
      description:
        'Blazing-fast macOS launcher and productivity tool replacing Spotlight. Offers AI chat, clipboard history, window management, snippets, and a massive extension store. Built for developers.',
      pricing: 'Free (core); Pro $8/mo (AI, cloud sync, themes); Team $12/user/mo; Enterprise custom',
      features: ['Quick launcher', 'AI chat/commands', 'Clipboard history', 'Window management', 'Snippets', 'Extension store', 'Script commands', 'Quicklinks', 'Floating notes'],
      integrations: ['GitHub', 'Jira', 'Linear', 'Notion', 'Slack', 'Figma', 'Docker', 'AWS', 'Vercel', 'Spotify', 'Homebrew'],
      bestFor: ['macOS power users', 'developer productivity', 'Spotlight replacement', 'quick access to dev tools', 'workflow automation'],
      worstFor: ['Windows/Linux users', 'non-developer workflows', 'teams needing cross-platform launcher', 'users happy with Alfred/Spotlight'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://raycast.com',
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
      name: 'Linear',
      category: 'project-management',
      description:
        'Streamlined issue tracking and project management tool built for software teams. Known for keyboard-first UX, speed, and opinionated workflows. Cycles, projects, and roadmaps built in.',
      pricing: 'Free up to 250 issues; Standard $8/user/mo; Plus $14/user/mo; Enterprise custom',
      features: ['Issue tracking', 'Cycles (sprints)', 'Projects', 'Roadmaps', 'Triage', 'Views and filters', 'Keyboard shortcuts', 'API', 'Git integration'],
      integrations: ['GitHub', 'GitLab', 'Slack', 'Figma', 'Sentry', 'Zendesk', 'Intercom', 'Zapier', 'Discord', 'VS Code'],
      bestFor: ['fast-moving engineering teams', 'keyboard-first workflows', 'opinionated project management', 'startups', 'product-led teams'],
      worstFor: ['non-engineering teams', 'highly customizable workflow needs', 'Jira-like enterprise configuration', 'teams wanting Gantt charts'],
      trustScore: 0.91,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://linear.app',
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
      name: 'Notion',
      category: 'productivity',
      description:
        'All-in-one workspace combining docs, wikis, databases, and project management. AI assistant for writing, summarizing, and querying data. Used by millions for knowledge management.',
      pricing: 'Free (personal); Plus $10/user/mo; Business $18/user/mo; Enterprise custom; AI add-on $10/user/mo',
      features: ['Docs and wikis', 'Databases', 'Project management', 'AI assistant', 'Templates', 'API', 'Integrations', 'Web clipper', 'Team spaces'],
      integrations: ['Slack', 'GitHub', 'Jira', 'Google Drive', 'Figma', 'Zapier', 'Typeform', 'Loom', 'Calendly', 'Asana'],
      bestFor: ['knowledge management', 'team wikis', 'flexible databases', 'content planning', 'all-in-one workspace'],
      worstFor: ['real-time collaboration at scale', 'offline-first needs', 'very large databases (10K+ rows)', 'teams wanting minimal tooling'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://notion.so',
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
      name: 'Coda',
      category: 'productivity',
      description:
        'Doc-meets-spreadsheet platform that combines documents, tables, and automations. Packs extend functionality with integrations. Strong formula language for computed columns and automations.',
      pricing: 'Free (limited); Pro $10/doc-maker/mo; Team $30/doc-maker/mo; Enterprise custom',
      features: ['Docs with tables', 'Packs (integrations)', 'Automations', 'Formula language', 'Cross-doc syncing', 'Publishing', 'AI assistant', 'Templates', 'Views'],
      integrations: ['Slack', 'Google Calendar', 'Gmail', 'Jira', 'GitHub', 'Figma', 'Salesforce', 'HubSpot', 'Zapier', 'Pendo'],
      bestFor: ['doc-centric workflows', 'custom internal tools without code', 'process automation', 'teams wanting docs + spreadsheets combined'],
      worstFor: ['large dataset processing', 'developer-heavy teams wanting code', 'simple document editing', 'offline-first requirements'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://coda.io',
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
      name: 'Airtable',
      category: 'productivity',
      description:
        'Low-code platform combining spreadsheets with database power. Rich field types, views (grid, kanban, calendar, gallery), automations, and interfaces for building apps on top of data.',
      pricing: 'Free (1K records/base); Team $20/user/mo; Business $45/user/mo; Enterprise custom',
      features: ['Rich field types', 'Multiple views', 'Automations', 'Interface designer', 'Scripting', 'Sync across bases', 'Extensions', 'Forms', 'API'],
      integrations: ['Slack', 'Google Workspace', 'Salesforce', 'Jira', 'Zapier', 'Make', 'Box', 'Twilio', 'Stripe', 'GitHub'],
      bestFor: ['structured data management', 'non-technical team databases', 'content calendars', 'CRM alternatives', 'project tracking with rich views'],
      worstFor: ['large datasets (100K+ records)', 'developer-centric workflows', 'complex relational queries', 'real-time collaboration at high scale'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://airtable.com',
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
      name: 'Retool',
      category: 'internal-tools',
      description:
        'Low-code platform for building internal tools. Drag-and-drop UI components connected to databases, APIs, and third-party services. Supports custom JavaScript, SQL queries, and workflows.',
      pricing: 'Free up to 5 users; Team $10/user/mo; Business $50/user/mo; Enterprise custom',
      features: ['Drag-and-drop UI builder', 'SQL/API queries', 'JavaScript transforms', 'Workflows (automation)', 'Mobile apps', 'RBAC', 'Audit logs', 'Git sync', 'Custom components'],
      integrations: ['PostgreSQL', 'MySQL', 'MongoDB', 'REST APIs', 'GraphQL', 'Snowflake', 'BigQuery', 'Salesforce', 'Stripe', 'Twilio', 'S3', 'Google Sheets'],
      bestFor: ['internal admin panels', 'CRUD apps', 'operations dashboards', 'customer support tools', 'teams building internal tools fast'],
      worstFor: ['customer-facing apps', 'complex custom UIs', 'teams wanting fully coded solutions', 'open-source purists'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://retool.com',
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
      name: 'Airplane',
      category: 'internal-tools',
      description:
        'Developer-first platform for building internal tools, workflows, and runbooks. Code-first approach with TypeScript/Python tasks, SQL queries, and approval flows. Acquired by Airtable in 2024.',
      pricing: 'Free up to 5 users; Team $10/user/mo; Enterprise custom (note: now part of Airtable)',
      features: ['Task library', 'SQL queries', 'TypeScript/Python tasks', 'Approval flows', 'Schedules', 'Audit logs', 'Views (UIs)', 'Runbooks', 'Permissions'],
      integrations: ['PostgreSQL', 'MySQL', 'REST APIs', 'GraphQL', 'Slack', 'GitHub', 'AWS', 'GCP', 'Snowflake', 'MongoDB'],
      bestFor: ['code-first internal tools', 'developer operations', 'runbook automation', 'approval workflows', 'SQL-heavy internal tools'],
      worstFor: ['non-technical users', 'customer-facing apps', 'drag-and-drop UI needs', 'teams needing standalone product (now Airtable)'],
      trustScore: 0.72,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://airplane.dev',
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
      name: 'Supabase Studio',
      category: 'dev-tools',
      description:
        'Web-based database management UI for Supabase projects. Includes table editor, SQL editor, API docs, auth management, storage browser, and real-time inspector. Free with any Supabase project.',
      pricing: 'Free (included with Supabase); Pro features with Supabase Pro $25/mo',
      features: ['Table editor', 'SQL editor', 'API docs (auto-generated)', 'Auth management UI', 'Storage browser', 'Realtime inspector', 'Database migrations', 'Extensions manager'],
      integrations: ['Supabase', 'PostgreSQL', 'pgvector', 'PostgREST', 'GoTrue', 'Realtime', 'Edge Functions', 'Storage'],
      bestFor: ['Supabase users', 'visual database management', 'quick prototyping', 'teams wanting GUI for Postgres', 'non-DBA developers'],
      worstFor: ['non-Supabase Postgres instances', 'teams wanting standalone DB client', 'advanced DBA operations', 'MySQL/MongoDB users'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://supabase.com/dashboard',
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
      name: 'TablePlus',
      category: 'dev-tools',
      description:
        'Native database management GUI for macOS, Windows, and Linux. Supports PostgreSQL, MySQL, SQLite, Redis, MongoDB, Cassandra, and more. Fast, clean interface with inline editing.',
      pricing: 'Free (limited tabs/connections); License $89 one-time (2 devices); Team $189/device',
      features: ['Multi-database support', 'Inline editing', 'Query editor with autocomplete', 'SSH tunneling', 'Import/export', 'Dark mode', 'Code review for queries', 'Plugins'],
      integrations: ['PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'Redis', 'MongoDB', 'Cassandra', 'CockroachDB', 'SQL Server', 'Amazon Redshift'],
      bestFor: ['developers managing multiple databases', 'native app performance', 'quick data browsing', 'cross-database workflows', 'SSH tunnel access'],
      worstFor: ['teams wanting web-based UI', 'advanced schema design tools', 'very complex query debugging', 'enterprise audit requirements'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://tableplus.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ─── TESTING ──────────────────────────────────────────────────────────

  {
    product: {
      name: 'Playwright',
      category: 'testing',
      description:
        'End-to-end testing framework by Microsoft for web apps. Supports Chromium, Firefox, and WebKit with auto-wait, web-first assertions, and tracing. Runs tests in parallel with built-in codegen.',
      pricing: 'Free (open source, MIT license)',
      features: ['Cross-browser testing', 'Auto-wait', 'Web-first assertions', 'Test codegen', 'Tracing and debugging', 'Parallel execution', 'API testing', 'Visual comparisons', 'Component testing'],
      integrations: ['VS Code', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'Docker', 'TypeScript', 'JavaScript', 'Python', 'Java', '.NET'],
      bestFor: ['cross-browser E2E testing', 'modern web app testing', 'CI/CD pipelines', 'teams wanting auto-wait reliability', 'API + UI testing in one'],
      worstFor: ['mobile native testing', 'legacy browser support (IE)', 'teams wanting commercial support', 'non-web applications'],
      trustScore: 0.92,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://playwright.dev',
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
      name: 'Vitest',
      category: 'testing',
      description:
        'Blazing fast unit test framework powered by Vite. Jest-compatible API with native ESM, TypeScript, and JSX support. In-source testing, watch mode, and built-in coverage.',
      pricing: 'Free (open source, MIT license)',
      features: ['Jest-compatible API', 'Native ESM support', 'TypeScript out of the box', 'Watch mode', 'Code coverage (c8/istanbul)', 'Snapshot testing', 'In-source testing', 'Workspace support', 'Browser mode'],
      integrations: ['Vite', 'VS Code', 'GitHub Actions', 'React', 'Vue', 'Svelte', 'Nuxt', 'Astro', 'TypeScript', 'MSW'],
      bestFor: ['Vite-based projects', 'fast unit testing', 'Jest migration', 'TypeScript/ESM projects', 'modern frontend testing'],
      worstFor: ['non-Vite legacy projects', 'E2E testing', 'teams deeply invested in Jest ecosystem', 'Node.js-only backend testing'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://vitest.dev',
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
      name: 'Cypress',
      category: 'testing',
      description:
        'JavaScript end-to-end testing framework with time-travel debugging, automatic waiting, and real-time reloading. Cypress Cloud provides test analytics, parallelization, and flake detection.',
      pricing: 'Open source (free); Cypress Cloud: Free up to 500 test results/mo; Team $67/mo; Business $250/mo; Enterprise custom',
      features: ['Time-travel debugging', 'Automatic waiting', 'Real-time reloads', 'Network stubbing', 'Screenshot/video capture', 'Component testing', 'Cypress Cloud (dashboard)', 'Parallelization', 'Flake detection'],
      integrations: ['React', 'Vue', 'Angular', 'Next.js', 'GitHub Actions', 'CircleCI', 'Jenkins', 'Docker', 'TypeScript', 'Webpack'],
      bestFor: ['frontend E2E testing', 'component testing', 'debugging test failures', 'teams wanting visual test debugging', 'JavaScript-heavy apps'],
      worstFor: ['multi-tab testing', 'cross-browser (WebKit limited)', 'non-JavaScript projects', 'server-side testing'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://cypress.io',
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
      name: 'k6',
      category: 'testing',
      description:
        'Open-source load testing tool by Grafana Labs. Write tests in JavaScript/TypeScript, run locally or in the cloud. Supports HTTP, WebSocket, gRPC, and browser-based testing.',
      pricing: 'Free (open source); k6 Cloud: Free 50 tests/mo; Team from $99/mo; Enterprise custom',
      features: ['JavaScript test scripting', 'HTTP/WebSocket/gRPC support', 'Browser-based testing', 'Thresholds and checks', 'Custom metrics', 'Cloud execution', 'Grafana integration', 'Extensions (xk6)'],
      integrations: ['Grafana', 'Prometheus', 'Datadog', 'New Relic', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'Docker', 'Kubernetes', 'InfluxDB'],
      bestFor: ['load and performance testing', 'developer-friendly scripting', 'CI/CD performance gates', 'API stress testing', 'Grafana users'],
      worstFor: ['non-technical QA teams', 'GUI-only test creation', 'functional E2E testing', 'teams wanting record-and-replay'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://k6.io',
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
      name: 'Grafana k6 Cloud',
      category: 'testing',
      description:
        'Managed cloud service for running k6 load tests at scale. Distributed execution from global locations, built-in result analysis, and CI/CD integration. Part of Grafana Cloud.',
      pricing: 'Free 50 tests/mo (50 VUs); Team $99/mo; Pro $399/mo; Enterprise custom',
      features: ['Distributed cloud execution', 'Global test locations', 'Result analysis dashboard', 'Performance trending', 'Test comparison', 'CI/CD integration', 'Grafana dashboards', 'Team collaboration'],
      integrations: ['k6 OSS', 'Grafana', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'Azure DevOps', 'Prometheus', 'Datadog'],
      bestFor: ['cloud-scale load testing', 'distributed performance testing', 'teams using k6 OSS', 'Grafana Cloud users', 'enterprise load testing'],
      worstFor: ['teams only needing local testing', 'budget-constrained small teams', 'functional testing only', 'non-JavaScript test tools'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://grafana.com/products/cloud/k6/',
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
      name: 'BrowserStack',
      category: 'testing',
      description:
        'Cloud platform for testing websites and mobile apps on real devices and browsers. Offers live interactive testing, automated testing, visual testing, and accessibility testing.',
      pricing: 'Free trial; Live from $29/mo; Automate from $129/mo; App Automate from $199/mo; Enterprise custom',
      features: ['Real device cloud', 'Live interactive testing', 'Selenium/Playwright/Cypress support', 'App testing (iOS/Android)', 'Visual testing', 'Accessibility testing', 'Local testing tunnel', 'Screenshots API'],
      integrations: ['Selenium', 'Playwright', 'Cypress', 'Appium', 'Jest', 'Mocha', 'GitHub Actions', 'Jenkins', 'CircleCI', 'Jira', 'Slack'],
      bestFor: ['cross-browser testing', 'real device mobile testing', 'QA teams needing device coverage', 'accessibility compliance', 'enterprise testing'],
      worstFor: ['simple unit testing', 'teams testing only on Chrome', 'very budget-constrained teams', 'developers wanting local-only testing'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'impact',
        affiliateLink: 'https://www.browserstack.com/partners',
        payoutType: 'per-sale',
        payoutAmount: 50,
        payoutCurrency: 'USD',
        cookieDays: 30,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'LambdaTest',
      category: 'testing',
      description:
        'AI-powered test execution platform for cross-browser and cross-device testing. Offers real device cloud, Selenium/Playwright/Cypress execution, and AI-based test intelligence.',
      pricing: 'Free (limited); Live from $15/mo; Web Automation from $79/mo; Real Device from $99/mo; Enterprise custom',
      features: ['Real device cloud', 'Selenium Grid', 'Playwright/Cypress support', 'AI test intelligence', 'Smart visual testing', 'Geolocation testing', 'HyperExecute (fast grid)', 'Network simulation'],
      integrations: ['Selenium', 'Playwright', 'Cypress', 'Appium', 'GitHub Actions', 'Jenkins', 'CircleCI', 'Jira', 'Slack', 'TestRail', 'Azure DevOps'],
      bestFor: ['cross-browser testing on a budget', 'parallel test execution', 'mobile app testing', 'teams migrating from BrowserStack', 'AI-assisted testing'],
      worstFor: ['teams needing only local testing', 'non-web app testing', 'very small projects', 'teams not using automation frameworks'],
      trustScore: 0.79,
      active: true,
    },
    programs: [
      {
        network: 'impact',
        affiliateLink: 'https://www.lambdatest.com/partners',
        payoutType: 'recurring',
        payoutAmount: 25,
        payoutCurrency: 'USD',
        cookieDays: 60,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Percy',
      category: 'testing',
      description:
        'Visual testing and review platform by BrowserStack. Captures screenshots of UI changes, highlights visual diffs, and integrates into CI/CD for automated visual regression testing.',
      pricing: 'Free up to 5K screenshots/mo; Team $399/mo (25K screenshots); Enterprise custom',
      features: ['Visual diff detection', 'Responsive visual testing', 'CI/CD integration', 'Approval workflows', 'Cross-browser screenshots', 'Storybook integration', 'SDK support', 'Baseline management'],
      integrations: ['Cypress', 'Playwright', 'Selenium', 'Storybook', 'Puppeteer', 'GitHub', 'GitLab', 'Bitbucket', 'Jenkins', 'CircleCI'],
      bestFor: ['visual regression testing', 'design-system validation', 'UI-heavy applications', 'teams with frequent CSS changes', 'Storybook users'],
      worstFor: ['non-visual testing needs', 'teams with very stable UIs', 'budget-constrained teams', 'backend-only projects'],
      trustScore: 0.81,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://percy.io',
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
      name: 'Chromatic',
      category: 'testing',
      description:
        'Visual testing platform built specifically for Storybook. Automates visual and interaction testing for UI components, catches UI bugs, and provides a review workflow for design changes.',
      pricing: 'Free 5K snapshots/mo; Starter $149/mo (35K snapshots); Pro $349/mo; Enterprise custom',
      features: ['Visual regression testing', 'Storybook hosting', 'Interaction testing', 'UI review workflows', 'TurboSnap (smart snapshots)', 'Accessibility checks', 'Figma plugin', 'Git provider integration'],
      integrations: ['Storybook', 'GitHub', 'GitLab', 'Bitbucket', 'Figma', 'Jira', 'Slack', 'CircleCI', 'Jenkins', 'Vercel'],
      bestFor: ['Storybook users', 'component library teams', 'design system maintenance', 'visual QA workflows', 'frontend teams'],
      worstFor: ['non-Storybook projects', 'E2E/integration testing', 'teams not using component-driven development', 'backend-only projects'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://chromatic.com',
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
      name: 'Checkly',
      category: 'testing',
      description:
        'Monitoring-as-code platform for API and browser checks. Write checks in JavaScript/TypeScript with Playwright, run from global locations, and integrate into CI/CD. Proactive synthetic monitoring.',
      pricing: 'Free 50K API checks/mo; Team from $30/mo; Enterprise custom',
      features: ['API monitoring', 'Browser checks (Playwright)', 'Monitoring-as-code (CLI)', 'Global check locations', 'Alerting (Slack, PagerDuty, etc.)', 'Dashboards', 'CI/CD integration', 'Private locations'],
      integrations: ['Playwright', 'GitHub Actions', 'Terraform', 'Vercel', 'PagerDuty', 'Slack', 'OpsGenie', 'Datadog', 'Prometheus', 'Grafana'],
      bestFor: ['synthetic monitoring', 'monitoring-as-code workflows', 'API health checks', 'Playwright-based monitoring', 'DevOps teams'],
      worstFor: ['real user monitoring', 'non-web services', 'teams wanting GUI-only setup', 'very simple uptime checks only'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://checklyhq.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ─── CI/CD ────────────────────────────────────────────────────────────

  {
    product: {
      name: 'GitHub Actions',
      category: 'ci-cd',
      description:
        'CI/CD platform built into GitHub. Automate build, test, and deployment workflows with YAML. Massive marketplace of community actions. Free for public repos, generous free minutes for private.',
      pricing: 'Free 2K min/mo (private repos); Team $4/user/mo (3K min); Enterprise $21/user/mo (50K min); pay-as-you-go $0.008/min (Linux)',
      features: ['YAML workflow definitions', 'Matrix builds', 'Reusable workflows', 'Marketplace (20K+ actions)', 'Self-hosted runners', 'Environments and approvals', 'Caching', 'Artifacts', 'OIDC for cloud auth'],
      integrations: ['GitHub', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Vercel', 'Netlify', 'Slack', 'npm', 'PyPI'],
      bestFor: ['GitHub-hosted projects', 'open-source CI/CD', 'teams wanting native GitHub integration', 'community action ecosystem', 'simple to complex pipelines'],
      worstFor: ['GitLab/Bitbucket repos', 'teams needing advanced pipeline visualization', 'very long-running builds on free tier', 'teams wanting non-YAML config'],
      trustScore: 0.92,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/features/actions',
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
      name: 'Dagger',
      category: 'ci-cd',
      description:
        'Programmable CI/CD engine that runs pipelines in containers. Write pipelines in TypeScript, Python, or Go instead of YAML. Runs locally, on any CI, or in Dagger Cloud. Portable across CI providers.',
      pricing: 'Free (open source); Dagger Cloud: Developer free; Team $10/user/mo; Enterprise custom',
      features: ['Code-based pipelines (TS/Python/Go)', 'Container-native execution', 'Local pipeline execution', 'Caching', 'Dagger Cloud (visualization)', 'Cross-CI portability', 'Module system', 'GraphQL API'],
      integrations: ['GitHub Actions', 'GitLab CI', 'CircleCI', 'Jenkins', 'Docker', 'Kubernetes', 'TypeScript', 'Python', 'Go', 'Terraform'],
      bestFor: ['teams tired of YAML CI configs', 'CI-agnostic pipelines', 'local CI debugging', 'complex build logic', 'polyglot teams'],
      worstFor: ['simple CI needs', 'non-container workflows', 'teams preferring YAML', 'very basic build-test-deploy pipelines'],
      trustScore: 0.79,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://dagger.io',
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
      name: 'Earthly',
      category: 'ci-cd',
      description:
        'Build automation tool combining Dockerfiles and Makefiles. Earthfiles define reproducible builds that run identically on local machines and CI. Earthly Cloud adds shared caching and satellite runners.',
      pricing: 'Free (open source); Earthly Cloud: Free tier; Team $50/mo; Enterprise custom',
      features: ['Earthfile syntax', 'Reproducible builds', 'Built-in caching', 'Parallelism', 'Multi-platform builds', 'Earthly Cloud (shared cache)', 'Satellite runners', 'Monorepo support'],
      integrations: ['GitHub Actions', 'GitLab CI', 'CircleCI', 'Jenkins', 'Docker', 'Kubernetes', 'Buildkite', 'AWS', 'GCP'],
      bestFor: ['reproducible CI builds', 'Dockerfile + Makefile unification', 'monorepo builds', 'local-CI parity', 'teams wanting build caching'],
      worstFor: ['non-container workflows', 'simple single-language projects', 'teams preferring native CI YAML', 'Windows-only build environments'],
      trustScore: 0.77,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://earthly.dev',
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
      name: 'Depot',
      category: 'ci-cd',
      description:
        'Accelerated container build service. Drops into existing Docker workflows and provides instant shared caching, native multi-platform builds (Intel + Arm), and 10-40x faster builds. No self-managed BuildKit infrastructure needed.',
      pricing: 'Free trial; Starter $15/mo (100 build-min); Growth from $30/mo; Enterprise custom',
      features: ['Instant shared cache', 'Multi-platform builds (amd64/arm64)', 'Docker build compatibility', 'GitHub Actions integration', 'Build analytics', 'Org-wide cache sharing', 'No self-hosted builders needed'],
      integrations: ['Docker', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Buildkite', 'Fly.io', 'Railway', 'Google Cloud Build'],
      bestFor: ['faster Docker builds in CI', 'multi-arch container images', 'teams with slow Docker builds', 'shared build caching', 'Arm + Intel builds'],
      worstFor: ['non-Docker build systems', 'teams with very few builds', 'air-gapped environments', 'teams already with fast local builds'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://depot.dev',
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
      name: 'CircleCI',
      category: 'ci-cd',
      description:
        'Cloud CI/CD platform supporting any language and any platform. Offers Docker layer caching, parallel test splitting, orbs (reusable config), and extensive runner options.',
      pricing: 'Free 6K credits/mo; Performance from $15/mo; Scale custom; self-hosted runners available',
      features: ['Docker layer caching', 'Parallelism and test splitting', 'Orbs (reusable config)', 'Self-hosted runners', 'Insights dashboard', 'Config policies (governance)', 'macOS/Linux/Windows/Arm', 'SSH debugging'],
      integrations: ['GitHub', 'GitLab', 'Bitbucket', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'Slack', 'Jira', 'Datadog'],
      bestFor: ['complex CI pipelines', 'Docker-heavy builds', 'multi-platform builds', 'parallel test execution', 'enterprise CI governance'],
      worstFor: ['very simple projects', 'budget-constrained teams', 'teams wanting native Git provider CI', 'Windows-heavy build environments'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://circleci.com',
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
      name: 'Buildkite',
      category: 'ci-cd',
      description:
        'Hybrid CI/CD platform where you run your own agents and Buildkite handles orchestration. Unlimited concurrency on self-hosted runners, pipeline visualization, and plugin system.',
      pricing: 'Free up to 2 agents; Standard $15/user/mo; Enterprise custom; usage-based pricing available',
      features: ['Self-hosted agents', 'Pipeline visualization', 'Plugins', 'Dynamic pipelines', 'Parallel steps', 'Artifact management', 'Test Analytics', 'Package Registries', 'Cluster management'],
      integrations: ['GitHub', 'GitLab', 'Bitbucket', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Terraform', 'Slack', 'PagerDuty', 'Datadog'],
      bestFor: ['teams wanting CI control', 'self-hosted runner needs', 'large-scale builds', 'monorepo CI', 'companies needing data locality'],
      worstFor: ['small teams wanting managed CI', 'teams wanting zero infrastructure', 'simple hobby projects', 'beginners wanting easy setup'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://buildkite.com',
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
      name: 'Semaphore',
      category: 'ci-cd',
      description:
        'Cloud CI/CD platform focused on speed. Provides fast machine provisioning, auto-parallelism, and a visual workflow editor. Supports Docker, iOS, Android, and monorepo builds.',
      pricing: 'Free 1,300 min/mo; Startup $10/mo; Scale custom; pay-per-use available',
      features: ['Visual workflow editor', 'Auto-parallelism', 'Fast machine provisioning', 'Docker support', 'iOS/Android builds', 'Parameterized promotions', 'Test reports', 'Audit logs', 'Self-hosted agents'],
      integrations: ['GitHub', 'Bitbucket', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Heroku', 'Slack', 'Jira', 'npm', 'RubyGems'],
      bestFor: ['speed-focused CI/CD', 'Ruby/Rails projects', 'mobile app CI', 'visual pipeline design', 'monorepo projects'],
      worstFor: ['GitLab-hosted repos', 'teams needing very large runner fleets', 'complex Windows builds', 'teams wanting CI marketplace actions'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://semaphoreci.com',
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
      name: 'Nx Cloud',
      category: 'ci-cd',
      description:
        'Remote caching and distributed task execution for Nx monorepos. Speeds up CI by sharing computation cache across machines and distributing tasks across agents. Essential for large monorepos.',
      pricing: 'Free up to 500 CI pipeline hours/mo; Pro $6/contributor/mo; Enterprise custom',
      features: ['Remote caching', 'Distributed task execution', 'Atomizer (test splitting)', 'Nx Replay (cache)', 'Nx Agents (distribution)', 'Flaky test detection', 'Run details UI', 'GitHub PR integration'],
      integrations: ['Nx', 'GitHub Actions', 'CircleCI', 'Jenkins', 'GitLab CI', 'Azure DevOps', 'Bitbucket Pipelines', 'React', 'Angular', 'Node.js'],
      bestFor: ['Nx monorepos', 'large frontend monorepos', 'teams wanting faster CI', 'shared build caching', 'distributed builds'],
      worstFor: ['non-Nx projects', 'single-app repos', 'very small codebases', 'teams not using monorepo architecture'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://nx.dev/nx-cloud',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ─── MONITORING & OBSERVABILITY ───────────────────────────────────────

  {
    product: {
      name: 'Grafana Cloud',
      category: 'monitoring',
      description:
        'Fully managed observability platform by Grafana Labs. Combines Grafana dashboards with managed Prometheus (metrics), Loki (logs), and Tempo (traces). Generous free tier with 10K metrics, 50GB logs, and 50GB traces.',
      pricing: 'Free tier (generous); Pro $29/mo + usage; Advanced custom; Enterprise custom',
      features: ['Managed Prometheus', 'Managed Loki (logs)', 'Managed Tempo (traces)', 'Grafana dashboards', 'Alerting', 'OnCall', 'k6 Cloud (testing)', 'Synthetics', 'Incident management'],
      integrations: ['Prometheus', 'OpenTelemetry', 'AWS CloudWatch', 'Datadog', 'Kubernetes', 'Docker', 'Terraform', 'PagerDuty', 'Slack', 'GitHub', 'Jenkins'],
      bestFor: ['open-source observability stack', 'Prometheus/Loki users', 'cost-effective monitoring', 'teams wanting managed Grafana', 'multi-source dashboards'],
      worstFor: ['teams wanting single-vendor simplicity', 'non-technical operations teams', 'very simple uptime-only monitoring', 'teams needing built-in RUM'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://grafana.com/cloud',
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
      name: 'Axiom',
      category: 'monitoring',
      description:
        'Cloud-native log management and observability platform. Ingest unlimited data with no indexing overhead, query with APL (Axiom Processing Language), and visualize with dashboards. Competitive pricing for high-volume logging.',
      pricing: 'Free 500GB ingest/mo (personal); Team $25/mo + $2/GB; Enterprise custom',
      features: ['Unlimited data ingestion', 'APL query language', 'Dashboards', 'Alerting', 'OpenTelemetry support', 'Log streaming', 'Annotations', 'Flow (data routing)', 'API'],
      integrations: ['OpenTelemetry', 'Vercel', 'Next.js', 'Cloudflare', 'AWS', 'Kubernetes', 'Docker', 'Grafana', 'Terraform', 'Pino', 'Winston'],
      bestFor: ['high-volume log ingestion', 'cost-effective observability', 'Vercel/serverless logging', 'teams wanting unlimited ingest', 'developer-friendly logging'],
      worstFor: ['APM (application performance monitoring)', 'teams wanting traditional log indexing', 'non-cloud environments', 'teams needing extensive built-in dashboards'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://axiom.co',
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
      name: 'Highlight.io',
      category: 'monitoring',
      description:
        'Open-source full-stack monitoring platform combining session replay, error monitoring, logging, and traces. Self-hosted or cloud. Privacy-focused with data masking built in.',
      pricing: 'Free up to 500 sessions + 1M logs/mo; Essentials from $150/mo; Business custom',
      features: ['Session replay', 'Error monitoring', 'Logging', 'Traces', 'AI error grouping', 'Privacy masking', 'Alerting', 'Team collaboration', 'Open source'],
      integrations: ['React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Python', 'Go', 'Ruby', 'Vercel', 'Slack', 'Linear', 'Discord'],
      bestFor: ['full-stack monitoring in one tool', 'session replay with errors', 'open-source preference', 'privacy-conscious teams', 'small-medium teams'],
      worstFor: ['enterprise-scale monitoring', 'infrastructure monitoring', 'teams needing mature APM', 'very high session volumes'],
      trustScore: 0.77,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://highlight.io',
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
      name: 'LogRocket',
      category: 'monitoring',
      description:
        'Frontend monitoring platform combining session replay, error tracking, and product analytics. Helps debug frontend issues by replaying exactly what users experienced, including network requests and console logs.',
      pricing: 'Free 1K sessions/mo; Team from $99/mo; Professional from $295/mo; Enterprise custom',
      features: ['Session replay', 'Error tracking', 'Performance monitoring', 'Product analytics', 'Rage click detection', 'Network request inspection', 'Console log capture', 'User identification', 'Funnel analysis'],
      integrations: ['React', 'Angular', 'Vue', 'Redux', 'Sentry', 'Segment', 'Jira', 'Slack', 'GitHub', 'Linear', 'Intercom'],
      bestFor: ['frontend debugging', 'understanding user behavior', 'reproducing bug reports', 'SPA monitoring', 'product analytics + monitoring combined'],
      worstFor: ['backend monitoring', 'infrastructure observability', 'high-traffic sites on a budget', 'teams not needing session replay'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://logrocket.com',
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
      name: 'FullStory',
      category: 'monitoring',
      description:
        'Digital experience intelligence platform with session replay, heatmaps, and analytics. Auto-captures all user interactions without manual instrumentation. AI-powered insights and frustration signals.',
      pricing: 'Free trial; Business custom (based on sessions); Enterprise custom; Advanced custom',
      features: ['Session replay', 'Heatmaps', 'Click maps', 'Frustration signals', 'Funnels', 'Journeys', 'Searchable sessions', 'Auto-capture (tagless)', 'Privacy controls', 'AI insights'],
      integrations: ['Segment', 'Google Analytics', 'Salesforce', 'Slack', 'Jira', 'Intercom', 'Zendesk', 'HubSpot', 'Datadog', 'BigQuery'],
      bestFor: ['understanding user experience', 'UX research', 'product-led growth', 'e-commerce optimization', 'enterprise digital experience'],
      worstFor: ['developer error monitoring', 'infrastructure monitoring', 'very budget-constrained teams', 'simple analytics needs'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://fullstory.com',
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
      name: 'New Relic',
      category: 'monitoring',
      description:
        'Full-stack observability platform with APM, infrastructure monitoring, logs, browser monitoring, synthetic monitoring, and AI ops. Free tier includes 100GB/month of data ingest and 1 full-platform user.',
      pricing: 'Free 100GB ingest/mo + 1 user; Standard $0.30/GB; Pro $0.50/GB; Enterprise custom',
      features: ['APM', 'Infrastructure monitoring', 'Log management', 'Browser monitoring', 'Synthetic monitoring', 'Distributed tracing', 'AI ops', 'Dashboards', 'Alerting', 'Service maps'],
      integrations: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'GitHub', 'PagerDuty', 'Slack', 'Jira', 'OpenTelemetry'],
      bestFor: ['full-stack observability', 'APM needs', 'generous free tier for startups', 'enterprise monitoring', 'teams wanting all-in-one platform'],
      worstFor: ['simple uptime monitoring only', 'teams wanting self-hosted', 'cost optimization at very high scale', 'open-source purists'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'impact',
        affiliateLink: 'https://newrelic.com/partners',
        payoutType: 'per-sale',
        payoutAmount: 100,
        payoutCurrency: 'USD',
        cookieDays: 30,
        approved: false,
      },
    ],
  },
  {
    product: {
      name: 'Honeycomb',
      category: 'monitoring',
      description:
        'Observability platform built for debugging complex distributed systems. Pioneered the "observability" movement with high-cardinality, high-dimensionality data exploration. Query-driven approach to understanding production behavior.',
      pricing: 'Free up to 20M events/mo; Pro from $130/mo; Enterprise custom',
      features: ['High-cardinality querying', 'BubbleUp (anomaly detection)', 'Distributed tracing', 'SLOs', 'Triggers (alerts)', 'Query builder', 'Board (dashboards)', 'Collaboration', 'OpenTelemetry-native'],
      integrations: ['OpenTelemetry', 'AWS', 'Kubernetes', 'Docker', 'Terraform', 'GitHub Actions', 'PagerDuty', 'Slack', 'Node.js', 'Go', 'Python', 'Java'],
      bestFor: ['debugging distributed systems', 'microservices observability', 'high-cardinality data exploration', 'SRE teams', 'OpenTelemetry adopters'],
      worstFor: ['simple log search', 'teams wanting traditional APM dashboards', 'budget-constrained small teams', 'teams not using distributed systems'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://honeycomb.io',
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
      name: 'PagerDuty',
      category: 'incident-management',
      description:
        'Digital operations management platform for incident response, on-call management, and event intelligence. Routes alerts from monitoring tools, manages escalations, and coordinates incident response.',
      pricing: 'Free up to 5 users; Professional $21/user/mo; Business $41/user/mo; Enterprise custom',
      features: ['Incident response', 'On-call scheduling', 'Escalation policies', 'Event intelligence (AI)', 'Status pages', 'Automation actions', 'Stakeholder communications', 'Postmortems', 'Analytics'],
      integrations: ['Datadog', 'New Relic', 'Sentry', 'AWS CloudWatch', 'Grafana', 'Slack', 'Jira', 'ServiceNow', 'Zendesk', 'GitHub', 'Terraform', 'Splunk'],
      bestFor: ['on-call management', 'incident response coordination', 'alert routing and deduplication', 'enterprise operations', 'SRE teams'],
      worstFor: ['small teams without on-call', 'monitoring (it routes alerts, not creates them)', 'budget-constrained startups', 'teams with simple alerting needs'],
      trustScore: 0.89,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://pagerduty.com',
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
      name: 'OpsGenie',
      category: 'incident-management',
      description:
        'Incident management and alerting platform by Atlassian. Provides on-call scheduling, alert routing, escalations, and integrations with 200+ tools. Tightly integrated with Jira and Atlassian ecosystem.',
      pricing: 'Free up to 5 users; Essentials $9.45/user/mo; Standard $19.95/user/mo; Enterprise $34.95/user/mo',
      features: ['On-call scheduling', 'Alert routing', 'Escalation policies', 'Heartbeat monitoring', 'Incident timeline', 'Stakeholder notifications', 'ChatOps', 'Automation rules', 'Post-incident reports'],
      integrations: ['Jira', 'Confluence', 'Statuspage', 'Datadog', 'Sentry', 'New Relic', 'AWS CloudWatch', 'Slack', 'Microsoft Teams', 'Grafana', 'Prometheus'],
      bestFor: ['Atlassian ecosystem users', 'on-call management', 'alert consolidation', 'teams using Jira', 'budget-friendly incident management'],
      worstFor: ['teams not using Atlassian', 'very small teams', 'advanced AI-driven operations', 'teams wanting self-hosted incident management'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://www.atlassian.com/software/opsgenie',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
];
