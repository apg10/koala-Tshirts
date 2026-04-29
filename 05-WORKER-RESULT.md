## Status
`done-with-cloud-validation`

## Task
- id: `T8.3C`
- name: `Migrate frontend checkout to secure order checkout endpoint`
- model: `qwen3-coder:30b`
- agent: `build`

## Files Changed
- `frontend/src/pages/Checkout.jsx`
- `02-LOG.md`
- `05-WORKER-RESULT.md`
- `11-QWEN-OUTBOX.md`

## Validation
- command: `npm.cmd run build`
- directory: `C:\Users\adria\Programacion\Programacion\koala-tshirts\frontend`
- result: passed
- command: `npm.cmd run lint`
- directory: `C:\Users\adria\Programacion\Programacion\koala-tshirts\frontend`
- result: passed with two existing react-refresh warnings in `AuthContext.jsx` and `CartContext.jsx`

## Summary
The frontend checkout flow now uses the secure backend order checkout endpoint instead of the legacy client-controlled PaymentIntent endpoint.

## Implementation
- Replaced `api.post("/api/checkout/create-payment-intent", { amount: summary.total })` with `api.post("/orders/checkout", {})`.
- Removed client-controlled payment amount submission from the frontend.
- Preserved Stripe `confirmCardPayment` behavior.
- Added a guard for missing `client_secret`.

## Known Follow-Up
- Guest checkout still needs a dedicated shipping/details UI before it can use `/orders/checkout`, because the backend requires guest `items` and `shipping`.

## Git
- committed: pending
- commit: pending
- staged files: none yet
