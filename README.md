# Dan's Blog

My personal blog, built with Astro 7 and Tailwind CSS 4. Deployed on Cloudflare Workers.

## Architecture

Two Cloudflare Workers in a single repo:

- **Main site** (`drmaas.me`): Astro static site deployed via Workers Static Assets
- **Resume API** (`api.drmaas.me`): Visitor counter backed by a Durable Object

## Features

- Dark mode and light mode with [daisyUI](https://daisyui.com/)
- Tagging, pagination, draft support
- SEO friendly, client-side search, floating TOC
- **Resume page** with visitor counter at `/resume/`
- **Content authoring** via [Sveltia CMS](https://github.com/sveltia/sveltia-cms) at `/admin`
- **CMS auth** via [Sveltia CMS Auth](https://github.com/sveltia/sveltia-cms-auth) Cloudflare Worker

## Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build to `dist/` |
| `pnpm preview` | Preview production build |
| `pnpm check` | Astro check + lint |
| `pnpm lint` | Biome lint `./src` |
| `pnpm format` | Biome format `./src` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest |
| `pnpm deploy` | Deploy API worker + main site to Cloudflare |
| `pnpm deploy:api` | Deploy only the API worker |
| `pnpm deploy:site` | Build + deploy only the main site |

## CMS

The admin panel is at `https://drmaas.me/admin`. Sveltia CMS authenticates via GitHub OAuth through a Cloudflare Worker at `sveltia-cms-auth.drmaas.workers.dev`. Content collections and widget config are defined in `public/admin/config.yml`.

## Analytics

[PostHog](https://posthog.com/docs/libraries/astro)
