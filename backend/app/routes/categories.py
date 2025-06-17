from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, database

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

# Get all product categories
@router.get("/", response_model=List[schemas.Category])
def get_all_categories(db: Session = Depends(database.get_db)):
    return db.query(models.Category).all()
