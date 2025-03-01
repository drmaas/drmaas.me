---
title: The case of the broken lambda
date: 28 July 2023
description: API Gateway Lambda Proxy Madness.
tags: [debugging]
draft: false
---

My team recently deployed a set of lambdas into production using AWS. The topology of our app stack goes like this:

> DNS -> Akamai -> API Gatway -> Lambda

Everything went smoothly and perfectly :boom: But seriously, it was mostly ok. After reviewing production traffic for a few days, I found that a small percentage, maybe 5%, of traffic to one important endpoint was returning 502 errors to Akamai. Correlated to the API gateway via request ID, these were also returning 502 from the API gateway.

Error code 502 is odd. Typically we just return 500 if something blows up unexpectedly. So I looked up what it meant in [the Amazon docs](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format). Hm. Malformated lambda response. Checking the lambda logs, I did not see any 5xx errors for this endpoint. Furthermore, all lambda responses contained the requisite parameters: `body`, `headers`, and `statusCode`.

To make it even more confusing, the error only happened when we passed in the `Referer` http header. This header controlled the setting of CORS headers. Aha! I thought. CORS problems. So we removed the CORS headers. Turns out that was a bad idea, as they were needed! So we had to keep CORS headers. 

Next, I [turned on full input/output logging in the api gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/view-cloudwatch-log-events-in-cloudwatch-console.html). I was hoping this would reveal the secrets I needed to solve the issue. Nope, just logs showing a perfectly nice-seeming lambda response causing an API gateway error. I took some screenshots of some logs to review later.

I should mention at this point that the endpoint acted as a proxy to another api. All request headers were passed to the upstream API, and all response headers were sent back in the lambda response. So, something maybe related to headers was causing the lambda response to break the API gateway integration. I tried removing headers from the lambda response and everything started magically working.

After engaging AWS support and providing the screenshots, it turned out that a header value returned as a list, like `"x-my-header": ["wow"]`, instead of a string, will cause this error. We wanted to continue to proxy the other API headers, so we simply updated the offending cookie value to be a string. Problem solved!

I ran this scenario by a friend on another team after this happened. No joking, he said `Yeah`, the `API` gateway integration` breaks all the time.` What!? If [curl](https://curl.se/docs/manpage.html) can figure out how to convert a list header value to a string, shouldn't the API gateway try to do that? Or at least make a log that says, 
> by the way, this header value seems off. Is this what you meant to do? I fixed it for you, but you should probably change it.

I can only hope. This event reminded me of the hidden costs associated with using off-the-shelf software, whether commercial or open source. Life is great when it functions as advertised, but you're in for a world of pain once you go off the rails even slightly. The subject of the tradeoffs associated with build vs buy interests me, and I may write about it more at some time. I have also seen it go the other way, where writing a lot of code from scratch caused an entirely different set of avoidable problems.
