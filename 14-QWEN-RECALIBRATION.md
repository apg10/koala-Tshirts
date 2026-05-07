# Qwen Recalibration Playbook

## Purpose
Use this file when Qwen starts drifting from task scope.

## Current Stable Setup
- Preferred model: `qwen3-coder:30b` factory
- Preferred context: 32k for normal work
- Use 64k only when the task must read very large files
- Use fresh conversations for every build task while discipline is unstable
- Do not use local OpenCode skills for Qwen build work

## Failure Signals
Reject the run if Qwen:
- summarizes the repository instead of editing
- asks what to do next after a complete task prompt
- writes code only in chat
- creates a file not listed in allowed write files
- edits application code during a test-only task
- changes topic, endpoint, route, or feature area
- leaves `11-QWEN-OUTBOX.md` with an old task id
- starts `General Task`, `Explore Task`, or similar child tasks
- diagnoses unrelated failures after validation passes
- implements a fix it discovered but was not explicitly assigned
- says a test is misconfigured without current failing validation evidence

## Recovery Sequence
1. Stop the Qwen run.
2. Inspect `git diff --name-status`.
3. Delete unlisted files created by Qwen.
4. Revert only Qwen drift, preserving committed work.
5. Run the smallest relevant validation command.
6. Do not send another feature task until the repo is clean.

## Recalibration Task Shape
Use one of these before resuming normal work:

### Write-only calibration
- allowed write: `11-QWEN-OUTBOX.md`
- no repo code changes
- final response exactly `DONE`

### Single-test calibration
- allowed write: one existing test file plus outbox/result/log
- exactly one new test function
- no app code changes
- no new files
- exact validation command

## Default Qwen Prompt Header
```text
Ignore all previous context from this conversation. This is a fresh task.

You are Qwen Build Worker.

Read this rules file first:
C:\Users\adria\Programacion\Programacion\koala-tshirts\03-WORKER-PROTOCOL.md

Use only these OpenCode tools if needed:
- read
- grep
- edit
- bash
- write

Do not call:
- read_file
- repo_browser
- todolist
- exec
- search

Hard stop rules:
- Do not create new files unless explicitly listed under allowed write files.
- Do not edit any file outside the allowed write list.
- Do not summarize the repository.
- Do not ask questions.
- Do not output code in chat.
- Do not fix discovered bugs unless the current task explicitly asks for that exact fix.
- If tests pass, do not diagnose unrelated failures.
- If you cannot complete the exact task, write FAILED or BLOCKED and stop.
```

## Required Discovery Block For Build Prompts

Add this block to Qwen prompts until scope discipline is stable:

```text
Discovery rule:
If you discover any bug, missing validation, failing behavior, bad route order, broken test, missing schema, security issue, or possible improvement that is NOT directly required by this task:
- Do not fix it.
- Do not edit code for it.
- Do not add tests for it.
- Record it under "Out-of-scope findings" in 11-QWEN-OUTBOX.md.
- Continue only with the exact assigned task if safe.
- If the assigned task cannot be completed without fixing the discovered issue, stop and write status: blocked.

Validation sanity rule:
If tests pass, do not diagnose unrelated failures.
If you suspect a test is wrong but validation passes, record "no blocking issue found" and stop.
```

## GPT OSS Review Strategy

After Qwen runs, ask GPT OSS to review the diff, not the repository:

1. `git diff --name-status`
2. `git diff --stat`
3. `git diff -- <changed-file>`
4. `05-WORKER-RESULT.md`
5. `11-QWEN-OUTBOX.md`

Do not ask GPT OSS to read all of `backend/tests/test_routes.py` unless the diff is insufficient.

## Preferred Validation Commands

Backend:
```powershell
Set-Location -LiteralPath "C:\Users\adria\Programacion\Programacion\koala-tshirts\backend"
.\venv\Scripts\python.exe -m pytest tests -q
```

Frontend:
```powershell
Set-Location -LiteralPath "C:\Users\adria\Programacion\Programacion\koala-tshirts\frontend"
npm.cmd run test:ci
npm.cmd run build
```

## Cloud Review Checklist
After every Qwen run:
1. `git diff --name-status`
2. Confirm all changed files are allowed.
3. Confirm `11-QWEN-OUTBOX.md` task id matches.
4. Confirm exact validation command/result.
5. Run Cloud validation if risk is non-trivial.
6. Commit only after repo truth matches the worker claim.
