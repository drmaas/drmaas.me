---
name: regenerate-resume-pdf
description: >
  Regenerates public/docs/Daniel_Maas_Resume.pdf from src/lib/profile.ts.
  Use when the user asks to regenerate the resume PDF, update the downloadable
  resume after profile/resume content changes, or sync the PDF with profile.ts.
---

# regenerate-resume-pdf

Rebuilds the static resume PDF served at `/docs/Daniel_Maas_Resume.pdf`.

## Source of truth

| Content | Where |
|---------|--------|
| Experience, education, certs, publications, contact | `src/lib/profile.ts` (`resumeExperience`, etc.) |
| PDF tagline, highlight tabs, summary, competency groups | `src/lib/profile.ts` (`resumePdf*` exports) |
| Layout / print CSS / Chromium print | `scripts/generate-resume-pdf.ts` |
| Output | `public/docs/Daniel_Maas_Resume.pdf` |

Web resume page (`src/pages/resume/index.astro`) reads the same profile module but is separate from the PDF layout.

## Workflow

1. **Edit content in `src/lib/profile.ts`** — experience bullets, dates, PDF highlights/summary as needed.
2. **Regenerate** (needs Chromium/Chrome on `PATH`, `chromium` preferred):
   ```bash
   pnpm resume:pdf
   ```
   If pnpm blocks on a deps/install check (e.g. sharp), run the generator directly — it has no npm deps:
   ```bash
   node --experimental-strip-types ./scripts/generate-resume-pdf.ts
   ```
3. **Verify** with `pdftotext public/docs/Daniel_Maas_Resume.pdf - | head` (or open the PDF). Confirm 2 pages via `pdfinfo`.
4. Do **not** hand-edit the PDF binary. Change profile data or the generator script, then re-run.

## Editorial rules (PDF)

- Highlight tabs and `resumePdfSummary` are PDF-specific; keep them aligned with current positioning (full stack, product focus, agentic engineering — not “independent practice” / headcount flex unless the user asks).
- `resumePdfDetailedCompanyCount` controls how many leading `resumeExperience` entries render in full; the rest go under Earlier Career (some early roles are skipped to stay on 2 pages — see the generator).
- After profile experience changes, regenerate before committing if the downloadable PDF should match.

## Agent checklist

- [ ] Updated the right `resume*` / `resumePdf*` fields in `profile.ts`
- [ ] Ran `pnpm resume:pdf`
- [ ] Output is `public/docs/Daniel_Maas_Resume.pdf`
- [ ] Spot-checked text for the change the user asked for
