import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import remarkSmartypants from "remark-smartypants";
import { rehypeAutolink } from "./plugins/rehype-autolink";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import expressiveCode from "astro-expressive-code";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [
    expressiveCode({
      plugins: [pluginLineNumbers()],
      themes: ["one-dark-pro"],
    }),
    // Clear deprecated markdown fields that expressive-code sets
    // TODO: remove when expressive-code supports the unified() processor API
    {
      name: "clear-legacy-markdown-config",
      hooks: {
        "astro:config:setup": ({ updateConfig }) =>
          updateConfig({ markdown: { rehypePlugins: void 0, remarkRehype: void 0 } }),
      },
    },
    mdx(),
    sitemap(),
  ],

  site: "https://drmaas.me",
  trailingSlash: "always",
  compressHTML: true,

  markdown: {
    processor: unified({
      remarkPlugins: [remarkSmartypants as any],
      rehypePlugins: [rehypeSlug, ...rehypeAutolink()],
    }),
  },

  scopedStyleStrategy: "where",

  vite: { plugins: [tailwindcss()] },
});
