---
name: backend-test-task
description: Add or repair focused pytest coverage for the Koala FastAPI backend while preserving existing tests and app code.
compatibility: opencode
metadata:
  project: koala-tshirts
  role: backend-tests
---

## Use This Skill When

Use this for backend pytest tasks in:

- `backend/tests/test_routes.py`
- `backend/tests/test_crud.py`

## Test Rules

- Do not edit application code during a test-only task.
- Use existing imports and fixtures when possible.
- Use `client` for API requests.
- Use `db_session` only when database setup is needed.
- Always clear `app.dependency_overrides` in `finally` blocks.
- Create valid model data that satisfies response schemas.
- Preserve existing tests.
- Do not create new test files unless explicitly allowed.

## Common Patterns

For auth overrides:

- non-admin user: override `auth.get_current_user`
- admin user: override `auth.get_current_admin`

For model setup:

- create category before product
- product response data must include a string `image`
- order ownership should use `user_id=user.id`
- order item should point to a real product

## Validation

Run from backend:

`.\venv\Scripts\python.exe -m pytest tests -q`

