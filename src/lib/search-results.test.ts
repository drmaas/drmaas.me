// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatSearchStatus,
  renderSearchResults,
  type SearchResult,
} from "./search-results";

function mountResults(
  results: SearchResult[],
  options?: Parameters<typeof renderSearchResults>[2],
): HTMLElement {
  const container = document.createElement("div");
  renderSearchResults(container, results, options);
  return container;
}

describe("formatSearchStatus", () => {
  it("describes the full list when the query is empty", () => {
    expect(formatSearchStatus(0, "")).toBe("No articles");
    expect(formatSearchStatus(1, "")).toBe("Showing 1 article");
    expect(formatSearchStatus(12, "")).toBe("Showing all 12 articles");
    expect(formatSearchStatus(3, "   ")).toBe("Showing all 3 articles");
  });

  it("describes filtered matches", () => {
    expect(formatSearchStatus(0, "astro")).toBe(
      "No articles match your search",
    );
    expect(formatSearchStatus(1, "astro")).toBe("1 result");
    expect(formatSearchStatus(5, "astro")).toBe("5 results");
  });
});

describe("renderSearchResults", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders title and description as plain text", () => {
    const malicious: SearchResult = {
      title: '<img src=x onerror="alert(1)"> & "quotes"',
      url: "/articles/x/",
      date: "Mon Jan 01 2024",
      description: "<script>bad()</script>",
    };

    const container = mountResults([malicious]);
    const title = container.querySelector("h2");
    const paragraph = container.querySelector("p");

    expect(title?.textContent).toBe(
      '<img src=x onerror="alert(1)"> & "quotes"',
    );
    expect(paragraph?.textContent).toBe("<script>bad()</script>");
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("script")).toBeNull();
  });

  it("sets link href and theme-aware title classes", () => {
    const container = mountResults([
      {
        title: "Hello",
        url: "/articles/hello/",
        date: "Mon Jan 01 2024",
      },
    ]);
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/articles/hello/");
    expect(link?.className).toContain("text-primary");
    expect(link?.className).toContain("hover:text-primary-focus");
  });

  it("updates the status region when provided", () => {
    vi.useFakeTimers();
    const status = document.createElement("p");
    mountResults([], {
      query: "nope",
      statusElement: status,
      statusDebounceMs: 0,
    });
    expect(status.textContent).toBe("No articles match your search");

    const status2 = document.createElement("p");
    mountResults([{ title: "A", url: "/a/", date: "d" }], {
      query: "",
      statusElement: status2,
      statusDebounceMs: 0,
    });
    expect(status2.textContent).toBe("Showing 1 article");
  });

  it("debounces status updates by default", () => {
    vi.useFakeTimers();
    const status = document.createElement("p");
    mountResults([{ title: "A", url: "/a/", date: "d" }], {
      query: "a",
      statusElement: status,
    });
    expect(status.textContent).toBe("");
    vi.advanceTimersByTime(150);
    expect(status.textContent).toBe("1 result");
  });

  it("leaves status empty on initial render when announce is false, then updates on user query", () => {
    vi.useFakeTimers();
    const status = document.createElement("p");
    const sample: SearchResult = {
      title: "Hello",
      url: "/articles/hello/",
      date: "Mon Jan 01 2024",
    };
    mountResults([sample, sample], {
      query: "",
      statusElement: status,
      statusDebounceMs: 0,
      announce: false,
    });
    expect(status.textContent).toBe("");

    mountResults([sample], {
      query: "hello",
      statusElement: status,
      statusDebounceMs: 0,
    });
    expect(status.textContent).toBe("1 result");
  });
});
