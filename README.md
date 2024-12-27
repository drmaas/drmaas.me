# Dan's Blog

My personal blog, built with Astro and Tailwind CSS. Based on <https://github.com/MoofyWoofy/Bob-blog>


## :dizzy: Features

A full-featured blog with tagging
- Dark mode and light mode with [daisyUI](https://daisyui.com/)
- Site configuration
- Supports draft page
- Pagination for blog and tags page
- SEO friendly
- Client-Side search
- Floating TOC for all articles

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command        | Action                                                 |
| :------------- | :----------------------------------------------------- |
| `yarn install` | Installs dependencies                                  |
| `yarn dev`     | Starts local dev server at `localhost:4321`            |
| `yarn build`   | Build your production site to `./dist/`                |
| `yarn preview` | Preview your build locally, before deploying           |
| `yarn lint`    | Lint the project using <https://typescript-eslint.io/> |


## :rocket: Adding new posts
A template to follow is in `src/posts/template.md`
```md
---
title: template
date: 01 July 2022
description: example
image: /images/...
imageDescription: template text
tags:
  - Featured
draft: true
```

## :sparkles: Analytics

[PostHog](https://posthog.com/docs/libraries/astro)

## :chicken: Misc

<https://github.com/markdown-templates/markdown-emojis> :astonished:

