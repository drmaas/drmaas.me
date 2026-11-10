// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import {
  isHashOnlyNavigation,
  linkIndicatesHashOnlyNavigation,
  resolveFocusTarget,
  restoreFocusAfterViewTransition,
  shouldRestoreFocus,
} from "./view-transition-focus";

afterEach(() => {
  document.body.replaceChildren();
});

describe("isHashOnlyNavigation", () => {
  it("returns true when only the hash changes on the same page", () => {
    const from = new URL("https://drmaas.me/articles/foo/");
    const to = new URL("https://drmaas.me/articles/foo/#intro");
    expect(isHashOnlyNavigation(from, to)).toBe(true);
  });

  it("returns false for cross-page navigation", () => {
    const from = new URL("https://drmaas.me/");
    const to = new URL("https://drmaas.me/explore/");
    expect(isHashOnlyNavigation(from, to)).toBe(false);
  });

  it("returns false for cross-page navigation that includes a hash", () => {
    const from = new URL("https://drmaas.me/explore/");
    const to = new URL("https://drmaas.me/articles/hello/#intro");
    expect(isHashOnlyNavigation(from, to)).toBe(false);
  });

  it("returns false when the destination has no hash", () => {
    const from = new URL("https://drmaas.me/explore/");
    const to = new URL("https://drmaas.me/articles/hello/");
    expect(isHashOnlyNavigation(from, to)).toBe(false);
  });
});

describe("linkIndicatesHashOnlyNavigation", () => {
  const current = new URL("https://drmaas.me/articles/foo/");

  it("detects fragment-only href values", () => {
    expect(linkIndicatesHashOnlyNavigation("#intro", current)).toBe(true);
  });

  it("detects same-page links with a hash", () => {
    expect(
      linkIndicatesHashOnlyNavigation("/articles/foo/#section", current),
    ).toBe(true);
  });

  it("does not treat cross-page links as hash-only", () => {
    expect(linkIndicatesHashOnlyNavigation("/explore/", current)).toBe(false);
  });

  it("does not treat cross-page fragment links as hash-only", () => {
    expect(linkIndicatesHashOnlyNavigation("/explore/#search", current)).toBe(
      false,
    );
  });
});

describe("shouldRestoreFocus", () => {
  it("skips hash-only navigation", () => {
    const main = document.createElement("main");
    expect(
      shouldRestoreFocus(main, document.body, { hashOnlyNavigation: true }),
    ).toBe(false);
  });

  it("skips when focus is already inside main", () => {
    const main = document.createElement("main");
    const button = document.createElement("button");
    main.append(button);
    document.body.append(main);
    button.focus();
    expect(
      shouldRestoreFocus(main, document.activeElement, {
        hashOnlyNavigation: false,
      }),
    ).toBe(false);
  });

  it("restores when focus is outside main", () => {
    const main = document.createElement("main");
    const link = document.createElement("a");
    document.body.append(main, link);
    link.focus();
    expect(
      shouldRestoreFocus(main, document.activeElement, {
        hashOnlyNavigation: false,
      }),
    ).toBe(true);
  });
});

