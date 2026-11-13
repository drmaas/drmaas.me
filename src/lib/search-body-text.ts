import { Window } from "happy-dom";

/** Plain-text cap for search index — keeps search.json size reasonable. */
export const SEARCH_BODY_MAX_LENGTH = 3_000;

const entityDecodeWindow = new Window();

function decodeHtmlEntities(text: string): string {
  const el = entityDecodeWindow.document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

const SCRIPT_BLOCK = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gis;
const STYLE_BLOCK = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gis;
/** expressive-code line-number gutter (not searchable content). */
const EC_GUTTER =
  /<div class="gutter">[\s\S]*?<\/div>\s*(?=<div class="code">)/gi;

/**
 * Turn post HTML into plain text for Fuse.js. Strips scripts, styles, tags,
 * and expressive-code chrome; decodes entities; then applies length cap.
 */
export function htmlToSearchBodyText(
  html: string,
  maxLength = SEARCH_BODY_MAX_LENGTH,
): string {
  let cleaned = html
    .replace(SCRIPT_BLOCK, "")
    .replace(STYLE_BLOCK, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<button\b[^>]*>[\s\S]*?<\/button>/gi, "")
    .replace(/<figcaption\b[^>]*>[\s\S]*?<\/figcaption>/gi, "")
    .replace(EC_GUTTER, "");
  cleaned = cleaned.replace(/<[^>]+>/g, " ");
  cleaned = decodeHtmlEntities(cleaned);
  const collapsed = cleaned.replace(/\s+/g, " ").trim();
  if (collapsed.length <= maxLength) {
    return collapsed;
  }
  return collapsed.slice(0, maxLength);
}
