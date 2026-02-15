---
title: Building Services Part 1 - Introduction to Domain Modeling
date: 10 August 2023
description: Laying the foundation for effective service architecture
tags: [design, architecture, systems]
draft: false
---

## The Reverse Engineering Approach

When designing microservices, I find it useful to start from the end state and work backward. Imagine a service successfully running in production—something the entire team understands, maintains with confidence, and that users love. Now reverse the project timeline. What questions were answered along the way? What architectural decisions were made? What concrete steps contributed to this successful rollout?

This inversion reveals the true complexity of service design. It's not about picking frameworks or deployment platforms—those are implementation details. The real work happens in planning what the service does, how it communicates, what it depends on, and how it scales.

## Part 0: The Foundation Questions

Solution design begins with questions, not answers. Maintain a [beginner's mindset](https://en.wikipedia.org/wiki/Shoshin) and recognize that thoroughness beats speed at this stage. Here are the critical areas requiring explicit answers:

### Strategic Questions
* **System/Domain Modeling**: What precisely does this service do? What are its clear responsibilities? Who does it communicate with? How?

### Operational Questions
* **Coding practices**: Which language? What libraries? How is code organized into directories and modules? What build tools power the process?
* **Testing strategy**: What types of tests? How is coverage calculated? How is code formatted and linted? How are security vulnerabilities detected?
* **Infrastructure definition**: Is it code? Scripts? Manually configured? What's the source of truth?
* **CI/CD pipeline**: How is code built when features are committed? How does it deploy?
* **Runtime environment**: Where does it run? How? Where are configuration and secrets stored? How do dependencies get managed?

### Scaling Considerations
* **Load capacity**: Will this service support high traffic? If yes:
  * How specifically will it scale?
  * Have performance tests been written and validated?
  * Can you identify performance bottlenecks algorithmically?

### Integration and Reliability
* **Pre-production environments**: How many exist? What's each one's purpose? Do all services interact correctly across them?
* **Health visibility**: How do engineers know when something is broken? Can they search logs and view metrics?
* **Failure handling**: Are there retry mechanisms? Circuit breakers? Fallbacks? How are known and unknown errors handled?
* **High availability**: What happens when servers or networks fail? Are replicas deployed?

### Observability and Maintenance
* **Monitoring architecture**: How is the service observed? What metrics matter? What thresholds trigger alerts?
* **Dependency management**: How are dependencies kept up-to-date?
* **Documentation**: Is there an API schema? CLI help? A README? Developer wiki?

### The Human Element
Beyond technical architecture, service delivery involves people: team structure, meeting cadence, ownership models, agile ceremonies, incident response. I'll address these separately, but they're equally critical.

## The Sequencing Principle

The order in which I've posed these questions tends to reflect the order in which they're best tackled. Special circumstances might shuffle priorities—if you know a service will face massive load, tackle scaling upfront. Generally, though, this sequence provides a logical progression where each phase builds on the foundation of the previous.

Notice also what's missing: the actual application code is a relatively small portion of total effort. Much of the work involves test code (unit, integration, performance, regression, smoke tests), infrastructure definition, monitoring, and deployment automation.

## Part 1: Domain Modeling - Establishing Clear Boundaries

Defining what a service does and establishing its responsibilities form the foundation of all subsequent work. This phase typically involves Product Owners, Architects, and Principal/Staff Engineers collaborating to draw service boundaries that make behaviors explicit and capabilities clear.

### The Whiteboarding Exercise

For complex applications with many services and diverse user interaction patterns, whiteboarding is invaluable. This can happen on physical whiteboards with sticky notes, or on digital tools like [ConceptBoard](https://conceptboard.com/) for distributed teams.

Good whiteboarding sessions accomplish two things:
1. **Define system capabilities**: What can the entire application do?
2. **Define user personas and tasks**: Who uses the system, and what do they need to accomplish? How do those tasks map to the capabilities you've identified?

This exercise often reveals components that needn't exist and identifies missing pieces. It grounds abstract architectural thinking in concrete user needs.

### Architectural Artifacts

Once a conceptual model exists (or is deemed unnecessary for smaller projects), technical teams create architectural documentation:
* **Architectural diagrams**: System components and their relationships
* **User interaction diagrams**: How users flow through the system
* **Sequence diagrams**: How services coordinate for specific scenarios
* **Data flow diagrams**: How information moves through the system

For smaller ventures or side projects, teams often build monoliths first, refactoring into services later as complexity demands. This trades upfront architectural clarity for development speed—a reasonable trade when requirements are unclear.

### Defining External Dependencies

Regardless of modeling depth, you must explicitly define external services and dependencies your service needs. Choose communication protocols deliberately: HTTP, gRPC, WebSockets, AMQP—each has tradeoffs. Pick the simplest protocol matching your needs.

### The Balance Point

The ideal approach invests just enough time modeling to understand known objectives at project start. Models can evolve as development reveals new information. Too little modeling leads to building the wrong product or creating unmaintainable systems. Too much modeling risks overengineering and delayed delivery.

The art lies in calibrating effort appropriately.

