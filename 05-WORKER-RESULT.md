## Status
`done-with-cloud-validation`

## Task
- id: `T8.4A`
- name: `Align secure checkout total with checkout summary tax calculation`
- model: `qwen3-coder:30b`
- agent: `build`

## Files Changed
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
Secure checkout now charges the same total displayed by checkout summary.

## Implementation
- Changed `POST /api/orders/checkout` to calculate `subtotal`, `tax = round(subtotal * config.TAX_RATE, 2)`, and `total = round(subtotal + tax, 2)`.
- Stored the tax-inclusive `total` on `order.total`.
- Created the Stripe PaymentIntent using the tax-inclusive `total`.
- Returned the tax-inclusive `total` in `CheckoutOut`.
- Updated the authenticated checkout contract test to expect `65.98` total and `6598` Stripe amount for two `29.99` items.

## Known Follow-Up
- A future payment hardening pass should consider cent-based or Decimal arithmetic to avoid edge-case floating point drift in payment amounts.

## Git
- committed: pending
- commit: pending
- staged files: none yet
