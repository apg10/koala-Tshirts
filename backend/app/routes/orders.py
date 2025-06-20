from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas, database, auth
from ..stripe_client import stripe

router = APIRouter(prefix="/orders", tags=["Orders"])

# ───────── helpers ─────────
def _my_order(order_id: int, user: models.User):
    """Devuelve la orden si pertenece al usuario o None."""
    return next((o for o in user.orders if o.id == order_id), None)

# ───────── lista del usuario ─────────
@router.get("/", response_model=List[schemas.OrderOut])
def my_orders(current=Depends(auth.get_current_user)):
    return current.orders

# ───────── detalle ─────────
@router.get("/{order_id}", response_model=schemas.OrderOut)
def order_detail(order_id: int, current=Depends(auth.get_current_user)):
    order = _my_order(order_id, current)
    if not order:
        raise HTTPException(404, "Order not found")
    return order

# ───────── admin: todas ─────────
@router.get("/admin/all", response_model=List[schemas.OrderOut],
            dependencies=[Depends(auth.get_current_admin)])
def all_orders(db: Session = Depends(database.get_db)):
    return db.query(models.Order).all()

# ───────── checkout híbrido (usuario o invitado) ─────────
@router.post("/checkout", response_model=schemas.OrderOut, status_code=201)
def checkout(
    body: schemas.CheckoutBody,
    db: Session = Depends(database.get_db),
    current: Optional[models.User] = Depends(auth.optional_user),
):
    # 1. Reunir items
    cart: Optional[models.Cart] = None       # define upfront → evita 'possibly unbound'
    if current:
        cart = current.cart
        if not cart or not cart.items:
            raise HTTPException(400, "Cart is empty")
        items_src = [{"product_id": ci.product_id, "qty": ci.qty}
                     for ci in cart.items]
    else:
        # invitado: debe enviar items + shipping
        if not body.items or not body.shipping:
            raise HTTPException(400, "Guest checkout requires items and shipping")
        items_src = [{"product_id": it.product_id, "qty": it.qty}
                     for it in body.items]

    # 2. Crear la orden
    order = models.Order(
        user_id=current.id if current else None,
        guest=not bool(current),
        shipping_name  =(body.shipping.name   if body.shipping else None),
        shipping_email =(body.shipping.email  if body.shipping else None),
        shipping_addr  =(body.shipping.address if body.shipping else None),
        status="pending",
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # 3. Copiar items y calcular total
    total: float = 0.0
    for it in items_src:
        product = db.query(models.Product).filter_by(id=it["product_id"]).first()
        if not product:
            raise HTTPException(404, f"Product {it['product_id']} not found")

        unit_price: float = float(product.price)      # type: ignore[arg-type]
        total += unit_price * it["qty"]

        db.add(models.OrderItem(
            order_id=order.id,
            product_id=product.id,
            qty=it["qty"],
            price=unit_price
        ))    
    order.total = total      # type: ignore[attr-defined] — SQLAlchemy field
    db.commit()
    db.refresh(order)

    # 4. Crear PaymentIntent en Stripe
    pi = stripe.PaymentIntent.create(
        amount=int(total * 100),             # Stripe requiere enteros (centavos)
        currency="aud",
        metadata={
            "order_id": str(order.id),
            "guest":    str(order.guest),
        },
    )
    order.stripe_pi_id = pi.id
    db.commit()
    db.refresh(order)

    # 5. Si era usuario logueado, cerrar su carrito
    if cart is not None:
        cart.status = "closed"              # type: ignore[attr-defined]
        for ci in cart.items[:]:
            db.delete(ci)
        db.commit()

    return order
