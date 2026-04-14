# ADR-005: Local ONNX Embeddings over API-Based Embedding Services

**Status:** Accepted

## Context

The Agent Affiliate Network needs to generate 384-dimensional embeddings for product descriptions and user queries to power semantic search (ADR-001). Embeddings must be generated both at index time (when products are added to the registry) and at query time (when agents search for products).

Requirements:

- No API keys required for embedding generation
- Works fully offline (MCP servers may run in air-gapped or restricted environments)
- Deterministic: same input always produces same embedding (important for cache consistency)
- Latency under 200ms per embedding at query time
- 384-dimensional output to match sqlite-vec schema

Alternatives evaluated:

| Option | Verdict |
|--------|---------|
| **OpenAI text-embedding-3-small** | 1536D output (dimension mismatch), requires API key, $0.02/1M tokens, network dependency. |
| **Cohere embed-v3** | Requires API key, network round-trip adds 200-500ms latency. |
| **Voyage AI** | Same API key and network issues. |
| **TensorFlow.js + Universal Sentence Encoder** | 512D output, large model download (~200MB), slow cold start. |
| **@huggingface/transformers + all-MiniLM-L6-v2** | 384D output, ONNX runtime, ~80MB model, ~80ms per embedding after warm-up. Fully local. |

## Decision

Use **@huggingface/transformers** (v3.x) with the **all-MiniLM-L6-v2** model running locally via ONNX Runtime.

```typescript
import { pipeline } from "@huggingface/transformers";

// Singleton -- model loads once, reused for all embeddings
let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
      quantized: true,  // int8 quantization, ~22MB download
    });
  }
  return embedder;
}

async function embed(text: string): Promise<Float32Array> {
  const model = await getEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  return output.data;  // Float32Array[384]
}
```

## Consequences

**Positive:**

- Fully offline. No API keys, no network dependency, no usage costs.
- ~80ms per embedding after model warm-up. Well within the 200ms latency budget.
- 384D output matches sqlite-vec schema exactly. No dimension reduction or padding needed.
- Deterministic. Same input text always produces the same embedding vector.
- Quantized model is ~22MB download (cached after first run). Acceptable for npm distribution.
- ONNX Runtime supports CPU inference on all major platforms (x64, ARM64, macOS, Linux, Windows).

**Negative:**

- Cold start: first embedding takes 2-5 seconds while the model loads into memory. Subsequent embeddings are ~80ms.
- Model quality is lower than larger models (all-MiniLM-L6-v2 scores 0.789 on STS benchmark vs. 0.838 for text-embedding-3-small). Acceptable for product search use case.
- ~150MB resident memory for the model. Acceptable for a server process but notable for constrained environments.
- ONNX Runtime has platform-specific native binaries. The @huggingface/transformers package handles this, but exotic platforms may lack prebuilds.

**Mitigations:**

- Warm the model at server startup (call `getEmbedder()` in the initialization sequence).
- If higher quality embeddings are needed in the future, the embedding interface is abstracted behind `embed(text): Promise<Float32Array>`. Swapping to an API-based provider requires changing only this function.
