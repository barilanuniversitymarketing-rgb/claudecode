import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db, Template
from schemas import TemplateCreate, TemplateUpdate, TemplateOut

router = APIRouter(prefix="/api/templates", tags=["templates"])


@router.get("", response_model=list[TemplateOut])
def list_templates(db: Session = Depends(get_db)):
    return db.query(Template).order_by(Template.created_at.desc()).all()


@router.post("", response_model=TemplateOut, status_code=201)
def create_template(body: TemplateCreate, db: Session = Depends(get_db)):
    if body.is_default:
        db.query(Template).filter(Template.is_default == True).update({"is_default": False})
    t = Template(
        name=body.name,
        sections=json.dumps([s.model_dump() for s in body.sections], ensure_ascii=False),
        is_default=body.is_default,
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@router.put("/{template_id}", response_model=TemplateOut)
def update_template(template_id: int, body: TemplateUpdate, db: Session = Depends(get_db)):
    t = db.query(Template).filter(Template.id == template_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Template not found")
    if body.name is not None:
        t.name = body.name
    if body.sections is not None:
        t.sections = json.dumps([s.model_dump() for s in body.sections], ensure_ascii=False)
    if body.is_default is not None:
        if body.is_default:
            db.query(Template).filter(Template.is_default == True).update({"is_default": False})
        t.is_default = body.is_default
    db.commit()
    db.refresh(t)
    return t


@router.delete("/{template_id}", status_code=204)
def delete_template(template_id: int, db: Session = Depends(get_db)):
    t = db.query(Template).filter(Template.id == template_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Template not found")
    db.delete(t)
    db.commit()
