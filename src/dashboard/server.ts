import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type Database from 'better-sqlite3';
import { getAuditLog, type AuditEntry } from '../recommendation/anti-sycophancy.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatsResponse {
  totalProducts: number;
  activeProducts: number;
  categories: number;
  affiliatePrograms: number;
}

interface ProductListItem {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: string;
  trustScore: number;
  active: boolean;
  affiliateCount: number;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// HTML — loaded once at startup from the sibling ui.html file
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadDashboardHtml(): string {
  // In production (dist/), the HTML is copied alongside the JS.
  // During development with tsx, resolve from the source tree.
  const candidates = [
    join(__dirname, 'ui.html'),
    join(__dirname, '..', '..', 'src', 'dashboard', 'ui.html'),
  ];

  for (const candidate of candidates) {
    try {
      return readFileSync(candidate, 'utf-8');
    } catch {
      // try next
    }
  }

  return `<!DOCTYPE html><html><body style="font-family:monospace;background:#0d1117;color:#e6edf3;padding:2rem">
    <h1>AAN Dashboard</h1>
    <p>Could not load ui.html. Make sure the file exists next to the server module.</p>
  </body></html>`;
}

const DASHBOARD_HTML = loadDashboardHtml();

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

const VERSION = '0.1.0';
const startTime = Date.now();

function json(res: ServerResponse, data: unknown, status = 200): void {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-cache',
  });
  res.end(body);
}

function html(res: ServerResponse, content: string): void {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(content),
    'Cache-Control': 'no-cache',
  });
  res.end(content);
}

function notFound(res: ServerResponse): void {
  json(res, { error: 'Not found' }, 404);
}

function handleHealth(res: ServerResponse): void {
  json(res, {
    status: 'ok',
    uptime: (Date.now() - startTime) / 1000,
    version: VERSION,
  });
}

function handleStats(db: Database.Database, res: ServerResponse): void {
  const totalProducts = (
    db.prepare('SELECT COUNT(*) AS cnt FROM products').get() as { cnt: number }
  ).cnt;

  const activeProducts = (
    db.prepare('SELECT COUNT(*) AS cnt FROM products WHERE active = 1').get() as { cnt: number }
  ).cnt;

  const categories = (
    db.prepare('SELECT COUNT(DISTINCT category) AS cnt FROM products').get() as { cnt: number }
  ).cnt;

  const affiliatePrograms = (
    db.prepare('SELECT COUNT(*) AS cnt FROM affiliate_programs').get() as { cnt: number }
  ).cnt;

  const data: StatsResponse = { totalProducts, activeProducts, categories, affiliatePrograms };
  json(res, data);
}

function handleProducts(db: Database.Database, res: ServerResponse): void {
  const rows = db.prepare(`
    SELECT
      p.id, p.name, p.category, p.description, p.pricing,
      p.trust_score, p.active, p.updated_at,
      (SELECT COUNT(*) FROM affiliate_programs ap WHERE ap.product_id = p.id) AS affiliate_count
    FROM products p
    ORDER BY p.name ASC
  `).all() as Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    pricing: string;
    trust_score: number;
    active: number;
    updated_at: string;
    affiliate_count: number;
  }>;

  const products: ProductListItem[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description,
    pricing: r.pricing,
    trustScore: r.trust_score,
    active: r.active === 1,
    affiliateCount: r.affiliate_count,
    updatedAt: r.updated_at,
  }));

  json(res, { products });
}

function handleAudit(res: ServerResponse): void {
  const entries: readonly AuditEntry[] = getAuditLog();
  json(res, { entries });
}

function handleConversions(res: ServerResponse): void {
  // Conversion tracker is not yet implemented; return empty data.
  json(res, {
    totalClicks: 0,
    totalConversions: 0,
    conversionRate: 0,
    recentConversions: [],
    message: 'Conversion tracking not yet implemented.',
  });
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

function createRouter(db: Database.Database) {
  return function handleRequest(req: IncomingMessage, res: ServerResponse): void {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const path = url.pathname;

    // CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method !== 'GET') {
      json(res, { error: 'Method not allowed' }, 405);
      return;
    }

    switch (path) {
      case '/':
        html(res, DASHBOARD_HTML);
        break;
      case '/api/health':
        handleHealth(res);
        break;
      case '/api/stats':
        handleStats(db, res);
        break;
      case '/api/products':
        handleProducts(db, res);
        break;
      case '/api/audit':
        handleAudit(res);
        break;
      case '/api/conversions':
        handleConversions(res);
        break;
      default:
        notFound(res);
        break;
    }
  };
}

export function startDashboard(port: number, db: Database.Database): void {
  const server = createServer(createRouter(db));

  server.listen(port, '127.0.0.1', () => {
    const url = `http://localhost:${port}`;
    console.log('');
    console.log('  AAN Developer Dashboard');
    console.log('  -----------------------');
    console.log(`  Local:   ${url}`);
    console.log('');
    console.log('  Endpoints:');
    console.log(`    GET /              Dashboard UI`);
    console.log(`    GET /api/health    Server health`);
    console.log(`    GET /api/stats     Registry statistics`);
    console.log(`    GET /api/products  Product list`);
    console.log(`    GET /api/audit     Audit log`);
    console.log(`    GET /api/conversions  Conversion stats`);
    console.log('');
    console.log('  Press Ctrl+C to stop.');
    console.log('');
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\nShutting down dashboard...');
    server.close(() => {
      process.exit(0);
    });
    // Force exit after 3 seconds if close hangs
    setTimeout(() => process.exit(0), 3000);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
