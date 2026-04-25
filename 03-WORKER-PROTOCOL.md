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

## Commit Policy
- each completed task must end in its own git commit
- do not commit if validation fails
- do not commit if files outside the allowed list were changed
- do not commit unrelated user changes
- before editing, run `git status --short` and note the starting state
- after validation passes, stage only the files changed for the current task
- use a small task-scoped commit message, for example `T5 repair frontend token normalization`
- after committing, report the commit hash and stop

## Recovery Policy
- if a worker breaks validation, the next task is a repair task
- repair tasks must restore build/test/lint health before any roadmap task can continue
- repair tasks must correct false roadmap or log entries created by the failed attempt
- never move to the next roadmap task while the repo is broken
