const PRODUCTION_ORIGIN = "https://drmaas.me";

export function isAllowedOrigin(origin: string): boolean {
  if (origin === PRODUCTION_ORIGIN) {
    return true;
  }

  try {
    const url = new URL(origin);
    return (
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
}

/** CORS headers for allowed origins; empty object when no Origin; null when origin is disallowed. */
export function corsHeadersForRequest(
  request: Request,
): Record<string, string> | null {
  const origin = request.headers.get("Origin");
  if (!origin) {
    return {};
  }
  if (!isAllowedOrigin(origin)) {
    return null;
  }
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    Vary: "Origin",
  };
}

export function appendCorsHeaders(
  headers: HeadersInit,
  cors: Record<string, string>,
): Headers {
  const merged = new Headers(headers);
  for (const [key, value] of Object.entries(cors)) {
    merged.set(key, value);
  }
  return merged;
}