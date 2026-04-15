export type AttemptRecord = {
  unitId: string;
  itemId: string;
  correct: boolean;
  misconception: string;
  timestamp: string;
  /** Whether the learner chose the correct reasoning chip (proof-chips stage). Absent when chips were not shown. */
  proofCorrect?: boolean;
};

const STORAGE_KEY = "werkwoordlab-attempts";

function isAttemptRecord(value: unknown): value is AttemptRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AttemptRecord>;
  return (
    typeof candidate.unitId === "string" &&
    typeof candidate.itemId === "string" &&
    typeof candidate.correct === "boolean" &&
    typeof candidate.misconception === "string" &&
    typeof candidate.timestamp === "string"
  );
}

export function readAttempts(): AttemptRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => isAttemptRecord(item));
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: AttemptRecord) {
  if (typeof window === "undefined") {
    return;
  }

  const attempts = readAttempts();
  const next = [attempt, ...attempts].slice(0, 200);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
