from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas, database, auth

router = APIRouter(prefix="/categories", tags=["Categories"])

# ───────── listar ─────────
@router.get("/", response_model=List[schemas.Category])
def get_all_categories(db: Session = Depends(database.get_db)):
    return db.query(models.Category).all()

# ───────── crear ─────────
@router.post("/", response_model=schemas.Category,
             dependencies=[Depends(auth.get_current_admin)])
def create_category(cat_in: schemas.CategoryCreate,
                    db: Session = Depends(database.get_db)):
    if db.query(models.Category).filter_by(name=cat_in.name).first():
        raise HTTPException(400, "Category name already exists")
    cat = models.Category(**cat_in.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

# ───────── actualizar ─────────
@router.put("/{cat_id}", response_model=schemas.Category,
            dependencies=[Depends(auth.get_current_admin)])
def update_category(cat_id: int, cat_in: schemas.CategoryCreate,
                    db: Session = Depends(database.get_db)):
    cat = db.query(models.Category).filter_by(id=cat_id).first()
    if not cat:
        raise HTTPException(404, "Category not found")
    cat.name = cat_in.name
    db.commit()
    db.refresh(cat)
    return cat

# ───────── eliminar ─────────
@router.delete("/{cat_id}", status_code=204,
               dependencies=[Depends(auth.get_current_admin)])
def delete_category(cat_id: int, db: Session = Depends(database.get_db)):
    cat = db.query(models.Category).filter_by(id=cat_id).first()
    if not cat:
        raise HTTPException(404, "Category not found")
    db.delete(cat)
    db.commit()
