# Qwen Outbox

## Task
- id: `T8.3B`
- name: `Return checkout client secret`

## Execution
- status: `done-with-cloud-validation`
- files changed: `backend/app/schemas.py`, `backend/app/routes/orders.py`, `backend/tests/test_routes.py`, `02-LOG.md`, `05-WORKER-RESULT.md`, `11-QWEN-OUTBOX.md`
- validation: `.\venv\Scripts\python.exe -m pytest tests -q` passed with 34 tests and 1 existing SQLAlchemy deprecation warning
- commit: `pending`

## Findings
- frontend_checkout_endpoint: `/api/checkout/create-payment-intent`
- backend_checkout_endpoint: `/api/orders/checkout`
- backend_response_schema: `CheckoutOut`
- response_has_client_secret: `true`
- response_has_order_id: `true`
- legacy_payment_intent_endpoint_still_used_by_frontend: `true`

## Contract Assessment
- The secure checkout endpoint now creates the order and returns the PaymentIntent `client_secret`.
- The checkout amount remains server-calculated from product prices.
- The frontend can now be migrated away from the legacy client-amount PaymentIntent endpoint in a separate task.

## Recommended Next Task
- id: `T8.3C`
- name: `Migrate frontend checkout to secure order checkout endpoint`
- allowed files: `frontend/src/pages/Checkout.jsx`, `02-LOG.md`, `05-WORKER-RESULT.md`, `11-QWEN-OUTBOX.md`
- summary: Replace the legacy `/api/checkout/create-payment-intent` call with `/api/orders/checkout`, then use the returned `client_secret` for Stripe confirmation.
