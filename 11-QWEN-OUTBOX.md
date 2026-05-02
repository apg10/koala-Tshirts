# Qwen Outbox

## Task
- id: `T8.9A`
- name: `Inspect duplicate Stripe webhook routes`

## Execution
- status: `done`
- files changed: `11-QWEN-OUTBOX.md`
- validation: `not run; read-only inspection`
- commit: `none`

## Webhook Inventory
- route: `/api/checkout/webhook`
- file: `backend/app/routes/checkout.py`
- function: `stripe_webhook`
- included_in_main: `yes`
- verifies_signature: `yes`
- marks_order_paid: `yes`
- decrements_stock: `yes`
- clears_authenticated_cart: `yes`
- test_coverage: `yes`

- route: `/api/stripe/webhook`
- file: `backend/app/routes/payment.py`
- function: `stripe_webhook`
- included_in_main: `yes`
- verifies_signature: `yes`
- marks_order_paid: `yes`
- decrements_stock: `no`
- clears_authenticated_cart: `no`
- test_coverage: `no`

## Findings
- The application has two Stripe webhook routes: `/api/checkout/webhook` and `/api/stripe/webhook`
- Both routes verify Stripe signatures and mark orders as paid
- `/api/checkout/webhook` is fully-featured with stock decrementing and authenticated cart clearing
- `/api/stripe/webhook` is incomplete - missing stock decrementation and cart clearing functionality
- The checkout webhook route is the complete implementation that should be used
- The stripe webhook route is legacy and incomplete, only covering basic payment intent handling without full order processing

## Recommended Next Task
- id: `T8.9B`
- summary: Remove the incomplete `/api/stripe/webhook` route from the application
- allowed files: `backend/app/routes/payment.py` (to remove webhook route), `02-LOG.md` (update after removal)
- validation command: `.\venv\Scripts\python.exe -m pytest tests -q` to verify no regression in existing webhook tests