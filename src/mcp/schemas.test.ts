import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  RecommendProductInput,
  CompareProductsInput,
  FindAlternativeInput,
  GetStackInput,
  CATEGORIES,
  TEAM_SIZES,
} from './schemas.js';

// ---------------------------------------------------------------------------
// RecommendProductInput
// ---------------------------------------------------------------------------

describe('RecommendProductInput', () => {
  it('validates valid input with all fields', () => {
    const input = {
      need: 'I need a database for my SaaS app',
      category: 'database' as const,
      budget_max_monthly: 100,
      tech_stack: 'node,react',
      team_size: 'small' as const,
      max_results: 5,
    };
    const result = RecommendProductInput.safeParse(input);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.need, input.need);
      assert.strictEqual(result.data.category, 'database');
      assert.strictEqual(result.data.budget_max_monthly, 100);
      assert.strictEqual(result.data.tech_stack, 'node,react');
      assert.strictEqual(result.data.team_size, 'small');
      assert.strictEqual(result.data.max_results, 5);
    }
  });

  it('rejects empty need string (min 3 chars)', () => {
    const result = RecommendProductInput.safeParse({ need: '' });
    assert.strictEqual(result.success, false);
  });

  it('rejects need string shorter than 3 characters', () => {
    const result = RecommendProductInput.safeParse({ need: 'ab' });
    assert.strictEqual(result.success, false);
  });

  it('accepts minimal input with only required need field', () => {
    const result = RecommendProductInput.safeParse({ need: 'database for my app' });
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.category, undefined);
      assert.strictEqual(result.data.budget_max_monthly, undefined);
      assert.strictEqual(result.data.tech_stack, undefined);
      assert.strictEqual(result.data.team_size, undefined);
      // max_results has a default of 3
      assert.strictEqual(result.data.max_results, 3);
    }
  });

  it('accepts optional fields as undefined', () => {
    const result = RecommendProductInput.safeParse({
      need: 'hosting provider',
      category: undefined,
      budget_max_monthly: undefined,
      tech_stack: undefined,
      team_size: undefined,
    });
    assert.strictEqual(result.success, true);
  });

  it('validates category enum values', () => {
    // Valid category
    const valid = RecommendProductInput.safeParse({
      need: 'need a tool',
      category: 'auth',
    });
    assert.strictEqual(valid.success, true);

    // Invalid category
    const invalid = RecommendProductInput.safeParse({
      need: 'need a tool',
      category: 'not-a-real-category',
    });
    assert.strictEqual(invalid.success, false);
  });

  it('validates all CATEGORIES values are accepted', () => {
    for (const cat of CATEGORIES) {
      const result = RecommendProductInput.safeParse({
        need: 'testing category',
        category: cat,
      });
      assert.strictEqual(result.success, true, `Category "${cat}" should be accepted`);
    }
  });

  it('validates team_size enum values', () => {
    for (const size of TEAM_SIZES) {
      const result = RecommendProductInput.safeParse({
        need: 'testing team size',
        team_size: size,
      });
      assert.strictEqual(result.success, true, `Team size "${size}" should be accepted`);
    }

    const invalid = RecommendProductInput.safeParse({
      need: 'testing team size',
      team_size: 'gigantic',
    });
    assert.strictEqual(invalid.success, false);
  });

  it('rejects negative budget', () => {
    const result = RecommendProductInput.safeParse({
      need: 'need a tool',
      budget_max_monthly: -10,
    });
    assert.strictEqual(result.success, false);
  });

  it('rejects max_results less than 1', () => {
    const result = RecommendProductInput.safeParse({
      need: 'need a tool',
      max_results: 0,
    });
    assert.strictEqual(result.success, false);
  });

  it('rejects max_results greater than 10', () => {
    const result = RecommendProductInput.safeParse({
      need: 'need a tool',
      max_results: 11,
    });
    assert.strictEqual(result.success, false);
  });
});

// ---------------------------------------------------------------------------
// CompareProductsInput
// ---------------------------------------------------------------------------

describe('CompareProductsInput', () => {
  it('validates valid product list and use case', () => {
    const result = CompareProductsInput.safeParse({
      products: 'Supabase, Firebase, PlanetScale',
      use_case: 'backend for a mobile app',
    });
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.products, 'Supabase, Firebase, PlanetScale');
      assert.strictEqual(result.data.use_case, 'backend for a mobile app');
    }
  });

  it('rejects missing products field', () => {
    const result = CompareProductsInput.safeParse({
      use_case: 'backend for a mobile app',
    });
    assert.strictEqual(result.success, false);
  });

  it('rejects use_case shorter than 3 characters', () => {
    const result = CompareProductsInput.safeParse({
      products: 'Supabase, Firebase',
      use_case: 'ab',
    });
    assert.strictEqual(result.success, false);
  });
});

