# Coordination

This folder stores multi-node local AI coordination files.

Use this folder when more than one human/local-model node is active.

Single-node legacy files remain at repo root for convenience:
- `01-HANDOFF.md`
- `11-QWEN-OUTBOX.md`
- `12-GPTOSS-REVIEW.md`
- `13-CLOUD-DECISION.md`

Multi-node files should live under:

```text
coordination/nodes/<node-id>/
```

Templates live under:

```text
coordination/templates/
```

## Node IDs

Current node IDs:
- `adrian-main`
- `colombia-aux`

## Rule

No two nodes should write the same outbox or review file.

