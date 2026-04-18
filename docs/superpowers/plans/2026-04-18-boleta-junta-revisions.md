# Boleta Junta Revisions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply four Junta-requested content revisions to the PFDH nomination ballot PDF generator — enlarge subtitle, rewrite ENTREGA body, add LAI example to Section V, replace closing reminder — without touching layout, color, or section structure.

**Architecture:** Four targeted `Edit` operations on `scripts/boleta/generate-boleta.py`, followed by regeneration via the existing venv Python, then an automated + visual verification pass. No new files, no new helpers, no layout changes. Rollback is a single `git checkout --` against two files.

**Tech Stack:** ReportLab 4.4.10 (installed in `scripts/boleta/.venv`), Pillow 10.2.0, `pdftotext`/`pdftoppm` from Poppler for verification.

**Spec:** `docs/superpowers/specs/2026-04-18-boleta-junta-revisions-design.md`

**Billing:** PF-044 continuation, `[BILLABLE-NEW-FEATURE]`. Billing timer is already active from the previous session — do NOT start a new timer. Leave it running; the user stops it manually.

---

## File Structure

Only one file is modified:

- **Modify:** `scripts/boleta/generate-boleta.py` — four targeted edits (subtitle style, ENTREGA body text, Section V hint, closing reminder text).
- **Regenerate:** `public/documentos/boleta-nominacion-pfdh.pdf` — output of running the generator.

Rationale for not splitting: each edit is 1–4 lines, all in the same builder function (`build_story`) and one helper (`entrega_block`). Splitting into multiple files would violate YAGNI — the generator is already a single-file design by prior plan.

---

## Pre-flight (run once before Task 1)

- [ ] **Step 0.1: Confirm prerequisites exist**

Run:
```bash
ls scripts/boleta/.venv/bin/python3 scripts/boleta/generate-boleta.py public/documentos/boleta-nominacion-pfdh.pdf docs/superpowers/specs/2026-04-18-boleta-junta-revisions-design.md
```
Expected: all four paths print without errors.

- [ ] **Step 0.2: Capture baseline for regression comparison**

Run:
```bash
pdftotext -layout public/documentos/boleta-nominacion-pfdh.pdf "$TMPDIR/boleta-before.txt"
wc -l "$TMPDIR/boleta-before.txt"
```
Expected: about 110–120 lines of extracted text. This is the pre-revision snapshot.

---

## Task 1: Enlarge subtitle (R1)

**Files:**
- Modify: `scripts/boleta/generate-boleta.py:506-516` (the subtitle `Paragraph` in `build_story`)

- [ ] **Step 1.1: Apply the subtitle edit**

Use the `Edit` tool with:

`old_string`:
```python
    # 5. Subtitle
    story.append(Paragraph(
        "Pabellón de la Fama del Deporte Humacaeño",
        ParagraphStyle(
            "subtitle",
            fontName="Times-Italic",
            fontSize=10,
            leading=12,
            textColor=COLOR_INK_SOFT,
            alignment=TA_CENTER,
        ),
    ))
```

`new_string`:
```python
    # 5. Subtitle — enlarged per Junta feedback (R1): larger, bolder, darker ink
    story.append(Paragraph(
        "Pabellón de la Fama del Deporte Humacaeño",
        ParagraphStyle(
            "subtitle",
            fontName="Times-BoldItalic",
            fontSize=13,
            leading=16,
            textColor=COLOR_INK,
            alignment=TA_CENTER,
        ),
    ))
```

Changes: `fontName` Times-Italic → Times-BoldItalic, `fontSize` 10 → 13, `leading` 12 → 16, `textColor` COLOR_INK_SOFT → COLOR_INK. Comment added noting R1 rationale.

- [ ] **Step 1.2: Syntax-check the script**

Run:
```bash
scripts/boleta/.venv/bin/python3 -c "import ast; ast.parse(open('scripts/boleta/generate-boleta.py').read()); print('syntax OK')"
```
Expected: `syntax OK`.

---

## Task 2: Replace ENTREGA body text (R2)

**Files:**
- Modify: `scripts/boleta/generate-boleta.py:446-451` (the Paragraph inside `entrega_block()`)

- [ ] **Step 2.1: Apply the ENTREGA body edit**

Use the `Edit` tool with:

