# Colombia Aux Context

## Purpose

This node is an auxiliary local AI worker for Koala T-Shirts.

It should help with small, bounded tasks while Adrian / Cloud Control owns architecture, risky checkout/payment decisions, and final review.

## Repository

GitHub:

```text
https://github.com/apg10/koala-Tshirts.git
```

Recommended local path:

```text
C:\Users\<user>\Programacion\koala-tshirts
```

## Branch Rules

Never work directly on `main`.

Preferred branch flow:

```powershell
git fetch origin
git switch codex/local-ai-integration
git pull --ff-only origin codex/local-ai-integration
git switch -c codex/colombia/<task-id-short-name>
```

If `codex/local-ai-integration` does not exist yet, ask Adrian before creating task branches.

## Hardware

Expected machine:

- RTX 2060 laptop
- Ryzen 5
- 16 GB RAM

Use smaller local models than Adrian's main machine.

Recommended:

- build worker: `koala-worker-7b`
- repo/report worker: `koala-repo-3b`

## Good Tasks For This Node

- read-only inventories
- small frontend state fixes
- one-component UI adjustments
- focused backend tests
- docs/setup verification
- simple lint/test repairs

## Avoid On This Node

- Stripe architecture
- checkout lifecycle redesign
- database schema changes
- broad refactors
- multi-module feature implementation
- direct roadmap decisions

## Required Validation

Backend:

```powershell
Set-Location -LiteralPath "C:\Users\<user>\Programacion\koala-tshirts\backend"
.\venv\Scripts\python.exe -m pytest tests -q
```

Frontend:

```powershell
Set-Location -LiteralPath "C:\Users\<user>\Programacion\koala-tshirts\frontend"
npm.cmd run build
npm.cmd run lint
```

## Reporting Files

This node writes only its own coordination files:

```text
coordination/nodes/colombia-aux/QWEN-OUTBOX.md
coordination/nodes/colombia-aux/GPTOSS-REVIEW.md
coordination/nodes/colombia-aux/SETUP-REPORT.md
```

Do not overwrite Adrian's root-level `11-QWEN-OUTBOX.md` or `12-GPTOSS-REVIEW.md`.

