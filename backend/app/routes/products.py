from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, database

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

# Get all products or filter by category name
@router.get("/", response_model=List[schemas.Product])
def get_all_products(
    category: str = Query(None),
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Product)

    # Optional filter by category name (case-insensitive)
    if category:
        query = query.join(models.Category).filter(models.Category.name.ilike(f"%{category}%"))

    return query.all()

# Get a single product by ID
@router.get("/{product_id}", response_model=schemas.Product)
def get_product_by_id(product_id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
