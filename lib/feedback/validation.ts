/**
 * Authoring-rule validation for feedback entries.
 * Pure functions — no side effects, no I/O.
 *
 * Rules enforced (see docs/feedback-authoring.md):
 * - All fields must be non-empty.
 * - sleutelwoord must be exactly one word (no whitespace).
 * - sleutelwoord must appear (case-insensitive) in herstelvraag.
 */

import { type RichFeedbackEntry } from "./types";

export interface RichFeedbackErrors {
  herstelvraag?: string;
  sleutelwoord?: string;
  diagnose?: string;
  redenering?: string;
  herprobeer?: string;
}

export function validateRichFeedback(entry: RichFeedbackEntry): RichFeedbackErrors {
  const errors: RichFeedbackErrors = {};

  if (!entry.herstelvraag.trim()) {
    errors.herstelvraag = "Herstelvraag mag niet leeg zijn.";
  }

  if (!entry.sleutelwoord.trim()) {
    errors.sleutelwoord = "Sleutelwoord mag niet leeg zijn.";
  } else if (/\s/.test(entry.sleutelwoord.trim())) {
    errors.sleutelwoord = "Sleutelwoord moet precies één woord zijn.";
  } else if (
    entry.herstelvraag.trim() &&
    !entry.herstelvraag.toLowerCase().includes(entry.sleutelwoord.trim().toLowerCase())
  ) {
    errors.sleutelwoord = "Sleutelwoord moet voorkomen in herstelvraag.";
  }

  if (!entry.uitleg.diagnose.trim()) {
    errors.diagnose = "Diagnose mag niet leeg zijn.";
  }

  if (!entry.uitleg.redenering.trim()) {
    errors.redenering = "Redenering mag niet leeg zijn.";
  }

  if (!entry.uitleg.herprobeer.trim()) {
    errors.herprobeer = "Herprobeer mag niet leeg zijn.";
  }

  return errors;
}

export function hasRichErrors(errors: RichFeedbackErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validatePlainFeedback(text: string): string | undefined {
  return text.trim() ? undefined : "Feedbacktekst mag niet leeg zijn.";
}
