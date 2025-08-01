from pathlib import Path
from uuid import uuid4
from typing import List, Optional

from fastapi import (
    APIRouter, Depends, HTTPException, Query,
    File, UploadFile, status
)
from sqlalchemy.orm import Session

from .. import models, schemas, database, auth

router = APIRouter(prefix="/products", tags=["Products"])

# ───────── list + filtros ─────────
@router.get("/", response_model=List[schemas.Product])
def list_products(
    category: Optional[int]  = Query(None, description="ID categoría"),
    min_price: Optional[float] = Query(None, ge=0, description="Precio mínimo"),
    max_price: Optional[float] = Query(None, ge=0, description="Precio máximo"),
    db: Session = Depends(database.get_db),
):
    query = db.query(models.Product)
    if category is not None:
        query = query.filter(models.Product.category_id == category)
    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)
    return query.all()

# ───────── detalle ─────────
@router.get("/{product_id}", response_model=schemas.Product)
def get_product_by_id(product_id: int,
                      db: Session = Depends(database.get_db)):
    product = db.query(models.Product)\
                .filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")
    return product

# ───────── crear ─────────
@router.post("/", response_model=schemas.Product,
             dependencies=[Depends(auth.get_current_admin)])
async def create_product(
    name: str,
    price: float,
    category_id: int,
    description: str | None = None,
    width: int = 0,
    height: int = 0,
    image: UploadFile = File(...),
    db: Session = Depends(database.get_db),
):
    # 1. Guardar imagen
    file_ext  = Path(image.filename).suffix
    filename  = f"{uuid4().hex}{file_ext}"
    static_dir = Path(__file__).resolve().parent.parent / "static" / "products"
    static_dir.mkdir(parents=True, exist_ok=True)
    save_path = static_dir / filename
    with open(save_path, "wb") as f:
        f.write(await image.read())

    # 2. Crear registro
    product = models.Product(
        name=name, description=description, price=price,
        image=f"/static/products/{filename}",
        width=width, height=height, category_id=category_id
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

# ───────── actualizar ─────────
@router.put("/{product_id}", response_model=schemas.Product,
            dependencies=[Depends(auth.get_current_admin)])
async def update_product(
    product_id: int,
    product_in: schemas.ProductUpdate,
    image: UploadFile | None = File(None),
    db: Session = Depends(database.get_db),
):
    product = db.query(models.Product).filter_by(id=product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")

    # 1. Si llega nueva imagen → guardar y borrar la anterior
    if image:
        # eliminar archivo antiguo (ignora si no existe)
        try:
            (Path(__file__).resolve().parent.parent /
             product.image.lstrip("/")).unlink(missing_ok=True)
        except Exception:  # pragma: no cover
            pass

        file_ext = Path(image.filename).suffix
        filename = f"{uuid4().hex}{file_ext}"
        static_dir = Path(__file__).resolve().parent.parent / "static" / "products"
        static_dir.mkdir(parents=True, exist_ok=True)
        save_path = static_dir / filename
        with open(save_path, "wb") as f:
            f.write(await image.read())
        product.image = f"/static/products/{filename}"

    # 2. Campos simples
    for field, value in product_in.model_dump(exclude_unset=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


# ───────── eliminar ─────────
@router.delete("/{product_id}", status_code=204,
               dependencies=[Depends(auth.get_current_admin)])
def delete_product(product_id: int,
                   db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter_by(id=product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")

    # borrar archivo de imagen (opcional)
    try:
        (Path(__file__).resolve().parent.parent /
         product.image.lstrip("/")).unlink(missing_ok=True)
    except Exception:  # pragma: no cover
        pass

    db.delete(product)
    db.commit()

    # ───────── POST /products/bulk ─────────
@router.post(
    "/bulk",
    response_model=List[schemas.Product],
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(auth.get_current_admin)]
)
def bulk_create_products(
    items: List[schemas.ProductCreate],
    db: Session = Depends(database.get_db),
):
    """
    Crea múltiples productos de golpe a partir de un array JSON.
    Solo admins.
    """
    created = []
    for payload in items:
        prod = models.Product(**payload.dict())
        db.add(prod)
        created.append(prod)
    db.commit()
    for prod in created:
        db.refresh(prod)
    return created
