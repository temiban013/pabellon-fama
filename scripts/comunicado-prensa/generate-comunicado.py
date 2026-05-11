# -*- coding: utf-8 -*-
"""
generate-comunicado.py
Pabellón de la Fama del Deporte Humacaeño
9na Exaltación — Press Announcement (Comunicado de Prensa).

Reuses the design system from ../boleta/generate-boleta.py
(Editorial Civic, 1983 Sports Program aesthetic).

Run:
  /Development/pabellon-fama/scripts/boleta/.venv/bin/python3 \
    /Development/pabellon-fama/scripts/comunicado-prensa/generate-comunicado.py
"""

import os
import sys
import subprocess

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
OUTPUT_PATH = "/Development/pabellon-fama/public/documentos/comunicado-prensa-9na-exaltacion.pdf"
LOGO_PATH = "/Development/pabellon-fama/public/images/pabellon-logo.png"

# ---------------------------------------------------------------------------
# ReportLab
# ---------------------------------------------------------------------------
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    BaseDocTemplate,
    PageTemplate,
    Frame,
    Paragraph,
    Spacer,
    HRFlowable,
    Image as PlatypusImage,
)

# ---------------------------------------------------------------------------
# Brand color constants (shared with boleta)
# ---------------------------------------------------------------------------
COLOR_PAPER      = colors.HexColor("#FDF9EE")
COLOR_INK        = colors.HexColor("#1A1A1A")
COLOR_INK_SOFT   = colors.HexColor("#525252")
COLOR_CREAM_TEXT = colors.HexColor("#FFFBEB")
COLOR_GOLD       = colors.HexColor("#B45309")
COLOR_GOLD_LIGHT = colors.HexColor("#F59E0B")
COLOR_LINK       = colors.HexColor("#0A3D1E")   # dark green for URL

# ---------------------------------------------------------------------------
# Layout
# ---------------------------------------------------------------------------
PAGE_W, PAGE_H = letter
MARGIN_L = 0.75 * inch
MARGIN_R = 0.75 * inch
MARGIN_T = 0.55 * inch
MARGIN_B = 0.75 * inch
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R   # 7.00"

TOTAL_PAGES = 1

# ---------------------------------------------------------------------------
# Page frame: gold ornamental border + footer (same system as boleta)
# ---------------------------------------------------------------------------
def draw_page_frame(canvas, doc):
    canvas.saveState()

    # Outer gold rounded rectangle
    canvas.setStrokeColor(COLOR_GOLD)
    canvas.setLineWidth(1.5)
    canvas.roundRect(
        0.32 * inch, 0.32 * inch,
        PAGE_W - 0.64 * inch, PAGE_H - 0.64 * inch,
        0.12 * inch, stroke=1, fill=0
    )

    # Inner hairline
    canvas.setStrokeColor(COLOR_GOLD_LIGHT)
    canvas.setLineWidth(0.5)
    canvas.roundRect(
        0.40 * inch, 0.40 * inch,
        PAGE_W - 0.80 * inch, PAGE_H - 0.80 * inch,
        0.08 * inch, stroke=1, fill=0
    )

    # Footer gold rule
    canvas.setStrokeColor(COLOR_GOLD)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_L, 0.58 * inch, PAGE_W - MARGIN_R, 0.58 * inch)

    # Footer text
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(COLOR_INK_SOFT)
    canvas.drawCentredString(
        PAGE_W / 2,
        0.42 * inch,
        f"PABELLÓN DE LA FAMA DEL DEPORTE HUMACAEÑO  ·  PÁG. {doc.page} / {TOTAL_PAGES}"
    )

    canvas.restoreState()


