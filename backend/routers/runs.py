import json
from concurrent.futures import ThreadPoolExecutor
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session

from database import get_db, GenerationRun, Document, Template
from schemas import RunCreate, RunOut
from services.orchestrator import run_pipeline

router = APIRouter(prefix="/api/runs", tags=["runs"])

_executor = ThreadPoolExecutor(max_workers=4)

# In-memory SSE notification registry: doc_id -> list of queues
_sse_queues: dict[int, list] = {}


def _notify(doc_id: int, status: str):
    import asyncio
    queues = _sse_queues.get(doc_id, [])
    for q in queues:
        try:
            q.put_nowait(status)
        except Exception:
            pass


def _run_pipeline_thread(run_id: int):
    from database import SessionLocal
    db = SessionLocal()
    try:
        run = db.query(GenerationRun).filter(GenerationRun.id == run_id).first()
        if run:
            run_pipeline(db, run, notify=_notify)
    finally:
        db.close()


@router.post("", response_model=RunOut, status_code=201)
def create_run(body: RunCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Verify template exists if provided
    if body.template_id:
        tmpl = db.query(Template).filter(Template.id == body.template_id).first()
        if not tmpl:
            raise HTTPException(status_code=404, detail="Template not found")

    run = GenerationRun(
        program_names=json.dumps(body.program_names, ensure_ascii=False),
        template_id=body.template_id,
        status="pending",
    )
    db.add(run)
    db.flush()

    for name in body.program_names:
        doc = Document(run_id=run.id, program_name=name.strip(), status="pending", model=body.model)
        db.add(doc)

    db.commit()
    db.refresh(run)

    background_tasks.add_task(_run_pipeline_thread, run.id)
    return run


@router.get("", response_model=list[RunOut])
def list_runs(db: Session = Depends(get_db)):
    return db.query(GenerationRun).order_by(GenerationRun.created_at.desc()).all()


@router.get("/{run_id}", response_model=RunOut)
def get_run(run_id: int, db: Session = Depends(get_db)):
    run = db.query(GenerationRun).filter(GenerationRun.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run
