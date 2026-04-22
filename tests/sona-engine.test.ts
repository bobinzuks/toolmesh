import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import Database from 'better-sqlite3';
import { SonaEngine } from '../src/learning/sona-engine.js';
import type { ConsolidationResult, SonaStats } from '../src/learning/types.js';

function makeEmbedding(seed: number, dim = 384): Float32Array {
  const arr = new Float32Array(dim);
  for (let i = 0; i < dim; i++) {
    // Deterministic pseudo-random based on seed and index
    arr[i] = Math.sin(seed * 7919 + i * 104729) * 0.5;
  }
  // Normalize to unit vector
  let norm = 0;
  for (let i = 0; i < dim; i++) norm += arr[i] * arr[i];
  norm = Math.sqrt(norm);
  if (norm > 0) for (let i = 0; i < dim; i++) arr[i] /= norm;
  return arr;
}

describe('SonaEngine', () => {
  let db: Database.Database;
  let engine: SonaEngine;

  before(() => {
    db = new Database(':memory:');
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    engine = new SonaEngine(db);
  });

  after(() => {
    db.close();
  });

  describe('beginTrajectory', () => {
    it('returns a trajectory ID', () => {
      const embedding = makeEmbedding(1);
      const id = engine.beginTrajectory(embedding);
      assert.ok(id);
      assert.ok(typeof id === 'string');
      assert.ok(id.length > 0);
    });

    it('creates an active trajectory', () => {
      const embedding = makeEmbedding(2);
      const id = engine.beginTrajectory(embedding);
      const traj = engine.getTrajectory(id);
      assert.ok(traj);
      assert.equal(traj.status, 'active');
      assert.equal(traj.quality, 0);
      assert.equal(traj.steps.length, 0);
    });
  });

  describe('addStep', () => {
    it('records a step in an active trajectory', () => {
      const embedding = makeEmbedding(3);
      const id = engine.beginTrajectory(embedding);
      engine.addStep(id, 'product-1', 'recommend', 0);
      engine.addStep(id, 'product-1', 'click', 0.3);

      const traj = engine.getTrajectory(id);
      assert.ok(traj);
      assert.equal(traj.steps.length, 2);
      assert.equal(traj.steps[0].action, 'recommend');
      assert.equal(traj.steps[0].reward, 0);
      assert.equal(traj.steps[1].action, 'click');
      assert.equal(traj.steps[1].reward, 0.3);
    });

    it('ignores steps for non-existent trajectories', () => {
      // Should not throw
      engine.addStep('nonexistent-id', 'product-1', 'click', 0.3);
    });

    it('ignores steps for completed trajectories', () => {
      const embedding = makeEmbedding(4);
      const id = engine.beginTrajectory(embedding);
      engine.addStep(id, 'product-1', 'recommend', 0);
      engine.endTrajectory(id, 0.8);

      // This should be silently ignored
      engine.addStep(id, 'product-1', 'click', 0.3);

      const traj = engine.getTrajectory(id);
      assert.ok(traj);
      assert.equal(traj.steps.length, 1); // Only the recommend step
    });
  });

  describe('endTrajectory', () => {
    it('completes a trajectory with a quality score', () => {
      const embedding = makeEmbedding(5);
      const id = engine.beginTrajectory(embedding);
      engine.addStep(id, 'product-1', 'recommend', 0);
      engine.addStep(id, 'product-1', 'signup', 0.7);
      engine.endTrajectory(id, 0.9);

      const traj = engine.getTrajectory(id);
      assert.ok(traj);
      assert.equal(traj.status, 'completed');
      assert.equal(traj.quality, 0.9);
      assert.ok(traj.endedAt);
    });

    it('clamps quality to [0, 1]', () => {
      const embedding = makeEmbedding(6);
      const id = engine.beginTrajectory(embedding);
      engine.endTrajectory(id, 1.5);

      const traj = engine.getTrajectory(id);
      assert.ok(traj);
      assert.equal(traj.quality, 1);
    });

    it('ignores end for non-existent trajectories', () => {
      // Should not throw
      engine.endTrajectory('nonexistent-id', 0.5);
    });
  });

  describe('getStats', () => {
    it('returns correct statistics', () => {
      const freshDb = new Database(':memory:');
      freshDb.pragma('journal_mode = WAL');
      freshDb.pragma('foreign_keys = ON');
      const freshEngine = new SonaEngine(freshDb);

      const stats = freshEngine.getStats();
      assert.equal(stats.totalTrajectories, 0);
      assert.equal(stats.completedTrajectories, 0);
      assert.equal(stats.patterns, 0);
      assert.equal(stats.avgQuality, 0);

      // Create and complete some trajectories
      const id1 = freshEngine.beginTrajectory(makeEmbedding(10));
      freshEngine.addStep(id1, 'p1', 'recommend', 0);
      freshEngine.endTrajectory(id1, 0.8);

      const id2 = freshEngine.beginTrajectory(makeEmbedding(11));
      freshEngine.addStep(id2, 'p2', 'recommend', 0);
      freshEngine.endTrajectory(id2, 0.6);

      const id3 = freshEngine.beginTrajectory(makeEmbedding(12)); // Still active

      const stats2 = freshEngine.getStats();
      assert.equal(stats2.totalTrajectories, 3);
      assert.equal(stats2.completedTrajectories, 2);
      assert.equal(stats2.avgQuality, 0.7);

      freshDb.close();
    });
  });

  describe('adjustScores', () => {
    it('passes through scores unchanged when no bias exists', () => {
      const freshDb = new Database(':memory:');
      freshDb.pragma('journal_mode = WAL');
      freshDb.pragma('foreign_keys = ON');
      const freshEngine = new SonaEngine(freshDb);

      const scores = new Map([['p1', 0.8], ['p2', 0.6]]);
      const adjusted = freshEngine.adjustScores(makeEmbedding(20), scores);

      assert.equal(adjusted.get('p1'), 0.8);
      assert.equal(adjusted.get('p2'), 0.6);

      freshDb.close();
    });
  });

  describe('consolidate', () => {
    it('processes completed trajectories into patterns', () => {
      const freshDb = new Database(':memory:');
      freshDb.pragma('journal_mode = WAL');
      freshDb.pragma('foreign_keys = ON');
      const freshEngine = new SonaEngine(freshDb);

      // Create several completed trajectories with similar embeddings
      for (let i = 0; i < 5; i++) {
        const id = freshEngine.beginTrajectory(makeEmbedding(100 + i));
        freshEngine.addStep(id, 'product-a', 'recommend', 0);
        freshEngine.addStep(id, 'product-a', 'click', 0.3);
        freshEngine.addStep(id, 'product-a', 'signup', 0.7);
        freshEngine.endTrajectory(id, 0.85);
      }

      const result = freshEngine.consolidate();
      assert.equal(result.trajectoriesProcessed, 5);
      assert.ok(result.patternsCreated > 0 || result.patternsUpdated > 0);
      assert.equal(result.biasUpdated, true);

      // Verify patterns were created
      const stats = freshEngine.getStats();
      assert.ok(stats.patterns > 0);

      freshDb.close();
    });

    it('returns zeros when no trajectories to process', () => {
      const freshDb = new Database(':memory:');
      freshDb.pragma('journal_mode = WAL');
      freshDb.pragma('foreign_keys = ON');
      const freshEngine = new SonaEngine(freshDb);

      const result = freshEngine.consolidate();
      assert.equal(result.trajectoriesProcessed, 0);
      assert.equal(result.patternsCreated, 0);
      assert.equal(result.patternsUpdated, 0);
      assert.equal(result.biasUpdated, false);

      freshDb.close();
    });

    it('merges similar trajectories into the same pattern', () => {
      const freshDb = new Database(':memory:');
      freshDb.pragma('journal_mode = WAL');
      freshDb.pragma('foreign_keys = ON');
      const freshEngine = new SonaEngine(freshDb);

      // Use the same embedding to guarantee merging
      const embedding = makeEmbedding(200);
      for (let i = 0; i < 3; i++) {
        const id = freshEngine.beginTrajectory(embedding);
        freshEngine.addStep(id, 'product-x', 'recommend', 0);
        freshEngine.endTrajectory(id, 0.9);
      }

      const result = freshEngine.consolidate();
      assert.equal(result.trajectoriesProcessed, 3);
      // First trajectory creates a pattern, remaining two merge into it
      assert.equal(result.patternsCreated, 1);
      assert.equal(result.patternsUpdated, 2);

      freshDb.close();
    });
  });

  describe('findPatterns', () => {
    it('finds patterns similar to a query', () => {
      const freshDb = new Database(':memory:');
      freshDb.pragma('journal_mode = WAL');
      freshDb.pragma('foreign_keys = ON');
      const freshEngine = new SonaEngine(freshDb);

      // Create and consolidate trajectories
      const embedding = makeEmbedding(300);
      const id = freshEngine.beginTrajectory(embedding);
      freshEngine.addStep(id, 'product-z', 'recommend', 0);
      freshEngine.addStep(id, 'product-z', 'signup', 0.7);
      freshEngine.endTrajectory(id, 0.9);
      freshEngine.consolidate();

      // Search with the same embedding
      const patterns = freshEngine.findPatterns(embedding, 5);
      assert.ok(patterns.length > 0);
      assert.ok(patterns[0].qualityAvg > 0);
      assert.ok(patterns[0].topProducts.includes('product-z'));

      freshDb.close();
    });

    it('returns empty array when no patterns exist', () => {
      const freshDb = new Database(':memory:');
      freshDb.pragma('journal_mode = WAL');
      freshDb.pragma('foreign_keys = ON');
      const freshEngine = new SonaEngine(freshDb);

      const patterns = freshEngine.findPatterns(makeEmbedding(400), 5);
      assert.equal(patterns.length, 0);

      freshDb.close();
    });
  });

  describe('abandonStale', () => {
    it('abandons trajectories older than maxAge', () => {
      const freshDb = new Database(':memory:');
      freshDb.pragma('journal_mode = WAL');
      freshDb.pragma('foreign_keys = ON');
      const freshEngine = new SonaEngine(freshDb);

      const id = freshEngine.beginTrajectory(makeEmbedding(500));

      // Force the started_at timestamp to be old
      freshDb.prepare(
        "UPDATE sona_trajectories SET started_at = '2020-01-01T00:00:00.000Z' WHERE id = ?",
      ).run(id);

      const abandoned = freshEngine.abandonStale(1000); // 1 second
      assert.equal(abandoned, 1);

      const traj = freshEngine.getTrajectory(id);
      assert.ok(traj);
      assert.equal(traj.status, 'abandoned');

      freshDb.close();
    });
  });

  describe('full learning loop', () => {
    it('adjusts scores after learning from trajectories', () => {
      const freshDb = new Database(':memory:');
      freshDb.pragma('journal_mode = WAL');
      freshDb.pragma('foreign_keys = ON');
      const freshEngine = new SonaEngine(freshDb);

      const queryEmb = makeEmbedding(600);

      // Simulate 10 successful trajectories for product-winner
      for (let i = 0; i < 10; i++) {
        const id = freshEngine.beginTrajectory(queryEmb);
        freshEngine.addStep(id, 'product-winner', 'recommend', 0);
        freshEngine.addStep(id, 'product-winner', 'click', 0.3);
        freshEngine.addStep(id, 'product-winner', 'signup', 0.7);
        freshEngine.addStep(id, 'product-winner', 'retain', 0.9);
        freshEngine.endTrajectory(id, 0.95);
      }

      // Consolidate to learn patterns
      const consResult = freshEngine.consolidate();
      assert.ok(consResult.biasUpdated);
      assert.ok(consResult.trajectoriesProcessed === 10);

      // Now check that scores are adjusted
      const scores = new Map([
        ['product-winner', 0.5],
        ['product-loser', 0.5],
      ]);
      const adjusted = freshEngine.adjustScores(queryEmb, scores);

      // product-winner should get a boost from SONA patterns
      const winnerScore = adjusted.get('product-winner')!;
      const loserScore = adjusted.get('product-loser')!;
      assert.ok(winnerScore > loserScore, `Expected winner (${winnerScore}) > loser (${loserScore})`);

      freshDb.close();
    });
  });
});
