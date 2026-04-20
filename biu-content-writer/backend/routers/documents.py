import asyncio
import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session

from database import get_db, Document, Template
from schemas import DocumentOut, RunAgainRequest
from services.orchestrator import process_document
from routers.runs import _sse_queues, _notify

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.get("", response_model=list[DocumentOut])
def list_documents(db: Session = Depends(get_db)):
    docs = (
        db.query(Document)
        .filter(Document.is_deleted == False, Document.parent_id == None)
        .order_by(Document.created_at.desc())
        .all()
    )
    return docs


@router.get("/{doc_id}", response_model=DocumentOut)
def get_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id, Document.is_deleted == False).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.delete("/{doc_id}", status_code=204)
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.is_deleted = True
    db.commit()


@router.post("/{doc_id}/run-again", response_model=DocumentOut, status_code=201)
def run_again(doc_id: int, body: RunAgainRequest, db: Session = Depends(get_db)):
    original = db.query(Document).filter(Document.id == doc_id, Document.is_deleted == False).first()
    if not original:
        raise HTTPException(status_code=404, detail="Document not found")

    new_doc = Document(
        run_id=original.run_id,
        parent_id=original.id,
        program_name=original.program_name,
        faculty=original.faculty,
        department=original.department,
        program_url=original.program_url,
        raw_scraped_content=original.raw_scraped_content,  # reuse scraped content
        correction_prompt=body.correction_prompt,
        label="edited",
        version=(original.version or 1) + 1,
        status="pending",
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    # Determine template
    template = None
    if original.run_id:
        from database import GenerationRun
        run = db.query(GenerationRun).filter(GenerationRun.id == original.run_id).first()
        if run and run.template_id:
            template = db.query(Template).filter(Template.id == run.template_id).first()
    if not template:
        template = db.query(Template).filter(Template.is_default == True).first()

    # Run pipeline in background thread
    import threading
    def _bg():
        from database import SessionLocal
        bg_db = SessionLocal()
        try:
            bg_doc = bg_db.query(Document).filter(Document.id == new_doc.id).first()
            bg_tmpl = bg_db.query(Template).filter(Template.id == template.id).first()
            process_document(bg_db, bg_doc, bg_tmpl, notify=_notify)
        finally:
            bg_db.close()

    threading.Thread(target=_bg, daemon=True).start()
    return new_doc


@router.get("/{doc_id}/download")
def download_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id, Document.is_deleted == False).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if not doc.word_doc_path or not os.path.exists(doc.word_doc_path):
        raise HTTPException(status_code=404, detail="Word document not yet generated")
    filename = os.path.basename(doc.word_doc_path)
    return FileResponse(
        path=doc.word_doc_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=filename,
    )


@router.get("/{doc_id}/stream")
async def stream_document_status(doc_id: int, db: Session = Depends(get_db)):
    """SSE endpoint for real-time status updates on a document."""
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    queue: asyncio.Queue = asyncio.Queue()
    _sse_queues.setdefault(doc_id, []).append(queue)

    async def event_generator():
        try:
            # Send current status immediately
            yield f"data: {doc.status}\n\n"
            if doc.status in ("approved", "failed"):
                return
            while True:
                try:
                    status = await asyncio.wait_for(queue.get(), timeout=30)
                    yield f"data: {status}\n\n"
                    if status in ("approved", "failed"):
                        break
                except asyncio.TimeoutError:
                    yield "data: ping\n\n"
        finally:
            queues = _sse_queues.get(doc_id, [])
            if queue in queues:
                queues.remove(queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
