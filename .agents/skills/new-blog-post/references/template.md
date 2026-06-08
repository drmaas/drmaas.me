# Template Reference

Use these frontmatter formats when creating new blog posts.

## Published post (`src/posts/<slug>.md`)

```yaml
---
title: My Post Title
date: 07 June 2026
description: A concise summary of the post.
image: /images/optional-image.jpg
imageDescription: Alt text for the image
tags:
  - Featured
  - Astro
draft: false
---
```

## Draft (`drafts/<slug>/index.md`)

```yaml
---
title: My Post Title
slug: my-post-title
date: "2026-06-07T12:00:00.000Z"
description: A concise summary of the draft.
---
```

## Conventions

- Published date format: `dd Month YYYY` (e.g., `07 June 2026`)
- Draft date format: ISO 8601 (e.g., `"2026-06-07T12:00:00.000Z"`)
- Tags: array in YAML. Use lowercase for multi-word tags (e.g., `infrastructure as code`)
- Slugs: lowercase kebab-case from title
- The body content is always left empty (just a blank line after `---`)