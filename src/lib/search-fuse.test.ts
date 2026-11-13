import { describe, expect, it } from "vitest";
import { createSearchFuse } from "./search-fuse";
import type { SearchResult } from "./search-results";

const samplePosts: SearchResult[] = [
  {
    title: "Building at the Edge",
    url: "/articles/edge/",
    date: "Mon Jan 01 2024",
    description: "Intro without the target keyword.",
    body: "Later we rely on Durable Objects for strongly consistent state.",
  },
  {
    title: "Durable Objects primer",
    url: "/articles/do-primer/",
    date: "Mon Jan 02 2024",
    description: "A high-level overview.",
    body: "Unrelated body text.",
  },
];

describe("createSearchFuse", () => {
  it("surfaces a post when the query appears only in body", () => {
    const fuse = createSearchFuse(samplePosts);
    const hits = fuse.search("Durable Objects").map((r) => r.item.url);
    expect(hits).toContain("/articles/edge/");
  });

  it("ranks title matches above body-only matches", () => {
    const fuse = createSearchFuse(samplePosts);
    const hits = fuse.search("Durable Objects").map((r) => r.item.url);
    expect(hits[0]).toBe("/articles/do-primer/");
  });
});
