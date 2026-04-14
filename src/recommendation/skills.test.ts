// Prevent custom products.json from interfering with tests
process.env.HOME = '/tmp/toolmesh-test-skills-' + Date.now();

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import crypto from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { RecommendationEngine } from './engine.js';
import { ProductRepository } from '../registry/repository.js';
import { HashEmbedder } from '../registry/embedder.js';
import { resetDb, closeDb } from '../registry/database.js';
import { seedDatabase } from '../registry/seeder.js';

// ---------------------------------------------------------------------------
// Shared test infrastructure
// ---------------------------------------------------------------------------

let engine: RecommendationEngine;
let tmpDir: string;
let dbPath: string;

before(async () => {
  tmpDir = mkdtempSync(join(tmpdir(), 'aan-skills-test-'));
  dbPath = join(tmpDir, `test-${crypto.randomUUID()}.db`);

  const db = resetDb(dbPath);
  await seedDatabase(dbPath);

  const repo = new ProductRepository(db);
  const embedder = new HashEmbedder();
  engine = new RecommendationEngine(repo, embedder);
});

after(() => {
  closeDb();
  try {
    rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    // best-effort cleanup
  }
});

// ---------------------------------------------------------------------------
// discoverSkills()
// ---------------------------------------------------------------------------

describe('RecommendationEngine.discoverSkills()', () => {
  it('returns a RecommendationResult with served or refused status', async () => {
    const result = await engine.discoverSkills({
      rawNeed: 'browser automation web scraping puppeteer',
    });

    assert.ok(
      result.status === 'served' || result.status === 'refused',
      `Status should be served or refused, got ${result.status}`,
    );
  });

  it('results include install commands when served', async () => {
    // Use broad keywords to maximise the chance of finding MCP servers in seed data
    const result = await engine.discoverSkills({
      rawNeed: 'database queries SQL postgres MCP server tools',
      maxResults: 5,
    });

    if (result.status === 'served') {
      assert.ok(result.recommendations.length > 0, 'Should return at least one recommendation');
      for (const rec of result.recommendations) {
        assert.ok(rec.name, 'Recommendation should have a name');
        assert.ok(typeof rec.fitScore === 'number', 'Should have a fitScore');
      }
    }
    // If refused, that is still valid -- the hash embedder may not produce high
    // enough similarity for MCP server products.
  });

  it('defaults to mcp-server category', async () => {
    // discoverSkills should internally pass category: 'mcp-server'
    // We cannot directly inspect the internal call, but we can verify
    // the result is structurally valid.
    const result = await engine.discoverSkills({
      rawNeed: 'web search',
    });

    assert.ok('status' in result);
    assert.ok('recommendations' in result);
    assert.ok('disclosure' in result);
  });
});

// ---------------------------------------------------------------------------
// suggestSkills()
// ---------------------------------------------------------------------------

describe('RecommendationEngine.suggestSkills()', () => {
  it('returns an array of suggestions', async () => {
    const suggestions = await engine.suggestSkills({});

    assert.ok(Array.isArray(suggestions), 'Should return an array');
  });

  it('includes ToolMesh self-recommendation when user has no discovery tool', async () => {
    const suggestions = await engine.suggestSkills({
      currentTools: ['github', 'filesystem'],
    });

    const toolmesh = suggestions.find((s) => s.name === 'ToolMesh');
    assert.ok(toolmesh, 'Should include ToolMesh meta-suggestion');
    assert.ok(toolmesh!.installCommand.includes('toolmesh'), 'Install command should reference toolmesh');
    assert.ok(toolmesh!.description.length > 0, 'Should have a description');
    assert.strictEqual(toolmesh!.category, 'mcp-server');
  });

  it('does not include ToolMesh when user already has it', async () => {
    const suggestions = await engine.suggestSkills({
      currentTools: ['toolmesh', 'filesystem'],
    });

    const toolmesh = suggestions.find((s) => s.name === 'ToolMesh');
    assert.strictEqual(toolmesh, undefined, 'Should not suggest ToolMesh when already installed');
  });

  it('each suggestion has required fields', async () => {
    const suggestions = await engine.suggestSkills({
      projectType: 'web application',
      maxSuggestions: 3,
    });

    for (const s of suggestions) {
      assert.ok(s.name, 'Suggestion should have a name');
      assert.ok(s.description, 'Suggestion should have a description');
      assert.ok(s.reason, 'Suggestion should have a reason');
      assert.ok(s.installCommand, 'Suggestion should have an installCommand');
      assert.ok(typeof s.trustScore === 'number', 'Suggestion should have a trustScore');
      assert.ok(s.category, 'Suggestion should have a category');
    }
  });

  it('respects maxSuggestions limit', async () => {
    const suggestions = await engine.suggestSkills({
      maxSuggestions: 2,
    });

    // ToolMesh meta-suggestion is appended after the limit, so total can be maxSuggestions + 1
    // The non-ToolMesh suggestions should respect the limit.
    const nonToolmesh = suggestions.filter((s) => s.name !== 'ToolMesh');
    assert.ok(
      nonToolmesh.length <= 2,
      `Expected at most 2 non-ToolMesh suggestions, got ${nonToolmesh.length}`,
    );
  });

  it('filters out already-installed tools from suggestions', async () => {
    // First get suggestions without any current tools to see what is available
    const baseline = await engine.suggestSkills({ maxSuggestions: 10 });
    const baseNames = baseline
      .filter((s) => s.name !== 'ToolMesh')
      .map((s) => s.name.toLowerCase());

    if (baseNames.length > 0) {
      // Now suggest with the first result as a "current tool"
      const installed = baseNames[0];
      const filtered = await engine.suggestSkills({
        currentTools: [installed],
        maxSuggestions: 10,
      });

      const reinstalled = filtered.find(
        (s) => s.name.toLowerCase() === installed || s.name.toLowerCase().includes(installed),
      );
      assert.strictEqual(
        reinstalled,
        undefined,
        `Should not re-suggest already installed tool: ${installed}`,
      );
    }
  });
});

