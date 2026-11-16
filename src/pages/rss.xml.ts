import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import config from "src/config";
import { getRssFeedItems } from "src/lib/rss-feed";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");
  const site = context.site ?? new URL("https://drmaas.me");

  return rss({
    title: "drmaas.me",
    description: config.metaData.summary,
    site,
    trailingSlash: true,
    items: getRssFeedItems(posts, site),
    customData: "<language>en-us</language>",
  });
}