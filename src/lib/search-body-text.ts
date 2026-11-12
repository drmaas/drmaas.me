import { parse } from "node-html-parser";

/** Plain-text cap for search index — keeps search.json size reasonable. */
export const SEARCH_BODY_MAX_LENGTH = 3_000;

export function htmlToSearchBodyText(
  html: string,
  maxLength = SEARCH_BODY_MAX_LENGTH,
): string {
  const collapsed = parse(html).text.replace(/\s+/g, " ").trim();
  if (collapsed.length <= maxLength) {
    return collapsed;
  }
  return collapsed.slice(0, maxLength);
}
