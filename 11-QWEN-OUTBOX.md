# Qwen Outbox

## Task
- id: `T8.12E`
- name: `Backend cart edge-case tests`

## Execution
- status: `done-by-cloud-control`
- files changed:
  - `backend/tests/test_routes.py`
  - `02-LOG.md`
  - `05-WORKER-RESULT.md`
  - `11-QWEN-OUTBOX.md`

## Tests Added
1. `test_cart_update_missing_item_returns_404`
2. `test_cart_update_rejects_insufficient_stock`
3. `test_cart_delete_missing_item_returns_404`
4. `test_cart_delete_item_removes_only_selected_item`

## Validation
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- result: passed, 69 tests, 3 SQLAlchemy deprecation warnings
- command: `npm.cmd run test:ci`
- result: passed, 15 tests
- command: `npm.cmd run build`
- result: passed

## Commit
- hash: see `git log --oneline -1`
- message: `T8.12E test backend cart edge cases`
