from fastapi import APIRouter, Depends, HTTPException, status, Form, File, UploadFile
from sqlalchemy.orm import Session
from typing import List

from app import schemas, models, database
from app.auth import get_current_admin

router = APIRouter(
    prefix="/admin/products",
    tags=["Admin Products"]
)


@router.get("", response_model=List[schemas.Product])
def list_products_admin(
    db: Session = Depends(database.get_db),
    _: models.User = Depends(get_current_admin)
):
    return db.query(models.Product).all()


@router.get("/{product_id}", response_model=schemas.Product)
def get_product_admin(
    product_id: int,
    db: Session = Depends(database.get_db),
    _: models.User = Depends(get_current_admin)
):
    product = db.query(models.Product).get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product_admin(
    name: str         = Form(...),
    description: str  = Form(""),
    price: float      = Form(...),
    size: str         = Form(...),
    color: str        = Form(...),
    category_id: int  = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    _: models.User = Depends(get_current_admin)
):
    new_product = models.Product(
        name=name,
        description=description,
        price=price,
        size=size,
        color=color,
        image=image.filename,
        category_id=category_id,
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.put("/{product_id}", response_model=schemas.Product)
def update_product_admin(
    product_id: int,
    name: str         = Form(...),
    description: str  = Form(""),
    price: float      = Form(...),
    size: str         = Form(...),
    color: str        = Form(...),
    category_id: int  = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(database.get_db),
    _: models.User = Depends(get_current_admin)
):
    prod = db.query(models.Product).get(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    prod.name = name
    prod.description = description
    prod.price = price
    prod.size = size
    prod.color = color
    prod.category_id = category_id
    if image:
        prod.image = image.filename

    db.commit()
    db.refresh(prod)
    return prod


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_admin(
    product_id: int,
    db: Session = Depends(database.get_db),
    _: models.User = Depends(get_current_admin)
):
    prod = db.query(models.Product).get(product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(prod)
    db.commit()
