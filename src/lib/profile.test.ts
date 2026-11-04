import { describe, expect, it } from "vitest";
import { profileAbout, profileIntro } from "./profile";

describe("profile copy consistency", () => {
  it("resume about starts with shared hero intro", () => {
    expect(profileAbout.startsWith(profileIntro)).toBe(true);
  });

  it("resume about extends hero intro without duplicating it", () => {
    expect(profileAbout.length).toBeGreaterThan(profileIntro.length);
  });
});
