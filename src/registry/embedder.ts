import type { Product } from '../types/product.js';

const DIMENSIONS = 384;

/**
 * Interface for swapping in a real embedding model later (e.g. @huggingface/transformers).
 */
export interface Embedder {
  embed(text: string): Promise<Float32Array>;
}

/**
 * Hash-based embedder that projects text into a 384-dimensional unit vector.
 * Uses a deterministic hash to map each word to vector positions and accumulates
 * weighted contributions. Not truly semantic, but gives us consistent,
 * content-dependent vectors for MVP search.
 *
 * Zero-dependency fallback -- always available.
 */
export class HashEmbedder implements Embedder {
  async embed(text: string): Promise<Float32Array> {
    return embedText(text);
  }
}

/**
 * Real semantic embedder using all-MiniLM-L6-v2 via @huggingface/transformers.
 * Produces 384-dimensional normalized embeddings that capture true semantic meaning.
 *
 * The model is loaded lazily on first call (~22 MB quantized download).
 * Subsequent calls reuse the loaded pipeline.
 */
export class TransformerEmbedder implements Embedder {
  private pipeline: any = null;

  async embed(text: string): Promise<Float32Array> {
    if (!this.pipeline) {
      const { pipeline } = await import('@huggingface/transformers');
      this.pipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        dtype: 'q8',
      });
    }

    const output = await this.pipeline(text, { pooling: 'mean', normalize: true });
    return new Float32Array(output.data);
  }
}

/**
 * Simple FNV-1a 32-bit hash -- fast and well-distributed.
 */
function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash;
}

/**
 * Tokenize text into lowercase alphanumeric words.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

/**
 * Embed arbitrary text into a 384-dimensional Float32Array (unit length).
 * Each word hashes to multiple positions in the vector, with the sign
 * determined by a secondary hash. Bigrams are included for basic
 * phrase sensitivity.
 */
export function embedText(text: string): Float32Array {
  const vec = new Float32Array(DIMENSIONS);
  const words = tokenize(text);

  if (words.length === 0) {
    // Return a zero vector for empty text -- callers should guard against this.
    return vec;
  }

  // Unigrams
  for (const word of words) {
    const h = fnv1a(word);
    // Each word activates 3 positions for richer representation
    for (let j = 0; j < 3; j++) {
      const pos = (h + j * 7919) % DIMENSIONS; // 7919 is prime, spreads positions
      const sign = (fnv1a(word + String(j)) & 1) === 0 ? 1 : -1;
      vec[pos] += sign;
    }
  }

  // Bigrams for phrase sensitivity
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = words[i] + '_' + words[i + 1];
    const h = fnv1a(bigram);
    const pos = h % DIMENSIONS;
    const sign = (h & 2) === 0 ? 1 : -1;
    vec[pos] += sign * 0.5;
  }

  // L2 normalize to unit length
  let norm = 0;
  for (let i = 0; i < DIMENSIONS; i++) {
    norm += vec[i] * vec[i];
  }
  norm = Math.sqrt(norm);

  if (norm > 0) {
    for (let i = 0; i < DIMENSIONS; i++) {
      vec[i] /= norm;
    }
  }

  return vec;
}

/**
 * Build an embedding for a product by combining its key textual fields.
 * Weighted toward name and description, with bestFor/worstFor and features
 * providing additional signal.
 */
export function embedProduct(product: Pick<Product, 'name' | 'category' | 'description' | 'bestFor' | 'worstFor' | 'features'>): Float32Array {
  const parts = [
    // Name repeated for extra weight
    product.name,
    product.name,
    product.category,
    product.description,
    ...product.bestFor.map((b) => `good for ${b}`),
    ...product.worstFor.map((w) => `bad for ${w}`),
    ...product.features,
  ];

  return embedText(parts.join(' '));
}
