/**
 * Product relationship graph for ToolMesh.
 *
 * Builds a weighted graph of product relationships from the registry.
 * Edge types and weights:
 *   - competes   (weight: -1)   : same category, similar bestFor
 *   - complements (weight: +1)  : different category, shared integrations / bestFor overlap
 *   - integrates  (weight: +0.5): one product lists the other in its integrations
 *   - migrates    (weight: +0.3): one product's worstFor matches the other's bestFor
 *
 * Used for:
 *   1. Stack recommendations  -- ensure recommended products complement each other
 *   2. Exclusion lists        -- avoid recommending direct competitors together
 *   3. Cluster discovery      -- find natural product groupings via mincut
 */

import type { Product } from '../types/product.js';
import { findClusters, type WeightedEdges } from './mincut.js';

// ---------- Edge representation ----------

export interface Edge {
  type: 'competes' | 'complements' | 'integrates' | 'migrates';
  weight: number;
}

// Adjacency list: productId -> Map<targetProductId, Edge>
type AdjacencyList = Map<string, Map<string, Edge>>;

// ---------- Helpers ----------

function normalise(s: string): string {
  return s.trim().toLowerCase();
}

function overlap(a: string[], b: string[]): number {
  const setB = new Set(b.map(normalise));
  let count = 0;
  for (const item of a) {
    if (setB.has(normalise(item))) count++;
  }
  return count;
}

function nameMatchesIntegration(name: string, integration: string): boolean {
  const n = normalise(name);
  const i = normalise(integration);
  return n === i || i.includes(n) || n.includes(i);
}

// ---------- ProductGraph ----------

export class ProductGraph {
  private readonly products: Map<string, Product>;
  private readonly adjacency: AdjacencyList = new Map();
  private cachedClusters: Map<string, Product[]> | null = null;

  constructor(products: Product[]) {
    this.products = new Map();
    for (const p of products) {
      this.products.set(p.id, p);
      this.adjacency.set(p.id, new Map());
    }
  }

  // ---------- Graph construction ----------

  buildGraph(): void {
    const productList = [...this.products.values()];
    this.cachedClusters = null;

    for (let i = 0; i < productList.length; i++) {
      for (let j = i + 1; j < productList.length; j++) {
        const a = productList[i];
        const b = productList[j];
        this.computeEdges(a, b);
      }
    }
  }

  private computeEdges(a: Product, b: Product): void {
    const sameCategory = normalise(a.category) === normalise(b.category);
    const bestForOverlap = overlap(a.bestFor, b.bestFor);
    const worstForOverlap = overlap(a.worstFor, b.worstFor);

    // 1. Category overlap + bestFor overlap -> competes
    if (sameCategory && bestForOverlap > 0) {
      this.addEdge(a.id, b.id, { type: 'competes', weight: -1 });
    }

    // 2. Integration lists -> integrates
    const aIntegratesB = a.integrations.some((int) =>
      nameMatchesIntegration(b.name, int),
    );
    const bIntegratesA = b.integrations.some((int) =>
      nameMatchesIntegration(a.name, int),
    );

    if (aIntegratesB || bIntegratesA) {
      this.addEdge(a.id, b.id, { type: 'integrates', weight: 0.5 });
    }

    // 3. Cross-category bestFor overlap -> complements
    //    (Different categories solving related but distinct needs work well together)
    if (!sameCategory && bestForOverlap > 0) {
      this.addEdge(a.id, b.id, { type: 'complements', weight: 1 });
    }

    // 4. Same worstFor overlap in different categories -> complements
    //    (Both avoid similar pitfalls, likely aligned philosophically)
    if (!sameCategory && worstForOverlap > 0) {
      this.addEdge(a.id, b.id, { type: 'complements', weight: 1 });
    }

    // 5. Migration path: A's worstFor matches B's bestFor (B fixes A's weaknesses)
    const aBadBGood = overlap(a.worstFor, b.bestFor);
    const bBadAGood = overlap(b.worstFor, a.bestFor);

    if (sameCategory && (aBadBGood > 0 || bBadAGood > 0)) {
      this.addEdge(a.id, b.id, { type: 'migrates', weight: 0.3 });
    }
  }

  private addEdge(from: string, to: string, edge: Edge): void {
    const existing = this.adjacency.get(from)?.get(to);

    // If there is already a stronger (more negative for competes, or more
    // positive for complements) edge, keep it.  Otherwise upsert.
    if (!existing || Math.abs(edge.weight) > Math.abs(existing.weight)) {
      this.adjacency.get(from)!.set(to, edge);
      this.adjacency.get(to)!.set(from, edge);
    } else if (existing.type !== edge.type) {
      // Different relationship types: keep both by adjusting weight.
      // For the mincut algorithm we need a single numeric weight, so we
      // accumulate: competes pulls apart, everything else pulls together.
      const combined: Edge = {
        type: existing.weight + edge.weight >= 0 ? edge.type : existing.type,
        weight: existing.weight + edge.weight,
      };
      this.adjacency.get(from)!.set(to, combined);
      this.adjacency.get(to)!.set(from, combined);
    }
  }

