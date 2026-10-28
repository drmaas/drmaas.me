import {
  appendCorsHeaders,
  corsHeadersForRequest,
  isAllowedOrigin,
} from "./cors";

export { Counter } from "./counter.do";
export { RateLimiter } from "./rateLimiter.do";

export interface Env {
  COUNTER: DurableObjectNamespace;
  RATE_LIMITER: DurableObjectNamespace;
}

function clientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") ?? "unknown";
}

function jsonWithCors(
  request: Request,
  body: unknown,
  status: number,
  extraHeaders?: HeadersInit,
): Response {
  const cors = corsHeadersForRequest(request) ?? {};
  const base = new Headers(extraHeaders);
  base.set("Content-Type", "application/json");
  const headers = appendCorsHeaders(base, cors);
  return new Response(JSON.stringify(body), { status, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      const cors = corsHeadersForRequest(request);
      if (cors === null) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);

    if (url.pathname === "/resume/increment" && request.method === "POST") {
      const origin = request.headers.get("Origin");
      if (origin && !isAllowedOrigin(origin)) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      const rateLimitId = env.RATE_LIMITER.idFromName(clientIp(request));
      const rateLimitStub = env.RATE_LIMITER.get(rateLimitId);
      const rateLimitResponse = await rateLimitStub.fetch(
        new Request("https://rate-limit/check", { method: "POST" }),
      );

      if (rateLimitResponse.status === 429) {
        const data = await rateLimitResponse.json();
        return jsonWithCors(request, data, 429, rateLimitResponse.headers);
      }

      const id = env.COUNTER.idFromName("global");
      const stub = env.COUNTER.get(id);
      const response = await stub.fetch(request);
      const data = await response.json();
      return jsonWithCors(request, data, response.status);
    }

    return new Response("Not Found", { status: 404 });
  },
};
