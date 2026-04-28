## Status
`done-with-cloud-validation`

## Task
- id: `T8.3B`
- name: `Return checkout client secret`
- model: `qwen3-coder:30b`
- agent: `build`

## Files Changed
- `backend/app/schemas.py`
- `backend/app/routes/orders.py`
- `backend/tests/test_routes.py`
- `02-LOG.md`
- `05-WORKER-RESULT.md`
- `11-QWEN-OUTBOX.md`

## Validation
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- directory: `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend`
- result: passed with 34 tests and 1 existing SQLAlchemy deprecation warning

## Summary
`POST /api/orders/checkout` now returns the Stripe `client_secret` needed by the frontend payment confirmation flow.

## Implementation
- Added `schemas.CheckoutOut` with `order_id`, `total`, and `client_secret`.
- Changed the checkout route response model from `OrderOut` to `CheckoutOut`.
- Preserved server-side total calculation, Stripe PaymentIntent metadata, `stripe_pi_id` persistence, and authenticated cart clearing.
- Updated the checkout contract test to assert the returned `client_secret` from the Stripe mock.

## Git
- committed: pending
- commit: pending
- staged files: none yet
