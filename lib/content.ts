import taxonomy from "@/content/misconceptions/taxonomy.nl.json";
import unit01 from "@/content/units/unit-01-pv-tt.json";
import unit02 from "@/content/units/unit-02-voltooid-deelwoord.json";
import unit03 from "@/content/units/unit-03-pv-vt.json";

export type GrammaticalFunction = string;

export type PhaseId = "verkennen" | "oefenen" | "zelfstandig" | "transfer";

export type ExerciseItem = {
  id: string;
  type: string;
  phase?: PhaseId;
  prompt: string;
  context: string;
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

export function getMisconceptionLabel(code: string) {
  const misconception = taxonomy.misconceptions.find((item) => item.code === code);
  return misconception?.learnerDescription ?? "Controleer eerst de grammaticale functie en pas dan de spellingregel toe.";
}
