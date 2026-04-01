import { describe, expect, it } from "vitest";
import { getUnit, getUnits, getMisconceptionLabel } from "@/lib/content";
import { evaluateAnswer, getExerciseMode } from "@/lib/evaluator";

describe("domain logic", () => {
  it("getUnit geeft strict de gevraagde unit terug", () => {
    const target = getUnit("unit-01-pv-tt");
    expect(target?.id).toBe("unit-01-pv-tt");
  });

  it("getUnit geeft undefined bij ongeldig unitId", () => {
    expect(getUnit("bestaat-niet")).toBeUndefined();
    expect(getUnit("")).toBeUndefined();
  });

  it("evaluateAnswer is correct voor target en incorrect voor fout antwoord", () => {
    const item = getUnit("unit-01-pv-tt")!.items[0];
    expect(evaluateAnswer(item, item.target).correct).toBe(true);
    expect(evaluateAnswer(item, "fout-antwoord").correct).toBe(false);
  });

  it("evaluateAnswer ondersteunt acceptedVariants en hoofdletter-normalisatie", () => {
    const baseItem = getUnit("unit-01-pv-tt")!.items[0];
    const variantItem = {
      ...baseItem,
      target: "word",
      diagnostic: {
        ...baseItem.diagnostic,
        acceptedVariants: ["WORDTJE", "worden?"]
      }
    };

    expect(evaluateAnswer(variantItem, " wordtje ").correct).toBe(true);
    expect(evaluateAnswer(variantItem, "WORD").correct).toBe(true);
    expect(evaluateAnswer(variantItem, "onjuist").correct).toBe(false);
  });

  it("detecteert oefenmodus deterministisch", () => {
    const units = getUnits();
    const classItem = getUnit("unit-02-voltooid-deelwoord")!.items[0];
    const homophoneItem = getUnit("unit-01-pv-tt")!.items[0];
    const shortItem = getUnit("unit-01-pv-tt")!.items.find((item) => item.homophonePair === null)!;

    expect(units.length).toBeGreaterThan(0);
    expect(getExerciseMode(classItem)).toBe("classificatie");
    expect(getExerciseMode(homophoneItem)).toBe("homofonen");
    expect(getExerciseMode(shortItem)).toBe("korte-correctie");
  });

  it("misconception mapping valt veilig terug bij onbekende code", () => {
    const fallback = getMisconceptionLabel("ONBEKENDE_CODE");
    expect(fallback).toContain("grammaticale functie");
  });
});
  });
});
