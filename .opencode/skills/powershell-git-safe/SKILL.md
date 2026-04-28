---
name: powershell-git-safe
description: Use Windows PowerShell and git safely in this repo, avoiding shell syntax mistakes and broad staging.
compatibility: opencode
metadata:
  project: koala-tshirts
  role: tooling
---

## PowerShell Rules

- Use `Set-Location -LiteralPath "C:\Users\adria\Programacion\Programacion\koala-tshirts"` before git commands.
- Use `Set-Location -LiteralPath "C:\Users\adria\Programacion\Programacion\koala-tshirts\backend"` before backend tests.
- Use `Set-Location -LiteralPath "C:\Users\adria\Programacion\Programacion\koala-tshirts\frontend"` before frontend commands.
- Do not use `&&`.
- Do not chain commands unless the active prompt explicitly allows it.

## Git Rules

- Run `git status --short` before staging.
- Never use `git add .`.
- Stage only explicitly allowed files:
  - `git add -- path1 path2`
- Do not stage unrelated dirty files.
- Commit only after validation passes.
- Use the exact commit message from the task.

## Forbidden Commands

- `git reset`
- `git reset --hard`
- `git checkout --`
- `git restore`
- `git clean`

