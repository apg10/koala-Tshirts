from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import database, models
from .routes import products, categories

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # el frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear las tablas si no existen
models.Base.metadata.create_all(bind=database.engine)

# Incluir rutas
app.include_router(products.router)
app.include_router(categories.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Koala T-Shirts API"}
