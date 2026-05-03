## Task: T8.10E

- **Task ID**: T8.10E
- **Files changed**: 
  - `frontend/src/pages/__tests__/Checkout.test.jsx`
- **Command**: `npm.cmd run test:ci -- Checkout.test.jsx`
- **Result**: passed, 6 tests
- **Notes**: Added a new test case `shows error when checkout response is missing client_secret` that:
  1. Mocks checkout summary loading successfully
  2. Mocks api.post("/orders/checkout", {}) returning with no client_secret
  3. Renders authenticated checkout
  4. Clicks the Pay button
  5. Asserts the UI shows "Payment processing failed. Please try again."
  6. Asserts Stripe confirmCardPayment is not called
  7. Preserved all existing tests
  8. Cloud Control also re-ran the backend suite: `.\venv\Scripts\python.exe -m pytest tests -q`, passed 52 tests with 1 existing SQLAlchemy deprecation warning.
