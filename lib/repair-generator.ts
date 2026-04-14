/**
 * Generates "repair exercise" variants of existing ExerciseItems.
 *
 * A repair exercise shows the learner a sentence with a wrong word form already
 * inserted. The learner must detect the error and provide the correction.
 * This mirrors real writing practice (proofreading) and is more active than
 * filling in a blank from scratch.
 *
 * Safety principle: we only generate repair items for misconception codes where
 * the generated wrong form is:
 *   1. Unambiguously wrong in the item's grammatical context
 *   2. A realistic student mistake (not an invented form that no student would write)
 *   3. Distinct from the target (generation cannot silently produce the correct form)
 *
 * Codes NOT on the whitelist return null — the item is skipped.
 * Prefer null over a mediocre repair item.
 */

import type { ExerciseItem } from "@/lib/content";
import type { MisconceptionCode } from "@/lib/feedback/misconceptions";
import type { AttemptRecord } from "@/lib/attempt-store";

// ─── Repair-safe whitelist ────────────────────────────────────────────────────

/**
 * Codes whose wrong-form generation is structurally reliable:
 * - PV_FALSE_T_ADD:           correct form has no -t → add -t (e.g. "vind" → "vindt")
 * - PV_STAM_T_OMISSION:       correct form has -t → remove -t (e.g. "vindt" → "vind")
 * - PV_JIJ_INVERSION_FALSE_T: same as FALSE_T_ADD but for jij-inversion context
 * - VD_KOFSCHIP_MISAPPLIED:   correct form ends in -d/-t → swap (e.g. "gewerkt"→"gewerkt"/"gespeeld"→"gespeelt")
 * - HOMOPHONE_FUNCTION_CONFUSION: use the other member of the homophone pair
 * - VT_DE_TE_CONFUSION:       correct form ends in -de/-te → swap (e.g. "werkte"→"werkde")
 */
const REPAIR_SAFE_CODES = new Set<MisconceptionCode>([
  "PV_FALSE_T_ADD",
  "PV_STAM_T_OMISSION",
  "PV_JIJ_INVERSION_FALSE_T",
  "VD_KOFSCHIP_MISAPPLIED",
  "HOMOPHONE_FUNCTION_CONFUSION",
  "VT_DE_TE_CONFUSION",
]);

// ─── Types ────────────────────────────────────────────────────────────────────

export type RepairItem = {
  originalItem: ExerciseItem;
  wrongForm: string;
  /** item.prompt with the blank (___+) replaced by wrongForm */
  promptWithError: string;
};

// ─── Wrong-form generator ─────────────────────────────────────────────────────

/**
 * Returns the plausible wrong form for an item, or null if the code is not
 * repair-safe or if generation cannot produce a distinct wrong form.
 */
export function generateWrongForm(item: ExerciseItem): string | null {
  const rawCode = item.diagnostic.primaryMisconception;
  if (!REPAIR_SAFE_CODES.has(rawCode as MisconceptionCode)) return null;

  const code = rawCode as MisconceptionCode;
  const target = item.target;

  switch (code) {
    case "PV_FALSE_T_ADD":
    case "PV_JIJ_INVERSION_FALSE_T":
      // The misconception is adding -t where it doesn't belong.
      // The repair wrong-form IS the typical student mistake: target + "t".
      return target + "t";

    case "PV_STAM_T_OMISSION":
      // The misconception is omitting required -t. Target has -t.
      if (!target.endsWith("t")) return null;
      return target.slice(0, -1);

    case "VD_KOFSCHIP_MISAPPLIED":
      // The misconception is applying the kofschip rule incorrectly.
      // Swap the final -d/-t of the past participle.
      if (target.endsWith("d")) return target.slice(0, -1) + "t";
      if (target.endsWith("t")) return target.slice(0, -1) + "d";
      return null;

    case "HOMOPHONE_FUNCTION_CONFUSION":
      // The misconception is choosing the wrong homophone.
      // Use the other member of the pair as the wrong form.
      if (!item.homophonePair) return null;
      const parts = item.homophonePair.split("/");
      if (parts.length !== 2) return null;
      const other = parts.find(
        (p) => p.trim().toLowerCase() !== target.trim().toLowerCase()
      );
      return other?.trim() ?? null;

    case "VT_DE_TE_CONFUSION":
      // The misconception is choosing the wrong weak-verb past-tense ending.
      // Swap -de/-te or -den/-ten.
      if (target.endsWith("den")) return target.slice(0, -3) + "ten";
      if (target.endsWith("ten")) return target.slice(0, -3) + "den";
      if (target.endsWith("de")) return target.slice(0, -2) + "te";
      if (target.endsWith("te")) return target.slice(0, -2) + "de";
      return null;

    default:
      return null;
  }
}

// ─── Blank detection ──────────────────────────────────────────────────────────

/** Matches three or more underscores — the convention for blanks in item prompts. */
const BLANK_PATTERN = /_{3,}/;

// ─── RepairItem builder ───────────────────────────────────────────────────────

/**
 * Builds a RepairItem from an ExerciseItem.
 *
 * Returns null if any of the following:
 * - The item's misconception is not on the repair-safe whitelist
 * - generateWrongForm returns null
 * - The prompt has no recognisable blank (___+) — required for safe substitution
 * - The generated wrong form equals the target (generation failed silently)
 */
export function buildRepairItem(item: ExerciseItem): RepairItem | null {
  if (!BLANK_PATTERN.test(item.prompt)) return null;

  const wrongForm = generateWrongForm(item);
  if (!wrongForm) return null;

  // Guard against silent identity: wrong form must differ from correct target.
  if (wrongForm.trim().toLowerCase() === item.target.trim().toLowerCase()) return null;

  const promptWithError = item.prompt.replace(BLANK_PATTERN, wrongForm);

  return { originalItem: item, wrongForm, promptWithError };
}

// ─── Adaptive use-repair decision ────────────────────────────────────────────

/**
 * Determines whether a repair exercise should be presented for this item.
 *
 * Rules (all must pass):
 * - Phase is not "verkennen" (explore phase uses fully scaffolded exercises only)
 * - lastWasRepair is false (no two repair items in a row)
 * - repairCount / phaseSize < 0.30 (frequency cap: ≤ 30% of phase)
 * - buildRepairItem(item) returns non-null (structural eligibility)
 *
 * Conditional rules:
 * - oefenen: repair is more likely when the learner has prior wrong attempts
 *   on this misconception pattern, or randomly ~25% of the time
 * - zelfstandig: repair is sparser (robustness check), ~15% of the time
 */
export function shouldUseRepair(
  item: ExerciseItem,
  phase: "verkennen" | "oefenen" | "zelfstandig",
  unitAttempts: AttemptRecord[],
  repairCountInPhase: number,
  phaseSize: number,
  lastWasRepair: boolean
): boolean {
  if (phase === "verkennen") return false;
  if (lastWasRepair) return false;
  if (repairCountInPhase / Math.max(phaseSize, 1) >= 0.30) return false;
  if (!buildRepairItem(item)) return false;

  const code = item.diagnostic.primaryMisconception;
  const priorWrong = unitAttempts.filter(
    (a) => a.misconception === code && !a.correct
  ).length;

  if (phase === "oefenen") {
    return priorWrong > 0 || Math.random() < 0.25;
  }

  if (phase === "zelfstandig") {
    return Math.random() < 0.15;
  }

  return false;
}
