/** Per-IP fixed window: burst beyond this returns 429 until the window rolls. */
export const RATE_LIMIT_MAX_REQUESTS = 10;
export const RATE_LIMIT_WINDOW_MS = 60_000;

export class RateLimiter {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(): Promise<Response> {
    const now = Date.now();
    let windowStart =
      (await this.state.storage.get<number>("windowStart")) ?? now;
    let count = (await this.state.storage.get<number>("count")) ?? 0;

    if (now - windowStart >= RATE_LIMIT_WINDOW_MS) {
      windowStart = now;
      count = 0;
    }

    if (count >= RATE_LIMIT_MAX_REQUESTS) {
      const retryAfterSec = Math.ceil(
        (windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000,
      );
      return Response.json(
        { error: "Too Many Requests" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.max(retryAfterSec, 1)),
          },
        },
      );
    }

    await this.state.storage.put("windowStart", windowStart);
    await this.state.storage.put("count", count + 1);

    return Response.json({ allowed: true });
  }
}
