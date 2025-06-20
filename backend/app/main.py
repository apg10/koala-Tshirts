from pathlib import Path
from dotenv import load_dotenv
from .routes import orders, payment
load_dotenv()                                     # ← lee variables de .env

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import database, models
from .routes import products, categories, users, cart   # ←  importamos Cart

# ───────── instancia ─────────
app = FastAPI()

# ───────── CORS ─────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   # frontend en Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ───────── archivos estáticos ─────────
BASE_DIR   = Path(__file__).resolve().parent.parent   # …/backend
STATIC_DIR = BASE_DIR / "static"                      # …/backend/static
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# ───────── Base de datos & routers ─────────
models.Base.metadata.create_all(bind=database.engine)

app.include_router(products.router)
app.include_router(categories.router)
app.include_router(users.router)
app.include_router(cart.router)        # ←  nuevo: rutas del carrito
app.include_router(orders.router)
app.include_router(orders.router)
app.include_router(payment.router)
# ───────── root ─────────
@app.get("/")
def read_root():
    return {"message": "Welcome to Koala T-Shirts API"}
