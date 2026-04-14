import crypto from 'node:crypto';
import type { Product, AffiliateProgram } from '../types/product.js';
import { getDb } from './database.js';
import { ProductRepository } from './repository.js';
import { embedProduct } from './embedder.js';
import { SEED_PRODUCTS } from './seed-data.js';

/**
 * Seed the database with the built-in product catalog.
 * Skips products that already exist (matched by name).
 */
export function seedDatabase(dbPath?: string): { inserted: number; skipped: number } {
  const db = getDb(dbPath);
  const repo = new ProductRepository(db);

  let inserted = 0;
  let skipped = 0;

  for (const seed of SEED_PRODUCTS) {
    // Skip if a product with this name already exists
    const existing = repo.findByName(seed.product.name);
    if (existing) {
      skipped++;
      continue;
    }

    const now = new Date().toISOString();
    const productId = crypto.randomUUID();

    const product: Product = {
      id: productId,
      createdAt: now,
      updatedAt: now,
      ...seed.product,
    };

    const programs: AffiliateProgram[] = seed.programs.map((prog) => ({
      id: crypto.randomUUID(),
      productId,
      ...prog,
    }));

    const embedding = embedProduct(product);

    repo.insert(product, embedding, programs);
    inserted++;
  }

  return { inserted, skipped };
}

/** Alias for backwards compatibility with cli.ts */
export const runSeeder = seedDatabase;

/**
 * Run the seeder directly: `node dist/registry/seeder.js`
 */
const isMainModule =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  (process.argv[1].endsWith('/seeder.js') || process.argv[1].endsWith('/registry/seeder.js'));

if (isMainModule) {
  const result = seedDatabase();
  console.log(`Seeding complete: ${result.inserted} inserted, ${result.skipped} skipped.`);
  console.log(`Total products in registry: ${new ProductRepository(getDb()).count()}`);
}
