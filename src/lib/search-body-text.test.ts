import { describe, expect, it } from "vitest";
import {
  htmlToSearchBodyText,
  SEARCH_BODY_MAX_LENGTH,
} from "./search-body-text";

const EXPRESSIVE_CODE_FIXTURE = `
<p>Intro before code.</p>
<figure class="frame">
  <figcaption class="header">Diagram</figcaption>
  <pre data-language="plaintext"><code>
    <div class="ec-line">
      <div class="gutter"><div class="ln" aria-hidden="true">1</div></div>
      <div class="code"><span style="--0:#abb2bf">User Query</span></div>
    </div>
    <div class="ec-line">
      <div class="gutter"><div class="ln" aria-hidden="true">2</div></div>
      <div class="code"><span>↓</span></div>
    </div>
  </code></pre>
  <button type="button" title="Copy code">Copy</button>
</figure>
<p>After code.</p>
`;

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

  it("flattens expressive-code markup and drops gutter UI", () => {
    const result = htmlToSearchBodyText(EXPRESSIVE_CODE_FIXTURE);
    expect(result).toContain("Intro before code.");
    expect(result).toContain("User Query");
    expect(result).toContain("↓");
    expect(result).toContain("After code.");
    expect(result).not.toMatch(/<\w/);
    expect(result).not.toContain("ec-line");
    expect(result).not.toContain("Copy");
    expect(result).not.toContain("Diagram");
  });

  it("omits script and style contents", () => {
    const html = `<p>Visible</p><script>posthog.init('secret')</script>
      <style>.frame { color: red }</style><p>Also visible</p>`;
    const result = htmlToSearchBodyText(html);
    expect(result).toBe("Visible Also visible");
    expect(result).not.toContain("posthog");
    expect(result).not.toContain("color");
  });

  it("decodes HTML entities", () => {
    const html = "<p>Tom &amp; Jerry &#39;s &lt;lair&gt;</p>";
    expect(htmlToSearchBodyText(html)).toBe("Tom & Jerry 's <lair>");
  });

  it("applies length cap after cleaning", () => {
    const padding = "a".repeat(SEARCH_BODY_MAX_LENGTH);
    const html = `<script>x</script><p>${padding}EXTRA</p>`;
    const result = htmlToSearchBodyText(html);
    expect(result.length).toBe(SEARCH_BODY_MAX_LENGTH);
    expect(result).not.toContain("EXTRA");
  });
});
