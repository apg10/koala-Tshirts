# backend/app/main.py
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import database, models
from .routes import users, products, categories, cart, orders, payment, checkout

app = FastAPI(title="Koala T-Shirts API", version="1.0.0")

# ─── Habilitar CORS para *mientras tanto* ───
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # 🔥 permite todas las peticiones de cualquier origen
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ─────────────────────────────────────────────

BASE_DIR   = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

models.Base.metadata.create_all(bind=database.engine)

app.include_router(users.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(payment.router)
app.include_router(checkout.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to Koala T-Shirts API"}
