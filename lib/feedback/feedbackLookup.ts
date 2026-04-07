/**
 * Resolves the effective feedback for a misconception code.
 * Override (if present) takes precedence over the built-in entry.
 * Local to werkwoordlab — depends on local built-in content and local overrides store.
 */

import { type FeedbackEntry } from "./types";
import { type MisconceptionCode } from "./misconceptions";
import { BUILT_IN_FEEDBACK } from "./builtInFeedback";
import { getFeedbackOverrides } from "./feedbackOverrides";

export function getEffectiveFeedback(code: MisconceptionCode): FeedbackEntry | undefined {
  return getFeedbackOverrides()[code] ?? BUILT_IN_FEEDBACK[code];
}
