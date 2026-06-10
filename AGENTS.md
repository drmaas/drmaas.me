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