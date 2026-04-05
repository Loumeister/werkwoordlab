# CLAUDE.md — grammar-core

## Purpose

This file governs how Claude agents work within `grammar-core`.

`grammar-core` is a shared canonical repository. Its job is to hold governance, didactics, taxonomy, schemas, and tool-native instruction files that product repos consume. It is not a product itself.

## Canonical locations

| Location | Contains |
|---|---|
| `docs/` | Governance, didactic canon, taxonomy, platform principles, sync strategy, contract template |
| `schemas/` | Shared structural schemas |
| `content/` | Shared sentence seeds and canonical taxonomy data |
| `/.claude/agents/` | Canonical Claude agent definitions |
| `/.codex/skills/` | Canonical Codex skill definitions |

## Core boundary rule

Do not treat product-local terminology, task models, annotation fields, evaluator logic, JSON shapes, chunk conventions, progression logic, renderer assumptions, or feedback flows as shared truth unless they have been explicitly promoted into shared canon.

When in doubt: if it belongs to one product's runtime behavior, it stays in that product repo.

## Scope guidance

**May be promoted to shared canon:**
- shared didactic principles
- shared taxonomy governance rules
- portable schemas
- principles applicable across more than one product context

**Must not be promoted to shared canon:**
- product-specific labels, field names, or local keys
- product-specific UI logic or interaction patterns
- product-specific annotation fields
- product-specific data structures
- product-specific progression or level logic

## Change decision rules

Before proposing any change, determine:
1. Is this shared canon, local product logic, or a temporary bridge?
2. Is it applicable across more than one product without modification?
3. Does it rest on a named principle from the shared didactic framework?

Only proceed with shared canon promotion if all three apply.

## Reading order for agent work in this repo

1. This file (`CLAUDE.md`)
2. Relevant doc(s) from `docs/` for the task at hand
3. Local product contract of the consuming repo (if reviewing product-repo work)
4. Task prompt

## Output expectations for substantial work

Report:
- files read and changed
- whether changes represent shared canon, local product logic, or temporary bridges
- any remaining product-dependent assumptions that should not silently become shared canon

## Agent rule

No proposal may be called evidence-based unless it is explicitly justified by one or more named principles from `docs/werkwoordspellingsdidactiek-kaders.md` or `docs/parsing-didactics-kaders.md`.
