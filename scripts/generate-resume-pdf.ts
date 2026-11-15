/**
 * Build public/docs/Daniel_Maas_Resume.pdf from src/lib/profile.ts.
 * Run: pnpm resume:pdf
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  resumeCertifications,
  resumeContact,
  resumeEducation,
  resumeExperience,
  resumePdfCompetencies,
  resumePdfDetailedCompanyCount,
  resumePdfHighlights,
  resumePdfSummary,
  resumePdfTagline,
  resumePublications,
  type ExperienceEntry,
} from "../src/lib/profile.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPdf = join(root, "public/docs/Daniel_Maas_Resume.pdf");
const tmpDir = join(root, ".tmp/resume-pdf");
const tmpHtml = join(tmpDir, "resume.html");

function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function contactLine(): string {
  const order = ["Email", "LinkedIn", "Consulting", "Website", "Location"];
  const byLabel = new Map(resumeContact.map((c) => [c.label, c.value]));
  return order
    .map((label) => byLabel.get(label))
    .filter(Boolean)
    .join(" &nbsp;|&nbsp; ");
}

function jobTitle(entry: ExperienceEntry): string {
  // Title already names the company (e.g. Founder … Maas Technologies LLC).
  if (
    entry.company === "Self-Employed" ||
    entry.title.includes(entry.company)
  ) {
    return entry.title;
  }
  const title = entry.title.replace(/\s+[—–-]\s+/, ", ");
  return `${title} — ${entry.company}`;
}

function jobLocation(entry: ExperienceEntry): string | undefined {
  if (entry.company === "Self-Employed" || /Maas Technologies/i.test(entry.title)) {
    return `maas.build · ${entry.location ?? "North America"}`;
  }
  return entry.location;
}

function renderBullets(entry: ExperienceEntry): string {
  if (entry.bullets?.length) {
    return `<ul>${entry.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;
  }
  if (entry.description) {
    return `<ul><li>${esc(entry.description)}</li></ul>`;
  }
  if (entry.subRoles?.length) {
    const lines = entry.subRoles.flatMap((r) => r.bullets);
    return `<ul>${lines.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;
  }
  return "";
}

function renderDetailedJob(entry: ExperienceEntry): string {
  const loc = jobLocation(entry);
  return `
  <div class="job">
    <div class="job-head">
      <div class="job-title">${esc(jobTitle(entry))}</div>
      <div class="job-dates">${esc(entry.dates)}</div>
    </div>
    ${loc ? `<div class="job-loc">${esc(loc)}</div>` : ""}
    ${renderBullets(entry)}
  </div>`;
}

function earlierNote(entry: ExperienceEntry): string {
  if (entry.description) return entry.description;
  if (entry.bullets?.length) return entry.bullets[0] ?? "";
  if (entry.subRoles?.length) {
    const first = entry.subRoles[0]?.bullets[0];
    return first ?? "";
  }
  return "";
}

function renderEarlier(entry: ExperienceEntry): string {
  const skipNotes = new Set(["UnitedHealth Group", "Object Partners, Inc."]);
  const note = skipNotes.has(entry.company) ? "" : earlierNote(entry);
  // Skip gap-period traveller and very early intern roles to keep 2 pages.
  const skipCompanies = new Set(["Gap Period", "University of Wisconsin", "IBM Corporation"]);
  if (skipCompanies.has(entry.company)) return "";

  let left = `<strong>${esc(entry.company)}</strong> — ${esc(entry.title)}`;
  if (entry.location && entry.company === "Object Partners, Inc.") {
    left = `<strong>${esc(entry.company)}</strong> — ${esc(entry.title)} (${esc(entry.location.replace(/^Consultant at /, ""))})`;
  }

  return `
  <div class="early-row">
    <div class="early-left">${left}</div>
    <div class="early-dates">${esc(entry.dates)}</div>
  </div>
  ${note ? `<p class="early-note">${esc(note)}</p>` : ""}`;
}

function buildHtml(): string {
  const detailed = resumeExperience.slice(0, resumePdfDetailedCompanyCount);
  const earlier = resumeExperience.slice(resumePdfDetailedCompanyCount);

  const highlights = resumePdfHighlights
    .map(
      (h) => `
    <div class="hl">
      <span class="val">${esc(h.value)}</span>
      <span class="label">${esc(h.label)}</span>
    </div>`,
    )
    .join("");

  const competencies = resumePdfCompetencies
    .map(
      (c) =>
        `<p class="comp"><strong>${esc(c.label)}:</strong> ${esc(c.items)}</p>`,
    )
    .join("\n");

  const education = resumeEducation
    .map(
      (e) => `
  <div class="edu-row">
    <div><strong>${esc(e.degree)}</strong> — ${esc(e.school)}</div>
    <div class="early-dates">${esc(e.dates)}</div>
  </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Daniel Maas Resume</title>
<style>
  @page { size: letter; margin: 0.55in 0.6in 0.5in 0.6in; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Calibri", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    color: #3a3a3a;
    font-size: 10pt;
    line-height: 1.35;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .name {
    font-size: 26pt;
    font-weight: 700;
    color: #1B3450;
    letter-spacing: 0.04em;
    text-align: center;
    line-height: 1.1;
  }
  .tagline {
    text-align: center;
    color: #1B3450;
    font-size: 10.5pt;
    margin-top: 4px;
    font-weight: 500;
  }
  .contact {
    text-align: center;
    color: #5b5b5b;
    font-size: 9pt;
    margin-top: 6px;
  }
  .highlights {
    display: flex;
    gap: 0;
    margin: 14px 0 12px;
    border: 1px solid #c4d6df;
    border-radius: 2px;
    overflow: hidden;
  }
  .hl {
    flex: 1;
    text-align: center;
    padding: 8px 6px 7px;
    border-right: 1px solid #c4d6df;
  }
  .hl:last-child { border-right: none; }
  .hl .val {
    display: block;
    color: #1B3450;
    font-weight: 700;
    font-size: 12.5pt;
    line-height: 1.15;
  }
  .hl .label {
    display: block;
    color: #5b5b5b;
    font-size: 7.5pt;
    margin-top: 2px;
    line-height: 1.2;
  }
  h2 {
    color: #2E6E8E;
    font-size: 10pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 1.5px solid #2E6E8E;
    padding-bottom: 2px;
    margin: 11px 0 6px;
  }
  .summary { font-size: 9.5pt; text-align: justify; color: #3a3a3a; }
  .comp { margin: 2px 0; font-size: 9.2pt; }
  .comp strong { color: #1B3450; font-weight: 700; }
  .job { margin-top: 8px; }
  .job-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
  }
  .job-title { font-weight: 700; color: #1B3450; font-size: 10pt; }
  .job-dates { color: #5b5b5b; font-size: 9pt; white-space: nowrap; }
  .job-loc { color: #6a6a6a; font-size: 9pt; font-style: italic; margin: 1px 0 3px; }
  ul { margin: 0 0 0 1.1em; padding: 0; }
  li { margin: 1.5px 0; font-size: 9.2pt; }
  .early-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin: 3px 0;
    font-size: 9.2pt;
  }
  .early-left { flex: 1; }
  .early-left strong { color: #1B3450; }
  .early-dates { color: #5b5b5b; white-space: nowrap; font-size: 9pt; }
  .early-note { color: #3a3a3a; font-size: 8.8pt; margin: 0 0 2px 0.2em; }
  .edu-row, .meta-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin: 3px 0;
    font-size: 9.2pt;
  }
  .edu-row strong { color: #1B3450; }
</style>
</head>
<body>
  <div class="name">DANIEL MAAS</div>
  <div class="tagline">${esc(resumePdfTagline)}</div>
  <div class="contact">${contactLine()}</div>

  <div class="highlights">${highlights}</div>

  <h2>Summary</h2>
  <p class="summary">${esc(resumePdfSummary)}</p>

  <h2>Core Competencies</h2>
  ${competencies}

  <h2>Professional Experience</h2>
  ${detailed.map(renderDetailedJob).join("\n")}

  <h2>Earlier Career</h2>
  ${earlier.map(renderEarlier).join("\n")}

  <h2>Education</h2>
  ${education}

  <h2>Certifications &amp; Publications</h2>
  <p class="meta-row"><span><strong>Certifications:</strong> ${esc(resumeCertifications.join("; "))}</span></p>
  <p class="meta-row"><span><strong>Publications:</strong> ${esc(
    resumePublications.map((p) => `“${p}”`).join("; "),
  )}</span></p>
  <p class="meta-row"><span><strong>Languages:</strong> French (Elementary)</span></p>
</body>
</html>`;
}

function findChromium(): string {
  for (const bin of ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable"]) {
    const r = spawnSync("which", [bin], { encoding: "utf8" });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  throw new Error("No Chromium/Chrome binary found (need chromium for PDF print)");
}

function main(): void {
  mkdirSync(tmpDir, { recursive: true });
  mkdirSync(dirname(outPdf), { recursive: true });
  writeFileSync(tmpHtml, buildHtml(), "utf8");

  const chromium = findChromium();
  const result = spawnSync(
    chromium,
    [
      "--headless",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--print-to-pdf=${outPdf}`,
      "--print-to-pdf-no-header",
      pathToFileURL(tmpHtml).href,
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }

  console.log(`Wrote ${outPdf}`);
}

main();
