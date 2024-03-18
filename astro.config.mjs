import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import remarkSmartypants from "remark-smartypants";
import { rehypeAutolink } from "./plugins/rehype-autolink";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

// https://expressive-code.com/installation/
import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    expressiveCode({
      plugins: [pluginLineNumbers()],
    }),
    mdx(),
  ],
  site: "https://drmaas.me",
  trailingSlash: "always",
  // https://github.com/withastro/docs/blob/main/astro.config.ts
  markdown: {
    remarkPlugins: [
      [
        remarkSmartypants,
        {
          dashes: false,
        },
      ],
    ],
    rehypePlugins: [
      rehypePrettyCode,
      rehypeSlug,
      // This adds links to headings
      ...rehypeAutolink(),
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    },
    syntaxHighlight: "shiki",
  },
  scopedStyleStrategy: "where",
});
