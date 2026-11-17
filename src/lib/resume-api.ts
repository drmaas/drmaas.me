const DEFAULT_RESUME_API_URL = "https://api.drmaas.me";

function resumeApiBaseUrl(): string {
  const fromEnv = import.meta.env.PUBLIC_RESUME_API_URL?.trim();
  const raw =
    fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_RESUME_API_URL;
  return raw.replace(/\/+$/, "");
}

/** Build a full URL for a resume API path (e.g. `/resume/increment`). */
export function resumeApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${resumeApiBaseUrl()}${normalized}`;
}