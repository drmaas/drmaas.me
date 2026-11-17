import fs from "node:fs";
import path from "node:path";
import { Window } from "happy-dom";
import { describe, expect, it } from "vitest";

/** Slug of a long-lived published post used for build-output nav checks. */
const SAMPLE_ARTICLE_SLUG = "2-years-in-sf";

const distRoot = path.join(process.cwd(), "dist");
const distExists = fs.existsSync(distRoot);

function readBuiltPage(...segments: string[]): string {
  if (segments.length === 0) {
    return fs.readFileSync(path.join(distRoot, "index.html"), "utf8");
  }
  const filePath = path.join(distRoot, ...segments, "index.html");
  const flatPath = path.join(distRoot, ...segments);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf8");
  }
  if (fs.existsSync(flatPath)) {
    return fs.readFileSync(flatPath, "utf8");
  }
  throw new Error(`Missing build output at ${filePath} or ${flatPath}`);
}

function countAriaCurrentInPrimaryNav(html: string): number {
  const window = new Window();
  const doc = window.document;
  doc.documentElement.innerHTML = html;
  const nav = doc.getElementById("primary-nav");
  if (!nav) {
    throw new Error("expected #primary-nav in built HTML");
  }
  return nav.querySelectorAll('[aria-current="page"]').length;
}

describe("primary nav aria-current (build output)", () => {
  it.skipIf(!distExists)("home has exactly one aria-current=page in #primary-nav", () => {
    expect(countAriaCurrentInPrimaryNav(readBuiltPage())).toBe(1);
  });

  it.skipIf(!distExists)("about has exactly one aria-current=page in #primary-nav", () => {
    expect(countAriaCurrentInPrimaryNav(readBuiltPage("about"))).toBe(1);
  });

  it.skipIf(!distExists)("explore has exactly one aria-current=page in #primary-nav", () => {
    expect(countAriaCurrentInPrimaryNav(readBuiltPage("explore"))).toBe(1);
  });

  it.skipIf(!distExists)(
    "articles index has exactly one aria-current=page in #primary-nav",
    () => {
      expect(countAriaCurrentInPrimaryNav(readBuiltPage("articles"))).toBe(1);
    },
  );

  it.skipIf(!distExists)(
    "article detail has exactly one aria-current=page in #primary-nav",
    () => {
      expect(
        countAriaCurrentInPrimaryNav(
          readBuiltPage("articles", SAMPLE_ARTICLE_SLUG),
        ),
      ).toBe(1);
    },
  );

  it.skipIf(!distExists)(
    "topic page with nav item has exactly one aria-current=page in #primary-nav",
    () => {
      expect(countAriaCurrentInPrimaryNav(readBuiltPage("topics", "media"))).toBe(
        1,
      );
    },
  );

  it.skipIf(!distExists)("resume has exactly one aria-current=page in #primary-nav", () => {
    expect(countAriaCurrentInPrimaryNav(readBuiltPage("resume"))).toBe(1);
  });

  it.skipIf(!distExists)("404 has zero aria-current=page in #primary-nav", () => {
    const html = fs.readFileSync(path.join(distRoot, "404.html"), "utf8");
    expect(countAriaCurrentInPrimaryNav(html)).toBe(0);
  });
});