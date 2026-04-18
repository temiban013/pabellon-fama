# Boleta Junta Revisions — Design Spec

**Date:** 2026-04-18
**Feature:** PFDH nomination ballot revisions (round 1 — Junta feedback)
**Feature slug:** `boleta-junta-revisions`
**Parent feature:** `boleta-nominacion-v2` / PF-044
**Billing classification:** `[BILLABLE-NEW-FEATURE]` (continuation of PF-044)
**Source of truth:** `/home/temiban/Downloads/correciones a la boleta.pdf` (Junta-provided corrections, Apr 17 2026)

## Context

The `boleta-nominacion-pfdh.pdf` generator built in the previous session was sent to the PFDH Junta for review. The Junta met, decided **not to build an electronic ballot**, and requested four small revisions to the downloadable PDF. This spec captures those revisions. No architecture, layout, or color changes — the Junta approved the overall design. Only content + one typographic size bump.

Downstream impact: Phase 3 of the original `boleta-nominacion-v2` handoff (online nomination form, PF-046) is **cancelled** by this Junta decision. Phase 2 (`/nominacion` landing page, PF-045) is still in scope as a download destination but must not reference electronic submission.

## Revisions (verbatim-faithful, one grammatical fix approved by user)

### R1 — Enlarge organization subtitle

- **Where:** Page 1 title block, the line immediately below `BOLETA DE NOMINACIÓN`.
- **Current:** `Pabellón de la Fama del Deporte Humacaeño` at `Times-Italic 10pt`, color `COLOR_INK_SOFT` (`#525252`), leading 12.
- **New:** `Pabellón de la Fama del Deporte Humacaeño` at `Times-BoldItalic 13pt`, color `COLOR_INK` (`#1A1A1A`), leading 16.
- **Rationale:** Junta noted `"Agrandar el nombre del PFDH"` — a 30% size increase plus bolder weight and darker color makes the organization name prominent without dominating the title line. Preserves the italic serif aesthetic.
- **Position unchanged:** still below the title, above the gold ornament/rule.

### R2 — Replace ENTREGA body text

- **Where:** The `ENTREGA` block between Section VII and Section VIII on page 2.
- **Remove (old body):** `Envíe digitalmente a informa@pfdh.org o entregue en persona en el Museo Manuel Rivera Guevara, Centro Cultural Dra. Antonia Sáez, Humacao, PR. Lunes a viernes, 8:00 AM – 4:00 PM. Tel: 787-410-1237.`
- **Insert (verbatim from Junta, normalized for minor ASCII cleanup):** `La boleta con la documentación requerida debe ser entregada al personal del PFDH. Estamos ubicados en el edificio del Centro Cultural Dra. Antonia Sáez. Debe comunicarse primero a los siguientes números de teléfono: 787-410-1237, 787-209-8250, 787-559-4013 y 787-438-0585.`
- **Rationale:** Junta decided not to offer an electronic ballot — must eliminate `informa@pfdh.org` reference. Provides four phone numbers for nominators to call before delivering.
- **Styling unchanged:** ENTREGA green title bar, cream body, 0.5pt hairline box, 0.14" internal padding — all stay.
- **Normalization:** Junta wrote `"número de teléfono."` (singular, with period) — corrected to `"números de teléfono:"` (plural, with colon before the list). This is the minimum punctuation fix required to make the list grammatical in Spanish.

### R3 — Add LAI example to Section V hint

