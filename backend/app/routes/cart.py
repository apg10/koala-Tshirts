from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas, database, auth

router = APIRouter(prefix="/cart", tags=["Cart"])

# ───────── helpers ─────────
def _get_or_create_cart(user: models.User, db: Session) -> models.Cart:
    if user.cart:
        return user.cart
    cart = models.Cart(user_id=user.id)
    db.add(cart)
    db.commit()
    db.refresh(cart)
    return cart

# ───────── GET /cart ─────────
@router.get("/", response_model=schemas.CartOut)
def get_cart(current: models.User = Depends(auth.get_current_user),
             db: Session = Depends(database.get_db)):
    cart = _get_or_create_cart(current, db)
    return cart

# ───────── POST /cart/items ─────────
@router.post("/items", response_model=schemas.CartOut, status_code=201)
def add_item(item: schemas.CartItemBase,
             current: models.User = Depends(auth.get_current_user),
             db: Session = Depends(database.get_db)):
    cart = _get_or_create_cart(current, db)

    ci = next((i for i in cart.items if i.product_id == item.product_id), None)
    if ci:
        ci.qty += item.qty
    else:
        ci = models.CartItem(cart_id=cart.id,
                             product_id=item.product_id,
                             qty=item.qty)
        db.add(ci)
    db.commit()
    db.refresh(cart)
    return cart

# ───────── PATCH /cart/items/{id} ─────────
@router.patch("/items/{item_id}", response_model=schemas.CartOut)
def update_item(item_id: int, qty: int,
                current: models.User = Depends(auth.get_current_user),
                db: Session = Depends(database.get_db)):
    cart = _get_or_create_cart(current, db)
    ci = next((i for i in cart.items if i.id == item_id), None)
    if not ci:
        raise HTTPException(404, "Item not found")
    if qty < 1:
        db.delete(ci)
    else:
        ci.qty = qty
    db.commit()
    db.refresh(cart)
    return cart

# ───────── DELETE /cart/items/{id} ─────────
@router.delete("/items/{item_id}", response_model=schemas.CartOut)
def delete_item(item_id: int,
                current: models.User = Depends(auth.get_current_user),
                db: Session = Depends(database.get_db)):
    cart = _get_or_create_cart(current, db)
    ci = next((i for i in cart.items if i.id == item_id), None)
    if not ci:
        raise HTTPException(404, "Item not found")
    db.delete(ci)
    db.commit()
    db.refresh(cart)
    return cart

# ───────── DELETE /cart ─────────
@router.delete("/", response_model=schemas.CartOut)
def clear_cart(current: models.User = Depends(auth.get_current_user),
               db: Session = Depends(database.get_db)):
    cart = _get_or_create_cart(current, db)
    for ci in cart.items[:]:
        db.delete(ci)
    db.commit()
    db.refresh(cart)
    return cart
