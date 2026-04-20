import os
import re
from docx import Document as DocxDocument
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

DOCS_DIR = os.environ.get("DOCS_DIR", "./docs")


def _ensure_docs_dir():
    os.makedirs(DOCS_DIR, exist_ok=True)


def _set_rtl(paragraph):
    """Set paragraph direction to RTL for Hebrew text."""
    pPr = paragraph._p.get_or_add_pPr()
    bidi = OxmlElement("w:bidi")
    pPr.append(bidi)
    jc = OxmlElement("w:jc")
    jc.set(qn("w:val"), "right")
    pPr.append(jc)


def _add_heading(doc: DocxDocument, text: str, level: int = 1):
    heading = doc.add_heading(text, level=level)
    _set_rtl(heading)
    for run in heading.runs:
        run.font.name = "Arial"
        run.font.color.rgb = RGBColor(0x1A, 0x3A, 0x5C)  # BIU dark blue


def _add_body(doc: DocxDocument, text: str):
    para = doc.add_paragraph(text)
    _set_rtl(para)
    for run in para.runs:
        run.font.name = "Arial"
        run.font.size = Pt(11)


def generate_docx(document_id: int, program_name: str, content_markdown: str) -> str:
    """Convert markdown content to .docx and return the file path."""
    _ensure_docs_dir()

    doc = DocxDocument()

    # Set default RTL for whole document
    settings = doc.settings.element
    bidi_default = OxmlElement("w:defaultTabStop")
    bidi_default.set(qn("w:val"), "720")
    settings.append(bidi_default)

    # Title
    title = doc.add_heading(program_name, 0)
    _set_rtl(title)
    for run in title.runs:
        run.font.name = "Arial"
        run.font.size = Pt(20)
        run.font.color.rgb = RGBColor(0x1A, 0x3A, 0x5C)

    # Parse and render markdown sections
    lines = content_markdown.splitlines()
    buffer = []

    def flush_buffer():
        if buffer:
            text = " ".join(buffer).strip()
            if text:
                _add_body(doc, text)
            buffer.clear()

    for line in lines:
        if line.startswith("## "):
            flush_buffer()
            _add_heading(doc, line[3:].strip(), level=2)
        elif line.startswith("### "):
            flush_buffer()
            _add_heading(doc, line[4:].strip(), level=3)
        elif line.startswith("- ") or line.startswith("* "):
            flush_buffer()
            item = doc.add_paragraph(line[2:].strip(), style="List Bullet")
            _set_rtl(item)
            for run in item.runs:
                run.font.name = "Arial"
                run.font.size = Pt(11)
        elif line.strip() == "":
            flush_buffer()
        else:
            buffer.append(line.strip())

    flush_buffer()

    filename = f"{document_id}_{re.sub(r'[^\\w]', '_', program_name)[:40]}.docx"
    filepath = os.path.join(DOCS_DIR, filename)
    doc.save(filepath)
    return filepath
