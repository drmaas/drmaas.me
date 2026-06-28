export { Counter } from "./counter.do";

export interface Env {
  COUNTER: DurableObjectNamespace<Counter>;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === "/resume/increment" && request.method === "POST") {
      const id = env.COUNTER.idFromName("global");
      const stub = env.COUNTER.get(id);
      const response = await stub.fetch(request);
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};