# Node Registry

## Purpose
Track local AI nodes that can work on the Koala ecommerce repository.

## Nodes

### adrian-main
- owner: Adrian
- location: Australia
- hardware: RTX 5070 laptop, Ryzen 9 HX, 32 GB RAM
- recommended build model: `qwen30-base-agent-16k-gpu` or current local Qwen profile
- recommended planner/repo model: `gptoss20-reviewer` or local repo profile
- branch prefix: `codex/adrian/`
- coordination path: `coordination/nodes/adrian-main/`

### colombia-aux
- owner: sister
- location: Colombia
- hardware: RTX 2060 laptop, Ryzen 5, 16 GB RAM
- recommended build model: `koala-worker-7b`
- recommended repo/report model: `koala-repo-3b`
- branch prefix: `codex/colombia/`
- coordination path: `coordination/nodes/colombia-aux/`

## Shared Integration Branch

Recommended:

```text
codex/local-ai-integration
```

## Rules

- one task branch per local-model task
- one commit per completed task whenever possible
- no direct commits to `main`
- no direct commits to the integration branch unless Cloud Control approves
- PRs merge into the integration branch
- Cloud Control validates before integration

