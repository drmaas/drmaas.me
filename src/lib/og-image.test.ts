import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_OG_IMAGE_PATH,
  postShareImage,
  resolveOgImageUrl,
} from "./og-image";

const site = "https://drmaas.me";

describe("resolveOgImageUrl", () => {
  it("uses the default asset when image is missing", () => {
    expect(resolveOgImageUrl(site)).toBe(
      `https://drmaas.me${DEFAULT_OG_IMAGE_PATH}`,
    );
  });

  it("uses the default asset when image is empty or whitespace", () => {
    expect(resolveOgImageUrl(site, "")).toBe(
      `https://drmaas.me${DEFAULT_OG_IMAGE_PATH}`,
    );
    expect(resolveOgImageUrl(site, "   ")).toBe(
      `https://drmaas.me${DEFAULT_OG_IMAGE_PATH}`,
    );
  });

  it("absolute-ifies site-relative paths", () => {
    expect(resolveOgImageUrl(site, "/images/codefreeze-1.jpg")).toBe(
      "https://drmaas.me/images/codefreeze-1.jpg",
    );
  });

  it("passes through absolute URLs unchanged", () => {
    const absolute = "https://cdn.example.com/hero.png";
    expect(resolveOgImageUrl(site, absolute)).toBe(absolute);
  });

  it("prefixes unprefixed relative paths with a slash before resolving", () => {
    expect(resolveOgImageUrl(site, "images/foo.jpg")).toBe(
      "https://drmaas.me/images/foo.jpg",
    );
  });

  it("treats protocol-relative URLs as https absolute", () => {
    expect(resolveOgImageUrl(site, "//cdn.example.com/hero.png")).toBe(
      "https://cdn.example.com/hero.png",
    );
  });
});

describe("postShareImage", () => {
  it("returns undefined for missing, empty, or whitespace image", () => {
    expect(postShareImage()).toBeUndefined();
    expect(postShareImage("")).toBeUndefined();
    expect(postShareImage("   ")).toBeUndefined();
  });

  it("passes through non-empty frontmatter image (trimmed only for emptiness)", () => {
    expect(postShareImage("/images/hero.jpg")).toBe("/images/hero.jpg");
    expect(postShareImage("  /images/hero.jpg  ")).toBe("  /images/hero.jpg  ");
  });
});

describe("article slug share meta", () => {
  const fixturePost = {
    title: "Fixture post",
    image: "/images/fixture-share.jpg",
    description: "Fixture",
  };

  it("resolves fixture post frontmatter to absolute og/twitter image URL", () => {
    const shareImage = postShareImage(fixturePost.image);
    expect(resolveOgImageUrl(site, shareImage)).toBe(
      "https://drmaas.me/images/fixture-share.jpg",
    );
  });

  it("wires [...slug].astro through BaseLayout with shareImage", () => {
    const slugPage = fs.readFileSync(
      path.join(process.cwd(), "src/pages/articles/[...slug].astro"),
      "utf8",
    );
    expect(slugPage).toContain("postShareImage");
    expect(slugPage).toMatch(/image=\{shareImage\}/);
  });
});
