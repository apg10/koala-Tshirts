# backend/app/main.py
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import database, models, config  # ⬅️ importamos config para ALLOWED_ORIGINS
from .routes import (
    users,
    products,
    categories,
    cart,
    orders,
    payment,
    checkout,
    admin_products,
)

app = FastAPI(title="Koala T-Shirts API", version="1.0.0")

# ─── CORS ───────────────────────────────────────────────────────────────
# allow_credentials=True requiere una lista explícita de dominios,
# no puede usarse "*" según la especificación CORS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,  # ["http://localhost:5173", "http://localhost:3000"]
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
app.include_router(users.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(payment.router)
app.include_router(checkout.router)
app.include_router(admin_products.router)
# ────────────────────────────────────────────────────────────────────────

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to Koala T-Shirts API"}
