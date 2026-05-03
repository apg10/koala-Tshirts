# Qwen Outbox

## Task
- id: `T8.10A`
- name: `Test checkout uses secure endpoint`
- source handoff: direct Cloud Control prompt

## Execution
- status: `done-with-cloud-polish`
- files changed: `frontend/src/pages/__tests__/Checkout.test.jsx`, `11-QWEN-OUTBOX.md`
- files intentionally not changed: `frontend/src/pages/Checkout.jsx`, backend files, context files
- out-of-scope files noticed: none
- scope exceptions: none
- forbidden files changed: none
- new files created: none
- deleted files: none

## Validation
- command: `npm.cmd run test:ci -- Checkout.test.jsx`
- directory: `C:\Users\adria\Programacion\Programacion\koala-tshirts\frontend`
- result: passed, 4 tests
- exact failure if any: none

## Git
- staged files: none
- commit hash: pending
- commit message: pending
- uncommitted task files: yes
- unrelated dirty files: none

## Summary
- Added a focused Checkout regression test that submits checkout through `/orders/checkout`.
- The test asserts the legacy `/checkout/create-payment-intent` endpoint is not called.
- Cloud Control polished the test to use existing mocks and avoid React `act()` warnings.

## Risks
- none identified

## Discovered Out-Of-Scope Bugs
- none

## Next Candidate
- task id/name: `T8.10B` add backend regression test for non-success checkout webhook event
- reason: verify webhook ignores non-success PaymentIntent events without changing order status
