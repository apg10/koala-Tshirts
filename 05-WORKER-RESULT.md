## Status
`done-with-cloud-repair`

## Task
- id: `T8.7B`
- name: `Implement guest shipping form and checkout payload`
- model: `qwen3-coder:30b`
- agent: `build`

## Files Changed
- `frontend/src/pages/Checkout.jsx`
- `02-LOG.md`
- `05-WORKER-RESULT.md`
- `11-QWEN-OUTBOX.md`
- `12-GPTOSS-REVIEW.md`

## Validation
- command: `npm.cmd run build`; `npm.cmd run lint`
- directory: `C:\Users\adria\Programacion\Programacion\koala-tshirts\frontend`
- result: build passed; lint passed with two existing react-refresh warnings in `AuthContext.jsx` and `CartContext.jsx`

## Summary
Guest checkout now sends the backend-required `items` and `shipping` payload.

## Implementation
- `Checkout.jsx` now reads `cartItems` from `CartContext`.
- Guest users see a shipping form for name, email, and address.
- Guest users must provide non-empty shipping fields before checkout starts.
- Guest users with empty cart are rejected before backend checkout starts.
- Guest checkout sends `{ items, shipping }` to `/orders/checkout`.
- Authenticated checkout still sends `{}`.
- Guest `clearCart()` still runs only after Stripe reports successful payment.

## Cloud Repair
- Qwen created an out-of-scope untracked `backend/app/prime.py` file; Cloud Control removed it.
- Qwen showed the shipping form for all users; Cloud Control limited it to guests.
- Qwen used `item.id ?? item.product_id`; Cloud Control changed payload construction to use the guest cart's `product_id`.
- GPT-OSS did not update `12-GPTOSS-REVIEW.md` for T8.7B, so Cloud Control performed the review and validation directly.

## Git
- committed: pending
- commit: pending
- staged files: none yet
