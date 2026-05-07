# Current Worker Handoff

## Iteration ID
I1

## Iteration Name
Orders read-side backend reliability

## Repository
- `C:\Users\adria\Programacion\Programacion\koala-tshirts`

## Branch
- `codex/local-iteration-shared-context`

## Worker Role
You are Qwen Build Worker.

This is an iteration packet, not a free-form project task. Execute the deliverables in order. Each deliverable is a small task with its own validation and commit. Stop immediately if any deliverable fails validation or if any out-of-scope file changes.

Important current-state note:
- There may already be uncommitted partial order-detail tests in `backend/tests/test_routes.py` from a previous local worker attempt.
- Do not discard them.
- Adopt and repair them only if the preflight validation shows they are the reason the suite fails.

## Read First
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\03-WORKER-PROTOCOL.md`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\10-AGENT-COMMUNICATION-PROTOCOL.md`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\02-LOG.md`

## Allowed Write Files For This Iteration
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend\tests\test_routes.py`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\02-LOG.md`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\05-WORKER-RESULT.md`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\11-QWEN-OUTBOX.md`

## Read-Only Reference Files
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend\tests\conftest.py`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend\app\routes\orders.py`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend\app\models.py`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend\app\schemas.py`
- `C:\Users\adria\Programacion\Programacion\koala-tshirts\backend\app\auth.py`

## Forbidden Files And Actions
- Do not edit application code.
- Do not edit frontend files.
- Do not create new test files.
- Do not create helper scripts or synthetic test runners.
- Do not edit `00-PLAN.md`.
- Do not edit `01-HANDOFF.md`.
- Do not edit `03-WORKER-PROTOCOL.md`.
- Do not edit `08-PLANNER-REPORT.md`.
- Do not edit `10-AGENT-COMMUNICATION-PROTOCOL.md`.
- Do not edit `12-GPTOSS-REVIEW.md`.
- Do not run `git add .`.
- Do not run `git reset`, `git restore`, `git checkout --`, or `git clean`.
- Do not continue beyond deliverable `I1.D3`.

## Starting Preflight Check
Before editing, run:

Directory:
`C:\Users\adria\Programacion\Programacion\koala-tshirts\backend`

Command:
`.\venv\Scripts\python.exe -m pytest tests -q`

Expected:
- `25 passed`

If the suite passes, continue to `I1.D1`.

If the suite fails only because existing partial order-detail tests in `backend/tests/test_routes.py` are invalid, execute `I1.D0` first.

If the suite fails for any other reason, do not edit files. Write `blocked-baseline` to `05-WORKER-RESULT.md` and `11-QWEN-OUTBOX.md`, then stop.

## PowerShell Rules
- Use `Set-Location -LiteralPath "C:\Users\adria\Programacion\Programacion\koala-tshirts"` before git commands.
- Use `Set-Location -LiteralPath "C:\Users\adria\Programacion\Programacion\koala-tshirts\backend"` before pytest.
- Do not use `&&`.
- If a shell command fails because of PowerShell syntax, retry once with the rules above. If it fails again, stop and report `blocked`.

## Iteration Deliverables

### I1.D0 - Adopt And Repair Existing Partial Order Detail Tests
Task ID:
- `T7.6R`

Goal:
- Repair existing uncommitted `GET /api/orders/{order_id}` tests if they already exist and are failing.

Allowed implementation:
- Modify only `backend/tests/test_routes.py`, `02-LOG.md`, `05-WORKER-RESULT.md`, and `11-QWEN-OUTBOX.md`.
- Do not edit application code.
- Do not remove the order-detail test intent.
- Fix only test setup problems.
- Use valid product data that satisfies response schemas, including `image`.
- When creating an owned order, set `user_id` directly on `models.Order`.
- Keep unauthenticated, non-owner, and owner coverage.

Known possible failure to repair:
- `ResponseValidationError` where `items[0].product.image` is `None`.

Validation:
- From backend directory, run `.\venv\Scripts\python.exe -m pytest tests -q`.

If validation passes:
- Append `L35` to `02-LOG.md`.
- Overwrite `05-WORKER-RESULT.md`.
- Overwrite `11-QWEN-OUTBOX.md`.
- Stage only allowed files changed by this deliverable.
- Commit with message: `T7.6R repair order detail tests`.
- Record real commit hash.
- Continue to `I1.D1`.

If validation fails:
- Do not commit.
- Write exact failure summary to `05-WORKER-RESULT.md` and `11-QWEN-OUTBOX.md`.
- Stop.

### I1.D1 - Add Local Order Test Factories
Task ID:
- `T7.6A`

Goal:
- Add small helper functions inside `backend/tests/test_routes.py` to reduce repeated setup for order tests.

Allowed implementation:
- Add helper functions only in `backend/tests/test_routes.py`.
- Helpers may create:
  - a user
  - a category
  - a product
  - an order
  - one order item
- Helpers must use the existing `db_session`.
- Helpers must not hide assertions.
- Helpers must not change existing tests unless required to keep formatting consistent.

Validation:
- From backend directory, run `.\venv\Scripts\python.exe -m pytest tests -q`.

If validation passes:
- Append the next available log entry after the latest `L` entry in `02-LOG.md`.
- Overwrite `05-WORKER-RESULT.md`.
- Overwrite `11-QWEN-OUTBOX.md`.
- Stage only allowed files changed by this deliverable.
- Commit with message: `T7.6A add order test factories`.
- Record real commit hash.
- Continue to `I1.D2`.

If validation fails:
- Do not commit.
- Write exact failure summary to `05-WORKER-RESULT.md` and `11-QWEN-OUTBOX.md`.
- Stop.

### I1.D2 - Test Order Detail Auth And Ownership
Task ID:
- `T7.6B`

Goal:
- Add backend tests for `GET /api/orders/{order_id}` authentication and ownership behavior.

Required tests:
1. `GET /api/orders/1` without auth returns `401`.
2. `GET /api/orders/{order_id}` as an authenticated user who does not own the order returns `404`.
3. `GET /api/orders/{order_id}` as the owning authenticated user returns `200`.
4. Successful response includes:
   - created order id
   - status
   - total
   - items
   - exactly one item
   - item product id matching the created product

Implementation hints:
- Use helpers from `I1.D1`.
- Override `auth.get_current_user` for authenticated tests.
- Always clear dependency overrides in `finally` blocks.
- Do not edit `orders.py`; if behavior is wrong, report it and stop.

Validation:
- From backend directory, run `.\venv\Scripts\python.exe -m pytest tests -q`.

If validation passes:
- Append the next available log entry after the latest `L` entry in `02-LOG.md`.
- Overwrite `05-WORKER-RESULT.md`.
- Overwrite `11-QWEN-OUTBOX.md`.
- Stage only allowed files changed by this deliverable.
- Commit with message: `T7.6B test order detail ownership`.
- Record real commit hash.
- Continue to `I1.D3`.

If validation fails:
- Do not commit.
- Write exact failure summary to `05-WORKER-RESULT.md` and `11-QWEN-OUTBOX.md`.
- Stop.

### I1.D3 - Test My Orders List Ownership
Task ID:
- `T7.6C`

Goal:
- Add backend tests for `GET /api/orders/` showing users only see their own orders.

Required tests:
1. `GET /api/orders/` without auth returns `401`.
2. Authenticated user with no orders gets `200` and an empty list.
3. Authenticated user with one owned order and one other user's order gets `200` and only the owned order.
4. Successful owned-order response includes `items` and exactly one item.

Implementation hints:
- Use helpers from `I1.D1`.
- Override `auth.get_current_user` for authenticated tests.
- Create two users and two orders for the ownership filtering test.
- Do not edit `orders.py`; if behavior is wrong, report it and stop.

Validation:
- From backend directory, run `.\venv\Scripts\python.exe -m pytest tests -q`.

If validation passes:
- Append the next available log entry after the latest `L` entry in `02-LOG.md`.
- Overwrite `05-WORKER-RESULT.md`.
- Overwrite `11-QWEN-OUTBOX.md`.
- Stage only allowed files changed by this deliverable.
- Commit with message: `T7.6C test my orders ownership`.
- Record real commit hash.
- Stop.

If validation fails:
- Do not commit.
- Write exact failure summary to `05-WORKER-RESULT.md` and `11-QWEN-OUTBOX.md`.
- Stop.

## Required Result Packet Shape
At the end of each deliverable, `05-WORKER-RESULT.md` and `11-QWEN-OUTBOX.md` must include:

- task id
- status: `done`, `failed`, or `blocked`
- files changed
- validation command
- validation result
- commit hash if committed
- scope exceptions: `none` or exact list
- unrelated dirty files noticed
- discovered out-of-scope bugs
- next action taken: continue to next deliverable or stop

## Final Stop Condition
Stop after `I1.D3`, even if more work looks obvious.
