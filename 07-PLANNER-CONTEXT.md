# Offline Planner Context

## Repository
`C:\Users\adria\Programacion\Programacion\koala-tshirts`

## Branch
`codex/local-iteration-shared-context`

## Project Goal
Turn Koala into a fully functional clothing ecommerce with:
- storefront
- login and registration
- guest and authenticated carts
- Stripe checkout
- order creation and completion
- admin product/category/order management
- focused tests for critical flows

## Operating Model
This project uses three AI roles:

1. Cloud Control
   - architecture, risk review, handoff writing, final review

2. Local Build Worker
   - bounded implementation tasks using Qwen/OpenCode

3. Offline Planner
   - GPT OSS report writer and roadmap observer

## Current Validated Baseline
Known validated capabilities from recent logs:
- frontend build passes
- frontend lint passes with two known Fast Refresh warnings
- backend tests run with the project venv
- backend tests passed with 50 tests after T8.9B
- admin product create/edit flow exists
- admin product list supports edit, delete, purge, retry, and duplicate action prevention
- admin product purge route is ordered before the dynamic product-id route
- admin product purge route has backend tests for admin success, unauthenticated rejection, and non-admin rejection
- backend requirements include `httpx==0.28.1`
- secure checkout uses `POST /api/orders/checkout` to create orders and Stripe PaymentIntents server-side
- frontend checkout no longer uses the client-controlled legacy payment-intent endpoint
- legacy `POST /api/checkout/create-payment-intent` is disabled with HTTP 410
- legacy `PaymentIntentIn` and `PaymentIntentOut` schemas were removed
- current Stripe webhook is `POST /api/checkout/webhook`
- incomplete legacy `POST /api/stripe/webhook` has been unregistered from the FastAPI app
- checkout webhook tests cover paid status, idempotency, stock decrement, no-negative-stock behavior, and authenticated cart clearing

## Known Persistent Warnings
Frontend lint currently has two known warnings:
- `frontend/src/context/AuthContext.jsx` exports context and component together
- `frontend/src/context/CartContext.jsx` exports context and component together

These warnings are not current blockers.

## High-Risk Areas
Do not delegate directly to a local build worker without Cloud Control design:
- major redesign of secure checkout lifecycle
- changing Stripe PaymentIntent creation semantics
- changing webhook completion semantics
- changing order finalization semantics
- changing cart clearing after payment
- amount calculation and pricing integrity
- authentication/session security model

Small, Cloud-designed, file-local checkout hardening tasks may be delegated after a precise handoff.

## Local-Worker Friendly Areas
Good candidates for local build worker tasks:
- add focused backend route tests
- update one frontend component behavior
- add one empty/error/loading state
- repair one failing test
- improve one admin table action
- add one bounded validation test
- remove one unused import/router registration
- inspect one endpoint or schema contract and write an outbox
- add one regression test to an existing test file

## Recent Local Model Failure Pattern
Qwen sometimes expands scope when a task touches checkout or routes. In fresh chats, remind it:
- do not create new routes unless explicitly requested
- do not create new test files unless explicitly listed
- do not edit route implementation files when the task only asks to unregister a router in `main.py`
- if the exact target is unclear, write `blocked` and stop

## Report Input Checklist
Before producing a planner report, read:
- `00-PLAN.md`
- `02-LOG.md`
- `05-WORKER-RESULT.md`
- `06-PLANNER-PROTOCOL.md`
- this file

If available from the user, also use:
- `git status --short`
- `git log --oneline -20`
- latest validation output

## Report Output File
Write the report to:
- `08-PLANNER-REPORT.md`

No other files should be changed by the planner.
