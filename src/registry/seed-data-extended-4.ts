import type { Product, AffiliateProgram } from '../types/product.js';

type SeedProduct = {
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
  programs: Omit<AffiliateProgram, 'id' | 'productId'>[];
};

export const EXTENDED_PRODUCTS_4: SeedProduct[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // MCP SERVERS (20)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Obsidian MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for interacting with Obsidian vaults. Enables AI agents to read, search, create, and edit markdown notes, manage tags, and navigate the knowledge graph through the MCP protocol.',
      pricing: 'Free / Open source',
      features: ['read/write notes', 'search vault content', 'tag management', 'link graph traversal', 'template support', 'frontmatter parsing', 'folder operations'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Obsidian', 'VS Code Copilot', 'Cline'],
      bestFor: ['AI-powered note management', 'knowledge base queries from agents', 'automated journal entries', 'linking related notes', 'vault organization'],
      worstFor: ['non-Obsidian note apps', 'real-time collaborative editing', 'large binary file management'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/smithery-ai/mcp-obsidian',
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
      name: 'Todoist MCP Server',
      category: 'mcp-server',
      description:
        'MCP server connecting AI agents to Todoist task management. Supports creating, updating, completing, and querying tasks and projects through natural language via the MCP protocol.',
      pricing: 'Free / Open source',
      features: ['create tasks', 'complete tasks', 'list projects', 'filter by labels', 'set due dates', 'priority management', 'comment support'],
      integrations: ['Claude Code', 'Cursor', 'Todoist', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['AI-driven task management', 'automated task creation from code reviews', 'project planning assistance', 'daily agenda queries'],
      worstFor: ['non-Todoist task systems', 'complex Gantt chart workflows', 'time-tracking features'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/abhiz123/todoist-mcp-server',
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
      name: 'Google Calendar MCP Server',
      category: 'mcp-server',
      description:
        'MCP server providing AI agents access to Google Calendar. Create events, check availability, list upcoming meetings, and manage calendar entries through structured tool calls.',
      pricing: 'Free / Open source',
      features: ['create events', 'list events', 'check free/busy', 'update events', 'delete events', 'recurring event support', 'multi-calendar support'],
      integrations: ['Claude Code', 'Cursor', 'Google Calendar', 'Google Workspace', 'Windsurf', 'Cline'],
      bestFor: ['scheduling from AI agents', 'meeting conflict detection', 'automated calendar management', 'daily briefing generation'],
      worstFor: ['non-Google calendar systems', 'complex resource booking', 'offline calendar access'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Gmail MCP Server',
      category: 'mcp-server',
      description:
        'MCP server enabling AI agents to read, search, compose, and send emails through Gmail. Supports label management, thread navigation, and attachment handling via the Gmail API.',
      pricing: 'Free / Open source',
      features: ['read emails', 'send emails', 'search inbox', 'manage labels', 'thread navigation', 'attachment handling', 'draft management'],
      integrations: ['Claude Code', 'Cursor', 'Gmail', 'Google Workspace', 'Windsurf', 'Cline'],
      bestFor: ['automated email responses', 'inbox summarization', 'email search from agents', 'draft composition assistance'],
      worstFor: ['non-Gmail email providers', 'bulk marketing emails', 'complex email template rendering'],
      trustScore: 0.79,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Jira MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Atlassian Jira integration. Enables AI agents to create issues, update tickets, search with JQL, manage sprints, and track project progress through the MCP protocol.',
      pricing: 'Free / Open source',
      features: ['create issues', 'update issues', 'JQL search', 'sprint management', 'comment on tickets', 'transition workflows', 'assignee management', 'project listing'],
      integrations: ['Claude Code', 'Cursor', 'Jira Cloud', 'Jira Server', 'Windsurf', 'Cline', 'Atlassian ecosystem'],
      bestFor: ['automated ticket creation from code', 'sprint planning assistance', 'issue triage', 'project status queries', 'bug report generation'],
      worstFor: ['non-Jira project management tools', 'simple todo lists', 'teams not using Atlassian'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Confluence MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Atlassian Confluence. Allows AI agents to search, read, create, and update wiki pages, spaces, and documentation through MCP tool calls.',
      pricing: 'Free / Open source',
      features: ['search pages', 'read page content', 'create pages', 'update pages', 'list spaces', 'manage labels', 'comment support'],
      integrations: ['Claude Code', 'Cursor', 'Confluence Cloud', 'Jira', 'Windsurf', 'Cline', 'Atlassian ecosystem'],
      bestFor: ['documentation search', 'automated wiki updates', 'knowledge base queries', 'meeting notes creation'],
      worstFor: ['non-Confluence wikis', 'complex page layouts with macros', 'real-time collaborative editing'],
      trustScore: 0.79,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Airtable MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Airtable database interaction. Enables AI agents to query records, create entries, update fields, and manage bases through the Airtable API via MCP.',
      pricing: 'Free / Open source',
      features: ['list records', 'create records', 'update records', 'delete records', 'filter by formula', 'sort records', 'field type support'],
      integrations: ['Claude Code', 'Cursor', 'Airtable', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['structured data queries from agents', 'CRM data management', 'content calendar automation', 'inventory tracking'],
      worstFor: ['non-Airtable databases', 'high-volume transactional workloads', 'complex relational queries'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Google Drive MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Google Drive file management. AI agents can search files, read documents, create folders, upload content, and manage permissions through MCP tool calls.',
      pricing: 'Free / Open source',
      features: ['search files', 'read file content', 'create folders', 'upload files', 'share files', 'list folder contents', 'move files'],
      integrations: ['Claude Code', 'Cursor', 'Google Drive', 'Google Workspace', 'Windsurf', 'Cline'],
      bestFor: ['document search from agents', 'automated file organization', 'content retrieval for context', 'folder management'],
      worstFor: ['non-Google cloud storage', 'large file transfers', 'real-time document editing'],
      trustScore: 0.81,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Google Sheets MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Google Sheets interaction. Enables AI agents to read spreadsheet data, write cells, create sheets, and perform data analysis through MCP.',
      pricing: 'Free / Open source',
      features: ['read cell ranges', 'write cell values', 'create spreadsheets', 'append rows', 'format cells', 'sheet management', 'formula support'],
      integrations: ['Claude Code', 'Cursor', 'Google Sheets', 'Google Workspace', 'Windsurf', 'Cline'],
      bestFor: ['data extraction from spreadsheets', 'automated report generation', 'spreadsheet data queries', 'bulk data entry'],
      worstFor: ['non-Google spreadsheet tools', 'complex pivot tables', 'real-time multi-user editing'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Discord MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Discord bot integration. Allows AI agents to send messages, read channels, manage roles, and interact with Discord servers through MCP tool calls.',
      pricing: 'Free / Open source',
      features: ['send messages', 'read channel history', 'manage roles', 'create channels', 'react to messages', 'thread management', 'webhook support'],
      integrations: ['Claude Code', 'Cursor', 'Discord', 'Discord.js', 'Windsurf', 'Cline'],
      bestFor: ['community management automation', 'bot-assisted moderation', 'notification delivery', 'server administration'],
      worstFor: ['non-Discord chat platforms', 'voice channel interaction', 'complex bot UI components'],
      trustScore: 0.77,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Twitter/X MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Twitter/X API interaction. Enables AI agents to post tweets, search content, read timelines, and manage interactions through the MCP protocol.',
      pricing: 'Free / Open source',
      features: ['post tweets', 'search tweets', 'read timeline', 'like/retweet', 'user lookup', 'thread creation', 'media upload'],
      integrations: ['Claude Code', 'Cursor', 'Twitter/X API', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['social media automation', 'content monitoring', 'brand mention tracking', 'scheduled posting assistance'],
      worstFor: ['non-Twitter platforms', 'high-volume posting (rate limits)', 'Twitter Ads management'],
      trustScore: 0.75,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'YouTube MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for YouTube data access. Enables AI agents to search videos, retrieve transcripts, fetch channel data, and analyze video metadata through MCP.',
      pricing: 'Free / Open source',
      features: ['search videos', 'get transcripts', 'channel info', 'video metadata', 'playlist listing', 'comment retrieval', 'caption extraction'],
      integrations: ['Claude Code', 'Cursor', 'YouTube Data API', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['video content research', 'transcript extraction for context', 'channel analytics queries', 'content summarization'],
      worstFor: ['video uploading', 'live streaming management', 'YouTube Ads', 'non-YouTube video platforms'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'ArXiv MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for querying ArXiv academic papers. Enables AI agents to search papers, retrieve abstracts, download PDFs, and explore citations through MCP.',
      pricing: 'Free / Open source',
      features: ['search papers', 'get abstracts', 'author lookup', 'category filtering', 'recent papers', 'full text retrieval', 'citation metadata'],
      integrations: ['Claude Code', 'Cursor', 'ArXiv API', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['academic research from agents', 'literature review automation', 'paper summarization', 'staying current with research'],
      worstFor: ['non-ArXiv paper repositories', 'full-text search of paper bodies', 'citation graph analysis at scale'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Wolfram Alpha MCP Server',
      category: 'mcp-server',
      description:
        'MCP server connecting AI agents to Wolfram Alpha computational engine. Enables math computation, data analysis, unit conversions, and scientific queries through MCP.',
      pricing: 'Free / Open source (requires Wolfram Alpha API key)',
      features: ['mathematical computation', 'unit conversion', 'data analysis', 'scientific queries', 'step-by-step solutions', 'plot generation', 'factual queries'],
      integrations: ['Claude Code', 'Cursor', 'Wolfram Alpha API', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['complex math from agents', 'unit conversions', 'scientific computation', 'data validation'],
      worstFor: ['simple arithmetic', 'non-computational queries', 'high-volume API usage (costs)', 'custom data analysis'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Weather MCP Server',
      category: 'mcp-server',
      description:
        'MCP server providing weather data to AI agents. Fetches current conditions, forecasts, and severe weather alerts using the National Weather Service API.',
      pricing: 'Free / Open source',
      features: ['current weather', 'multi-day forecast', 'severe weather alerts', 'location-based queries', 'temperature/humidity/wind', 'precipitation data'],
      integrations: ['Claude Code', 'Cursor', 'NWS API', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['weather queries from agents', 'travel planning assistance', 'alert monitoring', 'location-aware recommendations'],
      worstFor: ['non-US locations (NWS only)', 'historical weather data', 'hyper-local microclimate data'],
      trustScore: 0.76,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Time MCP Server',
      category: 'mcp-server',
      description:
        'MCP server providing timezone-aware time operations to AI agents. Supports current time queries, timezone conversions, date arithmetic, and scheduling calculations.',
      pricing: 'Free / Open source',
      features: ['current time', 'timezone conversion', 'date arithmetic', 'time difference calculation', 'ISO format support', 'business hours check'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['timezone-aware scheduling', 'date calculations from agents', 'meeting time coordination', 'deadline tracking'],
      worstFor: ['complex calendar logic', 'recurring event scheduling', 'historical date research'],
      trustScore: 0.75,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Image Generation MCP Server',
      category: 'mcp-server',
      description:
        'MCP server wrapping image generation APIs (DALL-E, Stable Diffusion) for AI agents. Enables text-to-image generation, image editing, and variation creation through MCP.',
      pricing: 'Free / Open source (requires API key for underlying service)',
      features: ['text-to-image generation', 'image variations', 'image editing', 'style control', 'resolution options', 'batch generation'],
      integrations: ['Claude Code', 'Cursor', 'OpenAI DALL-E', 'Stable Diffusion', 'Windsurf', 'Cline'],
      bestFor: ['generating images from AI agents', 'automated asset creation', 'prototype mockups', 'content illustration'],
      worstFor: ['precise graphic design', 'vector graphics', 'brand-consistent imagery without fine-tuning'],
      trustScore: 0.76,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'PDF MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for PDF document processing. Enables AI agents to extract text, parse tables, read metadata, and convert PDF content for analysis through MCP.',
      pricing: 'Free / Open source',
      features: ['text extraction', 'table parsing', 'metadata reading', 'page-by-page access', 'OCR support', 'PDF search', 'form field extraction'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['document analysis from agents', 'PDF data extraction', 'contract review assistance', 'report summarization'],
      worstFor: ['PDF creation/editing', 'complex layout preservation', 'scanned documents without OCR'],
      trustScore: 0.77,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Excel MCP Server',
      category: 'mcp-server',
      description:
        'MCP server for Microsoft Excel file interaction. Enables AI agents to read, write, and analyze Excel workbooks including formulas, charts, and pivot table data through MCP.',
      pricing: 'Free / Open source',
      features: ['read worksheets', 'write cells', 'formula evaluation', 'chart data access', 'pivot table reading', 'multi-sheet support', 'format detection'],
      integrations: ['Claude Code', 'Cursor', 'Microsoft Excel', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['Excel data extraction', 'spreadsheet analysis from agents', 'report data ingestion', 'financial model reading'],
      worstFor: ['Excel creation with complex formatting', 'macro execution', 'real-time Excel editing', 'very large workbooks'],
      trustScore: 0.76,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
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
      name: 'Fetch MCP Server',
      category: 'mcp-server',
      description:
        'Official MCP server for making HTTP requests. Enables AI agents to fetch web pages, call APIs, and retrieve content from URLs with automatic content extraction and markdown conversion.',
      pricing: 'Free / Open source',
      features: ['HTTP GET/POST requests', 'HTML to markdown conversion', 'JSON response handling', 'custom headers', 'content extraction', 'robots.txt respect'],
      integrations: ['Claude Code', 'Cursor', 'Windsurf', 'Cline', 'any MCP-compatible client'],
      bestFor: ['web content fetching', 'API interaction from agents', 'documentation retrieval', 'data scraping'],
      worstFor: ['JavaScript-rendered pages', 'authenticated sessions', 'high-volume scraping'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/modelcontextprotocol/servers',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKEND FRAMEWORKS (10)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Express.js',
      category: 'backend-framework',
      description:
        'Minimal and flexible Node.js web application framework. The most popular backend framework in the Node ecosystem, providing robust routing, middleware architecture, and a massive plugin ecosystem.',
      pricing: 'Free / Open source',
      features: ['middleware system', 'routing', 'template engine support', 'static file serving', 'error handling', 'session management', 'massive plugin ecosystem'],
      integrations: ['Node.js', 'MongoDB', 'PostgreSQL', 'Redis', 'Passport.js', 'Socket.io', 'Prisma', 'TypeORM', 'Docker', 'AWS Lambda'],
      bestFor: ['REST APIs', 'rapid prototyping', 'teams familiar with Node.js', 'microservices', 'beginner-friendly projects'],
      worstFor: ['projects needing strict structure out of the box', 'CPU-intensive workloads', 'teams wanting built-in TypeScript support', 'opinionated conventions'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://expressjs.com',
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
      name: 'Fastify',
      category: 'backend-framework',
      description:
        'High-performance Node.js web framework focused on speed and low overhead. Provides schema-based validation, plugin architecture, and is significantly faster than Express with built-in TypeScript support.',
      pricing: 'Free / Open source',
      features: ['schema-based validation', 'plugin system', 'hooks lifecycle', 'automatic JSON serialization', 'TypeScript support', 'logging with Pino', 'decorators'],
      integrations: ['Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'TypeORM', 'Swagger/OpenAPI', 'GraphQL', 'Docker', 'Kubernetes'],
      bestFor: ['high-performance APIs', 'microservices', 'TypeScript-first backends', 'teams migrating from Express', 'JSON-heavy APIs'],
      worstFor: ['small scripts where Express suffices', 'teams wanting opinionated MVC structure', 'projects with heavy middleware reliance'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://fastify.dev',
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
      name: 'NestJS',
      category: 'backend-framework',
      description:
        'Progressive Node.js framework for building efficient, scalable server-side applications. Uses TypeScript by default and combines OOP, FP, and FRP. Inspired by Angular with decorators, modules, and dependency injection.',
      pricing: 'Free / Open source; Enterprise support available',
      features: ['dependency injection', 'module system', 'decorators', 'guards and interceptors', 'GraphQL support', 'WebSocket support', 'microservices', 'OpenAPI generation', 'CQRS'],
      integrations: ['TypeScript', 'Express', 'Fastify', 'PostgreSQL', 'MongoDB', 'TypeORM', 'Prisma', 'GraphQL', 'Redis', 'RabbitMQ', 'Kafka'],
      bestFor: ['enterprise applications', 'large teams needing structure', 'microservices architecture', 'Angular developers moving to backend', 'complex API systems'],
      worstFor: ['simple scripts or small APIs', 'teams wanting minimal abstractions', 'projects where fast cold start matters', 'rapid prototyping'],
      trustScore: 0.89,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://nestjs.com',
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
      name: 'Hono',
      category: 'backend-framework',
      description:
        'Ultrafast web framework for the edge. Runs on Cloudflare Workers, Deno, Bun, AWS Lambda, and Node.js. Tiny bundle size with middleware, routing, and TypeScript-first design.',
      pricing: 'Free / Open source',
      features: ['multi-runtime support', 'middleware system', 'TypeScript-first', 'tiny bundle size', 'JSX support', 'OpenAPI generation', 'validator middleware', 'cookie/session helpers'],
      integrations: ['Cloudflare Workers', 'Deno', 'Bun', 'Node.js', 'AWS Lambda', 'Vercel', 'Netlify', 'Fastly', 'Prisma', 'Drizzle'],
      bestFor: ['edge computing', 'Cloudflare Workers projects', 'multi-runtime deployments', 'lightweight APIs', 'Bun projects'],
      worstFor: ['teams needing enterprise ORM integration', 'complex MVC applications', 'projects requiring extensive middleware ecosystem'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://hono.dev',
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
      name: 'Elysia',
      category: 'backend-framework',
      description:
        'TypeScript framework optimized for Bun runtime. Focuses on end-to-end type safety, developer experience, and performance. Features a plugin system and Eden Treaty for type-safe API clients.',
      pricing: 'Free / Open source',
      features: ['end-to-end type safety', 'Eden Treaty (type-safe client)', 'plugin system', 'lifecycle hooks', 'validation', 'Swagger generation', 'WebSocket support'],
      integrations: ['Bun', 'TypeScript', 'Prisma', 'Drizzle', 'Swagger/OpenAPI', 'Docker', 'tRPC-like patterns'],
      bestFor: ['Bun-first projects', 'type-safe APIs', 'developers wanting tRPC-like DX', 'high-performance TypeScript backends'],
      worstFor: ['Node.js-only environments', 'teams not using Bun', 'production workloads needing battle-tested stability', 'large enterprise adoption'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://elysiajs.com',
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
      name: 'tRPC',
      category: 'backend-framework',
      description:
        'End-to-end typesafe API layer for TypeScript. Eliminates the need for API schemas or code generation by sharing types between server and client. Works with any framework via adapters.',
      pricing: 'Free / Open source',
      features: ['end-to-end type safety', 'no code generation', 'subscriptions (WebSocket)', 'middleware', 'input validation with Zod', 'batching', 'React Query integration', 'server-side calls'],
      integrations: ['Next.js', 'React', 'Express', 'Fastify', 'Nuxt', 'SvelteKit', 'Zod', 'React Query', 'Prisma', 'Drizzle'],
      bestFor: ['full-stack TypeScript apps', 'monorepos sharing types', 'rapid API development', 'Next.js projects', 'developer experience focused teams'],
      worstFor: ['polyglot backends', 'public APIs needing REST/GraphQL', 'non-TypeScript clients', 'teams wanting language-agnostic contracts'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://trpc.io',
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
      name: 'Drizzle ORM',
      category: 'orm',
      description:
        'Lightweight TypeScript ORM with a SQL-like query builder. Zero dependencies, serverless-ready, and supports PostgreSQL, MySQL, and SQLite. Schema defined in TypeScript with automatic migration generation.',
      pricing: 'Free / Open source; Drizzle Studio free',
      features: ['SQL-like query builder', 'TypeScript schema definitions', 'automatic migrations', 'Drizzle Studio (GUI)', 'relational queries', 'prepared statements', 'zero dependencies'],
      integrations: ['PostgreSQL', 'MySQL', 'SQLite', 'Turso', 'Neon', 'PlanetScale', 'Supabase', 'Cloudflare D1', 'Bun', 'Next.js', 'Vercel'],
      bestFor: ['TypeScript projects', 'serverless environments', 'developers who prefer SQL-like syntax', 'edge deployments', 'lightweight ORM needs'],
      worstFor: ['teams wanting Active Record pattern', 'complex ORM features like lazy loading', 'projects needing extensive migration tooling'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://orm.drizzle.team',
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
      name: 'Prisma',
      category: 'orm',
      description:
        'Next-generation Node.js and TypeScript ORM. Features a declarative schema language, auto-generated type-safe client, visual database browser (Prisma Studio), and powerful migration system.',
      pricing: 'Free / Open source; Prisma Accelerate from $29/mo; Prisma Pulse from $29/mo',
      features: ['Prisma Schema Language', 'auto-generated client', 'Prisma Studio (GUI)', 'migrations', 'relation handling', 'raw SQL support', 'connection pooling (Accelerate)', 'real-time events (Pulse)'],
      integrations: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'CockroachDB', 'PlanetScale', 'Neon', 'Next.js', 'NestJS', 'Express', 'GraphQL'],
      bestFor: ['TypeScript projects needing strong typing', 'rapid development with auto-generated client', 'teams wanting visual DB tools', 'complex relational models'],
      worstFor: ['raw SQL enthusiasts', 'serverless cold starts (bundle size)', 'NoSQL-heavy projects', 'edge runtime without Accelerate'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://prisma.io',
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
      name: 'TypeORM',
      category: 'orm',
      description:
        'ORM for TypeScript and JavaScript supporting Active Record and Data Mapper patterns. Works with many SQL databases and has built-in migration support. One of the oldest and most feature-rich TS ORMs.',
      pricing: 'Free / Open source',
      features: ['Active Record and Data Mapper', 'migrations', 'eager/lazy relations', 'query builder', 'transaction support', 'subscriber/listener hooks', 'tree structures'],
      integrations: ['PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'MSSQL', 'Oracle', 'NestJS', 'Express', 'Next.js', 'React Native'],
      bestFor: ['NestJS projects', 'teams wanting Active Record pattern', 'complex relational schemas', 'enterprise TypeScript applications'],
      worstFor: ['performance-critical applications', 'serverless environments', 'teams wanting modern DX (compared to Prisma/Drizzle)', 'simple schemas'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://typeorm.io',
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
      name: 'Kysely',
      category: 'orm',
      description:
        'Type-safe TypeScript SQL query builder. Not a full ORM but provides end-to-end type safety for SQL queries with zero runtime overhead. Supports PostgreSQL, MySQL, and SQLite.',
      pricing: 'Free / Open source',
      features: ['type-safe SQL queries', 'query builder', 'migration support', 'plugin system', 'zero runtime overhead', 'raw SQL support', 'dialect plugins'],
      integrations: ['PostgreSQL', 'MySQL', 'SQLite', 'PlanetScale', 'Neon', 'Cloudflare D1', 'Turso', 'Node.js', 'Deno', 'Bun'],
      bestFor: ['SQL purists wanting type safety', 'complex queries', 'minimal abstraction over SQL', 'performance-sensitive applications'],
      worstFor: ['teams wanting full ORM features', 'rapid prototyping needing auto-generated schemas', 'developers unfamiliar with SQL'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://kysely.dev',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FRONTEND FRAMEWORKS (10)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Next.js',
      category: 'frontend-framework',
      description:
        'React framework for production. Provides server-side rendering, static generation, API routes, file-based routing, and app directory with React Server Components. The most popular full-stack React framework.',
      pricing: 'Free / Open source; Vercel hosting separate',
      features: ['App Router (RSC)', 'server-side rendering', 'static site generation', 'API routes', 'file-based routing', 'image optimization', 'middleware', 'incremental static regeneration'],
      integrations: ['React', 'Vercel', 'Prisma', 'tRPC', 'Tailwind CSS', 'Supabase', 'Auth.js', 'Stripe', 'Sanity', 'Contentful'],
      bestFor: ['full-stack React apps', 'SEO-critical sites', 'e-commerce', 'SaaS applications', 'marketing sites needing performance'],
      worstFor: ['simple static sites where Astro suffices', 'teams wanting non-React frameworks', 'Vercel lock-in concerns', 'simple SPAs'],
      trustScore: 0.93,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://nextjs.org',
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
      name: 'Nuxt',
      category: 'frontend-framework',
      description:
        'Vue.js meta-framework for building full-stack web applications. Provides server-side rendering, auto-imports, file-based routing, and a powerful module ecosystem. The Vue equivalent of Next.js.',
      pricing: 'Free / Open source',
      features: ['server-side rendering', 'static site generation', 'auto-imports', 'file-based routing', 'Nitro server engine', 'module ecosystem', 'hybrid rendering', 'DevTools'],
      integrations: ['Vue 3', 'Tailwind CSS', 'Pinia', 'Prisma', 'Supabase', 'Strapi', 'Vercel', 'Netlify', 'Cloudflare', 'Drizzle'],
      bestFor: ['Vue.js applications', 'SEO-critical sites', 'full-stack Vue apps', 'content-driven websites', 'teams preferring Vue over React'],
      worstFor: ['React-only teams', 'simple client-side SPAs', 'projects needing maximum React ecosystem access'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://nuxt.com',
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
      name: 'SvelteKit',
      category: 'frontend-framework',
      description:
        'Full-stack framework built on Svelte. Provides file-based routing, server-side rendering, API endpoints, and form actions. Compiles to minimal JavaScript with no virtual DOM overhead.',
      pricing: 'Free / Open source',
      features: ['file-based routing', 'server-side rendering', 'API endpoints', 'form actions', 'layout system', 'load functions', 'adapter system', 'streaming'],
      integrations: ['Svelte', 'Tailwind CSS', 'Prisma', 'Drizzle', 'Supabase', 'Vercel', 'Netlify', 'Cloudflare', 'Turso', 'Auth.js'],
      bestFor: ['performance-critical apps', 'developers wanting less boilerplate', 'small to medium apps', 'interactive UIs', 'compile-time optimization fans'],
      worstFor: ['large teams needing extensive ecosystem', 'React/Vue-only organizations', 'projects requiring many third-party component libraries'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://kit.svelte.dev',
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
      name: 'Remix',
      category: 'frontend-framework',
      description:
        'Full-stack React framework focused on web standards and progressive enhancement. Emphasizes server-side rendering, nested routing, and form handling. Now part of React Router v7.',
      pricing: 'Free / Open source',
      features: ['nested routing', 'loader/action pattern', 'progressive enhancement', 'error boundaries', 'parallel data loading', 'form handling', 'streaming SSR', 'prefetching'],
      integrations: ['React', 'Tailwind CSS', 'Prisma', 'Cloudflare Workers', 'Vercel', 'Netlify', 'Fly.io', 'Supabase', 'Auth.js'],
      bestFor: ['web-standards focused teams', 'progressive enhancement', 'data-heavy applications', 'teams wanting better React patterns', 'accessibility-first projects'],
      worstFor: ['teams wanting static site generation', 'React Server Components adoption', 'large ecosystem of Next.js plugins'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://remix.run',
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
      name: 'Astro',
      category: 'frontend-framework',
      description:
        'Web framework for content-driven websites. Ships zero JavaScript by default using an Islands architecture. Supports React, Vue, Svelte, and other UI components. Excellent for blogs, docs, and marketing sites.',
      pricing: 'Free / Open source; Astro Studio from $7/mo',
      features: ['Islands architecture', 'zero JS by default', 'multi-framework support', 'content collections', 'view transitions', 'SSR/SSG/hybrid', 'MDX support', 'image optimization'],
      integrations: ['React', 'Vue', 'Svelte', 'Solid', 'Tailwind CSS', 'Vercel', 'Netlify', 'Cloudflare', 'Starlight (docs)', 'Markdoc'],
      bestFor: ['content-driven sites', 'documentation', 'blogs', 'marketing sites', 'portfolio sites', 'performance-critical static sites'],
      worstFor: ['highly interactive SPAs', 'complex client-side state management', 'real-time applications'],
      trustScore: 0.89,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://astro.build',
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
      name: 'SolidStart',
      category: 'frontend-framework',
      description:
        'Meta-framework for SolidJS. Provides file-based routing, server functions, SSR/SSG, and API routes. Uses fine-grained reactivity for excellent performance without a virtual DOM.',
      pricing: 'Free / Open source',
      features: ['file-based routing', 'server functions', 'SSR/SSG', 'API routes', 'fine-grained reactivity', 'Vinxi-based', 'middleware support'],
      integrations: ['SolidJS', 'Tailwind CSS', 'Prisma', 'Drizzle', 'Vercel', 'Netlify', 'Cloudflare', 'Vinxi'],
      bestFor: ['performance-obsessed developers', 'SolidJS users', 'React-like DX without virtual DOM', 'fine-grained reactivity needs'],
      worstFor: ['teams needing large component library ecosystem', 'React/Vue organizations', 'enterprise projects needing battle-tested stability'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://start.solidjs.com',
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
      name: 'Qwik',
      category: 'frontend-framework',
      description:
        'Resumable web framework that achieves instant loading by serializing execution state into HTML. Eliminates hydration overhead with fine-grained lazy loading of JavaScript.',
      pricing: 'Free / Open source',
      features: ['resumability (no hydration)', 'fine-grained lazy loading', 'Qwik City (meta-framework)', 'file-based routing', 'middleware', 'React component compatibility', 'edge-optimized'],
      integrations: ['Tailwind CSS', 'Vercel', 'Netlify', 'Cloudflare', 'React (via qwikify)', 'Prisma', 'Drizzle'],
      bestFor: ['instant page loads', 'large applications wanting minimal JS', 'edge deployments', 'e-commerce performance'],
      worstFor: ['small apps where hydration cost is negligible', 'teams wanting mature ecosystem', 'heavy client-side interactivity'],
      trustScore: 0.76,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://qwik.dev',
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
      name: 'Angular',
      category: 'frontend-framework',
      description:
        'Full-featured TypeScript-first web framework by Google. Provides dependency injection, RxJS integration, powerful CLI, and comprehensive tooling. Widely used in enterprise applications.',
      pricing: 'Free / Open source',
      features: ['dependency injection', 'RxJS integration', 'Angular CLI', 'signals', 'standalone components', 'SSR with Angular Universal', 'forms (reactive/template)', 'routing', 'testing utilities'],
      integrations: ['TypeScript', 'RxJS', 'NgRx', 'Angular Material', 'Tailwind CSS', 'Firebase', 'NestJS', 'Nx', 'Storybook', 'Cypress'],
      bestFor: ['enterprise applications', 'large teams needing structure', 'complex forms and validation', 'Google Cloud projects', 'long-lived codebases'],
      worstFor: ['small projects or prototypes', 'teams wanting minimal framework overhead', 'developers preferring simpler mental models', 'quick MVPs'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://angular.dev',
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
      name: 'Vue.js',
      category: 'frontend-framework',
      description:
        'Progressive JavaScript framework for building user interfaces. Features the Composition API, single-file components, and an approachable learning curve. Strong ecosystem with Vue Router and Pinia.',
      pricing: 'Free / Open source',
      features: ['Composition API', 'single-file components', 'reactive system', 'Vue Router', 'Pinia state management', 'template syntax', 'Suspense', 'Teleport'],
      integrations: ['Nuxt', 'Pinia', 'Vue Router', 'Tailwind CSS', 'Vuetify', 'PrimeVue', 'Vite', 'Vitest', 'Storybook', 'Cypress'],
      bestFor: ['progressive adoption', 'teams wanting approachable framework', 'template-based UI development', 'medium complexity SPAs', 'Chinese tech ecosystem'],
      worstFor: ['React-only job markets', 'teams needing maximum third-party component libraries', 'SSR without Nuxt'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://vuejs.org',
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
      name: 'Svelte',
      category: 'frontend-framework',
      description:
        'Component framework that compiles to minimal imperative JavaScript at build time. No virtual DOM, no runtime overhead. Svelte 5 introduces runes for fine-grained reactivity.',
      pricing: 'Free / Open source',
      features: ['compile-time framework', 'no virtual DOM', 'runes (Svelte 5)', 'scoped CSS', 'transitions/animations', 'stores', 'two-way binding', 'small bundle size'],
      integrations: ['SvelteKit', 'Tailwind CSS', 'Vite', 'Vitest', 'Storybook', 'TypeScript', 'Drizzle', 'Prisma'],
      bestFor: ['small to medium apps', 'performance-sensitive UIs', 'developers wanting simplicity', 'less JavaScript shipped', 'interactive widgets'],
      worstFor: ['large enterprise teams needing big ecosystem', 'existing React/Vue codebases', 'job market breadth', 'complex state management patterns'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://svelte.dev',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MOBILE (5)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'React Native',
      category: 'mobile',
      description:
        'Cross-platform mobile framework by Meta. Build native iOS and Android apps using React and JavaScript/TypeScript. Large ecosystem of libraries and strong community support.',
      pricing: 'Free / Open source',
      features: ['native rendering', 'hot reloading', 'JavaScript/TypeScript', 'Hermes engine', 'New Architecture (Fabric)', 'Turbo Modules', 'platform-specific code', 'large library ecosystem'],
      integrations: ['React', 'Expo', 'TypeScript', 'React Navigation', 'Redux', 'Firebase', 'Supabase', 'Sentry', 'CodePush', 'Detox'],
      bestFor: ['teams with React experience', 'cross-platform apps', 'rapid mobile development', 'code sharing with web', 'startups needing iOS + Android'],
      worstFor: ['graphics-intensive games', 'apps needing deep native OS integration', 'teams wanting native-first experience', 'complex animations at 120fps'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://reactnative.dev',
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
      name: 'Expo',
      category: 'mobile',
      description:
        'Platform for building universal React Native apps. Provides managed workflow, EAS Build/Submit, over-the-air updates, and a curated set of native modules. Simplifies React Native development significantly.',
      pricing: 'Free tier; Production $99/mo; Enterprise custom',
      features: ['managed workflow', 'EAS Build', 'EAS Submit', 'EAS Update (OTA)', 'Expo Router (file-based routing)', 'Expo Modules API', 'development builds', 'web support'],
      integrations: ['React Native', 'TypeScript', 'React Navigation', 'Expo Router', 'Firebase', 'Supabase', 'Sentry', 'RevenueCat', 'GitHub Actions'],
      bestFor: ['React Native development', 'rapid mobile prototyping', 'universal apps (iOS/Android/web)', 'over-the-air updates', 'teams wanting managed infrastructure'],
      worstFor: ['apps needing unsupported native modules', 'very large app binaries', 'teams wanting full native control', 'Bluetooth-heavy applications'],
      trustScore: 0.89,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://expo.dev',
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
      name: 'Flutter',
      category: 'mobile',
      description:
        'Google cross-platform UI toolkit using Dart language. Renders with its own engine (Skia/Impeller) for consistent pixel-perfect UIs across iOS, Android, web, and desktop from a single codebase.',
      pricing: 'Free / Open source',
      features: ['custom rendering engine', 'hot reload', 'widget system', 'Dart language', 'Material/Cupertino widgets', 'platform channels', 'web/desktop support', 'Impeller renderer'],
      integrations: ['Firebase', 'Dart', 'Riverpod', 'Bloc', 'Supabase', 'Google Cloud', 'Sentry', 'Codemagic', 'Fastlane'],
      bestFor: ['pixel-perfect cross-platform UIs', 'rapid prototyping', 'teams willing to learn Dart', 'apps needing consistent UI across platforms', 'Google ecosystem'],
      worstFor: ['teams committed to JavaScript/TypeScript', 'apps needing native platform feel', 'web-first projects', 'large existing native codebases'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://flutter.dev',
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
      name: 'Ionic',
      category: 'mobile',
      description:
        'Cross-platform mobile UI framework using web technologies. Build apps with Angular, React, or Vue that run on iOS, Android, and web using Capacitor or Cordova for native access.',
      pricing: 'Free / Open source; Ionic Enterprise from custom pricing',
      features: ['web-based UI components', 'Angular/React/Vue support', 'Capacitor integration', 'adaptive styling', 'Ionic CLI', 'Appflow (CI/CD)', 'PWA support'],
      integrations: ['Angular', 'React', 'Vue', 'Capacitor', 'Cordova', 'Firebase', 'TypeScript', 'Stencil', 'Tailwind CSS'],
      bestFor: ['web developers building mobile apps', 'teams with Angular/React/Vue experience', 'PWA-first apps', 'rapid mobile prototyping'],
      worstFor: ['performance-critical native features', 'complex animations', 'apps needing heavy native integration', 'gaming'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://ionicframework.com',
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
      name: 'Capacitor',
      category: 'mobile',
      description:
        'Native runtime for building cross-platform web apps. Created by the Ionic team as a modern Cordova replacement. Wraps any web app into a native iOS/Android container with access to native APIs.',
      pricing: 'Free / Open source',
      features: ['native API access', 'plugin system', 'any web framework support', 'live reload', 'native project access', 'PWA support', 'Cordova plugin compatibility'],
      integrations: ['React', 'Angular', 'Vue', 'Svelte', 'Next.js', 'Ionic', 'Firebase', 'Tailwind CSS', 'TypeScript'],
      bestFor: ['wrapping existing web apps as native', 'web developers needing native access', 'PWA-to-native conversion', 'teams wanting framework freedom'],
      worstFor: ['apps needing 100% native performance', 'complex native UI components', 'AR/VR applications', 'heavy background processing'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://capacitorjs.com',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEPLOYMENT / IaC (8)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Terraform',
      category: 'infrastructure',
      description:
        'Infrastructure as Code tool by HashiCorp. Define cloud resources in HCL (HashiCorp Configuration Language) and provision across AWS, Azure, GCP, and hundreds of other providers with a declarative workflow.',
      pricing: 'Free / Open source (BSL); Terraform Cloud free tier; Plus $588/yr per user; Enterprise custom',
      features: ['declarative HCL syntax', 'multi-cloud support', 'state management', 'plan/apply workflow', 'modules', 'provider ecosystem', 'import existing resources', 'workspaces'],
      integrations: ['AWS', 'Azure', 'GCP', 'Cloudflare', 'DigitalOcean', 'Kubernetes', 'GitHub Actions', 'GitLab CI', 'Vault', 'Consul'],
      bestFor: ['multi-cloud infrastructure', 'reproducible environments', 'infrastructure versioning', 'large-scale cloud management', 'compliance-driven orgs'],
      worstFor: ['simple single-server deployments', 'teams wanting imperative scripting', 'rapidly changing prototypes', 'BSL license concerns'],
      trustScore: 0.91,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://terraform.io',
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
      name: 'Pulumi',
      category: 'infrastructure',
      description:
        'Infrastructure as Code using real programming languages (TypeScript, Python, Go, C#, Java). Alternative to Terraform that lets developers use familiar languages instead of DSLs for cloud provisioning.',
      pricing: 'Free / Open source (individual); Team $50/user/mo; Business $75/user/mo; Enterprise custom',
      features: ['real programming languages', 'multi-cloud support', 'state management', 'policy as code', 'secrets management', 'Pulumi AI', 'import resources', 'component resources'],
      integrations: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Cloudflare', 'DigitalOcean', 'GitHub Actions', 'GitLab CI', 'TypeScript', 'Python'],
      bestFor: ['developers who prefer real languages over HCL', 'TypeScript/Python teams', 'complex infrastructure logic', 'testing infrastructure code'],
      worstFor: ['ops teams comfortable with HCL', 'organizations standardized on Terraform', 'simple infrastructure needs'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://pulumi.com',
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
      name: 'AWS CDK',
      category: 'infrastructure',
      description:
        'AWS Cloud Development Kit. Define AWS cloud infrastructure using TypeScript, Python, Java, C#, or Go. Synthesizes to CloudFormation templates. First-class AWS integration with L2/L3 constructs.',
      pricing: 'Free / Open source',
      features: ['TypeScript/Python/Java/Go support', 'L2 constructs (sensible defaults)', 'L3 patterns', 'CloudFormation synthesis', 'asset bundling', 'testing support', 'CDK Pipelines'],
      integrations: ['AWS', 'CloudFormation', 'TypeScript', 'Python', 'GitHub Actions', 'CodePipeline', 'Lambda', 'S3', 'DynamoDB', 'ECS'],
      bestFor: ['AWS-heavy organizations', 'developers wanting code over YAML', 'complex AWS architectures', 'teams using TypeScript'],
      worstFor: ['multi-cloud needs', 'non-AWS environments', 'simple infrastructure', 'teams preferring declarative HCL'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://aws.amazon.com/cdk/',
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
      name: 'Docker',
      category: 'infrastructure',
      description:
        'Container platform for building, sharing, and running applications. Packages apps and dependencies into portable containers. Industry standard for containerization with Docker Desktop, Hub, and Compose.',
      pricing: 'Free (Personal); Pro $5/mo; Team $9/user/mo; Business $24/user/mo',
      features: ['container runtime', 'Dockerfile builds', 'Docker Compose', 'Docker Hub', 'multi-stage builds', 'BuildKit', 'volumes', 'networking', 'Docker Scout (security)'],
      integrations: ['Kubernetes', 'GitHub Actions', 'GitLab CI', 'AWS ECS', 'Azure Container Apps', 'Google Cloud Run', 'Terraform', 'Nginx', 'PostgreSQL', 'Redis'],
      bestFor: ['reproducible environments', 'microservices', 'CI/CD pipelines', 'development environments', 'application packaging'],
      worstFor: ['macOS/Windows native performance', 'GPU-intensive workloads', 'very simple single-process apps', 'teams with strong VM expertise'],
      trustScore: 0.93,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://docker.com',
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
      name: 'Kubernetes',
      category: 'infrastructure',
      description:
        'Container orchestration platform for automating deployment, scaling, and management of containerized applications. The industry standard for running containers at scale in production.',
      pricing: 'Free / Open source; managed services (EKS, GKE, AKS) have separate costs',
      features: ['container orchestration', 'auto-scaling', 'service discovery', 'rolling updates', 'self-healing', 'secrets management', 'config maps', 'RBAC', 'custom resources (CRDs)'],
      integrations: ['Docker', 'Helm', 'Terraform', 'ArgoCD', 'Prometheus', 'Grafana', 'Istio', 'AWS EKS', 'Google GKE', 'Azure AKS'],
      bestFor: ['large-scale container orchestration', 'microservices at scale', 'multi-cloud deployments', 'auto-scaling workloads', 'enterprise infrastructure'],
      worstFor: ['small applications', 'solo developers', 'simple deployments', 'teams without DevOps expertise', 'cost-sensitive small projects'],
      trustScore: 0.92,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://kubernetes.io',
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
      name: 'Helm',
      category: 'infrastructure',
      description:
        'Package manager for Kubernetes. Define, install, and upgrade complex Kubernetes applications using reusable charts. The standard way to package and distribute Kubernetes applications.',
      pricing: 'Free / Open source',
      features: ['chart packaging', 'templating', 'release management', 'rollback support', 'dependency management', 'chart repositories', 'hooks', 'values overrides'],
      integrations: ['Kubernetes', 'ArgoCD', 'Flux', 'GitHub Actions', 'GitLab CI', 'Terraform', 'Artifact Hub', 'Prometheus', 'Grafana'],
      bestFor: ['Kubernetes application packaging', 'repeatable deployments', 'complex multi-resource apps', 'sharing Kubernetes configurations', 'release management'],
      worstFor: ['non-Kubernetes environments', 'simple single-manifest deployments', 'teams wanting Kustomize simplicity', 'template debugging'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://helm.sh',
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
      name: 'ArgoCD',
      category: 'infrastructure',
      description:
        'Declarative GitOps continuous delivery tool for Kubernetes. Automatically syncs cluster state with Git repository definitions. Provides a web UI, CLI, and API for managing deployments.',
      pricing: 'Free / Open source',
      features: ['GitOps workflow', 'automatic sync', 'web UI dashboard', 'multi-cluster support', 'SSO integration', 'RBAC', 'health status monitoring', 'rollback', 'application sets'],
      integrations: ['Kubernetes', 'Helm', 'Kustomize', 'GitHub', 'GitLab', 'Prometheus', 'Grafana', 'Vault', 'OIDC providers'],
      bestFor: ['GitOps deployments', 'Kubernetes CD', 'multi-cluster management', 'audit trail for deployments', 'declarative infrastructure'],
      worstFor: ['non-Kubernetes environments', 'simple CI/CD needs', 'teams not using Git-based workflows', 'serverless deployments'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://argoproj.github.io/cd/',
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
      name: 'Flux',
      category: 'infrastructure',
      description:
        'GitOps toolkit for Kubernetes by Weaveworks. CNCF graduated project that keeps clusters in sync with Git sources. Supports Helm, Kustomize, and plain YAML with progressive delivery.',
      pricing: 'Free / Open source',
      features: ['GitOps automation', 'Helm controller', 'Kustomize controller', 'image automation', 'notification controller', 'multi-tenancy', 'health assessment', 'dependency management'],
      integrations: ['Kubernetes', 'Helm', 'Kustomize', 'GitHub', 'GitLab', 'Bitbucket', 'Prometheus', 'Grafana', 'Flagger', 'OCI registries'],
      bestFor: ['Kubernetes GitOps', 'CNCF-aligned organizations', 'multi-tenant clusters', 'automated image updates', 'progressive delivery'],
      worstFor: ['non-Kubernetes environments', 'teams wanting a web UI (use Weave GitOps)', 'simple deployments', 'non-Git workflows'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://fluxcd.io',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // QUEUE / STREAMING (5)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'RabbitMQ',
      category: 'messaging',
      description:
        'Widely deployed open-source message broker supporting AMQP, MQTT, and STOMP protocols. Provides reliable message delivery, flexible routing, clustering, and a management UI.',
      pricing: 'Free / Open source; CloudAMQP managed from free tier to $499/mo+',
      features: ['AMQP protocol', 'exchange/queue routing', 'clustering', 'management UI', 'plugins', 'dead-letter queues', 'priority queues', 'streams', 'quorum queues'],
      integrations: ['Node.js', 'Python', 'Java', 'Go', 'Ruby', '.NET', 'Spring Boot', 'Docker', 'Kubernetes', 'Terraform'],
      bestFor: ['task queues', 'microservice communication', 'reliable message delivery', 'complex routing patterns', 'teams familiar with AMQP'],
      worstFor: ['ultra-high-throughput streaming (Kafka better)', 'simple pub/sub (Redis better)', 'teams wanting fully managed service'],
      trustScore: 0.89,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://rabbitmq.com',
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
      name: 'Apache Kafka',
      category: 'messaging',
      description:
        'Distributed event streaming platform for high-throughput, fault-tolerant data pipelines. Handles trillions of events per day at companies like LinkedIn, Netflix, and Uber. De facto standard for event streaming.',
      pricing: 'Free / Open source; Confluent Cloud from $0.00/hr (pay-as-you-go); Confluent Platform Enterprise custom',
      features: ['distributed log', 'topic partitioning', 'consumer groups', 'exactly-once semantics', 'Kafka Connect', 'Kafka Streams', 'Schema Registry', 'compacted topics', 'high throughput'],
      integrations: ['Java', 'Python', 'Node.js', 'Go', 'Confluent', 'Spark', 'Flink', 'Debezium', 'Kubernetes', 'Terraform'],
      bestFor: ['event-driven architecture', 'high-throughput data pipelines', 'real-time analytics', 'CDC (change data capture)', 'log aggregation'],
      worstFor: ['simple task queues', 'small teams without Kafka expertise', 'low-throughput use cases', 'operational simplicity needs'],
      trustScore: 0.92,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://kafka.apache.org',
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
      name: 'AWS SQS',
      category: 'messaging',
      description:
        'Fully managed message queuing service from AWS. Offers standard and FIFO queues with virtually unlimited throughput. Requires zero operational overhead and integrates deeply with the AWS ecosystem.',
      pricing: 'Free tier 1M requests/mo; Standard $0.40/million requests; FIFO $0.50/million requests',
      features: ['standard queues', 'FIFO queues', 'dead-letter queues', 'message visibility timeout', 'long polling', 'server-side encryption', 'message deduplication', 'virtually unlimited throughput'],
      integrations: ['AWS Lambda', 'AWS SNS', 'AWS EventBridge', 'AWS CDK', 'Terraform', 'Node.js', 'Python', 'Java', 'Go', 'Docker'],
      bestFor: ['AWS-native architectures', 'serverless workflows', 'reliable message delivery', 'zero-ops queue management', 'Lambda triggers'],
      worstFor: ['multi-cloud needs', 'non-AWS environments', 'complex routing (RabbitMQ better)', 'streaming use cases (Kafka better)'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://aws.amazon.com/sqs/',
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
      name: 'Redis Streams',
      category: 'messaging',
      description:
        'Append-only log data structure in Redis for event streaming. Provides consumer groups, message acknowledgment, and persistence. Lightweight alternative to Kafka for moderate-scale streaming.',
      pricing: 'Free / Open source (part of Redis); Redis Cloud from free tier',
      features: ['append-only log', 'consumer groups', 'message acknowledgment', 'range queries', 'trimming', 'blocking reads', 'persistence', 'cluster support'],
      integrations: ['Redis', 'Node.js', 'Python', 'Java', 'Go', 'Ruby', 'Docker', 'Kubernetes', 'Redis Cloud', 'Upstash'],
      bestFor: ['lightweight event streaming', 'teams already using Redis', 'moderate-scale streaming', 'real-time data feeds', 'simpler alternative to Kafka'],
      worstFor: ['very high-throughput streaming', 'complex event processing', 'teams needing Kafka ecosystem (Connect, Streams)', 'multi-datacenter replication'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://redis.io/docs/data-types/streams/',
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
      name: 'NATS',
      category: 'messaging',
      description:
        'High-performance cloud-native messaging system. Supports pub/sub, request/reply, and JetStream for persistent messaging. Extremely lightweight and fast with simple operation.',
      pricing: 'Free / Open source; Synadia Cloud managed offering available',
      features: ['pub/sub messaging', 'request/reply', 'JetStream (persistence)', 'key-value store', 'object store', 'clustering', 'leaf nodes', 'WebSocket support', 'subject-based routing'],
      integrations: ['Go', 'Node.js', 'Python', 'Java', 'Rust', 'C', 'Kubernetes', 'Docker', 'Terraform', 'Prometheus'],
      bestFor: ['microservice communication', 'IoT messaging', 'edge computing', 'high-performance pub/sub', 'simple operational model'],
      worstFor: ['teams needing Kafka-level ecosystem', 'complex message routing', 'AMQP protocol requirements', 'enterprise support needs'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://nats.io',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AI/ML TOOLS (10)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'LangChain',
      category: 'ai-ml',
      description:
        'Framework for developing applications powered by LLMs. Provides chains, agents, tools, memory, and retrieval augmented generation (RAG) patterns. Available for Python and JavaScript/TypeScript.',
      pricing: 'Free / Open source; LangSmith (observability) from free tier to $39/seat/mo+',
      features: ['chains and agents', 'RAG support', 'tool/function calling', 'memory management', 'document loaders', 'vector store integration', 'LangSmith (tracing)', 'LangGraph (workflows)'],
      integrations: ['OpenAI', 'Anthropic', 'Google Gemini', 'Hugging Face', 'Pinecone', 'Weaviate', 'Chroma', 'Supabase', 'Redis', 'PostgreSQL'],
      bestFor: ['LLM application development', 'RAG systems', 'AI agent building', 'rapid prototyping with LLMs', 'document Q&A'],
      worstFor: ['production systems needing minimal dependencies', 'simple API calls to LLMs', 'teams wanting full control over LLM interactions', 'performance-critical applications'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://langchain.com',
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
      name: 'LlamaIndex',
      category: 'ai-ml',
      description:
        'Data framework for LLM applications. Specializes in connecting LLMs with private data through indexing, retrieval, and query interfaces. Excellent for building RAG pipelines and knowledge-augmented AI.',
      pricing: 'Free / Open source; LlamaCloud from $30/mo',
      features: ['data connectors (160+)', 'indexing strategies', 'query engines', 'chat engines', 'agents', 'RAG pipelines', 'evaluation framework', 'LlamaParse (document parsing)'],
      integrations: ['OpenAI', 'Anthropic', 'Google Gemini', 'Hugging Face', 'Pinecone', 'Weaviate', 'Chroma', 'Qdrant', 'PostgreSQL', 'MongoDB'],
      bestFor: ['RAG pipelines', 'document Q&A', 'knowledge base building', 'structured data querying with LLMs', 'private data augmentation'],
      worstFor: ['non-RAG LLM applications', 'simple chatbot flows', 'teams wanting minimal framework overhead', 'real-time streaming applications'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://llamaindex.ai',
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
      name: 'Vercel AI SDK',
      category: 'ai-ml',
      description:
        'TypeScript library for building AI-powered user interfaces. Provides React hooks, streaming utilities, and a unified API for working with multiple LLM providers. First-class Next.js integration.',
      pricing: 'Free / Open source',
      features: ['useChat hook', 'useCompletion hook', 'streaming support', 'multi-provider support', 'tool/function calling', 'structured output', 'AI RSC (server components)', 'edge runtime support'],
      integrations: ['OpenAI', 'Anthropic', 'Google Gemini', 'Mistral', 'Cohere', 'Next.js', 'React', 'Svelte', 'Vue', 'Nuxt', 'SolidJS'],
      bestFor: ['AI chat interfaces', 'streaming LLM responses in React', 'Next.js AI features', 'multi-provider LLM apps', 'TypeScript AI development'],
      worstFor: ['backend-only AI pipelines', 'non-JavaScript environments', 'complex agent workflows', 'batch processing'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://sdk.vercel.ai',
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
      name: 'OpenRouter',
      category: 'ai-ml',
      description:
        'Unified API for accessing 200+ LLMs from multiple providers. Acts as a router/proxy, letting developers switch between models without code changes. Pay-per-token with no monthly minimums.',
      pricing: 'Pay-per-token; varies by model; no minimum spend; some free models available',
      features: ['200+ models', 'unified API (OpenAI-compatible)', 'automatic fallback', 'rate limit management', 'model comparison', 'usage analytics', 'free model tier', 'streaming support'],
      integrations: ['OpenAI SDK (compatible)', 'LangChain', 'LlamaIndex', 'Vercel AI SDK', 'Python', 'TypeScript', 'Cursor', 'Continue', 'any OpenAI-compatible client'],
      bestFor: ['model experimentation', 'multi-model applications', 'cost optimization across providers', 'accessing latest models quickly', 'API key consolidation'],
      worstFor: ['teams committed to a single provider', 'lowest possible latency needs', 'enterprise SLAs', 'data residency requirements'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://openrouter.ai',
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
      name: 'Weights & Biases',
      category: 'ai-ml',
      description:
        'ML experiment tracking, model versioning, and dataset management platform. Track training runs, visualize metrics, compare experiments, and collaborate on ML projects. Used by OpenAI, NVIDIA, and Microsoft.',
      pricing: 'Free for personal; Team $50/user/mo; Enterprise custom',
      features: ['experiment tracking', 'model versioning', 'dataset versioning', 'hyperparameter sweeps', 'dashboards', 'reports', 'artifacts', 'model registry', 'W&B Launch'],
      integrations: ['PyTorch', 'TensorFlow', 'Hugging Face', 'Keras', 'scikit-learn', 'XGBoost', 'LightGBM', 'JAX', 'Kubernetes', 'Docker'],
      bestFor: ['ML experiment tracking', 'team collaboration on ML', 'hyperparameter optimization', 'model comparison', 'reproducible ML workflows'],
      worstFor: ['non-ML projects', 'teams not doing model training', 'simple inference-only applications', 'budget-constrained small teams'],
      trustScore: 0.89,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://wandb.ai',
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
      name: 'MLflow',
      category: 'ai-ml',
      description:
        'Open-source platform for managing the ML lifecycle. Covers experiment tracking, model packaging, registry, and deployment. Created by Databricks and widely used in enterprise ML.',
      pricing: 'Free / Open source; Databricks managed MLflow included in Databricks plans',
      features: ['experiment tracking', 'model registry', 'model packaging (MLmodel)', 'model serving', 'project packaging', 'artifact store', 'auto-logging', 'LLM evaluation'],
      integrations: ['PyTorch', 'TensorFlow', 'scikit-learn', 'Spark', 'Databricks', 'AWS SageMaker', 'Azure ML', 'Kubernetes', 'Docker', 'LangChain'],
      bestFor: ['enterprise ML lifecycle management', 'model versioning and registry', 'Databricks users', 'open-source ML tracking', 'reproducible experiments'],
      worstFor: ['simple LLM API projects', 'teams wanting SaaS-only solution', 'small projects not needing full lifecycle management'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://mlflow.org',
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
      name: 'Ray',
      category: 'ai-ml',
      description:
        'Distributed computing framework for scaling AI and Python workloads. Provides libraries for training (Ray Train), serving (Ray Serve), tuning (Ray Tune), and reinforcement learning (RLlib).',
      pricing: 'Free / Open source; Anyscale managed platform from usage-based pricing',
      features: ['distributed training', 'model serving (Ray Serve)', 'hyperparameter tuning', 'reinforcement learning', 'data processing', 'cluster management', 'auto-scaling', 'dashboard'],
      integrations: ['PyTorch', 'TensorFlow', 'Hugging Face', 'scikit-learn', 'XGBoost', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Docker'],
      bestFor: ['distributed ML training', 'scaling Python workloads', 'model serving at scale', 'hyperparameter search', 'reinforcement learning'],
      worstFor: ['single-machine workloads', 'non-Python environments', 'simple inference APIs', 'teams without distributed systems experience'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://ray.io',
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
      name: 'Modal',
      category: 'ai-ml',
      description:
        'Serverless cloud platform for running AI/ML workloads. Deploy Python functions with GPU access, auto-scaling, and pay-per-second billing. No Docker or Kubernetes knowledge required.',
      pricing: 'Free $30/mo credits; pay-per-second GPU compute; CPU $0.07/hr; T4 $0.59/hr; A100 $3.73/hr',
      features: ['serverless GPU compute', 'auto-scaling to zero', 'container snapshots', 'web endpoints', 'cron scheduling', 'volume mounts', 'secret management', 'Python-native API'],
      integrations: ['Python', 'PyTorch', 'Hugging Face', 'FastAPI', 'Jupyter', 'GPU (T4/A10/A100/H100)', 'Docker images', 'AWS S3'],
      bestFor: ['GPU workloads without infra management', 'model inference serving', 'batch ML processing', 'rapid ML experimentation', 'teams wanting serverless GPUs'],
      worstFor: ['non-Python workloads', 'long-running persistent services', 'teams wanting self-hosted control', 'very cost-sensitive high-utilization workloads'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://modal.com',
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
      name: 'Pinecone',
      category: 'ai-ml',
      description:
        'Managed vector database for AI applications. Purpose-built for similarity search at scale with low latency. Supports metadata filtering, namespaces, and hybrid search for RAG and recommendation systems.',
      pricing: 'Free tier (1 index, 100K vectors); Standard $8.25/mo per pod; Enterprise custom',
      features: ['vector similarity search', 'metadata filtering', 'namespaces', 'hybrid search', 'serverless indexes', 'pod-based indexes', 'collections', 'sparse-dense vectors'],
      integrations: ['LangChain', 'LlamaIndex', 'OpenAI', 'Anthropic', 'Hugging Face', 'Python', 'Node.js', 'Go', 'Java', 'Vercel AI SDK'],
      bestFor: ['RAG applications', 'semantic search', 'recommendation systems', 'managed vector DB needs', 'teams wanting zero-ops vector search'],
      worstFor: ['traditional SQL queries', 'teams wanting self-hosted solutions', 'very cost-sensitive projects', 'small datasets where simpler solutions work'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://pinecone.io',
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
      name: 'Weaviate',
      category: 'ai-ml',
      description:
        'Open-source vector database with built-in vectorization modules. Supports vector search, keyword search, and hybrid search. Provides automatic schema detection and GraphQL API.',
      pricing: 'Free / Open source (self-hosted); Weaviate Cloud from free tier; Standard from $25/mo',
      features: ['vector search', 'keyword search', 'hybrid search', 'built-in vectorizers', 'GraphQL API', 'REST API', 'multi-tenancy', 'replication', 'generative search'],
      integrations: ['LangChain', 'LlamaIndex', 'OpenAI', 'Anthropic', 'Hugging Face', 'Cohere', 'Python', 'TypeScript', 'Go', 'Java'],
      bestFor: ['self-hosted vector search', 'RAG applications', 'hybrid search needs', 'teams wanting built-in vectorization', 'GraphQL API preference'],
      worstFor: ['simple key-value lookups', 'teams needing only SQL', 'very small datasets', 'minimal infrastructure projects'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://weaviate.io',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOCUMENTATION (5)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Mintlify',
      category: 'documentation',
      description:
        'Modern documentation platform that generates beautiful docs from MDX files. Provides analytics, API playground, versioning, and AI-powered search. Used by Cursor, Vercel, and many developer tools.',
      pricing: 'Free (hobby); Startup $150/mo; Growth $500/mo; Enterprise custom',
      features: ['MDX-based docs', 'API playground', 'AI-powered search', 'analytics', 'versioning', 'custom components', 'OpenAPI integration', 'light/dark mode', 'Mintlify CLI'],
      integrations: ['GitHub', 'GitLab', 'OpenAPI/Swagger', 'Vercel', 'Netlify', 'MDX', 'React components', 'Intercom'],
      bestFor: ['developer documentation', 'API documentation', 'modern-looking docs', 'developer tool companies', 'teams wanting docs-as-code'],
      worstFor: ['non-technical documentation', 'teams wanting full CMS control', 'highly custom layouts', 'self-hosted requirements'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://mintlify.com',
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
      name: 'Docusaurus',
      category: 'documentation',
      description:
        'Open-source documentation framework by Meta. Build documentation websites with React and MDX. Supports versioning, search, i18n, and blog functionality out of the box.',
      pricing: 'Free / Open source',
      features: ['MDX support', 'versioning', 'i18n', 'blog', 'search (Algolia)', 'plugin system', 'themes', 'sidebar generation', 'TypeScript support'],
      integrations: ['React', 'MDX', 'Algolia', 'GitHub Pages', 'Vercel', 'Netlify', 'TypeScript', 'Mermaid diagrams'],
      bestFor: ['open-source project docs', 'technical documentation', 'teams wanting React-based docs', 'versioned documentation', 'self-hosted docs'],
      worstFor: ['non-React teams', 'simple single-page docs', 'WYSIWYG editing needs', 'non-technical content teams'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://docusaurus.io',
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
      name: 'GitBook',
      category: 'documentation',
      description:
        'Documentation platform with a visual editor, Git sync, and collaboration features. Supports public docs, internal wikis, and API documentation with a polished reading experience.',
      pricing: 'Free (personal); Plus $6.70/user/mo; Pro $12.50/user/mo; Enterprise custom',
      features: ['visual editor', 'Git sync', 'collaboration', 'API docs', 'custom domains', 'search', 'integrations', 'visitor authentication', 'PDF export'],
      integrations: ['GitHub', 'GitLab', 'Slack', 'Figma', 'OpenAPI', 'Google Analytics', 'Intercom', 'Jira', 'Linear'],
      bestFor: ['team documentation', 'knowledge bases', 'API documentation with visual editing', 'non-technical contributors', 'internal wikis'],
      worstFor: ['highly custom layouts', 'code-first documentation workflows', 'self-hosted needs', 'very large documentation sites'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://gitbook.com',
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
      name: 'ReadMe',
      category: 'documentation',
      description:
        'API documentation platform with an interactive API explorer, changelog, and developer hub. Provides metrics on API usage, guides, and recipes alongside auto-generated reference docs.',
      pricing: 'Free (basic); Startup $99/mo; Business $399/mo; Enterprise custom',
      features: ['interactive API explorer', 'OpenAPI import', 'changelog', 'guides/tutorials', 'API metrics', 'custom branding', 'user authentication', 'webhooks', 'code samples'],
      integrations: ['OpenAPI/Swagger', 'GitHub', 'Slack', 'Zapier', 'Segment', 'Intercom', 'Salesforce', 'Custom CSS'],
      bestFor: ['API-first companies', 'developer portals', 'API documentation with metrics', 'interactive API testing', 'developer onboarding'],
      worstFor: ['general documentation', 'self-hosted needs', 'budget-constrained startups', 'non-API documentation'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://readme.com',
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
      name: 'Swagger / OpenAPI',
      category: 'documentation',
      description:
        'Industry-standard specification for describing RESTful APIs. Swagger tools (Editor, UI, Codegen) and OpenAPI specification enable API design, documentation, and client/server code generation.',
      pricing: 'Free / Open source (Swagger tools); SwaggerHub from $75/mo per user',
      features: ['OpenAPI specification', 'Swagger Editor', 'Swagger UI', 'code generation', 'API design', 'mock servers', 'validation', 'interactive docs', 'multi-language support'],
      integrations: ['Express', 'Fastify', 'NestJS', 'Spring Boot', 'Django', 'FastAPI', 'Postman', 'Insomnia', 'ReadMe', 'Mintlify'],
      bestFor: ['API documentation', 'API design-first workflows', 'client SDK generation', 'standardized API contracts', 'team collaboration on API design'],
      worstFor: ['GraphQL APIs', 'gRPC APIs', 'non-REST architectures', 'simple internal APIs'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://swagger.io',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTHENTICATION ADDONS (5)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'NextAuth.js (Auth.js)',
      category: 'auth',
      description:
        'Open-source authentication library for Next.js and other frameworks. Supports OAuth, email/password, magic links, and WebAuthn. Framework-agnostic as Auth.js with adapters for SvelteKit, Nuxt, and more.',
      pricing: 'Free / Open source',
      features: ['OAuth providers (80+)', 'email/password', 'magic links', 'WebAuthn/passkeys', 'JWT/session strategies', 'database adapters', 'role-based access', 'callbacks and events'],
      integrations: ['Next.js', 'SvelteKit', 'Nuxt', 'Express', 'Prisma', 'Drizzle', 'TypeORM', 'Supabase', 'MongoDB', 'PostgreSQL'],
      bestFor: ['Next.js authentication', 'OAuth integration', 'open-source auth needs', 'framework flexibility', 'self-hosted auth'],
      worstFor: ['complex enterprise SSO', 'pre-built auth UI components', 'teams wanting fully managed service', 'non-JS frameworks'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://authjs.dev',
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
      name: 'Passport.js',
      category: 'auth',
      description:
        'Authentication middleware for Node.js. Supports 500+ authentication strategies including OAuth, OpenID Connect, SAML, and local username/password. The most widely used Node.js auth library.',
      pricing: 'Free / Open source',
      features: ['500+ strategies', 'OAuth support', 'OpenID Connect', 'SAML', 'local auth', 'session management', 'middleware pattern', 'Express integration'],
      integrations: ['Express', 'Fastify', 'NestJS', 'Koa', 'Google OAuth', 'GitHub OAuth', 'Facebook OAuth', 'Twitter OAuth', 'LDAP'],
      bestFor: ['Express.js authentication', 'multi-strategy auth', 'social login integration', 'legacy Node.js projects', 'maximum strategy support'],
      worstFor: ['non-Express frameworks (Auth.js better)', 'modern passkey/WebAuthn needs', 'teams wanting batteries-included auth', 'type-safe auth'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://passportjs.org',
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
      name: 'jose',
      category: 'auth',
      description:
        'Universal JavaScript library for JSON Web Tokens (JWT), JSON Web Encryption (JWE), and JSON Web Signatures (JWS). Works in Node.js, browsers, Deno, Bun, and edge runtimes with zero dependencies.',
      pricing: 'Free / Open source',
      features: ['JWT sign/verify', 'JWE encrypt/decrypt', 'JWS support', 'JWKS support', 'zero dependencies', 'Web Crypto API', 'TypeScript support', 'all runtimes'],
      integrations: ['Node.js', 'Deno', 'Bun', 'Cloudflare Workers', 'Vercel Edge', 'browsers', 'TypeScript', 'any JavaScript runtime'],
      bestFor: ['JWT handling', 'token-based auth', 'edge runtime JWT', 'zero-dependency requirement', 'cross-runtime compatibility'],
      worstFor: ['full auth solution', 'OAuth flow management', 'session-based auth', 'teams wanting auth UI'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/panva/jose',
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
      name: 'node-oauth2-server',
      category: 'auth',
      description:
        'Complete, compliant, and well-tested OAuth 2.0 server implementation for Node.js. Supports authorization code, client credentials, refresh tokens, and custom grant types.',
      pricing: 'Free / Open source',
      features: ['authorization code grant', 'client credentials', 'refresh tokens', 'token revocation', 'scope validation', 'custom grant types', 'Express middleware', 'spec-compliant'],
      integrations: ['Express', 'Koa', 'Restify', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'TypeScript'],
      bestFor: ['building OAuth 2.0 servers', 'API authorization', 'machine-to-machine auth', 'custom token management', 'spec-compliant OAuth implementation'],
      worstFor: ['client-side auth', 'simple JWT needs', 'consumer-facing login UIs', 'teams wanting managed auth'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/oauthjs/node-oauth2-server',
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
      name: 'openid-client',
      category: 'auth',
      description:
        'Certified OpenID Connect Relying Party (client) implementation for Node.js. Supports dynamic discovery, registration, and all standard OpenID Connect flows including PKCE and DPoP.',
      pricing: 'Free / Open source',
      features: ['OpenID Connect flows', 'dynamic discovery', 'PKCE support', 'DPoP support', 'token introspection', 'userinfo endpoint', 'certified implementation', 'TypeScript support'],
      integrations: ['Node.js', 'Express', 'Fastify', 'Auth0', 'Keycloak', 'Okta', 'Azure AD', 'Google', 'any OIDC provider'],
      bestFor: ['OpenID Connect integration', 'enterprise SSO', 'certified OIDC flows', 'dynamic provider discovery', 'standards-compliant auth'],
      worstFor: ['simple OAuth-only needs', 'client-side authentication', 'non-OIDC providers', 'teams wanting full auth framework'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://github.com/panva/node-openid-client',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEVELOPER PRODUCTIVITY (10)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Turborepo',
      category: 'developer-tools',
      description:
        'High-performance monorepo build system by Vercel. Provides incremental builds, remote caching, task parallelization, and pipeline configuration for JavaScript/TypeScript monorepos.',
      pricing: 'Free / Open source; remote caching via Vercel (free tier available)',
      features: ['incremental builds', 'remote caching', 'task parallelization', 'pipeline DAG', 'pruned subsets', 'environment variable management', 'Vercel integration', 'watch mode'],
      integrations: ['Vercel', 'npm', 'pnpm', 'yarn', 'GitHub Actions', 'GitLab CI', 'Docker', 'TypeScript', 'Next.js', 'React'],
      bestFor: ['JavaScript/TypeScript monorepos', 'faster CI builds', 'remote caching', 'Vercel users', 'incremental build optimization'],
      worstFor: ['polyglot monorepos (Nx better)', 'single-package repos', 'non-JS projects', 'teams wanting code generation features'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://turbo.build',
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
      name: 'Nx',
      category: 'developer-tools',
      description:
        'Smart monorepo build system with first-class support for many languages and frameworks. Provides computation caching, task distribution, code generation, and dependency graph visualization.',
      pricing: 'Free / Open source; Nx Cloud free tier; Pro from $8/contributor/mo; Enterprise custom',
      features: ['computation caching', 'distributed task execution', 'code generators', 'dependency graph', 'affected commands', 'plugins (React/Angular/Node/Go)', 'module boundary rules', 'Nx Cloud'],
      integrations: ['React', 'Angular', 'Vue', 'Next.js', 'Nest.js', 'Express', 'Storybook', 'Cypress', 'Jest', 'GitHub Actions'],
      bestFor: ['large monorepos', 'polyglot projects', 'Angular + React organizations', 'code generation needs', 'enforcing module boundaries'],
      worstFor: ['simple single-package repos', 'teams wanting minimal tooling', 'quick prototypes', 'very small projects'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://nx.dev',
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
      name: 'pnpm',
      category: 'developer-tools',
      description:
        'Fast, disk-efficient package manager for Node.js. Uses a content-addressable store to share packages across projects, saving disk space and installation time. Strict dependency management by default.',
      pricing: 'Free / Open source',
      features: ['content-addressable storage', 'strict dependency resolution', 'workspace support', 'side-effects cache', 'patching', 'overrides', 'fast installs', 'disk efficient'],
      integrations: ['Node.js', 'npm registry', 'Turborepo', 'Nx', 'GitHub Actions', 'Docker', 'Vercel', 'Netlify', 'any npm-compatible tool'],
      bestFor: ['monorepos', 'disk space savings', 'faster installs', 'strict dependency management', 'CI environments'],
      worstFor: ['teams locked into npm scripts', 'rare compatibility issues with npm packages', 'beginners wanting simplest setup'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://pnpm.io',
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
      name: 'Bun',
      category: 'developer-tools',
      description:
        'All-in-one JavaScript runtime, bundler, transpiler, and package manager. Built from scratch with Zig and JavaScriptCore for speed. Drop-in Node.js replacement with native TypeScript support.',
      pricing: 'Free / Open source',
      features: ['fast JavaScript runtime', 'built-in bundler', 'built-in test runner', 'native TypeScript', 'npm-compatible package manager', 'SQLite built-in', 'hot reloading', 'JSX support', 'Web APIs'],
      integrations: ['Node.js (compatible)', 'npm packages', 'Express', 'Hono', 'Elysia', 'Prisma', 'Docker', 'TypeScript', 'React', 'Next.js'],
      bestFor: ['fast development workflows', 'TypeScript without config', 'all-in-one toolchain', 'script running', 'Node.js alternative'],
      worstFor: ['production stability (newer runtime)', 'full Node.js API compatibility', 'packages with native addons', 'enterprise requiring LTS support'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://bun.sh',
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
      name: 'Deno',
      category: 'developer-tools',
      description:
        'Secure JavaScript/TypeScript runtime by Ryan Dahl (Node.js creator). Provides native TypeScript, built-in linter/formatter, permission system, and Deno Deploy for edge hosting. Web-standards focused.',
      pricing: 'Free / Open source; Deno Deploy free tier; Pro $20/mo; Enterprise custom',
      features: ['native TypeScript', 'secure by default (permissions)', 'built-in linter/formatter', 'npm compatibility', 'Deno Deploy (edge)', 'KV database', 'Web APIs', 'single executable'],
      integrations: ['npm packages', 'Fresh (web framework)', 'Supabase', 'Prisma', 'Docker', 'GitHub Actions', 'VS Code', 'TypeScript'],
      bestFor: ['TypeScript-first development', 'security-conscious projects', 'edge deployments', 'scripting', 'web-standards development'],
      worstFor: ['large existing Node.js codebases', 'packages with Node.js-specific APIs', 'enterprise adoption (smaller ecosystem)', 'maximum npm compatibility'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://deno.com',
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
      name: 'esbuild',
      category: 'developer-tools',
      description:
        'Extremely fast JavaScript/TypeScript bundler written in Go. 10-100x faster than webpack/rollup. Supports JSX, TypeScript, tree-shaking, and minification with a simple API.',
      pricing: 'Free / Open source',
      features: ['ultra-fast bundling', 'TypeScript support', 'JSX support', 'tree-shaking', 'minification', 'source maps', 'CSS bundling', 'plugin API', 'watch mode'],
      integrations: ['Vite (uses esbuild)', 'TypeScript', 'React', 'Vue', 'Svelte', 'Node.js', 'Deno', 'Bun', 'any build pipeline'],
      bestFor: ['fast build times', 'simple bundling needs', 'TypeScript transpilation', 'development builds', 'CI speed optimization'],
      worstFor: ['complex code splitting strategies', 'HMR (use Vite instead)', 'highly custom build pipelines', 'legacy browser support'],
      trustScore: 0.89,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://esbuild.github.io',
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
      name: 'Vite',
      category: 'developer-tools',
      description:
        'Next-generation frontend build tool. Uses native ES modules for instant dev server startup and esbuild for fast dependency pre-bundling. Rollup-based production builds with excellent plugin ecosystem.',
      pricing: 'Free / Open source',
      features: ['instant dev server', 'HMR', 'ES module based', 'esbuild pre-bundling', 'Rollup production builds', 'plugin API', 'CSS modules', 'TypeScript support', 'multi-framework'],
      integrations: ['React', 'Vue', 'Svelte', 'Solid', 'Lit', 'TypeScript', 'Tailwind CSS', 'Vitest', 'Storybook', 'Vercel'],
      bestFor: ['frontend development', 'fast dev server', 'modern JavaScript projects', 'framework-agnostic tooling', 'replacing webpack'],
      worstFor: ['legacy browser support', 'complex webpack configurations', 'SSR (use meta-frameworks)', 'non-browser environments'],
      trustScore: 0.92,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://vite.dev',
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
      name: 'webpack',
      category: 'developer-tools',
      description:
        'Widely used module bundler for JavaScript applications. Highly configurable with loaders, plugins, code splitting, and HMR. The industry standard for complex build pipelines despite newer alternatives.',
      pricing: 'Free / Open source',
      features: ['module bundling', 'code splitting', 'tree shaking', 'HMR', 'loaders', 'plugins', 'dev server', 'asset management', 'lazy loading'],
      integrations: ['React', 'Angular', 'Vue', 'TypeScript', 'Babel', 'PostCSS', 'Sass', 'Tailwind CSS', 'Docker', 'Node.js'],
      bestFor: ['complex build configurations', 'legacy project maintenance', 'maximum configurability', 'enterprise projects with custom needs'],
      worstFor: ['new projects (use Vite)', 'simple bundling needs', 'fast dev server startup', 'teams wanting zero-config'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://webpack.js.org',
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
      name: 'Biome',
      category: 'developer-tools',
      description:
        'Fast formatter and linter for JavaScript, TypeScript, JSX, JSON, and CSS. Written in Rust for maximum performance. Designed as a unified toolchain replacing ESLint and Prettier with a single tool.',
      pricing: 'Free / Open source',
      features: ['formatting', 'linting', 'import sorting', 'Rust-powered speed', 'zero config', 'ESLint rule compatibility', 'Prettier compatibility', 'IDE integration', 'CI support'],
      integrations: ['VS Code', 'IntelliJ', 'TypeScript', 'React', 'Vue', 'Svelte', 'Node.js', 'GitHub Actions', 'CI/CD pipelines'],
      bestFor: ['replacing ESLint + Prettier', 'fast linting/formatting', 'zero-config setup', 'monorepo performance', 'Rust-speed tooling fans'],
      worstFor: ['ESLint plugin ecosystem dependencies', 'non-JS languages', 'teams with heavy ESLint customization', 'Prettier plugin ecosystem'],
      trustScore: 0.82,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://biomejs.dev',
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
      name: 'SWC',
      category: 'developer-tools',
      description:
        'Super-fast Rust-based JavaScript/TypeScript compiler. Used by Next.js, Parcel, and Deno for transpilation. 20x faster than Babel with compatible output and plugin support.',
      pricing: 'Free / Open source',
      features: ['Rust-based compilation', 'TypeScript transpilation', 'JSX transform', 'minification', 'bundling (swcpack)', 'plugin API (Wasm)', 'source maps', 'tree shaking'],
      integrations: ['Next.js', 'Parcel', 'Deno', 'Vite', 'Rollup', 'webpack', 'TypeScript', 'React', 'Jest (via @swc/jest)'],
      bestFor: ['fast TypeScript compilation', 'Next.js projects', 'replacing Babel', 'CI build speed', 'Jest test speed'],
      worstFor: ['Babel plugin ecosystem dependencies', 'highly custom AST transforms', 'non-JS compilation', 'teams invested in Babel plugins'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://swc.rs',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // API TOOLS (7)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Hoppscotch',
      category: 'api-tools',
      description:
        'Open-source API development ecosystem. Lightweight, fast alternative to Postman with real-time WebSocket testing, GraphQL support, and team collaboration. Works as a web app, desktop app, or CLI.',
      pricing: 'Free / Open source (self-hosted); Hoppscotch Cloud free tier; Enterprise $19/user/mo',
      features: ['REST/GraphQL/WebSocket testing', 'collections', 'environments', 'pre-request scripts', 'test scripts', 'team collaboration', 'history', 'CLI', 'self-hosted option'],
      integrations: ['REST APIs', 'GraphQL', 'WebSocket', 'SSE', 'MQTT', 'Socket.IO', 'gRPC', 'OpenAPI import', 'Git sync'],
      bestFor: ['lightweight API testing', 'open-source alternative to Postman', 'self-hosted API tools', 'web-based API testing', 'fast API exploration'],
      worstFor: ['enterprise API governance', 'complex mock servers', 'API monitoring at scale', 'non-technical stakeholders'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://hoppscotch.io',
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
      name: 'Insomnia',
      category: 'api-tools',
      description:
        'API client for REST, GraphQL, gRPC, and WebSocket testing. Provides a clean interface with environment management, code generation, and Git sync. Now owned by Kong with added API design features.',
      pricing: 'Free (individual); Team $12/user/mo; Enterprise $25/user/mo',
      features: ['REST/GraphQL/gRPC testing', 'environment variables', 'code generation', 'Git sync', 'API design (OpenAPI)', 'plugins', 'cookie management', 'request chaining', 'mock servers'],
      integrations: ['REST APIs', 'GraphQL', 'gRPC', 'WebSocket', 'OpenAPI', 'Kong Gateway', 'Git', 'Curl import'],
      bestFor: ['API development and testing', 'GraphQL exploration', 'clean UI preference', 'Kong Gateway users', 'Git-based API workflows'],
      worstFor: ['large enterprise API management', 'Postman collection compatibility', 'API monitoring', 'very large teams'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://insomnia.rest',
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
      name: 'Bruno',
      category: 'api-tools',
      description:
        'Open-source, offline-first API client that stores collections as plain text files (Bru markup). Git-friendly with no cloud sync required. Privacy-focused alternative to Postman and Insomnia.',
      pricing: 'Free / Open source; Golden Edition $19 (one-time)',
      features: ['plain text collections (Bru)', 'Git-friendly', 'offline-first', 'environments', 'scripting', 'assertions', 'CLI', 'no cloud account needed', 'collection import'],
      integrations: ['Git', 'Postman import', 'OpenAPI import', 'REST APIs', 'GraphQL', 'CI/CD pipelines', 'any version control'],
      bestFor: ['privacy-focused teams', 'Git-based API workflows', 'offline development', 'open-source advocacy', 'no cloud dependency'],
      worstFor: ['cloud collaboration', 'real-time team sharing', 'enterprise API governance', 'non-technical users'],
      trustScore: 0.81,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://usebruno.com',
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
      name: 'Postman',
      category: 'api-tools',
      description:
        'Most widely used API platform for building, testing, and documenting APIs. Provides collections, environments, mock servers, monitoring, and team workspaces. De facto standard for API development.',
      pricing: 'Free (basic); Basic $14/user/mo; Professional $29/user/mo; Enterprise $49/user/mo',
      features: ['API testing', 'collections', 'environments', 'mock servers', 'API monitoring', 'documentation generation', 'Newman CLI', 'flows', 'Postbot (AI)', 'team workspaces'],
      integrations: ['REST APIs', 'GraphQL', 'WebSocket', 'gRPC', 'SOAP', 'OpenAPI', 'CI/CD', 'GitHub', 'Jenkins', 'AWS API Gateway'],
      bestFor: ['API development teams', 'API testing and documentation', 'team collaboration on APIs', 'enterprise API governance', 'API-first development'],
      worstFor: ['privacy-focused teams (cloud sync)', 'simple curl needs', 'open-source purists', 'cost-sensitive large teams'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://postman.com',
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
      name: 'RapidAPI',
      category: 'api-tools',
      description:
        'API marketplace and management platform. Discover, test, and connect to thousands of APIs. Provides a hub for API providers to list APIs and consumers to find and integrate them.',
      pricing: 'Free tier; Pro $20/mo; Team $150/mo; Enterprise custom',
      features: ['API marketplace', 'API testing', 'API management', 'usage analytics', 'team management', 'billing/monetization', 'GraphQL support', 'SDK generation'],
      integrations: ['REST APIs', 'GraphQL', 'Kafka', 'Node.js', 'Python', 'Java', 'PHP', 'Go', 'Ruby', 'any programming language'],
      bestFor: ['discovering APIs', 'API monetization', 'API marketplace needs', 'rapid API integration', 'API provider distribution'],
      worstFor: ['internal API management only', 'self-hosted requirements', 'teams building custom API gateways', 'free API consumption at scale'],
      trustScore: 0.78,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://rapidapi.com',
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
      name: 'Kong Gateway',
      category: 'api-tools',
      description:
        'Cloud-native API gateway built on Nginx/OpenResty. Provides traffic management, authentication, rate limiting, and observability for microservices. Available as open-source or enterprise with Konnect.',
      pricing: 'Free / Open source (Kong OSS); Kong Konnect from $250/mo; Enterprise custom',
      features: ['API gateway', 'rate limiting', 'authentication', 'load balancing', 'request transformation', 'logging', 'plugin system', 'declarative config', 'service mesh'],
      integrations: ['Kubernetes', 'Docker', 'Terraform', 'Prometheus', 'Grafana', 'Datadog', 'OAuth2', 'OIDC', 'AWS', 'GCP'],
      bestFor: ['API gateway needs', 'microservice architectures', 'traffic management', 'rate limiting', 'plugin-based extensibility'],
      worstFor: ['simple applications', 'serverless architectures', 'teams wanting managed-only solutions', 'very low traffic'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://konghq.com',
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
      name: 'Tyk',
      category: 'api-tools',
      description:
        'Open-source API gateway and management platform. Provides rate limiting, authentication, analytics, and developer portal. Written in Go for high performance with support for REST, GraphQL, and gRPC.',
      pricing: 'Free / Open source (Tyk OSS); Tyk Cloud from $500/mo; Self-managed from $950/mo',
      features: ['API gateway', 'rate limiting', 'authentication', 'analytics dashboard', 'developer portal', 'GraphQL support', 'gRPC proxy', 'API versioning', 'Go plugins'],
      integrations: ['Kubernetes', 'Docker', 'Terraform', 'Prometheus', 'Grafana', 'Keycloak', 'OAuth2', 'LDAP', 'AWS', 'Azure'],
      bestFor: ['open-source API gateway', 'enterprise API management', 'developer portal needs', 'GraphQL gateway', 'multi-protocol support'],
      worstFor: ['small projects', 'simple proxy needs', 'serverless architectures', 'budget-constrained startups'],
      trustScore: 0.81,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://tyk.io',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MISC POPULAR TOOLS (15)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Terraform Cloud',
      category: 'infrastructure',
      description:
        'Managed Terraform service by HashiCorp. Provides remote state management, policy enforcement (Sentinel), VCS integration, and team collaboration for Terraform workflows.',
      pricing: 'Free (up to 500 resources); Plus $588/yr per user; Enterprise custom',
      features: ['remote state management', 'VCS integration', 'Sentinel policies', 'cost estimation', 'private registry', 'run triggers', 'team management', 'SSO', 'audit logging'],
      integrations: ['Terraform', 'GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps', 'Vault', 'Consul', 'AWS', 'Azure', 'GCP'],
      bestFor: ['team Terraform workflows', 'policy enforcement', 'remote state management', 'enterprise governance', 'multi-team infrastructure'],
      worstFor: ['solo developers', 'non-Terraform IaC', 'self-hosted preference', 'simple infrastructure'],
      trustScore: 0.87,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://app.terraform.io',
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
      name: 'HashiCorp Vault',
      category: 'security',
      description:
        'Secrets management and data protection tool. Provides dynamic secrets, encryption as a service, PKI, and identity-based access. Industry standard for managing secrets, certificates, and encryption keys.',
      pricing: 'Free / Open source (BSL); HCP Vault from $0.03/hr; Enterprise self-managed custom',
      features: ['dynamic secrets', 'encryption as a service', 'PKI management', 'identity-based access', 'secrets engines', 'audit logging', 'auto-unseal', 'replication', 'namespaces'],
      integrations: ['Kubernetes', 'Terraform', 'AWS', 'Azure', 'GCP', 'Consul', 'Docker', 'GitHub Actions', 'Jenkins', 'LDAP'],
      bestFor: ['secrets management', 'dynamic credentials', 'certificate management', 'encryption services', 'compliance requirements'],
      worstFor: ['simple env file secrets', 'small teams without security requirements', 'non-infrastructure teams', 'serverless-only architectures'],
      trustScore: 0.91,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://vaultproject.io',
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
      name: 'HashiCorp Consul',
      category: 'infrastructure',
      description:
        'Service mesh and service discovery solution. Provides service registration, health checking, KV store, and secure service-to-service communication with mutual TLS and intentions.',
      pricing: 'Free / Open source (BSL); HCP Consul from usage-based; Enterprise self-managed custom',
      features: ['service discovery', 'health checking', 'KV store', 'service mesh', 'intentions (ACLs)', 'multi-datacenter', 'prepared queries', 'connect (mTLS)', 'DNS interface'],
      integrations: ['Kubernetes', 'Terraform', 'Vault', 'Nomad', 'Docker', 'AWS', 'Azure', 'GCP', 'Envoy', 'Nginx'],
      bestFor: ['service discovery', 'service mesh', 'multi-datacenter networking', 'dynamic configuration', 'HashiCorp ecosystem'],
      worstFor: ['simple deployments', 'teams using Kubernetes-native service mesh (Istio)', 'single-service applications', 'serverless architectures'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://consul.io',
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
      name: 'Redis (Self-Hosted)',
      category: 'database',
      description:
        'In-memory data store used as database, cache, message broker, and streaming engine. Supports strings, hashes, lists, sets, sorted sets, streams, and more. The most popular in-memory data store.',
      pricing: 'Free / Open source (SSPL/RSALv2 since Redis 7.4); Redis Stack includes JSON, Search, TimeSeries',
      features: ['in-memory storage', 'persistence (RDB/AOF)', 'pub/sub', 'Lua scripting', 'clustering', 'sentinel (HA)', 'streams', 'modules (JSON, Search, Graph, TimeSeries)', 'transactions'],
      integrations: ['Node.js', 'Python', 'Java', 'Go', 'Ruby', 'PHP', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus'],
      bestFor: ['caching', 'session storage', 'real-time leaderboards', 'rate limiting', 'pub/sub messaging', 'job queues'],
      worstFor: ['primary database for large datasets', 'complex relational queries', 'cost-sensitive large data (RAM expensive)', 'SSPL/RSAL license concerns'],
      trustScore: 0.93,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://redis.io',
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
      name: 'PostgreSQL',
      category: 'database',
      description:
        'Advanced open-source relational database. Supports JSON, full-text search, GIS (PostGIS), and vector embeddings (pgvector). The most advanced open-source database with 30+ years of development.',
      pricing: 'Free / Open source',
      features: ['ACID compliance', 'JSON/JSONB support', 'full-text search', 'PostGIS (geospatial)', 'pgvector (embeddings)', 'extensions', 'partitioning', 'logical replication', 'CTE/window functions'],
      integrations: ['Prisma', 'Drizzle', 'TypeORM', 'Django', 'Rails', 'Spring Boot', 'Supabase', 'Neon', 'Docker', 'Kubernetes'],
      bestFor: ['relational data', 'complex queries', 'JSONB workloads', 'geospatial data', 'vector search (pgvector)', 'enterprise applications'],
      worstFor: ['simple key-value needs', 'horizontal scaling without extensions', 'teams without DBA expertise', 'embedded/edge databases'],
      trustScore: 0.95,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://postgresql.org',
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
      name: 'MySQL',
      category: 'database',
      description:
        'Most widely used open-source relational database. Powers WordPress, Facebook, and countless web applications. Reliable, well-understood, and supported by virtually every hosting provider and ORM.',
      pricing: 'Free / Open source (GPL); MySQL Enterprise from $5K/yr; managed options (RDS, PlanetScale, etc.)',
      features: ['InnoDB storage engine', 'replication', 'partitioning', 'JSON support', 'full-text search', 'stored procedures', 'triggers', 'views', 'MySQL Shell'],
      integrations: ['PHP', 'Node.js', 'Python', 'Java', 'Ruby', 'Prisma', 'TypeORM', 'Sequelize', 'Docker', 'Kubernetes'],
      bestFor: ['web applications', 'WordPress/PHP stacks', 'read-heavy workloads', 'well-understood operations', 'legacy compatibility'],
      worstFor: ['complex analytical queries (Postgres better)', 'JSONB-heavy workloads', 'teams wanting advanced features', 'Oracle ownership concerns'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://mysql.com',
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
      name: 'MariaDB',
      category: 'database',
      description:
        'Community-developed fork of MySQL. Provides MySQL compatibility with additional features like Aria storage engine, Galera Cluster, and ColumnStore. Drop-in replacement for MySQL in most cases.',
      pricing: 'Free / Open source; SkySQL managed from $65/mo; Enterprise custom',
      features: ['MySQL compatible', 'Aria storage engine', 'Galera Cluster', 'ColumnStore (OLAP)', 'temporal tables', 'JSON support', 'sequences', 'invisible columns', 'system-versioned tables'],
      integrations: ['PHP', 'Node.js', 'Python', 'Java', 'Ruby', 'Prisma', 'Docker', 'Kubernetes', 'cPanel', 'WHM'],
      bestFor: ['MySQL replacement', 'open-source advocacy', 'clustering needs', 'hybrid OLTP/OLAP', 'Linux distribution defaults'],
      worstFor: ['MySQL-specific features divergence', 'teams needing Oracle MySQL Enterprise', 'advanced JSON (Postgres better)', 'managed service maturity'],
      trustScore: 0.83,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://mariadb.org',
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
      name: 'Elasticsearch',
      category: 'search',
      description:
        'Distributed search and analytics engine built on Apache Lucene. Powers full-text search, log analytics, APM, and SIEM use cases. Part of the Elastic Stack (ELK) with Kibana, Logstash, and Beats.',
      pricing: 'Free / Open source (SSPL/Elastic License); Elastic Cloud from $95/mo; self-managed free',
      features: ['full-text search', 'aggregations', 'vector search', 'geospatial queries', 'autocomplete', 'fuzzy matching', 'clustering', 'snapshot/restore', 'cross-cluster search'],
      integrations: ['Kibana', 'Logstash', 'Beats', 'Python', 'Java', 'Node.js', 'Go', 'Ruby', 'Docker', 'Kubernetes'],
      bestFor: ['full-text search', 'log analytics', 'application monitoring', 'SIEM', 'large-scale search needs'],
      worstFor: ['simple search needs (Meilisearch/Typesense)', 'primary database', 'cost-sensitive small projects', 'SSPL license concerns'],
      trustScore: 0.89,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://elastic.co',
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
      name: 'OpenSearch',
      category: 'search',
      description:
        'Community-driven, Apache 2.0 licensed fork of Elasticsearch and Kibana. Provides full-text search, analytics, observability, and security analytics. Maintained by AWS and community contributors.',
      pricing: 'Free / Open source (Apache 2.0); Amazon OpenSearch Service from $0.02/hr',
      features: ['full-text search', 'analytics', 'observability', 'security analytics', 'vector search (k-NN)', 'SQL support', 'alerting', 'anomaly detection', 'cross-cluster replication'],
      integrations: ['OpenSearch Dashboards', 'Logstash', 'Beats', 'FluentBit', 'Python', 'Java', 'Node.js', 'Docker', 'Kubernetes', 'AWS'],
      bestFor: ['Apache 2.0 licensed search', 'AWS-native deployments', 'log analytics', 'security analytics', 'Elasticsearch alternative without SSPL'],
      worstFor: ['latest Elastic features', 'Elastic ecosystem plugins', 'non-AWS managed needs', 'small-scale search'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://opensearch.org',
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
      name: 'MinIO',
      category: 'storage',
      description:
        'High-performance, S3-compatible object storage. Can run on bare metal, Docker, or Kubernetes. Designed for AI/ML data lakes, backups, and cloud-native applications with enterprise features.',
      pricing: 'Free / Open source (AGPL); Subscription from $10K/yr; MinIO Marketplace options',
      features: ['S3 API compatible', 'erasure coding', 'bitrot protection', 'encryption', 'bucket replication', 'lifecycle management', 'identity management', 'bucket notifications', 'tiering'],
      integrations: ['AWS S3 SDK', 'Kubernetes', 'Docker', 'Terraform', 'Spark', 'Presto', 'Python', 'Java', 'Go', 'Node.js'],
      bestFor: ['self-hosted S3-compatible storage', 'AI/ML data lakes', 'private cloud storage', 'high-performance object storage', 'air-gapped environments'],
      worstFor: ['teams wanting managed service only', 'simple file storage needs', 'AGPL license concerns', 'tiny deployments'],
      trustScore: 0.86,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://min.io',
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
      name: 'Ceph',
      category: 'storage',
      description:
        'Unified, distributed storage system providing object, block, and file storage in one platform. Powers OpenStack clouds and enterprise storage with petabyte-scale capacity and no single point of failure.',
      pricing: 'Free / Open source; enterprise support via Red Hat, SUSE, or Canonical',
      features: ['object storage (RADOS Gateway)', 'block storage (RBD)', 'file system (CephFS)', 'erasure coding', 'replication', 'self-healing', 'CRUSH algorithm', 'S3/Swift compatible'],
      integrations: ['Kubernetes (Rook)', 'OpenStack', 'Docker', 'Proxmox', 'CloudStack', 'Linux', 'S3 API', 'iSCSI'],
      bestFor: ['large-scale storage', 'private cloud infrastructure', 'unified storage needs', 'OpenStack deployments', 'petabyte-scale data'],
      worstFor: ['small deployments', 'simple storage needs', 'teams without storage expertise', 'quick setup requirements'],
      trustScore: 0.84,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://ceph.io',
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
      name: 'Prometheus',
      category: 'observability',
      description:
        'Open-source monitoring and alerting toolkit. Collects metrics via pull model, stores in time-series database, and provides PromQL for querying. CNCF graduated project and industry standard for metrics.',
      pricing: 'Free / Open source; managed options (Grafana Cloud, Amazon Managed Prometheus, etc.)',
      features: ['time-series database', 'PromQL query language', 'pull-based collection', 'alerting (Alertmanager)', 'service discovery', 'exporters ecosystem', 'federation', 'recording rules'],
      integrations: ['Grafana', 'Kubernetes', 'Docker', 'Node Exporter', 'cAdvisor', 'Alertmanager', 'Thanos', 'Cortex', 'Mimir'],
      bestFor: ['infrastructure monitoring', 'Kubernetes metrics', 'alerting', 'microservice metrics', 'cloud-native observability'],
      worstFor: ['log management', 'long-term storage (use Thanos/Mimir)', 'high-cardinality metrics', 'non-technical dashboarding'],
      trustScore: 0.92,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://prometheus.io',
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
      name: 'Jaeger',
      category: 'observability',
      description:
        'Open-source distributed tracing system originally created by Uber. Provides request tracing across microservices for performance optimization and root cause analysis. CNCF graduated project.',
      pricing: 'Free / Open source',
      features: ['distributed tracing', 'service dependency graphs', 'root cause analysis', 'performance optimization', 'OpenTelemetry support', 'adaptive sampling', 'trace comparison', 'multi-backend storage'],
      integrations: ['OpenTelemetry', 'Kubernetes', 'Docker', 'Elasticsearch', 'Cassandra', 'Kafka', 'Grafana', 'Prometheus', 'Go', 'Java'],
      bestFor: ['distributed tracing', 'microservice debugging', 'latency analysis', 'service dependency mapping', 'root cause analysis'],
      worstFor: ['simple monolith applications', 'metrics collection', 'log aggregation', 'teams wanting all-in-one observability'],
      trustScore: 0.85,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://jaegertracing.io',
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
      name: 'Zipkin',
      category: 'observability',
      description:
        'Distributed tracing system originally developed at Twitter. Helps gather timing data for troubleshooting latency problems in microservice architectures. One of the original distributed tracing tools.',
      pricing: 'Free / Open source',
      features: ['distributed tracing', 'dependency analysis', 'latency analysis', 'trace search', 'service graphs', 'multi-storage backends', 'Brave instrumentation', 'B3 propagation'],
      integrations: ['Java (Brave)', 'Go', 'Node.js', 'Python', 'Ruby', 'Elasticsearch', 'Cassandra', 'MySQL', 'Docker', 'Kubernetes'],
      bestFor: ['simple distributed tracing', 'Java microservices', 'lightweight tracing setup', 'B3 propagation standard users'],
      worstFor: ['advanced tracing features (Jaeger better)', 'metrics and logs', 'OpenTelemetry-first teams', 'all-in-one observability'],
      trustScore: 0.80,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://zipkin.io',
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
      name: 'OpenTelemetry',
      category: 'observability',
      description:
        'Vendor-neutral observability framework for generating, collecting, and exporting telemetry data (traces, metrics, logs). CNCF project merging OpenTracing and OpenCensus. The emerging standard for instrumentation.',
      pricing: 'Free / Open source',
      features: ['traces, metrics, logs', 'vendor-neutral', 'auto-instrumentation', 'SDK for 11+ languages', 'OTel Collector', 'context propagation', 'semantic conventions', 'OTLP protocol'],
      integrations: ['Jaeger', 'Zipkin', 'Prometheus', 'Grafana', 'Datadog', 'New Relic', 'Honeycomb', 'Elastic', 'Dynatrace', 'Splunk'],
      bestFor: ['vendor-neutral instrumentation', 'standardized telemetry', 'multi-backend observability', 'future-proofing instrumentation', 'polyglot environments'],
      worstFor: ['quick-start monitoring (use managed tools)', 'teams wanting opinionated setup', 'small projects not needing flexibility', 'complete observability platform (it is just instrumentation)'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://opentelemetry.io',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL TOOLS (5 more to exceed 300)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    product: {
      name: 'Grafana (Self-Hosted)',
      category: 'observability',
      description:
        'Open-source observability and visualization platform. Create dashboards from Prometheus, Loki, Elasticsearch, PostgreSQL, and dozens of other data sources. The standard for metrics visualization.',
      pricing: 'Free / Open source (AGPL); Grafana Cloud from free tier; Enterprise self-managed custom',
      features: ['dashboard builder', 'alerting', '100+ data source plugins', 'panel plugins', 'templating', 'annotations', 'LDAP/OAuth auth', 'provisioning', 'unified alerting'],
      integrations: ['Prometheus', 'Loki', 'Tempo', 'Mimir', 'Elasticsearch', 'InfluxDB', 'PostgreSQL', 'MySQL', 'CloudWatch', 'Datadog'],
      bestFor: ['metrics visualization', 'multi-source dashboards', 'infrastructure monitoring', 'alerting', 'open-source observability stack'],
      worstFor: ['simple status pages', 'non-technical audiences', 'log-only needs (use Loki directly)', 'teams wanting zero-ops'],
      trustScore: 0.93,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://grafana.com',
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
      name: 'Tailwind CSS',
      category: 'frontend-framework',
      description:
        'Utility-first CSS framework for rapidly building custom designs. Provides low-level utility classes that compose to build any design directly in markup. The most popular CSS framework for modern web development.',
      pricing: 'Free / Open source; Tailwind UI from $149 (one-time)',
      features: ['utility-first classes', 'JIT compiler', 'responsive design', 'dark mode', 'custom themes', 'plugin system', 'Tailwind UI (paid components)', 'IntelliSense extension'],
      integrations: ['React', 'Vue', 'Svelte', 'Angular', 'Next.js', 'Nuxt', 'Astro', 'Vite', 'PostCSS', 'any HTML framework'],
      bestFor: ['rapid UI development', 'consistent design systems', 'developer-designed UIs', 'prototyping', 'component-based frameworks'],
      worstFor: ['teams preferring semantic CSS', 'design-heavy projects needing CSS art', 'very small projects', 'teams avoiding class-heavy markup'],
      trustScore: 0.93,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://tailwindcss.com',
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
      name: 'shadcn/ui',
      category: 'frontend-framework',
      description:
        'Collection of reusable React components built with Radix UI and Tailwind CSS. Not a component library -- components are copied into your project for full ownership and customization. Rapidly becoming the default UI toolkit for Next.js.',
      pricing: 'Free / Open source',
      features: ['copy-paste components', 'Radix UI primitives', 'Tailwind CSS styling', 'dark mode', 'CLI for adding components', 'full customization', 'accessible by default', 'TypeScript'],
      integrations: ['React', 'Next.js', 'Remix', 'Astro', 'Tailwind CSS', 'Radix UI', 'TypeScript', 'Storybook', 'Vite'],
      bestFor: ['Next.js projects', 'teams wanting ownership of UI code', 'accessible component needs', 'Tailwind CSS users', 'rapid UI scaffolding'],
      worstFor: ['non-React frameworks', 'teams wanting managed component library updates', 'Vue/Svelte/Angular projects', 'zero-config UI needs'],
      trustScore: 0.88,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://ui.shadcn.com',
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
      name: 'Zod',
      category: 'developer-tools',
      description:
        'TypeScript-first schema validation library with static type inference. Define a schema once and get both runtime validation and TypeScript types. The most popular validation library in the TypeScript ecosystem.',
      pricing: 'Free / Open source',
      features: ['schema declaration', 'TypeScript inference', 'composable schemas', 'custom error messages', 'transforms', 'refinements', 'coercion', 'discriminated unions', 'async validation'],
      integrations: ['TypeScript', 'tRPC', 'React Hook Form', 'Remix', 'Next.js', 'Fastify', 'Hono', 'Prisma', 'OpenAPI', 'Zod to OpenAPI'],
      bestFor: ['TypeScript validation', 'API input validation', 'form validation', 'tRPC schemas', 'type-safe data parsing'],
      worstFor: ['non-TypeScript projects', 'very performance-sensitive hot paths', 'complex conditional validation', 'teams wanting Yup/Joi familiarity'],
      trustScore: 0.90,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://zod.dev',
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
      name: 'ESLint',
      category: 'developer-tools',
      description:
        'Pluggable linting utility for JavaScript and TypeScript. Find and fix problems in code with configurable rules, plugins, and auto-fix support. The industry standard for JS/TS code quality.',
      pricing: 'Free / Open source',
      features: ['configurable rules', 'auto-fix', 'plugin system', 'flat config (eslint.config.js)', 'TypeScript support', 'JSX/React support', 'custom rules', 'shareable configs', 'IDE integration'],
      integrations: ['VS Code', 'IntelliJ', 'TypeScript', 'React', 'Vue', 'Angular', 'Prettier', 'GitHub Actions', 'Husky', 'lint-staged'],
      bestFor: ['code quality enforcement', 'team coding standards', 'catching bugs early', 'TypeScript linting', 'CI/CD quality gates'],
      worstFor: ['formatting (use Prettier/Biome)', 'non-JS languages', 'teams wanting all-in-one tool (use Biome)', 'complex custom rule development'],
      trustScore: 0.92,
      active: true,
    },
    programs: [
      {
        network: 'none',
        affiliateLink: 'https://eslint.org',
        payoutType: 'per-signup',
        payoutAmount: 0,
        payoutCurrency: 'USD',
        cookieDays: 0,
        approved: false,
      },
    ],
  },
];
