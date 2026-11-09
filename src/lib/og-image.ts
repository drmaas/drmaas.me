/** Default share image (checked in under `public/`). */
export const DEFAULT_OG_IMAGE_PATH = "/images/profile-hero.jpg";

/**
 * Resolves a frontmatter or page image to an absolute URL for Open Graph / Twitter scrapers.
 */
export function resolveOgImageUrl(
  siteOrigin: string,
  image?: string,
): string {
  const trimmed = image?.trim();
  const path =
    trimmed && trimmed.length > 0 ? trimmed : DEFAULT_OG_IMAGE_PATH;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const pathname = path.startsWith("/") ? path : `/${path}`;
  return new URL(pathname, siteOrigin).href;
}
