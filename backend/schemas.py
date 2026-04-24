import json
from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, field_validator


# ── Templates ────────────────────────────────────────────────────────────────

class TemplateSection(BaseModel):
    title: str
    description: str
    required: bool = True


class TemplateCreate(BaseModel):
    name: str
    sections: List[TemplateSection]
    is_default: bool = False


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    sections: Optional[List[TemplateSection]] = None
    is_default: Optional[bool] = None


class TemplateOut(BaseModel):
    id: int
    name: str
    sections: List[TemplateSection]
    is_default: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("sections", mode="before")
    @classmethod
    def parse_sections(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v


# ── Runs ─────────────────────────────────────────────────────────────────────

class RunCreate(BaseModel):
    program_names: List[str]
    template_id: Optional[int] = None
    model: str = "claude-sonnet-4-6"


class RunOut(BaseModel):
    id: int
    program_names: List[str]
    template_id: Optional[int]
    status: str
    created_at: datetime
    completed_at: Optional[datetime]

    model_config = {"from_attributes": True}

    @field_validator("program_names", mode="before")
    @classmethod
    def parse_names(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v


# ── Documents ─────────────────────────────────────────────────────────────────

class DocumentOut(BaseModel):
    id: int
    run_id: Optional[int]
    parent_id: Optional[int]
    program_name: str
    faculty: Optional[str]
    department: Optional[str]
    program_url: Optional[str]
    generated_content: Optional[str]
    accuracy_critique: Optional[str]
    template_critique: Optional[str]
    word_doc_path: Optional[str]
    status: str
    is_deleted: bool
    label: Optional[str]
    correction_prompt: Optional[str]
    model: Optional[str] = "claude-sonnet-4-6"
    version: int
    created_at: datetime
    children: List["DocumentOut"] = []

    model_config = {"from_attributes": True}


class RunAgainRequest(BaseModel):
    correction_prompt: str
    model: str = "claude-sonnet-4-6"