describe("resolveFocusTarget", () => {
  it("prefers the first h1 and makes it programmatically focusable", () => {
    const main = document.createElement("main");
    const h1 = document.createElement("h1");
    h1.textContent = "Title";
    main.append(h1);
    expect(h1.hasAttribute("tabindex")).toBe(false);
    expect(resolveFocusTarget(main)).toBe(h1);
    expect(h1.getAttribute("tabindex")).toBe("-1");
  });

  it("keeps an existing heading tabindex", () => {
    const main = document.createElement("main");
    const h1 = document.createElement("h1");
    h1.setAttribute("tabindex", "0");
    main.append(h1);
    expect(resolveFocusTarget(main)).toBe(h1);
    expect(h1.getAttribute("tabindex")).toBe("0");
  });

  it("falls back to main with tabindex -1 when no h1 exists", () => {
    const main = document.createElement("main");
    expect(resolveFocusTarget(main)).toBe(main);
    expect(main.getAttribute("tabindex")).toBe("-1");
  });

  it("prefers an existing cross-page fragment over the h1", () => {
    const main = document.createElement("main");
    const h1 = document.createElement("h1");
    const section = document.createElement("h2");
    section.id = "intro";
    main.append(h1, section);
    document.body.append(main);

    expect(resolveFocusTarget(main, "#intro")).toBe(section);
    expect(section.getAttribute("tabindex")).toBe("-1");
    expect(h1.hasAttribute("tabindex")).toBe(false);
  });

  it("decodes a percent-encoded fragment id", () => {
    const main = document.createElement("main");
    const h1 = document.createElement("h1");
    const section = document.createElement("h2");
    section.id = "hello world";
    main.append(h1, section);
    document.body.append(main);

    expect(resolveFocusTarget(main, "#hello%20world")).toBe(section);
    expect(section.getAttribute("tabindex")).toBe("-1");
  });

  it("keeps an existing tabindex on a fragment target", () => {
    const main = document.createElement("main");
    const h1 = document.createElement("h1");
    const section = document.createElement("h2");
    section.id = "kept";
    section.setAttribute("tabindex", "0");
    main.append(h1, section);
    document.body.append(main);

    expect(resolveFocusTarget(main, "#kept")).toBe(section);
    expect(section.getAttribute("tabindex")).toBe("0");
  });

  it("does not add tabindex to a natively focusable fragment", () => {
    const main = document.createElement("main");
    const h1 = document.createElement("h1");
    const link = document.createElement("a");
    link.id = "named-link";
    link.href = "/articles/foo/#named-link";
    main.append(h1, link);
    document.body.append(main);

    expect(resolveFocusTarget(main, "#named-link")).toBe(link);
    expect(link.hasAttribute("tabindex")).toBe(false);
  });

  it("falls back to the h1 when the fragment is missing", () => {
    const main = document.createElement("main");
    const h1 = document.createElement("h1");
    main.append(h1);
    document.body.append(main);

    expect(resolveFocusTarget(main, "#missing")).toBe(h1);
    expect(h1.getAttribute("tabindex")).toBe("-1");
  });

  it("falls back to the h1 when the fragment id cannot be decoded", () => {
    const main = document.createElement("main");
    const h1 = document.createElement("h1");
    main.append(h1);
    document.body.append(main);

    expect(resolveFocusTarget(main, "#%")).toBe(h1);
    expect(h1.getAttribute("tabindex")).toBe("-1");
  });
});

describe("restoreFocusAfterViewTransition", () => {
  it("adds tabindex -1 before focusing the article heading", () => {
    const main = document.createElement("main");
    main.id = "main";
    const h1 = document.createElement("h1");
    h1.textContent = "Article";
    main.append(h1);
    const navLink = document.createElement("a");
    navLink.href = "/articles/x/";
    document.body.append(navLink, main);
    navLink.focus();

    // happy-dom focuses a heading with no tabindex, so activeElement alone
    // stays green on the old code. The attribute at focus() time does not.
    let tabindexWhenFocused: string | null = null;
    const focus = h1.focus.bind(h1);
    h1.focus = (options?: FocusOptions) => {
      tabindexWhenFocused = h1.getAttribute("tabindex");
      focus(options);
    };

    const target = restoreFocusAfterViewTransition(
      main,
      document.activeElement,
      { hashOnlyNavigation: false },
    );

    expect(target).toBe(h1);
    expect(tabindexWhenFocused).toBe("-1");
    expect(h1.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(h1);
  });

  it("focuses a cross-page fragment target when it exists", () => {
    const main = document.createElement("main");
    const h1 = document.createElement("h1");
    const section = document.createElement("h2");
    section.id = "details";
    main.append(h1, section);
    const navLink = document.createElement("a");
    document.body.append(navLink, main);
    navLink.focus();

    const target = restoreFocusAfterViewTransition(
      main,
      document.activeElement,
      { hashOnlyNavigation: false, hash: "#details" },
    );

    expect(target).toBe(section);
    expect(section.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(section);
  });

  it("does not steal focus on hash-only navigation", () => {
    const main = document.createElement("main");
    const h1 = document.createElement("h1");
    const section = document.createElement("h2");
    section.id = "intro";
    main.append(h1, section);
    document.body.append(main);

    const target = restoreFocusAfterViewTransition(main, document.body, {
      hashOnlyNavigation: true,
      hash: "#intro",
    });

    expect(target).toBeNull();
    expect(section.hasAttribute("tabindex")).toBe(false);
    expect(h1.hasAttribute("tabindex")).toBe(false);
  });
});
