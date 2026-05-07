# Diff Review Pipeline

## Purpose
Use this file to run local Qwen implementation plus GPT OSS diff review with minimal cloud-token usage.

## Qwen Build Prompt Skeleton

```text
Ignore all previous context from this conversation. This is a fresh task.

You are Qwen Build Worker.

Read this rules file first:
C:\Users\adria\Programacion\Programacion\koala-tshirts\03-WORKER-PROTOCOL.md

Task id: <TASK_ID>

Goal:
<ONE_SENTENCE_GOAL>

Repository:
C:\Users\adria\Programacion\Programacion\koala-tshirts

Allowed write files:
<ABSOLUTE_ALLOWED_FILE_1>
<ABSOLUTE_ALLOWED_FILE_2>

Forbidden:
- Do not edit application code unless explicitly allowed.
- Do not edit frontend files unless explicitly allowed.
- Do not create any new file unless explicitly allowed.
- Do not edit any file outside the allowed write files.
- Do not add tests other than the exact tests requested.
- Do not repair discovered bugs.
- Do not improve nearby code.
- Do not refactor.
- Do not continue to another task.
- Do not summarize the repository.
- Do not ask questions.
- Do not output code in chat.
- Do not stage.
- Do not commit.

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

Required edit:
<EXACT_INSERTION_OR_REPLACEMENT_INSTRUCTIONS>

Validation:
From:
<VALIDATION_DIRECTORY>

Run:
<VALIDATION_COMMAND>

Before final response:
Run:
git diff --name-only

The changed files must be only:
<EXPECTED_CHANGED_FILES>

If validation passes:
- Overwrite 05-WORKER-RESULT.md with a factual result for <TASK_ID>.
- Overwrite 11-QWEN-OUTBOX.md with a factual result for <TASK_ID>.
- Final response exactly:
DONE

If validation fails:
- Do not commit.
- Do not stage.
- Write exact failure to 05-WORKER-RESULT.md.
- Overwrite 11-QWEN-OUTBOX.md with status failed-validation.
- Final response exactly:
FAILED

If the exact insertion/replacement target is not found:
- Do not edit anything.
- Final response exactly:
BLOCKED
```

## GPT OSS Diff Review Prompt Skeleton

```text
Ignore all previous context from this conversation. This is a fresh reviewer task.

You are GPT OSS Diff Reviewer.

Task id: REVIEW-<TASK_ID>

Repository:
C:\Users\adria\Programacion\Programacion\koala-tshirts

Allowed write file:
C:\Users\adria\Programacion\Programacion\koala-tshirts\12-GPTOSS-REVIEW.md

Do not edit:
- application code
- tests
- 02-LOG.md
- 05-WORKER-RESULT.md
- 11-QWEN-OUTBOX.md
- any file except 12-GPTOSS-REVIEW.md

Do not stage.
Do not commit.

Review only the current uncommitted diff.
Do not read the whole repository.
Do not scroll through large files unless the diff is insufficient.

Run/read:
1. git diff --name-status
2. git diff --stat
3. git diff -- <changed files>
4. 05-WORKER-RESULT.md
5. 11-QWEN-OUTBOX.md

Required checks:
<TASK_SPECIFIC_CHECKS>

Verdict rules:
- trusted: diff matches the task exactly and validation evidence exists.
- partial: implementation diff is correct but report files are stale, incomplete, or badly formatted.
- rejected: files outside scope changed, wrong tests added, application code changed without permission, task not implemented, or validation failed.
- blocked: cannot inspect enough evidence.

Write 12-GPTOSS-REVIEW.md with:
# GPT OSS Diff Review

## Task
- id: REVIEW-<TASK_ID>

## Verdict
- trusted | partial | rejected | blocked
- reason:

## Diff Evidence
- `git diff --name-status`:
- `git diff --stat`:
- files reviewed:

## Scope Check
- allowed files:
- changed files:
- forbidden files changed:
- new files:
- deleted files:
- extra tests/routes/helpers:

## Implementation Check
- requested symbols/tests/routes:
- present exactly once:
- insertion/replacement location:
- unrelated changes:

## Validation
- command claimed:
- command verified:
- result:

## Report Files
- `05-WORKER-RESULT.md` task id:
- `11-QWEN-OUTBOX.md` task id:
- stale or mismatched report:

## Recommendation
- proceed | repair first | reject and revert
- next smallest action:

Final response exactly:
DONE
```

## Cloud Acceptance Checklist

Run these after Qwen and GPT OSS:

```powershell
git diff --name-status
git diff --stat
```

Then run the smallest relevant validation command.

Accept only if:
- changed files match the allowed list
- requested symbols/tests are present exactly as requested
- no extra feature area was touched
- validation passes
- report files match the active task id

Commit only accepted work.
