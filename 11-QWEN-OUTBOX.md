# Qwen Outbox

## Task
- id: `T8.12D`
- name: `Backend cart contract tests`

## Execution
- status: `done-by-cloud-control`
- files changed:
  - `backend/tests/test_routes.py`
  - `02-LOG.md`
  - `05-WORKER-RESULT.md`
  - `11-QWEN-OUTBOX.md`

## Tests Added
1. `test_cart_get_unauthenticated_returns_401`
2. `test_cart_get_authenticated_creates_empty_cart`
3. `test_cart_add_item_merges_existing_quantity`
4. `test_cart_add_item_rejects_insufficient_stock`
5. `test_cart_update_qty_zero_removes_item`
6. `test_cart_clear_removes_all_items`

## Validation
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- result: passed, 65 tests, 3 SQLAlchemy deprecation warnings
- command: `npm.cmd run test:ci`
- result: passed, 15 tests
- command: `npm.cmd run build`
- result: passed

## Commit
- hash: see `git log --oneline -1`
- message: `T8.12D test cart contracts`
