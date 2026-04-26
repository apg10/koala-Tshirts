# Agent Communication Protocol

## Purpose
Use local models as cheap, bounded collaborators without losing repo truth.

This protocol defines a simple message flow:

1. Cloud Control writes the task.
2. Qwen executes the task and writes a worker outbox.
3. GPT OSS audits the worker outbox and writes a planner/repo report.
4. Cloud Control validates the repo and chooses the next task.

No agent should rely on screenshots or chat memory as the source of truth.

## Files

### Cloud To Qwen
- `01-HANDOFF.md`

This is the only executable implementation instruction for Qwen.

### Qwen To GPT OSS
- `11-QWEN-OUTBOX.md`

Qwen writes this at the end of every build task. It must be factual and short.

### GPT OSS To Cloud
- `12-GPTOSS-REVIEW.md`

GPT OSS reads the Qwen outbox, logs, git status, and recent commits, then writes a compact review for Cloud Control.

### Cloud Decision
- `13-CLOUD-DECISION.md`

Cloud Control may update this after validation to record the actual decision and next handoff candidate.

## Role Boundaries

### Cloud Control
- owns architecture and task selection
- writes or approves `01-HANDOFF.md`
- validates repo truth
- may override local model conclusions
- decides when work is complete

### Qwen Build Worker
- executes exactly one task from `01-HANDOFF.md`
- edits only allowed files
- validates with the exact command in the handoff
- commits only after validation passes
- writes `11-QWEN-OUTBOX.md`
- stops

### GPT OSS Repo Planner
- does not edit code
- does not decide completion by itself
- reads `11-QWEN-OUTBOX.md`, `02-LOG.md`, `05-WORKER-RESULT.md`, `git status --short`, and recent commits
- writes `12-GPTOSS-REVIEW.md`
- flags drift, missing validation, wrong files, missing commits, and risky next steps
- stops

## Message Flow

### Step 1: Cloud Issues Task
Cloud writes or provides:
- task id
- objective
- allowed files
- forbidden files
- validation command
- commit message
- stop condition

### Step 2: Qwen Executes
Qwen must end with:
- changed files
- validation result
- commit hash, or clear reason no commit was made
- known risks
- next recommended task

Qwen writes that to:
- `11-QWEN-OUTBOX.md`

### Step 3: GPT OSS Audits
GPT OSS compares Qwen's claim against repo evidence:
- `git status --short`
- `git log --oneline -5`
- `02-LOG.md`
- `05-WORKER-RESULT.md`
- `11-QWEN-OUTBOX.md`

GPT OSS writes:
- `12-GPTOSS-REVIEW.md`

### Step 4: Cloud Decides
Cloud validates only what is needed:
- target diff
- relevant tests/build/lint
- commit state

Cloud may write:
- `13-CLOUD-DECISION.md`

## Trust Rules

- A task is not done because Qwen says it is done.
- A task is not done because GPT OSS says it is done.
- A task is done only when repo state, validation, and commit state agree.
- If Qwen changes files outside scope, stop and repair before continuing.
- If GPT OSS reports a clean worktree without actual git status evidence, treat the report as untrusted.
- If validation is missing, the next action is validation or repair, not a new feature.

## Required Qwen Outbox Shape

```md
# Qwen Outbox

## Task
- id:
- name:
- source handoff:

## Execution
- status: done | failed | blocked
- files changed:
- files intentionally not changed:
- out-of-scope files noticed:

## Validation
- command:
- directory:
- result:
- exact failure if any:

## Git
- staged files:
- commit hash:
- commit message:
- uncommitted task files:
- unrelated dirty files:

## Summary
- one to three bullets

## Risks
- one to three bullets

## Next Candidate
- task id/name:
- reason:
```

## Required GPT OSS Review Shape

```md
# GPT OSS Review

## Verdict
- trusted: yes | no | partial
- reason:

## Evidence Checked
- qwen outbox:
- git status:
- git log:
- log/result files:

## Drift
- roadmap drift:
- log drift:
- worktree drift:
- commit drift:

## Validation Status
- command claimed:
- command verified:
- missing validation:

## Risks
- current risks:

## Recommended Cloud Action
- validate:
- repair:
- next handoff candidate:
```

## Cadence

Use this rhythm:

1. Qwen task
2. GPT OSS review
3. Cloud validation
4. Commit or repair
5. Next Qwen task

Run GPT OSS after every Qwen task while the workflow is still being tuned. Once stable, run GPT OSS every 2-3 commits.

## Forbidden Commands For Local Models

Local models must never run:
- `git add .`
- `git reset`
- `git reset --hard`
- `git checkout --`
- `git clean`
- `git restore`

They may stage only explicit task files.
