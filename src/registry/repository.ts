import type Database from 'better-sqlite3';
import type { Product, AffiliateProgram, ScoredProduct } from '../types/product.js';
import { getDb } from './database.js';

interface ProductRow {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: string;
  features: string;
  integrations: string;
  best_for: string;
  worst_for: string;
  trust_score: number;
  active: number;
  created_at: string;
  updated_at: string;
}

interface AffiliateProgramRow {
  id: string;
  product_id: string;
  network: string;
  affiliate_link: string;
  payout_type: string;
  payout_amount: number;
  payout_currency: string;
  cookie_days: number;
  approved: number;
  link_signature: string | null;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    pricing: row.pricing,
    features: JSON.parse(row.features) as string[],
    integrations: JSON.parse(row.integrations) as string[],
    bestFor: JSON.parse(row.best_for) as string[],
    worstFor: JSON.parse(row.worst_for) as string[],
    trustScore: row.trust_score,
    active: row.active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToAffiliateProgram(row: AffiliateProgramRow): AffiliateProgram {
  return {
    id: row.id,
    productId: row.product_id,
    network: row.network,
    affiliateLink: row.affiliate_link,
    payoutType: row.payout_type as AffiliateProgram['payoutType'],
    payoutAmount: row.payout_amount,
    payoutCurrency: row.payout_currency,
    cookieDays: row.cookie_days,
    approved: row.approved === 1,
    linkSignature: row.link_signature ?? undefined,
  };
}

export class ProductRepository {
  private db: Database.Database;

  constructor(db?: Database.Database) {
    this.db = db ?? getDb();
  }

  /**
   * Insert a product with its embedding and affiliate programs in a single transaction.
   */
  insert(product: Product, embedding: Float32Array, programs: AffiliateProgram[]): void {
    const now = new Date().toISOString();

    const insertProduct = this.db.prepare(`
      INSERT OR REPLACE INTO products
        (id, name, category, description, pricing, features, integrations,
         best_for, worst_for, trust_score, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertEmbedding = this.db.prepare(`
      INSERT OR REPLACE INTO product_embeddings (id, embedding)
      VALUES (?, ?)
    `);

    const insertProgram = this.db.prepare(`
      INSERT OR REPLACE INTO affiliate_programs
        (id, product_id, network, affiliate_link, payout_type,
         payout_amount, payout_currency, cookie_days, approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const tx = this.db.transaction(() => {
      insertProduct.run(
        product.id,
        product.name,
        product.category,
        product.description,
        product.pricing,
        JSON.stringify(product.features),
        JSON.stringify(product.integrations),
        JSON.stringify(product.bestFor),
        JSON.stringify(product.worstFor),
        product.trustScore,
        product.active ? 1 : 0,
        product.createdAt || now,
        product.updatedAt || now,
      );

      // sqlite-vec expects a raw buffer of float32 values
      insertEmbedding.run(product.id, Buffer.from(embedding.buffer));

      for (const prog of programs) {
        insertProgram.run(
          prog.id,
          prog.productId,
          prog.network,
          prog.affiliateLink,
          prog.payoutType,
          prog.payoutAmount,
          prog.payoutCurrency,
          prog.cookieDays,
          prog.approved ? 1 : 0,
        );
      }
    });

    tx();
  }

  /**
   * Find a product by its ID.
   */
  findById(id: string): Product | null {
    const row = this.db
      .prepare('SELECT * FROM products WHERE id = ?')
      .get(id) as ProductRow | undefined;
    return row ? rowToProduct(row) : null;
  }

  /**
   * Find a product by exact name (case-insensitive).
   */
  findByName(name: string): Product | null {
    const row = this.db
      .prepare('SELECT * FROM products WHERE LOWER(name) = LOWER(?)')
      .get(name) as ProductRow | undefined;
    return row ? rowToProduct(row) : null;
  }

  /**
   * Semantic search via sqlite-vec. Filters are applied in SQL before the
   * vector distance calculation so the index does the heavy lifting.
   */
  searchByEmbedding(
    embedding: Float32Array,
    k: number = 10,
    filters?: { category?: string; minTrust?: number },
  ): ScoredProduct[] {
    // Build the filtered product IDs subquery
    const whereClauses: string[] = ['p.active = 1'];
    const params: (string | number | Buffer)[] = [];

    if (filters?.category) {
      whereClauses.push('p.category = ?');
      params.push(filters.category);
    }
    if (filters?.minTrust !== undefined) {
      whereClauses.push('p.trust_score >= ?');
      params.push(filters.minTrust);
    }

    // sqlite-vec vec_distance_cosine returns cosine distance (0 = identical, 2 = opposite).
    // We convert to a similarity score: 1 - (distance / 2), giving range [0, 1].
    const sql = `
      SELECT
        p.*,
        ve.distance AS vec_distance
      FROM product_embeddings ve
      JOIN products p ON p.id = ve.id
      WHERE ${whereClauses.join(' AND ')}
        AND ve.embedding MATCH ?
        AND ve.k = ?
      ORDER BY ve.distance ASC
    `;

    params.push(Buffer.from(embedding.buffer));
    params.push(k);

    const rows = this.db.prepare(sql).all(...params) as (ProductRow & { vec_distance: number })[];

    return rows.map((row) => {
      const product = rowToProduct(row);
      const programs = this.getAffiliatePrograms(product.id);
      const similarity = 1 - row.vec_distance / 2;

      return {
        ...product,
        fitScore: similarity,
        confidence: similarity,
        perspectiveScores: {
          semantic: similarity,
          budgetary: 0,
          technicalFit: 0,
          scalability: 0,
          communityEcosystem: 0,
          integrationDensity: 0,
          freshness: 0,
        },
        affiliatePrograms: programs,
      };
    });
  }

  /**
   * Get all affiliate programs for a product.
   */
  getAffiliatePrograms(productId: string): AffiliateProgram[] {
    const rows = this.db
      .prepare('SELECT * FROM affiliate_programs WHERE product_id = ?')
      .all(productId) as AffiliateProgramRow[];
    return rows.map(rowToAffiliateProgram);
  }

  /**
   * Update a product's trust score.
   */
  updateTrustScore(productId: string, newScore: number): void {
    const clamped = Math.max(0, Math.min(1, newScore));
    this.db
      .prepare('UPDATE products SET trust_score = ?, updated_at = ? WHERE id = ?')
      .run(clamped, new Date().toISOString(), productId);
  }

  /**
   * Update an affiliate program's link.
   */
  updateAffiliateLink(programId: string, newLink: string): void {
    this.db
      .prepare('UPDATE affiliate_programs SET affiliate_link = ? WHERE id = ?')
      .run(newLink, programId);
  }

  /**
   * Soft-deactivate a product (keeps data but excludes from search).
   */
  deactivate(productId: string): void {
    this.db
      .prepare('UPDATE products SET active = 0, updated_at = ? WHERE id = ?')
      .run(new Date().toISOString(), productId);
  }

  /**
   * List all active products.
   */
  listAll(): Product[] {
    const rows = this.db
      .prepare('SELECT * FROM products WHERE active = 1 ORDER BY name')
      .all() as ProductRow[];
    return rows.map(rowToProduct);
  }

  /**
   * Count all active products.
   */
  count(): number {
    const row = this.db
      .prepare('SELECT COUNT(*) as cnt FROM products WHERE active = 1')
      .get() as { cnt: number };
    return row.cnt;
  }
}