`old_string`:
```python
        [Paragraph(
            "Envíe digitalmente a informa@pfdh.org o entregue en persona en el Museo "
            "Manuel Rivera Guevara, Centro Cultural Dra. Antonia Sáez, Humacao, PR. "
            "Lunes a viernes, 8:00 AM – 4:00 PM. Tel: 787-410-1237.",
            style_entrega_body,
        )],
```

`new_string`:
```python
        [Paragraph(
            "La boleta con la documentación requerida debe ser entregada al personal "
            "del PFDH. Estamos ubicados en el edificio del Centro Cultural Dra. Antonia "
            "Sáez. Debe comunicarse primero a los siguientes números de teléfono: "
            "787-410-1237, 787-209-8250, 787-559-4013 y 787-438-0585.",
            style_entrega_body,
        )],
```

Changes: Body text replaced entirely per Junta R2. No style, no padding, no border changes.

- [ ] **Step 2.2: Syntax-check**

Run:
```bash
scripts/boleta/.venv/bin/python3 -c "import ast; ast.parse(open('scripts/boleta/generate-boleta.py').read()); print('syntax OK')"
```
Expected: `syntax OK`.

---

## Task 3: Add LAI example to Section V hint (R3)

**Files:**
- Modify: `scripts/boleta/generate-boleta.py:731` (the `sec5_hint` Paragraph)

- [ ] **Step 3.1: Apply the Section V hint edit**

Use the `Edit` tool with:

`old_string`:
```python
    sec5_hint   = Paragraph("Mencione:", style_hint)
```

`new_string`:
```python
    sec5_hint   = Paragraph(
        "Mencione (por ejemplo: Liga Atlética Interuniversitaria &#8212; LAI):",
        style_hint,
    )
```

Changes: Hint text updated. `&#8212;` is the HTML entity for an em dash (—) so ReportLab's Paragraph parser renders it correctly (using a raw `—` also works; the entity is safer across font fallback paths).

- [ ] **Step 3.2: Syntax-check**

Run:
```bash
scripts/boleta/.venv/bin/python3 -c "import ast; ast.parse(open('scripts/boleta/generate-boleta.py').read()); print('syntax OK')"
```
Expected: `syntax OK`.

---

## Task 4: Replace closing reminder (R4)

**Files:**
- Modify: `scripts/boleta/generate-boleta.py:816-820` (the final `Paragraph` in `build_story`)

- [ ] **Step 4.1: Apply the closing reminder edit**

Use the `Edit` tool with:

`old_string`:
```python
    story.append(Paragraph(
        "Múltiples nominaciones para un mismo candidato fortalecen la candidatura. "
        "El período de nominación será anunciado por la Junta de Directores del Pabellón.",
        style_closing,
    ))
```

`new_string`:
```python
    story.append(Paragraph(
        "Ser exaltado al Pabellón es la más alta distinción y uno de los actos de "
        "justicia deportiva más noble que puede recibir un deportista humacaeño.",
        style_closing,
    ))
```

Changes: Closing sentence replaced per Junta R4 (with approved grammatical fix `acto` → `actos`). Style unchanged.

- [ ] **Step 4.2: Syntax-check**

Run:
```bash
scripts/boleta/.venv/bin/python3 -c "import ast; ast.parse(open('scripts/boleta/generate-boleta.py').read()); print('syntax OK')"
```
Expected: `syntax OK`.

---

## Task 5: Regenerate PDF

**Files:**
- Regenerate: `public/documentos/boleta-nominacion-pfdh.pdf`

- [ ] **Step 5.1: Run the generator**

Run:
```bash
scripts/boleta/.venv/bin/python3 scripts/boleta/generate-boleta.py
```

**Expected happy path:**
```
OK: wrote /Development/pabellon-fama/public/documentos/boleta-nominacion-pfdh.pdf (~56 KB, 2 pages)
```
(Size may vary by ±5 KB. The `2 pages` string MUST be present.)

**If output is `ERROR: expected exactly 2 pages, got 3`:**
The new ENTREGA body is ~15 words longer than the old one and may have pushed page 2 into page 3 overflow. Apply this compensating edit, then re-run:

Use the `Edit` tool on `scripts/boleta/generate-boleta.py`:

`old_string`:
```python
    SP_SECTION = Spacer(1, 0.06 * inch)  # between sections (tightened)
    SP_FIELD   = Spacer(1, 0.04 * inch)  # between fields within a section
```

`new_string`:
```python
    SP_SECTION = Spacer(1, 0.05 * inch)  # between sections (R2 tightened)
    SP_FIELD   = Spacer(1, 0.03 * inch)  # between fields within a section
```

Then re-run `scripts/boleta/.venv/bin/python3 scripts/boleta/generate-boleta.py`. If it still reports 3 pages, tighten once more to `0.04` / `0.025`. Stop and escalate if a third iteration still fails — that means the new ENTREGA text is structurally too long and the text needs to be reviewed.

- [ ] **Step 5.2: Confirm page count**

Run:
```bash
pdfinfo public/documentos/boleta-nominacion-pfdh.pdf | grep "^Pages:"
```
Expected: `Pages:           2`.

---

## Task 6: Automated verification

**Files:** none modified; read-only checks against the regenerated PDF.

- [ ] **Step 6.1: Extract text for grepping**

Run:
```bash
pdftotext -layout public/documentos/boleta-nominacion-pfdh.pdf "$TMPDIR/boleta-after.txt"
```
Expected: no output, exit code 0.

- [ ] **Step 6.2: Run content assertions (all 8 must pass)**

Run:
```bash
set -e
echo "=== R2: new phone numbers present ===" && grep -q "787-209-8250" "$TMPDIR/boleta-after.txt" && echo OK
echo "=== R2: new phone numbers present ===" && grep -q "787-559-4013" "$TMPDIR/boleta-after.txt" && echo OK
echo "=== R2: new phone numbers present ===" && grep -q "787-438-0585" "$TMPDIR/boleta-after.txt" && echo OK
echo "=== R2: informa@pfdh.org removed ===" && ! grep -q "informa@pfdh.org" "$TMPDIR/boleta-after.txt" && echo OK
echo "=== R3: LAI added ===" && grep -q "Liga Atlética Interuniversitaria" "$TMPDIR/boleta-after.txt" && echo OK
echo "=== R4: new closing present ===" && grep -q "Ser exaltado al Pabellón" "$TMPDIR/boleta-after.txt" && echo OK
echo "=== R4: old closing removed ===" && ! grep -q "Múltiples nominaciones" "$TMPDIR/boleta-after.txt" && echo OK
echo "=== Regression: Buena Conducta still present on own line ===" && grep -q "Buena Conducta" "$TMPDIR/boleta-after.txt" && echo OK
```
Expected: 8 `OK` lines printed with no errors.

**If any assertion fails:** Investigate the specific failure — do NOT force-pass. A failing R4 assertion means the Edit in Task 4 did not land; re-read the file and reapply. A failing "Buena Conducta" regression means something went wrong in Task 1–4 that affected unrelated content; compare the extracted text against `$TMPDIR/boleta-before.txt`.

- [ ] **Step 6.3: Regression check — numbered lists still start at 1**

Run:
```bash
grep -cE "^\s*1\." "$TMPDIR/boleta-after.txt"
```
Expected: `4` (one per numbered list in Secs III, V, VI, VII).

---

## Task 7: Visual QA

**Files:** none modified; read-only render of the regenerated PDF.

- [ ] **Step 7.1: Render pages to PNG**

Run:
```bash
mkdir -p "$TMPDIR/boleta_after"
pdftoppm -png -r 144 public/documentos/boleta-nominacion-pfdh.pdf "$TMPDIR/boleta_after/page"
ls "$TMPDIR/boleta_after/"
```
Expected: `page-1.png` and `page-2.png` listed.

- [ ] **Step 7.2: Visually verify each revision**

Open each PNG (via the `Read` tool in an agentic run, or `xdg-open` in a terminal session). Confirm:

**Page 1:**
- Subtitle "Pabellón de la Fama del Deporte Humacaeño" is visibly larger and bolder than in the previous render (now 13pt BoldItalic dark ink, not 10pt Italic soft gray).
- Title "BOLETA DE NOMINACIÓN" is still above it in Times-Bold.
- Gold ornament (◆ ◆ ◆) and gold rule still below the subtitle.
- Section V shows the hint `Mencione (por ejemplo: Liga Atlética Interuniversitaria — LAI):` above the 3 numbered rows.