- **Where:** Section V (`V. Competencias Nacionales, Regionales o Locales`), the instructional hint line between the green section bar and the 3 numbered input rows.
- **Current hint:** `Mencione:`
- **New hint:** `Mencione (por ejemplo: Liga Atlética Interuniversitaria — LAI):`
- **Rationale:** Supplied by user (not in Junta's PDF) as a concrete example to help nominators understand the scope of Section V.
- **Styling unchanged:** `style_hint` (Helvetica-Oblique 8.5pt, color `COLOR_INK_SOFT`).

### R4 — Replace closing reminder

- **Where:** The centered italic paragraph at the bottom of page 2, below Section VIII.
- **Remove (old):** `Múltiples nominaciones para un mismo candidato fortalecen la candidatura. El período de nominación será anunciado por la Junta de Directores del Pabellón.`
- **Insert (Junta text with one grammatical fix approved by user):** `Ser exaltado al Pabellón es la más alta distinción y uno de los actos de justicia deportiva más noble que puede recibir un deportista humacaeño.`
- **Grammatical fix:** Junta wrote `"uno de los acto de justicia"` (singular `acto`). User approved the fix to `"uno de los actos de justicia"` (plural `actos`) for noun-phrase agreement.
- **Styling unchanged:** Times-Italic, centered, color `COLOR_INK_SOFT`.

## Explicitly out of scope

- PFDH logo size, position, or replacement.
- Any Section I–IV, VI–VIII content changes.
- NOTA IMPORTANTE panel (Junta is happy with the flat `a–f` layout with Certificado de Buena Conducta on its own line).
- Section III table structure or row count.
- Gold ornamental border, green section bars, diamond ornaments, cream NOTA panel, gold left stripe.
- `/nominacion` landing page (PF-045) copy — handled in a separate task.
- Cover letter or email to the Junta explaining the changes.

## Constraints

- **Page count must remain exactly 2.** The existing `sys.exit(1)` page-count check in `generate-boleta.py` enforces this. New ENTREGA body is ~15 words longer than the old one, which adds roughly one text line. Page 2 currently has visible whitespace below the closing reminder, so the new text should fit. If it does not, tighten `SP_SECTION` from `0.06 * inch` to `0.05 * inch` as the first lever.
- **Spacing and rhythm preserved.** Junta explicitly said they liked the rest of the output. No new Spacers, no removed KeepTogethers.
- **UTF-8 preserved.** Accents and `—` em dash must render correctly.

## Critical files

- **Modify:** `/Development/pabellon-fama/scripts/boleta/generate-boleta.py` (four small string/style edits)
- **Regenerate:** `/Development/pabellon-fama/public/documentos/boleta-nominacion-pfdh.pdf`
- **Do not touch:** `scripts/boleta/README.md` (content reference is abstract enough that it still applies), `scripts/boleta/.venv/`, any other file.

## Success criteria

Automated (must all pass, same verification stack used last session):

- `pdfinfo ... | grep "^Pages:"` → `Pages: 2`
- `pdftotext -layout ... | grep "787-209-8250"` → at least 1 hit (new phone number from Junta)
- `pdftotext -layout ... | grep "informa@pfdh.org"` → 0 hits (electronic submission reference removed)
- `pdftotext -layout ... | grep "Liga Atlética Interuniversitaria"` → at least 1 hit
- `pdftotext -layout ... | grep "Ser exaltado al Pabellón"` → at least 1 hit
- `pdftotext -layout ... | grep "Múltiples nominaciones"` → 0 hits
- `pdftotext -layout ... | grep "Certificado de Buena Conducta"` → still present (regression guard)
- `pnpm build` and `pnpm type-check` → unaffected (no TS changes)

Manual (visual, render to PNG via `pdftoppm`):

- Subtitle `Pabellón de la Fama del Deporte Humacaeño` renders visibly larger than the current 10pt version, bolder, darker ink.
- ENTREGA block still has the green title bar and cream body, but now contains the 4 phone numbers and no email address.
- Section V hint reads `Mencione (por ejemplo: Liga Atlética Interuniversitaria — LAI):`.
- Closing italic reads `Ser exaltado al Pabellón es la más alta distinción y uno de los actos de justicia deportiva más noble que puede recibir un deportista humacaeño.`
- Gold border, green bars, NOTA panel, diamond ornaments — all unchanged from prior render.
- Footer `PÁG. 1 / 2` and `PÁG. 2 / 2` still present, no overlap with content.

## Rollback

`git checkout -- scripts/boleta/generate-boleta.py public/documentos/boleta-nominacion-pfdh.pdf` restores the Junta-reviewed version. No database, no deployment, no external systems touched.

## Handoff

Next step: invoke `superpowers:writing-plans` to produce a step-by-step implementation plan for these four revisions.
