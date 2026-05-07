# Qwen Outbox

## Task
- id: Q36-CHECKOUT-1
- name: safe checkout money rendering and visible text cleanup

## Execution
- status: done
- files changed: frontend/src/pages/Checkout.jsx
- validation: `npm.cmd run build` in frontend/ — passed (built in 1.88s, 257 modules)
- commit: none

## Summary
- Added `formatMoney(value)` helper to safely handle malformed money values, returning `$0.00` for non-finite numbers
- Fixed visible mojibake text: elipsis characters and× symbol in checkout page strings

## Stop
- stopped_after_outbox: yes