# ---------------------------------------------------------------------------
# Paragraph styles
# ---------------------------------------------------------------------------
style_title = ParagraphStyle(
    "title",
    fontName="Times-Bold",
    fontSize=22,
    leading=26,
    textColor=COLOR_INK,
    alignment=TA_CENTER,
    spaceAfter=0,
)
style_subtitle = ParagraphStyle(
    "subtitle",
    fontName="Times-BoldItalic",
    fontSize=14,
    leading=17,
    textColor=COLOR_INK,
    alignment=TA_CENTER,
)
style_ornament = ParagraphStyle(
    "ornament",
    fontName="Helvetica",
    fontSize=11,
    leading=14,
    textColor=COLOR_GOLD,
    alignment=TA_CENTER,
)
style_dateline = ParagraphStyle(
    "dateline",
    fontName="Helvetica-Oblique",
    fontSize=9.5,
    leading=12,
    textColor=COLOR_INK_SOFT,
    alignment=TA_CENTER,
    spaceAfter=0,
)
style_body = ParagraphStyle(
    "body",
    fontName="Helvetica",
    fontSize=11,
    leading=15.5,
    textColor=COLOR_INK,
    alignment=TA_JUSTIFY,
    spaceAfter=9,
    firstLineIndent=0.25 * inch,
)
style_body_no_indent = ParagraphStyle(
    "body_no_indent",
    parent=style_body,
    firstLineIndent=0,
)
style_signoff = ParagraphStyle(
    "signoff",
    fontName="Times-BoldItalic",
    fontSize=11,
    leading=14,
    textColor=COLOR_INK,
    alignment=TA_CENTER,
    spaceBefore=8,
)
style_signoff_sub = ParagraphStyle(
    "signoff_sub",
    fontName="Helvetica",
    fontSize=9.5,
    leading=12,
    textColor=COLOR_INK_SOFT,
    alignment=TA_CENTER,
)


