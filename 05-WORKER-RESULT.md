## Status
`done-with-cloud-repair`

## Task
- id: `T8.5B`
- name: `Decrement inventory from paid Stripe webhook`
- model: `qwen3-coder:30b`
- agent: `build`

## Files Changed
- `backend/app/routes/checkout.py`
- `backend/tests/test_routes.py`
- `02-LOG.md`
- `05-WORKER-RESULT.md`
- `11-QWEN-OUTBOX.md`

## Validation
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- directory: `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend`
- result: passed with 41 tests and 1 existing SQLAlchemy deprecation warning

## Summary
Paid Stripe webhooks now decrement inventory exactly once.

## Implementation
- If no matching order exists, the webhook still returns success.
- If the matching order is already `paid`, the webhook returns success without changing stock.
- If the matching order is pending, each order item's product stock is decremented by `qty`.
- Stock is clamped with `max(0, product.stock - item.qty)`.
- The order is then marked `paid` with `stripe_status="succeeded"`.

## Cloud Repair
- Qwen reintroduced an unimported `stripe` reference in the invalid-signature test.
- Cloud Control restored the test to raise `ValueError`, preserving the route's existing invalid payload/signature behavior.

## Git
- committed: pending
- commit: pending
- staged files: none yet
