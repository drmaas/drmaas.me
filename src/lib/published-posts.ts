import { getCollection, type CollectionEntry } from "astro:content";
import { KNOWN_DRAFT_SLUG } from "./published-posts.constants";

export { KNOWN_DRAFT_SLUG };

export function isPublishedPost(
  post: CollectionEntry<"posts">,
  now: Date = new Date(),
): boolean {
  if (post.data.draft === true) {
    return false;
  }
  return new Date(post.data.date).getTime() <= now.getTime();
}

export async function getPublishedPosts(
  now: Date = new Date(),
): Promise<CollectionEntry<"posts">[]> {
  const allPosts = await getCollection("posts");
  return allPosts.filter((post) => isPublishedPost(post, now));
}

/**
 * Posts that receive static article routes. Drafts are included in dev for local preview only.
 */
export async function getPostsForStaticPaths(): Promise<
  CollectionEntry<"posts">[]
> {
  const allPosts = await getCollection("posts");
  if (import.meta.env.DEV) {
    return allPosts;
  }
  return allPosts.filter((post) => isPublishedPost(post));
}
