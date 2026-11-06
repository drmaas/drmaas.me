/**
 * Browser cache policy for Astro content-hashed assets under `/_astro/`.
 * Hashed filenames are immutable across deploys; long-lived caching avoids
 * revalidation round-trips. HTML and other responses keep ASSETS defaults.
 */
export const IMMUTABLE_ASSETS_CACHE_CONTROL =
  "public, max-age=31536000, immutable";

/**
 * Returns Cache-Control for ASSETS 200 responses that are fingerprinted
 * Astro build outputs (hashed `/_astro/` CSS/JS). Otherwise returns null
 * so upstream headers are unchanged.
 */
export function cacheControlForAssetsResponse(
  pathname: string,
  status: number,
): string | null {
  if (status !== 200) {
    return null;
  }
  if (!pathname.startsWith("/_astro/")) {
    return null;
  }
  const p = pathname.toLowerCase();
  if (p.endsWith(".css") || p.endsWith(".js")) {
    return IMMUTABLE_ASSETS_CACHE_CONTROL;
  }
  return null;
}
