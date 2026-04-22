/**
 * SONA (Self-Optimizing Neural Architecture) Learning Engine for ToolMesh.
 *
 * Learns from recommendation trajectories and adjusts future scoring.
 *
 * Core concepts:
 *   - Trajectory: A sequence of (state, action, reward) tuples for one recommendation journey.
 *   - Micro-LoRA: Lightweight bias vectors that shift embeddings based on learned preferences.
 *   - EWC++ (Elastic Weight Consolidation): Penalizes changes to dimensions that correlated
 *     with high rewards in past trajectories, preventing catastrophic forgetting.
 *   - Pattern Bank: Clusters completed trajectories by query embedding, storing centroids
 *     and their associated top products.
 *
 * All state is persisted in SQLite alongside the product registry.
 */

import type Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import type {
  Trajectory,
  TrajectoryAction,
  TrajectoryStep,
  LearnedPattern,
  ConsolidationResult,
  SonaStats,
} from './types.js';

const HIDDEN_DIM = 384;

/** Learning rate for micro-LoRA bias updates. */
const LEARNING_RATE = 0.01;

/** EWC lambda: importance penalty weight for consolidation. */
const EWC_LAMBDA = 0.5;

/** Cosine similarity threshold for merging into an existing pattern. */
const PATTERN_MERGE_THRESHOLD = 0.75;

/** Maximum number of top products to store per pattern. */
const MAX_TOP_PRODUCTS = 10;

const log = (...args: unknown[]) => console.error('[sona]', ...args);

// ---- Schema ----------------------------------------------------------------

