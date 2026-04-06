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
| How to sync grammar-core snapshot | `shared/grammar-core/MIRROR-SOURCE.md` |

## When to use repo skills
Use exactly the skill matching your workstream in `.agents/skills/`:
- `didactic-workwoordspelling` -> evaluator/feedback/progression logic
- `exercise-quality-gate` -> content validity and ambiguity checks
- `learner-flow-ui` -> learner screens and interaction flow
- `teacher-insights` -> aggregation and teacher dashboard behavior
- `content-seed-generator` -> creating/updating units or taxonomy seeds
- `evals-and-release` -> final validation and release readiness
