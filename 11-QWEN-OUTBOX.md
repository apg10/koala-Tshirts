## Task T8.10F-R2 Result

### Summary
Successfully restored the missing T8.10E test while preserving the repaired T8.10F Stripe error test in the Checkout.test.jsx file.

### Changes Made
- Added back the test "shows error when checkout response is missing client_secret" 
- The test mocks api.get summary successfully
- The test mocks api.post("/orders/checkout", {}) returning { order_id: 123, total: 32.98 } with no client_secret
- The test renders authenticated checkout
- The test clicks Pay
- The test asserts the UI shows "Payment processing failed. Please try again."
- The test asserts mockConfirmCardPayment is not called
- All existing tests are preserved

### Validation
Command:
`npm.cmd run test:ci -- Checkout.test.jsx`

Result:
`passed, 7 tests`

Cloud Control confirmed:
1. The existing passing test "shows Stripe error when confirmCardPayment returns an error" is preserved
2. The new test "shows error when checkout response is missing client_secret" has been added exactly as required
3. No nested describe/test/hook blocks were created
4. No other files were modified
5. No files were staged or committed
6. All existing tests pass
