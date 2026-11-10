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
    parentHeadings.set(heading.depth, heading);
    // Change 2 to 1 if your markdown includes your <h1>
    if (heading.depth === 2) {
      toc.push(heading);
    } else {
      parentHeadings.get(heading.depth - 1)?.subheadings.push(heading);
    }
  });
  return toc;
};
