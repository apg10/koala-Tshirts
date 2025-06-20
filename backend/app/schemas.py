from typing import Optional, List
from pydantic import BaseModel

# ───────── Category ─────────

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    model_config = {"from_attributes": True}


# ───────── Product ─────────

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


# ───────── User ─────────

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_admin: bool
    model_config = {"from_attributes": True}


# ───────── Cart & CartItem ─────────

class CartItemBase(BaseModel):
    product_id: int
    qty: int = 1

class CartItemOut(CartItemBase):
    id: int
    product: Product
    model_config = {"from_attributes": True}

class CartOut(BaseModel):
    id: int
    items: List[CartItemOut]
    model_config = {"from_attributes": True}


# ───────── Order ─────────

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
    stripe_status: Optional[str] = None
    guest: bool
    shipping_name: Optional[str] = None
    shipping_email: Optional[str] = None
    shipping_addr: Optional[str] = None
    items: List[OrderItemOut]
    created: str
    model_config = {"from_attributes": True}


# ───────── Guest checkout support ─────────

class ShippingInfo(BaseModel):
    name: str
    email: str
    address: str

class CheckoutBody(BaseModel):
    """Payload aceptado por POST /orders/checkout

    - Usuarios logueados pueden enviarlo vacío.
    - Invitados deben proporcionar `shipping` y `items`.
    """
    shipping: Optional[ShippingInfo] = None
    items: Optional[List[CartItemBase]] = None
