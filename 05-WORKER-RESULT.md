# Worker Result

## Task
- id: Q36-CART-1
- name: safe cart money rendering

## Changes
- frontend/src/pages/Cart.jsx: Added `formatMoney(value)` helper that coerces `Number(value)` and returns `"$0.00"` for non-finite results. Normalized price (default 0) and qty (default 1, clamped >= 1) in the `cartItems.map` reducer. Replaced all direct `.toFixed(2)` rendering (item price, item total, subtotal, tax, total) with `formatMoney(...)`.

## Validation
- command: `Set-Location C:\Users\adria\Programacion\Programacion\koala-tshirts\frontend; npm.cmd run build`
- result: built successfully (257 modules, no errors)

## Scope
- files changed: frontend/src/pages/Cart.jsx
- forbidden files changed: none
- new files created: none
- deleted files: none

## Commit
- none

## Discovered Out-of-Scope Bugs
- none

## Stop
- stopped_after_result: yes
