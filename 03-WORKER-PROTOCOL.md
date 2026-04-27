# Local Worker Protocol

## Purpose
Use this file to keep local-model conversations predictable and cheap.

## Roles

### Cloud Control
- chooses the next task
- defines scope
- reviews results
- handles architecture and risky flows

### Local Worker
- executes exactly one task
- stays inside the allowed file list
- validates the result
- stops

## Conversation Types

### Plan Conversation
Use when:
- a file is broken and we need bounded execution blocks
- a large task must be decomposed

Rules:
- read context
- do not edit files
- return only blocks, boundaries, validation, and stop conditions

### Build Conversation
Use when:
- the task is already bounded

Rules:
- execute one block only
- validate
- stop

## Scope Lock
- the allowed file list is a hard boundary, not a suggestion
- do not edit files outside the allowed list, even if the fix looks obvious
- do not edit read-only reference files
- do not create new files unless they are explicitly listed as allowed write files
- do not rename, move, delete, format, or reorganize unrelated files
- if the task is test-only, do not edit application code
- if the task is code-only, do not add tests unless tests are explicitly allowed
- if the task is read-only, write only the explicitly allowed report/outbox file

## Discovered Bug Rule
- if you discover a bug outside the requested scope, do not fix it
- write the bug as a finding in the result packet or outbox
- include the smallest recommended next task
- stop after reporting it
- never expand the current task from "write a test" into "fix the route"
- never expand the current task from "inspect" into "implement"
- never expand the current task from "one endpoint" into "full flow cleanup"

## Tool Discipline
- use only the exact tool names listed by the current environment
- if a tool call fails because the tool name or schema is wrong, correct it once
- if the same tool category fails twice, stop and report the exact failure
- do not invent tool names such as `exec`, `read_file`, `search`, or `todolist`
- prefer `read`, `grep`, `glob`, `edit`, `write`, `bash`, and `todowrite` when those are available
- do not continue in natural language pretending a failed tool call succeeded

## Prompt Pattern

Always include:
- repository path
- branch name
- allowed files
- forbidden files or functions
- single task objective
- exact validation command
- stop rule

## Never Ask The Local Worker To
- redesign checkout from scratch
- decide roadmap priority
- fix multiple unrelated files in one pass
- update roadmap state for tasks it did not validate
- make "helpful" nearby edits outside scope
- fix bugs it discovers outside the allowed files
- infer missing requirements from broad project context
- run multi-step shell commands with `&&` in PowerShell

## Good Task Shapes
- rewrite one function
- restore one missing function
- fix config discovery
- clean one lint cluster
- normalize one client module

## Bad Task Shapes
- "fix the ecommerce"
- "make checkout work"
- "clean all frontend issues"
- "refactor auth and payments"

## Validation Policy
- one command per task when possible
- if validation fails, the worker reports the exact failure and stops
- no task is done until validation passes
- if validation cannot run because of shell/tool/environment issues, status is `blocked`, not `done`
- do not claim validation passed unless the exact command ran and returned success
- do not claim failures are unrelated unless baseline evidence exists in the current run
- if validation exposes an application bug outside scope, report the failure and stop

## Result Packet Policy
- at the end of every task, overwrite `05-WORKER-RESULT.md`
- keep the result packet short and factual
- do not paste long command output into the result packet
- include task id, files changed, validation commands/results, commit hash if any, and known risks
- if validation was skipped or failed, say so explicitly
- after updating `05-WORKER-RESULT.md`, stop
- the user should not need to paste terminal screenshots into cloud review; cloud review will read this file and inspect the repo directly
- include a `scope exceptions` line; if none, write `none`
- include `discovered out-of-scope bugs` only as notes, not as implemented fixes

## Commit Policy
- each completed task must end in its own git commit
- do not commit if validation fails
- do not commit if files outside the allowed list were changed
- do not commit unrelated user changes
- before editing, run `git status --short` and note the starting state
- after validation passes, stage only the files changed for the current task
- use a small task-scoped commit message, for example `T5 repair frontend token normalization`
- after committing, report the commit hash and stop
- include the commit hash in `05-WORKER-RESULT.md`

## Git Execution Standard
- before editing, confirm the repo root with `git rev-parse --show-toplevel`
- expected repo root is `C:\Users\adria\Programacion\Programacion\koala-tshirts`
- if not in the repo root, run `Set-Location C:\Users\adria\Programacion\Programacion\koala-tshirts`
- if `git rev-parse --show-toplevel` still fails, stop and report the failure
- never use `git add .`
- stage only allowed files with `git add -- <file1> <file2>`
- run `git status --short` before commit and confirm only task files are staged
- if there are unrelated unstaged files, leave them unstaged and mention them
- commit only after validation passes
- if commit fails twice, stop and report the exact Git error

## PowerShell Command Standard
- use `Set-Location <path>` before validation commands instead of chaining with `&&`
- run frontend validation from `C:\Users\adria\Programacion\Programacion\koala-tshirts\frontend`
- use `npm.cmd run build` and `npm.cmd run lint` on Windows
- report the command, directory, and result exactly

## Recovery Policy
- if a worker breaks validation, the next task is a repair task
- repair tasks must restore build/test/lint health before any roadmap task can continue
- repair tasks must correct false roadmap or log entries created by the failed attempt
- never move to the next roadmap task while the repo is broken
