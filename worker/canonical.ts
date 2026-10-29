export const HSTS_VALUE = "max-age=31536000; includeSubDomains";

const CANONICAL_HOST = "drmaas.me";

export function isProductionSiteHost(hostname: string): boolean {
  return hostname === CANONICAL_HOST || hostname === "www.drmaas.me";
}

/**
 * Returns a 301 target URL when the request should be canonicalized to HTTPS apex.
 * Returns null when no redirect is needed.
 */
export function canonicalRedirectUrl(
  requestUrl: string,
  forwardedProto: string | null,
): string | null {
  const url = new URL(requestUrl);

  if (!isProductionSiteHost(url.hostname)) {
    return null;
  }

  let changed = false;

  if (url.hostname === "www.drmaas.me") {
    url.hostname = CANONICAL_HOST;
    changed = true;
  }

  const isHttp =
    forwardedProto === "http" ||
    (forwardedProto === null && url.protocol === "http:");

  if (isHttp) {
    url.protocol = "https:";
    changed = true;
  }

  return changed ? url.toString() : null;
}
