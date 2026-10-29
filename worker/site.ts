import {
  canonicalRedirectUrl,
  HSTS_VALUE,
  isProductionSiteHost,
} from "./canonical";

export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const redirectTarget = canonicalRedirectUrl(
      request.url,
      request.headers.get("X-Forwarded-Proto"),
    );
    if (redirectTarget) {
      return Response.redirect(redirectTarget, 301);
    }

    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);

    if (!isProductionSiteHost(url.hostname)) {
      return response;
    }

    const headers = new Headers(response.headers);
    headers.set("Strict-Transport-Security", HSTS_VALUE);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
