/**
 * A2A Gossip Mesh -- Trust Engine
 *
 * Trust scoring with temporal decay for peers in the mesh.
 *
 * Trust formula (ADR-008):
 *   trust_new = 0.7 * trust_old + 0.3 * recent_signal_score
 *   Decay:      trust * (decayRate ^ hours_since_last_verified)
 *
 * Trust signals are aggregated into a 0-1 score that blends interaction
 * success rate, voucher count (social proof), and peer age.
 */

import type { PeerEntry, TrustSignals } from './types.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Weight given to historical trust in the EMA blend. */
const HISTORY_WEIGHT = 0.7;

/** Weight given to recent signal score. */
const SIGNAL_WEIGHT = 0.3;

/** Maximum age bonus (hours) -- trust plateaus after this. */
const AGE_PLATEAU_HOURS = 720; // 30 days

/** Default decay rate per hour when none is specified. */
const DEFAULT_DECAY_RATE = 0.99;

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export class TrustEngine {
  private readonly decayRate: number;

  constructor(decayRate: number = DEFAULT_DECAY_RATE) {
    this.decayRate = decayRate;
  }

  /**
   * Compute a new trust score for a peer based on its current score and
   * optional fresh signals.
   *
   * If no signals are provided the score is returned unchanged (before decay).
   */
  computeTrust(peer: PeerEntry, signals?: TrustSignals): number {
    if (!signals) {
      return this.decayTrust(peer.trustScore, peer.lastSeen);
    }

    const signalScore = this.aggregateSignals(signals);
    const blended = HISTORY_WEIGHT * peer.trustScore + SIGNAL_WEIGHT * signalScore;

    // Clamp to [0, 1].
    return Math.max(0, Math.min(1, blended));
  }

  /**
   * Apply temporal decay to a trust score.
   *
   * trust_decayed = trust * (decayRate ^ hours_elapsed)
   */
  decayTrust(currentScore: number, lastVerifiedAt: string): number {
    const now = Date.now();
    const lastMs = new Date(lastVerifiedAt).getTime();
    const hoursElapsed = Math.max(0, (now - lastMs) / (1000 * 60 * 60));

    const decayed = currentScore * Math.pow(this.decayRate, hoursElapsed);

    // Floor at zero.
    return Math.max(0, decayed);
  }

  /**
   * Verify a peer is live and its card matches what we have on record.
   *
   * STUB for MVP -- logs what it would do and returns true.
   * In production this fetches the card, verifies the JWS signature,
   * and checks that skills match the gossip data.
   */
  async verifyPeer(url: string): Promise<boolean> {
    stderr(`[trust/stub] verifying liveness of ${url}`);

    // Simulate verification.
    // In production: GET ${url}/.well-known/agent.json, verify JWS, compare.
    return true;
  }

  // ---------- Internal ------------------------------------------------------

  /**
   * Aggregate multiple trust signals into a single 0-1 score.
   *
   * Components (each 0-1, equally weighted):
   *   - Interaction success rate
   *   - Voucher density  (capped at 10 vouchers = 1.0)
   *   - Age bonus        (logarithmic, plateaus at AGE_PLATEAU_HOURS)
   */
  private aggregateSignals(signals: TrustSignals): number {
    // 1. Interaction success rate.
    const totalInteractions = signals.successfulInteractions + signals.failedInteractions;
    const successRate =
      totalInteractions > 0
        ? signals.successfulInteractions / totalInteractions
        : 0.5; // No data -- neutral.

    // 2. Voucher density -- more trusted peers knowing this peer is good.
    const voucherScore = Math.min(1, signals.voucherCount / 10);

    // 3. Age bonus -- older peers are slightly more trusted, up to a point.
    const ageScore = Math.min(1, Math.log1p(signals.ageHours) / Math.log1p(AGE_PLATEAU_HOURS));

    // Equal-weight blend.
    return (successRate + voucherScore + ageScore) / 3;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stderr(msg: string): void {
  process.stderr.write(msg + '\n');
}
