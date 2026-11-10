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

  it("nests a skipped level under the nearest stored ancestor", () => {
    const toc = buildToc([
      heading("section", "Section", 2),
      heading("subsubsection", "Subsubsection", 4),
    ]);

    expect(toc).toHaveLength(1);
    expect(toc[0].subheadings).toHaveLength(1);
    expect(toc[0].subheadings[0].slug).toBe("subsubsection");
    expect(toc[0].subheadings[0].depth).toBe(4);
  });

  it("reparents after a shallower heading clears a stale deeper parent", () => {
    const toc = buildToc([
      heading("one", "One", 2),
      heading("one-a", "One A", 3),
      heading("two", "Two", 2),
      heading("two-skip", "Two skip", 4),
    ]);

    expect(toc).toHaveLength(2);
    expect(toc[0].subheadings.map((h) => h.slug)).toEqual(["one-a"]);
    expect(toc[1].subheadings.map((h) => h.slug)).toEqual(["two-skip"]);
  });
});
