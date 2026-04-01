# Skill: teacher-insights

## Use when
- Changing teacher metrics, aggregation queries, or insight APIs.
- Changing teacher dashboard widgets or drilldown behavior.

## Do not use when
- Task affects only learner exercise interaction.
- Task affects only content authoring/schema with no teacher view impact.

## Procedure
1. Read `docs/product-spec.md`, `docs/architecture.md`, and `docs/testing-strategy.md`.
2. Keep scope to actionable MVP signals: misconception distribution, accuracy, participation.
3. Verify metrics are computed from persisted attempts (not hardcoded/demo values).
4. Keep outputs aggregate-first and privacy-safe (no unnecessary personal data).
5. Add/update aggregation integration tests and teacher-view e2e smoke tests.
