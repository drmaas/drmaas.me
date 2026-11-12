import { describe, expect, it } from "vitest";
import {
  htmlToSearchBodyText,
  SEARCH_BODY_MAX_LENGTH,
} from "./search-body-text";

describe("htmlToSearchBodyText", () => {
  it("strips tags and collapses whitespace", () => {
    const html = "<p>Hello   <strong>world</strong></p>\n<p>Second</p>";
    expect(htmlToSearchBodyText(html)).toBe("Hello world Second");
  });

  it("caps output at SEARCH_BODY_MAX_LENGTH", () => {
    const long = "word ".repeat(1_000);
    const html = `<p>${long}</p>`;
    const result = htmlToSearchBodyText(html);
    expect(result.length).toBe(SEARCH_BODY_MAX_LENGTH);
  });
});
