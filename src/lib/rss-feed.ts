import type { RSSFeedItem } from "@astrojs/rss";
import type { CollectionEntry } from "astro:content";
import { fileToSlug, sortDateDescending } from "src/misc";
import { isPublishedPost } from "./published-posts";

export function postArticlePath(post: CollectionEntry<"posts">): string {
  return `/articles/${fileToSlug(post.filePath ?? "", "md")}`;
}

export function mapPostToRssItem(
  post: CollectionEntry<"posts">,
  site: URL | string,
): RSSFeedItem {
  const pathname = postArticlePath(post);
  return {
    title: post.data.title,
    description: post.data.description,
    pubDate: new Date(post.data.date),
    link: new URL(pathname, site).href,
  };
}

export function getRssFeedItems(
  posts: CollectionEntry<"posts">[],
  site: URL | string,
  now: Date = new Date(),
): RSSFeedItem[] {
  const published = posts.filter((post) => isPublishedPost(post, now));
  return sortDateDescending(published).map((post) =>
    mapPostToRssItem(post, site),
  );
}