import { describe, expect, it } from "vitest";
import {
  metaDescriptionMaxLength,
  profileAbout,
  profileHomeMetaDescription,
  profileIntro,
  trimToMetaDescription,
} from "./profile";

describe("profile copy consistency", () => {
  it("resume about starts with shared hero intro", () => {
    expect(profileAbout.startsWith(profileIntro)).toBe(true);
  });

  it("resume about extends hero intro without duplicating it", () => {
    expect(profileAbout.length).toBeGreaterThan(profileIntro.length);
  });
});

describe("trimToMetaDescription", () => {
  it("returns short text unchanged", () => {
    expect(trimToMetaDescription("Hello world")).toBe("Hello world");
  });

  it("truncates at a word boundary without exceeding max length", () => {
    const long =
      "word ".repeat(50).trim() +
      " extra tokens that should not appear in the snippet";
    expect(trimToMetaDescription(long).length).toBeLessThanOrEqual(
      metaDescriptionMaxLength,
    );
    expect(trimToMetaDescription(long).endsWith(" ")).toBe(false);
  });

  it("home meta description uses hero intro and stays within limit", () => {
    const description = profileHomeMetaDescription();
    expect(description).not.toBe("My blog");
    expect(description.startsWith(profileIntro.slice(0, 20))).toBe(true);
    expect(description.length).toBeLessThanOrEqual(metaDescriptionMaxLength);
  });
});
