#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { seedDatabase } from './registry/seeder.js';
import { getDb, closeDb } from './registry/database.js';
import { ProductRepository } from './registry/repository.js';
import { ensureProductsJson, loadProductsConfig } from './registry/custom-products.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VERSION = '0.1.0';
const PACKAGE_NAME = '@aan/mcp';

const MCP_SERVER_ENTRY = {
  command: 'npx',
  args: ['-y', PACKAGE_NAME],
};

const HELP_TEXT = `
aan — Agent Affiliate Network CLI (v${VERSION})

Usage:
  aan <command>

Commands:
  init              Write MCP config entries for detected editors
  seed              Seed the database with initial products
  status            Show database stats
  products          Create/show products.json for custom products and affiliate links
  serve             Start the MCP server
  dashboard         Start the developer dashboard
  agent-card        Print the A2A Agent Card JSON to stdout
  well-known        Generate all .well-known/ discovery files
  help              Show this help message

Options (dashboard):
  --port <number>   Port for dashboard server (default: 3847)

Options (agent-card / well-known):
  --url <url>       Public URL for the agent (default: http://localhost:3848)

Options (well-known):
  --output <dir>    Output directory (default: ./public)

Examples:
  aan init          # Configure editors to use AAN
  aan seed          # Populate product database
  aan status        # Check database health
  aan dashboard     # Start dashboard on port 3847
  aan dashboard --port 8080
  aan agent-card    # Print A2A Agent Card JSON
  aan agent-card --url https://your-domain.com
  aan well-known --output ./public
`.trim();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJsonFile(filePath: string): Record<string, unknown> {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function writeJsonFile(filePath: string, data: Record<string, unknown>): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function cmdInit(): void {
  const cwd = process.cwd();
  const editorConfigs: Array<{ name: string; path: string; dirNeeded?: string }> = [
    { name: 'Claude Code', path: join(cwd, '.mcp.json') },
    { name: 'Cursor', path: join(cwd, '.cursor', 'mcp.json'), dirNeeded: join(cwd, '.cursor') },
  ];

  let configured = 0;

  for (const editor of editorConfigs) {
    const exists = existsSync(editor.path);
    const dirExists = editor.dirNeeded ? existsSync(editor.dirNeeded) : true;

    // For Claude Code: always write (create or merge)
    // For Cursor: only write if .cursor/ directory exists
    if (editor.name === 'Cursor' && !dirExists) {
      continue;
    }

    // Read existing config or start fresh
    const config = exists ? readJsonFile(editor.path) : {};

    // Ensure mcpServers object exists
    if (!config.mcpServers || typeof config.mcpServers !== 'object') {
      config.mcpServers = {};
    }

    const servers = config.mcpServers as Record<string, unknown>;

    // Check if already configured
    if (servers.aan) {
      console.log(`  [skip] ${editor.name} (${editor.path}) — already configured`);
      continue;
    }

    // Create directory if needed
    if (editor.dirNeeded && !dirExists) {
      mkdirSync(editor.dirNeeded, { recursive: true });
    }

    // Add AAN entry
    servers.aan = MCP_SERVER_ENTRY;

    writeJsonFile(editor.path, config);
    console.log(`  [done] ${editor.name} — wrote ${editor.path}`);
    configured++;
  }

  if (configured === 0) {
    console.log('\nNo changes made. AAN is already configured in all detected editors.');
  } else {
    console.log(`\nConfigured ${configured} editor(s). Restart your editor to activate AAN.`);
  }
}

async function cmdSeed(): Promise<void> {
  console.log('Seeding AAN product registry...\n');

  try {
    const result = await seedDatabase();

    if (result.inserted === 0 && result.skipped > 0) {
      console.log(`Database already seeded. ${result.skipped} products skipped (already exist).`);
    } else {
      console.log(`Inserted: ${result.inserted}`);
      console.log(`Skipped:  ${result.skipped}`);
    }

    const total = new ProductRepository(getDb()).count();
    console.log(`\nTotal products in registry: ${total}`);
    console.log('Done.');
  } catch (err) {
    console.error('Seed failed:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  } finally {
    closeDb();
  }
}

function cmdStatus(): void {
  try {
    const db = getDb();

    const totalProducts = (db.prepare('SELECT COUNT(*) AS cnt FROM products').get() as { cnt: number }).cnt;
    const activeProducts = (db.prepare('SELECT COUNT(*) AS cnt FROM products WHERE active = 1').get() as { cnt: number }).cnt;
    const affiliateCount = (db.prepare('SELECT COUNT(*) AS cnt FROM affiliate_programs').get() as { cnt: number }).cnt;

    const categories = db.prepare(
      'SELECT category, COUNT(*) AS cnt FROM products GROUP BY category ORDER BY cnt DESC',
    ).all() as Array<{ category: string; cnt: number }>;

    console.log('AAN Registry Status\n');
    console.log(`  Total products:      ${totalProducts}`);
    console.log(`  Active products:     ${activeProducts}`);
    console.log(`  Affiliate programs:  ${affiliateCount}`);
    console.log(`  Categories:          ${categories.length}`);
    console.log('');

    if (categories.length > 0) {
      console.log('Products by category:');
      for (const row of categories) {
        console.log(`  ${row.category.padEnd(16)} ${row.cnt}`);
      }
    }

    if (totalProducts === 0) {
      console.log('\nDatabase is empty. Run `aan seed` to populate it.');
    }
  } catch (err) {
    console.error('Status check failed:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  } finally {
    closeDb();
  }
}

function cmdDashboard(args: string[]): void {
  // Parse --port flag
  let port = 3847;
  const portIdx = args.indexOf('--port');
  if (portIdx !== -1 && args[portIdx + 1]) {
    const parsed = parseInt(args[portIdx + 1], 10);
    if (!Number.isNaN(parsed) && parsed > 0 && parsed < 65536) {
      port = parsed;
    } else {
      console.error(`Invalid port: ${args[portIdx + 1]}`);
      process.exitCode = 1;
      return;
    }
  }

  try {
    const db = getDb();

    // Dynamic import to avoid loading dashboard code unless needed
    import('./dashboard/server.js').then(({ startDashboard }) => {
      startDashboard(port, db);
    }).catch((err) => {
      console.error('Failed to start dashboard:', err instanceof Error ? err.message : err);
      closeDb();
      process.exitCode = 1;
    });
  } catch (err) {
    console.error('Failed to initialize database:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
}

async function cmdServe(): Promise<void> {
  // Dynamically import the main index to start the MCP server.
  // This avoids loading the server module unless actually needed.
  try {
    await import('./index.js');
  } catch (err) {
    console.error('Failed to start MCP server:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// products — Create/show products.json
// ---------------------------------------------------------------------------

function cmdProducts(): void {
  const path = ensureProductsJson();
  const config = loadProductsConfig();

  console.log('AAN Products Configuration\n');
  console.log(`  File: ${path}\n`);

  const overrides = config.link_overrides ?? {};
  const filledOverrides = Object.entries(overrides).filter(([, v]) => !v.includes('YOUR_'));
  const customProducts = (config.products ?? []).filter((p) => p.name !== 'Example Product');

  console.log(`  Link overrides: ${Object.keys(overrides).length} defined, ${filledOverrides.length} active`);
  console.log(`  Custom products: ${customProducts.length}\n`);

  if (filledOverrides.length > 0) {
    console.log('  Active link overrides:');
    for (const [name, url] of filledOverrides) {
      console.log(`    ${name} -> ${url}`);
    }
    console.log();
  }

  if (customProducts.length > 0) {
    console.log('  Custom products:');
    for (const p of customProducts) {
      const links = p.affiliate_links.length;
      console.log(`    ${p.name} (${p.category}) — ${links} affiliate link${links !== 1 ? 's' : ''}`);
    }
    console.log();
  }

  console.log('  Edit the file to:');
  console.log('    1. Replace YOUR_... placeholders in link_overrides with real affiliate IDs');
  console.log('    2. Add new products to the products array');
  console.log('    3. Run "aan seed" to load changes into the database');
}

// ---------------------------------------------------------------------------
// agent-card — Print A2A Agent Card JSON
// ---------------------------------------------------------------------------

function cmdAgentCard(args: string[]): void {
  // Parse --url flag
  let url: string | undefined;
  const urlIdx = args.indexOf('--url');
  if (urlIdx !== -1 && args[urlIdx + 1]) {
    url = args[urlIdx + 1];
  }

  import('./mesh/agent-card.js').then(({ generateAgentCardJson }) => {
    process.stdout.write(generateAgentCardJson({ url }));
  }).catch((err) => {
    console.error('Failed to generate agent card:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
}

// ---------------------------------------------------------------------------
// well-known — Generate .well-known/ discovery files
// ---------------------------------------------------------------------------

function cmdWellKnown(args: string[]): void {
  // Parse --output flag
  let outputDir = join(process.cwd(), 'public');
  const outputIdx = args.indexOf('--output');
  if (outputIdx !== -1 && args[outputIdx + 1]) {
    outputDir = args[outputIdx + 1];
  }

  // Parse --url flag
  let url: string | undefined;
  const urlIdx = args.indexOf('--url');
  if (urlIdx !== -1 && args[urlIdx + 1]) {
    url = args[urlIdx + 1];
  }

  import('./mesh/well-known.js').then(({ writeWellKnownFiles, generateWellKnownFiles }) => {
    writeWellKnownFiles(outputDir, { url });

    const files = generateWellKnownFiles({ url });
    const wellKnownDir = join(outputDir, '.well-known');

    console.log('Generated .well-known/ discovery files:\n');
    for (const filename of Object.keys(files)) {
      console.log(`  ${join(wellKnownDir, filename)}`);
    }
    console.log(`\n${Object.keys(files).length} files written to ${wellKnownDir}`);
  }).catch((err) => {
    console.error('Failed to generate well-known files:', err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase() ?? 'help';

  switch (command) {
    case 'init':
      cmdInit();
      break;
    case 'seed':
      await cmdSeed();
      break;
    case 'status':
      cmdStatus();
      break;
    case 'serve':
      cmdServe();
      break;
    case 'dashboard':
      cmdDashboard(args.slice(1));
      break;
    case 'products':
      cmdProducts();
      break;
    case 'agent-card':
      cmdAgentCard(args.slice(1));
      break;
    case 'well-known':
      cmdWellKnown(args.slice(1));
      break;
    case 'help':
    case '--help':
    case '-h':
      console.log(HELP_TEXT);
      break;
    case 'version':
    case '--version':
    case '-v':
      console.log(VERSION);
      break;
    default:
      console.error(`Unknown command: ${command}\n`);
      console.log(HELP_TEXT);
      process.exitCode = 1;
      break;
  }
}

main();
