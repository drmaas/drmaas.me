import type { RehypePlugins } from "astro";
import rehypeAutolinkHeadings, {
  type Options as AutolinkOptions,
} from "rehype-autolink-headings";

/**
 * Configuration for the `rehype-autolink-headings` plugin.
 * This set-up was informed by https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/
 * and https://jan-mueller.at/blog/next-level-heading-anchors/
 */
const autolinkConfig: AutolinkOptions = {
  properties: {
    class:
      "anchor-link text-cyan-600 hover:text-black dark:hover:text-white no-underline",
  },
  behavior: "wrap",
  headingProperties: {
    className: ["flex", "items-center", "gap-2", "scroll-mt-20"],
  },
};

/**
 * Configure heading anchor links.
 * Spread this into Astro’s `markdown.rehypePlugins` option.
 */
export const rehypeAutolink = (): RehypePlugins => [
  [rehypeAutolinkHeadings, autolinkConfig],
];
