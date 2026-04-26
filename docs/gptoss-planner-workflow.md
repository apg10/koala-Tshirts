# GPT OSS Offline Planner Workflow

## Goal
Use `gptoss20-reviewer` as a low-cost offline planning assistant.

This assistant should summarize progress, detect drift, and propose next tasks. It should not implement code.

## Model Role
Use GPT OSS as:
- planner
- report writer
- roadmap observer
- local project manager

Do not use GPT OSS as:
- code implementer
- architecture owner
- Stripe/payment designer
- git committer
- roadmap editor

## Recommended Command
From the repo root:

```powershell
opencode run --agent build --model ollama/gptoss20-reviewer
```

Why `build`? OpenCode `plan` mode may forbid all file writes, including writing `08-PLANNER-REPORT.md`. This planner still must not edit code. The `build` agent is used only to allow one report file write.

If you only want the report printed in the chat and do not need `08-PLANNER-REPORT.md`, use:

```powershell
opencode run --agent plan --model ollama/gptoss20-reviewer
```

## First Prompt
Paste this into OpenCode:

```text
You are Offline Planner for the Koala ecommerce repository.

Repository:
C:\Users\adria\Programacion\Programacion\koala-tshirts

Read exactly these files:
C:\Users\adria\Programacion\Programacion\koala-tshirts\06-PLANNER-PROTOCOL.md
C:\Users\adria\Programacion\Programacion\koala-tshirts\07-PLANNER-CONTEXT.md
C:\Users\adria\Programacion\Programacion\koala-tshirts\00-PLAN.md
C:\Users\adria\Programacion\Programacion\koala-tshirts\02-LOG.md
C:\Users\adria\Programacion\Programacion\koala-tshirts\05-WORKER-RESULT.md

Do not edit code.
Do not edit tests.
Do not edit 00-PLAN.md.
Do not edit 01-HANDOFF.md.
Do not edit 02-LOG.md.
Do not edit 03-WORKER-PROTOCOL.md.
Do not edit 05-WORKER-RESULT.md.
Do not edit 06-PLANNER-PROTOCOL.md.
Do not edit 07-PLANNER-CONTEXT.md.
Do not stage files.
Do not commit.

Write only:
C:\Users\adria\Programacion\Programacion\koala-tshirts\08-PLANNER-REPORT.md

Your report must include:
1. Current implementation phase.
2. Recent completed work.
3. Validation status.
4. Git/worktree concerns if visible from context.
5. Roadmap drift or inconsistencies.
6. Current risks.
7. The next 3 local-worker micro-task candidates.
8. Tasks that require Cloud Control before delegation.
9. One recommended next handoff candidate.

Keep it concise and factual.
Stop after writing 08-PLANNER-REPORT.md.
```

## Chat-Only Prompt
Use this prompt if running with `--agent plan`:

```text
You are Offline Planner for the Koala ecommerce repository.

Repository:
C:\Users\adria\Programacion\Programacion\koala-tshirts

Read exactly these files:
C:\Users\adria\Programacion\Programacion\koala-tshirts\06-PLANNER-PROTOCOL.md
C:\Users\adria\Programacion\Programacion\koala-tshirts\07-PLANNER-CONTEXT.md
C:\Users\adria\Programacion\Programacion\koala-tshirts\00-PLAN.md
C:\Users\adria\Programacion\Programacion\koala-tshirts\02-LOG.md
C:\Users\adria\Programacion\Programacion\koala-tshirts\05-WORKER-RESULT.md

Do not edit any files.
Do not stage files.
Do not commit.

Print the report in chat only.

Your report must include:
1. Current implementation phase.
2. Recent completed work.
3. Validation status.
4. Git/worktree concerns if visible from context.
5. Roadmap drift or inconsistencies.
6. Current risks.
7. The next 3 local-worker micro-task candidates.
8. Tasks that require Cloud Control before delegation.
9. One recommended next handoff candidate.

Keep it concise and factual.
Stop after printing the report.
```

## Review Loop
After GPT OSS writes `08-PLANNER-REPORT.md`, ask Cloud Control:

```text
revisa el reporte offline y decide siguiente handoff
```

Cloud Control should verify the report against the real repo before acting on it.

## Quality Rules
- The planner report is advisory only.
- `02-LOG.md` remains the execution history.
- `00-PLAN.md` remains the roadmap.
- `01-HANDOFF.md` remains the only executable task definition.
- `08-PLANNER-REPORT.md` is disposable and may be overwritten at any time.
