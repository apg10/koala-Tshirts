import os
from fastapi import APIRouter, Request, HTTPException, status, Depends
from sqlalchemy.orm import Session

from .. import models, database
from ..stripe_client import stripe   # stripe.api_key ya está configurada

router = APIRouter(prefix="/stripe", tags=["Stripe"])

WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

@router.post("/webhook", status_code=200)
async def stripe_webhook(
    request: Request,
    db: Session = Depends(database.get_db)
):
    payload     = await request.body()
    sig_header  = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, WEBHOOK_SECRET
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid signature")

    # ───────── procesar eventos relevantes ─────────
    if event["type"] == "payment_intent.succeeded":
        pi = event["data"]["object"]
        order = db.query(models.Order)\
                  .filter_by(stripe_pi_id=pi["id"]).first()
        if order:
            order.status        = "paid"
            order.stripe_status = pi["status"]
            db.commit()

    return {"received": True}
