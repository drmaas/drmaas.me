---
title: Performance Testing is Hard
slug: /perf-testing
date: "2023-07-16T20:00:00.000Z"
description: "But why?"
---

At first glance, performance testing seems like it should be pretty easy. All you have to do is simulate lots of users doing lots of things all at the same time. Then, measure how well the system is responding. This could include saturation (CPU, memory, disk usage), errors (the output error rate is less than X), requests (the throughput of requests to the system exceeds X), or latency (the system responds in less than X for 95% of all requests). If you think this way, like I did, you would be in for a rough time!

## Why it's hard

Performance testing is hard because you're trying to wrangle a system whose parameters are exploding with combinatorial complexity. And, you face constraints. Let's say you're building a shopping cart and ordering API. Your system consists of the following layers:

* CDN (Akamai)
* Runtime platform (nomad)
  * load balancer (haproxy)
  * Operating system (alpine linux)
  * Sidecars (metrics and logging)
  * Autoscaling policy
  * Canary
  * CPU allocation per pod
  * Memory allocation per pod
  * Disk allocation per pod
* IAAS (Inra as a service - terraform)
* Application
  * framework (nodejs)
  * Your Business Logic
  * Dependencies like database (cassandra), topic (kafka), cache (redis)
  * Apis your application calls
* Network Egress (squid proxy)

That's a lot to worry about! In other words, high cognitive load. But that's just your application. The performance test app itself is another application with multiple parts:

* Load generator (maybe K6)
* Log analyzer (maybe Spunk dashboads)
* Metrics analyzer (maybe Grafana dashboards)
* Reports (usually manually stiched together from the above dashboards)

Once all that's built, you can run load tests. But then, your system falls over and does not achieve the scale that you want. What to do?

## Where to start

Start by building the application. Don't wait until it's done before building perf test app - it will take longer than you think. Then build the perf test app:

1. Build the load generator.
1. Run the load generator to make sure it works.
1. Compare it against manual tests of the application to make sure the perf test results match the manual testing results.
1. Build the dashboards

Now you can run tests. 99% of the time, you won't get the results you want. So how do you know what to change?

## Data is your friend

Remember those dashboards you built? They will be your best friends. If you can capture metrics about each level of your app stack, you should be able to pinpoint the exact point at which your application begins to tip over. Here are some example scenarios:

* Your app has high latency. Since you're smart and you measure response times at the CDN, platform, app, and dependency level, you see that the CDN is adding 500ms of latency to each request. This seems high. Upon review, it is misconfigured and does not honor keep-alive headers. Action: Enable keep-alive and re-run your tests.
* Your load test will not generate the traffic you are telling it to generate. You observe that after you get to 50 RPS, your app error rate spikes to 75%. Oops. Because you measure errors at all layers, you see that your Cassandra cluster is throwing exceptions at that same threshold. Action: You look at your cluster, and it turns out the disk is full, and each node only gets 1 CPU. Increase disk, CPU, and number of nodes, and re-run your tests.
* Your load test is measuring high error rates. When you test manually, you cannot reproduce the errors. Because you measure the response of dependent APIs, you see that one of them is throwing 500 error response codes. Action: engage your partner team to provide deeper insights into why their API is tipping over.
* Your app (which you wrote with extra care and attention to detail) is slowing down at high loads. CPU usage is low. But what about memory usage? It's on the high side, but nothing crazy. Action: So, you decide to instrument your app with a flame graph, hoping to know which lines of code your application is spending most of its precious time and resources. You re-run your tests and find that using recursive functions inside of a for loop leads to exponential decay of performance.
* Your load test will not generate the traffic you are telling it to generate. Your app is barely seeing any traffic. Oops! Your load test isn't doing what you thought it would. You miscalculated how many requests per second it would generate - you are sending your intended number as requests perf minute! Action: fix your perf test.

## Conclusions

This is but a surface level scratch of the deep fathoms of your production system. There are probably thousands of other knobs to turn, depending on your exact app stack. I hope that the complexity illustrated herein inspires you to invest in the proper tooling, talent, and time needed to build a robust performance-testing app that gives you a stress-free (mostly) production rollout.
