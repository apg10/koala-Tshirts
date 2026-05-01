# Worker Result

## Task
- id: `T8.8B`
- name: `Remove legacy PaymentIntent request/response contract`

## Status
`done-with-cloud-repair`

## Files Changed
- `backend/app/routes/checkout.py`
- `backend/app/schemas.py`
- `backend/tests/test_routes.py`
- `02-LOG.md`
- `05-WORKER-RESULT.md`
- `11-QWEN-OUTBOX.md`
- `12-GPTOSS-REVIEW.md`

## Summary
The disabled legacy endpoint `POST /api/checkout/create-payment-intent` no longer declares the legacy request or response contract.

## Accepted Behavior
- The route no longer uses `payload: schemas.PaymentIntentIn`.
- The route no longer declares `response_model=schemas.PaymentIntentOut`.
- `PaymentIntentIn` and `PaymentIntentOut` were removed from `backend/app/schemas.py`.
- `CheckoutItem`, `CheckoutSummary`, `CheckoutOut`, and `Token` remain available.
- The disabled endpoint returns HTTP 410 even when called with no JSON body.
- The disabled endpoint does not call Stripe `PaymentIntent.create`.

## Cloud Repair
- Qwen removed the route usage of the legacy schemas but did not remove `PaymentIntentIn` or `PaymentIntentOut`.
- Qwen duplicated the `Token` schema while editing `schemas.py`.
- Cloud Control removed the legacy schemas and restored a single `Token` definition.

## Validation
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- directory: `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend`
- result: passed, 49 tests, 1 existing SQLAlchemy deprecation warning

## Git
- committed: pending
- commit: pending
