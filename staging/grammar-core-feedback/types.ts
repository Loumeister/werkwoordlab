/**
 * Staged candidate for Loumeister/grammar-core.
 *
 * Intended target: grammar-core/src/feedback/types.ts
 * Source in this repo: lib/feedback/types.ts
 *
 * This file is portable because it contains only domain-agnostic shape definitions.
 * It has no dependency on werkwoordlab misconception codes, grouping config, or content.
 *
 * See staging/grammar-core-feedback/README.md for the full mapping.
 */

export type FeedbackEntry = string | RichFeedbackEntry;

export interface RichFeedbackEntry {
  /** Short control question or recovery prompt shown inline to the learner. Max ~15 words. */
  herstelvraag: string;
  /** Single word from herstelvraag that anchors the expand interaction. */
  sleutelwoord: string;
  uitleg: {
    /** What the learner probably did wrong — 1-2 sentences, "Je hebt waarschijnlijk..." */
    diagnose: string;
    /** The grammar rule or distinction — 1-2 sentences. */
    redenering: string;
    /** One concrete recovery action, imperative mood. */
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
