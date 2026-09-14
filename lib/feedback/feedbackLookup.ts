/**
 * Resolves the effective feedback for a misconception code.
 * Override (if present) takes precedence over the built-in entry.
 * Local to werkwoordlab — depends on local built-in content and local overrides store.
 */

"use client";

import { useSyncExternalStore } from "react";
import { type FeedbackEntry } from "./types";
import { type MisconceptionCode } from "./misconceptions";
import { BUILT_IN_FEEDBACK } from "./builtInFeedback";
import { getFeedbackOverrides } from "./feedbackOverrides";

export function getEffectiveFeedback(code: MisconceptionCode): FeedbackEntry | undefined {
  return getFeedbackOverrides()[code] ?? BUILT_IN_FEEDBACK[code];
}

const subscribe = () => () => {};

export function resolveFeedback(
  code: MisconceptionCode | undefined,
  browserReady: boolean,
): FeedbackEntry | undefined {
  if (!code) return undefined;
  return browserReady ? getEffectiveFeedback(code) : BUILT_IN_FEEDBACK[code];
}

/** Keeps the server and first client render equal, then applies browser-local overrides. */
export function useEffectiveFeedback(code: MisconceptionCode | undefined): FeedbackEntry | undefined {
  const browserReady = useSyncExternalStore(subscribe, () => true, () => false);
  return resolveFeedback(code, browserReady);
}
