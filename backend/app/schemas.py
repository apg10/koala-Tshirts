from pydantic import BaseModel
from typing import Optional

# ---------- Category ----------

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    model_config = {"from_attributes": True}


# ---------- Product ----------

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
    model_config = {"from_attributes": True}

class ProductUpdate(BaseModel):
    name: Optional[str]        = None
    description: Optional[str] = None
    price: Optional[float]     = None
    width: Optional[int]       = None
    height: Optional[int]      = None
    category_id: Optional[int] = None


# ---------- User ----------

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_admin: bool
    model_config = {"from_attributes": True}

# ---------- Cart & CartItem ----------

class CartItemBase(BaseModel):
    product_id: int
    qty: int = 1

class CartItemOut(CartItemBase):
    id: int
    product: Product
    model_config = {"from_attributes": True}

class CartOut(BaseModel):
    id: int
    items: list[CartItemOut]
    model_config = {"from_attributes": True}

# ---------- Order ----------

class OrderItemOut(BaseModel):
    id: int
    product: Product
    qty: int
    price: float
    model_config = {"from_attributes": True}

class OrderOut(BaseModel):
    id: int
    total: float
    status: str
    items: list[OrderItemOut]
    created: str
    model_config = {"from_attributes": True}

class OrderOut(BaseModel):
    id: int
    total: float
    status: str
    stripe_status: str | None = None
    items: list[OrderItemOut]
    created: str
    model_config = {"from_attributes": True}

