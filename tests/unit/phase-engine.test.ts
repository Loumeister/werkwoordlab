import { describe, expect, it } from "vitest";
import type { AttemptRecord } from "@/lib/attempt-store";
import type { AnyItem, ExerciseItem } from "@/lib/content";
import {
  FUNCTION_STEP_CODE,
  PHASE_CONFIGS,
  type EntryMode,
  getEntryMode,
  getVerbFunctionHints,
  groupItemsByPhase,
  hasFunctionMastery,
  hasPatternMastery,
  resolveItemPhase,
} from "@/lib/phase-engine";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeAttempt(overrides: Partial<AttemptRecord> = {}): AttemptRecord {
  return {
    unitId: "unit-01",
    itemId: "u1-i1",
    correct: true,
    misconception: "PV_FALSE_T_ADD",
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

function makeItem(overrides: Partial<ExerciseItem> = {}): ExerciseItem {
  return {
    id: "u1-i1",
    type: "fill-in",
    prompt: "Ik ___ het antwoord. (vinden)",
    context: "Klas",
    lemma: "vinden",
    grammaticalFunction: "persoonsvorm",
    tense: "tegenwoordige-tijd",
    subject: "ik",
    target: "vind",
    homophonePair: "vind/vindt",
    scaffold: { step1: "Stap 1", step2: "Stap 2", step3: "Stap 3" },
    diagnostic: { primaryMisconception: "PV_FALSE_T_ADD", acceptedVariants: [] },
    feedback: { correct: "Goed!", hint: "Controleer het onderwerp." },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// PHASE_CONFIGS
// ---------------------------------------------------------------------------

describe("PHASE_CONFIGS", () => {
  it("has an entry for all four phases", () => {
    expect(PHASE_CONFIGS.verkennen.label).toBe("Verkennen");
    expect(PHASE_CONFIGS.oefenen.label).toBe("Oefenen");
    expect(PHASE_CONFIGS.zelfstandig.label).toBe("Zelfstandig");
    expect(PHASE_CONFIGS.transfer.label).toBe("Transfer");
  });

  it("has a non-empty description for each phase", () => {
    for (const config of Object.values(PHASE_CONFIGS)) {
      expect(config.description.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// resolveItemPhase
// ---------------------------------------------------------------------------

describe("resolveItemPhase", () => {
  it("returns an explicit phase field if present", () => {
    const item = makeItem({ phase: "zelfstandig" });
    expect(resolveItemPhase(item, 0, 10)).toBe("zelfstandig");
  });

  it("returns 'verkennen' for the first quarter without explicit phase", () => {
    const item = makeItem();
    expect(resolveItemPhase(item, 0, 10)).toBe("verkennen");
    expect(resolveItemPhase(item, 2, 10)).toBe("verkennen");
  });

  it("returns 'oefenen' for the second quarter", () => {
    const item = makeItem();
    expect(resolveItemPhase(item, 3, 10)).toBe("oefenen");
    expect(resolveItemPhase(item, 4, 10)).toBe("oefenen");
  });

  it("returns 'zelfstandig' for the last half", () => {
    const item = makeItem();
    expect(resolveItemPhase(item, 5, 10)).toBe("zelfstandig");
    expect(resolveItemPhase(item, 9, 10)).toBe("zelfstandig");
  });
});

// ---------------------------------------------------------------------------
// groupItemsByPhase
// ---------------------------------------------------------------------------

describe("groupItemsByPhase", () => {
  it("groups items with explicit phases into the correct buckets", () => {
    const items: AnyItem[] = [
      makeItem({ id: "a", phase: "verkennen" }),
      makeItem({ id: "b", phase: "oefenen" }),
      makeItem({ id: "c", phase: "zelfstandig" }),
      makeItem({ id: "d", phase: "verkennen" }),
    ];
    const groups = groupItemsByPhase(items);
    expect(groups.verkennen).toEqual([0, 3]);
    expect(groups.oefenen).toEqual([1]);
    expect(groups.zelfstandig).toEqual([2]);
  });

  it("excludes items with phase 'transfer' from all groups", () => {
    const items: AnyItem[] = [
      makeItem({ id: "a", phase: "verkennen" }),
      makeItem({ id: "b", phase: "transfer" }),
    ];
    const groups = groupItemsByPhase(items);
    expect(groups.verkennen).toEqual([0]);
    expect(groups.oefenen).toEqual([]);
    expect(groups.zelfstandig).toEqual([]);
  });

  it("falls back to heuristic phase when no explicit phase set", () => {
    const items: AnyItem[] = Array.from({ length: 8 }, (_, i) =>
      makeItem({ id: `i${i}` })
    );
    const groups = groupItemsByPhase(items);
    // 25% of 8 = 2 → indices 0-1 are verkennen
    expect(groups.verkennen).toContain(0);
    expect(groups.verkennen).toContain(1);
    // Next 25% → indices 2-3 are oefenen
    expect(groups.oefenen).toContain(2);
    // Rest → zelfstandig
    expect(groups.zelfstandig).toContain(4);
    expect(groups.zelfstandig).toContain(7);
  });
});

// ---------------------------------------------------------------------------
// hasFunctionMastery
// ---------------------------------------------------------------------------

describe("hasFunctionMastery", () => {
  it("returns false when there are no attempts at all", () => {
    expect(hasFunctionMastery([])).toBe(false);
  });

  it("returns false when there is only 1 correct function-step attempt", () => {
    const attempts = [makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: true })];
    expect(hasFunctionMastery(attempts)).toBe(false);
  });

  it("returns true with ≥ 2 correct function-step attempts", () => {
    const attempts = [
      makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: true }),
      makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: true }),
    ];
    expect(hasFunctionMastery(attempts)).toBe(true);
  });

  it("does NOT count correct spelling attempts (other misconception codes)", () => {
    const attempts = [
      makeAttempt({ misconception: "PV_FALSE_T_ADD", correct: true }),
      makeAttempt({ misconception: "PV_FALSE_T_ADD", correct: true }),
      makeAttempt({ misconception: "PV_FALSE_T_ADD", correct: true }),
    ];
    expect(hasFunctionMastery(attempts)).toBe(false);
  });

  it("does NOT count wrong function-step attempts", () => {
    const attempts = [
      makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: false }),
      makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: false }),
      makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: false }),
    ];
    expect(hasFunctionMastery(attempts)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// hasPatternMastery
// ---------------------------------------------------------------------------

describe("hasPatternMastery", () => {
  const code = "PV_FALSE_T_ADD";

  it("returns false with no attempts", () => {
    expect(hasPatternMastery(code, [])).toBe(false);
  });

  it("returns false with only 1 correct attempt for the code", () => {
    const attempts = [makeAttempt({ misconception: code, correct: true })];
    expect(hasPatternMastery(code, attempts)).toBe(false);
  });

  it("returns true with ≥ 2 correct attempts for the code", () => {
    const attempts = [
      makeAttempt({ misconception: code, correct: true }),
      makeAttempt({ misconception: code, correct: true }),
    ];
    expect(hasPatternMastery(code, attempts)).toBe(true);
  });

  it("does NOT count function-step attempts toward pattern mastery", () => {
    const attempts = [
      makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: true }),
      makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: true }),
      makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: true }),
    ];
    expect(hasPatternMastery(code, attempts)).toBe(false);
  });

  it("does NOT count correct attempts for a different misconception code", () => {
    const attempts = [
      makeAttempt({ misconception: "PV_STAM_T_OMISSION", correct: true }),
      makeAttempt({ misconception: "PV_STAM_T_OMISSION", correct: true }),
    ];
    expect(hasPatternMastery(code, attempts)).toBe(false);
  });

  it("does NOT count wrong attempts for the same code", () => {
    const attempts = [
      makeAttempt({ misconception: code, correct: false }),
      makeAttempt({ misconception: code, correct: false }),
    ];
    expect(hasPatternMastery(code, attempts)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getEntryMode
// ---------------------------------------------------------------------------

describe("getEntryMode", () => {
  const item = makeItem();

  it("returns 'full' when neither sub-skill is mastered", () => {
    expect(getEntryMode(item, [])).toBe<EntryMode>("full");
  });

  it("returns 'spell-first' when only function is mastered", () => {
    const attempts = [
      makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: true }),
      makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: true }),
    ];
    expect(getEntryMode(item, attempts)).toBe<EntryMode>("spell-first");
  });

  it("returns 'full' when only pattern is mastered (function still needed)", () => {
    const attempts = [
      makeAttempt({ misconception: "PV_FALSE_T_ADD", correct: true }),
      makeAttempt({ misconception: "PV_FALSE_T_ADD", correct: true }),
    ];
    expect(getEntryMode(item, attempts)).toBe<EntryMode>("full");
  });

  it("returns 'independent' when both sub-skills are mastered", () => {
    const attempts = [
      makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: true }),
      makeAttempt({ misconception: FUNCTION_STEP_CODE, correct: true }),
      makeAttempt({ misconception: "PV_FALSE_T_ADD", correct: true }),
      makeAttempt({ misconception: "PV_FALSE_T_ADD", correct: true }),
    ];
    expect(getEntryMode(item, attempts)).toBe<EntryMode>("independent");
  });
});