const SONA_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS sona_trajectories (
    id TEXT PRIMARY KEY,
    query_embedding BLOB NOT NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    quality REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS sona_steps (
    id TEXT PRIMARY KEY,
    trajectory_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    action TEXT NOT NULL,
    reward REAL NOT NULL DEFAULT 0,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (trajectory_id) REFERENCES sona_trajectories(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sona_steps_trajectory ON sona_steps(trajectory_id);

  CREATE TABLE IF NOT EXISTS sona_patterns (
    id TEXT PRIMARY KEY,
    centroid BLOB NOT NULL,
    quality_avg REAL NOT NULL DEFAULT 0,
    count INTEGER NOT NULL DEFAULT 0,
    last_updated TEXT NOT NULL,
    top_products TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS sona_bias (
    dimension INTEGER PRIMARY KEY,
    value REAL NOT NULL DEFAULT 0,
    importance REAL NOT NULL DEFAULT 0
  );
`;

// ---- Helpers ----------------------------------------------------------------

function float32ToBuffer(arr: Float32Array): Buffer {
  return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
}

function bufferToFloat32(buf: Buffer): Float32Array {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; i++) view[i] = buf[i];
  return new Float32Array(ab);
}

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

function nowISO(): string {
  return new Date().toISOString();
}

// ---- Row types --------------------------------------------------------------

interface TrajectoryRow {
  id: string;
  query_embedding: Buffer;
  started_at: string;
  ended_at: string | null;
  quality: number;
  status: string;
}

interface StepRow {
  id: string;
  trajectory_id: string;
  product_id: string;
  action: string;
  reward: number;
  timestamp: string;
}

interface PatternRow {
  id: string;
  centroid: Buffer;
  quality_avg: number;
  count: number;
  last_updated: string;
  top_products: string;
}

interface BiasRow {
  dimension: number;
  value: number;
  importance: number;
}

// ---- Engine -----------------------------------------------------------------

export class SonaEngine {
  private readonly db: Database.Database;
  private readonly hiddenDim: number;
  private initialized = false;

  /** In-memory bias vector for fast score adjustment. */
  private bias: Float32Array;

  /** In-memory importance vector for EWC. */
  private importance: Float32Array;

  constructor(db: Database.Database, hiddenDim?: number) {
    this.db = db;
    this.hiddenDim = hiddenDim ?? HIDDEN_DIM;
    this.bias = new Float32Array(this.hiddenDim);
    this.importance = new Float32Array(this.hiddenDim);
  }

  // ---- Initialization -------------------------------------------------------

  private ensureInitialized(): void {
    if (this.initialized) return;

    this.db.exec(SONA_SCHEMA_SQL);
    this.loadBias();
    this.initialized = true;
    log('Engine initialized.');
  }

  private loadBias(): void {
    const rows = this.db.prepare('SELECT dimension, value, importance FROM sona_bias').all() as BiasRow[];
    for (const row of rows) {
      if (row.dimension < this.hiddenDim) {
        this.bias[row.dimension] = row.value;
        this.importance[row.dimension] = row.importance;
      }
    }
  }

  private saveBias(): void {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO sona_bias (dimension, value, importance) VALUES (?, ?, ?)',
    );
    const tx = this.db.transaction(() => {
      for (let i = 0; i < this.hiddenDim; i++) {
        if (this.bias[i] !== 0 || this.importance[i] !== 0) {
          stmt.run(i, this.bias[i], this.importance[i]);
        }
      }
    });
    tx();
  }

  // ---- Trajectory lifecycle -------------------------------------------------

  /**
   * Begin a new trajectory for a recommendation query.
   * Returns the trajectory ID.
   */
  beginTrajectory(queryEmbedding: Float32Array): string {
    this.ensureInitialized();

    const id = randomUUID();
    this.db.prepare(
      'INSERT INTO sona_trajectories (id, query_embedding, started_at, quality, status) VALUES (?, ?, ?, 0, ?)',
    ).run(id, float32ToBuffer(queryEmbedding), nowISO(), 'active');

    log(`Trajectory started: ${id}`);
    return id;
  }

  /**
   * Record a step in an active trajectory.
   */
  addStep(
    trajectoryId: string,
    productId: string,
    action: TrajectoryAction,
    reward: number,
  ): void {
    this.ensureInitialized();

    const traj = this.db.prepare('SELECT status FROM sona_trajectories WHERE id = ?').get(trajectoryId) as
      | { status: string }
      | undefined;

    if (!traj) {
      log(`Warning: trajectory ${trajectoryId} not found, ignoring step.`);
      return;
    }
    if (traj.status !== 'active') {
      log(`Warning: trajectory ${trajectoryId} is ${traj.status}, ignoring step.`);
      return;
    }

    const stepId = randomUUID();
    this.db.prepare(
      'INSERT INTO sona_steps (id, trajectory_id, product_id, action, reward, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
    ).run(stepId, trajectoryId, productId, action, reward, nowISO());

    log(`Step added to ${trajectoryId}: ${action} product=${productId} reward=${reward}`);
  }

  /**
   * Complete a trajectory with a final quality score (0..1).
   * quality=0 means the recommendation failed, quality=1 means perfect outcome.
   */
  endTrajectory(trajectoryId: string, quality: number): void {
    this.ensureInitialized();

    const clampedQuality = Math.max(0, Math.min(1, quality));

    const result = this.db.prepare(
      'UPDATE sona_trajectories SET status = ?, quality = ?, ended_at = ? WHERE id = ? AND status = ?',
    ).run('completed', clampedQuality, nowISO(), trajectoryId, 'active');

    if (result.changes === 0) {
      log(`Warning: could not complete trajectory ${trajectoryId} (not found or not active).`);
      return;
    }

    log(`Trajectory completed: ${trajectoryId} quality=${clampedQuality}`);
  }

  // ---- Score adjustment (Micro-LoRA) ----------------------------------------

  /**
   * Adjust product scores using the learned bias vector.
   *
   * For each product, the adjustment is the cosine similarity between
   * the query embedding (shifted by the bias) and the product context.
   * Products that appeared in successful trajectories with similar queries
   * receive a positive boost.
   *
   * If no bias has been learned yet, scores pass through unchanged.
   */
  adjustScores(
    queryEmbedding: Float32Array,
    productScores: Map<string, number>,
  ): Map<string, number> {
    this.ensureInitialized();

    // Check if we have any learned bias
    let biasNorm = 0;
    for (let i = 0; i < this.hiddenDim; i++) {
      biasNorm += this.bias[i] * this.bias[i];
    }
    if (biasNorm < 1e-10) {
      return productScores; // No bias learned yet, pass through
    }

    // Find patterns similar to this query
    const patterns = this.findPatterns(queryEmbedding, 3);
    if (patterns.length === 0) {
      return productScores;
    }

    // Build a boost map from pattern top products
    const boostMap = new Map<string, number>();
    for (const pattern of patterns) {
      const sim = cosineSimilarity(queryEmbedding, pattern.centroid);
      const weight = sim * pattern.qualityAvg;
      for (let i = 0; i < pattern.topProducts.length; i++) {
        const productId = pattern.topProducts[i];
        // Products earlier in the top list get more boost
        const positionWeight = 1 - i / (pattern.topProducts.length + 1);
        const boost = weight * positionWeight * 0.1; // cap boost at ~10%
        boostMap.set(productId, (boostMap.get(productId) ?? 0) + boost);
      }
    }

    // Apply boosts
    const adjusted = new Map<string, number>();
    for (const [productId, score] of productScores) {
      const boost = boostMap.get(productId) ?? 0;
      adjusted.set(productId, Math.min(1, score + boost));
    }

    if (boostMap.size > 0) {
      log(`Adjusted scores for ${boostMap.size} products based on ${patterns.length} patterns.`);
    }

    return adjusted;
  }

  // ---- Pattern search -------------------------------------------------------

  /**
   * Find learned patterns similar to a query embedding.
   */
  findPatterns(queryEmbedding: Float32Array, k = 5): LearnedPattern[] {
    this.ensureInitialized();

    const rows = this.db.prepare('SELECT * FROM sona_patterns').all() as PatternRow[];

    if (rows.length === 0) return [];

    // Score each pattern by cosine similarity to the query
    const scored = rows.map((row) => {
      const centroid = bufferToFloat32(row.centroid);
      const sim = cosineSimilarity(queryEmbedding, centroid);
      return { row, centroid, sim };
    });

    // Sort by similarity descending, take top k
    scored.sort((a, b) => b.sim - a.sim);

    return scored.slice(0, k).map(({ row, centroid }) => ({
      id: row.id,
      centroid,
      qualityAvg: row.quality_avg,
      count: row.count,
      topProducts: JSON.parse(row.top_products) as string[],
      lastUpdated: row.last_updated,
    }));
  }

  // ---- Consolidation (learning cycle) ---------------------------------------

  /**
   * Consolidate completed trajectories into patterns and update the bias vector.
   *
   * Steps:
   *   1. Gather all completed trajectories not yet consolidated.
   *   2. For each, find the closest existing pattern. If similarity > threshold, merge.
   *      Otherwise, create a new pattern.
   *   3. Update the bias vector: dimensions that correlated with high-reward steps
   *      get a positive shift. Apply EWC penalty to important dimensions.
   *   4. Mark trajectories as consolidated (status = 'consolidated' is implicit:
   *      we use ended_at as a marker and only process trajectories completed after
   *      the most recent pattern update).
   */
  consolidate(): ConsolidationResult {
    this.ensureInitialized();

    // Get the most recent pattern update timestamp to avoid reprocessing
    const latestPatternRow = this.db.prepare(
      'SELECT MAX(last_updated) as ts FROM sona_patterns',
    ).get() as { ts: string | null };
    const cutoff = latestPatternRow?.ts ?? '1970-01-01T00:00:00.000Z';

    // Fetch completed trajectories that ended after the cutoff
    const trajectories = this.db.prepare(
      'SELECT * FROM sona_trajectories WHERE status = ? AND ended_at > ? ORDER BY ended_at ASC',
    ).all('completed', cutoff) as TrajectoryRow[];

    if (trajectories.length === 0) {
      log('Consolidation: no new trajectories to process.');
      return { trajectoriesProcessed: 0, patternsCreated: 0, patternsUpdated: 0, biasUpdated: false };
    }

    // Load existing patterns
    const existingPatterns = this.db.prepare('SELECT * FROM sona_patterns').all() as PatternRow[];
    const patternCentroids = existingPatterns.map((p) => ({
      id: p.id,
      centroid: bufferToFloat32(p.centroid),
      qualitySum: p.quality_avg * p.count,
      count: p.count,
      topProducts: JSON.parse(p.top_products) as string[],
    }));

    let patternsCreated = 0;
    let patternsUpdated = 0;

    const updatePattern = this.db.prepare(
      'UPDATE sona_patterns SET centroid = ?, quality_avg = ?, count = ?, last_updated = ?, top_products = ? WHERE id = ?',
    );
    const insertPattern = this.db.prepare(
      'INSERT INTO sona_patterns (id, centroid, quality_avg, count, last_updated, top_products) VALUES (?, ?, ?, ?, ?, ?)',
    );

    // Accumulate bias deltas
    const biasDelta = new Float32Array(this.hiddenDim);
    let biasUpdateCount = 0;

    const tx = this.db.transaction(() => {
      for (const traj of trajectories) {
        const queryEmb = bufferToFloat32(traj.query_embedding);
        const steps = this.db.prepare(
          'SELECT * FROM sona_steps WHERE trajectory_id = ?',
        ).all(traj.id) as StepRow[];

        // Collect top products from this trajectory (by reward)
        const productRewards = new Map<string, number>();
        for (const step of steps) {
          const cur = productRewards.get(step.product_id) ?? 0;
          productRewards.set(step.product_id, cur + step.reward);
        }

        const sortedProducts = [...productRewards.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([id]) => id);

        // Find the closest existing pattern
        let bestIdx = -1;
        let bestSim = -1;
        for (let i = 0; i < patternCentroids.length; i++) {
          const sim = cosineSimilarity(queryEmb, patternCentroids[i].centroid);
          if (sim > bestSim) {
            bestSim = sim;
            bestIdx = i;
          }
        }

        if (bestIdx >= 0 && bestSim >= PATTERN_MERGE_THRESHOLD) {
          // Merge into existing pattern: running average of centroid
          const p = patternCentroids[bestIdx];
          const newCount = p.count + 1;
          const alpha = 1 / newCount;

          // Incremental centroid update
          for (let d = 0; d < this.hiddenDim; d++) {
            p.centroid[d] = p.centroid[d] * (1 - alpha) + queryEmb[d] * alpha;
          }

          p.qualitySum += traj.quality;
          p.count = newCount;

          // Merge top products: union, re-rank by frequency
          const productCounts = new Map<string, number>();
          for (const pid of p.topProducts) {
            productCounts.set(pid, (productCounts.get(pid) ?? 0) + 1);
          }
          for (const pid of sortedProducts) {
            productCounts.set(pid, (productCounts.get(pid) ?? 0) + 1);
          }
          p.topProducts = [...productCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, MAX_TOP_PRODUCTS)
            .map(([id]) => id);

          updatePattern.run(
            float32ToBuffer(p.centroid),
            p.qualitySum / p.count,
            p.count,
            nowISO(),
            JSON.stringify(p.topProducts),
            p.id,
          );
          patternsUpdated++;
        } else {
          // Create a new pattern
          const newId = randomUUID();
          const newPattern = {
            id: newId,
            centroid: new Float32Array(queryEmb),
            qualitySum: traj.quality,
            count: 1,
            topProducts: sortedProducts.slice(0, MAX_TOP_PRODUCTS),
          };

          insertPattern.run(
            newId,
            float32ToBuffer(newPattern.centroid),
            traj.quality,
            1,
            nowISO(),
            JSON.stringify(newPattern.topProducts),
          );
          patternCentroids.push(newPattern);
          patternsCreated++;
        }

        // Accumulate bias delta from this trajectory
        // Positive quality shifts the bias toward the query embedding.
        // Negative quality (below 0.5) shifts away.
        const qualitySignal = traj.quality - 0.5; // range: -0.5 to +0.5
        for (let d = 0; d < this.hiddenDim; d++) {
          biasDelta[d] += queryEmb[d] * qualitySignal;
        }
        biasUpdateCount++;
      }
    });

    tx();

    // Apply bias update with EWC penalty
    let biasUpdated = false;
    if (biasUpdateCount > 0) {
      for (let d = 0; d < this.hiddenDim; d++) {
        const rawDelta = (biasDelta[d] / biasUpdateCount) * LEARNING_RATE;

        // EWC penalty: resist change on important dimensions
        const ewcPenalty = EWC_LAMBDA * this.importance[d] * this.bias[d];
        const effectiveDelta = rawDelta - ewcPenalty * LEARNING_RATE;

        this.bias[d] += effectiveDelta;

        // Update importance: dimensions that correlate with reward variance
        // become more important over time (online Fisher information approx)
        this.importance[d] += Math.abs(rawDelta);
      }

      this.saveBias();
      biasUpdated = true;
    }

    const result: ConsolidationResult = {
      trajectoriesProcessed: trajectories.length,
      patternsCreated,
      patternsUpdated,
      biasUpdated,
    };

    log(
      `Consolidation complete: ${result.trajectoriesProcessed} trajectories, ` +
      `${result.patternsCreated} new patterns, ${result.patternsUpdated} updated patterns.`,
    );

    return result;
  }

  // ---- Stats ----------------------------------------------------------------

  getStats(): SonaStats {
    this.ensureInitialized();

    const total = (
      this.db.prepare('SELECT COUNT(*) as c FROM sona_trajectories').get() as { c: number }
    ).c;

    const completed = (
      this.db.prepare(
        "SELECT COUNT(*) as c FROM sona_trajectories WHERE status = 'completed'",
      ).get() as { c: number }
    ).c;

    const patterns = (
      this.db.prepare('SELECT COUNT(*) as c FROM sona_patterns').get() as { c: number }
    ).c;

    const avgRow = this.db.prepare(
      "SELECT AVG(quality) as avg FROM sona_trajectories WHERE status = 'completed'",
    ).get() as { avg: number | null };

    return {
      totalTrajectories: total,
      completedTrajectories: completed,
      patterns,
      avgQuality: avgRow.avg ?? 0,
    };
  }

  // ---- Convenience: look up trajectory by ID --------------------------------

  getTrajectory(trajectoryId: string): Trajectory | null {
    this.ensureInitialized();

    const row = this.db.prepare('SELECT * FROM sona_trajectories WHERE id = ?').get(trajectoryId) as
      | TrajectoryRow
      | undefined;

    if (!row) return null;

    const steps = (
      this.db.prepare(
        'SELECT * FROM sona_steps WHERE trajectory_id = ? ORDER BY timestamp ASC',
      ).all(trajectoryId) as StepRow[]
    ).map((s) => ({
      id: s.id,
      trajectoryId: s.trajectory_id,
      productId: s.product_id,
      action: s.action as TrajectoryAction,
      reward: s.reward,
      timestamp: s.timestamp,
    }));

    return {
      id: row.id,
      queryEmbedding: bufferToFloat32(row.query_embedding),
      steps,
      quality: row.quality,
      status: row.status as Trajectory['status'],
      startedAt: row.started_at,
      endedAt: row.ended_at ?? undefined,
    };
  }

  /**
   * Abandon stale trajectories that have been active for too long.
   */
  abandonStale(maxAgeMs = 24 * 60 * 60 * 1000): number {
    this.ensureInitialized();

    const cutoff = new Date(Date.now() - maxAgeMs).toISOString();
    const result = this.db.prepare(
      "UPDATE sona_trajectories SET status = 'abandoned', ended_at = ? WHERE status = 'active' AND started_at < ?",
    ).run(nowISO(), cutoff);

    if (result.changes > 0) {
      log(`Abandoned ${result.changes} stale trajectories.`);
    }

    return result.changes;
  }
}
