import { describe, expect, it } from "vitest";
import { shouldIncrementResumeCounter } from "./resume-visitor-counter";

describe("shouldIncrementResumeCounter", () => {
  it("returns true for the resume route with trailing slash", () => {
    expect(shouldIncrementResumeCounter("/resume/")).toBe(true);
  });

  it("returns true for /resume without trailing slash", () => {
    expect(shouldIncrementResumeCounter("/resume")).toBe(true);
  });

  it("returns false for other site routes", () => {
    expect(shouldIncrementResumeCounter("/about/")).toBe(false);
    expect(shouldIncrementResumeCounter("/")).toBe(false);
    expect(shouldIncrementResumeCounter("/posts/some-slug/")).toBe(false);
  });

  it("returns false for paths under /resume/ that are not the resume page", () => {
    expect(shouldIncrementResumeCounter("/resume/archive/")).toBe(false);
  });
});