# Qwen Outbox

## Task
- id: `T8.4A`
- name: `Align secure checkout total with checkout summary tax calculation`

## Files Changed
- `backend/app/routes/orders.py`
- `backend/tests/test_routes.py`

## Validation Attempted
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- result: passed with 34 tests and 1 existing SQLAlchemy deprecation warning
- exact failure if any: none

## What Changed
- Modified `POST /api/orders/checkout` to calculate subtotal, tax, and total using the same `config.TAX_RATE` rule as checkout summary.
- Updated `order.total`, Stripe PaymentIntent amount, and `CheckoutOut.total` to use the tax-inclusive total.
- Updated checkout contract test expectations from `59.98` / `5998` to `65.98` / `6598`.

## Risks / Needs Cloud Review
- Cloud Control verified `backend/app/routes/checkout.py` also uses `config.TAX_RATE`.
- Cloud Control reran backend tests successfully.
- Future payment hardening should consider cent-based or Decimal arithmetic.

## Stop
Stopped after implementation. No commit made by Qwen.
