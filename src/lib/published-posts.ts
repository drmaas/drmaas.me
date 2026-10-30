import { getCollection, type CollectionEntry } from "astro:content";
import { KNOWN_DRAFT_SLUG } from "./published-posts.constants";

export { KNOWN_DRAFT_SLUG };

export function isPublishedPost(post: CollectionEntry<"posts">): boolean {
  return post.data.draft !== true;
}

export async function getPublishedPosts(): Promise<CollectionEntry<"posts">[]> {
  const allPosts = await getCollection("posts");
  return allPosts.filter(isPublishedPost);
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
  return allPosts.filter(isPublishedPost);
}
