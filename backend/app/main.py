# backend/app/main.py
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import database, models, config
from .routes import (
    users,
    products,
    categories,
    cart,
    orders,
    checkout,
    admin_products,
)

app = FastAPI(title="Koala T-Shirts API", version="1.0.0")

# ─── CORS ───────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ────────────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Crear tablas si no existen
models.Base.metadata.create_all(bind=database.engine)

# ─── Routers ────────────────────────────────────────────────────────────
app.include_router(users.router,          prefix="/api")
app.include_router(products.router,       prefix="/api")
app.include_router(categories.router,     prefix="/api")
app.include_router(cart.router,           prefix="/api")
app.include_router(orders.router,         prefix="/api")
app.include_router(checkout.router,       prefix="/api")
app.include_router(admin_products.router, prefix="/api")
# ────────────────────────────────────────────────────────────────────────

@app.get("/", tags=["Root"])
def read_root():
    """Serve the static frontend index page.

    This replaces the previous JSON response with an HTML page so the
    storefront is accessible at the root URL.
    """
    index_path = BASE_DIR / "static" / "index.html"
    if not index_path.is_file():
        return {"message": "Welcome to Koala T-Shirts API"}
    return HTMLResponse(content=index_path.read_text(), status_code=200)
