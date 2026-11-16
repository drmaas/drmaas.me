import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import { getRssFeedItems, mapPostToRssItem } from "./rss-feed";

const SITE = new URL("https://drmaas.me");

function mockPost(options: {
  draft?: boolean;
  date: Date;
  title?: string;
  description?: string;
  filePath?: string;
}): CollectionEntry<"posts"> {
  return {
    data: {
      draft: options.draft,
      title: options.title ?? "Title",
      description: options.description ?? "Description",
      date: options.date,
    },
    filePath: options.filePath ?? "src/posts/hello.md",
  } as CollectionEntry<"posts">;
}

describe("getRssFeedItems", () => {
  const now = new Date("2025-06-15T12:00:00Z");

  it("excludes drafts and future-dated posts", () => {
    const items = getRssFeedItems(
      [
        mockPost({ date: new Date("2025-01-01"), title: "Published" }),
        mockPost({
          date: new Date("2025-01-02"),
          draft: true,
          title: "Draft",
        }),
        mockPost({
          date: new Date("2025-12-31"),
          title: "Future",
        }),
      ],
      SITE,
      now,
    );

    expect(items.map((item) => item.title)).toEqual(["Published"]);
  });

  it("sorts newest first and maps absolute links", () => {
    const items = getRssFeedItems(
      [
        mockPost({
          date: new Date("2025-01-01"),
          title: "Older",
          filePath: "src/posts/older.md",
        }),
        mockPost({
          date: new Date("2025-03-01"),
          title: "Newer",
          filePath: "src/posts/newer.md",
        }),
      ],
      SITE,
      now,
    );

    expect(items.map((item) => item.title)).toEqual(["Newer", "Older"]);
    expect(items[0]?.link).toBe("https://drmaas.me/articles/newer/");
    expect(items[1]?.link).toBe("https://drmaas.me/articles/older/");
  });
});

describe("mapPostToRssItem", () => {
  it("maps title, description, pubDate, and link", () => {
    const post = mockPost({
      date: new Date("2024-07-04T08:00:00Z"),
      title: "Hello",
      description: "World",
      filePath: "src/posts/hello.md",
    });

    expect(mapPostToRssItem(post, SITE)).toEqual({
      title: "Hello",
      description: "World",
      pubDate: new Date("2024-07-04T08:00:00Z"),
      link: "https://drmaas.me/articles/hello/",
    });
  });
});