---
title: The case of the broken lambda
date: 28 July 2023
description: API Gateway Lambda Proxy Madness.
tags: [debugging]
draft: false
---

---
title: The Case of the Broken Lambda - A Deep Dive into API Gateway Integration Failures
date: 28 July 2023
description: Debugging the subtle contract between API Gateway and Lambda Proxy Integrations
tags: [debugging]
draft: false
---

## The Setup

Our team recently deployed a set of Lambdas into production using AWS. The infrastructure topology looked clean and well-designed:

> DNS → Akamai → API Gateway → Lambda

Initial rollout appeared successful, but after monitoring production traffic for several days, I discovered an unsettling pattern: approximately 5% of requests to a critical endpoint were returning 502 errors to Akamai, with the same 502s appearing in API Gateway logs correlated by request ID.

## Why 502 is Puzzling

HTTP 502 "Bad Gateway" typically indicates that a gateway received an invalid response from an upstream server. This seemed odd in our context—Lambda timeouts or unhandled exceptions usually produce 500 "Internal Server Error" responses, not 502s. I consulted AWS documentation and learned that [Lambda Proxy Integration returns 502 when it receives a malformed response](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format).

Inspecting Lambda CloudWatch logs told a strange story: no 5xx errors were occurring at the Lambda level. Every response appeared to contain the required parameters for Proxy Integration: `statusCode`, `headers`, and `body`. The Lambda responses looked perfectly valid.

## The Misleading Clue

The errors only manifested when the `Referer` HTTP header was present in the request. This header controlled CORS header generation in our Lambda, giving me a false sense of certainty. I assumed this was a CORS configuration issue and removed the CORS headers from responses. The errors vanished—but I'd introduced a new problem: legitimate cross-origin requests now failed because CORS headers were missing. I had to restore them. 

## Following the Logs

I [enabled comprehensive input/output logging in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/view-cloudwatch-log-events-in-cloudwatch-console.html), hoping full request-response visibility would reveal the pattern. The logs showed precisely what shouldn't be happening: a perfectly formed Lambda response triggering an API Gateway error. I captured screenshots of several logs for later analysis.

Then I recalled an important architectural detail: our Lambda acted as a proxy to an upstream API service, forwarding all request headers and returning all response headers from the upstream service. This meant the HTTP header values themselves were the likely culprit. ## The Root Cause

When I started removing headers from the Lambda response, the errors disappeared. This narrowed the problem significantly. After working with AWS support and providing CloudWatch log screenshots, they identified the culprit: the upstream API was returning a header value as an array (e.g., `"x-my-header": ["wow"]`) instead of a properly formatted string. API Gateway's Lambda Proxy Integration couldn't serialize this array-formatted header value, resulting in the 502 error.

The fix was straightforward: convert the offending header value from array format to a string before returning it in the Lambda response. We normalized this upstream API response and the errors resolved completely.

## The Bigger Picture

After the incident resolved, I mentioned this scenario to a colleague working on another team. His immediate, unsurprised response was revealing: "Yeah, the API Gateway integration breaks all the time."

This unexpected fragility in AWS's API Gateway raises a fundamental question: if the [curl](https://curl.se/docs/manpage.html) command-line tool can intelligently handle and convert list-formatted header values to strings, why can't API Gateway's Lambda Proxy Integration? At minimum, API Gateway should emit a diagnostic log message like:

> "This header value appears to be malformed. We attempted to convert it to a string, but you should review your Lambda response format for correctness."

This experience reinforced an important lesson about the hidden costs of commercial and open-source software. When systems function as documented, they provide tremendous value and accelerate development. But the moment you deviate from the happy path—even slightly—you enter a debugging nightmare. These edge cases, combined with insufficient error messages and undocumented behavior, represent the true cost of dependency management.

The build-versus-buy trade-off is perpetually relevant. I've seen this scenario play out in both directions: excessive custom code creates one set of maintainability problems, while opaque vendor solutions create entirely different ones. The ideal lies somewhere in the middle, disciplined choices informed by realistic assessment of capability and risk.
