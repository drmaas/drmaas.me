import { describe, expect, it } from "vitest";
import {
  IMMUTABLE_ASSETS_CACHE_CONTROL,
  cacheControlForAssetsResponse,
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
    expect(cacheControlForAssetsResponse("/_astro/a.Bcd.CSS", 200)).toBe(
      IMMUTABLE_ASSETS_CACHE_CONTROL,
    );
    expect(cacheControlForAssetsResponse("/_astro/a.Bcd.JS", 200)).toBe(
      IMMUTABLE_ASSETS_CACHE_CONTROL,
    );
  });
});
