# backend/app/routes/checkout.py
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from .. import models, schemas, database, config
from ..auth import get_current_user
import stripe

stripe.api_key = config.STRIPE_SECRET_KEY

router = APIRouter(
    prefix="/checkout",
    tags=["Checkout"],
)

@router.get("/summary", response_model=schemas.CheckoutSummary)
def get_checkout_summary(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=404, detail="Cart is empty or not found")

    items = []
    subtotal = 0.0
    for ci in cart.items:
        prod = db.query(models.Product).get(ci.product_id)

        # Aquí usamos 'ci.qty' en lugar de 'ci.quantity'
        qty = getattr(ci, "qty", None)
        if qty is None:
            raise HTTPException(status_code=500, detail="Cart item missing quantity field")

        line_total = float(prod.price) * qty
        items.append(
            schemas.CheckoutItem(
                product_id=prod.id,
                name=prod.name,
                price=float(prod.price),
                quantity=qty,
                total=line_total,
            )
        )
        subtotal += line_total

    tax = round(subtotal * config.TAX_RATE, 2)
    total = round(subtotal + tax, 2)

    return schemas.CheckoutSummary(
        items=items,
        subtotal=subtotal,
        tax=tax,
        total=total,
    )

@router.post("/create-payment-intent")
def create_payment_intent(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Legacy payment intent endpoint is disabled for security reasons
    # Client-provided amounts are not trusted
    raise HTTPException(
        status_code=410,
        detail="Legacy payment intent endpoint is disabled. Use /api/orders/checkout."
    )

@router.post("/summary", response_model=schemas.CheckoutSummary)
def post_checkout_summary(
    body: schemas.CheckoutBody,
    db: Session = Depends(database.get_db),
):
    if not body.items:
        raise HTTPException(status_code=400, detail="Items are required for guest checkout")

    items = []
    subtotal = 0.0

    for item in body.items:
        prod = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not prod:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")

        line_total = float(prod.price) * item.qty
        items.append(
            schemas.CheckoutItem(
                product_id=prod.id,
                name=prod.name,
                price=float(prod.price),
                quantity=item.qty,
                total=line_total,
            )
        )
        subtotal += line_total

    tax = round(subtotal * config.TAX_RATE, 2)
    total = round(subtotal + tax, 2)

    return schemas.CheckoutSummary(
        items=items,
        subtotal=subtotal,
        tax=tax,
        total=total,
    )

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(database.get_db),
):
    payload = await request.body()
    sig = request.headers.get("stripe-signature")
    try:
        event = stripe.Webhook.construct_event(
            payload, sig, config.STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Invalid payload or signature")

    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]
        # Find the matching order using order_id from metadata or stripe_pi_id
        if isinstance(intent, dict):
            intent_id = intent.get("id")
            metadata = intent.get("metadata") or {}
        else:
            intent_id = getattr(intent, "id", None)
            metadata = getattr(intent, "metadata", {}) or {}

        order_id = metadata.get("order_id")
        order = None

        if order_id:
            try:
                order = db.query(models.Order).filter_by(id=int(order_id)).first()
            except (TypeError, ValueError):
                order = None

        if order is None and intent_id:
            # Fallback to stripe_pi_id if order_id is missing
            order = db.query(models.Order).filter_by(stripe_pi_id=intent_id).first()

        if order:
            # If order is already paid, do nothing (idempotent)
            if order.status == "paid":
                return {"status": "success"}

            # Decrement product stock for each order item
            for item in order.items:
                product = db.query(models.Product).filter_by(id=item.product_id).first()
                if product:
                    # Decrement stock but don't let it go below 0
                    product.stock = max(0, product.stock - item.qty)

            # Mark the order as paid
            order.status = "paid"
            order.stripe_status = "succeeded"
            db.commit()
            db.refresh(order)

            # Clear the user's cart if this is an authenticated order.
            # The cart model uses a single cart per user and defaults to "active".
            if order.user_id:
                user_cart = db.query(models.Cart).filter_by(user_id=order.user_id).first()
                if user_cart:
                    user_cart.status = "closed"
                    for ci in user_cart.items[:]:
                        db.delete(ci)
                    db.commit()

    return {"status": "success"}
