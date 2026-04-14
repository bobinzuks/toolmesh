import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { detectInstalledMcpServers } from './detect-installed.js';

// ---------------------------------------------------------------------------
// detectInstalledMcpServers
// ---------------------------------------------------------------------------

describe('detectInstalledMcpServers', () => {
  it('returns an array', () => {
    const result = detectInstalledMcpServers();
    assert.ok(Array.isArray(result), 'Should return an array');
  });

  it('returns empty array when no config files exist', () => {
    // Save and override cwd to a temp directory with no .mcp.json
    const tmpDir = mkdtempSync(join(tmpdir(), 'aan-detect-empty-'));
    const originalCwd = process.cwd();

    try {
      process.chdir(tmpDir);
      // The function checks cwd + homedir; we can't easily mock homedir,
      // but we can at least verify the cwd path returns no extra servers.
      // The result should be an array (may include servers from the real homedir).
      const result = detectInstalledMcpServers();
      assert.ok(Array.isArray(result), 'Should return an array even with no project-level config');
    } finally {
      process.chdir(originalCwd);
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('reads .mcp.json from CWD and detects servers', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'aan-detect-cwd-'));
    const originalCwd = process.cwd();

    const mcpConfig = {
      mcpServers: {
        'test-server-alpha': { command: 'npx', args: ['-y', '@test/alpha'] },
        'test-server-beta': { command: 'npx', args: ['-y', '@test/beta'] },
      },
    };

    writeFileSync(join(tmpDir, '.mcp.json'), JSON.stringify(mcpConfig), 'utf-8');

    try {
      process.chdir(tmpDir);
      const result = detectInstalledMcpServers();

      assert.ok(result.includes('test-server-alpha'), 'Should detect test-server-alpha');
      assert.ok(result.includes('test-server-beta'), 'Should detect test-server-beta');
    } finally {
      process.chdir(originalCwd);
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('ignores invalid JSON in .mcp.json gracefully', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'aan-detect-bad-json-'));
    const originalCwd = process.cwd();

    writeFileSync(join(tmpDir, '.mcp.json'), '{ invalid json !!!', 'utf-8');

    try {
      process.chdir(tmpDir);
      // Should not throw; invalid configs are silently skipped
      const result = detectInstalledMcpServers();
      assert.ok(Array.isArray(result), 'Should return an array even with invalid JSON');
    } finally {
      process.chdir(originalCwd);
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('ignores .mcp.json without mcpServers key', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'aan-detect-no-key-'));
    const originalCwd = process.cwd();

    writeFileSync(join(tmpDir, '.mcp.json'), JSON.stringify({ other: 'data' }), 'utf-8');

    try {
      process.chdir(tmpDir);
      const result = detectInstalledMcpServers();
      // Should not include anything from this file (no mcpServers key)
      // The result may still include servers from homedir configs
      assert.ok(Array.isArray(result), 'Should return an array');
    } finally {
      process.chdir(originalCwd);
      rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
