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

## When to consult docs
- Product boundaries: `docs/product-spec.md`
- Learning model: `docs/didactic-principles.md`
- Content contract: `docs/content-schema.md`
- System boundaries/data flow: `docs/architecture.md`
- Test obligations: `docs/testing-strategy.md`
- Release gate: `docs/release-checklist.md`

## When to use repo skills
Use exactly the skill matching your workstream in `.agents/skills/`:
- `didactic-workwoordspelling` -> evaluator/feedback/progression logic
- `exercise-quality-gate` -> content validity and ambiguity checks
- `learner-flow-ui` -> learner screens and interaction flow
- `teacher-insights` -> aggregation and teacher dashboard behavior
- `content-seed-generator` -> creating/updating units or taxonomy seeds
- `evals-and-release` -> final validation and release readiness
