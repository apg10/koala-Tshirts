## Status
`done-with-cloud-repair`

## Task
- id: `T8.6C`
- name: `Clear guest cart after successful Stripe confirmation`
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
Guest carts are now cleared in the frontend only after Stripe confirms successful payment.

## Implementation
- `Checkout.jsx` now accesses `clearCart` from `CartContext`.
- `Checkout.jsx` checks `user` from `AuthContext`.
- After `stripe.confirmCardPayment(...)` returns `paymentIntent.status === "succeeded"`, the frontend calls `clearCart()` only when there is no authenticated user.
- Failed Stripe confirmation paths do not clear the cart.
- Authenticated cart clearing remains in the successful webhook path.

## Cloud Repair
- Qwen called `clearCart()` for both guest and authenticated users.
- GPT-OSS reviewed the change as trusted but did not catch that authenticated cart clearing was now duplicated with the webhook flow.
- Cloud Control limited `clearCart()` to guest users with `if (!user)`.

## Git
- committed: pending
- commit: pending
- staged files: none yet
