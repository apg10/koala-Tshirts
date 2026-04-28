---
name: surgical-repair
description: Apply a tiny exact repair to an already identified failure without broad inspection, redesign, or adjacent cleanup.
compatibility: opencode
metadata:
  project: koala-tshirts
  role: repair
---

## Use This Skill When

Use this when Cloud Control gives an exact failing test, exact file, and exact repair instructions.

## Rules

- Do not summarize the project.
- Do not inspect unrelated files.
- Do not redesign the affected feature.
- Make only the exact requested edits.
- Preserve all assertions unless Cloud Control explicitly asks to change them.
- Do not update roadmap files unless they are explicitly listed as allowed.
- Run only the requested validation command.
- Stop after reporting validation result.

## Anti-Patterns

Do not respond with:

- project overview
- architecture summary
- suggestions for future work
- broad task list
- "I can help with..."

If you cannot perform the exact edit, say why and stop.

