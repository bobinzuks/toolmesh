import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import crypto from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  signLink,
  verifyLink,
  signAllLinks,
  verifyAllLinks,
} from './link-integrity.js';
import { resetDb, closeDb } from './database.js';
import { seedDatabase } from './seeder.js';

// ---------------------------------------------------------------------------
// Pure function tests (no database needed)
// ---------------------------------------------------------------------------

describe('signLink', () => {
  it('returns a hex string', () => {
    const sig = signLink('https://example.com/?ref=abc');
    assert.match(sig, /^[0-9a-f]+$/, 'Signature should be a lowercase hex string');
  });

  it('returns a 16-character truncated HMAC', () => {
    const sig = signLink('https://example.com/?ref=abc');
    assert.strictEqual(sig.length, 16, 'Signature should be 16 hex characters');
  });

  it('is deterministic (same input produces same signature)', () => {
    const link = 'https://m.do.co/c/test123';
    const sig1 = signLink(link);
    const sig2 = signLink(link);
    assert.strictEqual(sig1, sig2, 'Same link should always produce the same signature');
  });

  it('produces different signatures for different links', () => {
    const sig1 = signLink('https://example.com/?ref=aaa');
    const sig2 = signLink('https://example.com/?ref=bbb');
    assert.notStrictEqual(sig1, sig2, 'Different links should produce different signatures');
  });
});

describe('verifyLink', () => {
  it('returns true for a correctly signed link', () => {
    const link = 'https://stripe.com/?ref=partner';
    const sig = signLink(link);
    assert.strictEqual(verifyLink(link, sig), true);
  });

  it('returns false when the link has been tampered with', () => {
    const link = 'https://stripe.com/?ref=partner';
    const sig = signLink(link);
    const tamperedLink = 'https://evil.com/?ref=partner';
    assert.strictEqual(verifyLink(tamperedLink, sig), false);
  });

  it('returns false when the signature has been tampered with', () => {
    const link = 'https://stripe.com/?ref=partner';
    const sig = signLink(link);
    // Flip a character in the signature
    const badSig = sig.slice(0, -1) + (sig.endsWith('0') ? '1' : '0');
    assert.strictEqual(verifyLink(link, badSig), false);
  });

  it('returns false for a completely wrong signature length', () => {
    const link = 'https://stripe.com/?ref=partner';
    assert.strictEqual(verifyLink(link, 'abcd'), false);
  });

  it('returns false for non-hex signature input', () => {
    const link = 'https://stripe.com/?ref=partner';
    assert.strictEqual(verifyLink(link, 'zzzzzzzzzzzzzzzz'), false);
  });
});

// ---------------------------------------------------------------------------
// Database batch operation tests
// ---------------------------------------------------------------------------

describe('signAllLinks / verifyAllLinks', () => {
  let tmpDir: string;
  let dbPath: string;

  before(async () => {
    tmpDir = mkdtempSync(join(tmpdir(), 'aan-link-integrity-test-'));
    dbPath = join(tmpDir, `test-${crypto.randomUUID()}.db`);
    resetDb(dbPath);
    await seedDatabase(dbPath);
  });

  after(() => {
    closeDb();
    try {
      rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // best-effort cleanup
    }
  });

  it('signAllLinks signs all links in the database', () => {
    const db = resetDb(dbPath);
    // Seed again on fresh DB
    // Links are already signed during seedDatabase, but let's re-sign explicitly
    signAllLinks(db);

    // All rows should now have a non-null link_signature
    const rows = db
      .prepare('SELECT link_signature FROM affiliate_programs')
      .all() as Array<{ link_signature: string | null }>;

    assert.ok(rows.length > 0, 'Should have affiliate programs in the database');

    for (const row of rows) {
      assert.ok(
        row.link_signature !== null && row.link_signature.length > 0,
        'Every affiliate program should have a link_signature after signAllLinks',
      );
    }
  });

  it('verifyAllLinks reports all valid when nothing is tampered', () => {
    const db = resetDb(dbPath);
    // Re-seed and sign
    signAllLinks(db);

    const result = verifyAllLinks(db);
    assert.strictEqual(result.tampered, 0, 'No links should be tampered');
    assert.strictEqual(result.tampered_products.length, 0);
    assert.ok(result.valid > 0, 'Should have at least one valid signed link');
  });

  it('verifyAllLinks detects tampered links', () => {
    const db = resetDb(dbPath);
    signAllLinks(db);

    // Tamper with one link in the database
    const row = db
      .prepare('SELECT id, affiliate_link FROM affiliate_programs LIMIT 1')
      .get() as { id: string; affiliate_link: string };

    db.prepare('UPDATE affiliate_programs SET affiliate_link = ? WHERE id = ?')
      .run('https://evil.com/hijacked', row.id);

    const result = verifyAllLinks(db);
    assert.ok(result.tampered > 0, 'Should detect at least one tampered link');
    assert.ok(result.tampered_products.length > 0, 'Should report tampered product names');
  });
});