**Page 2:**
- ENTREGA block shows: `La boleta con la documentación requerida debe ser entregada al personal del PFDH. Estamos ubicados en el edificio del Centro Cultural Dra. Antonia Sáez. Debe comunicarse primero a los siguientes números de teléfono: 787-410-1237, 787-209-8250, 787-559-4013 y 787-438-0585.`
- No reference to `informa@pfdh.org`, no reference to `Museo Manuel Rivera Guevara`, no hours/`Lunes a viernes`.
- Closing italic paragraph reads: `Ser exaltado al Pabellón es la más alta distinción y uno de los actos de justicia deportiva más noble que puede recibir un deportista humacaeño.`
- No reference to `Múltiples nominaciones`.
- Gold border, green section bars, NOTA IMPORTANTE cream panel with gold left stripe, diamond ornaments — all still present, unchanged from prior render.
- Footer `PÁG. 1 / 2` and `PÁG. 2 / 2` present, not overlapping content.

- [ ] **Step 7.3: No orphan regressions**

Confirm by diffing structure:
```bash
diff <(grep -E "^(  [IVX]+\.|NOTA IMPORTANTE|ENTREGA|Ser exaltado)" "$TMPDIR/boleta-before.txt" | sort) \
     <(grep -E "^(  [IVX]+\.|NOTA IMPORTANTE|ENTREGA|Ser exaltado)" "$TMPDIR/boleta-after.txt" | sort)
```
Expected: the only difference is the addition of a line matching `Ser exaltado al Pabellón`. All 8 section headers + NOTA IMPORTANTE + ENTREGA should remain on both sides.

---

## Task 8: Hand-off and commit preparation

**Files:**
- None modified. Agents do not commit (per project git-workflow rule); user commits.

- [ ] **Step 8.1: Report results**

Print a one-screen summary with:
- Which 4 revisions were applied (R1–R4).
- Output PDF path and new size.
- Page count (should be 2).
- The 8 automated assertions that passed.
- The PNG paths under `$TMPDIR/boleta_after/`.
- The suggested commit message (below).

- [ ] **Step 8.2: Suggested commit message for user**

The user runs `git commit` manually. Suggest:
```
feat(nominacion): apply Junta revisions to boleta PDF [BILLABLE-NEW-FEATURE] [PF-044]

- Enlarge PFDH subtitle to 13pt Times-BoldItalic per Junta R1
- Replace ENTREGA body with physical-delivery instructions + 4 phone numbers (R2)
- Remove electronic submission reference (informa@pfdh.org)
- Add LAI example to Section V hint (R3)
- Replace closing reminder with Junta's exaltación statement (R4)
- Spec at docs/superpowers/specs/2026-04-18-boleta-junta-revisions-design.md
```

- [ ] **Step 8.3: Billing — do NOT stop timer**

The user controls when billing stops (per supervisor-workflow rule). Do not call `stop_billing`. The timer from the previous session continues running.

---

## Self-Review

**1. Spec coverage:**
- R1 (enlarge subtitle) → Task 1 ✓
- R2 (ENTREGA body replacement) → Task 2 ✓
- R3 (LAI example in Sec V) → Task 3 ✓
- R4 (closing reminder replacement) → Task 4 ✓
- Page count = 2 constraint → Task 5 + Task 6.1 ✓
- Buena Conducta regression guard → Task 6.2 ✓
- Visual QA (subtitle size, gold border, green bars) → Task 7.2 ✓
- Rollback plan (single `git checkout --`) → implicit in "No commits by agent" rule ✓

**2. Placeholder scan:** No TBDs. Every Edit has full `old_string` and `new_string` literal blocks. Every command has expected output. The single conditional branch in Task 5.1 has a specific compensating edit spelled out, not a "tweak spacing" note.

**3. Type consistency:**
- `style_entrega_body` used in Task 2 matches existing module-level style constant (verified at line 450 of existing file).
- `style_hint` used in Task 3 matches existing module-level style constant (verified in Sec V call site).
- `style_closing` used in Task 4 matches existing module-level style constant (verified at line 171 of existing file).
- `COLOR_INK` and `COLOR_INK_SOFT` used in Task 1 match existing module-level constants (defined at top of generator).

No gaps. Plan is ready to execute.
