import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { findClusters, type WeightedEdges } from '../../src/graph/mincut.js';

describe('findClusters', () => {
  it('returns empty map for empty input', () => {
    const result = findClusters([], new Map());
    assert.equal(result.size, 0);
  });

  it('returns one cluster per node when there are no edges', () => {
    const nodes = ['a', 'b', 'c'];
    const edges: WeightedEdges = new Map([
      ['a', new Map()],
      ['b', new Map()],
      ['c', new Map()],
    ]);
    const result = findClusters(nodes, edges);
    assert.equal(result.size, 3);
  });

  it('merges nodes connected by positive edges', () => {
    const nodes = ['a', 'b', 'c'];
    const edges: WeightedEdges = new Map([
      ['a', new Map([['b', 1.0]])],
      ['b', new Map([['a', 1.0]])],
      ['c', new Map()],
    ]);
    const result = findClusters(nodes, edges);
    // a and b should merge; c stays alone => 2 clusters
    assert.equal(result.size, 2);

    // Verify a and b are in the same cluster
    let abTogether = false;
    for (const [, members] of result) {
      if (members.includes('a') && members.includes('b')) {
        abTogether = true;
      }
    }
    assert.ok(abTogether, 'a and b should be in the same cluster');
  });

  it('does not merge nodes connected only by negative edges', () => {
    const nodes = ['a', 'b'];
    const edges: WeightedEdges = new Map([
      ['a', new Map([['b', -1.0]])],
      ['b', new Map([['a', -1.0]])],
    ]);
    const result = findClusters(nodes, edges);
    assert.equal(result.size, 2, 'competitors should stay in separate clusters');
  });

  it('respects maxClusters parameter', () => {
    const nodes = ['a', 'b', 'c', 'd'];
    const edges: WeightedEdges = new Map([
      ['a', new Map([['b', 1.0], ['c', 0.5]])],
      ['b', new Map([['a', 1.0]])],
      ['c', new Map([['a', 0.5], ['d', 0.8]])],
      ['d', new Map([['c', 0.8]])],
    ]);
    const result = findClusters(nodes, edges, 3);
    assert.ok(result.size >= 3, `expected >= 3 clusters, got ${result.size}`);
  });

  it('handles a mix of positive and negative weights', () => {
    // a-b: complements (+1), b-c: competes (-1), a-c: complements (+0.5)
    const nodes = ['a', 'b', 'c'];
    const edges: WeightedEdges = new Map([
      ['a', new Map([['b', 1.0], ['c', 0.5]])],
      ['b', new Map([['a', 1.0], ['c', -1.0]])],
      ['c', new Map([['b', -1.0], ['a', 0.5]])],
    ]);
    const result = findClusters(nodes, edges);

    // a and b should merge (strong positive), c should stay separate
    // because merging {a,b} with c has net affinity = 0.5 + (-1.0) = -0.5
    let abCluster: string[] | null = null;
    for (const [, members] of result) {
      if (members.includes('a') && members.includes('b')) {
        abCluster = members;
      }
    }
    assert.ok(abCluster, 'a and b should be in the same cluster');
    assert.ok(!abCluster!.includes('c'), 'c should not be in the a-b cluster');
  });

  it('produces clusters that cover all nodes', () => {
    const nodes = ['w', 'x', 'y', 'z'];
    const edges: WeightedEdges = new Map([
      ['w', new Map([['x', 0.3]])],
      ['x', new Map([['w', 0.3]])],
      ['y', new Map([['z', 0.9]])],
      ['z', new Map([['y', 0.9]])],
    ]);
    const result = findClusters(nodes, edges);

    const allMembers = new Set<string>();
    for (const [, members] of result) {
      for (const m of members) allMembers.add(m);
    }
    assert.deepEqual([...allMembers].sort(), ['w', 'x', 'y', 'z']);
  });
});
