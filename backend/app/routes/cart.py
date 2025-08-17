from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from .. import models, schemas, database, auth

router = APIRouter(prefix="/cart", tags=["Cart"])

def _get_or_create_cart(user: models.User, db: Session) -> models.Cart:
    if user.cart:
        return user.cart
    cart = models.Cart(user_id=user.id)
    db.add(cart)
    db.commit()
    db.refresh(cart)
    return cart

def _load_cart_with_products(cart_id: int, db: Session) -> models.Cart:
    return (
        db.query(models.Cart)
          .options(
              joinedload(models.Cart.items)
                .joinedload(models.CartItem.product)
          )
          .filter(models.Cart.id == cart_id)
          .first()
    )

@router.get("/", response_model=schemas.CartOut)
def get_cart(
    current: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    cart = _get_or_create_cart(current, db)
    return _load_cart_with_products(cart.id, db)

@router.post("/items", response_model=schemas.CartOut, status_code=201)
def add_item(
    item: schemas.CartItemBase,
    current: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    cart = _get_or_create_cart(current, db)

    product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = next((i for i in cart.items if i.product_id == item.product_id), None)
    new_qty = (existing.qty if existing else 0) + int(item.qty)

    if product.stock is not None and new_qty > int(product.stock):
        raise HTTPException(status_code=400, detail="Insufficient stock")

    if existing:
        existing.qty = new_qty
    else:
        db.add(models.CartItem(cart_id=cart.id, product_id=item.product_id, qty=item.qty))

    db.commit()
    return _load_cart_with_products(cart.id, db)

@router.patch("/items/{item_id}", response_model=schemas.CartOut)
def update_item(
    item_id: int,
    qty: int,
    current: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    cart = _get_or_create_cart(current, db)

    ci = db.query(models.CartItem).filter_by(id=item_id, cart_id=cart.id).first()
    if not ci:
        raise HTTPException(status_code=404, detail="Item not found")

    if qty < 1:
        db.delete(ci)
    else:
        product = db.query(models.Product).filter_by(id=ci.product_id).first()
        if product and product.stock is not None and qty > int(product.stock):
            raise HTTPException(status_code=400, detail="Insufficient stock")
        ci.qty = qty

    db.commit()
    return _load_cart_with_products(cart.id, db)

@router.delete("/items/{item_id}", response_model=schemas.CartOut)
def delete_item(
    item_id: int,
    current: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    cart = _get_or_create_cart(current, db)
    ci = next((i for i in cart.items if i.id == item_id), None)
    if not ci:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(ci)
    db.commit()
    return _load_cart_with_products(cart.id, db)

@router.delete("/", response_model=schemas.CartOut)
def clear_cart(
    current: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    cart = _get_or_create_cart(current, db)
    for ci in list(cart.items):
        db.delete(ci)
    db.commit()
    return _load_cart_with_products(cart.id, db)
