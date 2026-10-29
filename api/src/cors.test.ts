import { describe, expect, it } from "vitest";
import { corsHeadersForRequest, isAllowedOrigin } from "./cors";

describe("isAllowedOrigin", () => {
  it("allows production site", () => {
    expect(isAllowedOrigin("https://drmaas.me")).toBe(true);
  });

  it("allows local dev on localhost", () => {
    expect(isAllowedOrigin("http://localhost:4321")).toBe(true);
    expect(isAllowedOrigin("http://127.0.0.1:8787")).toBe(true);
  });

  it("rejects other origins", () => {
    expect(isAllowedOrigin("https://evil.example")).toBe(false);
    expect(isAllowedOrigin("https://www.drmaas.me")).toBe(false);
  });
});

describe("corsHeadersForRequest", () => {
  it("reflects allowed origin", () => {
    const request = new Request("https://api.drmaas.me/resume/increment", {
      headers: { Origin: "https://drmaas.me" },
    });
    const headers = corsHeadersForRequest(request);
    expect(headers).toMatchObject({
      "Access-Control-Allow-Origin": "https://drmaas.me",
    });
  });

  it("returns null for disallowed origin", () => {
    const request = new Request("https://api.drmaas.me/resume/increment", {
      headers: { Origin: "https://evil.example" },
    });
    expect(corsHeadersForRequest(request)).toBeNull();
  });

  it("returns empty object when Origin is absent", () => {
    const request = new Request("https://api.drmaas.me/resume/increment", {
      method: "POST",
    });
    expect(corsHeadersForRequest(request)).toEqual({});
  });
});
