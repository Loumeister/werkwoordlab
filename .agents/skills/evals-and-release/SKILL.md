# Skill: evals-and-release

## Use when
- Preparing a release candidate.
- Running final validation after multi-area changes.
- Triaging failing quality gates before ship/no-ship decisions.

## Do not use when
- Implementing a single feature still in active development.
- Writing new content without release intent (use content skills first).

## Procedure
1. Read `docs/testing-strategy.md` and `docs/release-checklist.md`.
2. Execute required checks for current scope (lint, unit/integration, content validation, e2e smoke).
3. Record pass/fail per check with blocking severity (P0/P1/P2).
4. Block release on unresolved P0/P1 issues.
5. Confirm release checklist items and note residual risk explicitly.
