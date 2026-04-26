# Distributed Local AI Pipeline

## Goal
Use multiple local AI nodes to reduce cloud-token usage while keeping the repository safe.

This workflow assumes:
- Cloud Control defines tasks and reviews risky decisions.
- Local build nodes implement small scoped tasks.
- Local repo/planner nodes create reports and commits when allowed.
- GitHub is the shared source of truth.

## Current Nodes

| Node | Owner | Location | Hardware | Main Role |
| --- | --- | --- | --- | --- |
| `adrian-main` | Adrian | Australia | RTX 5070 laptop, Ryzen 9 HX, 32 GB RAM | Cloud-assisted control + local build |
| `colombia-aux` | Sister | Colombia | RTX 2060 laptop, Ryzen 5, 16 GB RAM | Auxiliary local build worker |

## Core Rule
No local model chooses its own roadmap.

Local models receive a bounded task and either:
- complete it with validation, or
- stop with an exact failure.

## Branch Strategy

Use one shared integration branch and one branch per task.

Recommended integration branch:

```powershell
codex/local-ai-integration
```

Recommended task branches:

```powershell
codex/adrian/T7.5-orders-admin-route
codex/colombia/T16.1-small-backend-test
```

Rules:
- Never work directly on `main`.
- Never let two people edit the same task branch.
- Every task branch starts from the latest integration branch.
- Every completed task becomes a PR into the integration branch.
- The integration branch can later be merged to `main` after a full smoke test.

## Multi-Node Coordination Files

The old single-node files are still useful locally:
- `01-HANDOFF.md`
- `11-QWEN-OUTBOX.md`
- `12-GPTOSS-REVIEW.md`

For multiple people, prefer node-specific files under:

```text
coordination/nodes/<node-id>/
```

Example:

```text
coordination/nodes/adrian-main/HANDOFF.md
coordination/nodes/adrian-main/QWEN-OUTBOX.md
coordination/nodes/adrian-main/GPTOSS-REVIEW.md

coordination/nodes/colombia-aux/HANDOFF.md
coordination/nodes/colombia-aux/QWEN-OUTBOX.md
coordination/nodes/colombia-aux/GPTOSS-REVIEW.md
```

This prevents Adrian and the Colombia node from overwriting each other's agent reports.

## Pipeline

### 1. Cloud Control Opens A Task
Cloud Control writes a handoff from:

```text
coordination/templates/HANDOFF.template.md
```

The handoff must include:
- task id
- branch name
- allowed files
- forbidden files
- exact validation command
- stop condition

### 2. Local Build Worker Executes
The worker edits only allowed files.

The worker must write:

```text
coordination/nodes/<node-id>/QWEN-OUTBOX.md
```

The worker does not commit unless the task explicitly allows it.

### 3. Repo Operator Reviews And Commits
The repo operator reads:
- node outbox
- git status
- git diff
- validation result

The repo operator writes:

```text
coordination/nodes/<node-id>/GPTOSS-REVIEW.md
```

If allowed, it stages only explicit files and commits.

### 4. Cloud Control Validates
Cloud Control checks:
- git status
- target diff
- validation command
- commit hash
- out-of-scope files

Then Cloud Control approves, repairs, or rejects.

## Trust Levels

### Trusted
- validation passed
- git status matches expected files
- commit exists
- outbox and review agree
- no out-of-scope files

### Partial
- code is useful
- Cloud had to repair logs or protocol
- local worker created out-of-scope artifacts but they were removed

### Not Trusted
- validation missing or failed
- wrong files edited
- no clear diff
- model claims commit but no commit exists
- generated config changed test discovery

## Task Size Guide

Good local tasks:
- add 2-6 focused tests
- move one route above another
- rewrite one function
- fix one UI state
- add one retry button
- normalize one import path

Bad local tasks:
- implement checkout end to end
- redesign auth
- refactor all admin pages
- change schema and frontend together
- modify many unrelated files

## Cloud-Control-First Areas

These always require Cloud design before delegation:
- Stripe payment flow
- order lifecycle
- webhook idempotency
- auth/session security
- database migrations
- production deployment
- shared UI redesign

## Daily Sync

Each node starts with:

```powershell
git fetch origin
git switch codex/local-ai-integration
git pull --ff-only origin codex/local-ai-integration
```

Each task starts with:

```powershell
git switch -c codex/<owner>/<task-id-short-name>
```

Each task ends with:

```powershell
git status --short
git log --oneline -3
```

Then push:

```powershell
git push -u origin codex/<owner>/<task-id-short-name>
```

Open a PR into:

```text
codex/local-ai-integration
```

