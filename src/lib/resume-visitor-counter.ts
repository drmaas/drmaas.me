/** Resume page path with trailing slash (matches `trailingSlash: "always"`). */
const RESUME_PATHNAME = "/resume/";

/**
 * Whether the visitor counter should POST on this navigation.
 * ClientRouter keeps `document` listeners alive across routes; gate on pathname.
 */
export function shouldIncrementResumeCounter(pathname: string): boolean {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return normalized === RESUME_PATHNAME;
}