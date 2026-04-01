import type { ExerciseItem, GrammaticalFunction } from "@/lib/content";

export type ExerciseMode = "classificatie" | "homofonen" | "korte-correctie";

export type EvaluationResult = {
  correct: boolean;
  expected: string;
  mode: ExerciseMode;
};

export function getExerciseMode(item: ExerciseItem): ExerciseMode {
  if (item.diagnostic.primaryMisconception === "HOMOPHONE_FUNCTION_CONFUSION") {
    return "classificatie";
  }

  if (item.homophonePair) {
    return "homofonen";
  }

  return "korte-correctie";
}

export function getHomophoneOptions(item: ExerciseItem) {
  return item.homophonePair?.split("/").map((option) => option.trim()) ?? [];
}

export function getFunctionOptions(): GrammaticalFunction[] {
  return ["persoonsvorm", "infinitief", "voltooid-deelwoord"];
}

export function evaluateAnswer(item: ExerciseItem, answer: string): EvaluationResult {
  const mode = getExerciseMode(item);
  const normalized = answer.trim().toLowerCase();
  const expected = mode === "classificatie" ? item.grammaticalFunction : item.target;

  return {
    mode,
    expected,
    correct: normalized === expected.trim().toLowerCase()
  };
}
