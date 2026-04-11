import taxonomy from "@/content/misconceptions/taxonomy.nl.json";
import unit01 from "@/content/units/unit-01-pv-tt.json";
import unit02 from "@/content/units/unit-02-voltooid-deelwoord.json";
import unit03 from "@/content/units/unit-03-pv-vt.json";

/**
 * Grammatical function of the target verb in an exercise item.
 * Valid values used in content and evaluator: "persoonsvorm" | "infinitief" | "voltooid-deelwoord".
 * Typed as string (not a union) so future unit authors can extend without a code change.
 */
export type GrammaticalFunction = string;

/** The four learning phases a unit progresses through. */
export type PhaseId = "verkennen" | "oefenen" | "zelfstandig" | "transfer";

export type ExerciseItem = {
  id: string;
  type: string;
  /** Explicit phase assignment. When omitted, resolveItemPhase() derives a phase from item position. */
  phase?: PhaseId;
  prompt: string;
  context: string;
  lemma: string;
  grammaticalFunction: GrammaticalFunction;
  tense: string;
  subject: string;
  /** The correct word form the learner must produce. */
  target: string;
  /**
   * Pair of homophones separated by "/", e.g. "vind/vindt" or "belooft/beloofd".
   * Determines exercise mode: null → fill-in (korte-correctie), set → radio choice (homofonen).
   * Items with misconception HOMOPHONE_FUNCTION_CONFUSION also have this set.
   */
  homophonePair: string | null;
  /**
   * Three-step scaffold ladder shown progressively via HintDisclosure:
   *   step1 — function discovery (identify which grammatical function the verb has)
   *   step2 — subject/stem analysis (determine the stem or subject person/number)
   *   step3 — spelling rule application (apply the relevant spelling rule)
   *
   * In MasteryExercise, step1 is replaced by getVerbFunctionHints() so the
   * function discovery step is interactive rather than passive text. step2 and
   * step3 are shown as hints in the spelling step.
   */
  scaffold: {
    step1: string;
    step2: string;
    step3: string;
  };
  diagnostic: {
    /**
     * Code from the 11-entry taxonomy (content/misconceptions/taxonomy.nl.json).
     * Used to look up BUILT_IN_FEEDBACK and to track which misconception the
     * learner is training on. Also used as the `misconception` field in AttemptRecord.
     */
    primaryMisconception: string;
    /**
     * Alternative correct forms beyond `target`, e.g. informal variants.
     * Must not duplicate `target`. Evaluated case-insensitively, trim-normalised.
     */
    acceptedVariants: string[];
  };
  feedback: {
    correct: string;
    hint: string;
  };
};

type ContrastSentence = {
  prompt: string;
  lemma: string;
  grammaticalFunction: GrammaticalFunction;
  tense: string;
  subject: string;
  target: string;
  homophonePair: string | null;
  scaffold: {
    step1: string;
    step2: string;
    step3: string;
  };
  diagnostic: {
    primaryMisconception: string;
    acceptedVariants: string[];
  };
  feedback: {
    correct: string;
    hint: string;
  };
};

export type ContrastPairItem = {
  id: string;
  type: "contrast-pair";
  phase: PhaseId;
  contrastLabel: string;
  sentenceA: ContrastSentence;
  sentenceB: ContrastSentence;
};

export type AnyItem = ExerciseItem | ContrastPairItem;

/** Type guard — use this before accessing ContrastPairItem-specific fields. */
export function isContrastPairItem(item: AnyItem): item is ContrastPairItem {
  return item.type === "contrast-pair";
}

export type Unit = {
  id: string;
  title: string;
  level: string;
  language: string;
  learningGoals: string[];
  items: AnyItem[];
  transferTask: {
    id: string;
    type: string;
    prompt: string;
    rubric: string[];
  };
};

const units: Unit[] = [unit01 as unknown as Unit, unit02 as unknown as Unit, unit03 as unknown as Unit];

export function getUnits() {
  return units;
}

export function getUnit(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}

export function getUnitOrDefault(unitId: string): Unit {
  return getUnit(unitId) ?? units[0];
}

/**
 * Returns the learner-facing description for a misconception code.
 * Falls back to a generic spelling-rule reminder when the code is not in the taxonomy
 * (e.g. FUNCTION_STEP_CODE = "__function__", which is internal and not in the taxonomy).
 */
export function getMisconceptionLabel(code: string) {
  const misconception = taxonomy.misconceptions.find((item) => item.code === code);
  return misconception?.learnerDescription ?? "Controleer eerst de grammaticale functie en pas dan de spellingregel toe.";
}
