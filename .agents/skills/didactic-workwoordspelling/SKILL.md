# Skill: didactic-workwoordspelling

## Use when
- Changing evaluator rules for persoonsvorm/infinitief/voltooid deelwoord.
- Changing diagnostic feedback mapping (answer -> misconception code/hint).
- Changing scaffold/fading progression logic across a unit.

## Do not use when
- Editing only JSON content values (use `content-seed-generator` + `exercise-quality-gate`).
- Editing only visual layout/styling (use `learner-flow-ui`).
- Editing teacher aggregation/reporting only (use `teacher-insights`).

## Procedure
1. Read `docs/didactic-principles.md` and `docs/product-spec.md`.
2. Verify flow order is explicit: function detection -> rule selection -> spelling output.
3. Ensure homophone cases remain explicitly distinguishable by function.
4. Map each handled error path to a taxonomy code + remediation hint.
5. Add/adjust evaluator tests (unit + integration where mapping is involved).
6. If rule contracts changed, update `docs/content-schema.md` or `docs/architecture.md`.

## Evaluator contract: case normalization
- Content stores `target` in canonical **lowercase** form (e.g. `"snap"`, not `"Snap"`).
- `acceptedVariants` must not duplicate `target`; keep it empty (`[]`) unless there are genuinely distinct acceptable spellings.
- The evaluator **must** lowercase the learner's input before comparing it to `target` and `acceptedVariants`, so sentence-initial capitals are accepted without encoding them in content.
