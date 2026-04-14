import crypto from 'node:crypto';
import type { Product, AffiliateProgram } from '../types/product.js';
import { getDb } from './database.js';
import { ProductRepository } from './repository.js';
import { embedProduct } from './embedder.js';
import type { Embedder } from './embedder.js';
import { SEED_PRODUCTS } from './seed-data.js';

/**
 * Build the text blob used for embedding a product (matches the logic in embedProduct).
 */
function productToText(product: Pick<Product, 'name' | 'category' | 'description' | 'bestFor' | 'worstFor' | 'features'>): string {
  const parts = [
    product.name,
    product.name,
    product.category,
    product.description,
    ...product.bestFor.map((b) => `good for ${b}`),
    ...product.worstFor.map((w) => `bad for ${w}`),
    ...product.features,
  ];
  return parts.join(' ');
}

/**
 * Seed the database with the built-in product catalog.
 * Skips products that already exist (matched by name).
 *
 * When an `embedder` is provided (e.g. TransformerEmbedder), it is used to
 * generate real semantic embeddings for each product. Otherwise the synchronous
 * hash-based `embedProduct()` is used as a zero-dependency fallback.
 */
export async function seedDatabase(
  dbPath?: string,
  embedder?: Embedder,
): Promise<{ inserted: number; skipped: number }> {
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

    // Use the provided embedder for real semantic vectors, or fall back to hash-based embedProduct
    const embedding = embedder
      ? await embedder.embed(productToText(product))
      : embedProduct(product);

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
  seedDatabase().then((result) => {
    console.log(`Seeding complete: ${result.inserted} inserted, ${result.skipped} skipped.`);
    console.log(`Total products in registry: ${new ProductRepository(getDb()).count()}`);
  });
}
