# Qwen Outbox

## Task - id: T8.7B - name: Implement guest shipping form and checkout payload

## Execution
- status: done-with-cloud-repair
- files changed: frontend/src/pages/Checkout.jsx, 02-LOG.md, 05-WORKER-RESULT.md, 11-QWEN-OUTBOX.md, 12-GPTOSS-REVIEW.md
- validation: npm.cmd run build passed; npm.cmd run lint passed with two existing react-refresh warnings
- commit: pending

## What Changed
- Guest users now see a shipping form in checkout.
- Guest users must enter name, email, and address before checkout starts.
- Guest checkout sends `items` and `shipping` to `/orders/checkout`.
- Authenticated checkout still sends `{}`.
- Guest cart clearing still happens only after successful Stripe confirmation.

## Cloud Repair
- Removed out-of-scope `backend/app/prime.py`.
- Limited the shipping form to guest users.
- Changed guest checkout item payload to use `item.product_id`.
- GPT-OSS did not produce a T8.7B review, so Cloud Control reviewed and validated directly.
