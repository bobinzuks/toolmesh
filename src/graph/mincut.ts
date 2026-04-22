/**
 * Simplified mincut / agglomerative clustering for the product graph.
 *
 * Strategy (greedy agglomerative):
 *   1. Start with each node in its own cluster.
 *   2. Compute the affinity between every pair of clusters as the sum of edge
 *      weights between their members.  Positive weights (complements/integrates)
 *      attract clusters together; negative weights (competes) repel them.
 *   3. Repeatedly merge the two clusters with the highest positive affinity.
 *   4. Stop when:
 *      - No pair has positive affinity (merging would join competitors), OR
 *      - We've reached `maxClusters` (if specified).
 *
 * The result maps cluster IDs (the ID of the first node that seeded the
 * cluster) to arrays of member node IDs.
 */

export type WeightedEdges = Map<string, Map<string, number>>;

export function findClusters(
  nodes: string[],
  edges: WeightedEdges,
  maxClusters?: number,
): Map<string, string[]> {
  if (nodes.length === 0) {
    return new Map();
  }

  // Each node starts in its own cluster, keyed by the node ID.
  const clusterOf = new Map<string, string>();
  const clusters = new Map<string, Set<string>>();

  for (const node of nodes) {
    clusterOf.set(node, node);
    clusters.set(node, new Set([node]));
  }

  // Pre-compute inter-cluster affinity.  We maintain a symmetric affinity
  // matrix keyed by (clusterA, clusterB) where clusterA < clusterB
  // lexicographically.
  const affinityKey = (a: string, b: string): string =>
    a < b ? `${a}\0${b}` : `${b}\0${a}`;

  const affinity = new Map<string, number>();

  for (const [u, neighbours] of edges) {
    for (const [v, weight] of neighbours) {
      const cu = clusterOf.get(u)!;
      const cv = clusterOf.get(v)!;
      if (cu === cv) continue;
      const key = affinityKey(cu, cv);
      affinity.set(key, (affinity.get(key) ?? 0) + weight);
    }
  }

  // Greedy merge loop
  const minClusterCount = maxClusters ?? 1;

  while (clusters.size > minClusterCount) {
    // Find the pair with maximum affinity
    let bestKey: string | null = null;
    let bestAffinity = 0; // only merge if affinity > 0

    for (const [key, aff] of affinity) {
      if (aff > bestAffinity) {
        bestAffinity = aff;
        bestKey = key;
      }
    }

    if (bestKey === null) break; // no positive affinity pair left

    const [clusterA, clusterB] = bestKey.split('\0');

    // Merge clusterB into clusterA
    const membersA = clusters.get(clusterA)!;
    const membersB = clusters.get(clusterB)!;

    for (const node of membersB) {
      membersA.add(node);
      clusterOf.set(node, clusterA);
    }
    clusters.delete(clusterB);

    // Update affinity: remove all entries involving clusterB, recalculate
    // entries involving clusterA.
    const keysToRemove: string[] = [];
    const deltaMap = new Map<string, number>();

    for (const [key, aff] of affinity) {
      const [c1, c2] = key.split('\0');
      if (c1 === clusterB || c2 === clusterB) {
        keysToRemove.push(key);
        // If the other side is not clusterA, add the affinity to the
        // (clusterA, other) pair.
        const other = c1 === clusterB ? c2 : c1;
        if (other !== clusterA) {
          const newKey = affinityKey(clusterA, other);
          deltaMap.set(newKey, (deltaMap.get(newKey) ?? 0) + aff);
        }
      }
    }

    for (const key of keysToRemove) {
      affinity.delete(key);
    }

    for (const [key, delta] of deltaMap) {
      affinity.set(key, (affinity.get(key) ?? 0) + delta);
    }
  }

  // Convert to result format
  const result = new Map<string, string[]>();
  for (const [clusterId, members] of clusters) {
    result.set(clusterId, [...members]);
  }
  return result;
}
