# GPTOSS Review

## Task
`T8.9A`

## Verdict
`cloud-reviewed`

## Evidence Checked
- `backend/app/main.py`
- `backend/app/routes/checkout.py`
- `backend/app/routes/payment.py`
- `backend/tests/test_routes.py`
- `11-QWEN-OUTBOX.md`

## Accepted Findings
- The app currently registers two Stripe webhook routes.
- `/api/checkout/webhook` is implemented in `backend/app/routes/checkout.py` and is included through `checkout.router`.
- `/api/stripe/webhook` is implemented in `backend/app/routes/payment.py` and is included through `payment.router`.
- `/api/checkout/webhook` verifies Stripe signatures, marks orders paid, decrements stock idempotently, and clears authenticated carts after payment success.
- `/api/stripe/webhook` verifies Stripe signatures and marks orders paid, but does not decrement stock, does not clear carts, and does not use `order_id` metadata fallback logic.
- Existing webhook tests cover `/api/checkout/webhook`.
- No tests cover `/api/stripe/webhook`.
- No frontend references to `/api/stripe/webhook` were found.

## Disagreements Or Corrections
- Qwen's recommendation listed `backend/app/routes/payment.py` as the main implementation file for cleanup, but the smallest safe route removal should include `backend/app/main.py` because that is where `payment.router` is registered.
- If `payment.py` has no other routes, leaving it unused is acceptable for a first cleanup, but removing the import and router registration is the behavior-changing step.

## Recommended Cloud Action
- no-commit for code; optional commit for inspection docs

## Recommended Next Task
- id: `T8.9B`
- summary: Unregister the incomplete legacy `/api/stripe/webhook` route from the FastAPI app and add regression coverage that it is no longer available while `/api/checkout/webhook` remains covered.
- allowed files: `backend/app/main.py`, `backend/tests/test_routes.py`, `02-LOG.md`, `05-WORKER-RESULT.md`, `11-QWEN-OUTBOX.md`
- validation command: `.\venv\Scripts\python.exe -m pytest tests -q`
