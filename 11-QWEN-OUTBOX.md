# Qwen Outbox
## Task - id: T8.5C - name: Validate stock before checkout PaymentIntent

## Files Changed
- backend/app/routes/orders.py
- backend/tests/test_routes.py

## Validation Attempted
- command: .\venv\Scripts\python.exe -m pytest tests -q
- result: failed before Cloud Control repair because the new tests referenced undefined `stripe` and used `auth.create_access_token(user)` with a SQLAlchemy model instead of the local dependency override pattern
- final cloud validation: passed with 43 tests and 1 existing SQLAlchemy deprecation warning

## What Changed
- Added pre-order stock validation inside `POST /api/orders/checkout`.
- Insufficient stock now returns 400 before any order is created.
- Stripe `PaymentIntent.create` is not called on stock failure.
- Added authenticated and guest insufficient-stock tests.
- Cloud Control repaired only the test harness, not the production implementation.

## Risks / Needs Follow-Up
- Stock is validated at checkout creation time, but stock is not reserved. A future task should address race conditions between checkout and webhook completion.
