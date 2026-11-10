export const MAIN_ELEMENT_ID = "main";

export function isHashOnlyNavigation(fromUrl: URL, toUrl: URL): boolean {
  return (
    fromUrl.pathname === toUrl.pathname &&
    fromUrl.search === toUrl.search &&
    toUrl.hash !== "" &&
    fromUrl.hash !== toUrl.hash
  );
}

export function linkIndicatesHashOnlyNavigation(
  href: string,
  currentUrl: URL,
): boolean {
  if (href.startsWith("#")) {
    return true;
  }

  try {
    const target = new URL(href, currentUrl.href);
    return (
      target.pathname === currentUrl.pathname &&
      target.search === currentUrl.search &&
      target.hash !== ""
    );
  } catch {
    return false;
  }
}

export function shouldRestoreFocus(
  main: HTMLElement | null,
  activeElement: Element | null,
  options: { hashOnlyNavigation: boolean },
): boolean {
  if (!main) {
    return false;
  }
  if (options.hashOnlyNavigation) {
    return false;
  }
  if (activeElement instanceof HTMLElement && main.contains(activeElement)) {
    return false;
  }
  return true;
}

export function resolveFocusTarget(main: HTMLElement): HTMLElement {
  const heading = main.querySelector("h1");
  if (heading instanceof HTMLElement) {
    return heading;
  }
  if (!main.hasAttribute("tabindex")) {
    main.setAttribute("tabindex", "-1");
  }
  return main;
}

export function restoreFocusAfterViewTransition(
  main: HTMLElement | null,
  activeElement: Element | null,
  options: { hashOnlyNavigation: boolean },
): HTMLElement | null {
  if (!shouldRestoreFocus(main, activeElement, options)) {
    return null;
  }
  const target = resolveFocusTarget(main as HTMLElement);
  target.focus({ preventScroll: false });
  return target;
}

export function registerViewTransitionFocus(): void {
  if (document.documentElement.dataset.viewTransitionFocusBound === "true") {
    return;
  }
  document.documentElement.dataset.viewTransitionFocusBound = "true";

  let previousUrl = new URL(window.location.href);
  let pendingHashOnlyNavigation = false;

  const handleLinkClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const link = target.closest("a[href]");
    if (!(link instanceof HTMLAnchorElement)) {
      return;
    }
    const href = link.getAttribute("href");
    if (!href) {
      return;
    }
    pendingHashOnlyNavigation = linkIndicatesHashOnlyNavigation(
      href,
      new URL(window.location.href),
    );
  };

  const handleAfterSwap = () => {
    const currentUrl = new URL(window.location.href);
    const hashOnlyNavigation =
      pendingHashOnlyNavigation ||
      isHashOnlyNavigation(previousUrl, currentUrl);
    pendingHashOnlyNavigation = false;
    previousUrl = currentUrl;

    const main = document.getElementById(MAIN_ELEMENT_ID);
    restoreFocusAfterViewTransition(main, document.activeElement, {
      hashOnlyNavigation,
    });
  };

  document.addEventListener("click", handleLinkClick, true);
  document.addEventListener("astro:after-swap", handleAfterSwap);
}
