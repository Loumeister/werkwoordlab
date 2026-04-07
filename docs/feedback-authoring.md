# Feedback authoring conventions — Werkwoordlab

This document describes how to write and maintain diagnostic feedback entries for werkwoordlab misconception codes.

For the generic, domain-agnostic version of these conventions (suitable for transfer to `grammar-core`), see `staging/grammar-core-feedback/feedback-authoring.md`.

---

## When to use a plain string vs a rich entry

Use a **plain string** when:
- the feedback is a single short prompt that gives the learner an immediate next step
- no structured breakdown (diagnosis + rule + action) adds meaningful value

Use a **rich entry** (`RichFeedbackEntry`) when:
- the misconception involves a reasoning step the learner must understand, not just a correction
- there is a worth-making distinction between diagnosing what went wrong vs. explaining the grammar rule vs. the recovery action
- the entry will be shown in a context that renders the uitleg block

V1 built-in entries use rich entries for all 7 current misconception codes because each involves a diagnostic reasoning step.

---

## Fields

### `herstelvraag`

A short control question or recovery prompt shown inline to the learner.

- Maximum about 15 words
- Usually question-form, but not rigidly so — what matters is that it is immediately usable by the learner
- Should point to the exact decision the learner needs to revisit
- Examples:
  - "Welk onderwerp staat er in de zin?"
  - "Staat 'je' of 'jij' ná de persoonsvorm?"
  - "Heeft dit werkwoord een onregelmatig voltooid deelwoord?"

### `sleutelwoord`

A single word from `herstelvraag` that anchors the "Meer uitleg over…" expand link.

- Must be exactly one word
- Must appear verbatim in `herstelvraag`
- Choose the most informative word for the learner's decision

### `uitleg.diagnose`

A short diagnostic statement identifying what the learner probably did.

- Pattern: "Je hebt waarschijnlijk…"
- 1–2 sentences
- Describe the cognitive mistake, not just the surface error

### `uitleg.redenering`

The relevant grammar rule or distinction.

- 1–2 sentences
- State the rule concretely, ideally with a short example form
- Do not repeat the diagnose; this is the rule that explains why the diagnosis is a problem

### `uitleg.herprobeer`

One concrete, actionable recovery step for the learner.

- Imperative mood
- Single sentence
- Specific enough that the learner knows exactly what to do next
- Examples:
  - "Bepaal het onderwerp. Is het hij, zij of het? Voeg dan -t toe aan de stam."
  - "Schrijf de stam op en kijk naar de laatste klank."

---

## What to avoid

- **Vague praise or blame**: "Goed geprobeerd!" or "Dit is fout" — no concrete next step
- **Passive rule-dumps**: long lists of grammar rules without applying them to the learner's situation
- **Duplicate wording**: do not repeat `herstelvraag` verbatim in `diagnose` or `redenering`
- **Over-long entries**: `herprobeer` is one sentence; `diagnose` and `redenering` are each 1–2 sentences
- **Missing specificity in herprobeer**: "Probeer het nog eens" is too vague — name the concrete check

---

## Portability boundary

Portable to `grammar-core` later:
- `FeedbackEntry`, `RichFeedbackEntry` type definitions (`lib/feedback/types.ts`)
- The generic parts of this authoring guide

Must remain local to werkwoordlab:
- `MisconceptionCode` union type and titles (`lib/feedback/misconceptions.ts`)
- Built-in feedback content (`lib/feedback/builtInFeedback.ts`)
- Override service, lookup, editor UI, and routing
