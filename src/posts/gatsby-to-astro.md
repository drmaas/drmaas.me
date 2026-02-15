---
title: Migrating from Gatsby to Astro - Choosing Simplicity Over Abstraction
date: 29 March 2024
description: Why I opted for a more transparent, less magical framework
tags:
  - Featured
  - Astro
draft: false
---

## The Problem with Gatsby

I increasingly felt misaligned with my Gatsby implementation. The framework embodied too much abstraction and automation, making it difficult to understand what was actually happening under the hood. As someone who values understanding systems thoroughly, Gatsby's "magic" was more frustrating than helpful.

I lacked sufficient React knowledge to work comfortably within Gatsby's architecture, and the framework-specific conventions and plugin ecosystem created steep learning curves. Worst of all, I couldn't confidently maintain the site after stepping away from it. I needed a framework that prioritized clarity over convention.

## Why Astro

[Astro](https://astro.build/) appealed to me for its philosophy: do less out of the box while retaining complete power for building markdown-based sites. It emphasizes clarity over hidden complexity. Here's what drew me in:

### Core Strengths

* **Markdown-first architecture**: All static site generators handle frontmatter-annotated markdown, but Astro makes this a first-class concern
* **Regular component syntax**: Components use JSX-like syntax with HTML, JavaScript, and CSS co-located without framework magic obscuring how they work
* **Framework agnostic**: I can bring in React, Vue, Svelte, or any other framework when beneficial—not because the framework requires it
* **Clean styling story**: Native Tailwind CSS integration with DaisyUI components, providing design system support without sacrificing control
* **GraphQL-optional**: Unlike Gatsby's GraphQL-centric data model, Astro lets me load data however makes sense for my use case

## The Migration Process

### Starting with a Template

I [located a well-designed starting template](https://github.com/MoofyWoofy/Bob-blog) already featuring night mode, client-side search, and navigation—eliminating redundant work. I then used [Astro's official Gatsby migration guide](https://docs.astro.build/en/guides/migrate-to-astro/from-gatsby/) to systematically port core resources: static pages, images, favicon, and deployment configuration.

### Iterative Feature Implementation

With the migration guide exhausted, I methodically added features that enhance the site:

#### Visual Enhancements
**Rounded Profile Image**: Tailwind CSS classes handle image rounding elegantly. I paired these with SVG social media icons for a polished appearance.

**Markdown Link Anchors**: Integrating the rehypeAutolinkHeadings plugin required research into rendering preferences, but [the plugin documentation](https://github.com/rehypejs/rehype-autolink-headings) clarifies configuration options well.

#### Navigation and UX
**Floating Table of Contents**: This ambitious feature provides visual hierarchy while enabling infinite scrolling. The implementation required coordinate calculations and DOM manipulation. See [TableOfContents.astro](/src/components/TableOfContents.astro) for the full solution.

**Reading Time and Article Navigation**: Display reading time estimates and previous/next article links on each post. This required a significant architectural shift: moving from Astro's default markdown layouts to custom dynamic routing.

With Astro's [dynamic routing](https://docs.astro.build/en/guides/routing/#rest-parameters), I created slug-based pages that access the entire rendered markdown content. This enables reading time calculation while providing article navigation context. The component-based reading time calculator extracts and measures content efficiently.

#### Styling and Search
**Visual Customization**: I iteratively applied Tailwind CSS classes until achieving the desired appearance. While my CSS expertise remains limited, Tailwind's utility-first approach made experimentation productive.

**Client-Side Search**: Because search executes client-side while most content is server-rendered, I embedded markdown as JavaScript on search pages. The search JSON endpoint returns properly formatted data for client consumption.

## Lessons from the Migration

Migrating from Gatsby to Astro taught me several valuable lessons:

1. **Transparency trumps convention**: Understanding exactly how your framework generates and serves content is worth more than saved configuration.
2. **Gradual enhancement works**: Building the site incrementally—completing one feature before moving to the next—prevented overwhelming complexity.
3. **Leverage community knowledge**: Standing on the shoulders of other builders through well-documented examples and open-source templates accelerates progress substantially.
4. **Constraints enable creativity**: Astro's minimal "magic" forced me to understand the underlying patterns, making me a better frontend engineer.

The migration consumed more time than anticipated, but I emerged with a site I truly understand and confidently maintain. For anyone who values clarity and has experience with web fundamentals, [Astro](https://astro.build/) deserves serious consideration.