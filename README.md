# Dan's Blog

My personal blog, built with Astro and Tailwind CSS. Based on <https://github.com/MoofyWoofy/Bob-blog>


## :dizzy: Features

- A full featured blog with tagging
- Dark mode and light mode with daisyUI
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
A template to follow is in `src/pages/articles/content/template.md`
```markdown
---
layout: required
title: required
date: required
image?: optional
imageDescription?: optional
tags: required;
description: required;
draft?: optional;
---
```

