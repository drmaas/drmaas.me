export interface SearchResult {
  title: string;
  url: string;
  date: string;
  description?: string;
  /** Plain-text excerpt for Fuse matching only; not rendered in result cards. */
  body?: string;
}

export interface RenderSearchResultsOptions {
  query?: string;
  statusElement?: HTMLElement | null;
  /** Debounce screen-reader status updates (ms). Use 0 in tests. */
  statusDebounceMs?: number;
}

/** Status text for the Explore search aria-live region. */
export function formatSearchStatus(count: number, query: string): string {
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    if (count === 0) {
      return "No articles";
    }
    if (count === 1) {
      return "Showing 1 article";
    }
    return `Showing all ${count} articles`;
  }
  if (count === 0) {
    return "No articles match your search";
  }
  if (count === 1) {
    return "1 result";
  }
  return `${count} results`;
}

let statusDebounceTimer: ReturnType<typeof setTimeout> | undefined;

function scheduleSearchStatusUpdate(
  statusElement: HTMLElement,
  text: string,
  debounceMs: number,
): void {
  clearTimeout(statusDebounceTimer);
  if (debounceMs <= 0) {
    statusElement.textContent = text;
    return;
  }
  statusDebounceTimer = setTimeout(() => {
    statusElement.textContent = text;
  }, debounceMs);
}

function createResultCard(result: SearchResult): HTMLElement {
  const card = document.createElement("div");
  card.className =
    "card bg-base-200 w-full shadow-lg hover:shadow-xl transition-shadow duration-200";

  const body = document.createElement("div");
  body.className = "card-body";

  const link = document.createElement("a");
  link.href = result.url;
  link.className =
    "no-underline text-primary hover:text-primary-focus transition-colors duration-200";

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
  options?: RenderSearchResultsOptions,
): void {
  container.replaceChildren(
    ...results.map((result) => createResultCard(result)),
  );

  const statusElement = options?.statusElement;
  if (statusElement) {
    const statusText = formatSearchStatus(
      results.length,
      options.query ?? "",
    );
    scheduleSearchStatusUpdate(
      statusElement,
      statusText,
      options.statusDebounceMs ?? 150,
    );
  }
}
