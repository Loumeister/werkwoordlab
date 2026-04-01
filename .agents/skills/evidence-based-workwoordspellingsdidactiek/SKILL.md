# Skill: evidence-based-workwoordspellingsdidactiek

## Use when
- Proposing or reviewing changes to units, sentence banks, taxonomy, evaluator logic, or instructional feedback.
- Deciding whether a didactic change is justified.
- Expanding the app into new grammar domains such as verleden tijd, infinitief, or bijvoeglijk gebruikt voltooid deelwoord.

## Do not use when
- The task is only visual styling with no instructional impact.
- The task is only storage, routing, CI, or packaging work.

## Read first
1. `docs/werkwoordspellingsdidactiek-kaders.md`
2. `docs/didactic-principles.md`
3. `docs/content-schema.md`
4. `docs/content-expansion-roadmap.md`

## Procedure
1. Identify the didactic problem being solved.
2. Name the grammatical distinction or misconception involved.
3. Justify the change using one or more explicit principles from `docs/werkwoordspellingsdidactiek-kaders.md`.
4. Check whether the change improves:
   - function-first reasoning
   - contrastive practice
   - diagnostic feedback
   - scaffolded progression and transfer
5. Reject the change if it only adds quantity without contrastive or diagnostic value.
6. Update tests or validation if the change affects content, evaluator behavior, or taxonomy.

## Required output
Always state:
- which principle from `docs/werkwoordspellingsdidactiek-kaders.md` supports the change
- what learner difficulty is being addressed
- whether taxonomy/evaluator/tests must change too

## Guardrails
- Do not call a proposal evidence-based without linking it to a principle in `docs/werkwoordspellingsdidactiek-kaders.md`.
- Prefer narrow, actionable misconception distinctions over broad vague labels.
- Prefer meaningful contrast items over near-duplicate sentence inflation.
- Keep grammatical function central to all instructional decisions.
