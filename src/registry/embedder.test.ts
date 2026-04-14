import { describe, it } from 'node:test';
import assert from 'node:assert';
import { embedText, embedProduct, HashEmbedder } from './embedder.js';

/** Compute cosine similarity between two Float32Arrays. */
function cosine(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/** Compute L2 norm of a Float32Array. */
function l2Norm(v: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < v.length; i++) {
    sum += v[i] * v[i];
  }
  return Math.sqrt(sum);
}

describe('embedText', () => {
  it('returns a Float32Array of length 384', () => {
    const vec = embedText('hello world');
    assert.ok(vec instanceof Float32Array, 'should be a Float32Array');
    assert.strictEqual(vec.length, 384);
  });

  it('returns unit-length vectors (L2 norm approximately 1.0)', () => {
    const vec = embedText('some arbitrary text for testing');
    const norm = l2Norm(vec);
    assert.ok(
      Math.abs(norm - 1.0) < 0.001,
      `expected norm ~1.0, got ${norm}`,
    );
  });

  it('is deterministic (same input produces same output)', () => {
    const a = embedText('deterministic test input');
    const b = embedText('deterministic test input');
    assert.deepStrictEqual(a, b);
  });

  it('returns a zero vector for empty string', () => {
    const vec = embedText('');
    const norm = l2Norm(vec);
    assert.strictEqual(norm, 0, 'empty string should produce zero vector');
    assert.strictEqual(vec.length, 384);
  });

  it('returns a zero vector for whitespace-only string', () => {
    const vec = embedText('   \t\n  ');
    const norm = l2Norm(vec);
    assert.strictEqual(norm, 0, 'whitespace-only should produce zero vector');
  });

  it('produces different embeddings for different texts', () => {
    const a = embedText('machine learning algorithms');
    const b = embedText('chocolate cake recipe');
    // They should not be identical
    let identical = true;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        identical = false;
        break;
      }
    }
    assert.ok(!identical, 'different texts should produce different embeddings');
  });

  it('produces more similar embeddings for similar texts than for dissimilar ones', () => {
    const base = embedText('serverless postgres database');
    const similar = embedText('serverless postgresql database hosting');
    const dissimilar = embedText('chocolate cake baking recipe');

    const simSimilar = cosine(base, similar);
    const simDissimilar = cosine(base, dissimilar);

    assert.ok(
      simSimilar > simDissimilar,
      `similar cosine (${simSimilar}) should exceed dissimilar cosine (${simDissimilar})`,
    );
  });
});

describe('embedProduct', () => {
  it('combines product fields into an embedding', () => {
    const vec = embedProduct({
      name: 'TestDB',
      category: 'database',
      description: 'A fast relational database',
      bestFor: ['web apps', 'analytics'],
      worstFor: ['embedded devices'],
      features: ['SQL', 'replication'],
    });

    assert.ok(vec instanceof Float32Array);
    assert.strictEqual(vec.length, 384);
    const norm = l2Norm(vec);
    assert.ok(
      Math.abs(norm - 1.0) < 0.001,
      `expected unit vector, got norm ${norm}`,
    );
  });

  it('produces different embeddings for products in different categories', () => {
    const dbProduct = embedProduct({
      name: 'MyDB',
      category: 'database',
      description: 'Relational database for web applications',
      bestFor: ['web apps'],
      worstFor: ['mobile'],
      features: ['SQL', 'ACID'],
    });

    const emailProduct = embedProduct({
      name: 'MailSender',
      category: 'email',
      description: 'Transactional email delivery service',
      bestFor: ['newsletters'],
      worstFor: ['SMS'],
      features: ['templates', 'analytics'],
    });

    const sim = cosine(dbProduct, emailProduct);
    assert.ok(sim < 0.95, `products in different categories should not be near-identical (cosine=${sim})`);
  });
});

describe('HashEmbedder', () => {
  it('embed() returns the same result as embedText()', async () => {
    const embedder = new HashEmbedder();
    const text = 'test input for hash embedder';

    const fromClass = await embedder.embed(text);
    const fromFunction = embedText(text);

    assert.deepStrictEqual(fromClass, fromFunction);
  });

  it('embed() returns a Float32Array of length 384', async () => {
    const embedder = new HashEmbedder();
    const vec = await embedder.embed('anything');
    assert.ok(vec instanceof Float32Array);
    assert.strictEqual(vec.length, 384);
  });
});
