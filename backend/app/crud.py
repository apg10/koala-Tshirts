# app/crud.py
from typing import List, Optional
from sqlalchemy.orm import Session

from . import models, schemas

# ───────── Category ─────────
def get_category(db: Session, category_id: int) -> Optional[models.Category]:
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100) -> List[models.Category]:
    return db.query(models.Category).offset(skip).limit(limit).all()

def create_category(db: Session, category_in: schemas.CategoryCreate) -> models.Category:
    db_cat = models.Category(**category_in.model_dump())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

# ───────── Product ─────────
def get_product(db: Session, product_id: int) -> Optional[models.Product]:
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[models.Product]:
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product_in: schemas.ProductCreate) -> models.Product:
    db_prod = models.Product(**product_in.model_dump())
    db.add(db_prod)
    db.commit()
    db.refresh(db_prod)
    return db_prod

# ───────── User ─────────
def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user_in: schemas.UserCreate, hashed_password: str) -> models.User:
    db_user = models.User(
        email=user_in.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ───────── Cart ─────────
def get_cart_by_user(db: Session, user_id: int) -> Optional[models.Cart]:
    return db.query(models.Cart).filter(models.Cart.user_id == user_id, models.Cart.status == "active").first()

def create_cart(db: Session, user_id: int) -> models.Cart:
    db_cart = models.Cart(user_id=user_id)
    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)
    return db_cart

def add_cart_item(db: Session, cart: models.Cart, item_in: schemas.CartItemBase) -> models.Cart:
    existing = db.query(models.CartItem).filter(
        models.CartItem.cart_id == cart.id,
        models.CartItem.product_id == item_in.product_id
    ).first()
    if existing:
        existing.qty += item_in.qty
    else:
        existing = models.CartItem(
            cart_id=cart.id,
            product_id=item_in.product_id,
            qty=item_in.qty
        )
        db.add(existing)
    db.commit()
    db.refresh(cart)
    return cart

# ───────── Order ─────────
def get_order(db: Session, order_id: int) -> Optional[models.Order]:
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def get_orders_by_user(db: Session, user_id: int) -> List[models.Order]:
    return db.query(models.Order).filter(models.Order.user_id == user_id).all()

def create_order(db: Session,
                 user_id: Optional[int],
                 items: List[schemas.CartItemBase],
                 guest: bool = False,
                 shipping: Optional[schemas.ShippingInfo] = None
) -> models.Order:
    # Crear orden base
    order = models.Order(
        user_id=user_id,
        guest=guest,
        shipping_name=(shipping.name if shipping else None),
        shipping_email=(shipping.email if shipping else None),
        shipping_addr=(shipping.address if shipping else None),
        status="pending"
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # Copiar items y calcular total
    total: float = 0.0
    for it in items:
        product = get_product(db, it.product_id)
        if not product:
            continue
        line_price = float(product.price) * it.qty
        total += line_price
        db_item = models.OrderItem(
            order_id=order.id,
            product_id=product.id,
            qty=it.qty,
            price=float(product.price)
        )
        db.add(db_item)
    order.total = total
    db.commit()
    db.refresh(order)
    return order
