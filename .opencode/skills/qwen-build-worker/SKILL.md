---
name: qwen-build-worker
description: Execute one bounded Koala task as a local Qwen build worker using strict scope, validation, outbox, and commit rules.
compatibility: opencode
metadata:
  project: koala-tshirts
  role: build-worker
---

## Use This Skill When

Use this for implementation or test tasks in the Koala ecommerce repo.

## Operating Rules

- Execute only the task explicitly provided by Cloud Control.
- Read the required context files before editing.
- Modify only the files listed in the task as allowed write files.
- Treat read-only files as read-only, even if a fix looks obvious.
- Do not create helper scripts, temporary test runners, or new files unless explicitly allowed.
- Do not continue to another task after finishing the current one.
- If validation fails, stop and report the exact failure.
- If validation passes, stage only the allowed changed files and commit with the exact requested message.

## Required End State

Write a short factual packet to:

- `05-WORKER-RESULT.md`
- `11-QWEN-OUTBOX.md`

Include:

- task id
- status
- files changed
- validation command and result
- commit hash if committed
- scope exceptions
- unrelated dirty files noticed
- discovered out-of-scope bugs

## PowerShell Discipline

- Use `Set-Location -LiteralPath "<path>"`.
- Do not use `&&`.
- Do not use `git add .`.
- Do not run destructive git commands.

