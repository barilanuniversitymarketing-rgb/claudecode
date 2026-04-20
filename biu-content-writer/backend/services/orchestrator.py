import asyncio
import json
from datetime import datetime
from typing import Callable

from sqlalchemy.orm import Session

from database import Document, GenerationRun, Template
from agents.faculty_finder import find_faculty
from agents.web_scraper import scrape_sync
from agents.content_writer import write_content
from agents.accuracy_critic import check_accuracy
from agents.template_critic import check_template
from services.docx_generator import generate_docx

MAX_CRITIQUE_RETRIES = 3


def _update_status(db: Session, doc: Document, status: str, notify: Callable | None = None):
    doc.status = status
    db.commit()
    if notify:
        notify(doc.id, status)


def process_document(
    db: Session,
    doc: Document,
    template: Template,
    notify: Callable | None = None,
) -> Document:
    """Run the full pipeline for a single document. Mutates doc in place."""
    sections = template.get_sections()

    # ── Step 1: Faculty Finder ────────────────────────────────────────────────
    if not doc.raw_scraped_content:
        _update_status(db, doc, "scraping", notify)
        try:
            info = find_faculty(doc.program_name)
            doc.faculty = info.get("faculty")
            doc.department = info.get("department")
            doc.program_url = info.get("program_url")
            db.commit()

            # ── Step 2: Web Scraper ───────────────────────────────────────────
            if doc.program_url:
                try:
                    raw = scrape_sync(doc.program_url)
                    doc.raw_scraped_content = raw
                except Exception as e:
                    doc.raw_scraped_content = f"שגיאה בגרידה: {e}"
            else:
                doc.raw_scraped_content = f"לא נמצא URL עבור: {doc.program_name}"
            db.commit()
        except Exception as e:
            doc.status = "failed"
            doc.raw_scraped_content = f"שגיאה: {e}"
            db.commit()
            return doc

    # ── Step 3–5: Write → Accuracy → Template (with retries) ─────────────────
    _update_status(db, doc, "writing", notify)

    for attempt in range(MAX_CRITIQUE_RETRIES):
        # Write content
        try:
            content = write_content(
                program_name=doc.program_name,
                raw_scraped_content=doc.raw_scraped_content or "",
                template_sections=sections,
                correction_prompt=doc.correction_prompt,
            )
            doc.generated_content = content
            db.commit()
        except Exception as e:
            doc.status = "failed"
            db.commit()
            return doc

        # Accuracy critique
        _update_status(db, doc, "reviewing_accuracy", notify)
        accuracy = check_accuracy(
            program_name=doc.program_name,
            generated_content=content,
            raw_scraped_content=doc.raw_scraped_content or "",
        )
        doc.accuracy_critique = json.dumps(accuracy, ensure_ascii=False)
        db.commit()

        if not accuracy.get("passed"):
            # Inject issues as a correction prompt addendum for next iteration
            issues_text = "\n".join(accuracy.get("issues", []))
            doc.correction_prompt = (
                (doc.correction_prompt or "")
                + f"\n\nתיקוני דיוק נדרשים:\n{issues_text}"
            )
            db.commit()
            _update_status(db, doc, "writing", notify)
            continue

        # Template critique
        _update_status(db, doc, "reviewing_template", notify)
        tmpl = check_template(
            generated_content=content,
            template_sections=sections,
        )
        doc.template_critique = json.dumps(tmpl, ensure_ascii=False)
        db.commit()

        if not tmpl.get("passed"):
            issues_text = "\n".join(tmpl.get("issues", []))
            doc.correction_prompt = (
                (doc.correction_prompt or "")
                + f"\n\nתיקוני תבנית נדרשים:\n{issues_text}"
            )
            db.commit()
            _update_status(db, doc, "writing", notify)
            continue

        # Both passed — generate docx
        try:
            doc_path = generate_docx(doc.id, doc.program_name, content)
            doc.word_doc_path = doc_path
        except Exception:
            pass  # docx failure is non-fatal; user can still view content
        doc.status = "approved"
        db.commit()
        if notify:
            notify(doc.id, "approved")
        return doc

    # Exhausted retries
    doc.status = "failed"
    db.commit()
    if notify:
        notify(doc.id, "failed")
    return doc


def run_pipeline(
    db: Session,
    run: GenerationRun,
    notify: Callable | None = None,
):
    """Process all documents in a run sequentially."""
    run.status = "running"
    db.commit()

    template = None
    if run.template_id:
        template = db.query(Template).filter(Template.id == run.template_id).first()
    if not template:
        template = db.query(Template).filter(Template.is_default == True).first()

    for doc in run.documents:
        if doc.is_deleted:
            continue
        process_document(db, doc, template, notify)

    # Mark run complete/failed
    statuses = [d.status for d in run.documents if not d.is_deleted]
    run.status = "completed" if all(s == "approved" for s in statuses) else "completed"
    run.completed_at = datetime.utcnow()
    db.commit()
