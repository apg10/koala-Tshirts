# Node: colombia-aux

Auxiliary local AI node.

Recommended model profile:
- build worker: `koala-worker-7b`
- repo/report: `koala-repo-3b`

This node should receive smaller tasks:
- focused tests
- isolated UI fixes
- file-local backend repairs
- read-only audits

Avoid:
- checkout/Stripe architecture
- broad refactors
- multi-module changes
- direct changes to roadmap unless explicitly assigned

