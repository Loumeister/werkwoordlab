# Feedback authoring conventions — shared (grammar-core candidate)

This document describes generic conventions for writing `FeedbackEntry` and `RichFeedbackEntry` values across exercise domains.

For werkwoordlab-specific authoring notes (misconception codes, domain examples), see `docs/feedback-authoring.md` in `Loumeister/werkwoordlab`.

---

## When to use a plain string vs a rich entry

Use a **plain string** when:
- the feedback is a single short prompt that gives the learner an immediate next step
- no structured breakdown adds meaningful value

Use a **rich entry** (`RichFeedbackEntry`) when:
- the error involves a reasoning step the learner must understand, not just a surface correction
- there is a meaningful distinction between diagnosing what went wrong, explaining the rule, and specifying the recovery action

---

## Fields

### `herstelvraag`

A short control question or recovery prompt shown inline to the learner.

- Maximum about 15 words
- Usually question-form, but not rigidly so — what matters is that it is immediately usable by the learner
- Should point to the exact decision the learner needs to revisit

### `sleutelwoord`

A single word from `herstelvraag` that anchors the expand interaction.

- Must be exactly one word
- Must appear verbatim in `herstelvraag`

### `uitleg.diagnose`

A short diagnostic statement: what the learner probably did.

- Pattern: "Je hebt waarschijnlijk…"
- 1–2 sentences
- Describe the cognitive mistake, not just the surface error

### `uitleg.redenering`

The relevant rule or distinction.

- 1–2 sentences, ideally with a brief example
- Do not repeat the diagnose

### `uitleg.herprobeer`

One concrete recovery step for the learner.

- Imperative mood
- Single sentence
- Specific enough that the learner knows exactly what to do next

---

## What to avoid

- Vague praise or blame without a concrete next step
- Passive rule-dumps: long lists of rules not applied to the learner's situation
- Duplicate wording across fields
- Entries longer than the guidelines above
- `herprobeer` without naming the specific check the learner must perform
