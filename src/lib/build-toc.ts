import type { MarkdownHeading } from "astro";

export interface TocItem extends MarkdownHeading {
  subheadings: TocItem[];
}

const sanitizeHeadingText = (text: string) =>
  text.replace("testa11y.sectionLink", "");

export const buildToc = (headings: MarkdownHeading[]): TocItem[] => {
  const toc: TocItem[] = [];
  const parentHeadings = new Map<number, TocItem>();
  headings.forEach((h) => {
    const heading: TocItem = {
      ...h,
      text: sanitizeHeadingText(h.text),
      subheadings: [],
    };
    for (const depth of [...parentHeadings.keys()]) {
      if (depth > heading.depth) {
        parentHeadings.delete(depth);
      }
    }
    parentHeadings.set(heading.depth, heading);
    // Change 2 to 1 if your markdown includes your <h1>
    if (heading.depth === 2) {
      toc.push(heading);
    } else {
      let parentDepth = heading.depth - 1;
      while (parentDepth >= 2) {
        const parent = parentHeadings.get(parentDepth);
        if (parent) {
          parent.subheadings.push(heading);
          break;
        }
        parentDepth -= 1;
      }
    }
  });
  return toc;
};
