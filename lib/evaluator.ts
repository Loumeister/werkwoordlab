import type { ExerciseItem, GrammaticalFunction } from "@/lib/content";

export type ExerciseMode = "classificatie" | "homofonen" | "korte-correctie";

export type EvaluationResult = {
  correct: boolean;
  expected: string;
  mode: ExerciseMode;
};

export function getExerciseMode(item: ExerciseItem): ExerciseMode {
  if (item.type === "classify") {
    return "classificatie";
  }

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

export function getClassifyOptions(item: ExerciseItem): string[] {
  if (item.type === "classify" && item.classifyOptions && item.classifyOptions.length > 0) {
    return item.classifyOptions;
  }
  return getFunctionOptions();
}

export function evaluateAnswer(item: ExerciseItem, answer: string): EvaluationResult {
  const mode = getExerciseMode(item);
  const expected =
    item.type === "classify" ? item.target :
    mode === "classificatie" ? item.grammaticalFunction :
    item.target;
  const acceptedVariants = item.diagnostic?.acceptedVariants ?? [];
  const normalizedExpectedValues = [expected, ...acceptedVariants]
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().toLowerCase());
  const normalized = answer.trim().toLowerCase();

  return {
    mode,
    expected,
    correct: normalizedExpectedValues.includes(normalized)
  };
}
