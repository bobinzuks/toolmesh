/**
 * Types for the SONA (Self-Optimizing Neural Architecture) learning engine.
 *
 * A trajectory tracks a complete recommendation journey from query to outcome.
 * The engine learns from completed trajectories and adjusts future recommendations.
 */

export type TrajectoryAction =
  | 'search'
  | 'recommend'
  | 'click'
  | 'signup'
  | 'retain'
  | 'churn';

export type TrajectoryStatus = 'active' | 'completed' | 'abandoned';

export interface Trajectory {
  id: string;
  queryEmbedding: Float32Array;
  steps: TrajectoryStep[];
  quality: number;
  status: TrajectoryStatus;
  startedAt: string;
  endedAt?: string;
}

export interface TrajectoryStep {
  id: string;
  trajectoryId: string;
  productId: string;
  action: TrajectoryAction;
  reward: number;
  timestamp: string;
}

export interface LearnedPattern {
  id: string;
  centroid: Float32Array;
  qualityAvg: number;
  count: number;
  topProducts: string[];
  lastUpdated: string;
}

export interface ConsolidationResult {
  trajectoriesProcessed: number;
  patternsCreated: number;
  patternsUpdated: number;
  biasUpdated: boolean;
}

export interface SonaStats {
  totalTrajectories: number;
  completedTrajectories: number;
  patterns: number;
  avgQuality: number;
}
