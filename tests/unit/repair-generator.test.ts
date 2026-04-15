import { describe, expect, it } from "vitest";
import type { ExerciseItem } from "@/lib/content";
import type { AttemptRecord } from "@/lib/attempt-store";
import {
  generateWrongForm,
  buildRepairItem,
  shouldUseRepair,
} from "@/lib/repair-generator";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// generateWrongForm
// ---------------------------------------------------------------------------

describe("generateWrongForm", () => {
  it("appends -t for PV_FALSE_T_ADD", () => {
    const item = makeItem({ target: "vind", diagnostic: { primaryMisconception: "PV_FALSE_T_ADD", acceptedVariants: [] } });
    expect(generateWrongForm(item)).toBe("vindt");
  });

  it("removes -t for PV_STAM_T_OMISSION", () => {
    const item = makeItem({ target: "vindt", diagnostic: { primaryMisconception: "PV_STAM_T_OMISSION", acceptedVariants: [] } });
    expect(generateWrongForm(item)).toBe("vind");
  });

  it("returns null for PV_STAM_T_OMISSION when target does not end in -t", () => {
    const item = makeItem({ target: "loop", diagnostic: { primaryMisconception: "PV_STAM_T_OMISSION", acceptedVariants: [] } });
    expect(generateWrongForm(item)).toBeNull();
  });

  it("swaps -d to -t for VD_KOFSCHIP_MISAPPLIED", () => {
    const item = makeItem({ target: "gespeeld", diagnostic: { primaryMisconception: "VD_KOFSCHIP_MISAPPLIED", acceptedVariants: [] } });
    expect(generateWrongForm(item)).toBe("gespeelt");
  });

  it("swaps -t to -d for VD_KOFSCHIP_MISAPPLIED", () => {
    const item = makeItem({ target: "gewerkt", diagnostic: { primaryMisconception: "VD_KOFSCHIP_MISAPPLIED", acceptedVariants: [] } });
    expect(generateWrongForm(item)).toBe("gewerkd");
  });

  it("swaps homophone pair for HOMOPHONE_FUNCTION_CONFUSION", () => {
    const item = makeItem({
      target: "word",
      homophonePair: "word/wordt",
      diagnostic: { primaryMisconception: "HOMOPHONE_FUNCTION_CONFUSION", acceptedVariants: [] },
    });
    expect(generateWrongForm(item)).toBe("wordt");
  });

  it("returns null for HOMOPHONE_FUNCTION_CONFUSION without homophonePair", () => {
    const item = makeItem({
      target: "word",
      homophonePair: undefined,
      diagnostic: { primaryMisconception: "HOMOPHONE_FUNCTION_CONFUSION", acceptedVariants: [] },
    });
    expect(generateWrongForm(item)).toBeNull();
  });

  it("swaps -de/-te for VT_DE_TE_CONFUSION", () => {
    const item = makeItem({ target: "werkte", diagnostic: { primaryMisconception: "VT_DE_TE_CONFUSION", acceptedVariants: [] } });
    expect(generateWrongForm(item)).toBe("werkde");
  });

  it("swaps -den/-ten for VT_DE_TE_CONFUSION", () => {
    const item = makeItem({ target: "werkten", diagnostic: { primaryMisconception: "VT_DE_TE_CONFUSION", acceptedVariants: [] } });
    expect(generateWrongForm(item)).toBe("werkden");
  });

  it("returns null for non-whitelisted codes", () => {
    const item = makeItem({ diagnostic: { primaryMisconception: "PV_INF_INSTEAD_OF_PV", acceptedVariants: [] } });
    expect(generateWrongForm(item)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// buildRepairItem
// ---------------------------------------------------------------------------

describe("buildRepairItem", () => {
  it("builds a RepairItem for a valid item with a blank", () => {
    const item = makeItem({
      target: "vind",
      prompt: "Ik ___ het antwoord.",
      diagnostic: { primaryMisconception: "PV_FALSE_T_ADD", acceptedVariants: [] },
    });
    const result = buildRepairItem(item);
    expect(result).not.toBeNull();
    expect(result!.wrongForm).toBe("vindt");
    expect(result!.promptWithError).toBe("Ik vindt het antwoord.");
  });

  it("returns null when prompt has no blank", () => {
    const item = makeItem({
      prompt: "Ik vind het antwoord.",
      diagnostic: { primaryMisconception: "PV_FALSE_T_ADD", acceptedVariants: [] },
    });
    expect(buildRepairItem(item)).toBeNull();
  });

  it("returns null for non-whitelisted misconception codes", () => {
    const item = makeItem({
      prompt: "Ik ___ het antwoord.",
      diagnostic: { primaryMisconception: "PV_INF_INSTEAD_OF_PV", acceptedVariants: [] },
    });
    expect(buildRepairItem(item)).toBeNull();
  });

  it("returns null when wrongForm equals target", () => {
    // Edge case: PV_STAM_T_OMISSION on a target that doesn't end in -t
    // → generateWrongForm returns null → buildRepairItem returns null
    const item = makeItem({
      target: "loop",
      prompt: "Hij ___ hard.",
      diagnostic: { primaryMisconception: "PV_STAM_T_OMISSION", acceptedVariants: [] },
    });
    expect(buildRepairItem(item)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// shouldUseRepair
// ---------------------------------------------------------------------------

describe("shouldUseRepair", () => {
  const item = makeItem({
    target: "vind",
    prompt: "Ik ___ het antwoord.",
    diagnostic: { primaryMisconception: "PV_FALSE_T_ADD", acceptedVariants: [] },
  });

  it("returns false in verkennen phase", () => {
    expect(shouldUseRepair(item, "verkennen", [], 0, 10, false)).toBe(false);
  });

  it("returns false when lastWasRepair is true", () => {
    const attempts = [makeAttempt({ correct: false })];
    expect(shouldUseRepair(item, "oefenen", attempts, 0, 10, true)).toBe(false);
  });

  it("returns false when frequency cap (30%) is reached", () => {
    const attempts = [makeAttempt({ correct: false })];
    expect(shouldUseRepair(item, "oefenen", attempts, 3, 10, false)).toBe(false);
  });

  it("returns true in oefenen when prior wrong attempts exist", () => {
    const attempts = [makeAttempt({ correct: false, misconception: "PV_FALSE_T_ADD" })];
    expect(shouldUseRepair(item, "oefenen", attempts, 0, 10, false)).toBe(true);
  });

  it("returns false in oefenen when no prior wrong attempts exist", () => {
    expect(shouldUseRepair(item, "oefenen", [], 0, 10, false)).toBe(false);
  });

  it("returns true in zelfstandig when pattern mastery is demonstrated (≥2 correct)", () => {
    const attempts = [
      makeAttempt({ correct: true, misconception: "PV_FALSE_T_ADD" }),
      makeAttempt({ correct: true, misconception: "PV_FALSE_T_ADD" }),
    ];
    expect(shouldUseRepair(item, "zelfstandig", attempts, 0, 10, false)).toBe(true);
  });

  it("returns false in zelfstandig when pattern mastery is not yet demonstrated", () => {
    const attempts = [makeAttempt({ correct: true, misconception: "PV_FALSE_T_ADD" })];
    expect(shouldUseRepair(item, "zelfstandig", attempts, 0, 10, false)).toBe(false);
  });

  it("excludes :function and :repair attempts from mastery/error counting", () => {
    const attempts = [
      makeAttempt({ itemId: "u1-i1:function", correct: false, misconception: "PV_FALSE_T_ADD" }),
      makeAttempt({ itemId: "u1-i1:repair", correct: false, misconception: "PV_FALSE_T_ADD" }),
    ];
    // Neither counts as priorWrong for oefenen
    expect(shouldUseRepair(item, "oefenen", attempts, 0, 10, false)).toBe(false);
  });
});
