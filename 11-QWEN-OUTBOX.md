# Qwen Outbox
## Task - id: `T7.5B` - name: `Orders admin all auth gating tests`
## Execution - status: `done-with-cloud-validation` - files changed: `backend/tests/test_routes.py`
## Validation - command: `.\venv\Scripts\python.exe -m pytest tests -q`
## Validation - result: passed with 24 tests and 1 existing SQLAlchemy deprecation warning
## Git - commit hash: pending - commit message: pending

### Changes made:

1. Added `test_admin_orders_all_non_admin`.
2. Added `test_admin_orders_all_admin`.

### Notes:

- The local worker wrote correct test code but failed to run validation due to PowerShell/tool-call syntax issues.
- Cloud Control validated the test suite successfully.
