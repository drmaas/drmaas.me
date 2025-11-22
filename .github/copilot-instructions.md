# Copilot Instructions for drmaas.me

## Project Overview
This is an Astro-based personal blog with TypeScript, Tailwind CSS, and DaisyUI. The architecture follows Astro's content collections pattern for blog posts with client-side search and tag-based navigation.

## Key Architecture Patterns

### Content Structure
- **Blog posts**: Located in `src/posts/` as `.md` files with frontmatter schema defined in `src/content.config.ts`
- **Collections**: Uses Astro's content collections with glob loader for markdown files
- **Frontmatter schema**: Required fields are `title`, `description`, `date`, `tags`. Optional: `image`, `imageDescription`, `draft`
- **URL structure**: Posts accessible at `/articles/{filename}/` (trailing slash enforced)

### Routing & Navigation
- **Dynamic routes**: `src/pages/articles/[...slug].astro` handles individual posts
- **Pagination**: `[...page].astro` files handle paginated lists (articles, tags)
- **Navigation**: Configured in `src/config.ts` with SVG icons and tooltips
- **Static paths**: Generated using `getStaticPaths()` with `sortDateDescending()` utility

### Styling System
- **Framework**: Tailwind CSS v4 with DaisyUI for components
- **Theme**: Supports dark/light mode switching via DaisyUI
- **Typography**: Uses `@tailwindcss/typography` plugin for prose styling
- **Code highlighting**: Shiki with "one-dark-pro" theme + Expressive Code for enhanced code blocks

### Search Implementation
- **Client-side search**: JSON endpoint at `/search/search.json.ts` generates searchable index
- **Search data**: Includes title, URL, date, description (extracted from first paragraph), and tags
- **Draft filtering**: Search excludes posts with `draft: true`

## Development Workflows

### Key Commands
```bash
yarn dev          # Development server (localhost:4321)
yarn build        # Production build to ./dist/
yarn lint         # ESLint with TypeScript, Prettier, and Markdown support
yarn test         # Vitest for testing
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
- Component imports use `@components/` alias

### Utilities in `src/misc.ts`
- `sortDateDescending()`: Sort posts by date (newest first)
- `getAllUniqueTags()`: Extract unique tags across all posts
- `fileToSlug()`: Convert file paths to URL slugs

### Tag System
- **Colors**: Defined in `src/config.ts` tagColors object
- **Rendering**: `TagButton.astro` component with hover effects
- **Pages**: Dynamic tag pages at `/tags/{tag}/`

## Project-Specific Conventions
- **File organization**: Pages mirror URL structure, components are shared
- **Import aliases**: Use `@components/` and `src/` prefixes
- **Date handling**: String dates in frontmatter transformed to Date objects in schema
- **Image paths**: Relative to `public/` directory (e.g., `/images/example.png`)
- **External links**: Configure with `absolute: true` in navigation config
- **Accessibility**: Skip links, semantic HTML, accessible anchor links with proper ARIA

## Configuration Files
- `astro.config.ts`: Core Astro setup with integrations and markdown processing
- `src/config.ts`: Site navigation, tag colors, metadata
- `tailwind.config.ts`: Theme extensions, font families, DaisyUI integration
- `eslint.config.mjs`: Flat config with TypeScript, Prettier, and Markdown linting