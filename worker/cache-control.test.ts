import { describe, expect, it } from "vitest";
import {
  IMMUTABLE_ASSETS_CACHE_CONTROL,
  cacheControlForAssetsResponse,
  isContentHashedAstroClientAsset,
} from "./cache-control";

describe("cacheControlForAssetsResponse", () => {
  it("sets immutable long cache for hashed _astro css and js on 200", () => {
    expect(
      cacheControlForAssetsResponse("/_astro/BaseLayout.CJQGRb4G.css", 200),
    ).toBe(IMMUTABLE_ASSETS_CACHE_CONTROL);
    expect(
      cacheControlForAssetsResponse(
        "/_astro/ClientRouter.astro_astro_type_script_index_0_lang.2i1RQzKf.js",
        200,
      ),
    ).toBe(IMMUTABLE_ASSETS_CACHE_CONTROL);
    expect(
      cacheControlForAssetsResponse(
        "/_astro/Search.astro_astro_type_script_index_0_lang.BNty7P1D.js",
        200,
      ),
    ).toBe(IMMUTABLE_ASSETS_CACHE_CONTROL);
    expect(cacheControlForAssetsResponse("/_astro/ec.0vx5m.js", 200)).toBe(
      IMMUTABLE_ASSETS_CACHE_CONTROL,
    );
    expect(cacheControlForAssetsResponse("/_astro/ec.6lcan.css", 200)).toBe(
      IMMUTABLE_ASSETS_CACHE_CONTROL,
    );
  });

  it("does not set immutable for stable-named or unhashed _astro css/js", () => {
    expect(cacheControlForAssetsResponse("/_astro/stable.css", 200)).toBeNull();
    expect(cacheControlForAssetsResponse("/_astro/stable.js", 200)).toBeNull();
    expect(cacheControlForAssetsResponse("/_astro/Stable.ABCDabcd.css", 200)).toBeNull();
    expect(cacheControlForAssetsResponse("/_astro/foo.css", 200)).toBeNull();
    expect(cacheControlForAssetsResponse("/_astro/foo.js", 200)).toBeNull();
    expect(cacheControlForAssetsResponse("/_astro/foo.xyz.css", 200)).toBeNull();
    expect(
      cacheControlForAssetsResponse("/_astro/foo.not_a_hash!!!.css", 200),
    ).toBeNull();
  });

  it("does not set cache for HTML document paths", () => {
    expect(cacheControlForAssetsResponse("/", 200)).toBeNull();
    expect(cacheControlForAssetsResponse("/index.html", 200)).toBeNull();
    expect(cacheControlForAssetsResponse("/blog/post/", 200)).toBeNull();
  });

  it("does not set cache for non-200", () => {
    expect(
      cacheControlForAssetsResponse("/_astro/foo.abc123.css", 404),
    ).toBeNull();
    expect(cacheControlForAssetsResponse("/_astro/foo.abc123.css", 500)).toBeNull();
  });

  it("does not set cache for _astro non-css-js extensions", () => {
    expect(cacheControlForAssetsResponse("/_astro/map.xyz123.woff2", 200)).toBeNull();
  });

  it("matches css/js case-insensitively", () => {
    expect(cacheControlForAssetsResponse("/_astro/a.Bcde.CSS", 200)).toBe(
      IMMUTABLE_ASSETS_CACHE_CONTROL,
    );
    expect(cacheControlForAssetsResponse("/_astro/a.Bcde.JS", 200)).toBe(
      IMMUTABLE_ASSETS_CACHE_CONTROL,
    );
  });
});

describe("isContentHashedAstroClientAsset", () => {
  it("mirrors positive and negative paths used for Cache-Control", () => {
    expect(isContentHashedAstroClientAsset("/_astro/BaseLayout.CJQGRb4G.css")).toBe(
      true,
    );
    expect(isContentHashedAstroClientAsset("/_astro/stable.css")).toBe(false);
    expect(isContentHashedAstroClientAsset("/_astro/foo.css")).toBe(false);
  });
});
