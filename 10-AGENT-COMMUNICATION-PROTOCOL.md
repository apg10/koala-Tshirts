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
- does not fix bugs discovered outside scope
- does not edit read-only reference files
- does not create helper files unless explicitly allowed
- reports blocked validation as `blocked`, not `done`
- treats any forbidden-file edit as task failure, not partial success
- must not invent alternate routes, helpers, or files when the named target is unclear
- must stop with `blocked` if it cannot find the exact target requested by Cloud Control
- must not launch child tasks or broad exploration during Build Conversation
- must not output code in chat as a substitute for editing the allowed files
- must abort if it starts reasoning about a feature outside the task scope
- must not create unlisted files under any circumstance
- must not create alternate test files when instructed to edit an existing test file
- must not continue after a `continue` message unless the same task is still in progress and no new scope is introduced
- must treat "I can help with..." or repository overview output as task failure in Build Conversation

### GPT OSS Repo Planner
- does not edit code
- does not decide completion by itself
- reads `11-QWEN-OUTBOX.md`, `02-LOG.md`, `05-WORKER-RESULT.md`, `git status --short`, and recent commits
- writes `12-GPTOSS-REVIEW.md`
- flags drift, missing validation, wrong files, missing commits, and risky next steps
- stops
- must not rely on chat memory; it must read the files requested in the review task
- must mark the review `partial` or `rejected` if Qwen's outbox is missing, stale, or describes a different task
- must mark the review `rejected` if Qwen touched forbidden files, even if the resulting code looks useful

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

The review prompt is the active user request. GPT OSS must not ask what the user wants next after reading evidence. It must write `12-GPTOSS-REVIEW.md` or write a `blocked` review explaining missing evidence, then stop.

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
- A task that changes forbidden files is rejected by default.
- A task that creates unlisted files is rejected by default.
- If Qwen changes files outside scope, stop and repair before continuing.
- If GPT OSS reports a clean worktree without actual git status evidence, treat the report as untrusted.
- If validation is missing, the next action is validation or repair, not a new feature.
- If Qwen says validation passed but no exact command/result is present, treat validation as missing.
- If Qwen discovers another bug during a bounded task, that bug becomes a next-task candidate only.
- If Qwen changes application code during a test-only task, reject the task and repair.
- If Qwen changes tests during a code-only task, reject unless the handoff explicitly allowed tests.
- If Qwen writes to the wrong outbox filename, reject the reporting step until corrected.
- If Qwen implements a different endpoint, route, or component than the handoff requested, reject the implementation even if tests pass.
- If Qwen creates a new file that was not listed under allowed write files, reject the implementation.
- If Qwen changes model/schema/route code during a test-only task, reject the implementation.
- If Qwen reports a task as done while `git diff --name-only` contains forbidden files, reject the implementation.
- If Qwen's outbox task id does not match the active task id, reject the report as stale.

## Drift Examples

Reject these patterns immediately:
- adding delivery tracking during checkout validation work
- creating an admin category router during product or checkout tests
- rewriting schemas/models during a test-only task
- creating a new test file when the handoff says to modify an existing test file only
- running or creating broad subtasks such as `Generate tests`, `Explore project`, or `Fix all checkout`
- creating `test_checkout.py` or `test_checkout_webhook.py` when the handoff says to edit `backend/tests/test_routes.py`
- adding webhook tests during quantity validation tests
- adding app routes/modules during regression-test tasks
- leaving `11-QWEN-OUTBOX.md` with an old task id after claiming completion

## Local Worker Rejection Rules

Cloud Control must reject the worker result when any of these are true:
- `git diff --name-only` contains any file not listed under allowed write files
- new files were created but the task did not explicitly list them under allowed write files
- `11-QWEN-OUTBOX.md` task id does not match the active task id
- `05-WORKER-RESULT.md` task id does not match the active task id
- the worker did not run the exact validation command but reported `done`
- the worker created code in chat instead of editing the file
- the worker summarized the repository instead of executing the task
- the worker changed feature area

Rejected worker output is not partially accepted unless Cloud Control manually extracts and validates a small safe change.

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
- scope exceptions: none | list exact file/function
- forbidden files changed: none | list exact file
- new files created: none | list exact file
- deleted files: none | list exact file

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

## Discovered Out-Of-Scope Bugs
- none, or one to three factual findings

## If Blocked
- exact target not found:
- exact tool/validation failure:
- safest next Cloud action:

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

## Fresh Conversation Bootstrap

For a new Qwen chat, start with:
- `03-WORKER-PROTOCOL.md`
- `10-AGENT-COMMUNICATION-PROTOCOL.md`
- the current task prompt
- only the read-only files needed by the task

For an unstable Qwen chat, use this minimal bootstrap instead:
- "Read `03-WORKER-PROTOCOL.md` only for rules."
- task id and exact goal
- exact allowed write files
- exact forbidden files/actions
- exact validation command
- final response must be exactly `DONE`, `FAILED`, or `BLOCKED`

Do not paste more than one previous result packet into a Qwen build prompt.
Do not paste screenshots into Qwen.
Do not paste broad roadmap context into Qwen.

For a new GPT OSS chat, start with:
- `06-PLANNER-PROTOCOL.md`
- `10-AGENT-COMMUNICATION-PROTOCOL.md`
- `11-QWEN-OUTBOX.md`
- `git status --short`
- `git log --oneline -5`
- only files named in the review prompt

Do not paste old screenshots as source of truth. Use repository files and command output.

## Cadence

Use this rhythm:

1. Qwen task
2. GPT OSS review
3. Cloud validation
4. Commit or repair
5. Next Qwen task

Run GPT OSS after every Qwen task while the workflow is still being tuned. Once stable, run GPT OSS every 2-3 commits.

## Windows / PowerShell Rules

Local models must use PowerShell-safe commands:
- use `Set-Location <path>` instead of `cd <path> && command`
- do not use `&&`
- run validation from the target directory
- if a shell command fails because of syntax, retry once with PowerShell-safe syntax
- if it fails again, write `blocked` and stop

## Forbidden Commands For Local Models

Local models must never run:
- `git add .`
- `git reset`
- `git reset --hard`
- `git checkout --`
- `git clean`
- `git restore`

They may stage only explicit task files.
