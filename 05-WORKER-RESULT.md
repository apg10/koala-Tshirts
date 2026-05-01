# Worker Result

## Task
- id: `T8.8A`
- name: `Disable legacy client-controlled PaymentIntent endpoint`

## Status
`done-with-cloud-repair`

## Files Changed
- `backend/app/routes/checkout.py`
- `backend/tests/test_routes.py`
- `02-LOG.md`
- `05-WORKER-RESULT.md`
- `11-QWEN-OUTBOX.md`
- `12-GPTOSS-REVIEW.md`

## Summary
The legacy `POST /api/checkout/create-payment-intent` endpoint is disabled. It now raises HTTP 410 with:

`Legacy payment intent endpoint is disabled. Use /api/orders/checkout.`

The endpoint no longer uses the client-provided amount and no longer creates a Stripe PaymentIntent.

## Cloud Repair
- Qwen inserted the new legacy endpoint test before the final assertions of `test_checkout_guest_summary_missing_product_returns_404`.
- Cloud Control restored the missing-product assertions to the correct test.
- Cloud Control added a monkeypatch assertion that `app.routes.checkout.stripe.PaymentIntent.create` is not called by the disabled endpoint.

## Validation
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- directory: `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend`
- result: passed, 49 tests, 1 existing SQLAlchemy deprecation warning

## Git
- committed: pending
- commit: pending
