import { describe, expect, it } from "vitest";
import { canonicalRedirectUrl, isProductionSiteHost } from "./canonical";

describe("isProductionSiteHost", () => {
  it("matches apex and www only", () => {
    expect(isProductionSiteHost("drmaas.me")).toBe(true);
    expect(isProductionSiteHost("www.drmaas.me")).toBe(true);
    expect(isProductionSiteHost("localhost")).toBe(false);
  });
});

describe("canonicalRedirectUrl", () => {
  it("redirects www to https apex", () => {
    expect(
      canonicalRedirectUrl(
        "https://www.drmaas.me/resume/",
        null,
      ),
    ).toBe("https://drmaas.me/resume/");
  });

  it("redirects http apex to https apex", () => {
    expect(
      canonicalRedirectUrl("http://drmaas.me/resume/", "http"),
    ).toBe("https://drmaas.me/resume/");
  });

  it("redirects http www to https apex", () => {
    expect(
      canonicalRedirectUrl("http://www.drmaas.me/about/", "http"),
    ).toBe("https://drmaas.me/about/");
  });

  it("leaves canonical https apex unchanged", () => {
    expect(
      canonicalRedirectUrl("https://drmaas.me/resume/", "https"),
    ).toBeNull();
  });

  it("does not redirect localhost", () => {
    expect(
      canonicalRedirectUrl("http://localhost:4321/resume/", null),
    ).toBeNull();
  });
});
