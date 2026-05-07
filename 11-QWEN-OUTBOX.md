# Qwen Outbox

## Task
- id: Q36-CODE-1
- name: safe ProductCard price rendering

## Execution
- status: done
- files changed: frontend/src/components/ProductCard.jsx
- validation: `Set-Location C:\Users\adria\Programacion\Programacion\koala-tshirts\frontend; npm.cmd run build` → built successfully
- commit: none

## Summary
- Added `displayPrice` normalization in ProductCard: `Number(price ?? 0)` with NaN guard returning `$0.00`, otherwise `$X.XX` format.
- Replaced unsafe `price?.toFixed(2)` with `{displayPrice}` in render.
- Build passes. No new, deleted, or out-of-scope files changed.

## Stop
- stopped_after_outbox: yes
