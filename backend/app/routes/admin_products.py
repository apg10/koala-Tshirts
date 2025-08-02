# app/routes/admin_products.py
from pathlib import Path
import shutil
from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Form,
    File,
    UploadFile,
)
from sqlalchemy.orm import Session

from app import schemas, models, database
from app.auth import get_current_admin

router = APIRouter(
    prefix="/admin/products",
    tags=["Admin Products"],
)

# ────────────────────────────────────────────────────────────────────────
# Carpeta donde se guardarán las imágenes:
#   backend/static/products/<archivo>
# Si no existe, la creamos al levantar el módulo.
BASE_DIR = Path(__file__).resolve().parents[2]        # …/backend
IMAGES_DIR = BASE_DIR / "static" / "products"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)
# ────────────────────────────────────────────────────────────────────────


# ╭─────────────────────────── LIST ───────────────────────────╮
@router.get("", response_model=List[schemas.Product])
def list_products_admin(
    db: Session = Depends(database.get_db),
    _: models.User = Depends(get_current_admin),
):
    return db.query(models.Product).all()


# ╭─────────────────────── RETRIEVE ───────────────────────────╮
@router.get("/{product_id}", response_model=schemas.Product)
def get_product_admin(
    product_id: int,
    db: Session = Depends(database.get_db),
    _: models.User = Depends(get_current_admin),
):
    product = db.query(models.Product).get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ╭────────────────────────── CREATE ──────────────────────────╮
@router.post("", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product_admin(
    name: str = Form(...),
    description: str = Form(""),
    price: float = Form(...),
    size: str = Form(...),
    color: str = Form(...),
    category_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    _: models.User = Depends(get_current_admin),
):
    # Guarda la imagen física
    file_path = IMAGES_DIR / image.filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Crea el registro en DB
    new_product = models.Product(
        name=name,
        description=description,
        price=price,
        size=size,
        color=color,
        image=image.filename,    # Solo el nombre -> ProductCard lo compone
        category_id=category_id,
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


# ╭────────────────────────── UPDATE ──────────────────────────╮
@router.put("/{product_id}", response_model=schemas.Product)
def update_product_admin(
    product_id: int,
    name: str = Form(...),
    description: str = Form(""),
    price: float = Form(...),
    size: str = Form(...),
    color: str = Form(...),
    category_id: int = Form(...),
    image: UploadFile = File(None),          # opcional
    db: Session = Depends(database.get_db),
    _: models.User = Depends(get_current_admin),
):
    prod = db.query(models.Product).get(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    # Actualiza campos
    prod.name = name
    prod.description = description
    prod.price = price
    prod.size = size
    prod.color = color
    prod.category_id = category_id

    # Si llega nueva imagen, la guardamos y actualizamos filename
    if image:
        file_path = IMAGES_DIR / image.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        prod.image = image.filename

    db.commit()
    db.refresh(prod)
    return prod


# ╭────────────────────────── DELETE ──────────────────────────╮
@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_admin(
    product_id: int,
    db: Session = Depends(database.get_db),
    _: models.User = Depends(get_current_admin),
):
    prod = db.query(models.Product).get(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(prod)
    db.commit()

@router.delete("/purge", status_code=status.HTTP_204_NO_CONTENT)
def purge_products(
    db: Session = Depends(database.get_db),
    _: models.User = Depends(get_current_admin),
):
    db.query(models.Product).delete()
    db.commit()