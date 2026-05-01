# Qwen Outbox

## Task
- id: `T8.8A`
- name: `Disable legacy client-controlled PaymentIntent endpoint`

## Worker Execution
- status: `partial-needs-cloud-repair`
- files changed by worker: `backend/app/routes/checkout.py`, `backend/tests/test_routes.py`, `02-LOG.md`
- validation claimed by worker: backend tests passed
- commit: none

## Worker Output Summary
- Disabled `POST /api/checkout/create-payment-intent` by raising HTTP 410.
- Added a backend regression test for the disabled legacy endpoint.
- Appended `L53` to `02-LOG.md`.

## Issues Found By Cloud Control
- The new test was inserted before the final assertions of `test_checkout_guest_summary_missing_product_returns_404`.
- This caused the legacy endpoint test to inherit the missing-product assertions and fail with `410 != 404`.
- The worker test did not prove that Stripe `PaymentIntent.create` was not called.
- `05-WORKER-RESULT.md` and this outbox were not updated for T8.8A.

## Cloud Repair Summary
- Restored the missing-product assertions to `test_checkout_guest_summary_missing_product_returns_404`.
- Added a monkeypatch assertion that the disabled legacy endpoint does not call `app.routes.checkout.stripe.PaymentIntent.create`.
- Updated `02-LOG.md`, `05-WORKER-RESULT.md`, and `12-GPTOSS-REVIEW.md`.

## Validation
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- result: passed, 49 tests, 1 existing SQLAlchemy deprecation warning
