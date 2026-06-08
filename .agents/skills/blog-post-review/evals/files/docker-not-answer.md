---
title: Docker is not the answer
date: 02 June 2026
description: When containers make things worse.
tags: [docker, devops]
draft: false
---

## Containers are great. Until they're not.

Everyone loves Docker. And I get it. It solves real problems. Reproducible builds, consistent environments, easy deployment. But there's a group project that happened. That I want to tell you about. Where Docker made everything worse.

## The project

So last quarter my team was tasked with building a data pipeline. Simple enough. Read from a Postgres database. Transform the data. Write to a data warehouse. We had five engineers. We had two months. We had Docker.

The architect on the project decided we should microservices-ize everything. Every transform step got its own container. The data pipeline had 12 stages and each stage was its own Docker container with its own Dockerfile. The database connector was one container. The ETL step was three containers. The validation layer was two containers. The monitoring layer was another container. And there was a orchestrator container to manage all the other containers.

By week three we had 12 Dockerfiles, 4 docker-compose files, and a custom bash script to start everything in the right order. The README had become a novel.

## What went wrong

The transform containers had to talk to each other. That meant setting up a shared network volume. Which worked great on Jeff's machine. But not on Maria's. And definitely not in production.

Debugging was a nightmare. If stage 4 failed, you had to check the logs from stage 4's container, which meant finding the right container ID first. Then restarting just that stage without losing the data from stages 1-3. It was fragile.

The real problem though, was that we used Docker as a substitute for actual architecture decisions. We never asked "what's the right abstraction for this component?" We just said "make it a container" and moved on. Containers are a deployment mechanism, not an architecture pattern. When you use them as the latter, you end up with all the complexity of distributed systems and none of the benefits.

## The turning point

After three weeks of frustration, Maria suggested we scrap the container setup and just use a single Python script with multiple modules. One process. One Dockerfile for deployment. The data would flow through function calls instead of HTTP requests between containers.

We were skeptical at first. It felt like going backwards. But we tried it. The refactor took less than a week. The pipeline ran 3x faster (no more network overhead). Debugging was straightforward — you could just follow the stack trace. And deployment went from a docker-compose up with 12 containers to a single container.

## What I learned

Docker is great for some things. It's terrible for others. Here's my rule of thumb now: if your components need to be independently scalable or deployable, containers make sense. If they don't, you're just adding overhead for no reason. Not every function needs to be a microservice. Not every microservice needs to be its own container. And not everything needs Docker at all.

The best tool is the one that solves your problem without introducing new ones. For our data pipeline, that was a single Python script with well-defined modules. It wasn't sexy. But it worked.