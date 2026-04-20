import json
from datetime import datetime
from sqlalchemy import (
    create_engine, Column, Integer, String, Boolean, DateTime, Text, ForeignKey
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = "sqlite:///./biu_content.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sections = Column(Text, nullable=False)  # JSON: [{title, description, required}]
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    runs = relationship("GenerationRun", back_populates="template")

    def get_sections(self):
        return json.loads(self.sections)


class GenerationRun(Base):
    __tablename__ = "generation_runs"

    id = Column(Integer, primary_key=True, index=True)
    program_names = Column(Text, nullable=False)  # JSON array
    template_id = Column(Integer, ForeignKey("templates.id"), nullable=True)
    status = Column(String, default="pending")  # pending|running|completed|failed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    template = relationship("Template", back_populates="runs")
    documents = relationship("Document", back_populates="run")

    def get_program_names(self):
        return json.loads(self.program_names)


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey("generation_runs.id"), nullable=True)
    parent_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    program_name = Column(String, nullable=False)
    faculty = Column(String, nullable=True)
    department = Column(String, nullable=True)
    program_url = Column(String, nullable=True)
    raw_scraped_content = Column(Text, nullable=True)
    generated_content = Column(Text, nullable=True)
    accuracy_critique = Column(Text, nullable=True)
    template_critique = Column(Text, nullable=True)
    word_doc_path = Column(String, nullable=True)
    status = Column(String, default="pending")
    # pending|scraping|writing|reviewing_accuracy|reviewing_template|approved|failed
    is_deleted = Column(Boolean, default=False)
    label = Column(String, nullable=True)  # NULL=original, 'edited'=correction
    correction_prompt = Column(Text, nullable=True)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    run = relationship("GenerationRun", back_populates="documents")
    children = relationship("Document", backref="parent", foreign_keys=[parent_id])


def create_tables():
    Base.metadata.create_all(bind=engine)


def seed_default_template(db):
    existing = db.query(Template).filter(Template.is_default == True).first()
    if existing:
        return
    default_sections = [
        {
            "title": "תיאור התוכנית",
            "description": "תיאור כללי של התוכנית, מטרותיה ומה היא מציעה לסטודנט",
            "required": True,
        },
        {
            "title": "מבנה הלימודים",
            "description": "מסגרת הלימודים, משך התוכנית, מספר נקודות זכות ואופן הלמידה",
            "required": True,
        },
        {
            "title": "תנאי קבלה",
            "description": "דרישות הקבלה לתוכנית, כולל ציוני בגרות, תעודות נדרשות ובחינות כניסה",
            "required": True,
        },
        {
            "title": "מסלולי התמחות",
            "description": "מסלולים שונים בתוך התוכנית, אם קיימים",
            "required": False,
        },
        {
            "title": "קורסים מרכזיים",
            "description": "רשימת קורסי הליבה והחובה המרכזיים בתוכנית",
            "required": True,
        },
        {
            "title": "אפשרויות תעסוקה",
            "description": "תחומי עיסוק ותפקידים שבוגרי התוכנית יכולים לשאוף אליהם",
            "required": True,
        },
        {
            "title": "מידע נוסף",
            "description": "מלגות, חוגים משלימים, שיתופי פעולה בינלאומיים וכל מידע רלוונטי נוסף",
            "required": False,
        },
    ]
    template = Template(
        name="תבנית ברירת מחדל",
        sections=json.dumps(default_sections, ensure_ascii=False),
        is_default=True,
    )
    db.add(template)
    db.commit()
