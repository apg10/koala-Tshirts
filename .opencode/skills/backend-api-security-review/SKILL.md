---
name: backend-api-security-review
description: Review FastAPI backend route security for auth, admin gating, route ordering, ownership checks, and unsafe client-controlled data.
compatibility: opencode
metadata:
  project: koala-tshirts
  role: review
---

## Use This Skill When

Use this for read-only backend API security reviews.

## Review Checklist

Check for:

- unauthenticated access to protected routes
- non-admin access to admin routes
- route ordering conflicts such as static routes declared after `/{id}`
- ownership checks on user-owned resources
- client-controlled prices, totals, roles, user ids, or order status
- missing dependency overrides in tests
- missing tests for 401, 403, 404, and successful authorized access
- response schema mismatches that can hide broken flows

## Output Format

Write concise findings:

- file and route/function
- severity
- exact risk
- smallest recommended next task

Do not edit code unless the active task explicitly allows implementation.

