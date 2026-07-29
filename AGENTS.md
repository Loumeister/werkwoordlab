# AGENTS.md — werkwoordlab

## Repo mode
Effectively greenfield. Use this fixed stack unless explicitly changed:
- Next.js + TypeScript
- Tailwind CSS
- Prisma + SQLite
- Vitest
- Playwright

## MVP operating rules (non-negotiable)
1. Grammar function first, spelling decision second.
2. Deterministic evaluator only (no LLM in learner loop).
3. Exercises are data-driven from versioned JSON content files.
4. Feedback must include misconception code + actionable hint.
5. Privacy-first MVP: anonymous learner sessions, no required student login.
6. Teacher insights are in MVP scope.

## Definition of done for implementation tasks
- Scope matches `docs/product-spec.md` and `docs/backlog.md`.
- Data/logic changes remain consistent with `docs/content-schema.md` and `docs/didactic-principles.md`.
- Required tests for the change type are added/updated per `docs/testing-strategy.md`.
- Relevant checks pass locally (at minimum content validation; plus lint/test/e2e when available).
- If architecture or contracts changed, docs are updated in the same PR.

## Guardrails
- No speculative features beyond current backlog.
- Dutch learner-facing UI/content for MVP.
- Do not hardcode exercise items in UI code.

## Working read order

For every task, read in this order:
1. `AGENTS.md` (this file)
2. Relevant `shared/grammar-core` docs (see list below — read only what is relevant to the task)
3. `docs/product-contract.md`
4. Local code/runtime truth (`lib/`, `content/`, `app/`)
5. Task prompt

**Source-of-truth rule**: for factual repo behavior, local code/runtime truth outranks documentation — both shared and local. If a doc claims something that the code does not do, the code is the truth. Fix the doc, not the code.

Shared canon (`shared/grammar-core/`) informs local behavior at the right boundary level. Local runtime contracts and product logic remain local unless intentionally upstreamed to `grammar-core`.

## When to consult docs

| Concern | Read |
|---|---|
| Product boundaries | `docs/product-spec.md` |
| Learning model | `docs/didactic-principles.md` |
| Content contract | `docs/content-schema.md` |
| System boundaries / data flow | `docs/architecture.md` |
| Test obligations | `docs/testing-strategy.md` |
| Release gate | `docs/release-checklist.md` |
| Local adoption contract | `docs/product-contract.md` |
| Shared didactic principles | `shared/grammar-core/docs/werkwoordspellingsdidactiek-kaders.md` |
| Shared taxonomy governance | `shared/grammar-core/docs/taxonomy-governance.md` |
| Shared spelling algorithm | `shared/grammar-core/docs/werkwoordspellingsalgoritme.md` |
| Platform principles / current vs future | `shared/grammar-core/docs/grammar-platform-principles.md` |
| Shared content authoring rules | `shared/grammar-core/docs/content-authoring-rules.md` |
| Scope boundaries across repos | `shared/grammar-core/docs/repo-scope-contracts.md` |
| Shared agent catalog | `shared/grammar-core/docs/agent-catalog.md` |
| How to sync grammar-core subtree | `shared/grammar-core/docs/repo-sync-strategy.md` (of de `grammar-core-sync` skill) |

## When to use repo skills

Choose one primary local workstream skill from `.agents/skills/`:

- `didactic-workwoordspelling` -> evaluator, feedback and progression logic
- `exercise-quality-gate` -> content validity and ambiguity review
- `learner-flow-ui` -> learner screens and interaction flow
- `teacher-insights` -> aggregation and teacher dashboard behavior
- `content-seed-generator` -> creating or updating units and local taxonomy implementation
- `evals-and-release` -> final validation and release readiness

Add a cross-cutting local wrapper only when its boundary is actually involved:

- `evidence-based-werkwoordspellingsdidactiek` -> didactic justification against adopted shared canon
- `shared-content-integration` -> explicit adapters from shared grammar-core content
- `grammar-core-sync` -> safe subtree synchronization
- `documentation-sync-guardian` -> generated `docs/auto-sync/*` summaries after a main commit

General planning, implementation, TDD, diagnosis and review come from the global engineering skills; do not recreate those workflows in a local domain skill. For learner UI work, combine global `frontend-design` for visual design/build, local `learner-flow-ui` for product-specific didactics, and global `web-design-guidelines` for the final UI/accessibility audit.

## Delivery discipline

- Anchor non-trivial work to an issue or numbered plan step, and state its scope.
- Before editing, select the applicable global Matt process skill and local domain skill.
- Decide the test and validation evidence before implementation.
- Review the exact Git range before claiming completion.
- Report commands, results, and failures honestly.
- Do not claim work is done until applicable checks and required review pass.

## Grammar-core fixes

Bij een fix in grammar-core:

1. Gebruik de lokale `grammar-core-sync`-skill om eigenaarschap en syncvolgorde te bewaken.
2. Werk in een aparte checkout en detecteer de actuele default branch; neem `main` niet stilzwijgend aan.
3. Maak een gerichte fixbranch.
4. Voer de fix uit en draai `claude plugin validate .` als het `.claude-plugin/` raakt.
5. Commit, push en open een draft PR wanneer de taak dat expliciet omvat.
6. Voer na merge `grammar-core-sync` uit in alle productrepo's.
