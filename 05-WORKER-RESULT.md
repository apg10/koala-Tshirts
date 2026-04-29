## Status
`done-with-cloud-fix`

## Task
- id: `T8.4B`
- name: `Use cent-safe Decimal rounding for checkout Stripe amount`
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
- result: passed with 35 tests and 1 existing SQLAlchemy deprecation warning

## Summary
Secure checkout now uses Decimal half-up rounding when converting tax-inclusive totals to Stripe cents.

## Implementation
- Imported `Decimal` and `ROUND_HALF_UP` in `backend/app/routes/orders.py`.
- Converted product prices with `Decimal(str(product.price))`.
- Converted tax rate with `Decimal(str(config.TAX_RATE))`.
- Calculated tax and total with Decimal quantization.
- Created `amount_cents` with half-up cent rounding instead of `int(total * 100)`.
- Preserved float-compatible API and database totals.

## Cloud Fix
- Replaced Qwen's weak local arithmetic assertion with an endpoint-level regression test.
- The new test creates a `0.05` product checkout and verifies Stripe receives `6` cents after 10% tax rounds half-up.

## Git
- committed: pending
- commit: pending
- staged files: none yet
