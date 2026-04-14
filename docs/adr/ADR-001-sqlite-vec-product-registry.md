# ADR-001: Use sqlite-vec + better-sqlite3 for Affiliate Product Registry

**Status:** Accepted

## Context

The Agent Affiliate Network needs a vector database to store 384-dimensional product embeddings alongside structured metadata (product name, category, commission rate, affiliate program, trust score). Queries combine semantic similarity search with SQL-style filtering (e.g., "CRM tools under $50/mo with > 0.7 trust score").

Requirements:

- HNSW-class approximate nearest neighbor search on 384D vectors
- Metadata filtering in the same query (category, price range, trust score thresholds)
- Single-file deployment -- no external server processes
- Embeddable in an npm-distributed MCP server
- Minimal runtime dependencies

Alternatives evaluated:

| Option | Verdict |
|--------|---------|
| **ChromaDB** | Requires a separate Python server process. Unacceptable for an npm-distributed MCP tool. |
| **Vectra** | Pure JS, but linear scan only -- no ANN index. Degrades past ~1K products. |
| **hnswlib-node** | Fast ANN, but no metadata filtering. Would require a second SQLite database and manual join logic. |
| **RuVector** | Rust-based, immature npm bindings. Build toolchain complexity for end users. |
| **sqlite-vec** | SQLite extension providing `vec0` virtual tables with ANN search. Combined with better-sqlite3, gives synchronous vector search + SQL filtering in one query. Single `.db` file. |

## Decision

Use **sqlite-vec** (v0.1.x) loaded as an extension into **better-sqlite3** (v11.x) to implement the product registry.

Schema:

```sql
CREATE VIRTUAL TABLE products_vec USING vec0(
  embedding float[384]
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER,
  commission_rate REAL,
  affiliate_program TEXT,
  affiliate_url TEXT,
  trust_score REAL DEFAULT 0.5,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

Query pattern (semantic search with metadata filter):

```sql
SELECT p.*, d.distance
FROM products_vec AS v
JOIN products AS p ON p.id = v.rowid
WHERE v.embedding MATCH ?1
  AND k = ?2
  AND p.category = ?3
  AND p.trust_score > ?4
ORDER BY d.distance;
```

## Consequences

**Positive:**

- Single `.db` file contains both vectors and metadata. No server processes to manage.
- SQL filtering happens in the same query as vector search -- no post-hoc filtering in application code.
- 3 runtime dependencies total: `better-sqlite3`, `sqlite-vec`, and the prebuilt extension binary.
- Synchronous API via better-sqlite3 simplifies MCP tool handlers (no async/await complexity for DB access).
- Backup is `cp products.db products.db.bak`.

**Negative:**

- sqlite-vec is pre-1.0. API surface may change. Pinned to `0.1.x` to mitigate.
- better-sqlite3 requires a native build step (`node-gyp`). Prebuilds cover most platforms but exotic targets may fail.
- Single-writer constraint from SQLite. Acceptable for MCP server (single process), but would not work for horizontal scaling without a proxy layer.
- No built-in replication. Registry updates require a push mechanism (see ADR-006).

**Risks:**

- If the product catalog exceeds ~100K items, sqlite-vec ANN performance should be benchmarked. Migration path: export to a dedicated vector DB at that scale.
