/**
 * HMAC-SHA256 link integrity verification for affiliate links.
 *
 * Each installation derives a machine-specific key from the hostname and
 * package version, so signatures generated on one machine cannot be reused
 * on another.
 */

import crypto from 'node:crypto';
import os from 'node:os';
import type Database from 'better-sqlite3';

// ---------------------------------------------------------------------------
// Key derivation
// ---------------------------------------------------------------------------

const VERSION = '0.1.0';

/**
 * Derive a machine-specific HMAC key.
 * The key is a SHA-256 hash of `toolmesh:<hostname>:<version>`, meaning
 * each installation has its own signing key.
 */
function getIntegrityKey(): string {
  const hostname = os.hostname();
  return crypto
    .createHash('sha256')
    .update(`toolmesh:${hostname}:${VERSION}`)
    .digest('hex');
}

// ---------------------------------------------------------------------------
// Signing & verification
// ---------------------------------------------------------------------------

/**
 * Compute a truncated HMAC-SHA256 signature for an affiliate link.
 * Returns a 16-character hex string.
 */
export function signLink(link: string): string {
  const key = getIntegrityKey();
  return crypto
    .createHmac('sha256', key)
    .update(link)
    .digest('hex')
    .slice(0, 16);
}

/**
 * Verify that a link's signature matches the expected HMAC.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export function verifyLink(link: string, signature: string): boolean {
  const expected = signLink(link);
  if (expected.length !== signature.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(signature, 'hex'),
    );
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Batch operations
// ---------------------------------------------------------------------------

/**
 * Sign all affiliate links in the database.
 * Called after seeding to store HMAC signatures alongside each link.
 */
export function signAllLinks(db: Database.Database): void {
  // Ensure the link_signature column exists (migration)
  ensureSignatureColumn(db);

  const rows = db
    .prepare('SELECT id, affiliate_link FROM affiliate_programs')
    .all() as Array<{ id: string; affiliate_link: string }>;

  const update = db.prepare(
    'UPDATE affiliate_programs SET link_signature = ? WHERE id = ?',
  );

  const tx = db.transaction(() => {
    for (const row of rows) {
      const sig = signLink(row.affiliate_link);
      update.run(sig, row.id);
    }
  });

  tx();
}

/**
 * Verify all affiliate links in the database.
 * Returns a summary of valid vs. tampered links.
 */
export function verifyAllLinks(db: Database.Database): {
  valid: number;
  tampered: number;
  unsigned: number;
  tampered_products: string[];
} {
  // Ensure the column exists before querying
  ensureSignatureColumn(db);

  const rows = db
    .prepare(
      `SELECT ap.id, ap.affiliate_link, ap.link_signature, p.name AS product_name
       FROM affiliate_programs ap
       JOIN products p ON p.id = ap.product_id`,
    )
    .all() as Array<{
    id: string;
    affiliate_link: string;
    link_signature: string | null;
    product_name: string;
  }>;

  let valid = 0;
  let tampered = 0;
  let unsigned = 0;
  const tampered_products: string[] = [];

  for (const row of rows) {
    if (!row.link_signature) {
      unsigned++;
      continue;
    }

    if (verifyLink(row.affiliate_link, row.link_signature)) {
      valid++;
    } else {
      tampered++;
      if (!tampered_products.includes(row.product_name)) {
        tampered_products.push(row.product_name);
      }
    }
  }

  return { valid, tampered, unsigned, tampered_products };
}

// ---------------------------------------------------------------------------
// Migration helper
// ---------------------------------------------------------------------------

/**
 * Add the `link_signature` column to `affiliate_programs` if it does not
 * already exist.  Uses a safe `ALTER TABLE ... ADD COLUMN` wrapped in a
 * try/catch because SQLite throws if the column already exists.
 */
export function ensureSignatureColumn(db: Database.Database): void {
  try {
    db.exec('ALTER TABLE affiliate_programs ADD COLUMN link_signature TEXT');
  } catch {
    // Column already exists -- nothing to do.
  }
}
