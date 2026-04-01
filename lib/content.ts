import taxonomy from "@/content/misconceptions/taxonomy.nl.json";
import unit01 from "@/content/units/unit-01-pv-tt.json";
import unit02 from "@/content/units/unit-02-voltooid-deelwoord.json";

export type GrammaticalFunction = string;

export type ExerciseItem = {
  id: string;
  type: string;
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

export type Unit = {
  id: string;
  title: string;
  level: string;
  language: string;
  learningGoals: string[];
  items: ExerciseItem[];
  transferTask: {
    id: string;
    type: string;
    prompt: string;
    rubric: string[];
  };
};

const units: Unit[] = [unit01, unit02];

export function getUnits() {
  return units;
}

export function getUnit(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}

export function getMisconceptionLabel(code: string) {
  const misconception = taxonomy.misconceptions.find((item) => item.code === code);
  return misconception?.learnerDescription ?? "Controleer eerst de grammaticale functie en pas dan de spellingregel toe.";
}
