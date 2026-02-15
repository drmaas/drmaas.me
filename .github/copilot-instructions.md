# Copilot Instructions for drmaas.me

## Project Overview
This is an Astro-based personal blog with TypeScript, Tailwind CSS, and DaisyUI. The architecture follows Astro's content collections pattern for blog posts with client-side search and pagination.

## Key Architecture Patterns

### Content Structure
- **Blog posts**: Located in `src/posts/` as `.md` files with frontmatter schema defined in `src/content.config.ts`
- **Collections**: Uses Astro's content collections with glob loader for markdown files
- **Frontmatter schema**: Required fields are `title`, `description`, `date`. Optional: `image`, `imageDescription`, `draft`, `tags` (legacy, unused)
- **URL structure**: Posts accessible at `/articles/{filename}/` (trailing slash enforced)

### Routing & Navigation
- **Dynamic routes**: `src/pages/articles/[...slug].astro` handles individual posts
- **Pagination**: `src/pages/articles/[...page].astro` handles paginated article lists
- **Navigation**: Configured in `src/config.ts` with SVG icons and tooltips
- **Static paths**: Generated using `getStaticPaths()` with `sortDateDescending()` utility

### Styling System
- **Framework**: Tailwind CSS v4 with DaisyUI for components
- **Theme**: Supports dark/light mode switching via DaisyUI
- **Typography**: Uses `@tailwindcss/typography` plugin for prose styling
- **Code highlighting**: Shiki with "one-dark-pro" theme + Expressive Code for enhanced code blocks

### Search Implementation
- **Client-side search**: JSON endpoint at `/search/search.json.ts` generates searchable index
- **Search data**: Includes title, URL, date, and description (extracted from first paragraph)
- **Draft filtering**: Search excludes posts with `draft: true`
- **Search UI**: Simple search box on `/explore` page with instant results

## Development Workflows

### Key Commands
```bash
pnpm dev          # Development server (localhost:4321)
pnpm build        # Production build to ./dist/
pnpm lint         # ESLint with TypeScript, Prettier, and Markdown support
pnpm test         # Vitest for testing
```

### Adding Content
1. Create `.md` file in `src/posts/` following `template.md` structure
2. Use `fileToSlug()` utility for URL generation (removes `.md`, adds trailing slash)
3. Set `draft: true` for unpublished posts (excluded from search and navigation)

### Plugin Architecture
- **Rehype plugins**: Custom `rehype-autolink.ts` adds accessible anchor links to headings
- **Markdown processing**: Combines Shiki (markdown) + Expressive Code (code blocks)
- **HTML processing**: Uses `node-html-parser` for extracting content in search indexing

## Component Patterns

### Layout Hierarchy
- `BaseLayout.astro`: Main template with navigation, transitions, PostHog analytics
- `ArticleLayout.astro`: Extends BaseLayout for blog posts with TOC and article navigation
- `ArticleCard.astro`: Displays article preview cards with title, date, reading time, and excerpt
- Component imports use `@components/` alias

### Utilities in `src/misc.ts`
- `sortDateDescending()`: Sort posts by date (newest first)
- `fileToSlug()`: Convert file paths to URL slugs
- `capitalizeString()`: Capitalize first letter of a string

## Project-Specific Conventions
- **File organization**: Pages mirror URL structure, components are shared
- **Import aliases**: Use `@components/` and `src/` prefixes
- **Date handling**: String dates in frontmatter transformed to Date objects in schema
- **Image paths**: Relative to `public/` directory (e.g., `/images/example.png`)
- **External links**: Configure with `absolute: true` in navigation config
- **Accessibility**: Skip links, semantic HTML, accessible anchor links with proper ARIA
- **Topics page**: Media & Resources page at `src/pages/topics/media.md` contains curated content list
- **Search-focused**: Site emphasizes simple client-side search over complex filtering

## Configuration Files
- `astro.config.ts`: Core Astro setup with integrations and markdown processing
- `src/config.ts`: Site navigation, metadata
- `tailwind.config.ts`: Theme extensions, font families, DaisyUI integration
- `eslint.config.mjs`: Flat config with TypeScript, Prettier, and Markdown linting