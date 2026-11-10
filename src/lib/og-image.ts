/** Default share image (checked in under `public/`). */
export const DEFAULT_OG_IMAGE_PATH = "/images/profile-hero.jpg";

/**
 * Resolves a frontmatter or page image to an absolute URL for Open Graph / Twitter scrapers.
 */
/** Frontmatter `image` passed through to BaseLayout when non-empty after trim. */
export function postShareImage(image?: string): string | undefined {
  return image?.trim() ? image : undefined;
}

export function resolveOgImageUrl(siteOrigin: string, image?: string): string {
  const trimmed = image?.trim();
  const path = trimmed && trimmed.length > 0 ? trimmed : DEFAULT_OG_IMAGE_PATH;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("//")) {
    return `https:${path}`;
  }

  const pathname = path.startsWith("/") ? path : `/${path}`;
  return new URL(pathname, siteOrigin).href;
}
