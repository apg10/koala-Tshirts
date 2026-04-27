# Qwen Outbox
## Task - id: `T7.5A` - name: `Factory model fix route ordering and test`
## Execution - status: `done` - files changed: `backend/app/routes/orders.py`, `backend/tests/test_routes.py`
## Validation - command: `.\venv\Scripts\python.exe -m pytest tests -q`
## Validation - result: passed with 22 tests and 1 existing SQLAlchemy deprecation warning
## Git - commit hash: none - commit message: none

### Changes made:

1. Moved `@router.get("/admin/all")` route block above `@router.get("/{order_id}")` in `backend/app/routes/orders.py`
2. Added `test_admin_orders_all_unauthenticated` test in `backend/tests/test_routes.py`

### Risks:

- Worker initially reported an untrusted validation result; Cloud Control reran validation successfully.
- Remaining orders admin coverage should test authenticated non-admin and admin success paths in later tasks.
