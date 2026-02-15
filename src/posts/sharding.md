---
title: On Partition Keys - Why Randomization Matters in Distributed Systems
date: 2 July 2023
description: A cautionary tale about hidden assumptions in data distribution
tags: [performance]
draft: false
---

## The Scenario: A Real-World Partition Key Disaster

Let me walk you through a genuine crisis that teaches a critical lesson about distributed system design.

We were building an identity provider ([OIDC](https://openid.net/developers/how-connect-works/)) for a large organization. To avoid reinventing standard functionality, we selected an established vendor platform that acts as a proxy connecting various external identity providers (Google, Facebook, Twitter, etc.) to our system. Users can seamlessly authenticate using their existing accounts.

The vendor platform maintains user identity metadata using standard OIDC attributes. They chose the `sub` (subject) attribute as the primary key—a sensible choice since `sub` is globally unique across identity providers and users by OIDC specification.

We asked the vendor for scaling assurances to handle eventual scale (hundreds of millions of users). The answer was confidently affirmative. We accepted that and moved forward.

## Load Testing: The Breakdown

When load testing time arrived, results astonished us. Testing against our homegrown test identity provider yielded excellent performance: 25,000 logins per minute. Testing against a real third-party provider produced catastrophic results: only 700 logins per minute.

This contradiction made no sense. The third-party IDP we tested against serves millions of users worldwide; it clearly can handle volume. Why the massive failure?

## The Root Cause: A Dangerous Optimization

After investigation, the vendor revealed a startling pattern: after the system reached 700 logins/minute, the entire system halted *exclusively with this specific IDP*. Additionally, their user-existence query was degrading exponentially. With modern databases (Cassandra, DynamoDB, PostgreSQL), they should easily handle hundreds of thousands of queries per second.

The vendor used a horizontally-sharded relational database. While sharding enables scaling and provides fault tolerance via replicas, it requires careful partition key design. Most databases route queries to the appropriate node through hashing: ideally, infinite values of `sub` map uniformly to N hash buckets, where N is cluster node count.

But the vendor made a dangerous optimization. Rather than hashing the full `sub` value (which could be ~64 characters), they hashed only the **first 16 characters**. Their reasoning: assuming all characters were random, the first 16 should provide sufficient distribution while reducing hashing computation and potentially saving disk space.

## The Hidden Assumption

This optimization's fatal flaw: **third-party identity providers don't guarantee random `sub` values**.

The specific third-party IDP we tested used a long, hard-coded prefix for all `sub` values. When users authenticate, every single user receives a `sub` starting with identical characters. These identical prefixes produce identical hash values, routing all users to a **single physical node** in the cluster.

At low volumes, this hidden hotspot wasn't apparent. Under load test traffic, the single node handling 100% of user traffic became a bottleneck, collapsing under the load. Meanwhile, other cluster nodes remained idle.

## Lessons for Distributed Systems

This incident crystallizes critical principles:

1. **Never assume what you don't control**: External data sources (third-party ID providers, partner APIs) don't guarantee properties you'd expect. Defensive design is essential.

2. **Partition key selection requires discipline**: Choose partition keys that distribute uniformly **for all realistic data distributions**, not just theoretical ones. Test against realistic data that external parties might provide.

3. **Verify distribution assumptions**: If you optimize around an assumption (like "characters are random"), measure and validate that assumption against all data sources you'll encounter.

4. **Measure and monitor**: Had they monitored node-level metrics during load tests, they'd have immediately spotted one node saturating while others stayed quiet—a clear hotspot indicator.

The moral isn't "never optimize"—it's "never optimize around fragile assumptions about data you don't control." Partition keys determine how data distributes across your cluster. Get this wrong, and all the scalability theory in the world won't save you from single-node collapse.
