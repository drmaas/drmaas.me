import { describe, expect, it } from "vitest";
import {
  articleHeroDimensions,
  DEFAULT_ARTICLE_HERO_HEIGHT,
  DEFAULT_ARTICLE_HERO_WIDTH,
} from "./article-hero-image";

describe("articleHeroDimensions", () => {
  it("uses 16:9 defaults when dimensions are omitted", () => {
    expect(articleHeroDimensions()).toEqual({
      width: DEFAULT_ARTICLE_HERO_WIDTH,
      height: DEFAULT_ARTICLE_HERO_HEIGHT,
    });
  });

  it("prefers explicit frontmatter dimensions", () => {
    expect(articleHeroDimensions(1920, 1080)).toEqual({
      width: 1920,
      height: 1080,
    });
  });
});
