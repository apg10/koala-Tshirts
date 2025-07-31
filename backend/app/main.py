# backend/app/main.py

from pathlib import Path
from dotenv import load_dotenv

# 1. Carga variables de entorno
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import database, models
from .routes import users, products, categories, cart, orders, payment

# ───────── instancia ─────────
app = FastAPI(
    title="Koala T-Shirts API",
    version="1.0.0",
)

# ───────── CORS ─────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # tu frontend Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ───────── archivos estáticos ─────────
BASE_DIR   = Path(__file__).resolve().parent.parent   # …/backend
STATIC_DIR = BASE_DIR / "static"                      # …/backend/static
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# ───────── Base de datos ─────────
models.Base.metadata.create_all(bind=database.engine)

# ───────── routers ─────────
# Cada router ya define su propio `prefix` internamente
app.include_router(users.router)      # /users/...
app.include_router(products.router)   # /products/...
app.include_router(categories.router) # /categories/...
app.include_router(cart.router)       # /cart/...
app.include_router(orders.router)     # /orders/...
app.include_router(payment.router)    # /payment/...

# ───────── root ─────────
@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to Koala T-Shirts API"}
