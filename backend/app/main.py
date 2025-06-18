from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path                     # ← nuevo

from . import database, models
from .routes import products, categories

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Static files ---
BASE_DIR   = Path(__file__).resolve().parent.parent   # .../backend
STATIC_DIR = BASE_DIR / "static"                      # .../backend/static
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# --- DB & routers ---
models.Base.metadata.create_all(bind=database.engine)
app.include_router(products.router)
app.include_router(categories.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Koala T-Shirts API"}
