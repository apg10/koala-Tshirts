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

### Calibration Conversation
Use when:
- the local worker recently created unlisted files
- the local worker summarized the repository instead of executing
- the local worker wrote code in chat instead of editing files
- the local worker switched feature areas

Rules:
- run only one tiny task
- prefer write-only outbox tests or one-test edits
- no validation unless explicitly requested
- no commits
- final answer must be exactly `DONE`, `FAILED`, or `BLOCKED`
- if this fails twice, stop using that model for build work until Cloud Control changes model/config

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

### Iteration Packet Conversation
Use when:
- Cloud Control explicitly provides multiple deliverables in `01-HANDOFF.md`
- each deliverable has its own task id, validation command, commit message, and stop rule

Rules:
- execute deliverables in the exact listed order
- validate after every deliverable
- commit after every deliverable only if validation passes
- stop immediately if any deliverable fails validation
- stop immediately if any file outside the allowed write list changes
- never merge deliverables into one large edit
- never continue past the final listed deliverable

## Scope Lock
- the allowed file list is a hard boundary, not a suggestion
- do not edit files outside the allowed list, even if the fix looks obvious
- do not edit read-only reference files
- do not create new files unless they are explicitly listed as allowed write files
- do not rename, move, delete, format, or reorganize unrelated files
- if the task is test-only, do not edit application code
- if the task is code-only, do not add tests unless tests are explicitly allowed
- if the task is read-only, write only the explicitly allowed report/outbox file
- if the requested file/function does not appear to contain the bug, do not implement an alternate design elsewhere
- if the allowed files do not let you complete the task safely, write `blocked` and stop
- never create a replacement endpoint, route, component, helper, or test file unless the handoff explicitly names that new file or route
- if the task names one feature area, do not switch to another feature area
- if your reasoning mentions a feature name that is not in the task id, goal, allowed files, or required tests, stop before editing and write `blocked: topic drift`
- examples of topic drift: delivery tracking during checkout tests, admin category routes during product tests, full checkout redesign during one regression-test task
- if the handoff says "Modify only: A", creating file B is an automatic failure, even if B contains useful tests
- if the handoff says "add tests to existing file", the only valid code edit is inside that exact file
- if you think a new file would be cleaner, do not create it; write `blocked: new file would be required` and stop
- if you are about to write a filename that is not in the allowed write list, stop before writing

## Discovered Bug Rule
- if you discover a bug outside the requested scope, do not fix it
- write the bug as a finding in the result packet or outbox
- include the smallest recommended next task
- stop after reporting it
- never expand the current task from "write a test" into "fix the route"
- never expand the current task from "inspect" into "implement"
- never expand the current task from "one endpoint" into "full flow cleanup"

## Surgical Execution Rule
- first identify the exact line or symbol requested by the handoff
- edit only that requested line, function, route registration, test, or report block
- preserve every unrelated behavior exactly
- if you cannot find the exact target, stop and report `blocked: target not found`
- if the task says "unregister a route", do not create a new route
- if the task says "add a regression test to an existing test file", do not create a new test file
- if the task says "remove an import/router registration", do not edit the route implementation file
- if the task says "read-only inspection", do not stage, commit, or modify application files
- if you accidentally change a forbidden file, stop immediately and report the exact forbidden file
- do not create a subtask unless the handoff explicitly asks for a plan
- do not start a `General Task`, `Explore Task`, or child task during a Build Conversation
- do not continue after writing the required outbox/result packet
- for test additions, locate the nearest existing test group before editing
- for test additions, insert only the requested tests; do not add helper tests, nearby endpoint tests, or broader coverage
- if the requested test names are not used exactly, the task is failed
- if you start explaining the whole repository, stop and write `blocked: repository summary drift`

## Exact Target Rule
Before editing, write down internally:
- active task id
- exact allowed write filenames
- exact new function names or exact route/function names
- exact forbidden filenames

Then perform this sequence:
1. Read only files needed for the target.
2. Find the exact insertion/replacement point.
3. Edit only the exact allowed file.
4. Run only the exact validation command.
5. Write only the exact report files.
6. Stop.

If any step fails, do not improvise. Write `failed` or `blocked`.

Never substitute:
- a new test file for an existing test file
- a new route for an existing route
- a schema change for a test-only task
- a repo summary for a task result
- chat code for an actual file edit

## Tool Discipline
- use only the exact tool names listed by the current environment
- if a tool call fails because the tool name or schema is wrong, correct it once
- if the same tool category fails twice, stop and report the exact failure
- do not invent tool names such as `exec`, `read_file`, `search`, or `todolist`
- prefer `read`, `grep`, `glob`, `edit`, `write`, `bash`, and `todowrite` when those are available
- do not continue in natural language pretending a failed tool call succeeded
- if the task is to edit files, do not output the intended code only in chat; use the file editing tool
- if the task is to write an outbox/report, use the file writing tool and then stop
- never call a tool that is not listed in the current OpenCode tool list
- if OpenCode shows a preview/diff but the file is not actually changed on disk, the task is not done
- if a tool starts a child task such as `General Task`, `Explore Task`, or `Generate tests`, cancel/stop and report `failed: child task started`

## Prompt Pattern

Always include:
- repository path
- branch name
- allowed files
- forbidden files or functions
- single task objective
- exact validation command
- stop rule

For unstable local workers, use the short prompt pattern:
- one task id
- one sentence goal
- exact allowed write files
- exact forbidden actions
- exact test/function names
- exact validation command
- exact final response

Do not include broad project summaries in build prompts.
Do not include long roadmaps in build prompts.
Do not ask the worker to choose the next task.

## Medium Task Budget
Use medium tasks only when all changed files belong to one feature area.

Hard limits for a medium task:
- at most 1 application module and 1 test file, plus reporting files
- at most 3 related tests or 1 focused production-code change with matching tests
- no new route, schema, model, and test file in the same task unless all are explicitly allowed
- no new feature families such as delivery tracking, inventory reservation, email, refunds, analytics, or admin dashboards unless the task name says so

If the task appears to need more than this budget, write `blocked: task too broad` and recommend a split.

## Pre-Edit Checklist
Before the first edit, verify:
- the current task id
- allowed write files
- forbidden files
- exact feature area
- exact test/function/route names requested

If any of these are missing, write `blocked: missing task boundary` and stop.

## Post-Edit Scope Check
Before validation, run `git diff --name-only`.

If any file outside the allowed write list appears:
- do not run broad validation
- do not commit
- write `failed-scope-violation`
- list the forbidden files
- stop

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
- "add checkout tests" without exact test names
- "review this file and improve it"
- "continue where you left off"
- "make it production ready"

## Validation Policy
- one command per task when possible
- if validation fails, the worker reports the exact failure and stops
- no task is done until validation passes
- if validation cannot run because of shell/tool/environment issues, status is `blocked`, not `done`
- do not claim validation passed unless the exact command ran and returned success
- do not claim failures are unrelated unless baseline evidence exists in the current run
- if validation exposes an application bug outside scope, report the failure and stop
- never write `done` when tests fail, when validation did not run, or when files outside scope changed
- if any forbidden file changed, the status is `failed-scope-violation`, even if tests pass

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
- include `forbidden files changed`; if none, write `none`
- include `new files created`; if none, write `none`
- include `deleted files`; if none, write `none`
- if aborted due to topic drift, include the first line where drift happened and the forbidden topic name

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
