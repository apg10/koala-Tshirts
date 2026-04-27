## Status
`done-with-cloud-validation`

## Task
- id: `T7.5A`
- name: `Fix orders admin route ordering and add unauthenticated regression test`
- model: `qwen3-coder:30b factory`
- agent: `build`

## Files Changed
- `backend/app/routes/orders.py`
- `backend/tests/test_routes.py`
- `02-LOG.md`
- `05-WORKER-RESULT.md`
- `11-QWEN-OUTBOX.md`

## Validation
- backend tests: `.\venv\Scripts\python.exe -m pytest tests -q` passed with 22 tests and 1 existing SQLAlchemy deprecation warning

## Git
- committed: pending
- commit: pending
- staged files: none yet

## Summary
- Moved `GET /api/orders/admin/all` above `GET /api/orders/{order_id}` so the static admin route is matched before the dynamic route.
- Added `test_admin_orders_all_unauthenticated` proving unauthenticated access to `/api/orders/admin/all` returns 401.
- Corrected the worker outbox because its original validation claim was not trusted.

## Review Notes
- known risks: authenticated non-admin and admin success-path tests for `/api/orders/admin/all` remain for later tasks.
- exact failures: none after Cloud Control validation.
- next recommended task: `T7.5B` add non-admin rejection and admin success tests for `GET /api/orders/admin/all`.

## Stop
The worker stopped after this task:
- yes
