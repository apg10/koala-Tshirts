## Status
`done-with-cloud-repair`

## Task
- id: `T8.5C`
- name: `Validate stock before checkout PaymentIntent`
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
- result: passed with 43 tests and 1 existing SQLAlchemy deprecation warning

## Summary
Secure checkout now rejects insufficient stock before creating orders or Stripe PaymentIntents.

## Implementation
- `POST /api/orders/checkout` checks each requested product before creating an order.
- Missing products still return 404.
- Requested quantity greater than available stock returns 400.
- The stock failure path happens before order creation and before `stripe.PaymentIntent.create`.
- Checkout still does not decrement stock; inventory decrement remains in the paid webhook path.

## Cloud Repair
- Qwen's production code was accepted.
- Cloud Control repaired the new tests: replaced an undefined `stripe` reference with the repo's string-based monkeypatch target, avoided calling real Stripe in the guard mock, and used `auth.optional_user` dependency override for authenticated checkout.

## Git
- committed: pending
- commit: pending
- staged files: none yet
