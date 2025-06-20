from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database, auth
from ..stripe_client import stripe

router = APIRouter(prefix="/orders", tags=["Orders"])

# ---------- helpers ----------
def _my_order(order_id: int, user):
    return next((o for o in user.orders if o.id == order_id), None)

# ---------- lista del usuario ----------
@router.get("/", response_model=list[schemas.OrderOut])
def my_orders(current=Depends(auth.get_current_user)):
    return current.orders

# ---------- detalle ----------
@router.get("/{order_id}", response_model=schemas.OrderOut)
def order_detail(order_id: int, current=Depends(auth.get_current_user)):
    order = _my_order(order_id, current)
    if not order:
        raise HTTPException(404, "Order not found")
    return order

# ---------- admin: todas ----------
@router.get("/admin/all", response_model=list[schemas.OrderOut],
            dependencies=[Depends(auth.get_current_admin)])
def all_orders(db: Session = Depends(database.get_db)):
    return db.query(models.Order).all()

# ---------- checkout (crea orden + PI) ----------
@router.post("/checkout", response_model=schemas.OrderOut, status_code=201)
def checkout(current=Depends(auth.get_current_user),
             db: Session = Depends(database.get_db)):
    cart = current.cart
    if not cart or not cart.items:
        raise HTTPException(400, "Cart is empty")

    # 1. Crear Order
    order = models.Order(user_id=current.id, status="pending")
    db.add(order); db.commit(); db.refresh(order)

    total = 0.0
    for it in cart.items:
        p = it.product.price
        total += p * it.qty
        db.add(models.OrderItem(order_id=order.id,
                                product_id=it.product_id,
                                qty=it.qty,
                                price=p))
    order.total = total
    db.commit(); db.refresh(order)

    # 2. Crear PaymentIntent en Stripe
    pi = stripe.PaymentIntent.create(
        amount=int(total * 100),  # cents
        currency="aud",
        metadata={"order_id": order.id, "user_id": current.id},
    )
    order.stripe_pi_id = pi.id
    db.commit(); db.refresh(order)

    # 3. Cerrar carrito
    cart.status = "closed"
    for ci in cart.items[:]:
        db.delete(ci)
    db.commit()

    return order