# ---------------------------------------------------------------------------
# Build story
# ---------------------------------------------------------------------------
def build_story():
    story = []

    # 1. Logo
    logo = PlatypusImage(LOGO_PATH)
    aspect = 191.0 / 256.0
    logo.drawHeight = 0.75 * inch
    logo.drawWidth  = 0.75 * inch * aspect
    logo.hAlign = "CENTER"
    story.append(logo)

    story.append(Spacer(1, 0.06 * inch))

    # 2. Title
    story.append(Paragraph("COMUNICADO DE PRENSA", style_title))

    story.append(Spacer(1, 0.03 * inch))

    # 3. Subtitle — organization name (matches boleta R1 styling)
    story.append(Paragraph(
        "Pabellón de la Fama del Deporte Humacaeño",
        style_subtitle,
    ))

    story.append(Spacer(1, 0.04 * inch))

    # 4. Gold diamond ornaments
    story.append(Paragraph(
        "&#9670;&nbsp;&nbsp;&nbsp;&nbsp;&#9670;&nbsp;&nbsp;&nbsp;&nbsp;&#9670;",
        style_ornament,
    ))

    story.append(Spacer(1, 0.02 * inch))

    # 5. Gold rule
    story.append(HRFlowable(
        width="60%",
        thickness=0.75,
        color=COLOR_GOLD,
        lineCap="round",
        spaceBefore=0.01 * inch,
        spaceAfter=0.04 * inch,
        hAlign="CENTER",
    ))

    # 6. Dateline (place + date)
    story.append(Paragraph(
        "Humacao, Puerto Rico &mdash; 9na Exaltaci&oacute;n",
        style_dateline,
    ))

    story.append(Spacer(1, 0.18 * inch))

    # 7. Body paragraph 1 — announcement + categories + pickup locations
    story.append(Paragraph(
        "La Junta de Directores del Pabell&oacute;n de la Fama del Deporte "
        "Humacae&ntilde;o anuncia la apertura del per&iacute;odo de nominaciones "
        "para la Novena (9na) Exaltaci&oacute;n a llevarse a cabo el domingo "
        "8 de noviembre de 2026. Comenzando el 22 de mayo de 2026 hasta el "
        "31 de agosto de 2026, los ciudadanos podr&aacute;n nominar deportistas "
        "en las siguientes categor&iacute;as: atletas, propulsores y cronistas "
        "deportivos. Las boletas de nominaci&oacute;n estar&aacute;n disponibles "
        "en las oficinas de Walo Radio, Peri&oacute;dico El Oriental, Radio "
        "Victoria y en el Centro Cultural Antonia S&aacute;ez.",
        style_body_no_indent,
    ))

    # 8. Body paragraph 2 — exaltación statement + invitation
    story.append(Paragraph(
        "Ser exaltado al Pabell&oacute;n es la m&aacute;s alta distinci&oacute;n "
        "y acto de justicia deportiva m&aacute;s noble que puede recibir un "
        "deportista humacae&ntilde;o. Te invitamos a que participes nominando "
        "a aquellos deportistas que entiendas cumplen con todos los requisitos "
        "para recibir tan alto honor.",
        style_body,
    ))

    # 9. Body paragraph 3 — contact info (phones + website)
    story.append(Paragraph(
        "Para m&aacute;s informaci&oacute;n se pueden comunicar a los siguientes "
        "tel&eacute;fonos: (787) 209-8250, 559-4013 y 438-0585. Adem&aacute;s, "
        "pueden acceder nuestra p&aacute;gina web: "
        "<link href=\"https://pfdh.org\"><font color=\"#0A3D1E\">"
        "<u>https://pfdh.org</u></font></link>.",
        style_body,
    ))

    # 10. Body paragraph 4 — closing call to action
    story.append(Paragraph(
        "Exhortamos la participaci&oacute;n de nuestros conciudadanos para "
        "juntos hacer justicia y rendir honor a esos deportistas que han "
        "brindado gloria a nuestro pueblo.",
        style_body,
    ))

    # 11. Sign-off
    story.append(Spacer(1, 0.22 * inch))

    # Small gold rule above sign-off
    story.append(HRFlowable(
        width="30%",
        thickness=0.5,
        color=COLOR_GOLD_LIGHT,
        lineCap="round",
        spaceBefore=0,
        spaceAfter=0.08 * inch,
        hAlign="CENTER",
    ))

    story.append(Paragraph("Junta de Directores", style_signoff))
    story.append(Paragraph(
        "Pabell&oacute;n de la Fama del Deporte Humacae&ntilde;o",
        style_signoff_sub,
    ))

    return story


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    doc = BaseDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        leftMargin=MARGIN_L,
        rightMargin=MARGIN_R,
        topMargin=MARGIN_T,
        bottomMargin=MARGIN_B,
        title="Comunicado de Prensa — 9na Exaltación — Pabellón de la Fama del Deporte Humacaeño",
        author="Pabellón de la Fama del Deporte Humacaeño",
        subject="Apertura de nominaciones — 9na Exaltación",
    )

    frame = Frame(
        MARGIN_L,
        MARGIN_B,
        CONTENT_W,
        PAGE_H - MARGIN_T - MARGIN_B,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="content",
    )

    doc.addPageTemplates([
        PageTemplate(id="main", frames=[frame], onPage=draw_page_frame)
    ])

    doc.build(build_story())

    # Verify page count
    result = subprocess.run(
        ["/usr/bin/pdfinfo", OUTPUT_PATH],
        capture_output=True,
        text=True,
    )
    pages = -1
    if result.returncode == 0:
        for line in result.stdout.splitlines():
            if line.startswith("Pages:"):
                try:
                    pages = int(line.split()[1])
                except (IndexError, ValueError):
                    pass
                break
    else:
        print(f"WARNING: pdfinfo failed: {result.stderr.strip()}", file=sys.stderr)

    if pages != TOTAL_PAGES:
        print(
            f"ERROR: expected exactly {TOTAL_PAGES} page, got {pages}. "
            f"Adjust content or margins to fit {TOTAL_PAGES} page exactly.",
            file=sys.stderr,
        )
        sys.exit(1)

    size_kb = os.path.getsize(OUTPUT_PATH) / 1024
    print(f"OK: wrote {OUTPUT_PATH} ({size_kb:.1f} KB, {pages} page{'s' if pages != 1 else ''})")


if __name__ == "__main__":
    main()