  // ---------- Queries ----------

  getCompetitors(productId: string): Array<{ product: Product; weight: number }> {
    return this.getEdgesByType(productId, 'competes');
  }

  getComplements(productId: string): Array<{ product: Product; weight: number }> {
    return this.getEdgesByType(productId, 'complements');
  }

  getIntegrations(productId: string): Array<{ product: Product; weight: number }> {
    return this.getEdgesByType(productId, 'integrates');
  }

  private getEdgesByType(
    productId: string,
    type: Edge['type'],
  ): Array<{ product: Product; weight: number }> {
    const neighbours = this.adjacency.get(productId);
    if (!neighbours) return [];

    const result: Array<{ product: Product; weight: number }> = [];
    for (const [targetId, edge] of neighbours) {
      if (edge.type === type) {
        const product = this.products.get(targetId);
        if (product) {
          result.push({ product, weight: edge.weight });
        }
      }
    }

    return result.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
  }

  // ---------- Clustering via mincut ----------

  getClusters(): Map<string, Product[]> {
    if (this.cachedClusters) return this.cachedClusters;

    const nodeIds = [...this.products.keys()];

    // Build a numeric weight map for the mincut algorithm.
    // Positive weight = "keep together", negative = "cut apart".
    const weightEdges: WeightedEdges = new Map();
    for (const nodeId of nodeIds) {
      weightEdges.set(nodeId, new Map());
    }

    for (const [from, neighbours] of this.adjacency) {
      for (const [to, edge] of neighbours) {
        // Already symmetric in adjacency, but mincut expects one direction
        if (from < to) {
          weightEdges.get(from)!.set(to, edge.weight);
          weightEdges.get(to)!.set(from, edge.weight);
        }
      }
    }

    const rawClusters = findClusters(nodeIds, weightEdges);

    // Name clusters by the most common category in each cluster.
    const result = new Map<string, Product[]>();
    for (const [, memberIds] of rawClusters) {
      const members = memberIds
        .map((id) => this.products.get(id))
        .filter((p): p is Product => p !== undefined);

      if (members.length === 0) continue;

      // Pick the most frequent category as the cluster name.
      const catCounts = new Map<string, number>();
      for (const m of members) {
        catCounts.set(m.category, (catCounts.get(m.category) ?? 0) + 1);
      }
      let clusterName = members[0].category;
      let maxCount = 0;
      for (const [cat, count] of catCounts) {
        if (count > maxCount) {
          maxCount = count;
          clusterName = cat;
        }
      }

      // Disambiguate if the name is already taken
      let finalName = clusterName;
      let suffix = 2;
      while (result.has(finalName)) {
        finalName = `${clusterName}-${suffix}`;
        suffix++;
      }

      result.set(finalName, members);
    }

    this.cachedClusters = result;
    return result;
  }

  // ---------- Stack partners ----------

  /**
   * Given a chosen product, find the best complementary product for each
   * requested category.  Prefers products with explicit complement/integrate
   * edges, falls back to the highest-trust product in that category.
   */
  getStackPartners(
    productId: string,
    categories: string[],
  ): Map<string, Product> {
    const result = new Map<string, Product>();
    const chosen = this.products.get(productId);
    if (!chosen) return result;

    const neighbours = this.adjacency.get(productId) ?? new Map();

    for (const category of categories) {
      const catLower = normalise(category);

      // Skip the category of the chosen product itself
      if (normalise(chosen.category) === catLower) continue;

      // Collect candidates in this category, scored by their edge to the
      // chosen product (positive = good partner).
      const candidates: Array<{ product: Product; score: number }> = [];

      for (const [, product] of this.products) {
        if (normalise(product.category) !== catLower) continue;
        if (product.id === productId) continue;

        const edge = neighbours.get(product.id);
        const edgeScore = edge ? edge.weight : 0;

        // Bonus for integration edges, penalty for competition edges
        candidates.push({
          product,
          score: edgeScore + product.trustScore * 0.1,
        });
      }

      candidates.sort((a, b) => b.score - a.score);

      if (candidates.length > 0) {
        result.set(category, candidates[0].product);
      }
    }

    return result;
  }

  // ---------- Exclusions ----------

  /**
   * Products that should NOT be recommended alongside the given product.
   * Returns IDs of direct competitors (negative-weight edges).
   */
  getExclusions(productId: string): string[] {
    const neighbours = this.adjacency.get(productId);
    if (!neighbours) return [];

    const exclusions: string[] = [];
    for (const [targetId, edge] of neighbours) {
      if (edge.type === 'competes' && edge.weight < 0) {
        exclusions.push(targetId);
      }
    }
    return exclusions;
  }

  // ---------- Stats ----------

  getStats(): { nodes: number; edges: number; clusters: number } {
    let edgeCount = 0;
    for (const [, neighbours] of this.adjacency) {
      edgeCount += neighbours.size;
    }
    // Edges are stored symmetrically, so divide by 2
    edgeCount = Math.floor(edgeCount / 2);

    return {
      nodes: this.products.size,
      edges: edgeCount,
      clusters: this.getClusters().size,
    };
  }
}
