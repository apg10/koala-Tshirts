# Qwen Outbox

## Task
- id: `T8.3C`
- name: `Migrate frontend checkout to secure order checkout endpoint`

## Files Changed
- `frontend/src/pages/Checkout.jsx`

## Validation Attempted
- command: `npm.cmd run build`
- result: passed after Cloud Control reran outside the sandbox; initial sandbox run failed with `spawn EPERM`
- command: `npm.cmd run lint`
- result: passed with two existing react-refresh warnings

## What Changed
- Modified `Checkout.jsx` to call `/orders/checkout` instead of `/api/checkout/create-payment-intent`.
- Removed the client-controlled `{ amount: summary.total }` PaymentIntent request.
- Kept the Stripe `confirmCardPayment` flow.
- Added a guard for missing `client_secret`.

## Risks / Needs Cloud Review
- Authenticated checkout is now aligned with the secure backend endpoint.
- Guest checkout still requires a future shipping/details UI because the backend requires guest `items` and `shipping`.

## Stop
Stopped after implementation. No commit made by Qwen.