// ---------------------------------------------------------------------------
// getVerbFunctionHints
// ---------------------------------------------------------------------------

describe("getVerbFunctionHints", () => {
  describe("persoonsvorm items", () => {
    it("generates a tense-swap hint for tegenwoordige-tijd items", () => {
      const item = makeItem({ grammaticalFunction: "persoonsvorm", tense: "tegenwoordige-tijd" });
      const hints = getVerbFunctionHints(item);
      expect(hints[0]).toContain("verleden tijd");
    });

    it("generates a tense-swap hint for verleden-tijd items", () => {
      const item = makeItem({ grammaticalFunction: "persoonsvorm", tense: "verleden-tijd" });
      const hints = getVerbFunctionHints(item);
      expect(hints[0]).toContain("tegenwoordige tijd");
    });

    it("generates a singular→plural hint for singular subjects", () => {
      const item = makeItem({ grammaticalFunction: "persoonsvorm", subject: "ik" });
      const hints = getVerbFunctionHints(item);
      expect(hints[1]).toContain("meervoud");
    });

    it("generates a plural→singular hint for plural subjects", () => {
      const item = makeItem({ grammaticalFunction: "persoonsvorm", subject: "wij" });
      const hints = getVerbFunctionHints(item);
      expect(hints[1]).toContain("enkelvoud");
    });

    it("returns exactly 2 hints", () => {
      const item = makeItem({ grammaticalFunction: "persoonsvorm" });
      expect(getVerbFunctionHints(item)).toHaveLength(2);
    });
  });

  describe("voltooid-deelwoord items", () => {
    it("generates a hebben/zijn hint", () => {
      const item = makeItem({ grammaticalFunction: "voltooid-deelwoord" });
      const hints = getVerbFunctionHints(item);
      expect(hints[0]).toMatch(/hebben|zijn/);
    });

    it("does NOT generate persoonsvorm tense-swap hint", () => {
      const item = makeItem({ grammaticalFunction: "voltooid-deelwoord" });
      const hints = getVerbFunctionHints(item);
      expect(hints[0]).not.toContain("verleden tijd");
    });

    it("returns exactly 2 hints", () => {
      const item = makeItem({ grammaticalFunction: "voltooid-deelwoord" });
      expect(getVerbFunctionHints(item)).toHaveLength(2);
    });
  });

  describe("infinitief items", () => {
    it("generates a modal-verb hint", () => {
      const item = makeItem({ grammaticalFunction: "infinitief" });
      const hints = getVerbFunctionHints(item);
      expect(hints[0]).toMatch(/kunnen|willen|moeten|mogen/);
    });

    it("mentions the -en ending", () => {
      const item = makeItem({ grammaticalFunction: "infinitief" });
      const hints = getVerbFunctionHints(item);
      expect(hints[1]).toContain("-en");
    });
  });
});
