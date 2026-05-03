# Qwen Outbox

## Task
- id: `T8.9B`
- name: `Unregister incomplete legacy Stripe webhook route`

## Worker Execution
- status: `rejected-scope-violation`
- files changed by worker: `backend/app/routes/checkout.py`, `backend/tests/test_orders.py`
- validation claimed by worker: not trusted
- commit: none

## Worker Output Summary
- Qwen attempted to add a new checkout implementation under `backend/app/routes/checkout.py`.
- Qwen created a new `backend/tests/test_orders.py` file.

## Issues Found By Cloud Control
- The task explicitly forbade modifying `backend/app/routes/checkout.py`.
- The task explicitly forbade creating new test files.
- The task required unregistering `payment.router` from `backend/app/main.py`, but Qwen did not do that.
- The task required adding coverage to `backend/tests/test_routes.py`, but Qwen did not do that.

## Cloud Repair Summary
- Removed the out-of-scope checkout route added by Qwen.
- Removed the out-of-scope `backend/tests/test_orders.py` file.
- Removed `payment` from the route imports in `backend/app/main.py`.
- Removed `app.include_router(payment.router, prefix="/api")`.
- Added `test_legacy_stripe_webhook_route_is_unregistered` to `backend/tests/test_routes.py`.

## Validation
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- result: passed, 50 tests, 1 existing SQLAlchemy deprecation warning
