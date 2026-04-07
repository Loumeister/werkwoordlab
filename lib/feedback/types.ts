/**
 * Portable feedback type contract.
 *
 * Portable later to Loumeister/grammar-core: src/feedback/types.ts
 * This file contains only domain-agnostic shape definitions.
 * No MisconceptionCode, no grouping config — those are werkwoordlab-specific (see misconceptions.ts).
 */

export type FeedbackEntry = string | RichFeedbackEntry;

export interface RichFeedbackEntry {
  /** Short control question or recovery prompt, max ~15 words. Always visible to the learner. */
  herstelvraag: string;
  /** Single word from herstelvraag that anchors the expand interaction. */
  sleutelwoord: string;
  uitleg: {
    /** "Je hebt waarschijnlijk..." — 1-2 sentences diagnosing what went wrong. */
    diagnose: string;
    /** The grammar rule or distinction — 1-2 sentences. */
    redenering: string;
    /** One concrete recovery action for the learner, imperative mood. */
    herprobeer: string;
  };
}

export function isRichFeedbackEntry(entry: unknown): entry is RichFeedbackEntry {
  if (typeof entry !== "object" || entry === null) {
    return false;
  }

  const candidate = entry as Record<string, unknown>;
  const uitleg = candidate.uitleg;

  if (typeof uitleg !== "object" || uitleg === null) {
    return false;
  }

  const uitlegCandidate = uitleg as Record<string, unknown>;

  return (
    typeof candidate.herstelvraag === "string" &&
    typeof candidate.sleutelwoord === "string" &&
    typeof uitlegCandidate.diagnose === "string" &&
    typeof uitlegCandidate.redenering === "string" &&
    typeof uitlegCandidate.herprobeer === "string"
  );
}
