# -*- coding: utf-8 -*-
"""
generate-boleta.py
Pabellón de la Fama del Deporte Humacaeño
Generates the 2-page US-Letter nomination ballot PDF (PF-044).

Run:
  /Development/pabellon-fama/scripts/boleta/.venv/bin/python3 \
    /Development/pabellon-fama/scripts/boleta/generate-boleta.py
"""

import os
import sys
import subprocess

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
OUTPUT_PATH = "/Development/pabellon-fama/public/documentos/boleta-nominacion-pfdh.pdf"
LOGO_PATH = "/Development/pabellon-fama/public/images/pabellon-logo.png"

# ---------------------------------------------------------------------------
# ReportLab imports
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
    Table,
    TableStyle,
    Spacer,
    KeepTogether,
    PageBreak,
    HRFlowable,
    Image as PlatypusImage,
)
from reportlab.platypus.flowables import Flowable

# ---------------------------------------------------------------------------
# Brand color constants
# ---------------------------------------------------------------------------
COLOR_PAPER        = colors.HexColor("#FDF9EE")
COLOR_INK          = colors.HexColor("#1A1A1A")
COLOR_INK_SOFT     = colors.HexColor("#525252")
COLOR_GREEN_BAR    = colors.HexColor("#14532D")
COLOR_GREEN_DARK   = colors.HexColor("#0A3D1E")
COLOR_CREAM_TEXT   = colors.HexColor("#FFFBEB")
COLOR_GOLD         = colors.HexColor("#B45309")
COLOR_GOLD_LIGHT   = colors.HexColor("#F59E0B")
COLOR_NOTA_BG      = colors.HexColor("#FFFBEB")
COLOR_HAIRLINE     = colors.HexColor("#9CA3AF")
COLOR_SECTION_TINT = colors.HexColor("#F0FDF4")

# ---------------------------------------------------------------------------
# Layout constants
# ---------------------------------------------------------------------------
PAGE_W, PAGE_H = letter
MARGIN_L  = 0.55 * inch
MARGIN_R  = 0.55 * inch
MARGIN_T  = 0.50 * inch
MARGIN_B  = 0.70 * inch
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R   # 7.40 inch

# ---------------------------------------------------------------------------
# Checkbox custom flowable
# A simple hollow square drawn on canvas — guaranteed to render.
# ---------------------------------------------------------------------------
class CheckboxFlowable(Flowable):
    """A 0.14" hollow square drawn via canvas lines — font-independent."""
    SIZE = 0.14 * inch

    def __init__(self):
        Flowable.__init__(self)
        self.width  = self.SIZE
        self.height = self.SIZE

    def draw(self):
        s = self.SIZE
        self.canv.saveState()
        self.canv.setStrokeColor(COLOR_INK)
        self.canv.setLineWidth(0.75)
        self.canv.rect(0, 0, s, s, fill=0, stroke=1)
        self.canv.restoreState()


# ---------------------------------------------------------------------------
# Helper: inline checkbox string using a custom Paragraph approach.
# We use a Table-based layout where col 0 holds a CheckboxFlowable.
# But for inline table usage we use a unicode approach with fallback.
# The checkbox in Tables is always a CheckboxFlowable in its own cell.
# ---------------------------------------------------------------------------

def checkbox_cell():
    """Returns a CheckboxFlowable for use in Table cells."""
    return CheckboxFlowable()

