# Qwen Outbox

## Task
- id: `T7.5D`
- name: `Repair order created schema and products route`
- source handoff: Cloud Control repair after Qwen Max order regression test

## Execution
- status: done-with-cloud-repair
- files changed: `backend/app/schemas.py`, `backend/tests/test_routes.py`, `02-LOG.md`, `05-WORKER-RESULT.md`, `11-QWEN-OUTBOX.md`
- files intentionally not changed: `backend/app/routes/orders.py`, auth, models, frontend files
- out-of-scope files noticed: `backend/run_tests.py` was created and removed
- scope exceptions: Cloud Control verified `backend/app/routes/products.py` was restored after an out-of-scope worker change; no content diff remains for that file

## Validation
- command: `.\venv\Scripts\python.exe -m pytest tests -q`
- directory: `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend`
- result: passed with 25 tests and 1 existing SQLAlchemy deprecation warning
- exact failure if any: none

## Git
- staged files: pending
- commit hash: pending
- commit message: pending
- uncommitted task files: pending
- unrelated dirty files: `01-HANDOFF.md`, `08-PLANNER-REPORT.md`, `12-GPTOSS-REVIEW.md`, workflow docs

## Summary
- Added and preserved a regression test proving admin order listing returns existing order data.
- Changed `OrderOut.created` to `datetime`.
- Restored public product route prefix to `/products`.

## Risks
- Checkout/payment lifecycle still needs design and validation.

## Discovered Out-Of-Scope Bugs
- none remaining after validation

## Next Candidate
- task id/name: `T8.1 checkout/payment lifecycle inventory`
- reason: backend order/admin coverage is now healthier; checkout and Stripe remain the highest-risk ecommerce flow.
