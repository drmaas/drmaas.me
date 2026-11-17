import { afterEach, describe, expect, it, vi } from "vitest";
import { resumeApiUrl } from "./resume-api";

describe("resumeApiUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults to production resume increment URL", () => {
    vi.unstubAllEnvs();
    expect(resumeApiUrl("/resume/increment")).toBe(
      "https://api.drmaas.me/resume/increment",
    );
  });

  it("trims trailing slashes on the base URL", () => {
    vi.stubEnv("PUBLIC_RESUME_API_URL", "http://127.0.0.1:8787/");
    expect(resumeApiUrl("/resume/increment")).toBe(
      "http://127.0.0.1:8787/resume/increment",
    );
  });

  it("joins paths without a leading slash", () => {
    vi.stubEnv("PUBLIC_RESUME_API_URL", "http://127.0.0.1:8787");
    expect(resumeApiUrl("resume/increment")).toBe(
      "http://127.0.0.1:8787/resume/increment",
    );
  });
});