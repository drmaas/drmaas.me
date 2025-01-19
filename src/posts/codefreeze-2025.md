---
title: Code Freeze 2025
date: 19 January 2025
description: Thawing my knowledge of software architecture
tags:
  - Featured
  - Architecture
draft: false
---

I recently attended [Code Freeze 2025](https://cse.umn.edu/umsec/events/code-freeze-2025-back-future-architecture-and-design-new-era) at the [University of Minnesota](https://cse.umn.edu/msse/overview). [Gemini](https://gemini.google.com/) kindly provided an intelligible summary of my notes.

<img src="/images/codefreeze-1.jpg" alt="A fancy booklet" width="400" />

*A Very Fancy Booklet*

## Talk: Keynote - Michael Feathers

Extracting of concepts from gpt 4 paper

How to learn quickly and build conceptual models of a problem space (This note seems incomplete but captures the essence of learning from GPT-4 paper)

## Talk: IAC antipatterns - Jason Baker

### Key points

* Every antipattern started as a pattern (This line suggests understanding the context behind why something might be an antipattern now)
* Prefer readability and maintainability over complex abstractions
* The infra team should not define all infra. There needs to be self-service with guardrails (i.e., allowing developers to manage their own infrastructure with some limitations)
* Repeated deployments due to circular dependencies should be avoided by making deployments deterministic (i.e., deployments should always produce the same outcome) and having tests to ensure clean installs.

### Anti-patterns

* Manual provisioning instead of Infrastructure as Code (IaC) (Even though manual provisioning might be easier to learn initially)
* Using too many different tools for IaC. Consistency is key.
* Grouping all infrastructure by type instead of by application. Group based on service boundaries.
* Defining all environments in the same template. Infrastructure as Code should be promotion and environment agnostic.
* One giant repository for all infrastructure code. Partition the repository by service.
* Excessive abstraction and complexity to achieve DRY (Don't Repeat Yourself) principle. Shared modules can become difficult to maintain and require strict versioning.
* Requiring security approval for all infrastructure changes can slow down development. Empower development teams with self-service but with guardrails.

## Talk: Timeless Tench, Modern Magic Adam Terlson

Introduced Finite State Machines (FSMs) and demos using a typescript tool called XState

### XState

* XState and Statey: [https://stately.ai/](https://stately.ai/)
* Github repository: [https://github.com/adamterlson/AgenticStateMachines](https://github.com/adamterlson/AgenticStateMachines)

Suggested using a large language model (LLM) to create a state graph as a first step when defining a system's behavior.

## Talk: Evolutionary Architecture - Dr. Rebecca Parsons

Topic: What constitutes good architecture?

### Key points

* Good architecture involves guided incremental changes across multiple dimensions.
* Incremental changes: Step-by-step improvements.
* Change: Deploy the changes and experiment to validate them.
* Dimensions: Consider various ilities (e.g., reliability, scalability) and evolvability of the system.

### Principles

* Delay decisions as long as possible (Don't make premature architectural decisions).
* Design and develop for evolvability (The system should be easy to adapt to future changes).
* Postel's Law: Be prepared to accept that data will be used in ways you didn't anticipate.
* Design for testability (The system should be easy to test).
* Conway's Law: The architecture of a system reflects the communication structure of the organization that built it.  

### Additional points

* Database refactoring is crucial for evolving systems as data structures change over time.  
* The talk discussed the differences between choreography and orchestration (architectural patterns for coordinating services).
* Contract testing and continuous delivery were mentioned as important practices for evolving architectures.
* Domain-Driven Design (DDD) was highlighted as a helpful approach for defining boundaries within a system.  
* The importance of better tooling for choreography was emphasized.
* Large language models (LLMs) can be a valuable tool for generating creative solutions, even if their outputs are not always perfect.  

## Talk: No CAP - Corwin Diamond

A link to the presentation was provided: [https://docs.google.com/presentation/d/1ww9NSgq0ENl3U9qP1CR40gN54wzqkV2dE14Q1Jg4o90/edit?usp=drivesdk](https://docs.google.com/presentation/d/1ww9NSgq0ENl3U9qP1CR40gN54wzqkV2dE14Q1Jg4o90/edit?usp=drivesdk)

## Talk: Panel

### Key points

* Modular monoliths can be a good starting point, with the option to split them into microservices later.
* Returning to simplicity through the use of modern technologies is a valuable approach.
* Microservices are a good choice for scalable systems, but they require a certain level of maturity to implement effectively.  
* It's important to distinguish between essential complexity (inherent to the problem being solved) and accidental complexity (introduced by poor design choices).
* Surround yourself with people who are better than you to learn and grow.
* Embrace humility and be open to admitting you don't know something.
