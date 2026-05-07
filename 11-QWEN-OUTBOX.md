# Qwen Outbox

## Task
- id: Q36-CART-1
- name: safe cart money rendering

## Execution
- status: done
- files changed: frontend/src/pages/Cart.jsx
- validation: `npm.cmd run build` passed successfully (257 modules, no errors)
- commit: none

## Summary
- Added `formatMoney(value)` helper and normalized price/qty in `cartItems.map` to prevent NaN totals from malformed cart data.
- Replaced all direct `.toFixed(2)` money rendering with `formatMoney(...)` for item price, item total, subtotal, tax, and total.

## Stop
- stopped_after_outbox: yes
