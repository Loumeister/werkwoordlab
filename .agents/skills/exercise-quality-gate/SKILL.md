# Skill: exercise-quality-gate

## Use when
- Reviewing or validating unit/taxonomy JSON before merge.
- Changing content validation logic or schema invariants.
- Checking ambiguous prompts/answers and misconception coverage.

## Do not use when
- Building learner UI behavior without content-contract changes.
- Building teacher dashboards without editing exercise datasets.

## Procedure
1. Read `docs/content-schema.md`.
2. Validate JSON syntax and required fields.
3. Check invariant set:
   - unique unit/item ids,
   - every `primaryMisconception` exists in taxonomy,
   - transfer task present,
   - homophone coverage where unit goals require it.
4. Flag ambiguity risks (multiple plausible answers not declared in `acceptedVariants`).
5. Run content validation tests/checks and block merge on unresolved violations.
