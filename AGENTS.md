# drmaas.me

Astro v6 · Tailwind v4 · daisyUI 5 · TypeScript · pnpm

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

## Architecture

Two Cloudflare Workers in a single repo:

- **Main site** (`drmaas.me`): Astro static site deployed via Workers Static Assets. `wrangler.jsonc` at root configures `assets.directory: "./dist"`. No adapter — pure SSG output served by Cloudflare Workers.
- **Resume API** (`api.drmaas.me`): Counter service using a Durable Object for strongly-consistent visitor counting. Lives under `api/` with its own `wrangler.jsonc` and `package.json`.

## Conventions

- **Path aliases**: `@components/*` → `src/components/*`, `@layouts/*` → `src/layouts/*`
- **Tailwind**: v4 via `@tailwindcss/vite` plugin. Config in `tailwind.config.ts` (v3 compat for daisyUI/typography)
- **daisyUI**: data-theme on `<html>`. Night theme for dark mode
- **Content**: MDX in `src/posts/`, content collections via `src/content.config.ts`
- **Markdown**: rehype-slug, rehype-autolink-headings, remark-smartypants, expressive-code (one-dark-pro theme, line numbers)
- **Search**: fuse.js (client-side)
- **CMS**: [Sveltia CMS](https://github.com/sveltia/sveltia-cms) at `/admin` for content authoring. Config in `public/admin/config.yml`. Auth via GitHub OAuth through a Cloudflare Worker at `sveltia-cms-auth.drmaas.workers.dev` ([Sveltia CMS Auth](https://github.com/sveltia/sveltia-cms-auth)).
- **Linting**: Biome (no ESLint), commitlint with conventional commits, husky + lint-staged
- **Styling**: scopedStyleStrategy `"where"` in astro config
- **Site URL**: `https://drmaas.me`, trailing slash always
- **Resume page**: `/resume/` — ported from `cloud-resume-ui`, now an Astro page in `src/pages/resume/index.astro`
- **Visitor counter**: `api/src/counter.do.ts` — Durable Object with atomic counter. Deployed as separate Worker at `api.drmaas.me`
- **Deployment**: GitHub Actions (`.github/workflows/deploy.yml`) — builds Astro site, then deploys API worker and main site with wrangler
- **CI secrets**: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`