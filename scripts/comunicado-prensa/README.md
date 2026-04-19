# Comunicado de Prensa — PDF Generator

Generates `public/documentos/comunicado-prensa-9na-exaltacion.pdf`, the
press-release PDF announcing the 9th Exaltación nominations.

## Design

Reuses the "Editorial Civic, 1983 Sports Program" aesthetic from
`../boleta/generate-boleta.py`: cream paper (#FDF9EE), gold ornamental
border, Times-Bold title, Times-BoldItalic subtitle, gold diamond
ornaments, gold hairline rule, footer bar. Brand color tokens and the
page-frame callback are copied verbatim so the press release and
ballot feel like part of the same family of documents.

Body text is Helvetica 11pt justified (larger than the ballot's 9pt)
since the press release is prose meant to be read, not a form to
be filled out.

## Regenerate

```bash
/Development/pabellon-fama/scripts/boleta/.venv/bin/python3 \
  /Development/pabellon-fama/scripts/comunicado-prensa/generate-comunicado.py
```

The script reuses the virtualenv created for the boleta generator
(ReportLab 4.4.10 + Pillow 10.2.0). If that venv is missing:

```bash
python3 -m venv /Development/pabellon-fama/scripts/boleta/.venv
/Development/pabellon-fama/scripts/boleta/.venv/bin/python3 -m pip install reportlab pillow
```

## Success

- Exactly 1 page, US Letter.
- Script fails loud with `sys.exit(1)` if page count drifts.
- Produces ~52 KB PDF.

## Content map

| Section | Source |
|---|---|
| Title `COMUNICADO DE PRENSA` | Press release convention |
| Subtitle `Pabellón de la Fama del Deporte Humacaeño` | Matches boleta R1 |
| Dateline `Humacao, Puerto Rico — 9na Exaltación` | Added for press convention |
| Body paras 1–4 | Junta's source text (Apr 18 2026), accents normalized |
| `https://pfdh.org` (website) | User-directed: "blog" → "página web" |
| Sign-off `Junta de Directores` | Added for institutional authority |

## Grammar fixes applied

Source text used in the press release had minor Spanish accent
omissions. Normalized per user approval:

- `Pabellon` → `Pabellón`
- `mas noble` → `más noble`
- `periodo` → `período`
- `categorias` → `categorías`
- `podran` → `podrán`
- `telefonos` → `teléfonos`
- `informacion` → `información`
- `acceder` kept (but `pueden acceder nuestra página web` is kept as the Junta's phrasing)

No word choices were changed; only missing diacritics restored.

## Notes

- The script deliberately does not share code with `generate-boleta.py`.
  Shared tokens are duplicated (colors, layout constants, page frame) to
  keep each script self-contained and easy to hand off independently.
  If a third PDF is added later, factor out a shared module then.
- Output is committed at `public/documentos/` so the Junta can download
  the latest version without running Python locally.