# ---------------------------------------------------------------------------
# Paragraph styles
# ---------------------------------------------------------------------------
style_body = ParagraphStyle(
    "body",
    fontName="Helvetica",
    fontSize=9,
    leading=11,
    textColor=COLOR_INK,
    alignment=TA_LEFT,
)
style_body_bold = ParagraphStyle(
    "body_bold",
    parent=style_body,
    fontName="Helvetica-Bold",
)
style_hint = ParagraphStyle(
    "hint",
    fontName="Helvetica-Oblique",
    fontSize=8.5,
    leading=11,
    textColor=COLOR_INK_SOFT,
    alignment=TA_LEFT,
)
style_centered = ParagraphStyle(
    "centered",
    fontName="Helvetica",
    fontSize=9,
    leading=11,
    textColor=COLOR_INK,
    alignment=TA_CENTER,
)
style_intro = ParagraphStyle(
    "intro",
    fontName="Helvetica",
    fontSize=9,
    leading=12,
    textColor=COLOR_INK,
    alignment=TA_JUSTIFY,
)
style_nota_title = ParagraphStyle(
    "nota_title",
    fontName="Helvetica-Bold",
    fontSize=10.5,
    leading=14,
    textColor=COLOR_GOLD,
)
style_nota_hint = ParagraphStyle(
    "nota_hint",
    fontName="Helvetica-Oblique",
    fontSize=8.5,
    leading=11,
    textColor=COLOR_INK_SOFT,
)
style_nota_label = ParagraphStyle(
    "nota_label",
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=11,
    textColor=COLOR_INK,
)
style_nota_text = ParagraphStyle(
    "nota_text",
    fontName="Helvetica",
    fontSize=9,
    leading=11,
    textColor=COLOR_INK,
)
style_closing = ParagraphStyle(
    "closing",
    fontName="Times-Italic",
    fontSize=8.5,
    leading=11,
    textColor=COLOR_INK_SOFT,
    alignment=TA_CENTER,
)
style_entrega_title = ParagraphStyle(
    "entrega_title",
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=12,
    textColor=COLOR_GREEN_BAR,
)
style_entrega_body = ParagraphStyle(
    "entrega_body",
    fontName="Helvetica",
    fontSize=8.5,
    leading=11,
    textColor=COLOR_INK,
    alignment=TA_JUSTIFY,
)

# ---------------------------------------------------------------------------
# Page callback: draws ornamental borders + footer on every page
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

    # Inner decorative hairline
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
        f"PABELLÓN DE LA FAMA DEL DEPORTE HUMACAEÑO  ·  PÁG. {doc.page} / 2"
    )

    canvas.restoreState()


# ---------------------------------------------------------------------------
# Helper: section header bar
# ---------------------------------------------------------------------------
def section_header(text):
    """Full-width green bar with cream bold text."""
    data = [[Paragraph(f"  {text.upper()}", ParagraphStyle(
        "sec_hdr",
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=14,
        textColor=COLOR_CREAM_TEXT,
    ))]]
    tbl = Table(data, colWidths=[CONTENT_W], rowHeights=[0.22 * inch])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0, 0), (-1, -1), COLOR_GREEN_BAR),
        ("ALIGN",        (0, 0), (-1, -1), "LEFT"),
        ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING",  (0, 0), (-1, -1), 0.12 * inch),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING",   (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 4),
    ]))
    return tbl


