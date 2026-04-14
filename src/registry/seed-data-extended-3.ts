import type { Product, AffiliateProgram } from '../types/product.js';

type SeedProduct = {
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
  programs: Omit<AffiliateProgram, 'id' | 'productId'>[];
};

export const EXTENDED_PRODUCTS_3: SeedProduct[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // MCP SERVERS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Context7 MCP',
      category: 'mcp-server',
      description:
        'MCP server that provides up-to-date, version-specific documentation and code examples pulled directly from source repos. Eliminates hallucinated APIs by grounding LLM responses in real documentation rather than stale training data.',
      pricing: 'Free / Open source',
      features: ['resolve-library-id', 'get-library-docs', 'version-specific documentation', 'code examples extraction', 'automatic library resolution'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'VS Code Copilot', 'Cline', 'any MCP-compatible client'],
      bestFor: ['eliminating hallucinated APIs', 'working with latest library versions', 'accurate code generation', 'documentation lookup during coding'],
      worstFor: ['offline development', 'obscure libraries not yet indexed', 'non-code documentation needs'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/upstash/context7',
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
      name: 'Playwright MCP',
      category: 'mcp-server',
      description:
        'Official Playwright MCP server enabling LLMs to interact with web pages through structured accessibility snapshots rather than screenshots. Provides browser automation capabilities including navigation, form filling, clicking, and JavaScript evaluation without needing vision models.',
      pricing: 'Free / Open source',
      features: ['browser_navigate', 'browser_click', 'browser_fill_form', 'browser_snapshot', 'browser_take_screenshot', 'browser_press_key', 'browser_evaluate', 'browser_file_upload', 'browser_tabs', 'browser_console_messages', 'browser_network_requests'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'VS Code Copilot', 'Cline', 'any MCP-compatible client'],
      bestFor: ['browser automation from AI agents', 'web testing', 'form filling workflows', 'scraping structured data', 'e2e test generation'],
      worstFor: ['headless-only server environments without display', 'simple API calls that do not need a browser', 'high-volume scraping at scale'],
      trustScore: 0.93,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/microsoft/playwright-mcp',
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
      name: 'GitHub MCP Server',
      category: 'mcp-server',
      description:
        'Official GitHub MCP server providing tools for repository management, file operations, issue tracking, pull requests, branching, and search. Enables AI agents to interact with GitHub repositories programmatically through the MCP protocol.',
      pricing: 'Free / Open source',
      features: ['create_or_update_file', 'push_files', 'search_repositories', 'create_issue', 'create_pull_request', 'list_commits', 'create_branch', 'fork_repository', 'search_code', 'get_file_contents', 'list_issues', 'update_issue'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'VS Code Copilot', 'Cline'],
      bestFor: ['automated PR creation', 'repo management from AI agents', 'issue triage automation', 'code search across repos', 'multi-repo workflows'],
      worstFor: ['GitHub Enterprise with strict network policies', 'non-GitHub platforms like GitLab or Bitbucket', 'very large file operations'],
      trustScore: 0.92,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
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
      name: 'Filesystem MCP Server',
      category: 'mcp-server',
      description:
        'Reference MCP server for secure local file system operations. Provides tools for reading, writing, moving, and searching files with configurable access controls to restrict operations to allowed directories only.',
      pricing: 'Free / Open source',
      features: ['read_file', 'write_file', 'edit_file', 'list_directory', 'move_file', 'search_files', 'get_file_info', 'create_directory', 'directory_tree', 'list_allowed_directories'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'VS Code Copilot', 'Cline', 'any MCP-compatible client'],
      bestFor: ['local file management from AI agents', 'code generation with file writes', 'directory organization', 'sandboxed file access'],
      worstFor: ['remote file systems', 'cloud storage operations', 'very large file processing'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
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
      name: 'PostgreSQL MCP Server',
      category: 'mcp-server',
      description:
        'MCP server providing read-only access to PostgreSQL databases. Allows AI agents to inspect schemas, run SELECT queries, and explore database structure for analysis and code generation without risk of data modification.',
      pricing: 'Free / Open source',
      features: ['query (read-only SQL)', 'list_tables', 'describe_table', 'schema inspection', 'parameterized queries', 'connection pooling'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['database exploration', 'generating queries from natural language', 'schema documentation', 'data analysis with AI', 'safe read-only access'],
      worstFor: ['write operations', 'database administration', 'migrations', 'high-frequency query workloads'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
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
      name: 'SQLite MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for interacting with local SQLite databases. Provides tools for creating tables, running queries, analyzing data, and managing business intelligence insights. Ideal for lightweight local database workflows.',
      pricing: 'Free / Open source',
      features: ['read_query', 'write_query', 'create_table', 'list_tables', 'describe_table', 'append_insight', 'memo resource for BI insights'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['local development databases', 'prototyping data models', 'lightweight data analysis', 'embedded database workflows'],
      worstFor: ['production multi-user databases', 'concurrent write workloads', 'remote database access'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite',
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
      name: 'Puppeteer MCP Server',
      category: 'mcp-server',
      description:
        'MCP server that provides browser automation via Puppeteer. Enables AI agents to navigate pages, take screenshots, click elements, fill forms, and execute JavaScript in a headless Chrome or Chromium browser.',
      pricing: 'Free / Open source',
      features: ['puppeteer_navigate', 'puppeteer_screenshot', 'puppeteer_click', 'puppeteer_fill', 'puppeteer_select', 'puppeteer_hover', 'puppeteer_evaluate'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['screenshot-based browser automation', 'headless browser testing', 'web scraping', 'PDF generation', 'visual regression testing'],
      worstFor: ['accessibility-first workflows (Playwright MCP is better)', 'non-Chromium browsers', 'lightweight HTTP-only tasks'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer',
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
      name: 'Brave Search MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for web and local search using the Brave Search API. Provides both general web search and local business search capabilities, enabling AI agents to find current information from the web.',
      pricing: 'Free tier (2,000 queries/mo); Brave Search API paid plans available',
      features: ['brave_web_search', 'brave_local_search', 'pagination support', 'content filtering', 'freshness controls'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['real-time web search from AI agents', 'local business lookups', 'fact-checking', 'research tasks', 'privacy-focused search'],
      worstFor: ['image or video search', 'deep academic research', 'non-English local results'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search',
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
      name: 'Google Maps MCP Server',
      category: 'mcp-server',
      description:
        'MCP server providing access to Google Maps Platform APIs. Enables AI agents to geocode addresses, search for places, get directions, calculate distances, and retrieve elevation data.',
      pricing: 'Free / Open source (requires Google Maps API key with billing)',
      features: ['maps_geocode', 'maps_reverse_geocode', 'maps_search_places', 'maps_place_details', 'maps_directions', 'maps_distance_matrix', 'maps_elevation'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['location-based applications', 'geocoding workflows', 'route planning', 'place discovery', 'distance calculations'],
      worstFor: ['offline mapping', 'free-tier-only projects (Google Maps charges)', 'privacy-sensitive location work'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps',
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
      name: 'Slack MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Slack workspace interaction. Allows AI agents to list channels, read message history, post messages, reply to threads, and manage reactions in Slack workspaces via the Slack Web API.',
      pricing: 'Free / Open source (requires Slack Bot token)',
      features: ['slack_list_channels', 'slack_post_message', 'slack_reply_to_thread', 'slack_get_channel_history', 'slack_get_thread_replies', 'slack_add_reaction', 'slack_search_messages', 'slack_get_users'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['automated Slack notifications', 'team communication from AI workflows', 'message search and analysis', 'chatbot integrations'],
      worstFor: ['Slack Enterprise Grid with strict compliance', 'real-time streaming (uses polling)', 'non-Slack messaging platforms'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
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
      name: 'Sequential Thinking MCP',
      category: 'mcp-server',
      description:
        'MCP server that provides a structured tool for dynamic, reflective problem-solving. Enables AI agents to break down complex problems into sequential thought steps with the ability to revise, branch, and adjust the total number of steps as understanding deepens.',
      pricing: 'Free / Open source',
      features: ['sequentialthinking tool', 'dynamic step adjustment', 'thought revision', 'branching support', 'hypothesis generation', 'verification steps', 'solution synthesis'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['complex multi-step reasoning', 'math and logic problems', 'planning and analysis', 'structured problem decomposition'],
      worstFor: ['simple direct-answer queries', 'latency-sensitive applications', 'tasks not requiring chain-of-thought'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking',
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
      name: 'Memory MCP Server',
      category: 'mcp-server',
      description:
        'MCP server that provides persistent memory through a knowledge graph. Stores entities, their observations, and relations between them in a local JSON file, enabling AI agents to remember context across sessions.',
      pricing: 'Free / Open source',
      features: ['create_entities', 'create_relations', 'add_observations', 'delete_entities', 'delete_relations', 'search_nodes', 'open_nodes', 'read_graph'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['persistent context across AI sessions', 'knowledge graph building', 'user preference memory', 'project context tracking'],
      worstFor: ['large-scale knowledge bases', 'multi-user concurrent access', 'structured relational data'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory',
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
      name: 'Exa MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for the Exa AI-powered search API. Provides neural search capabilities that understand meaning rather than just keywords, returning clean extracted content from web pages along with traditional keyword search.',
      pricing: 'Free / Open source (requires Exa API key; Exa has free tier)',
      features: ['web_search (neural + keyword)', 'research_paper_search', 'company_search', 'news_search', 'content extraction', 'similarity search', 'auto_search'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['semantic web search', 'research and content aggregation', 'finding similar content', 'clean text extraction from URLs'],
      worstFor: ['local search', 'real-time news (slight indexing delay)', 'image search'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/exa-labs/exa-mcp-server',
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
      name: 'Firecrawl MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for the Firecrawl web scraping API. Extracts clean, structured content from any website with support for JavaScript rendering, crawling entire sites, and converting web pages to LLM-ready markdown.',
      pricing: 'Free / Open source (requires Firecrawl API key; free tier available)',
      features: ['firecrawl_scrape', 'firecrawl_crawl', 'firecrawl_map', 'firecrawl_extract', 'JavaScript rendering', 'markdown conversion', 'structured data extraction'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['web scraping with JS rendering', 'converting websites to markdown', 'crawling entire sites', 'structured data extraction'],
      worstFor: ['sites behind authentication', 'real-time streaming content', 'very large-scale crawling (rate limits)'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/mendableai/firecrawl-mcp-server',
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
      name: 'Browserbase MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Browserbase, a cloud browser infrastructure platform. Provides headless browser sessions in the cloud with built-in stealth capabilities, session recording, and proxy support for reliable web automation.',
      pricing: 'Free / Open source (requires Browserbase account; free tier available)',
      features: ['browserbase_create_session', 'browserbase_navigate', 'browserbase_screenshot', 'browserbase_click', 'browserbase_fill', 'browserbase_evaluate', 'session recording', 'stealth mode', 'proxy support'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'Stagehand', 'Playwright'],
      bestFor: ['cloud browser automation', 'avoiding bot detection', 'session recording for debugging', 'scalable browser tasks'],
      worstFor: ['local-only development', 'simple static page scraping', 'budget-constrained projects'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/browserbase/mcp-server-browserbase',
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
      name: 'Neon MCP Server',
      category: 'mcp-server',
      description:
        'Official MCP server from Neon for managing serverless Postgres databases. Provides tools for creating projects, managing branches, running SQL queries, and performing database migrations through AI agents.',
      pricing: 'Free / Open source (requires Neon account)',
      features: ['create_project', 'create_branch', 'run_sql', 'run_sql_transaction', 'list_projects', 'describe_table_schema', 'get_connection_string', 'provision_neon_auth', 'database migrations'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['serverless Postgres management', 'database branching from AI', 'rapid prototyping with databases', 'migration workflows'],
      worstFor: ['non-Neon Postgres instances', 'MySQL or other database types', 'offline development'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/neondatabase/mcp-server-neon',
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
      name: 'Supabase MCP Server',
      category: 'mcp-server',
      description:
        'Official MCP server from Supabase for managing Supabase projects. Provides tools for database operations, managing tables, executing SQL, handling storage, and interacting with Supabase Edge Functions.',
      pricing: 'Free / Open source (requires Supabase account)',
      features: ['list_tables', 'execute_sql', 'apply_migration', 'list_extensions', 'list_projects', 'get_project_url', 'create_project', 'get_logs', 'list_edge_functions', 'deploy_edge_function', 'list_storage_buckets'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['Supabase project management from AI', 'database migrations', 'rapid prototyping', 'edge function deployment'],
      worstFor: ['non-Supabase projects', 'fine-grained RLS policy management', 'complex multi-project orchestration'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/supabase-community/supabase-mcp',
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
      name: 'Cloudflare MCP Server',
      category: 'mcp-server',
      description:
        'Official MCP server from Cloudflare for managing Workers, KV, R2, D1, and other Cloudflare services. Enables AI agents to deploy and manage Cloudflare infrastructure directly from coding environments.',
      pricing: 'Free / Open source (requires Cloudflare account)',
      features: ['worker_create', 'worker_deploy', 'kv_get', 'kv_put', 'kv_list', 'r2_get', 'r2_put', 'd1_query', 'd1_list_databases', 'manage_dns_records'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['Cloudflare Workers deployment', 'KV and R2 management', 'D1 database operations', 'edge infrastructure management'],
      worstFor: ['non-Cloudflare infrastructure', 'complex multi-cloud setups', 'AWS or GCP specific services'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/cloudflare/mcp-server-cloudflare',
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
      name: 'Sentry MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Sentry error tracking. Allows AI agents to search and analyze error reports, view issue details, list projects, and access event data to help debug production issues directly from the coding environment.',
      pricing: 'Free / Open source (requires Sentry account and auth token)',
      features: ['search_issues', 'get_issue_details', 'list_projects', 'get_event_details', 'list_issue_events', 'resolve_issue', 'assign_issue'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['debugging production errors from AI', 'issue triage automation', 'error analysis and resolution', 'incident response workflows'],
      worstFor: ['non-Sentry error tracking systems', 'log analysis (not error-specific)', 'performance monitoring'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/getsentry/sentry-mcp',
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
      name: 'Linear MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for the Linear project management tool. Enables AI agents to create, search, and update issues, manage projects, and interact with Linear teams and cycles programmatically.',
      pricing: 'Free / Open source (requires Linear API key)',
      features: ['linear_create_issue', 'linear_search_issues', 'linear_update_issue', 'linear_get_teams', 'linear_get_cycles', 'linear_get_projects', 'linear_add_comment'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['automated issue creation from code context', 'project management integration', 'sprint planning with AI', 'bug report automation'],
      worstFor: ['non-Linear project management', 'Jira or Asana workflows', 'teams not using Linear'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/jerhadf/linear-mcp-server',
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
      name: 'Notion MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Notion workspace interaction. Provides tools for searching pages, reading content, creating and updating pages, and managing databases within Notion from AI coding environments.',
      pricing: 'Free / Open source (requires Notion integration token)',
      features: ['notion_search', 'notion_get_page', 'notion_create_page', 'notion_update_page', 'notion_query_database', 'notion_create_database', 'notion_append_blocks', 'notion_get_block_children'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['documentation management from AI', 'knowledge base queries', 'automated page creation', 'Notion database management'],
      worstFor: ['non-Notion documentation systems', 'real-time collaborative editing', 'large file attachments'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/makenotion/notion-mcp-server',
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
      name: 'Docker MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Docker container management. Enables AI agents to list, create, start, stop, and inspect containers, manage images, and interact with Docker Compose stacks directly from coding environments.',
      pricing: 'Free / Open source',
      features: ['docker_list_containers', 'docker_create_container', 'docker_start_container', 'docker_stop_container', 'docker_logs', 'docker_list_images', 'docker_build_image', 'docker_compose_up', 'docker_compose_down'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['container management from AI', 'dev environment orchestration', 'Docker Compose workflows', 'container debugging'],
      worstFor: ['production container orchestration (use Kubernetes)', 'non-Docker container runtimes', 'complex swarm configurations'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/docker/docker-mcp',
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
      name: 'Kubernetes MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Kubernetes cluster management. Provides tools for listing pods, services, and deployments, reading logs, applying manifests, and managing namespaces from AI coding environments.',
      pricing: 'Free / Open source',
      features: ['k8s_list_pods', 'k8s_get_pod_logs', 'k8s_list_services', 'k8s_list_deployments', 'k8s_apply_manifest', 'k8s_delete_resource', 'k8s_describe_resource', 'k8s_list_namespaces', 'k8s_get_events'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['Kubernetes debugging from AI', 'cluster inspection and monitoring', 'manifest generation and application', 'pod log analysis'],
      worstFor: ['non-Kubernetes container orchestration', 'large-scale cluster administration', 'security-sensitive production clusters'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/strowk/mcp-k8s-go',
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
      name: 'AWS MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for AWS service interaction. Provides tools for managing S3 buckets, Lambda functions, DynamoDB tables, CloudFormation stacks, and other AWS services from AI coding environments using AWS SDK credentials.',
      pricing: 'Free / Open source (requires AWS credentials)',
      features: ['s3_list_buckets', 's3_get_object', 's3_put_object', 'lambda_invoke', 'lambda_list_functions', 'dynamodb_query', 'cloudformation_describe_stacks', 'sts_get_caller_identity', 'logs_get_log_events'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['AWS resource management from AI', 'serverless function deployment', 'S3 operations', 'cloud infrastructure inspection'],
      worstFor: ['non-AWS cloud providers', 'complex multi-account setups', 'cost-sensitive experimentation (accidental resource creation)'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/aws/aws-mcp',
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
      name: 'Stripe MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for the Stripe payments API. Enables AI agents to create customers, manage products and prices, create payment links, list charges, handle subscriptions, and interact with Stripe resources directly from coding environments.',
      pricing: 'Free / Open source (requires Stripe API key)',
      features: ['stripe_create_customer', 'stripe_create_product', 'stripe_create_price', 'stripe_create_payment_link', 'stripe_list_charges', 'stripe_create_subscription', 'stripe_list_invoices', 'stripe_create_refund'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['payment integration development', 'Stripe resource management', 'billing system prototyping', 'subscription setup'],
      worstFor: ['non-Stripe payment providers', 'PCI-sensitive operations', 'production payment processing without review'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/stripe/agent-toolkit',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CMS / HEADLESS CMS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Sanity',
      category: 'cms',
      description:
        'Composable content cloud with a real-time, hosted API backend and an open-source React-based editing environment called Sanity Studio. Treats content as structured data with GROQ query language and strong collaboration features.',
      pricing: 'Free (Community); Team $99/mo; Business $949/mo; Enterprise custom',
      features: ['Sanity Studio (React)', 'GROQ query language', 'Real-time collaboration', 'Content Lake (hosted API)', 'Image pipeline', 'Portable Text', 'Webhooks', 'GraphQL API'],
      integrations: ['Next.js', 'Remix', 'Gatsby', 'Nuxt', 'Astro', 'SvelteKit', 'Hydrogen', 'Vercel', 'Netlify'],
      bestFor: ['custom content models', 'editorial teams needing real-time collaboration', 'structured content for multiple channels', 'developer-friendly CMS'],
      worstFor: ['simple blogs (overkill)', 'non-technical teams wanting drag-and-drop', 'budget-constrained solo projects'],
      trustScore: 0.89,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://sanity.io',
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
      name: 'Contentful',
      category: 'cms',
      description:
        'Enterprise-grade headless CMS and content platform. Provides a content infrastructure with REST and GraphQL APIs, content modeling, localization, and a composable content approach used by thousands of enterprises.',
      pricing: 'Free (Community); Team $300/mo; Enterprise custom',
      features: ['Content Delivery API', 'Content Management API', 'GraphQL API', 'Localization (25+ locales)', 'Content modeling', 'Webhooks', 'Compose (page builder)', 'Launch (scheduling)'],
      integrations: ['Next.js', 'Gatsby', 'Nuxt', 'React', 'Angular', 'Vue', 'Vercel', 'Netlify', 'AWS'],
      bestFor: ['enterprise content operations', 'multi-channel content delivery', 'large editorial teams', 'internationalization at scale'],
      worstFor: ['small projects (expensive)', 'teams wanting a visual page builder', 'simple blog needs', 'budget-sensitive startups'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://contentful.com',
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
      name: 'Strapi',
      category: 'cms',
      description:
        'Leading open-source headless CMS built with Node.js. Provides a customizable admin panel, REST and GraphQL APIs out of the box, and full control over the content infrastructure with self-hosted or cloud options.',
      pricing: 'Free (self-hosted); Strapi Cloud from $29/mo; Enterprise custom',
      features: ['REST & GraphQL APIs', 'Custom content types', 'Role-based access control', 'Media library', 'i18n plugin', 'Draft & publish', 'Customizable admin panel', 'Webhooks'],
      integrations: ['Next.js', 'Gatsby', 'Nuxt', 'React', 'Vue', 'Angular', 'Astro', 'PostgreSQL', 'MySQL', 'SQLite'],
      bestFor: ['self-hosted CMS needs', 'teams wanting full control', 'API-first content management', 'custom admin panel requirements'],
      worstFor: ['teams wanting zero ops (unless using Cloud)', 'very large-scale content (can need tuning)', 'non-JavaScript backend teams'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://strapi.io',
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
      name: 'Payload CMS',
      category: 'cms',
      description:
        'Code-first headless CMS and application framework built with TypeScript and React. Provides full type safety, a powerful admin panel, access control, and can be embedded directly into Next.js applications.',
      pricing: 'Free / Open source (self-hosted); Payload Cloud from $30/mo',
      features: ['TypeScript-first', 'React admin panel', 'Access control', 'Hooks and plugins', 'Draft system', 'Versions and autosave', 'Local API', 'REST & GraphQL APIs', 'Embedded in Next.js'],
      integrations: ['Next.js', 'React', 'PostgreSQL', 'MongoDB', 'SQLite', 'Vercel', 'Docker'],
      bestFor: ['TypeScript developers wanting code-first CMS', 'Next.js embedded CMS', 'full-stack apps needing auth + CMS', 'developers who want full control'],
      worstFor: ['non-technical content editors', 'teams not using React/Next.js', 'WordPress migration (different paradigm)'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://payloadcms.com',
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
      name: 'Ghost',
      category: 'cms',
      description:
        'Open-source publishing platform focused on professional publishing, memberships, and newsletters. Provides a beautiful editor, built-in membership and subscription management, email newsletters, and SEO optimization.',
      pricing: 'Free (self-hosted); Ghost(Pro) Starter $9/mo; Creator $25/mo; Team $50/mo; Business $199/mo',
      features: ['Rich editor', 'Membership & subscriptions', 'Email newsletters', 'Custom themes', 'SEO built-in', 'Native analytics', 'Integrations marketplace', 'REST API'],
      integrations: ['Zapier', 'Mailgun', 'Stripe', 'Slack', 'Custom themes', 'Gatsby', 'Next.js', 'WordPress importer'],
      bestFor: ['professional publishers', 'newsletter-driven businesses', 'membership sites', 'content creators wanting a clean writing experience'],
      worstFor: ['complex content models', 'e-commerce', 'highly custom admin panels', 'multi-language sites'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://ghost.org',
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
      name: 'Directus',
      category: 'cms',
      description:
        'Open-source data platform that wraps any SQL database with a real-time REST and GraphQL API, plus an intuitive no-code admin app. Works with existing databases without migration, making it both a CMS and a backend-as-a-service.',
      pricing: 'Free (self-hosted); Directus Cloud from $15/mo; Enterprise custom',
      features: ['REST & GraphQL APIs', 'Supports any SQL database', 'No-code admin app', 'Flows (automation)', 'Role-based access', 'File storage', 'Real-time via WebSockets', 'Dashboard builder'],
      integrations: ['PostgreSQL', 'MySQL', 'SQLite', 'MS SQL', 'MariaDB', 'OracleDB', 'Next.js', 'Nuxt', 'Docker'],
      bestFor: ['wrapping existing databases', 'non-technical admin needs', 'rapid API generation', 'internal tools and dashboards'],
      worstFor: ['NoSQL databases', 'teams wanting a code-first approach', 'very high-traffic public APIs'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://directus.io',
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
      name: 'Keystatic',
      category: 'cms',
      description:
        'Git-based CMS by the Thinkmill team that lets you manage content in markdown, JSON, or YAML files stored directly in your Git repo. Works locally and with GitHub, providing a content editor UI without needing a separate backend.',
      pricing: 'Free / Open source',
      features: ['Git-based content storage', 'Local & GitHub modes', 'Admin UI', 'Content collections', 'Singletons', 'Image handling', 'Markdoc & MDX support', 'TypeScript API'],
      integrations: ['Astro', 'Next.js', 'Remix', 'GitHub', 'Markdoc', 'MDX'],
      bestFor: ['static site content management', 'developer blogs', 'documentation sites', 'projects wanting content in Git'],
      worstFor: ['dynamic content with many editors', 'non-Git workflows', 'enterprise content operations', 'real-time content updates'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://keystatic.com',
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
      name: 'Tina CMS',
      category: 'cms',
      description:
        'Open-source, Git-backed headless CMS with visual editing. Provides an inline editing experience on top of markdown and MDX content stored in Git, with a GraphQL data layer and real-time preview.',
      pricing: 'Free (self-hosted); Tina Cloud free tier; Team $29/mo/user; Enterprise custom',
      features: ['Visual inline editing', 'Git-backed content', 'GraphQL data layer', 'MDX support', 'Real-time preview', 'Media management', 'Self-hosted or cloud', 'Content modeling'],
      integrations: ['Next.js', 'Astro', 'Remix', 'Hugo', 'GitHub', 'Vercel', 'Netlify', 'Markdown', 'MDX'],
      bestFor: ['visual editing of markdown content', 'developer blogs with inline editing', 'marketing teams wanting WYSIWYG on static sites', 'Git-based content workflows'],
      worstFor: ['non-Git content storage', 'complex relational content models', 'headless API-only use cases', 'large editorial teams'],
      trustScore: 0.79,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://tina.io',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DESIGN TOOLS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Figma',
      category: 'design',
      description:
        'Collaborative interface design tool used by most product teams. Provides vector editing, prototyping, design systems via shared libraries, dev mode for developer handoff, and real-time multiplayer collaboration in the browser.',
      pricing: 'Free (Starter); Professional $15/editor/mo; Organization $45/editor/mo; Enterprise $75/editor/mo',
      features: ['Vector editing', 'Prototyping', 'Auto Layout', 'Components & variants', 'Design tokens', 'Dev Mode', 'FigJam (whiteboard)', 'Plugins ecosystem', 'Branching & merging'],
      integrations: ['Storybook', 'Zeplin', 'Slack', 'Jira', 'GitHub', 'VS Code', 'Chromatic', 'Framer'],
      bestFor: ['team-based UI design', 'design systems', 'developer handoff', 'prototyping', 'cross-platform design'],
      worstFor: ['print design', 'complex illustrations (Illustrator better)', 'offline work', 'teams preferring native Mac apps'],
      trustScore: 0.95,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://figma.com',
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
      name: 'Framer',
      category: 'design',
      description:
        'Design and publish production websites visually. Combines a Figma-like design canvas with a built-in CMS, animations, and hosting. Generates real React code and optimized static sites without requiring separate development.',
      pricing: 'Free (limited); Mini $5/mo; Basic $15/mo; Pro $30/mo',
      features: ['Visual website builder', 'Built-in CMS', 'Animations & interactions', 'Responsive breakpoints', 'SEO controls', 'Custom code components', 'Hosting included', 'Localization'],
      integrations: ['React components', 'Figma (import)', 'Google Analytics', 'Custom domains', 'Zapier', 'HubSpot'],
      bestFor: ['marketing sites', 'landing pages', 'portfolio sites', 'designers who want to publish directly', 'animated marketing pages'],
      worstFor: ['complex web applications', 'e-commerce', 'sites needing backend logic', 'large content-heavy sites'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://framer.com',
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
      name: 'Storybook',
      category: 'design',
      description:
        'Open-source tool for building, documenting, and testing UI components in isolation. Supports React, Vue, Angular, Svelte, and more. The industry standard for component-driven development and design system documentation.',
      pricing: 'Free / Open source',
      features: ['Component isolation', 'Interactive docs', 'Visual testing', 'Accessibility checks', 'Controls (props playground)', 'Actions (event logging)', 'Viewport testing', 'Addons ecosystem'],
      integrations: ['React', 'Vue', 'Angular', 'Svelte', 'Web Components', 'Figma', 'Chromatic', 'Jest', 'Playwright', 'Cypress'],
      bestFor: ['component library development', 'design system documentation', 'visual regression testing', 'isolated component development'],
      worstFor: ['full application testing', 'non-component architectures', 'simple projects without reusable components'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://storybook.js.org',
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
      category: 'design',
      description:
        'Visual testing and review platform by the Storybook maintainers. Automates visual regression testing by capturing snapshots of every Storybook story in cloud browsers and surfacing pixel-level diffs in pull requests.',
      pricing: 'Free (5,000 snapshots/mo); Speed $149/mo; Turbo $349/mo; Enterprise custom',
      features: ['Visual regression testing', 'UI review workflow', 'Storybook publishing', 'Browser rendering (Chrome, Firefox, Safari)', 'Pull request checks', 'Interaction testing', 'Accessibility testing', 'TurboSnap (smart diffing)'],
      integrations: ['Storybook', 'GitHub', 'GitLab', 'Bitbucket', 'Figma', 'Slack', 'Jira', 'Linear'],
      bestFor: ['visual regression testing', 'UI review in pull requests', 'design system QA', 'catching unintended UI changes'],
      worstFor: ['non-Storybook projects', 'functional/API testing', 'teams without component libraries'],
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
      name: 'Zeplin',
      category: 'design',
      description:
        'Design-to-development handoff and collaboration platform. Generates style guides, design tokens, and code snippets from Figma, Sketch, and Adobe XD designs, making it easier for developers to implement designs accurately.',
      pricing: 'Free (1 project); Starter $8/seat/mo; Growth $16/seat/mo; Enterprise custom',
      features: ['Design handoff', 'Code snippets (CSS, Swift, Kotlin, XML)', 'Style guides', 'Design tokens', 'Component documentation', 'Version history', 'Flow diagrams', 'Annotations'],
      integrations: ['Figma', 'Sketch', 'Adobe XD', 'Slack', 'Jira', 'Trello', 'Microsoft Teams', 'Storybook'],
      bestFor: ['design-to-dev handoff', 'style guide generation', 'teams using Figma + Sketch together', 'design token management'],
      worstFor: ['design creation (not an editor)', 'teams fully in Figma Dev Mode', 'solo developers', 'teams already using Figma handoff'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://zeplin.io',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMUNICATION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Slack',
      category: 'communication',
      description:
        'The dominant team messaging and collaboration platform. Provides channels, direct messaging, app integrations, Huddles (audio/video calls), Canvas (docs), and Workflow Builder for automation. Used by most tech companies.',
      pricing: 'Free (limited history); Pro $8.75/user/mo; Business+ $15/user/mo; Enterprise Grid custom',
      features: ['Channels & threads', 'Huddles (audio/video)', 'Canvas (docs)', 'Workflow Builder', 'App directory (2,600+)', 'Slack Connect (external orgs)', 'Search', 'File sharing', 'Slack AI'],
      integrations: ['GitHub', 'Jira', 'Google Workspace', 'Salesforce', 'Notion', 'Linear', 'PagerDuty', 'Datadog', 'Sentry', 'Zapier'],
      bestFor: ['team communication', 'developer workflows', 'cross-org collaboration', 'bot and automation integrations'],
      worstFor: ['small teams wanting simplicity', 'budget-sensitive organizations', 'deep project management', 'video-first communication'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://slack.com',
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
      name: 'Discord',
      category: 'communication',
      description:
        'Community platform originally for gamers, now widely used for developer communities, open-source projects, and startup teams. Offers text channels, voice channels, forums, threads, and a rich bot ecosystem.',
      pricing: 'Free; Nitro Basic $2.99/mo; Nitro $9.99/mo; Server Boost $4.99/mo',
      features: ['Text & voice channels', 'Forums', 'Threads', 'Stage channels', 'Screen sharing', 'Bot API', 'Roles & permissions', 'Community features', 'App directory'],
      integrations: ['GitHub (webhooks)', 'Zapier', 'IFTTT', 'Custom bots (discord.js, discord.py)', 'Midjourney', 'MEE6', 'Carl-bot'],
      bestFor: ['developer communities', 'open-source project communication', 'real-time voice chat', 'community building'],
      worstFor: ['formal enterprise communication', 'email replacement', 'document collaboration', 'compliance-heavy industries'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://discord.com',
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
      name: 'Intercom',
      category: 'communication',
      description:
        'AI-first customer service platform. Provides a messenger widget, AI chatbot (Fin), help center, ticketing, product tours, and customer data platform. Focused on reducing support volume through AI resolution.',
      pricing: 'Essential $39/seat/mo; Advanced $99/seat/mo; Expert $139/seat/mo; Fin AI $0.99/resolution',
      features: ['Fin AI Agent', 'Messenger widget', 'Help center', 'Ticketing', 'Product tours', 'Custom bots', 'Reporting', 'Customer data platform', 'Outbound messaging'],
      integrations: ['Salesforce', 'HubSpot', 'Slack', 'Jira', 'Stripe', 'Segment', 'Zendesk', 'Zapier'],
      bestFor: ['SaaS customer support', 'AI-powered support deflection', 'product-led growth', 'in-app messaging'],
      worstFor: ['budget-constrained startups (expensive)', 'simple contact forms', 'B2B with phone-heavy support', 'teams wanting free live chat'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://intercom.com',
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
      name: 'Crisp',
      category: 'communication',
      description:
        'All-in-one business messaging platform with live chat, chatbot, knowledge base, and shared inbox. Offers a generous free tier and is popular with startups as an affordable Intercom alternative.',
      pricing: 'Free (2 seats); Pro $25/mo/workspace; Unlimited $95/mo/workspace',
      features: ['Live chat widget', 'Shared inbox', 'Chatbot (no-code)', 'Knowledge base', 'CRM', 'Status page', 'Email campaigns', 'Video calls', 'Co-browsing'],
      integrations: ['WordPress', 'Shopify', 'Slack', 'Zapier', 'Segment', 'Salesforce', 'HubSpot', 'WhatsApp', 'Instagram'],
      bestFor: ['startups wanting affordable live chat', 'multi-channel support', 'small teams needing shared inbox', 'Intercom alternative on a budget'],
      worstFor: ['enterprise-scale support operations', 'complex ticketing workflows', 'teams needing deep analytics'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://crisp.chat',
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
      name: 'Tawk.to',
      category: 'communication',
      description:
        'Completely free live chat and customer communication platform. Provides a chat widget, ticketing, knowledge base, CRM, and group messaging at no cost. Monetizes through optional hired agent services.',
      pricing: 'Free (all features); Hired agents $1/hr optional; Remove branding $29/mo optional',
      features: ['Live chat widget', 'Ticketing system', 'Knowledge base', 'CRM', 'Chat pages', 'Group messaging', 'Video + voice chat', 'Screen sharing', 'File sharing', '45+ languages'],
      integrations: ['WordPress', 'Shopify', 'Wix', 'Joomla', 'Magento', 'Zapier', 'Google Analytics', 'JavaScript API'],
      bestFor: ['teams wanting free live chat', 'small businesses', 'multilingual support', 'budget-conscious startups'],
      worstFor: ['teams needing advanced AI chatbots', 'enterprise compliance requirements', 'teams wanting premium look (branding on free tier)', 'complex automation workflows'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://tawk.to',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECURITY
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Snyk',
      category: 'security',
      description:
        'Developer-first security platform that finds and fixes vulnerabilities in code, open-source dependencies, containers, and infrastructure as code. Integrates directly into the developer workflow with IDE plugins and CI/CD integration.',
      pricing: 'Free (limited scans); Team $25/dev/mo; Enterprise custom',
      features: ['Open Source (SCA)', 'Code (SAST)', 'Container scanning', 'IaC scanning', 'License compliance', 'Fix PRs', 'Priority scoring', 'SBOM generation', 'IDE plugins'],
      integrations: ['GitHub', 'GitLab', 'Bitbucket', 'Jira', 'VS Code', 'IntelliJ', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Terraform'],
      bestFor: ['dependency vulnerability scanning', 'developer-friendly security', 'container security', 'shift-left security practices'],
      worstFor: ['runtime protection', 'WAF needs', 'teams without CI/CD pipelines', 'non-developer security teams'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://snyk.io',
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
      name: 'Socket.dev',
      category: 'security',
      description:
        'Supply chain security platform that detects compromised or malicious packages before they enter your codebase. Analyzes package behavior rather than just known CVEs, catching typosquatting, install scripts, and suspicious network access.',
      pricing: 'Free (open source); Team $10/dev/mo; Enterprise custom',
      features: ['Malicious package detection', 'Typosquatting alerts', 'Install script analysis', 'Network access detection', 'GitHub PR comments', 'npm/yarn/pnpm support', 'Dependency diff', 'SBOM generation'],
      integrations: ['GitHub', 'npm', 'PyPI', 'Go modules', 'VS Code', 'CLI tool', 'CI/CD pipelines'],
      bestFor: ['supply chain attack prevention', 'npm dependency auditing', 'detecting malicious packages', 'open-source security'],
      worstFor: ['SAST (source code analysis)', 'container scanning', 'runtime protection', 'non-JavaScript ecosystems (limited support)'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://socket.dev',
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
      name: 'GitGuardian',
      category: 'security',
      description:
        'Secret detection and remediation platform that scans code repositories and CI/CD pipelines for exposed API keys, passwords, certificates, and other credentials. Monitors both internal repos and public GitHub in real time.',
      pricing: 'Free (personal use, 25 incidents/mo); Team from $40/dev/mo; Enterprise custom',
      features: ['Secret detection (350+ detectors)', 'Public monitoring', 'Historical scanning', 'CI/CD integration', 'Automated remediation', 'Incident management', 'Policy engine', 'Custom detectors'],
      integrations: ['GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps', 'Jenkins', 'CircleCI', 'Docker', 'Slack', 'Jira'],
      bestFor: ['secret leak prevention', 'compliance requirements', 'CI/CD security gates', 'monitoring public exposure'],
      worstFor: ['vulnerability scanning (different from secret detection)', 'runtime security', 'small solo projects'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://gitguardian.com',
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
      name: 'Dependabot',
      category: 'security',
      description:
        'GitHub-native automated dependency update and security vulnerability service. Automatically creates pull requests to update dependencies with known vulnerabilities and can keep all dependencies up to date on a schedule.',
      pricing: 'Free (included with GitHub)',
      features: ['Security alerts', 'Automated PRs for vulnerable deps', 'Version updates', 'Grouped updates', 'Custom schedules', 'Ecosystem support (npm, pip, Maven, etc.)', 'Merge automation', 'Compatibility scoring'],
      integrations: ['GitHub', 'GitHub Actions', 'npm', 'pip', 'Maven', 'Gradle', 'Bundler', 'Cargo', 'Go modules', 'Docker', 'Terraform'],
      bestFor: ['GitHub-hosted projects', 'automated dependency updates', 'security vulnerability patching', 'keeping dependencies current'],
      worstFor: ['non-GitHub platforms', 'monorepos with complex dependency graphs', 'projects wanting deep vulnerability analysis', 'custom registries'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/dependabot',
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
      name: 'Trivy',
      category: 'security',
      description:
        'Open-source vulnerability scanner by Aqua Security. Scans container images, filesystems, Git repositories, Kubernetes clusters, and IaC configurations for vulnerabilities, misconfigurations, secrets, and license issues.',
      pricing: 'Free / Open source; Aqua Platform (commercial) for enterprise features',
      features: ['Container image scanning', 'Filesystem scanning', 'IaC scanning (Terraform, CloudFormation)', 'Kubernetes scanning', 'Secret detection', 'SBOM generation', 'License scanning', 'VEX support', 'CI/CD plugins'],
      integrations: ['Docker', 'Kubernetes', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'Terraform', 'AWS', 'GCP', 'Azure'],
      bestFor: ['container security scanning', 'CI/CD security gates', 'Kubernetes security', 'open-source security tool'],
      worstFor: ['teams wanting managed SaaS (it is a CLI tool)', 'SAST source code analysis', 'runtime protection', 'teams needing a dashboard (use Aqua)'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/aquasecurity/trivy',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DNS & CDN
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Fastly',
      category: 'cdn',
      description:
        'Edge cloud platform offering a CDN, edge compute (Compute@Edge with Wasm), DDoS protection, image optimization, and real-time log streaming. Known for instant cache purging and developer-friendly VCL configuration language.',
      pricing: 'Free tier (limited); Pay-as-you-go from $0.08/GB; Enterprise custom',
      features: ['CDN with instant purge', 'Compute@Edge (Wasm)', 'DDoS protection', 'Image optimizer', 'WAF', 'Real-time analytics', 'VCL configuration', 'TLS management', 'Log streaming'],
      integrations: ['AWS', 'GCP', 'Azure', 'Terraform', 'Datadog', 'Splunk', 'New Relic', 'Elasticsearch', 'GitHub Actions'],
      bestFor: ['instant cache invalidation needs', 'edge compute workloads', 'media and streaming companies', 'high-traffic sites needing fast purging'],
      worstFor: ['simple static sites (overkill)', 'budget-sensitive small projects', 'teams wanting simple dashboard-only config'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://fastly.com',
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
      name: 'Bunny CDN',
      category: 'cdn',
      description:
        'Affordable, high-performance CDN and cloud storage provider. Offers content delivery, DDoS protection, image processing, video hosting (Bunny Stream), DNS, and edge scripting at significantly lower prices than major competitors.',
      pricing: 'Pay-as-you-go from $0.005/GB (Asia) to $0.01/GB (NA/EU); no minimum',
      features: ['CDN', 'Bunny Storage (cloud)', 'Bunny Stream (video)', 'Bunny Optimizer (images)', 'Bunny DNS', 'Edge Rules', 'DDoS protection', 'Edge Scripting', 'Perma-cache'],
      integrations: ['WordPress', 'Any origin server', 'REST API', 'Terraform', 'Custom domains'],
      bestFor: ['cost-effective CDN', 'video hosting', 'image optimization', 'budget-conscious projects needing global delivery'],
      worstFor: ['edge compute (limited compared to Cloudflare Workers)', 'complex WAF rules', 'enterprise compliance needs'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://bunny.net',
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
      name: 'AWS CloudFront',
      category: 'cdn',
      description:
        'Amazon Web Services CDN with 600+ edge locations. Tightly integrated with the AWS ecosystem. Provides content delivery, Lambda@Edge for server-side logic, real-time logs, field-level encryption, and origin shield for origin protection.',
      pricing: 'Free tier (1 TB/mo for 12 months); Pay-as-you-go from $0.085/GB; volume discounts',
      features: ['Global edge network (600+ POPs)', 'Lambda@Edge', 'CloudFront Functions', 'Origin Shield', 'Real-time logs', 'Field-level encryption', 'WebSocket support', 'HTTP/3', 'Signed URLs & cookies'],
      integrations: ['S3', 'EC2', 'ALB', 'API Gateway', 'Lambda', 'AWS WAF', 'AWS Shield', 'Route 53', 'Terraform', 'CloudFormation'],
      bestFor: ['AWS-native applications', 'enterprise CDN with Lambda@Edge', 'applications already on AWS', 'dynamic content acceleration'],
      worstFor: ['simple static sites (Cloudflare is simpler)', 'non-AWS origins (extra config)', 'teams wanting simple pricing', 'quick setup without AWS knowledge'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://aws.amazon.com/cloudfront',
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
      name: 'Vercel Edge Network',
      category: 'cdn',
      description:
        'Global edge network built into the Vercel platform. Automatically caches and serves Next.js and other framework deployments from edge locations worldwide. Includes edge functions, image optimization, ISR, and instant rollbacks.',
      pricing: 'Included in Vercel plans; Hobby free; Pro $20/user/mo; Enterprise custom',
      features: ['Automatic edge caching', 'Edge Functions (Middleware)', 'ISR (Incremental Static Regeneration)', 'Image optimization', 'Instant rollbacks', 'Preview deployments', 'Web Analytics', 'Speed Insights', 'DDoS protection'],
      integrations: ['Next.js', 'Nuxt', 'SvelteKit', 'Astro', 'Remix', 'GitHub', 'GitLab', 'Bitbucket', 'Vercel CLI'],
      bestFor: ['Next.js applications', 'Jamstack sites', 'frontend teams wanting zero-config CDN', 'preview deployment workflows'],
      worstFor: ['non-Vercel hosted sites', 'custom CDN configuration needs', 'non-framework static assets', 'teams needing granular cache controls'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://vercel.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
];
