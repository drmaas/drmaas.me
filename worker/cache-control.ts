/**
 * Browser cache policy for Astro content-hashed assets under `/_astro/`.
 * Hashed filenames are immutable across deploys; long-lived caching avoids
 * revalidation round-trips. HTML and other responses keep ASSETS defaults.
 */
export const IMMUTABLE_ASSETS_CACHE_CONTROL =
  "public, max-age=31536000, immutable";

/** Vite content hashes are alphanumeric; min length filters short decoys like `xyz`. */
const ASTRO_HASH_SEGMENT = /^[a-zA-Z0-9_-]{4,}$/;

/**
 * Vite/Astro emits fingerprinted bundles as `name.<contentHash>.css|js`.
 * Stable entry names (e.g. `stable.css`) are not content-addressed and must
 * not get `immutable`.
 */
export function isContentHashedAstroClientAsset(pathname: string): boolean {
  if (!pathname.startsWith("/_astro/")) {
    return false;
  }
  const base = pathname.slice(pathname.lastIndexOf("/") + 1);
  const parts = base.split(".");
  if (parts.length < 3) {
    return false;
  }
  const ext = parts[parts.length - 1].toLowerCase();
  if (ext !== "css" && ext !== "js") {
    return false;
  }
  const hashSegment = parts[parts.length - 2];
  const lcHash = hashSegment.toLowerCase();
  if (lcHash === "stable") {
    return false;
  }
  if (!ASTRO_HASH_SEGMENT.test(hashSegment)) {
    return false;
  }
  const name = parts.slice(0, -2).join(".");
  if (name.length === 0 || name.toLowerCase() === "stable") {
    return false;
  }
  return true;
}

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
  if (isContentHashedAstroClientAsset(pathname)) {
    return IMMUTABLE_ASSETS_CACHE_CONTROL;
  }
  return null;
}
