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

@router.post("/create-payment-intent", response_model=schemas.PaymentIntentOut)
def create_payment_intent(
    payload: schemas.PaymentIntentIn,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user),
):
    amount_cents = int(payload.amount * 100)
    try:
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=config.STRIPE_CURRENCY,
            metadata={"user_id": str(current_user.id)},
        )
        return schemas.PaymentIntentOut(client_secret=intent.client_secret)
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

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
        user_id = intent.metadata.get("user_id")
        # TODO: crear la Order, vaciar carrito y notificar al usuario

    return {"status": "success"}
