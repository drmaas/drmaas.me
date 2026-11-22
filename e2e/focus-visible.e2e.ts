import { type Locator, expect, test } from "@playwright/test";

type FocusMetrics = {
  outlineWidth: string;
  outlineStyle: string;
  boxShadow: string;
  twRingShadow: string;
};

async function focusKeyboardVisible(locator: Locator): Promise<void> {
  await locator.evaluate((node) => {
    if (node instanceof HTMLElement) {
      // Chromium testing API; not yet in lib.dom FocusOptions.
      node.focus(
        { focusVisible: true } as FocusOptions & { focusVisible?: boolean },
      );
    }
  });
}

async function blurElement(locator: Locator): Promise<void> {
  await locator.evaluate((node) => {
    if (node instanceof HTMLElement) {
      node.blur();
    }
  });
}

async function readFocusMetrics(locator: Locator): Promise<FocusMetrics> {
  return locator.evaluate((node) => {
    const cs = getComputedStyle(node);
    return {
      outlineWidth: cs.outlineWidth,
      outlineStyle: cs.outlineStyle,
      boxShadow: cs.boxShadow,
      twRingShadow: cs.getPropertyValue("--tw-ring-shadow").trim(),
    };
  });
}

function metricsKey(m: FocusMetrics): string {
  return `${m.outlineWidth}|${m.outlineStyle}|${m.boxShadow}|${m.twRingShadow}`;
}

function hasVisibleOutline(m: FocusMetrics): boolean {
  const width = Number.parseFloat(m.outlineWidth);
  return m.outlineStyle !== "none" && Number.isFinite(width) && width >= 1;
}

function hasVisibleRing(m: FocusMetrics): boolean {
  if (!m.twRingShadow || /^0 0 #0000/.test(m.twRingShadow)) {
    return false;
  }
  if (/0 0 0 calc\(0px \+ 0px\)/.test(m.twRingShadow)) {
    return false;
  }
  return /calc\([^)]*[1-9]/.test(m.twRingShadow) || /0 0 0 [1-9]/.test(m.twRingShadow);
}

async function expectSingleFocusChange(locator: Locator, label: string) {
  await blurElement(locator);
  const unfocused = await readFocusMetrics(locator);
  await focusKeyboardVisible(locator);
  const focused = await readFocusMetrics(locator);
  expect(metricsKey(focused), `${label} should show a focus style`).not.toBe(
    metricsKey(unfocused),
  );
  const indicators =
    (hasVisibleOutline(focused) ? 1 : 0) + (hasVisibleRing(focused) ? 1 : 0);
  expect(indicators, `${label} should have exactly one indicator`).toBe(1);
}

test.describe("keyboard focus indicators", () => {
  test("home CTA daisy buttons use outline only", async ({ page }) => {
    await page.goto("/");
    const resumeCta = page.locator('a.btn.btn-primary[href="/resume/"]').first();
    const aboutCta = page.locator('a.btn.btn-outline[href="/about/"]').first();
    await expectSingleFocusChange(resumeCta, "home primary CTA");
    await expectSingleFocusChange(aboutCta, "home outline CTA");
    await focusKeyboardVisible(resumeCta);
    const focused = await readFocusMetrics(resumeCta);
    expect(hasVisibleOutline(focused)).toBe(true);
    expect(hasVisibleRing(focused)).toBe(false);
  });

  test("pagination, resume PDF, scroll, footer link", async ({ page }) => {
    await page.goto("/articles/2/");
    const pagination = page.locator(".btn-group");
    const currentPage = pagination.locator('[aria-current="page"]');
    await expect(currentPage).toContainText("2");
    await expect(currentPage.locator(".sr-only")).toHaveText("(current page)");

    const pageLinks = pagination.locator("a.btn");
    await expect(pageLinks).not.toHaveCount(0);
    for (const link of await pageLinks.all()) {
      await link.focus();
      expect(await currentPage.evaluate((node) => node === document.activeElement)).toBe(
        false,
      );
    }

    const pageBtn = pageLinks.first();
    await expectSingleFocusChange(pageBtn, "pagination btn");

    await page.goto("/resume/");
    const pdfBtn = page.locator('a.btn[href*="Daniel_Maas_Resume"]').first();
    await expectSingleFocusChange(pdfBtn, "resume PDF btn");

    await page.goto("/");
    await page.evaluate(() =>
      document.querySelector<HTMLButtonElement>("#scrollButton")?.classList.remove("hidden"),
    );
    const scrollBtn = page.locator("#scrollButton");
    await expect(scrollBtn).toBeVisible();
    await expectSingleFocusChange(scrollBtn, "scroll to top");
    await focusKeyboardVisible(scrollBtn);
    const scrollFocused = await readFocusMetrics(scrollBtn);
    expect(hasVisibleRing(scrollFocused)).toBe(true);
    expect(hasVisibleOutline(scrollFocused)).toBe(false);

    const footerLink = page.locator("footer a.link.link-primary").first();
    await expectSingleFocusChange(footerLink, "footer link");
    await focusKeyboardVisible(footerLink);
    const footerFocused = await readFocusMetrics(footerLink);
    expect(hasVisibleOutline(footerFocused)).toBe(false);
    expect(hasVisibleRing(footerFocused)).toBe(true);
  });

  test("hamburger shows one indicator on the label when checkbox is tabbed", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const menuInput = page.locator("#nav-toggle input");
    const menuLabel = page.locator("#nav-toggle");

    await focusKeyboardVisible(menuInput);
    const labelFocused = await readFocusMetrics(menuLabel);
    const inputFocused = await readFocusMetrics(menuInput);

    expect(hasVisibleOutline(labelFocused)).toBe(true);
    expect(hasVisibleRing(inputFocused)).toBe(false);
    expect(hasVisibleOutline(inputFocused)).toBe(false);
    const combined =
      (hasVisibleOutline(labelFocused) ? 1 : 0) +
      (hasVisibleRing(inputFocused) ? 1 : 0) +
      (hasVisibleOutline(inputFocused) ? 1 : 0);
    expect(combined).toBe(1);
  });

  test("closed mobile drawer is out of tab order", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const navToggle = page.locator("#nav-toggle");
    const primaryNav = page.locator("#primary-nav");

    await expect(primaryNav).toHaveAttribute("inert");
    await expect(primaryNav).toHaveAttribute("aria-hidden", "true");

    await focusKeyboardVisible(navToggle.locator("input"));

    await page.keyboard.press("Tab");
    const activeAfterTab = await page.evaluate(() => {
      const active = document.activeElement;
      return active instanceof HTMLElement
        ? !!active.closest("#primary-nav")
        : false;
    });
    expect(activeAfterTab).toBe(false);

    await navToggle.click();
    await expect(primaryNav).toHaveAttribute("data-visible", "true");
    await expect(primaryNav).not.toHaveAttribute("inert");

    const firstNavLink = primaryNav.locator("a[href]").first();
    await expect(firstNavLink).toBeFocused();
  });
});