# ---------------------------------------------------------------------------
# Helper: labeled input rows (label line + underline input line)
# ---------------------------------------------------------------------------
def labeled_input_rows(labels):
    """
    Returns a list of flowables: for each label, a bold Paragraph label
    followed by a hairline Table input row.
    """
    items = []
    for label in labels:
        # Label paragraph
        items.append(Paragraph(label, style_body_bold))
        # Input line: single-cell table with LINEBELOW
        input_data = [[""]]
        input_tbl = Table(input_data, colWidths=[CONTENT_W], rowHeights=[0.19 * inch])
        input_tbl.setStyle(TableStyle([
            ("LINEBELOW",    (0, 0), (-1, -1), 0.5, COLOR_HAIRLINE),
            ("TOPPADDING",   (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING",(0, 0), (-1, -1), 0),
            ("LEFTPADDING",  (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ]))
        items.append(input_tbl)
        items.append(Spacer(1, 0.02 * inch))
    return items


# ---------------------------------------------------------------------------
# Helper: numbered input rows (Table with number col + hairline input col)
# ---------------------------------------------------------------------------
def numbered_rows(n):
    """
    Returns a Table with n rows. Col 0: "N." label right-aligned.
    Col 1: blank cell with hairline LINEBELOW as input line.
    """
    NUM_COL  = 0.35 * inch
    LINE_COL = CONTENT_W - NUM_COL

    data = [
        [
            Paragraph(f"{i}.", ParagraphStyle(
                f"numcol_{i}",
                fontName="Helvetica-Bold",
                fontSize=9,
                leading=11,
                textColor=COLOR_INK,
                alignment=TA_RIGHT,
            )),
            ""
        ]
        for i in range(1, n + 1)
    ]

    tbl = Table(data, colWidths=[NUM_COL, LINE_COL], rowHeights=[0.26 * inch] * n)
    tbl.setStyle(TableStyle([
        ("FONTNAME",     (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE",     (0, 0), (0, -1), 9),
        ("ALIGN",        (0, 0), (0, -1), "RIGHT"),
        ("RIGHTPADDING", (0, 0), (0, -1), 0.08 * inch),
        ("VALIGN",       (0, 0), (0, -1), "BOTTOM"),
        ("LINEBELOW",    (1, 0), (1, -1), 0.5, COLOR_HAIRLINE),
        ("TOPPADDING",   (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 2),
        ("LEFTPADDING",  (1, 0), (1, -1), 4),
        ("RIGHTPADDING", (1, 0), (1, -1), 0),
        ("VALIGN",       (1, 0), (1, -1), "BOTTOM"),
    ]))
    return tbl


# ---------------------------------------------------------------------------
# Helper: checkbox row Table (for Sections II and IV)
# ---------------------------------------------------------------------------
def checkbox_rows(items_list, col_widths=None):
    """
    Single-column checkbox list.
    items_list: list of str labels.
    Returns a Table with cols [checkbox_w, label_w].
    """
    if col_widths is None:
        col_widths = [0.28 * inch, CONTENT_W - 0.28 * inch]

    data = [[checkbox_cell(), Paragraph(label, style_body)] for label in items_list]
    tbl = Table(data, colWidths=col_widths, rowHeights=[0.22 * inch] * len(data))
    tbl.setStyle(TableStyle([
        ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING",  (0, 0), (0, -1), 4),
        ("RIGHTPADDING", (0, 0), (0, -1), 4),
        ("LEFTPADDING",  (1, 0), (1, -1), 4),
        ("TOPPADDING",   (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 1),
    ]))
    return tbl


# ---------------------------------------------------------------------------
# Helper: NOTA IMPORTANTE panel (CRITICAL BUG FIX)
# ---------------------------------------------------------------------------
def nota_importante_panel():
    """
    Cream panel with gold left stripe and 3pt box.
    Contains: title, hint, spacer row, then 6 individual bullet rows.
    Each bullet is a physically distinct Table row — Certificado de Nacimiento
    and Certificado de Buena Conducta are SEPARATE rows with their own checkbox.
    """
    PAD = 0.14 * inch
    # Inner width = CONTENT_W minus left and right padding
    inner_w = CONTENT_W - 2 * PAD

    CHKBOX_COL = 0.28 * inch
    LETTER_COL = 0.32 * inch
    LABEL_COL  = inner_w - CHKBOX_COL - LETTER_COL

    bullets = [
        ("a.", "Resumé — trayectoria deportiva del candidato/a"),
        ("b.", "Semblanza"),
        ("c.", "Certificado de Nacimiento"),
        ("d.", "Certificado de Buena Conducta"),
        ("e.", "Artículos de prensa"),
        ("f.", "Otros documentos de apoyo"),
    ]

    # Build the inner bullets table
    bullet_data = [
        [
            checkbox_cell(),
            Paragraph(letter, style_nota_label),
            Paragraph(label, style_nota_text),
        ]
        for letter, label in bullets
    ]
    bullet_tbl = Table(
        bullet_data,
        colWidths=[CHKBOX_COL, LETTER_COL, LABEL_COL],
        rowHeights=[0.24 * inch] * len(bullets),
    )
    bullet_tbl.setStyle(TableStyle([
        ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING",  (0, 0), (0, -1), 0.10 * inch),
        ("RIGHTPADDING", (0, 0), (0, -1), 2),
        ("LEFTPADDING",  (1, 0), (1, -1), 2),
        ("RIGHTPADDING", (1, 0), (1, -1), 4),
        ("LEFTPADDING",  (2, 0), (2, -1), 2),
        ("RIGHTPADDING", (2, 0), (2, -1), 0),
        ("TOPPADDING",   (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 1),
    ]))

    # The panel is a single outer Table with one wide column.
    # We pack everything into a single cell and apply the background + border.
    panel_content = [
        [Paragraph("NOTA IMPORTANTE", style_nota_title)],
        [Paragraph(
            "Deberá incluir los siguientes documentos del candidato/a deportista:",
            style_nota_hint,
        )],
        [Spacer(1, 0.06 * inch)],
        [bullet_tbl],
    ]
    panel_tbl = Table(
        panel_content,
        colWidths=[CONTENT_W],
    )
    panel_tbl.setStyle(TableStyle([
        ("BACKGROUND",   (0, 0), (-1, -1), COLOR_NOTA_BG),
        ("BOX",          (0, 0), (-1, -1), 0.5, COLOR_HAIRLINE),
        ("LINEBEFORE",   (0, 0), (-1, -1), 3, COLOR_GOLD),
        ("LEFTPADDING",  (0, 0), (-1, -1), PAD),
        ("RIGHTPADDING", (0, 0), (-1, -1), PAD),
        ("TOPPADDING",   (0, 0), (0, 0),   PAD),          # top padding on first row
        ("TOPPADDING",   (0, 1), (-1, -1), 4),
        ("BOTTOMPADDING",(0, -1), (-1, -1), PAD),         # bottom padding on last row
        ("BOTTOMPADDING",(0, 0), (-1, -2), 4),
        ("VALIGN",       (0, 0), (-1, -1), "TOP"),
    ]))
    return panel_tbl


# ---------------------------------------------------------------------------
# Helper: Entrega block
# ---------------------------------------------------------------------------
def entrega_block():
    """Small framed block with delivery instructions."""
    inner = [
        [Paragraph("ENTREGA", style_entrega_title)],
        [Paragraph(
            "Envíe digitalmente a informa@pfdh.org o entregue en persona en el Museo "
            "Manuel Rivera Guevara, Centro Cultural Dra. Antonia Sáez, Humacao, PR. "
            "Lunes a viernes, 8:00 AM – 4:00 PM. Tel: 787-410-1237.",
            style_entrega_body,
        )],
    ]
    tbl = Table(inner, colWidths=[CONTENT_W])
    tbl.setStyle(TableStyle([
        ("BOX",          (0, 0), (-1, -1), 0.5, COLOR_HAIRLINE),
        ("LEFTPADDING",  (0, 0), (-1, -1), 0.12 * inch),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0.12 * inch),
        ("TOPPADDING",   (0, 0), (0, 0),   6),
        ("TOPPADDING",   (0, 1), (-1, -1), 3),
        ("BOTTOMPADDING",(0, -1),(-1, -1), 6),
        ("BOTTOMPADDING",(0, 0), (-1, -2), 3),
    ]))
    return tbl


# ---------------------------------------------------------------------------
# Build the full story
# ---------------------------------------------------------------------------
def build_story():
    story = []
    SP_SECTION = Spacer(1, 0.06 * inch)  # between sections (tightened)
    SP_FIELD   = Spacer(1, 0.04 * inch)  # between fields within a section

    # -------------------------------------------------------------------
    # TITLE BLOCK (Page 1)
    # -------------------------------------------------------------------
    # 1. Logo
    logo = PlatypusImage(LOGO_PATH)
    aspect = 191.0 / 256.0
    logo.drawHeight = 0.60 * inch
    logo.drawWidth  = 0.60 * inch * aspect
    logo.hAlign = "CENTER"
    story.append(logo)

    # 2. Spacer
    story.append(Spacer(1, 0.04 * inch))

    # 3. Title
    story.append(Paragraph(
        "BOLETA DE NOMINACIÓN",
        ParagraphStyle(
            "title",
            fontName="Times-Bold",
            fontSize=18,
            leading=21,
            textColor=COLOR_INK,
            alignment=TA_CENTER,
            spaceAfter=0,
        ),
    ))

    # 4. Spacer
    story.append(Spacer(1, 0.02 * inch))

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

    # 6. Spacer
    story.append(Spacer(1, 0.02 * inch))

    # 7. Gold ornamental rule
    story.append(Paragraph(
        "&#9670;&nbsp;&nbsp;&nbsp;&nbsp;&#9670;&nbsp;&nbsp;&nbsp;&nbsp;&#9670;",
        ParagraphStyle(
            "ornament",
            fontName="Helvetica",
            fontSize=10,
            leading=13,
            textColor=COLOR_GOLD,
            alignment=TA_CENTER,
        ),
    ))

    # 8. Spacer + 9. Horizontal gold hairline rule
    story.append(Spacer(1, 0.02 * inch))
    story.append(HRFlowable(
        width="60%",
        thickness=0.75,
        color=COLOR_GOLD,
        lineCap="round",
        spaceBefore=0.01 * inch,
        spaceAfter=0.02 * inch,
        hAlign="CENTER",
    ))

    # 10. Spacer
    story.append(Spacer(1, 0.03 * inch))

    # 11. Intro paragraph
    story.append(Paragraph(
        "Complete esta boleta para nominar a un candidato/a a ser exaltado/a al Pabellón. "
        "Cada nominación debe incluir los documentos de evidencia requeridos.",
        style_intro,
    ))

    # 12. Spacer
    story.append(Spacer(1, 0.06 * inch))

    # -------------------------------------------------------------------
    # SECTION I — DATOS DEL CANDIDATO/A
    # -------------------------------------------------------------------
    sec1_header = section_header("I. Datos del Candidato/a")
    sec1_content = labeled_input_rows([
        "Nombre completo:",
        "Dirección:",
        "Dirección (cont.):",
        "Fecha de nacimiento:",
        "Lugar de nacimiento:",
    ])
    story.append(KeepTogether([sec1_header, Spacer(1, 0.04 * inch)] + sec1_content[:2]))
    story.extend(sec1_content[2:])
    story.append(SP_SECTION)

    # -------------------------------------------------------------------
    # SECTION II — CATEGORÍA DEL PROPONENTE DEL DEPORTE
    # -------------------------------------------------------------------
    sec2_header = section_header("II. Categoría del Proponente del Deporte")
    sec2_hint   = Paragraph("Marque con una (X) la categoría correspondiente:", style_hint)
    sec2_checks = checkbox_rows([
        "Como Practicante del deporte (atleta)",
        "Como Propulsor del Deporte",
        "Cronista deportivo",
    ])
    story.append(KeepTogether([
        sec2_header,
        Spacer(1, 0.04 * inch),
        sec2_hint,
        Spacer(1, 0.04 * inch),
        sec2_checks,
    ]))
    story.append(SP_SECTION)

    # -------------------------------------------------------------------
    # SECTION III — DEPORTES Y PARTICIPACIÓN
    # -------------------------------------------------------------------
    sec3_header = section_header("III. Deportes y Participación")
    sec3_hint   = Paragraph("Mencione el/los deportes y la fecha en que participó:", style_hint)

    # Column widths for the sports table
    COL_DEPORTE = 4.80 * inch
    COL_FECHA   = 1.50 * inch
    COL_ANIO    = CONTENT_W - COL_DEPORTE - COL_FECHA  # 1.10"

    header_style_cell = ParagraphStyle(
        "tbl_hdr",
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=11,
        textColor=COLOR_INK,
        alignment=TA_CENTER,
    )
    col0_style = ParagraphStyle(
        "tbl_col0",
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=11,
        textColor=COLOR_INK,
        alignment=TA_LEFT,
    )

    sec3_data = [
        [
            Paragraph("DEPORTE", header_style_cell),
            Paragraph("FECHA",   header_style_cell),
            Paragraph("AÑO",     header_style_cell),
        ]
    ] + [
        [Paragraph(f"  {i}.", col0_style), "", ""]
        for i in range(1, 7)
    ]

    sec3_tbl = Table(
        sec3_data,
        colWidths=[COL_DEPORTE, COL_FECHA, COL_ANIO],
        rowHeights=[0.22 * inch] + [0.26 * inch] * 6,
    )
    sec3_tbl.setStyle(TableStyle([
        # Header row
        ("BACKGROUND",   (0, 0), (-1, 0),  COLOR_SECTION_TINT),
        ("LINEBELOW",    (0, 0), (-1, 0),  1.0, COLOR_GOLD),
        ("FONTNAME",     (0, 0), (-1, 0),  "Helvetica-Bold"),
        ("ALIGN",        (0, 0), (-1, 0),  "CENTER"),
        ("VALIGN",       (0, 0), (-1, 0),  "MIDDLE"),
        # Body rows
        ("ALIGN",        (0, 1), (0, -1),  "LEFT"),
        ("ALIGN",        (1, 1), (2, -1),  "CENTER"),
        ("VALIGN",       (0, 1), (-1, -1), "BOTTOM"),
        # Grid
        ("GRID",         (0, 0), (-1, -1), 0.5, COLOR_HAIRLINE),
        ("BOX",          (0, 0), (-1, -1), 0.75, COLOR_HAIRLINE),
        # Padding
        ("LEFTPADDING",  (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING",   (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 2),
    ]))

    story.append(KeepTogether([
        sec3_header,
        Spacer(1, 0.04 * inch),
        sec3_hint,
        Spacer(1, 0.04 * inch),
        sec3_tbl,
    ]))
    story.append(SP_SECTION)

    # -------------------------------------------------------------------
    # SECTION IV — COMPETENCIAS INTERNACIONALES
    # -------------------------------------------------------------------
    sec4_header = section_header("IV. Competencias Internacionales")
    sec4_hint   = Paragraph(
        "Marque con una (X) las competencias en las que participó:", style_hint
    )

    CB_W = 0.28 * inch
    LBL_W = (CONTENT_W - 2 * CB_W) / 2  # ~3.42"

    sec4_grid_data = [
        [checkbox_cell(), Paragraph("Juegos Olímpicos", style_body),
         checkbox_cell(), Paragraph("Campeonatos Mundiales", style_body)],
        [checkbox_cell(), Paragraph("Juegos Panamericanos", style_body),
         checkbox_cell(), Paragraph("Campeonatos Panamericanos", style_body)],
        [checkbox_cell(), Paragraph("Juegos Centroamericanos y del Caribe", style_body),
         checkbox_cell(), Paragraph("Pre Olímpico", style_body)],
    ]
    sec4_grid = Table(
        sec4_grid_data,
        colWidths=[CB_W, LBL_W, CB_W, LBL_W],
        rowHeights=[0.22 * inch] * 3,
    )
    sec4_grid.setStyle(TableStyle([
        ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING",  (0, 0), (0, -1), 4),
        ("RIGHTPADDING", (0, 0), (0, -1), 2),
        ("LEFTPADDING",  (2, 0), (2, -1), 8),
        ("RIGHTPADDING", (2, 0), (2, -1), 2),
        ("LEFTPADDING",  (1, 0), (1, -1), 4),
        ("LEFTPADDING",  (3, 0), (3, -1), 4),
        ("TOPPADDING",   (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 1),
    ]))

    # "Otros" labeled input row
    otros_label = Paragraph("Otros (mencione):", style_body_bold)
    otros_input_data = [[""]]
    otros_input = Table(otros_input_data, colWidths=[CONTENT_W], rowHeights=[0.20 * inch])
    otros_input.setStyle(TableStyle([
        ("LINEBELOW",    (0, 0), (-1, -1), 0.5, COLOR_HAIRLINE),
        ("TOPPADDING",   (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 0),
        ("LEFTPADDING",  (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))

    story.append(KeepTogether([
        sec4_header,
        Spacer(1, 0.04 * inch),
        sec4_hint,
        Spacer(1, 0.04 * inch),
        sec4_grid,
        Spacer(1, 0.06 * inch),
        otros_label,
        otros_input,
    ]))
    story.append(SP_SECTION)

    # -------------------------------------------------------------------
    # SECTION V — COMPETENCIAS NACIONALES, REGIONALES O LOCALES
    # -------------------------------------------------------------------
    sec5_header = section_header("V. Competencias Nacionales, Regionales o Locales")
    sec5_hint   = Paragraph("Mencione:", style_hint)
    sec5_rows   = numbered_rows(3)

    story.append(KeepTogether([
        sec5_header,
        Spacer(1, 0.04 * inch),
        sec5_hint,
        Spacer(1, 0.04 * inch),
        sec5_rows,
    ]))
    story.append(SP_SECTION)

    # -------------------------------------------------------------------
    # Natural pagination break between Sec V (page 1) and Sec VI (page 2).
    # No forced PageBreak — we rely on tightened spacers to let ReportLab
    # flow I-V onto page 1 and VI-VIII onto page 2.
    # -------------------------------------------------------------------

    # -------------------------------------------------------------------
    # SECTION VI — POSICIONES EN COMITÉS O JUNTAS DIRECTIVAS
    # -------------------------------------------------------------------
    sec6_header = section_header("VI. Posiciones en Comités o Juntas Directivas")
    sec6_hint   = Paragraph(
        "Posiciones ocupadas en comités o Juntas Directivas de organizaciones deportivas:",
        style_hint,
    )
    sec6_rows   = numbered_rows(3)

    story.append(KeepTogether([
        sec6_header,
        Spacer(1, 0.04 * inch),
        sec6_hint,
        Spacer(1, 0.04 * inch),
        sec6_rows,
    ]))
    story.append(SP_SECTION)

    # -------------------------------------------------------------------
    # SECTION VII — RECONOCIMIENTOS O PREMIOS OBTENIDOS
    # -------------------------------------------------------------------
    sec7_header = section_header("VII. Reconocimientos o Premios Obtenidos")
    sec7_hint   = Paragraph(
        "Reconocimientos o premios obtenidos en el deporte:", style_hint
    )
    sec7_rows   = numbered_rows(3)

    story.append(KeepTogether([
        sec7_header,
        Spacer(1, 0.04 * inch),
        sec7_hint,
        Spacer(1, 0.04 * inch),
        sec7_rows,
    ]))
    story.append(SP_SECTION)

    # -------------------------------------------------------------------
    # NOTA IMPORTANTE panel (CRITICAL BUG FIX)
    # -------------------------------------------------------------------
    story.append(nota_importante_panel())
    story.append(SP_SECTION)

    # -------------------------------------------------------------------
    # Entrega block
    # -------------------------------------------------------------------
    story.append(entrega_block())
    story.append(SP_SECTION)

    # -------------------------------------------------------------------
    # SECTION VIII — DATOS DEL PROPONENTE
    # -------------------------------------------------------------------
    sec8_header = section_header("VIII. Datos del Proponente")
    sec8_content = labeled_input_rows([
        "Nombre del proponente:",
        "Firma del proponente:",
        "Dirección y teléfono:",
        "Correo electrónico:",
        "Fecha de nominación:",
    ])
    story.append(KeepTogether([sec8_header, Spacer(1, 0.04 * inch)] + sec8_content[:2]))
    story.extend(sec8_content[2:])
    story.append(SP_SECTION)

    # -------------------------------------------------------------------
    # Closing reminder
    # -------------------------------------------------------------------
    story.append(Paragraph(
        "Múltiples nominaciones para un mismo candidato fortalecen la candidatura. "
        "El período de nominación será anunciado por la Junta de Directores del Pabellón.",
        style_closing,
    ))

    return story


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    # Build document
    doc = BaseDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        leftMargin=MARGIN_L,
        rightMargin=MARGIN_R,
        topMargin=MARGIN_T,
        bottomMargin=MARGIN_B,
        title="Boleta de Nominación — Pabellón de la Fama del Deporte Humacaeño",
        author="Pabellón de la Fama del Deporte Humacaeño",
        subject="Nominación al Pabellón de la Fama",
    )

    # Single frame for content
    frame = Frame(
        MARGIN_L,
        MARGIN_B,
        PAGE_W - MARGIN_L - MARGIN_R,  # 7.40"
        PAGE_H - MARGIN_T - MARGIN_B,  # frame height
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="content",
    )

    doc.addPageTemplates([
        PageTemplate(id="main", frames=[frame], onPage=draw_page_frame)
    ])

    story = build_story()
    doc.build(story)

    # -------------------------------------------------------------------
    # Verify page count — fail loud if != 2
    # -------------------------------------------------------------------
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

    if pages != 2:
        print(
            f"ERROR: expected exactly 2 pages, got {pages}. "
            f"Adjust content to fit 2 pages exactly.",
            file=sys.stderr,
        )
        sys.exit(1)

    size_kb = os.path.getsize(OUTPUT_PATH) / 1024
    print(f"OK: wrote {OUTPUT_PATH} ({size_kb:.1f} KB, {pages} pages)")


if __name__ == "__main__":
    main()
