import Fuse, { type IFuseOptions } from "fuse.js";
import type { SearchResult } from "./search-results";

export const SEARCH_FUSE_OPTIONS: IFuseOptions<SearchResult> = {
  ignoreLocation: true,
  keys: [
    { name: "title", weight: 0.45 },
    { name: "description", weight: 0.35 },
    { name: "body", weight: 0.2 },
  ],
};

export function createSearchFuse(posts: SearchResult[]): Fuse<SearchResult> {
  return new Fuse(posts, SEARCH_FUSE_OPTIONS);
}
