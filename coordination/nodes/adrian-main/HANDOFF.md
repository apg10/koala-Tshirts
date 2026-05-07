# Adrian Main Handoff

## Task
- id: `T8.3`
- name: `Migrate frontend checkout to orders checkout contract`
- owner node: `adrian-main`
- branch: `codex/adrian/T8.3-frontend-orders-checkout`

## Goal

Change the frontend checkout page so it uses the secure backend order checkout contract instead of the legacy client-controlled PaymentIntent endpoint.

## Current Repo Truth

- Latest accepted checkout test commit: `8ae79b3 T8.2R repair checkout contract tests`
- Backend tests pass with `34 passed, 1 warning`
- `POST /api/orders/checkout` creates a pending order and Stripe PaymentIntent server-side.
- `frontend/src/pages/Checkout.jsx` still calls `/api/checkout/create-payment-intent` with `amount: summary.total`.

## Modify Only

- `frontend/src/pages/Checkout.jsx`
- `02-LOG.md`
- `05-WORKER-RESULT.md`
- `11-QWEN-OUTBOX.md`

## Read Only

- `backend/app/routes/orders.py`
- `backend/app/routes/checkout.py`
- `backend/app/schemas.py`
- `frontend/src/context/CartContext.jsx`

## Forbidden

- do not edit backend code
- do not edit backend tests
- do not edit package/config files
- do not edit roadmap files
- do not implement webhook behavior in this task
- do not remove the legacy backend checkout endpoint in this task

## Required Work

1. In `Checkout.jsx`, stop calling `/api/checkout/create-payment-intent`.
2. On submit, call `POST /api/orders/checkout`.
3. Use the returned order data and Stripe client secret if available from the backend response.
4. If the current backend response does not expose `client_secret`, stop and report the contract gap instead of inventing frontend-only behavior.
5. Preserve current UI shape and error handling as much as possible.
6. Do not change Stripe/webhook backend in this task.

## Validation

Frontend directory:

```text
C:\Users\adria\Programacion\Programacion\koala-tshirts\frontend
```

Commands:

```powershell
npm.cmd run build
npm.cmd run lint
```

Backend directory:

```text
C:\Users\adria\Programacion\Programacion\koala-tshirts\backend
```

Command:

```powershell
.\venv\Scripts\python.exe -m pytest tests -q
```

## Done When

- frontend no longer sends `amount` to `/api/checkout/create-payment-intent`
- validation passes, or a precise backend contract gap is reported
- worker writes `05-WORKER-RESULT.md` and `11-QWEN-OUTBOX.md`
- worker stops

