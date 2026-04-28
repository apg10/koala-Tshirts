## Status
`done`

## Task
- id: `T8.2R`
- name: `Repair checkout contract tests`
- model: `qwen3-coder-max`
- agent: `build`

## Files Changed
- `backend/tests/test_routes.py`
- `02-LOG.md`
- `05-WORKER-RESULT.md`
- `11-QWEN-OUTBOX.md`

## Validation
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- directory: `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend`
- result: passed with 34 tests (all existing + new) and 1 existing SQLAlchemy deprecation warning

## Git
- committed: pending
- commit: pending
- staged files: none yet

## Summary
Repaired backend tests for POST /api/orders/checkout endpoint to fix dependency override issue.

## Problem
The checkout endpoint uses `auth.optional_user` dependency but the tests were overriding `auth.get_current_user`, causing the authenticated checkout test to fail with HTTP 400 instead of expected 201.

## Solution
- Changed `app.dependency_overrides[auth.get_current_user]` to `app.dependency_overrides[auth.optional_user]` in both checkout tests
- Changed `app.dependency_overrides.pop(auth.get_current_user, None)` to `app.dependency_overrides.pop(auth.optional_user, None)` in both checkout tests
- All 34 tests now pass with correct validation

## Files Modified
- backend/tests/test_routes.py (fixed dependency override in 2 checkout test functions)
- 02-LOG.md (added T8.2R repair task entry L38)
- 05-WORKER-RESULT.md (updated with factual repair result)
- 11-QWEN-OUTBOX.md (updated with factual repair result)