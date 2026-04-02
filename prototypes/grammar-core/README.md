# grammar-core

`grammar-core` is the shared canonical core for:
- Werkwoordlab
- ontledingstrainer

This repository exists to prevent drift between grammar analysis and verb-spelling instruction across separate product repos.

## Mission
Provide one shared source of truth for:
- didactic governance
- content governance
- misconception taxonomy governance
- shared sentence/content models
- canonical Claude and Codex agent instructions

## Why this repo exists
Werkwoordlab and ontledingstrainer complement each other, but their repos and agents cannot reliably see each other.

A shared core repo is needed because:
- package-only sharing is not sufficient for agent visibility
- didactic and taxonomy rules must stay canonical
- sentence reuse should start from one content layer, not from duplicated local copies

## Canonical in this repo
The following are canonical here:
- `docs/werkwoordspellingsdidactiek-kaders.md`
- `docs/grammar-platform-principles.md`
- `docs/content-authoring-rules.md`
- `docs/taxonomy-governance.md`
- `docs/repo-sync-strategy.md`
- `agents/claude/*`
- `agents/codex/*`
- `schemas/*`
- `content/taxonomy/*`
- `content/shared-sentences/*`

## Not canonical here
These remain product-specific:
- UI and route design
- runtime app code
- product-specific dashboards
- local storage or persistence implementations
- repo-specific backlog and product scope decisions

## Recommended sync model
Both product repos should include this repo locally, preferably via **git subtree**, for example under:

```text
shared/grammar-core/
```

This is the preferred first approach because Claude and Codex agents can only reliably use files that are physically present in the current repo context.

## Local wrapper rule
Product repos may keep local agent files, but those must be wrappers.

Their reading order must be:
1. `shared/grammar-core/`
2. local repo contracts
3. task prompt

## Phase 1 scope
Phase 1 of `grammar-core` includes:
- canonical docs
- canonical agent instructions
- first shared schemas
- first small shared taxonomy
- first small shared sentence seed set

Phase 1 explicitly does **not** include:
- a full runtime library
- package publishing
- a monorepo migration
- shared analytics infrastructure

## Directory structure
```text
grammar-core/
  README.md
  docs/
  agents/
  schemas/
  content/
  adapters/
```

## Agent rule
No proposal may be called evidence-based unless it is explicitly justified by one or more named principles from the didactic framework in `docs/`.
