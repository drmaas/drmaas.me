import { describe, expect, it } from "vitest";
import { activeLinkForTopicPathname } from "./active-link";

describe("activeLinkForTopicPathname", () => {
  it("returns nav link for topics in primary nav", () => {
    expect(activeLinkForTopicPathname("/topics/media/")).toBe("topics/media");
    expect(activeLinkForTopicPathname("/topics/media")).toBe("topics/media");
  });

  it("returns empty string for topics without a nav item", () => {
    expect(activeLinkForTopicPathname("/topics/disclaimer/")).toBe("");
    expect(activeLinkForTopicPathname("/topics/links/")).toBe("");
  });

  it("returns empty string for non-topic paths", () => {
    expect(activeLinkForTopicPathname("/articles/")).toBe("");
    expect(activeLinkForTopicPathname("/")).toBe("");
  });
});