// ---------------------------------------------------------------------------
// FindAlternativeInput
// ---------------------------------------------------------------------------

describe('FindAlternativeInput', () => {
  it('validates required fields', () => {
    const result = FindAlternativeInput.safeParse({
      current_product: 'Firebase',
      complaint: 'Too expensive at scale',
    });
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.current_product, 'Firebase');
      assert.strictEqual(result.data.complaint, 'Too expensive at scale');
      assert.strictEqual(result.data.budget_max_monthly, undefined);
    }
  });

  it('accepts optional budget', () => {
    const result = FindAlternativeInput.safeParse({
      current_product: 'Firebase',
      complaint: 'Too expensive',
      budget_max_monthly: 50,
    });
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.budget_max_monthly, 50);
    }
  });

  it('rejects missing current_product', () => {
    const result = FindAlternativeInput.safeParse({
      complaint: 'Too expensive',
    });
    assert.strictEqual(result.success, false);
  });

  it('rejects missing complaint', () => {
    const result = FindAlternativeInput.safeParse({
      current_product: 'Firebase',
    });
    assert.strictEqual(result.success, false);
  });
});

// ---------------------------------------------------------------------------
// GetStackInput
// ---------------------------------------------------------------------------

describe('GetStackInput', () => {
  it('validates required fields', () => {
    const result = GetStackInput.safeParse({
      project_type: 'SaaS web app',
      requirements: 'auth, database, hosting',
    });
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.project_type, 'SaaS web app');
      assert.strictEqual(result.data.requirements, 'auth, database, hosting');
      assert.strictEqual(result.data.budget_max_monthly, undefined);
      assert.strictEqual(result.data.tech_stack, undefined);
    }
  });

  it('accepts optional budget and tech_stack', () => {
    const result = GetStackInput.safeParse({
      project_type: 'SaaS web app',
      requirements: 'auth, database, hosting',
      budget_max_monthly: 200,
      tech_stack: 'node,react,postgres',
    });
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.budget_max_monthly, 200);
      assert.strictEqual(result.data.tech_stack, 'node,react,postgres');
    }
  });

  it('rejects missing project_type', () => {
    const result = GetStackInput.safeParse({
      requirements: 'auth, database',
    });
    assert.strictEqual(result.success, false);
  });

  it('rejects missing requirements', () => {
    const result = GetStackInput.safeParse({
      project_type: 'SaaS web app',
    });
    assert.strictEqual(result.success, false);
  });
});

// ---------------------------------------------------------------------------
// CATEGORIES constant
// ---------------------------------------------------------------------------

describe('CATEGORIES array', () => {
  it('contains expected core categories', () => {
    const expected = ['database', 'auth', 'hosting', 'email', 'analytics', 'monitoring', 'payments'];
    for (const cat of expected) {
      assert.ok(
        (CATEGORIES as readonly string[]).includes(cat),
        `CATEGORIES should include "${cat}"`,
      );
    }
  });

  it('has at least 10 categories', () => {
    assert.ok(CATEGORIES.length >= 10, `Expected at least 10 categories, got ${CATEGORIES.length}`);
  });

  it('includes "other" as a catch-all', () => {
    assert.ok((CATEGORIES as readonly string[]).includes('other'));
  });
});

// ---------------------------------------------------------------------------
// .describe() annotations
// ---------------------------------------------------------------------------

describe('Schema describe() annotations', () => {
  it('RecommendProductInput.need has a description', () => {
    const needField = RecommendProductInput.shape.need;
    assert.ok(needField.description, 'need field should have a .describe() annotation');
  });

  it('CompareProductsInput.products has a description', () => {
    const productsField = CompareProductsInput.shape.products;
    assert.ok(productsField.description, 'products field should have a .describe() annotation');
  });

  it('CompareProductsInput.use_case has a description', () => {
    const field = CompareProductsInput.shape.use_case;
    assert.ok(field.description, 'use_case field should have a .describe() annotation');
  });

  it('FindAlternativeInput.current_product has a description', () => {
    const field = FindAlternativeInput.shape.current_product;
    assert.ok(field.description, 'current_product field should have a .describe() annotation');
  });

  it('FindAlternativeInput.complaint has a description', () => {
    const field = FindAlternativeInput.shape.complaint;
    assert.ok(field.description, 'complaint field should have a .describe() annotation');
  });

  it('GetStackInput.project_type has a description', () => {
    const field = GetStackInput.shape.project_type;
    assert.ok(field.description, 'project_type field should have a .describe() annotation');
  });

  it('GetStackInput.requirements has a description', () => {
    const field = GetStackInput.shape.requirements;
    assert.ok(field.description, 'requirements field should have a .describe() annotation');
  });
});
