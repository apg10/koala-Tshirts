## Status
`done-with-cloud-repair`

## Task
- id: `T8.6B`
- name: `Move authenticated cart clearing to successful payment webhook`
- model: `qwen3-coder:30b`
- agent: `build`

## Files Changed
- `backend/app/routes/orders.py`
- `backend/app/routes/checkout.py`
- `backend/tests/test_routes.py`
- `02-LOG.md`
- `05-WORKER-RESULT.md`
- `11-QWEN-OUTBOX.md`

## Validation
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- directory: `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend`
- result: passed with 44 tests and 1 existing SQLAlchemy deprecation warning

## Summary
Authenticated carts are now cleared after confirmed Stripe payment, not during checkout creation.

## Implementation
- `POST /api/orders/checkout` no longer closes the authenticated user's cart or deletes cart items.
- `payment_intent.succeeded` webhook clears the authenticated user's cart after marking a pending order paid.
- Cart clearing closes the cart and deletes its cart items.
- Existing idempotent stock decrement behavior remains intact.
- Added regression coverage proving checkout keeps the cart while pending and webhook success clears it.

## Cloud Repair
- Qwen removed early cart clearing and added webhook clearing, but did not add tests or update the outbox.
- Qwen initially looked for `status="open"` carts; the repo uses a single cart per user with default `status="active"`.
- Cloud Control changed the webhook cart lookup to the user's cart regardless of active/open naming and added tests for the actual model behavior.

## Git
- committed: pending
- commit: pending
- staged files: none yet
