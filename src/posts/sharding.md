---
title: On Partition Keys
date: 2023-07-02T20:15:00.000Z
description: Think carefully.
tags: [performance]
draft: false
---

Let's say that you want to build a new backend ([OIDC](https://openid.net/developers/how-connect-works/)) identity provider (let's call it `the system`). Good luck! Since you don't want to write the whole thing from scratch, you pick an established vendor to help manage the system state. So, when `The system` performs authorization, it integrates with this vendor app. The vendor app acts like a smart proxy that connects other identity providers to `the system`. This allows users to log in user their favorite Google, Facebook, Twitter, etc. accounts. Because the vendor app needs to know if you are logging in or registering a new account (so it can prompt to allow access, collect one-time data, etc) it records some basic identity information about the user. The vendor app uses standard OIDC API calls to verify and collect basic information. So far, so good.

The vendor needs a database to store this information. Because everyone is building to the OIDC spec, they decide to use the `sub` attribute as the primary key for the user information. Because this attribute is unique across IDPs (identity providers) and users, it will work well.

You realize that your system could eventually scale to hundreds of millions of users. So, you ask the vendor for assurance that they can handle that. The answer is obviously *yes*. You assume that they can handle that, and don't give it too much thought.

Eventually, the time comes to load-test this system. You test against a homegrown test IDP that returns dummy data, and the results are amazing. You can handle 25 thousand logins/minute. You then test against another third-party IDP, and the results are terrible. You can only handle 700 logins/minute. This doesn't make sense, because you know this IDP is used worldwide by millions of people, and you know it can handle the volume.

A few days pass, and the vendor comes back with an interesting finding. After reaching 700 logins/minute, their system comes to a halt, every time, but only with this IDP. Furthermore, they report that their query to check if a user exists is degrading exponentially. This doesn't sound scalable at all. After your confusion subsides, you might ask them why their queries are so slow. They are breaching their SLA. With modern databases like Cassandra, DynamoDB, PostgreSQL, and more, they should be able to scale to hundreds of thousands of queries *per second*.

It turns out they are using a relational-ish database (you don't work there, so you don't know for sure). That's perfectly great. It also turns out that to scale it horizontally, they shard it by the primary key of the user. This gives them the ability to handle the higher volume, add nodes to their cluster as needed, and give them some fault tolerance via read replicas.

But they didn't just use the `sub` as its primary key. Remember that the database needs to first route each query to the node that has its data. Usually, this is done with hashing. You could design it so that an infinite number of `sub` attributes map to `N` hash keys, where `N` is the number of nodes in the cluster. But, this is not what was done. `sub` values could be quite long, maybe 64 characters.

> Theory 1: In order to speed up the hashing mechanism (and maybe to save disk space?), and reasoning that all characters in the string are random, they picked the first 16 characters to hash on. Hm.

> Theory 2: The vendor found that it's faster to partition on the first 16 characeters, while using the rest of the characters as a sorting or clustering key.

Whatever the source of the issue, it turns out that your slow IDP has a long hard-coded prefix for all `sub` values. The vendor did not expect this. After all, someone else controls the values, and it's easy to assume that they also made good design decisions. As a result, all users are stored on the same physical node. At low volumes, nobody knows or cares that this is happening. But during load tests, the system tips over, while the 1 node serving 100% of the users starts on :fire:.

I guess the moral of the story is to think hard about how you are partitioning your data, and how you plan to randomize the partition mapping to avoid hotspots. It turns out that splitting the string and assuming the partition key will always be random, especially when someone else controls the value, is something to avoid.
