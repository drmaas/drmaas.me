---
title: Building Services Part 3 - Comprehensive Testing Strategy
date: 12 January 2024
description: Building confidence through systematic verification
tags: [coding, design, systems, testing]
draft: false
---

## Part 3: Testing - The Insurance Policy for Production Confidence

You've written beautiful, modular code with clear separation of concerns and no circular dependencies. Congratulations—you've solved half the problem. Now comes the harder work: verifying that your code actually does what you claim.

Skipping tests to accelerate delivery is a false economy. Deploy without tests only if risk is genuinely negligible. Yes, deploy your static blog without tests. Deploy a button color change by all means. But for everything else—especially services handling real data and traffic—systematic testing is non-negotiable.

## Test Type Taxonomy

No single test catches all defects. A portfolio approach combining multiple test types provides comprehensive coverage:

### Types of Tests

**Unit Tests**: Test individual functions and classes in isolation, mocking external dependencies. Examples: page component tests, individual method tests.

Implementation: Most languages have mature unit test frameworks ([Jest](https://jestjs.io) for JavaScript includes excellent mocking; [JUnit](https://junit.org/) for Java). Pick a popular option and use it consistently.

Requirements: Unit tests must run automatically on every push via pre-commit hooks, on every PR, and on every code merge. **Builds fail if tests fail.** Additionally, builds fail if test coverage drops below your organization's threshold.

**Integration Tests**: Test how components interact with each other. Examples: page-level tests against a real browser, API route tests against a real server.

Status: Optional, depending on scope. For web APIs, spinning up a local server and testing via HTTP is standard practice. For Lambda functions, tools like [LocalStack](https://github.com/localstack/localstack) recreate AWS environments locally, making testing practical.

**Functional/End-to-End/Regression/Smoke Tests**: Test system behavior holistically at varying granularity levels.

Hosting: Deploy these in a separate git repository. This separation allows you to choose the best testing tool regardless of how applications are built. [Playwright](https://playwright.dev/) excels here—powerful, language-agnostic, and intuitive.

Deployment: Run them on a schedule and after each environment deployment. Optionally integrate with canary/blue-green deployments: deploy code to an inactive cluster or small traffic percentage, run these tests, and roll out to 100% if tests pass.

**Performance Tests**: Functional correctness matters little if your service collapses under load. Performance tests measure:
* Request rate
* Error rate  
* Latency percentiles
* Availability metrics

They simulate varied user scenarios answering "what if" questions: "What if we offer 50% off store-wide?"

Tooling: [k6](https://k6.io) is excellent—code-first approach beats heavyweight XML-generating UIs. Like E2E tests, house these in a standalone repository.

**Non-Functional Tests**: Code coverage, formatting, linting, and security checks (described below) round out your testing portfolio.

## Code Coverage Metrics

Code coverage tools ([Jest](https://jestjs.io), [JaCoCo](https://www.jacoco.org/) on the JVM) automatically measure how thoroughly tests exercise your code:

* **Statements**: Logical instructions executed
* **Branches**: Code paths that can be skipped via conditionals
* **Functions**: Function coverage  
* **Lines**: Individual lines of code

Why does this matter? As codebases grow and evolve, you want automated assurance that tests proportionally expand. Coverage requirements ensure this happens.

## Quality Gates: Formatting, Linting, and Security

### Formatting and Linting

**Formatting** makes code readable and consistent:
* [Prettier](https://prettier.io/): JavaScript/TypeScript
* [Spotless](https://github.com/diffplug/spotless): JVM languages with Google Java Style Guide support

**Linting** detects anti-patterns and potential issues:
* [ESLint](https://eslint.org/): JavaScript/TypeScript static analysis
* SpotBugs: Java
* Detekt: Kotlin

### Security Scanning

Automated tools detect known vulnerabilities in your code and dependencies. Start with [GitHub's comprehensive security documentation](https://docs.github.com/en/code-security), or implement tools like [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/).

## The Bottom Line

Testing represents an investment in production reliability. Teams that prioritize comprehensive testing ship with confidence. Teams that skip it ship with dread. Choose accordingly.





