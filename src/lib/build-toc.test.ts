import type { MarkdownHeading } from "astro";
import { describe, expect, it } from "vitest";
import { buildToc } from "./build-toc";

const heading = (
  slug: string,
  text: string,
  depth: number,
): MarkdownHeading => ({
  slug,
  text,
  depth,
});

describe("buildToc", () => {
  it("nests headings below h2", () => {
    const toc = buildToc([
      heading("intro", "Intro", 2),
      heading("details", "Details", 3),
      heading("outro", "Outro", 2),
    ]);

    expect(toc).toHaveLength(2);
    expect(toc[0].subheadings).toHaveLength(1);
    expect(toc[0].subheadings[0].slug).toBe("details");
  });

  it("strips test accessibility marker from heading text", () => {
    const toc = buildToc([heading("a", "Hello testa11y.sectionLink", 2)]);

    expect(toc[0].text).toBe("Hello ");
  });

  it("returns empty list when there are no h2 headings", () => {
    expect(buildToc([heading("only-h3", "Sub", 3)])).toEqual([]);
  });
});
