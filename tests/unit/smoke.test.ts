import { describe, expect, it } from "vitest";
import { getUnit } from "@/lib/content";
import type { ExerciseItem } from "@/lib/content";
import { evaluateAnswer, getExerciseMode } from "@/lib/evaluator";

describe("learner flow smoke", () => {
  it("behoudt didactische volgorde met geldige items", () => {
    const unit = getUnit("unit-01-pv-tt")!;
    const item = unit.items[0] as ExerciseItem;
    expect(unit.items.length).toBeGreaterThanOrEqual(8);
    expect(item.scaffold.step1).toBeTruthy();
  });

  it("evalueert deterministisch", () => {
    const item = getUnit("unit-01-pv-tt")!.items[0] as ExerciseItem;
    const first = evaluateAnswer(item, item.target);
    const second = evaluateAnswer(item, item.target);
    expect(first).toEqual(second);
    expect(first.correct).toBe(true);
  });

  it("ondersteunt meerdere oefenmodi", () => {
    const pvItem = getUnit("unit-01-pv-tt")!.items[0] as ExerciseItem;
    const functionItem = getUnit("unit-02-voltooid-deelwoord")!.items[0] as ExerciseItem;
    expect(getExerciseMode(pvItem)).toBe("homofonen");
    expect(getExerciseMode(functionItem)).toBe("classificatie");
  });
});
