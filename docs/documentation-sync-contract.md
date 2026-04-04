# Documentation Sync Contract

## Goal
After each push to `main`, generate a narrow documentation update that records what changed and what the likely documentation impact is.

## Automated files
Only files in `docs/auto-sync/` may be rewritten automatically.

## Why this is narrow
Werkwoordlab has local evaluator logic, misconception mapping, and progression rules.
Automatic rewriting of README files, product specs, or core contracts is too risky without human review.

## Agent sources
- Claude wrapper: `.claude/agents/documentation-sync-guardian.md`
- Codex wrapper: `.codex/skills/documentation-sync-guardian/SKILL.md`
- Shared upstream, when mirrored locally: `shared/grammar-core/`
