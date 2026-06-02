#!/usr/bin/env python3
"""Render the LLM fine-tuning operations guide Markdown to PDF."""

from __future__ import annotations

import re
import textwrap
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
)
from reportlab.platypus.flowables import HRFlowable


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "GUIA-OPERATIVA-FINETUNING-LLM-HARDWARE-LIMITADO.md"
OUTPUT = ROOT / "docs" / "GUIA-OPERATIVA-FINETUNING-LLM-HARDWARE-LIMITADO.pdf"


def escape(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def inline_markup(text: str) -> str:
    text = escape(text)
    text = re.sub(r"`([^`]+)`", r"<font name='Courier'>\1</font>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    return text


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "GuideTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=27,
            spaceAfter=14,
            textColor=colors.HexColor("#172033"),
        ),
        "h1": ParagraphStyle(
            "GuideH1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=19,
            spaceBefore=14,
            spaceAfter=7,
            textColor=colors.HexColor("#1f3a5f"),
        ),
        "h2": ParagraphStyle(
            "GuideH2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=16,
            spaceBefore=10,
            spaceAfter=5,
            textColor=colors.HexColor("#284b70"),
        ),
        "body": ParagraphStyle(
            "GuideBody",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=12.4,
            spaceAfter=5.5,
        ),
        "bullet": ParagraphStyle(
            "GuideBullet",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=12.2,
            leftIndent=14,
            firstLineIndent=-8,
            spaceAfter=3.5,
        ),
        "code": ParagraphStyle(
            "GuideCode",
            parent=base["Code"],
            fontName="Courier",
            fontSize=7.2,
            leading=8.6,
            leftIndent=6,
            rightIndent=6,
            borderPadding=5,
            borderColor=colors.HexColor("#d8dee9"),
            borderWidth=0.4,
            backColor=colors.HexColor("#f6f8fa"),
            spaceBefore=4,
            spaceAfter=7,
        ),
        "meta": ParagraphStyle(
            "GuideMeta",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#5c667a"),
            spaceAfter=10,
        ),
    }


def flush_paragraph(lines: list[str], story: list, styles: dict[str, ParagraphStyle]) -> None:
    if not lines:
        return
    text = " ".join(line.strip() for line in lines).strip()
    if text:
        story.append(Paragraph(inline_markup(text), styles["body"]))
    lines.clear()


def wrap_code_block(code: str) -> str:
    wrapped: list[str] = []
    for raw_line in code.splitlines():
        if len(raw_line) <= 96:
            wrapped.append(raw_line)
            continue
        chunks = textwrap.wrap(
            raw_line,
            width=96,
            replace_whitespace=False,
            drop_whitespace=False,
            break_long_words=True,
            subsequent_indent="    ",
        )
        wrapped.extend(chunks or [""])
    return "\n".join(wrapped)


def build_story(markdown: str) -> list:
    styles = make_styles()
    story: list = []
    paragraph_lines: list[str] = []
    code_lines: list[str] = []
    in_code = False
    first_heading = True

    for line in markdown.splitlines():
        stripped = line.strip()

        if stripped.startswith("```"):
            if in_code:
                code = wrap_code_block("\n".join(code_lines))
                story.append(Preformatted(escape(code), styles["code"]))
                code_lines.clear()
                in_code = False
            else:
                flush_paragraph(paragraph_lines, story, styles)
                in_code = True
            continue

        if in_code:
            code_lines.append(line)
            continue

        if not stripped:
            flush_paragraph(paragraph_lines, story, styles)
            continue

        if stripped.startswith("# "):
            flush_paragraph(paragraph_lines, story, styles)
            if not first_heading:
                story.append(PageBreak())
            story.append(Paragraph(inline_markup(stripped[2:]), styles["title"]))
            story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#c9d3e0"), spaceAfter=10))
            first_heading = False
            continue

        if stripped.startswith("## "):
            flush_paragraph(paragraph_lines, story, styles)
            story.append(Paragraph(inline_markup(stripped[3:]), styles["h1"]))
            continue

        if stripped.startswith("### "):
            flush_paragraph(paragraph_lines, story, styles)
            story.append(Paragraph(inline_markup(stripped[4:]), styles["h2"]))
            continue

        if stripped.startswith("- "):
            flush_paragraph(paragraph_lines, story, styles)
            story.append(Paragraph("• " + inline_markup(stripped[2:]), styles["bullet"]))
            continue

        paragraph_lines.append(line)

    flush_paragraph(paragraph_lines, story, styles)
    if code_lines:
        story.append(Preformatted(escape(wrap_code_block("\n".join(code_lines))), styles["code"]))
    story.append(Spacer(1, 0.2 * cm))
    return story


def footer(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#667085"))
    canvas.drawString(1.6 * cm, 1.05 * cm, "Guia operativa de fine-tuning LLM en hardware limitado")
    canvas.drawRightString(A4[0] - 1.6 * cm, 1.05 * cm, f"Pagina {doc.page}")
    canvas.restoreState()


def main() -> int:
    markdown = SOURCE.read_text(encoding="utf-8")
    story = build_story(markdown)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=1.55 * cm,
        leftMargin=1.55 * cm,
        topMargin=1.45 * cm,
        bottomMargin=1.65 * cm,
        title="Guia operativa de fine-tuning LLM en hardware limitado",
        author="Koala Software Operations",
    )
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(f"Wrote {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
