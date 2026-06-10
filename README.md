# Dan's Blog

My personal blog, built with Astro and Tailwind CSS.

## Features

- Dark mode and light mode with [daisyUI](https://daisyui.com/)
- Tagging, pagination, draft support
- SEO friendly, client-side search, floating TOC
- **Content authoring** via [Sveltia CMS](https://github.com/sveltia/sveltia-cms) at `/admin`
- **CMS auth** via [Sveltia CMS Auth](https://github.com/sveltia/sveltia-cms-auth) Cloudflare Worker

## Commands

| Command        | Action                                                 |
| :------------- | :----------------------------------------------------- |
| `pnpm install` | Installs dependencies                                  |
| `pnpm dev`     | Starts local dev server at `localhost:4321`            |
| `pnpm build`   | Build your production site to `./dist/`                |
| `pnpm preview` | Preview your build locally, before deploying           |
| `pnpm lint`    | Lint the project using Biome                           |

## CMS

The admin panel is at `https://drmaas.me/admin`. Sveltia CMS authenticates via GitHub OAuth through a Cloudflare Worker at `sveltia-cms-auth.drmaas.workers.dev`. Content collections and widget config are defined in `public/admin/config.yml`.

## Analytics

[PostHog](https://posthog.com/docs/libraries/astro)