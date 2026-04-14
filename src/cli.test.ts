import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync, rmSync } from 'node:fs';
import crypto from 'node:crypto';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PROJECT_ROOT = join(import.meta.dirname, '..');

/**
 * Run the CLI as a subprocess using tsx.
 * We set AAN_DATA_DIR to a temp directory so tests do not pollute the real DB.
 */
function runCli(args: string, env?: Record<string, string>): string {
  const tsxBin = join(PROJECT_ROOT, 'node_modules', '.bin', 'tsx');
  const cmd = `${tsxBin} ${join(PROJECT_ROOT, 'src', 'cli.ts')} ${args}`;
  try {
    const output = execSync(cmd, {
      cwd: tmpWorkDir,
      encoding: 'utf-8',
      timeout: 15_000,
      env: {
        ...process.env,
        ...env,
        // Point to a temp data directory so we don't touch real data
        AAN_DATA_DIR: tmpDataDir,
      },
    });
    return output;
  } catch (err: unknown) {
    // execSync throws on non-zero exit. The output is still accessible.
    const execErr = err as { stdout?: string; stderr?: string; status?: number };
    return (execErr.stdout ?? '') + (execErr.stderr ?? '');
  }
}

// ---------------------------------------------------------------------------
// Temp directories for isolation
// ---------------------------------------------------------------------------

let tmpWorkDir: string;
let tmpDataDir: string;

before(() => {
  const id = crypto.randomUUID();
  tmpWorkDir = join(tmpdir(), `aan-cli-test-work-${id}`);
  tmpDataDir = join(tmpdir(), `aan-cli-test-data-${id}`);
  mkdirSync(tmpWorkDir, { recursive: true });
  mkdirSync(tmpDataDir, { recursive: true });
});

after(() => {
  try {
    rmSync(tmpWorkDir, { recursive: true, force: true });
  } catch { /* best-effort */ }
  try {
    rmSync(tmpDataDir, { recursive: true, force: true });
  } catch { /* best-effort */ }
});

// ---------------------------------------------------------------------------
// CLI help
// ---------------------------------------------------------------------------

describe('CLI help output', () => {
  it('outputs help text with no args', () => {
    // With no args, the default command is "help"
    const output = runCli('');
    assert.ok(output.includes('aan'), 'Help should mention the "aan" command name');
    assert.ok(output.includes('Commands:'), 'Help should list commands');
    assert.ok(output.includes('seed'), 'Help should mention seed command');
    assert.ok(output.includes('status'), 'Help should mention status command');
    assert.ok(output.includes('init'), 'Help should mention init command');
    assert.ok(output.includes('serve'), 'Help should mention serve command');
  });

  it('outputs help text with "help" command', () => {
    const output = runCli('help');
    assert.ok(output.includes('Usage:'), 'Help should include usage section');
    assert.ok(output.includes('Commands:'), 'Help should include commands section');
  });

  it('outputs help text with "--help" flag', () => {
    const output = runCli('--help');
    assert.ok(output.includes('Commands:'));
  });
});

// ---------------------------------------------------------------------------
// CLI version
// ---------------------------------------------------------------------------

describe('CLI version output', () => {
  it('shows version with "--version"', () => {
    const output = runCli('--version');
    assert.ok(output.trim().match(/^\d+\.\d+\.\d+$/), `Version output should be semver, got: "${output.trim()}"`);
  });

  it('shows version with "-v"', () => {
    const output = runCli('-v');
    assert.ok(output.trim().match(/^\d+\.\d+\.\d+$/));
  });
});

// ---------------------------------------------------------------------------
// CLI seed
// ---------------------------------------------------------------------------

describe('CLI seed command', () => {
  it('seeds a fresh database and reports inserted products', () => {
    const output = runCli('seed');
    assert.ok(output.includes('Seeding'), 'Should show seeding message');
    // After seeding, it should mention inserted count or that DB is already seeded
    assert.ok(
      output.includes('Inserted:') || output.includes('already seeded'),
      `Should report insertion or skip status. Got: ${output}`,
    );
    assert.ok(output.includes('Total products in registry:'), 'Should report total count');
  });

  it('second seed skips already-existing products', () => {
    // First seed already ran above; run again
    const output = runCli('seed');
    assert.ok(
      output.includes('already seeded') || output.includes('Skipped:'),
      'Second seed should skip existing products',
    );
  });
});

// ---------------------------------------------------------------------------
// CLI status
// ---------------------------------------------------------------------------

describe('CLI status command', () => {
  it('outputs product count after seeding', () => {
    // Ensure seed has been run first
    runCli('seed');
    const output = runCli('status');
    assert.ok(output.includes('Total products:'), 'Should show total products');
    assert.ok(output.includes('Active products:'), 'Should show active products');
    assert.ok(output.includes('Affiliate programs:'), 'Should show affiliate programs');
    assert.ok(output.includes('Categories:'), 'Should show categories');
  });

  it('shows products by category breakdown', () => {
    const output = runCli('status');
    // After seeding, there should be at least one category listed
    assert.ok(output.includes('Products by category:'), 'Should include category breakdown');
  });
});

// ---------------------------------------------------------------------------
// CLI unknown command
// ---------------------------------------------------------------------------

describe('CLI unknown command', () => {
  it('prints help on unknown command', () => {
    const output = runCli('foobar');
    assert.ok(output.includes('Unknown command: foobar'), 'Should report unknown command');
    assert.ok(output.includes('Commands:'), 'Should still print help');
  });
});
