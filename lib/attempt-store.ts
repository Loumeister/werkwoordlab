export type AttemptRecord = {
  unitId: string;
  itemId: string;
  correct: boolean;
  misconception: string;
  timestamp: string;
};

const STORAGE_KEY = "werkwoordlab-attempts";

export function readAttempts(): AttemptRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as AttemptRecord[];
    return Array.isArray(parsed) ? parsed : [];
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
