// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { renderSearchResults, type SearchResult } from "./search-results";

function mountResults(results: SearchResult[]): HTMLElement {
  const container = document.createElement("div");
  renderSearchResults(container, results);
  return container;
}

describe("renderSearchResults", () => {
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

    expect(title?.textContent).toBe('<img src=x onerror="alert(1)"> & "quotes"');
    expect(paragraph?.textContent).toBe("<script>bad()</script>");
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("script")).toBeNull();
  });

  it("sets link href from result url", () => {
    const container = mountResults([
      {
        title: "Hello",
        url: "/articles/hello/",
        date: "Mon Jan 01 2024",
      },
    ]);
    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      "/articles/hello/",
    );
  });
});
