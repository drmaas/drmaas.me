---
layout: "@layouts/ArticleLayout.astro"
title: Building Services Part 3 - Testing
date: 2024-01-12T00:00:00.000Z
description: You can haz code and test it too!
tags: [coding, design, systems, testing]
draft: false
---

You wrote amazing codes. The modularity is stunning. Reuse tops the charts. Abstractions rule the day.
Concerns have been duly separated. Dependencies do not form circles. So let's push to prod.

Unfortunately, you should seldom do this. Only if speed is of the utmost necessity and the risk 
is ridiculously low/non-existent should you do this. For example, sure, deploy your static blog site to 
prod with testing. No big deal if there's an issue. Deploy that new button color without tests. But for
almost everything else, test everything. How to start?

## Part 3: Testing

The first task is to determine what _type_ of tests to write. The most agreed-upon test types include:

### Types of Tests

* Unit testing. Tests individual functions and classes, while mocking dependencies and other collaborators.
For example, page component tests, or class method tests.
* Integration testing. Tests how components interact with each other. For example, page-level tests against a real browser, 
or API route tests against a real server.
* Functional/end-to-end/regression/smoke tests. These test the behavior of the system as a whole, at varying degrees of
granularity.
* Performance testing. This measures server latency, errors, and throughput at load. It measures web vital performance 
when running thousands of concurrent browser sessions.
* Non-functional tests: these include [code coverage](#test-coverage), [formatting](#formatting-and-linting), [linting](#formatting-and-linting), and [security checks](#security-analysis), and will be described below.

Unit tests are a requirement. They should be automatically run as part of every push (via hooks), pull request and  
code merge. Builds should fail if tests fail. They should also fail if test coverage falls below a certain
threshold (see [below](#test-coverage)). 

There are many popular unit test frameworks for whichever language you use. Pick one and use
it. Many come with mock/spy functions included to assist with dependency mocking. For
example, [jest](https://jestjs.io) comes with easy-to-use mocking. If not, find a popular option
and use it. For example, [kotest](https://kotest.io/docs/framework/integrations/mocking.html) 
provides mechanisms to integrate third-party mocks into their testing framework. If you're 
writing services that rely on external platforms, such as AWS, tools like [aws-sdk-mock](https://github.com/dwyl/aws-sdk-mock)
help.

Integration tests should be optional and depend on the scope of the code being written. If writing an API, it
is always recommended to spin up a local server and test it via the local network. When building things
like lambda functions, this can be challenging, as the runtime is provided for you only when deploying remotely.
Tools like [localstack](https://github.com/localstack/localstack) can help spin up a local AWS environment, wherein your functions, APIs, and event 
processing code can more easily be tested. 

Functional/end-to-end/regression/smoke tests should be hosted in a separate git repository
and executed against remote environments, preferably all of them. Hosting them in their own 
git repository allows you to more easily choose the best tooling available, regardless of programming 
language. For example, [playwright](https://playwright.dev/) provides easy-to-use and powerful capabilities, while being agnostic to 
how the applications under test are written. They should run on
a schedule and after each deployment of new code to an environment. Optionally, these can be
hooked into some form of active/passive or canary deployment. Code is deployed to either an inactive
cluster or to a small percentage of an existing cluster. If the tests run against and pass this new code path,
the deployment runs additional steps to roll out to the entire cluster. 

Performance tests are similar to end-to-end tests, but instead of focusing on functional
correctness (though they still need your app to be functionally correct) they focus on
issuing massively concurrent requests to your application. They measure fine-grained metrics, 
including request rate, error rate, latency, and availability. Multiple test scenarios
can be constructed to model various user scenarios. Scenarios answer "what if" questions,
like "What if we offer 50% off store-wide, can our site handle that"? I have used and liked
[k6](https://k6.io) for performance testing. I'm a fan of a code-first approach to all phases
of software development and have appreciated being able to use code to model performance 
scenarios instead of heavyweight UI tooling that generates XML (you know what I'm referring to). These tests should also go into a standalone repository.

### Test Coverage

Tools like [jest](https://jestjs.io) have code coverage built in. On the JVM, you can use 
[jacoco](https://www.jacoco.org/jacoco/) for any JVM language. Why is this important?

You want an automated way of ensuring that as your code base grows and changes, your tests adequately
cover the statements, branches, functions, and lines of code. Statements are logical instructions. You
can (and often do) have multiple statements per line:
```javascript
function test(a) {
  if (a=='Foo') {return true;} else {return false;}
}
```
Branches indicate any portions of code that can be skipped due to conditional logic. Functions are ... functions.

### Formatting and Linting

Use tooling to format your code. The format doesn't matter much, as long as it's readable, industry standard,
and works well with IDEs that your team uses.

[Prettier](https://prettier.io/) Javascript/Typescript formatting
[Spotless](https://github.com/diffplug/spotless) JVM Formatting that can apply styles like the[Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)

Linting tools perform static analysis on your source code. They
look for potential problems in your code and automatically fix them.

[eslint](https://eslint.org/) Javascript/Typescript static code analysis
[spotbugs](https://spotbugs.github.io/) Java static code analysis
[detekt](https://detekt.dev/) Kotlin static code analysis

### Security Analysis

Tooling can help statically detect security vulnerabilities in your code and in your dependencies.
I recommend reviewing (github's code security docs)[https://docs.github.com/en/code-security] for a 
comprehensive guide that describes how to secure all aspects of your code, and why it's important.

If you need to roll your own security checks, tools like [OWASP](https://owasp.org/www-prcoject-dependency-check/)
can work well.





