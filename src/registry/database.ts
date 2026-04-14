import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
import { join, dirname } from 'node:path';
import { mkdirSync, chmodSync, existsSync } from 'node:fs';

let db: Database.Database | null = null;

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    pricing TEXT NOT NULL,
    features TEXT NOT NULL DEFAULT '[]',
    integrations TEXT NOT NULL DEFAULT '[]',
    best_for TEXT NOT NULL DEFAULT '[]',
    worst_for TEXT NOT NULL DEFAULT '[]',
    trust_score REAL NOT NULL DEFAULT 0.5,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS affiliate_programs (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    network TEXT NOT NULL,
    affiliate_link TEXT NOT NULL,
    payout_type TEXT NOT NULL,
    payout_amount REAL NOT NULL,
    payout_currency TEXT NOT NULL DEFAULT 'USD',
    cookie_days INTEGER NOT NULL DEFAULT 30,
    approved INTEGER NOT NULL DEFAULT 0,
    link_signature TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
  CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
  CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
  CREATE INDEX IF NOT EXISTS idx_affiliate_programs_product_id ON affiliate_programs(product_id);
`;

const VEC_TABLE_SQL = `
  CREATE VIRTUAL TABLE IF NOT EXISTS product_embeddings USING vec0(
    id TEXT PRIMARY KEY,
    embedding float[384]
  );
`;

function initializeDatabase(dbPath?: string): Database.Database {
  const resolvedPath = dbPath ?? join(process.cwd(), 'data', 'registry.db');

  mkdirSync(dirname(resolvedPath), { recursive: true });

  const instance = new Database(resolvedPath);

  instance.pragma('journal_mode = WAL');
  instance.pragma('foreign_keys = ON');

  sqliteVec.load(instance);

  instance.exec(SCHEMA_SQL);
  instance.exec(VEC_TABLE_SQL);

  // Migration: add link_signature column if upgrading from an older schema.
  // ALTER TABLE ... ADD COLUMN throws if the column already exists, which is
  // harmless on fresh databases where CREATE TABLE already includes it.
  try {
    instance.exec('ALTER TABLE affiliate_programs ADD COLUMN link_signature TEXT');
  } catch {
    // Column already exists -- nothing to do.
  }

  // Set database file permissions to owner-only (0600) to prevent other
  // users on the machine from reading affiliate link data.
  try {
    chmodSync(resolvedPath, 0o600);
    // WAL and SHM files
    const walPath = resolvedPath + '-wal';
    const shmPath = resolvedPath + '-shm';
    if (existsSync(walPath)) chmodSync(walPath, 0o600);
    if (existsSync(shmPath)) chmodSync(shmPath, 0o600);
  } catch {
    // Non-fatal: permissions may not be settable on all filesystems.
  }

  return instance;
}

export function getDb(dbPath?: string): Database.Database {
  if (!db) {
    db = initializeDatabase(dbPath);
  }
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function resetDb(dbPath?: string): Database.Database {
  closeDb();
  db = initializeDatabase(dbPath);
  return db;
}
