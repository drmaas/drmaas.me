---
title: Hybrid RAG Search in Langchain Using Postgres and Typescript
date: 25 November 2024
description: It's all the RAG
tags:
  - Featured
  - LangChain
  - AI
  - LLM
  - Postgres
draft: false
---

I was recently playing around with an app I was building at work to teach myself how to use LangChain. This app, a Dev Portal, allows users to upload and view OpenAPI and GraphQL specs. It *also* has a chat feature built in where a user can ask questions about the APIs stored in the app.

The chat feature was using a general RAG approach to querying internal data. The general flows is:

* load an api spec as full text into the database. Additional, split it apart and load its embeddings into a vector database (I am using [pgvector](https://github.com/pgvector/pgvector)). LangChain offers [PGVectorStore](https://js.langchain.com/docs/integrations/vectorstores/pgvector/) to help automate the usage
* You end up with two database tables - one for full text, one for splits and vector embeddings
* the user asks a question
* query the vector database by embedding the query and searching for similar results
* pass the results to a prompt that answers the user's question and returns the results in markdown

This did not work well! The LLM can't answer questions about a 1000-line api spec if it only has 5 100 character fragments. I needed a way to return better results.

Here's what I came up with:

1. I created a custom LangChain [retriever](https://js.langchain.com/docs/concepts/retrievers) that extends [BaseRetriever](https://v03.api.js.langchain.com/classes/_langchain_core.retrievers.BaseRetriever.html)
2. Pass in a Postgres Client, like [PoolClient](https://node-postgres.com/apis/pool)
3. Inside `_getRelevantDocuments`, execute a hybrid search on the query using the pg client. I used [this as a guide](https://github.com/pgvector/pgvector-python/blob/master/examples/hybrid_search/rrf.py) and then used an LLM to convert to Typescript and pg
4. The hybrid search executes against the vector table for both the semantic (vector) and keyword (full text) queries. I could have done a keyword search against the full text table, but since I needed to eventually query that table anyways, it seemed more efficient to stay with the vectorized table
5. The vector database table already will contain metadata about each entry. For me, each text split stores the key of the full content entry
6. Gather the keys of all found text splits, deduplicate, and use them to search the full text database
7. Return the list of full api specs. These are then embedded into the context of the LLM query

It's a hack! But it works, and allows a seamless usage with existing LangChain apis.