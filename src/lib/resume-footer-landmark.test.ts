import fs from "node:fs";
import path from "node:path";
import { Window } from "happy-dom";
import { describe, expect, it } from "vitest";

const distRoot = path.join(process.cwd(), "dist");
const distExists = fs.existsSync(distRoot);

function readResumePage(): string {
  const filePath = path.join(distRoot, "resume", "index.html");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing build output at ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function countFooterLandmarks(html: string): number {
  const window = new Window();
  const doc = window.document;
  doc.documentElement.innerHTML = html;
  return doc.querySelectorAll("footer").length;
}

describe("resume page footer landmarks (build output)", () => {
  it.skipIf(!distExists)("resume has exactly one footer landmark", () => {
    expect(countFooterLandmarks(readResumePage())).toBe(1);
  });
});