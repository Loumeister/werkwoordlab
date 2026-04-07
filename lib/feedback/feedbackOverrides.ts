/**
 * LocalStorage CRUD service for teacher feedback overrides.
 * Local to werkwoordlab (storage key and data shape are app-specific).
 *
 * Note: the general override CRUD pattern may prove portable to grammar-core later,
 * but is not staged now because the key and shape are currently werkwoordlab-specific.
 */

import { type FeedbackEntry } from "./types";
import { type MisconceptionCode } from "./misconceptions";

const STORAGE_KEY = "werkwoordlab-feedback-overrides";

type FeedbackOverrides = Partial<Record<MisconceptionCode, FeedbackEntry>>;

export function getFeedbackOverrides(): FeedbackOverrides {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FeedbackOverrides) : {};
  } catch {
    return {};
  }
}

export function setFeedbackOverride(code: MisconceptionCode, value: FeedbackEntry): void {
  if (typeof window === "undefined") {
    return;
  }

  const overrides = getFeedbackOverrides();
  overrides[code] = value;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function resetFeedbackOverride(code: MisconceptionCode): void {
  if (typeof window === "undefined") {
    return;
  }

  const overrides = getFeedbackOverrides();
  delete overrides[code];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function clearAllFeedbackOverrides(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function exportFeedbackOverrides(): string {
  return JSON.stringify(getFeedbackOverrides(), null, 2);
}