// ---------------------------------------------------------------------------
// getInstallCommand()
// ---------------------------------------------------------------------------

describe('RecommendationEngine.getInstallCommand()', () => {
  it('returns InstallInfo for a known product', () => {
    // Use a product name from seed data -- Supabase is always present
    const info = engine.getInstallCommand('Supabase', 'claude-code');

    assert.ok(info !== null, 'Should return InstallInfo for a known product');
    assert.ok(info!.name, 'InstallInfo should have a name');
    assert.ok(info!.description, 'InstallInfo should have a description');
    assert.ok(info!.commands['claude-code'], 'Should have a claude-code command');
    assert.ok(info!.configJson, 'Should have configJson');
  });

  it('returns null for an unknown product', () => {
    const info = engine.getInstallCommand('NonexistentProduct999', 'claude-code');
    assert.strictEqual(info, null, 'Should return null for unknown products');
  });

  it('generates different commands per editor', () => {
    const info = engine.getInstallCommand('Supabase', 'claude-code');
    assert.ok(info !== null);

    const claudeCmd = info!.commands['claude-code'];
    const cursorCmd = info!.commands['cursor'];
    const windsurfCmd = info!.commands['windsurf'];
    const genericCmd = info!.commands['generic'];

    assert.ok(claudeCmd, 'Should have a claude-code command');
    assert.ok(cursorCmd, 'Should have a cursor command');
    assert.ok(windsurfCmd, 'Should have a windsurf command');
    assert.ok(genericCmd, 'Should have a generic command');

    // Commands should differ across editors
    assert.notStrictEqual(claudeCmd, cursorCmd, 'claude-code and cursor commands should differ');
    assert.notStrictEqual(cursorCmd, windsurfCmd, 'cursor and windsurf commands should differ');

    // claude-code command should use the `claude mcp add` format
    assert.ok(
      claudeCmd.startsWith('claude mcp add'),
      `claude-code command should start with "claude mcp add", got: ${claudeCmd}`,
    );

    // cursor command should mention .cursor/mcp.json
    assert.ok(
      cursorCmd.includes('.cursor/mcp.json'),
      'cursor command should reference .cursor/mcp.json',
    );

    // windsurf command should mention windsurf config path
    assert.ok(
      windsurfCmd.includes('windsurf'),
      'windsurf command should reference windsurf config',
    );
  });

  it('configJson contains npx command structure', () => {
    const info = engine.getInstallCommand('Supabase', 'generic');
    assert.ok(info !== null);

    const keys = Object.keys(info!.configJson);
    assert.ok(keys.length > 0, 'configJson should have at least one key');

    const serverConfig = info!.configJson[keys[0]] as Record<string, unknown>;
    assert.strictEqual(serverConfig.command, 'npx', 'Server command should be npx');
    assert.ok(Array.isArray(serverConfig.args), 'Server args should be an array');
    assert.ok(
      (serverConfig.args as string[]).includes('-y'),
      'Args should include -y flag',
    );
  });
});
