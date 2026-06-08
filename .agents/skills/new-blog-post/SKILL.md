---
name: new-blog-post
description: Creates a new blog post markdown file for drmaas.me. Use when the user says they want to write a blog post, draft an article, create new content, start a new post, or add a blog entry. Works for both published posts (goes to src/posts/) and drafts (goes to drafts/). The skill handles frontmatter generation, tag deduction, date setting, and file placement. Do not create a new post without using this skill.
---

# new-blog-post

Creates a new Astro blog post markdown file for drmaas.me.

## Workflow

### 1. Interview the user

Ask for the following. Bold the ones you're asking about.

- **Title** (required) — the post title
- **Description** (required) — 1-2 sentence summary
- **Image** / **Image description** (optional) — path and alt text
- **Draft?** — if yes, the file goes into `drafts/`; if no, into `src/posts/`

### 2. Auto-deduce the following

- **Tags** — infer from title and description. Pick 1-4 relevant topic tags. Look at existing posts in `src/posts/` for tag conventions (e.g., `Featured`, `General`, `Astro`, `Bitcoin`, `debugging`, etc.). Use lowercase for multi-word tags like `infrastructure as code`.
- **Date** — use today's date in `dd Month YYYY` format (e.g., `07 June 2026`)

### 3. Suggest ideas and write

Suggest 2-3 concrete angles or talking points based on the title and description. Keep each idea to one sentence. Present them, then **proceed directly to writing** — do not wait for confirmation.

Derive the slug from the title: lowercase, kebab-case, no special characters.
- `"My New Blog Post"` → `my-new-blog-post`
- `"The Case of the Broken Lambda"` → `the-case-of-the-broken-lambda`

Placement rules:
- **Draft**: create `drafts/<slug>/index.md`. Use draft frontmatter: `title`, `slug`, `date`, `description`. No `tags` or `draft` field.
- **Published**: create `src/posts/<slug>.md`. Use published frontmatter: `title`, `date`, `description`, `tags` (array), `draft: false`. Optionally `image` and `imageDescription`.

Write the markdown file with the full frontmatter. Leave the body empty with just a blank line after the closing `---`. Use the `write` tool to create the file.

## Reference

Read `references/template.md` for the template format. It shows both the draft-style fields (with `slug`) and published-style fields (with `tags`/`draft`). Follow the existing conventions shown in `src/posts/` for indentation, tag formatting (list vs. inline), and date format.
