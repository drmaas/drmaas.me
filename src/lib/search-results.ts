export interface SearchResult {
  title: string;
  url: string;
  date: string;
  description?: string;
  /** Plain-text excerpt for Fuse matching only; not rendered in result cards. */
  body?: string;
}

function createResultCard(result: SearchResult): HTMLElement {
  const card = document.createElement("div");
  card.className =
    "card bg-base-200 w-full shadow-lg hover:shadow-xl transition-shadow duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-secondary";

  const body = document.createElement("div");
  body.className = "card-body";

  const link = document.createElement("a");
  link.href = result.url;
  link.className =
    "no-underline text-cyan-600 hover:text-black dark:hover:text-white";

  const title = document.createElement("h2");
  title.className = "card-title";
  title.textContent = result.title;
  link.append(title);

  const dateSpan = document.createElement("span");
  dateSpan.className = "text-sm opacity-70";
  dateSpan.textContent = result.date;

  const description = document.createElement("p");
  description.className = "line-clamp-4 md:line-clamp-3";
  description.textContent = result.description ?? "";

  body.append(link, dateSpan, description);
  card.append(body);
  return card;
}

/** Clears `container` and appends one card per result using safe text nodes. */
export function renderSearchResults(
  container: HTMLElement,
  results: SearchResult[],
): void {
  container.replaceChildren(
    ...results.map((result) => createResultCard(result)),
  );
}
