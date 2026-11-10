// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import {
  isHashOnlyNavigation,
  linkIndicatesHashOnlyNavigation,
  resolveFocusTarget,
  restoreFocusAfterViewTransition,
  shouldRestoreFocus,
} from "./view-transition-focus";

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
  it("prefers the first h1 inside main", () => {
    const main = document.createElement("main");
    const h1 = document.createElement("h1");
    h1.textContent = "Title";
    main.append(h1);
    expect(resolveFocusTarget(main)).toBe(h1);
  });

  it("falls back to main with tabindex -1 when no h1 exists", () => {
    const main = document.createElement("main");
    expect(resolveFocusTarget(main)).toBe(main);
    expect(main.getAttribute("tabindex")).toBe("-1");
  });
});

describe("restoreFocusAfterViewTransition", () => {
  it("focuses the article heading after a transition", () => {
    const main = document.createElement("main");
    main.id = "main";
    const h1 = document.createElement("h1");
    h1.textContent = "Article";
    main.append(h1);
    const navLink = document.createElement("a");
    navLink.href = "/articles/x/";
    document.body.append(navLink, main);
    navLink.focus();

    const target = restoreFocusAfterViewTransition(
      main,
      document.activeElement,
      { hashOnlyNavigation: false },
    );

    expect(target).toBe(h1);
    expect(document.activeElement).toBe(h1);
  });
});
