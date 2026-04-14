# Boleta de Nominación PDF Generator

Generates a 2-page US-Letter nomination ballot PDF for the Pabellón de la Fama del Deporte Humacaeño, matching the original paper form layout with an editorial 1983 sports program aesthetic.

## Quick Start

Create the virtual environment (first time only):

```bash
python3 -m venv scripts/boleta/.venv
scripts/boleta/.venv/bin/pip install reportlab==4.4.10
```

Regenerate the PDF:

```bash
scripts/boleta/.venv/bin/python3 scripts/boleta/generate-boleta.py
```

**Output**: `public/documentos/boleta-nominacion-pfdh.pdf`

**Expected**: 2 pages, roughly 80–120 KB. The script exits with status 1 if the page count is not exactly 2.

## Verification

Verify the PDF was generated correctly:

```bash
pdfinfo public/documentos/boleta-nominacion-pfdh.pdf | grep "^Pages:"
pdftotext -layout public/documentos/boleta-nominacion-pfdh.pdf - | grep "Buena Conducta"
```

## Field-to-Section Map

| Ballot Section | Script Location (Approx) |
|---|---|
| Title + logo + intro | `build_title_block()` |
| I. Datos del Candidato | `build_section_i()` |
| II. Categoría del Proponente | `build_section_ii()` |
| III. Deportes (3-col table) | `build_section_iii()` |
| IV. Competencias Internacionales | `build_section_iv()` |
| V. Competencias Nacionales | `build_section_v()` |
| VI. Posiciones en Comités | `build_section_vi()` |
| VII. Reconocimientos | `build_section_vii()` |
| NOTA IMPORTANTE panel | `build_nota_importante()` |
| Entrega block | `build_entrega()` |
| VIII. Datos del Proponente | `build_section_viii()` |
| Page border + footer | `draw_page_frame()` canvas callback |

(Function names are approximate — see `generate-boleta.py` for authoritative names.)

## Customizing the Design

- **Colors**: Edit `COLOR_*` constants at the top of `generate-boleta.py`. Key ones: `COLOR_GOLD` (ornamental border and accents), `COLOR_GREEN_BAR` (section headers), `COLOR_NOTA_BG` (cream panel background).

- **Fonts**: Only ReportLab built-in fonts are used (Helvetica, Helvetica-Bold, Times-Bold, Times-Italic). Custom fonts require TTF registration and are not used here.

- **Margins and spacing**: Edit `LEFT_MARGIN`, `RIGHT_MARGIN`, `TOP_MARGIN`, `BOTTOM_MARGIN` constants in 0.05 inch increments and regenerate.

- **Section order and rows**: Modify `build_section_*()` functions. Each is self-contained and returns a list of flowables.

## Known Limitations and Deferred Items

- **Not fillable.** This is a print-and-fill PDF. AcroForm fillable widgets are deferred pending Junta approval of the visual design. A follow-up task will add form fields via ReportLab's `AcroForm` API.

- **No Spanish hyphenation.** ReportLab does not ship with Spanish hyphenation tables. Long words wrap on word boundaries only, which is acceptable for this form layout.

- **ReportLab built-in fonts only.** Custom branded fonts require TTF registration and added complexity. Not implemented here.

## Billing Classification

This feature is **PF-044 Phase 1**, classified as **[BILLABLE-NEW-FEATURE]** at $10/hr per the PFDH retainer contract. Any future enhancement (fillable widgets, new sections, etc.) is also billable and requires client approval before starting work.

## Related Files

- **Source spec**: `.project/coordination/HANDOFF-boleta-nominacion-v2.md`
- **Original paper ballot** (reference): the original ballot from the Junta (not in repo)
- **Output**: `public/documentos/boleta-nominacion-pfdh.pdf` (committed)
- **Logo**: `public/images/pabellon-logo.png`
