import { afterEach, describe, expect, it } from 'vitest';
import { readAttempts, saveAttempt, type AttemptRecord } from '@/lib/attempt-store';

const STORAGE_KEY = 'werkwoordlab-attempts';

type LocalStorageMock = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

function installWindowMock() {
  const store = new Map<string, string>();

  const localStorage: LocalStorageMock = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage },
  });

  return { localStorage };
}

function makeAttempt(index: number): AttemptRecord {
  return {
    unitId: 'unit-01-pv-tt',
    itemId: `u1-i${index}`,
    correct: index % 2 === 0,
    misconception: 'PV_STAM_T_OMISSION',
    timestamp: `2026-01-01T00:00:${String(index).padStart(2, '0')}Z`,
  };
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, 'window');
});

describe('attempt persistence', () => {
  it('returns empty state when nothing is stored', () => {
    installWindowMock();
    expect(readAttempts()).toEqual([]);
  });

  it('stores and retrieves attempts in reverse chronological insert order', () => {
    installWindowMock();

    const first = makeAttempt(1);
    const second = makeAttempt(2);
    saveAttempt(first);
    saveAttempt(second);

    expect(readAttempts()).toEqual([second, first]);
  });

  it('handles malformed persisted state safely', () => {
    const { localStorage } = installWindowMock();
    localStorage.setItem(STORAGE_KEY, '{invalid-json');

    expect(readAttempts()).toEqual([]);
  });

  it('caps persisted attempt history to 200 records', () => {
    installWindowMock();

    for (let i = 1; i <= 205; i += 1) {
      saveAttempt(makeAttempt(i));
    }

    const attempts = readAttempts();
    expect(attempts.length).toBe(200);
    expect(attempts[0].itemId).toBe('u1-i205');
    expect(attempts[199].itemId).toBe('u1-i6');
  });
});
