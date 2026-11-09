import { describe, expect, it } from "vitest";
import {
  DEFAULT_OG_IMAGE_PATH,
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
});
