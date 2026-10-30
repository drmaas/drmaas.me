import fs from "node:fs";
import path from "node:path";
import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import { isPublishedPost, KNOWN_DRAFT_SLUG } from "./published-posts";

function mockPost(draft?: boolean): CollectionEntry<"posts"> {
  return {
    data: { draft, title: "Test", date: new Date("2024-01-01") },
  } as CollectionEntry<"posts">;
}

describe("isPublishedPost", () => {
  it("excludes posts with draft true", () => {
    expect(isPublishedPost(mockPost(true))).toBe(false);
  });

  it("includes posts with draft false or unset", () => {
    expect(isPublishedPost(mockPost(false))).toBe(true);
    expect(isPublishedPost(mockPost(undefined))).toBe(true);
  });
});

describe("production build output", () => {
  const distRoot = path.join(process.cwd(), "dist");

  it.skipIf(!fs.existsSync(distRoot))(
    "does not emit HTML for known draft slug",
    () => {
      const draftDir = path.join(distRoot, "articles", KNOWN_DRAFT_SLUG);
      expect(fs.existsSync(draftDir)).toBe(false);
    },
  );

  it.skipIf(!fs.existsSync(distRoot))(
    "omits known draft slug from sitemap",
    () => {
      const sitemapPath = path.join(distRoot, "sitemap-0.xml");
      expect(fs.existsSync(sitemapPath)).toBe(true);
      const xml = fs.readFileSync(sitemapPath, "utf8");
      expect(xml).not.toContain(KNOWN_DRAFT_SLUG);
    },
  );
});
