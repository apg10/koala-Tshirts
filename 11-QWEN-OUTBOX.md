# Qwen Outbox

## Task
- id: `T8.4B`
- name: `Use cent-safe Decimal rounding for checkout Stripe amount`

## Files Changed
- `backend/app/routes/orders.py`
- `backend/tests/test_routes.py`

## Validation Attempted
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- result: passed with 35 tests and 1 existing SQLAlchemy deprecation warning after Cloud Control fixed the regression test
- exact failure if any: none

## What Changed
- Replaced `int(total * 100)` with Decimal half-up cent rounding for Stripe PaymentIntent amounts.
- Kept `order.total` and `CheckoutOut.total` float-compatible.
- Preserved existing checkout behavior and metadata.
- Added an endpoint-level regression test for half-up cent rounding.

## Risks / Needs Cloud Review
- Production code accepted.
- Cloud Control replaced Qwen's original weak test with a real endpoint-level regression test.
- Future schema/model work may still migrate money fields away from SQLAlchemy `Float`.

## Stop
Stopped after implementation. No commit made by Qwen.
