# Skill: content-seed-generator

## Use when
- Authoring new `content/units/*.json` files.
- Expanding existing units with new items/transfer tasks.
- Adding/updating misconception taxonomy entries used by items.

## Do not use when
- Implementing evaluator/runtime logic without changing content files.
- Performing final gate review only (use `exercise-quality-gate`).

## Procedure
1. Read `docs/content-schema.md` and `docs/didactic-principles.md`.
2. Write Dutch items with explicit grammatical target and scaffold steps.
3. Include homophone pressure items where relevant to the unit goal.
4. Assign `primaryMisconception` intentionally for each item.
5. Include one transfer task progressing from isolated practice to revision/short writing.
6. Run JSON/schema validation before handing off.
