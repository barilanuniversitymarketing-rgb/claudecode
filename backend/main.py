import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import create_tables, seed_default_template, SessionLocal
from routers import templates, runs, documents

app = FastAPI(title="BIU Content Writer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(templates.router)
app.include_router(runs.router)
app.include_router(documents.router)

STATIC_DIR = os.environ.get("STATIC_DIR", "../frontend/dist")
if os.path.isdir(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")


@app.on_event("startup")
def on_startup():
    create_tables()
    db = SessionLocal()
    try:
        seed_default_template(db)
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"status": "ok"}
