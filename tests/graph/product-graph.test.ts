import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import type { Product } from '../../src/types/product.js';
import { ProductGraph } from '../../src/graph/product-graph.js';

function makeProduct(overrides: Partial<Product> & { id: string; name: string }): Product {
  return {
    category: 'hosting',
    description: 'A test product',
    pricing: 'Free',
    features: [],
    integrations: [],
    bestFor: [],
    worstFor: [],
    trustScore: 0.8,
    active: true,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    ...overrides,
  };
}

describe('ProductGraph', () => {
  let graph: ProductGraph;

  const vercel = makeProduct({
    id: 'vercel',
    name: 'Vercel',
    category: 'hosting',
    bestFor: ['frontend', 'jamstack'],
    worstFor: ['backend-heavy'],
    integrations: ['GitHub', 'Stripe'],
  });

  const netlify = makeProduct({
    id: 'netlify',
    name: 'Netlify',
    category: 'hosting',
    bestFor: ['frontend', 'static-sites'],
    worstFor: ['backend-heavy'],
    integrations: ['GitHub'],
  });

  const stripe = makeProduct({
    id: 'stripe',
    name: 'Stripe',
    category: 'payments',
    bestFor: ['saas', 'subscriptions'],
    worstFor: ['marketplace'],
    integrations: ['Vercel', 'Netlify'],
  });

  const paddle = makeProduct({
    id: 'paddle',
    name: 'Paddle',
    category: 'payments',
    bestFor: ['saas', 'subscriptions'],
    worstFor: ['low-volume'],
    integrations: [],
  });

  const supabase = makeProduct({
    id: 'supabase',
    name: 'Supabase',
    category: 'database',
    bestFor: ['frontend', 'realtime'],
    worstFor: ['graph-queries'],
    integrations: ['Vercel', 'Netlify'],
  });

  beforeEach(() => {
    graph = new ProductGraph([vercel, netlify, stripe, paddle, supabase]);
    graph.buildGraph();
  });

  describe('buildGraph', () => {
    it('creates a graph with correct node count', () => {
      const stats = graph.getStats();
      assert.equal(stats.nodes, 5);
    });

    it('creates edges', () => {
      const stats = graph.getStats();
      assert.ok(stats.edges > 0, 'graph should have edges');
    });
  });

  describe('getCompetitors', () => {
    it('finds competitors in the same category with shared bestFor', () => {
      const competitors = graph.getCompetitors('vercel');
      const names = competitors.map((c) => c.product.name);
      assert.ok(names.includes('Netlify'), 'Vercel and Netlify should compete');
    });

    it('does not mark cross-category products as competitors', () => {
      const competitors = graph.getCompetitors('vercel');
      const names = competitors.map((c) => c.product.name);
      assert.ok(!names.includes('Stripe'), 'Vercel and Stripe should not compete');
    });

    it('returns competitors with negative weight', () => {
      const competitors = graph.getCompetitors('vercel');
      for (const c of competitors) {
        assert.ok(c.weight < 0, `competitor weight should be negative, got ${c.weight}`);
      }
    });
  });

  describe('getComplements', () => {
    it('finds cross-category complements', () => {
      // Supabase (database) shares bestFor "frontend" with Vercel (hosting)
      const complements = graph.getComplements('vercel');
      const names = complements.map((c) => c.product.name);
      assert.ok(names.includes('Supabase'), 'Vercel and Supabase should be complements');
    });
  });

  describe('getIntegrations', () => {
    it('finds products that integrate with each other', () => {
      const integrations = graph.getIntegrations('vercel');
      const names = integrations.map((c) => c.product.name);
      // Stripe lists Vercel in its integrations, and Vercel lists Stripe (via "Stripe")
      // At minimum, Supabase and Stripe both list Vercel
      assert.ok(
        names.includes('Stripe') || names.includes('Supabase'),
        'Vercel should have integration edges with products that reference it',
      );
    });
  });

  describe('getExclusions', () => {
    it('returns competitor IDs', () => {
      const exclusions = graph.getExclusions('vercel');
      assert.ok(exclusions.includes('netlify'), 'Netlify should be excluded when recommending Vercel');
    });

    it('returns empty for products with no competitors', () => {
      const exclusions = graph.getExclusions('supabase');
      // Supabase is the only database product, so no same-category competitor
      assert.equal(exclusions.length, 0);
    });
  });

  describe('getClusters', () => {
    it('returns at least one cluster', () => {
      const clusters = graph.getClusters();
      assert.ok(clusters.size >= 1, 'should have at least 1 cluster');
    });

    it('every product appears in exactly one cluster', () => {
      const clusters = graph.getClusters();
      const seen = new Set<string>();
      for (const [, products] of clusters) {
        for (const p of products) {
          assert.ok(!seen.has(p.id), `product ${p.id} appears in multiple clusters`);
          seen.add(p.id);
        }
      }
      assert.equal(seen.size, 5, 'all 5 products should be in clusters');
    });
  });

  describe('getStackPartners', () => {
    it('returns a product for each requested category', () => {
      const partners = graph.getStackPartners('vercel', ['payments', 'database']);
      assert.ok(partners.has('payments'), 'should recommend a payments partner');
      assert.ok(partners.has('database'), 'should recommend a database partner');
    });

    it('skips the category of the chosen product', () => {
      const partners = graph.getStackPartners('vercel', ['hosting', 'payments']);
      assert.ok(!partners.has('hosting'), 'should not recommend another hosting product');
    });

    it('prefers products with positive relationship edges', () => {
      const partners = graph.getStackPartners('vercel', ['payments']);
      const paymentPartner = partners.get('payments');
      assert.ok(paymentPartner, 'should have a payments partner');
      // Stripe integrates with Vercel, so it should be preferred over Paddle
      assert.equal(paymentPartner!.name, 'Stripe');
    });
  });

  describe('getStats', () => {
    it('returns correct node count', () => {
      assert.equal(graph.getStats().nodes, 5);
    });

    it('returns non-negative edge count', () => {
      assert.ok(graph.getStats().edges >= 0);
    });

    it('returns cluster count matching getClusters', () => {
      const stats = graph.getStats();
      const clusters = graph.getClusters();
      assert.equal(stats.clusters, clusters.size);
    });
  });
});
