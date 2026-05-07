# Local Model Task Queue

## Purpose
Coordinate Qwen build workers and GPT OSS offline planner without letting either model control the roadmap directly.

This file is a planning buffer. It is not the active handoff.

Active implementation still comes only from:
- `01-HANDOFF.md`

Planner output still goes only to:
- `08-PLANNER-REPORT.md`

## Model Roles

### Qwen Build Worker
Use for bounded implementation:
- one task
- explicit allowed files
- validation required
- commit required

### GPT OSS Planner
Use for offline reporting:
- summarize progress
- identify drift
- propose next microtasks
- never edit code
- never commit
- write only `08-PLANNER-REPORT.md` in file-report mode

### Cloud Control
Use for:
- final review
- architecture
- checkout/Stripe/order lifecycle design
- converting planner ideas into executable handoffs

## Current Active Task

### QWEN-ACTIVE: `I1`
Task:
- Orders read-side backend reliability iteration.

Active handoff:
- `01-HANDOFF.md`

Validation:
- `.\venv\Scripts\python.exe -m pytest tests -q`

Expected outcome:
- `T7.6A` adds local order test factories in `backend/tests/test_routes.py`
- `T7.6B` tests order detail authentication and ownership
- `T7.6C` tests current-user order list ownership
- each deliverable validates and commits independently

## Parallel Planner Task

### GPT-PLAN-1: Offline Roadmap Health Report
Task:
- Generate or refresh `08-PLANNER-REPORT.md`.

Command:
```powershell
opencode run --agent build --model ollama/gptoss20-reviewer
```

Allowed write:
- `08-PLANNER-REPORT.md`

Read:
- `06-PLANNER-PROTOCOL.md`
- `07-PLANNER-CONTEXT.md`
- `00-PLAN.md`
- `02-LOG.md`
- `05-WORKER-RESULT.md`

Goal:
- identify roadmap/log drift
- summarize current phase
- propose next 3 local-worker tasks
- mark Cloud-Control-only tasks

Cloud Control must verify the report before using it.

## Next Qwen Candidate Tasks

### T7.3 Fix Orders Admin Route Ordering
Why:
- `backend/app/routes/orders.py` declares `GET /orders/{order_id}` before `GET /orders/admin/all`.
- Static admin routes should be declared before dynamic id routes to avoid route matching issues.

Candidate allowed files:
- `backend/app/routes/orders.py`
- `backend/tests/test_routes.py`
- `02-LOG.md`
- `05-WORKER-RESULT.md`

Expected behavior:
- move `GET /orders/admin/all` above `GET /orders/{order_id}`
- add a regression test that `/api/orders/admin/all` does not get swallowed by `/{order_id}`
- keep auth behavior unchanged
- backend tests pass

Risk:
- order response schema may need seeded order data if testing success response.
- safer first test may assert unauthenticated access returns `401` for `/api/orders/admin/all`, proving the static route is matched and protected.

Recommended scope:
- route ordering + unauthenticated `401` regression test only.

### T7.4 Add Category Update/Delete Auth Tests
Why:
- T7.2 covers category create auth.
- Category update/delete also require admin and should have focused tests.

Candidate allowed files:
- `backend/tests/test_routes.py`
- `02-LOG.md`
- `05-WORKER-RESULT.md`

Expected behavior:
- unauthenticated `PUT /api/categories/{id}` returns `401`
- non-admin `PUT /api/categories/{id}` returns `403`
- unauthenticated `DELETE /api/categories/{id}` returns `401`
- non-admin `DELETE /api/categories/{id}` returns `403`
- backend tests pass

Recommended scope:
- rejection tests only, no app code changes.

### T7.5 Add Product Admin Route Auth Matrix
Why:
- purge route now has auth tests.
- create/update/delete product admin routes still need equivalent auth coverage.

Candidate allowed files:
- `backend/tests/test_routes.py`
- `02-LOG.md`
- `05-WORKER-RESULT.md`

Expected behavior:
- unauthenticated create/update/delete admin product routes reject with `401`
- non-admin create/update/delete admin product routes reject with `403`
- backend tests pass

Risk:
- product create uses multipart form and file upload, so keep tests limited to auth rejection first.

Recommended scope:
- rejection tests only; do not test successful upload in this task.

### T16.1 Add Backend Test Helpers For Auth Overrides
Why:
- Tests are starting to repeat admin/non-admin override code.
- A small helper can reduce future mistakes.

Candidate allowed files:
- `backend/tests/test_routes.py`
- `02-LOG.md`
- `05-WORKER-RESULT.md`

Expected behavior:
- add local helper functions in `test_routes.py` only
- preserve all existing tests
- no new files
- backend tests pass

Risk:
- only do after T7.2/T7.4/T7.5 if duplication becomes annoying.

## Cloud-Control-Only Tasks

### T8 Secure Checkout Lifecycle Design
Do not delegate directly to Qwen.

Needs Cloud Control first because it defines:
- pending order model/state
- server-side amount calculation
- PaymentIntent metadata
- Stripe webhook idempotency
- cart clearing rules
- guest vs authenticated checkout contract

### T9 Backend Pending Order + PaymentIntent
Blocked by T8.

### T10 Frontend Checkout Contract
Blocked by T8.

### T11 Webhook Completion And Cart Clearing
Blocked by T8.

## Suggested Two-Model Rhythm

1. Qwen executes one task from `01-HANDOFF.md`.
2. Cloud Control reviews and commits/fixes.
3. GPT OSS planner refreshes `08-PLANNER-REPORT.md` every 2-3 commits.
4. Cloud Control compares `08-PLANNER-REPORT.md` against repo reality.
5. Cloud Control promotes one candidate from this queue into `01-HANDOFF.md`.

## Do Not Do
- Do not let GPT OSS write `01-HANDOFF.md`.
- Do not let GPT OSS mark tasks done.
- Do not let Qwen choose its own next task.
- Do not run checkout/Stripe implementation through local models without Cloud Control design.
- Do not allow either local model to use `git add .`.

## Current Recommendation
Finish current `T7.2`, then run:
1. `T7.3` orders admin route ordering regression.
2. `T7.4` category update/delete auth rejection tests.
3. GPT OSS report refresh.
4. Cloud Control begins `T8` secure checkout design.
