# Staged candidates for grammar-core

This folder contains files that are ready to be moved into `Loumeister/grammar-core` in a future pass.

These files are self-contained, clean, and free of werkwoordlab-specific domain content.

---

## Mapping

| Local source | Staged candidate | Intended grammar-core path | Reason portable |
|---|---|---|---|
| `lib/feedback/types.ts` | `staging/grammar-core-feedback/types.ts` | `src/feedback/types.ts` | Pure shape contract (`FeedbackEntry`, `RichFeedbackEntry`, `isRichFeedbackEntry`). No domain coupling, no app-specific logic. |
| `docs/feedback-authoring.md` (generic parts) | `staging/grammar-core-feedback/feedback-authoring.md` | `docs/feedback-authoring.md` | Authoring conventions for `herstelvraag`, `sleutelwoord`, `uitleg.*`, and `herprobeer` apply across all exercise domains, not just werkwoordlab. |

---

## What is NOT staged here

The following files are local to werkwoordlab and must not be moved to grammar-core:

| File | Reason not portable |
|---|---|
| `lib/feedback/misconceptions.ts` | Contains `MisconceptionCode` enum and groupings specific to Dutch verb-spelling errors |
| `lib/feedback/builtInFeedback.ts` | Contains werkwoordlab feedback content |
| `lib/feedback/feedbackOverrides.ts` | Uses a werkwoordlab-specific localStorage key and data shape |
| `lib/feedback/feedbackLookup.ts` | Wired to local built-in content |
| `components/feedback/FeedbackEditor.tsx` | App-specific editor UI |
| `app/feedback-editor/page.tsx` | App-specific routing |

---

## Note on the override pattern

`lib/feedback/feedbackOverrides.ts` implements a generic CRUD pattern for localStorage-backed overrides that *may* prove portable to grammar-core later. It is not staged now because the current storage key (`werkwoordlab-feedback-overrides`) and data shape (`Record<MisconceptionCode, FeedbackEntry>`) are still werkwoordlab-specific. If a future exercise domain needs the same pattern, the CRUD logic can be extracted as a generic `createOverrideStore(key)` factory at that point.

---

## How to move these files

When ready to transfer to `Loumeister/grammar-core`:

1. Copy `staging/grammar-core-feedback/types.ts` → `grammar-core/src/feedback/types.ts`
2. Copy `staging/grammar-core-feedback/feedback-authoring.md` → `grammar-core/docs/feedback-authoring.md`
3. Update the import paths in `lib/feedback/types.ts` and `lib/feedback/feedbackLookup.ts` in this repo to point to the shared package
4. Delete the local copy of `lib/feedback/types.ts` if the shared version covers it fully
5. Remove this staging folder or keep it as an archival note
