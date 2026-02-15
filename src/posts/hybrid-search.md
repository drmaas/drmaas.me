---
title: Hybrid RAG Search in Langchain Using Postgres and Typescript
date: 25 November 2024
description: Combining vector and keyword search for robust information retrieval
tags:
  - Featured
  - LangChain
  - AI
  - LLM
  - Postgres
draft: false
---

## Overview and Motivation

While building a Dev Portal at work—an application allowing users to upload, organize, and query API specifications—I implemented an integrated AI chat feature. Users can ask natural language questions about stored OpenAPI and GraphQL specs, with answers grounded in the specification data.

This project provided an ideal vehicle to deepen my LangChain expertise while confronting a real RAG (Retrieval-Augmented Generation) challenge: naive semantic search isn't sufficient for comprehensive API specification querying.

## The Initial Problem: Basic RAG Limitations

The initial chat implementation followed standard RAG architecture:
1. **Ingestion**: Load full API specifications as text into PostgreSQL's full-text search. Split specifications into chunks and generate vector embeddings using [pgvector](https://github.com/pgvector/pgvector)
2. **Storage**: Two tables—one storing complete specifications, one storing chunks with embeddings
3. **Retrieval**: On user query, embed the question using the same model, search the vector table for semantically similar chunks
4. **Generation**: Pass retrieved chunks to an LLM prompt that generates an answer

**The failure mode**: The LLM couldn't reliably answer questions about 1000-line API specs when only given 5 100-character fragments, even when fragments were semantically relevant. The LLM lacked context for precise answers.

## The Hybrid Search Solution

I resolved this by implementing a custom LangChain [retriever](https://js.langchain.com/docs/concepts/retrievers) extending [BaseRetriever](https://v03.api.js.langchain.com/classes/_langchain_core.retrievers.BaseRetriever.html):

### Architecture

```
User Query
    ↓
Embed Query + Generate Keywords
    ↓
Parallel Search
├─ Semantic Search (Vector Similarity)
└─ Keyword Search (Full-Text)
    ↓
Combine Results Using RRF
    ↓
Extract Original Spec Keys
    ↓
Retrieve Full Specifications
    ↓
Return to LLM with Complete Context
```

### Implementation Details

1. **Custom Retriever**: Accepts a PostgreSQL PoolClient, exposing a single `_getRelevantDocuments` method
2. **Hybrid Query Execution**: Implemented parallel semantic (vector) and keyword (full-text) searches on the same vectorized table. I used [pgvector's hybrid search example](https://github.com/pgvector/pgvector-python/blob/master/examples/hybrid_search/rrf.py) as a guide, converting the Python implementation to TypeScript with node-postgres
3. **Metadata Extraction**: Vector table entries store metadata about their source specification. I gather all matching specification keys from found text splits
4. **Deduplication**: Remove duplicate keys that appear in multiple search results
5. **Full Spec Retrieval**: Use deduplicated keys to retrieve complete specifications from the full-text table
6. **Context Return**: Return full specifications to the LLM prompt, providing sufficient context for accurate answers

### Trade-offs and Implementation Notes

This is pragmatically a hack, but it works and integrates seamlessly with existing LangChain APIs. The benefit of returning full specifications far outweighs concerns about sending more tokens to the LLM—the quality improvement is substantial.

Rather than executing separate keyword searches against the full-text table, I kept both queries against the vectorized table. This was simpler and more efficient since I needed to access that table anyway for metadata extraction.