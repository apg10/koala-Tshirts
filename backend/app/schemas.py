from pydantic import BaseModel
from typing import Optional

# === Category ===
class Category(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


# === Product ===
class Product(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    image: str
    width: int
    height: int
    category: Category  # Nested category object

    class Config:
        orm_mode = True
