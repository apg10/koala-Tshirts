# Colombia Aux Handoff

## Task
- id: `CO-SETUP-1`
- name: `Validate local clone and development environment`
- owner node: `colombia-aux`
- branch: `codex/colombia/CO-SETUP-1-validate-env`

## Goal

Verify that the Colombia laptop can clone the repository, install dependencies, run backend tests, and run frontend build/lint. This is a setup validation task only.

## Repository

```text
C:\Users\<user>\Programacion\koala-tshirts
```

## Modify Only

- `coordination/nodes/colombia-aux/SETUP-REPORT.md`

## Read Only

- `docs/colombia-aux-node-setup.md`
- `docs/distributed-local-ai-pipeline.md`
- `coordination/nodes/colombia-aux/CONTEXT.md`
- `backend/requirements.txt`
- `frontend/package.json`

## Forbidden

- do not edit application code
- do not edit tests
- do not edit package files
- do not edit roadmap files
- do not create files outside `coordination/nodes/colombia-aux/SETUP-REPORT.md`
- do not commit unless Adrian explicitly asks for a commit

## Required Work

1. Confirm Git branch and remote.
2. Confirm Python version.
3. Confirm Node/npm versions.
4. Confirm Ollama model smoke test if models are installed.
5. Install backend dependencies if missing.
6. Run backend tests.
7. Install frontend dependencies if missing.
8. Run frontend build.
9. Run frontend lint.
10. Write a factual setup report.

## Validation

Backend directory:

```text
C:\Users\<user>\Programacion\koala-tshirts\backend
```

Command:

```powershell
.\venv\Scripts\python.exe -m pytest tests -q
```

Frontend directory:

```text
C:\Users\<user>\Programacion\koala-tshirts\frontend
```

Commands:

```powershell
npm.cmd run build
npm.cmd run lint
```

## SETUP-REPORT.md Required Shape

```md
# Colombia Aux Setup Report

## Status
- ready: yes | no | partial

## Git
- branch:
- remote:
- latest commit:

## Tooling
- python:
- node:
- npm:
- ollama:
- opencode:

## Backend
- dependency install:
- pytest result:
- failures:

## Frontend
- npm install:
- build result:
- lint result:
- warnings:

## Local Models
- build model:
- repo model:
- smoke test:

## Blockers
- none, or exact blocker list
```

## Done When

- setup report is written
- no code files were changed
- worker stops

