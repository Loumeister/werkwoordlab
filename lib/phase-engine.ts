import type { AnyItem, ExerciseItem, PhaseId } from "@/lib/content";
import type { AttemptRecord } from "@/lib/attempt-store";

// ---------------------------------------------------------------------------
// Phase configuration
// ---------------------------------------------------------------------------

export type PhaseConfig = {
  label: string;
  description: string;
};

export const PHASE_CONFIGS: Record<PhaseId, PhaseConfig> = {
  verkennen: {
    label: "Verkennen",
    description: "Leer hoe het werkt — stap voor stap.",
  },
  oefenen: {
    label: "Oefenen",
    description: "Oefen met hulp. Je komt er!",
  },
  zelfstandig: {
    label: "Zelfstandig",
    description: "Jij redt het zelf. Bewijs het!",
  },
  transfer: {
    label: "Transfer",
    description: "Laat zien dat je het echt begrijpt.",
  },
};

// ---------------------------------------------------------------------------
// Phase assignment
// ---------------------------------------------------------------------------

/**
 * Returns the phase for an item. If the item has an explicit `phase` field
 * that field is used. Otherwise a heuristic is applied: first ~25% of items
 * are "verkennen", next ~25% (up to 50%) are "oefenen", the rest are
 * "zelfstandig".
 */
export function resolveItemPhase(item: AnyItem, index: number, total: number): PhaseId {
  if ("phase" in item && item.phase) {
    return item.phase;
  }

  const boundary1 = Math.ceil(total * 0.25);
  const boundary2 = Math.ceil(total * 0.5);

  if (index < boundary1) return "verkennen";
  if (index < boundary2) return "oefenen";
  return "zelfstandig";
}

export type PhaseGroups = {
  verkennen: number[];
  oefenen: number[];
  zelfstandig: number[];
};

/**
 * Groups item indices by phase. Transfer items are excluded (they are handled
 * separately as the unit's `transferTask`).
 */
export function groupItemsByPhase(items: AnyItem[]): PhaseGroups {
  const groups: PhaseGroups = { verkennen: [], oefenen: [], zelfstandig: [] };

  items.forEach((item, i) => {
    const phase = resolveItemPhase(item, i, items.length);
    if (phase !== "transfer") {
      groups[phase].push(i);
    }
  });

  return groups;
}

// ---------------------------------------------------------------------------
// Sub-skill mastery tracking
// ---------------------------------------------------------------------------

/**
 * Reserved internal code saved to attempt records when a learner answers the
 * function-classification step. Not a taxonomy misconception code.
 */
export const FUNCTION_STEP_CODE = "__function__" as const;

/**
 * Returns true when the learner has demonstrated enough function-identification
 * mastery to skip Stage A (the classify-function step).
 *
 * Mastery criterion: ≥ 2 correct attempts where `misconception === "__function__"`.
 * Correct spelling attempts for any other code do NOT count here.
 */
export function hasFunctionMastery(allAttempts: AttemptRecord[]): boolean {
  const correct = allAttempts.filter(
    (a) => a.misconception === FUNCTION_STEP_CODE && a.correct
  );
  return correct.length >= 2;
}

/**
 * Returns true when the learner has demonstrated enough mastery for the given
 * spelling-pattern misconception to receive reduced scaffold support.
 *
 * Mastery criterion: ≥ 2 correct spelling attempts for `misconceptionCode`.
 * Function-step attempts (`"__function__"`) are not counted here.
 */
export function hasPatternMastery(
  misconceptionCode: string,
  allAttempts: AttemptRecord[]
): boolean {
  const correct = allAttempts.filter(
    (a) => a.misconception === misconceptionCode && a.correct
  );
  return correct.length >= 2;
}

// ---------------------------------------------------------------------------
// Entry mode
// ---------------------------------------------------------------------------

export type EntryMode = "full" | "spell-first" | "independent";

/**
 * Determines how a learner enters an exercise item based on demonstrated
 * sub-skill mastery. The function and spelling tracks are fully independent:
 * skipping Stage A does NOT advance the learner into the middle of the
 * spelling hint ladder.
 *
 * "full"        → no mastery yet; show function step first, then spelling
 * "spell-first" → function mastered; skip to spelling (hints start from step 1)
 * "independent" → both mastered; exercise only, hints on demand
 */
export function getEntryMode(item: ExerciseItem, allAttempts: AttemptRecord[]): EntryMode {
  const funcMastery = hasFunctionMastery(allAttempts);
  const patternMastery = hasPatternMastery(
    item.diagnostic.primaryMisconception,
    allAttempts
  );

  if (funcMastery && patternMastery) return "independent";
  if (funcMastery) return "spell-first";
  return "full";
}

// ---------------------------------------------------------------------------
// Verb function discovery hints
// ---------------------------------------------------------------------------

const PLURAL_SUBJECTS = new Set(["wij", "we", "jullie", "zij", "ze"]);

function isPlural(subject: string): boolean {
  return PLURAL_SUBJECTS.has(subject.toLowerCase());
}

/**
 * Generates procedural hints for identifying the grammatical function of a
 * verb. Dispatches on `item.grammaticalFunction` so each verb function gets
 * its own identification technique — not persoonsvorm tricks for VD items.
 *
 * persoonsvorm:
 *   - Tijdsverandering: change tense → the word that changes is the PV
 *   - Getalsverandering: change subject number → the word that changes is the PV
 *
 * voltooid-deelwoord:
 *   - Look for hulpwerkwoord (hebben/zijn); the word after it is the VD
 *   - The VD does not change when subject number changes
 *
 * infinitief:
 *   - Look for a modal verb (kunnen/willen/moeten/mogen/zullen/hoeven)
 *   - The infinitive usually appears at the end of the clause
 */
export function getVerbFunctionHints(item: ExerciseItem): string[] {
  const fn = item.grammaticalFunction;

  if (fn === "voltooid-deelwoord") {
    return [
      "Zoek een vorm van 'hebben' of 'zijn' in de zin. Het werkwoord dat daarna staat is het voltooid deelwoord.",
      "Verander het onderwerp van enkelvoud naar meervoud. Een voltooid deelwoord verandert dan niet mee — een persoonsvorm wél.",
    ];
  }

  if (fn === "infinitief") {
    return [
      "Zoek een modaal werkwoord in de zin, zoals 'kunnen', 'willen', 'moeten' of 'mogen'. Het werkwoord dat daarna staat is de infinitief.",
      "De infinitief staat vaak aan het einde van de zin en eindigt op -en.",
    ];
  }

  // Default: persoonsvorm (covers "persoonsvorm" and any unknown function)
  const tenseHint =
    item.tense === "tegenwoordige-tijd"
      ? "Zet de zin in de verleden tijd. Welk woord verandert? Dat is de persoonsvorm."
      : "Zet de zin in de tegenwoordige tijd. Welk woord verandert? Dat is de persoonsvorm.";

  const numberHint = isPlural(item.subject)
    ? "Maak het onderwerp enkelvoud (hij). Welk woord verandert? Dat is de persoonsvorm."
    : "Maak het onderwerp meervoud (wij). Welk woord verandert? Dat is de persoonsvorm.";

  return [tenseHint, numberHint];
}
