import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import { rehypeAutolink } from "./plugins/rehype-autolink";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

// https://expressive-code.com/installation/
import expressiveCode from "astro-expressive-code";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [
    expressiveCode({
      plugins: [pluginLineNumbers()],
      themes: ["one-dark-pro"],
    }),
    mdx(),
    sitemap(),
  ],

  site: "https://drmaas.me",
  trailingSlash: "always",

  // https://github.com/withastro/docs/blob/main/astro.config.ts
  markdown: {
    smartypants: true,
    rehypePlugins: [
      rehypeSlug,
      // This adds links to headings
      ...rehypeAutolink(),
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    },
    syntaxHighlight: "shiki", // Use Shiki for markdown, ExpressiveCode for code blocks
  },

  scopedStyleStrategy: "where",

  vite: { plugins: [tailwindcss()] },
});
