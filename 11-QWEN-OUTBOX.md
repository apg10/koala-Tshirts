# Qwen Outbox

## Task
- id: `T8.8B`
- name: `Remove legacy PaymentIntent request/response contract`

## Worker Execution
- status: `partial-needs-cloud-repair`
- files changed by worker: `backend/app/routes/checkout.py`, `backend/app/schemas.py`, `backend/tests/test_routes.py`, `02-LOG.md`
- validation claimed by worker: backend tests passed
- commit: none

## Worker Output Summary
- Removed `response_model=schemas.PaymentIntentOut` from the disabled legacy endpoint.
- Removed the `payload: schemas.PaymentIntentIn` parameter from the disabled legacy endpoint.
- Added no-body coverage for `POST /api/checkout/create-payment-intent`.
- Appended `L54` to `02-LOG.md`.

## Issues Found By Cloud Control
- `PaymentIntentIn` and `PaymentIntentOut` were still present in `backend/app/schemas.py`.
- `Token` was duplicated in `backend/app/schemas.py`.
- `05-WORKER-RESULT.md` and this outbox were still describing T8.8A instead of T8.8B.

## Cloud Repair Summary
- Removed the legacy `PaymentIntentIn` and `PaymentIntentOut` schema classes.
- Removed the duplicated `Token` schema and preserved one `Token` class.
- Updated operational reports for T8.8B.

## Validation
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- result: passed, 49 tests, 1 existing SQLAlchemy deprecation warning
