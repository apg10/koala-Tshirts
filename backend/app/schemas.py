from pydantic import BaseModel
from typing import Optional


# ---------- Category Schemas ----------

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    model_config = {
        "from_attributes": True
    }


# ---------- Product Schemas ----------

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image: str
    width: int
    height: int
    category_id: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    category: Category

    model_config = {
        "from_attributes": True
    }
