# backend/app/config.py
import os

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173"
]

STRIPE_SECRET_KEY      = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")
STRIPE_WEBHOOK_SECRET  = os.getenv("STRIPE_WEBHOOK_SECRET")
STRIPE_CURRENCY        = "usd"
TAX_RATE               = 0.10
