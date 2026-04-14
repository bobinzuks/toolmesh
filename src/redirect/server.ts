import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFileSync, existsSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RedirectServerOptions {
  /** Port to listen on (default: 3849) */
  port?: number;
  /** Path to the links JSON file */
  linksPath?: string;
  /** Host to bind to (default: 127.0.0.1) */
  host?: string;
  /** Optional file path to append click logs */
  logFile?: string;
}

interface LinkMap {
  [slug: string]: string;
}

interface ClickStats {
  [slug: string]: number;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEFAULT_PORT = 3849;
const DEFAULT_HOST = '127.0.0.1';

function defaultLinksPath(): string {
  // Try sibling links.json first (dist/redirect/links.json), then source tree
  const candidates = [
    join(__dirname, 'links.json'),
    join(__dirname, '..', '..', 'src', 'redirect', 'links.json'),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return candidates[0];
}

// ---------------------------------------------------------------------------
// UTM helper
// ---------------------------------------------------------------------------

function appendUtmParams(url: string): string {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has('utm_source')) {
      parsed.searchParams.set('utm_source', 'toolmesh');
    }
    if (!parsed.searchParams.has('utm_medium')) {
      parsed.searchParams.set('utm_medium', 'redirect');
    }
    return parsed.toString();
  } catch {
    // If URL parsing fails, return as-is
    return url;
  }
}

// ---------------------------------------------------------------------------
// CORS headers
// ---------------------------------------------------------------------------

function setCorsHeaders(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ---------------------------------------------------------------------------
// Load link map
// ---------------------------------------------------------------------------

function loadLinks(linksPath: string): LinkMap {
  if (!existsSync(linksPath)) {
    console.error(`[redirect] Links file not found: ${linksPath}`);
    return {};
  }

  try {
    const raw = readFileSync(linksPath, 'utf-8');
    const parsed = JSON.parse(raw) as Record<string, string>;

    // Filter out meta keys like _comment
    const links: LinkMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!key.startsWith('_') && typeof value === 'string') {
        links[key] = value;
      }
    }
    return links;
  } catch (err) {
    console.error(`[redirect] Failed to parse links file: ${err instanceof Error ? err.message : err}`);
    return {};
  }
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

export function startRedirectServer(options: RedirectServerOptions = {}): void {
  const port = options.port ?? DEFAULT_PORT;
  const host = options.host ?? DEFAULT_HOST;
  const linksPath = options.linksPath ?? defaultLinksPath();
  const logFile = options.logFile;

  const links = loadLinks(linksPath);
  const slugCount = Object.keys(links).length;
  const clicks: ClickStats = {};
  const startedAt = new Date().toISOString();

  // Initialise click counters
  for (const slug of Object.keys(links)) {
    clicks[slug] = 0;
  }

  function logClick(slug: string, ip: string): void {
    const timestamp = new Date().toISOString();
    const line = `${timestamp}  ${slug}  ${ip}`;
    console.error(`[redirect] ${line}`);

    if (logFile) {
      try {
        appendFileSync(logFile, line + '\n', 'utf-8');
      } catch {
        // Silently ignore log write failures
      }
    }
  }

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = req.url ?? '/';
    const method = req.method ?? 'GET';
    const ip = req.headers['x-forwarded-for'] as string ?? req.socket.remoteAddress ?? 'unknown';

    setCorsHeaders(res);

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Health check
    if (url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', slugs: slugCount, startedAt }));
      return;
    }

    // Stats endpoint
    if (url === '/stats') {
      const totalClicks = Object.values(clicks).reduce((a, b) => a + b, 0);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        startedAt,
        totalClicks,
        slugs: slugCount,
        clicks,
      }, null, 2));
      return;
    }

    // Redirect: /go/<slug>
    const goMatch = url.match(/^\/go\/([a-zA-Z0-9_-]+)\/?$/);
    if (goMatch) {
      const slug = goMatch[1].toLowerCase();
      const target = links[slug];

      if (!target) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'not_found',
          message: `Unknown slug: "${slug}". Available slugs: ${Object.keys(links).join(', ')}`,
        }));
        return;
      }

      // Track the click
      clicks[slug] = (clicks[slug] ?? 0) + 1;
      logClick(slug, ip);

      // Redirect with UTM params
      const destination = appendUtmParams(target);
      res.writeHead(302, { Location: destination });
      res.end();
      return;
    }

    // Root — show a simple index
    if (url === '/' || url === '/go' || url === '/go/') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        service: 'ToolMesh Redirect',
        usage: 'GET /go/<slug> to redirect',
        available: Object.keys(links),
        endpoints: {
          redirect: '/go/<slug>',
          health: '/health',
          stats: '/stats',
        },
      }, null, 2));
      return;
    }

    // 404 fallback
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'not_found', message: `Unknown path: ${url}` }));
  });

  server.listen(port, host, () => {
    console.log(`[redirect] ToolMesh redirect server listening on http://${host}:${port}`);
    console.log(`[redirect] Loaded ${slugCount} redirect slugs from ${linksPath}`);
    console.log(`[redirect] Try: http://${host}:${port}/go/supabase`);
  });
}
