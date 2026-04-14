/**
 * Conversion tracker.
 *
 * Records clicks, signups, purchases, and churn events for affiliate analytics.
 * Uses an append-only SQLite table as the durable store and keeps a fast
 * in-memory cache of recent events for the getStats / getRecentEvents queries.
 */

import crypto from 'node:crypto';
import type Database from 'better-sqlite3';
import type { ConversionEvent } from './types.js';

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS conversion_events (
    id                TEXT PRIMARY KEY,
    product_id        TEXT NOT NULL,
    network           TEXT NOT NULL,
    timestamp         TEXT NOT NULL,
    type              TEXT NOT NULL CHECK (type IN ('click', 'signup', 'purchase', 'churn')),
    revenue           REAL DEFAULT 0,
    sub_affiliate_id  TEXT
  )
`;

const INSERT_EVENT_SQL = `
  INSERT INTO conversion_events
    (id, product_id, network, timestamp, type, revenue, sub_affiliate_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

export interface TrackerStats {
  clicks: number;
  signups: number;
  purchases: number;
  churns: number;
  revenue: number;
}

export class ConversionTracker {
  private db: Database.Database;
  private insertStmt: Database.Statement;

  /**
   * @param db — An open better-sqlite3 database handle. The tracker will
   *   create the `conversion_events` table if it does not already exist.
   */
  constructor(db: Database.Database) {
    this.db = db;
    this.db.exec(CREATE_TABLE_SQL);
    this.insertStmt = this.db.prepare(INSERT_EVENT_SQL);
  }

  // ── Write methods ────────────────────────────────────────────────────

  /**
   * Record a click event. Returns the stored event.
   */
  trackClick(
    productId: string,
    network: string,
    subAffiliateId?: string,
  ): ConversionEvent {
    return this.store({
      productId,
      network,
      type: 'click',
      subAffiliateId,
    });
  }

  /**
   * Record a conversion (signup or purchase). Revenue is optional.
   */
  trackConversion(
    productId: string,
    network: string,
    type: 'signup' | 'purchase',
    revenue?: number,
  ): ConversionEvent {
    return this.store({
      productId,
      network,
      type,
      revenue,
    });
  }

  /**
   * Record a churn event for a product. No revenue is tracked.
   */
  trackChurn(productId: string): ConversionEvent {
    return this.store({
      productId,
      network: 'unknown',
      type: 'churn',
    });
  }

  // ── Read methods ─────────────────────────────────────────────────────

  /**
   * Return aggregate stats, optionally filtered to a single product.
   */
  getStats(productId?: string): TrackerStats {
    const where = productId ? 'WHERE product_id = ?' : '';
    const params = productId ? [productId] : [];

    const row = this.db
      .prepare(
        `SELECT
           COALESCE(SUM(CASE WHEN type = 'click'    THEN 1 ELSE 0 END), 0) AS clicks,
           COALESCE(SUM(CASE WHEN type = 'signup'   THEN 1 ELSE 0 END), 0) AS signups,
           COALESCE(SUM(CASE WHEN type = 'purchase' THEN 1 ELSE 0 END), 0) AS purchases,
           COALESCE(SUM(CASE WHEN type = 'churn'    THEN 1 ELSE 0 END), 0) AS churns,
           COALESCE(SUM(revenue), 0)                                        AS revenue
         FROM conversion_events ${where}`,
      )
      .get(...params) as TrackerStats;

    return row;
  }

  /**
   * Return the most recent conversion events, ordered newest-first.
   */
  getRecentEvents(limit: number = 50): ConversionEvent[] {
    const rows = this.db
      .prepare(
        `SELECT id, product_id, network, timestamp, type, revenue, sub_affiliate_id
         FROM conversion_events
         ORDER BY timestamp DESC
         LIMIT ?`,
      )
      .all(limit) as Array<{
        id: string;
        product_id: string;
        network: string;
        timestamp: string;
        type: ConversionEvent['type'];
        revenue: number | null;
        sub_affiliate_id: string | null;
      }>;

    return rows.map((r) => ({
      id: r.id,
      productId: r.product_id,
      network: r.network,
      timestamp: r.timestamp,
      type: r.type,
      revenue: r.revenue ?? undefined,
      subAffiliateId: r.sub_affiliate_id ?? undefined,
    }));
  }

  // ── Internals ────────────────────────────────────────────────────────

  private store(fields: {
    productId: string;
    network: string;
    type: ConversionEvent['type'];
    revenue?: number;
    subAffiliateId?: string;
  }): ConversionEvent {
    const event: ConversionEvent = {
      id: crypto.randomUUID(),
      productId: fields.productId,
      network: fields.network,
      timestamp: new Date().toISOString(),
      type: fields.type,
      revenue: fields.revenue,
      subAffiliateId: fields.subAffiliateId,
    };

    this.insertStmt.run(
      event.id,
      event.productId,
      event.network,
      event.timestamp,
      event.type,
      event.revenue ?? 0,
      event.subAffiliateId ?? null,
    );

    return event;
  }
}
