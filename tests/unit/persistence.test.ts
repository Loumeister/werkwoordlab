import { afterEach, describe, expect, it } from "vitest";
import { readAttempts, saveAttempt, type AttemptRecord } from "@/lib/attempt-store";

class LocalStorageMock {
  private store = new Map<string, string>();

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  clear() {
    this.store.clear();
  }
}

describe("attempt persistence", () => {
  const storage = new LocalStorageMock();

  afterEach(() => {
    storage.clear();
    delete (globalThis as { window?: unknown }).window;
  });

  it("slaat pogingen op en leest ze terug", () => {
    (globalThis as { window: { localStorage: LocalStorageMock } }).window = { localStorage: storage };

    const attempt: AttemptRecord = {
      unitId: "unit-01-pv-tt",
      itemId: "u1-i1",
      correct: true,
      misconception: "PV_FALSE_T_ADD",
      timestamp: "2026-04-01T00:00:00.000Z"
    };

    saveAttempt(attempt);
    expect(readAttempts()).toEqual([attempt]);
  });

  it("geeft lege lijst bij empty state", () => {
    (globalThis as { window: { localStorage: LocalStorageMock } }).window = { localStorage: storage };
    expect(readAttempts()).toEqual([]);
  });

  it("handelt malformed persisted state veilig af", () => {
    (globalThis as { window: { localStorage: LocalStorageMock } }).window = { localStorage: storage };
    storage.setItem("werkwoordlab-attempts", "geen-json");
    expect(readAttempts()).toEqual([]);

    storage.setItem("werkwoordlab-attempts", JSON.stringify([{ foo: "bar" }]));
    expect(readAttempts()).toEqual([]);
  });

  it("behoudt alleen geldige records als persisted state gemengd is", () => {
    (globalThis as { window: { localStorage: LocalStorageMock } }).window = { localStorage: storage };

    const valid: AttemptRecord = {
      unitId: "unit-02-voltooid-deelwoord",
      itemId: "u2-i2",
      correct: false,
      misconception: "HOMOPHONE_FUNCTION_CONFUSION",
      timestamp: "2026-04-01T00:00:00.000Z"
    };

    storage.setItem("werkwoordlab-attempts", JSON.stringify([valid, { nope: true }, 123]));
    expect(readAttempts()).toEqual([valid]);
  });
});
