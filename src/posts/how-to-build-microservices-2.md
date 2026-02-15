---
title: Building Services Part 2 - Coding Practices and Project Structure
date: 30 September 2023
description: Establishing patterns that scale across teams
tags: [coding, design, systems]
draft: false
---

## Part 2: Coding - From Architecture to Implementation

You've completed your domain modeling and have architectural diagrams. Now comes the disciplined work of translating that vision into code. This section focuses on code structure and development tooling—the runtime environment concerns come later.

### Choosing the Right Language

**Selection criteria matter more than personal preference.** Pick a language after considering:
* **Team expertise**: Your team will be vastly more productive with languages they already know. Use side projects to explore new languages, not production services.
* **Problem fit**: Is this high-traffic? Use a compiled language with efficient resource utilization. Low traffic? A dynamic language accelerates initial delivery. Need fine-grained memory control? Pick accordingly.
* **Organizational consistency**: Align your choice with your team and broader organization. Being a team player—using common tools—matters more than chasing shiny objects. I've learned from experience that chasing novel languages usually leads to painful refactors.

### The Dependencies Question

A common tension exists between **reinvention** and **leverage**. Engineers who distrust dependencies will rewrite functionality, claiming control and understanding. This stance occasionally merits consideration if available libraries are poorly tested or unmaintained. 

Generally, though, **leverage battle-tested code**. Is a defect more likely in code you write from scratch, or in battle-tested libraries used by hundreds of teams in production? The math is clear.

### Project Structure

**Use a proven template.** There's little value in constantly rearranging source code, tests, and build scripts between projects. Templates encode organizational knowledge and best practices.

**Design for multi-module scalability**. Even if you'll deploy a single module initially, structure the codebase to accommodate N modules. Modules should depend on each other without circular dependencies. This prepares you for service splits as requirements evolve.

### Tooling: The Force Multiplier

**Build tool**: Choose something well-documented and widely supported by your organization. Don't spend more than 5% of your time writing build code. Invest in tools that abstract away complexity.

**Formatting and Linting**: Enforce consistent style automatically.
* JavaScript/TypeScript: [Prettier](https://prettier.io/) for formatting, [ESLint](https://eslint.org/) for analysis
* JVM languages: [Spotless](https://github.com/diffplug/spotless) for formatting (supports [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)), [SpotBugs](https://spotbugs.github.io/) for analysis
* Kotlin: [Detekt](https://detekt.dev/) for static analysis

Consistent, readable code isn't negotiable. Lazily-formatted code signals disrespect toward colleagues.

**Unit tests and coverage**: This isn't optional. Tests provide confidence that your code behaves as intended under both normal and edge cases. The investment in testing time pays enormous dividends when you eventually deploy. Yes, you could skip tests to move faster initially. But if bugs slip through, you won't know if users rejected the feature due to defects or because it's genuinely a weak product idea. Users won't distinguish—they'll expect things to JustWork.

**Code analysis**: Leverage automated tools to detect cyclomatic complexity, identify bug-prone patterns, and measure performance characteristics. Automated insights compound over time, revealing opportunities for improvement that manual review would miss.

## Closing Principle

These insights are high-level; each merits its own detailed exploration. The key is **intentionality**. Invest thoughtfully upfront. A little planning on code structure, tooling, and practice dramatically multiplies your team's effectiveness as the codebase grows.



