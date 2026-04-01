# Skill: learner-flow-ui

## Use when
- Implementing learner-facing screens/routes/components.
- Changing interaction flow between prompt, scaffold steps, answer, and feedback.
- Adjusting learner-side accessibility/cognitive-load behavior.

## Do not use when
- Changing evaluator correctness rules only (use `didactic-workwoordspelling`).
- Editing content files only (use `content-seed-generator` / `exercise-quality-gate`).
- Working solely on teacher insights pages.

## Procedure
1. Read `docs/product-spec.md` and `docs/didactic-principles.md`.
2. Preserve sequence: item -> visible reasoning scaffolds -> answer -> diagnostic feedback -> next step.
3. Keep Dutch UI copy and remove unnecessary interaction friction.
4. Ensure no required login gate blocks learner MVP flow.
5. Add/update Playwright learner-flow coverage for the changed path.
