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

  it("evaluateAnswer ondersteunt acceptedVariants voor classificatie-modus", () => {
    const classItem = getUnit("unit-02-voltooid-deelwoord")!.items[0];
    const variantItem = {
      ...classItem,
      diagnostic: {
        ...classItem.diagnostic,
        acceptedVariants: ["Voltooid-Deelwoord"]
      }
    };

    expect(evaluateAnswer(variantItem, " voltooid-deelwoord ").correct).toBe(true);
    expect(evaluateAnswer(variantItem, "infinitief").correct).toBe(false);
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

  it("detecteert homofoon-modus voor het nieuwe paar bedoel/bedoelt", () => {
    const unit01 = getUnit("unit-01-pv-tt")!;
    const bedoelItem = unit01.items.find((item) => item.homophonePair === "bedoel/bedoelt");
    expect(bedoelItem).toBeDefined();
    expect(getExerciseMode(bedoelItem!)).toBe("homofonen");
  });

  it("PV_MEERVOUD_T_ADDITION geeft een begrijpelijke learner-label terug", () => {
    const label = getMisconceptionLabel("PV_MEERVOUD_T_ADDITION");
    expect(label).not.toBe("Controleer eerst de grammaticale functie en pas dan de spellingregel toe.");
    expect(label.length).toBeGreaterThan(0);
  });

  it("detecteert homofoon-modus voor Tier-1-paren beloof/belooft en vertrouw/vertrouwt", () => {
    const unit01 = getUnit("unit-01-pv-tt")!;
    const beloofItem = unit01.items.find((item) => item.homophonePair === "beloof/belooft");
    const vertrouwItem = unit01.items.find((item) => item.homophonePair === "vertrouw/vertrouwt");
    expect(beloofItem).toBeDefined();
    expect(vertrouwItem).toBeDefined();
    expect(getExerciseMode(beloofItem!)).toBe("homofonen");
    expect(getExerciseMode(vertrouwItem!)).toBe("homofonen");
  });

  it("detecteert classificatie-modus voor Tier-1 contrastparen belooft/beloofd en vertrouwt/vertrouwd in unit-02", () => {
    const unit02 = getUnit("unit-02-voltooid-deelwoord")!;
    const belooftItem = unit02.items.find((item) => item.homophonePair === "belooft/beloofd");
    const vertrouwtItem = unit02.items.find((item) => item.homophonePair === "vertrouwt/vertrouwd");
    expect(belooftItem).toBeDefined();
    expect(vertrouwtItem).toBeDefined();
    expect(getExerciseMode(belooftItem!)).toBe("classificatie");
    expect(getExerciseMode(vertrouwtItem!)).toBe("classificatie");
  });

  it("getUnit geeft unit-03-pv-vt terug", () => {
    const unit03 = getUnit("unit-03-pv-vt");
    expect(unit03?.id).toBe("unit-03-pv-vt");
    expect(unit03?.items.length).toBeGreaterThanOrEqual(20);
  });

  it("VT_DE_TE_CONFUSION geeft begrijpelijke learner-label terug", () => {
    const label = getMisconceptionLabel("VT_DE_TE_CONFUSION");
    expect(label).not.toBe("Controleer eerst de grammaticale functie en pas dan de spellingregel toe.");
    expect(label.length).toBeGreaterThan(0);
  });

  it("VT_RUWE_STAM_OVERRIDE geeft begrijpelijke learner-label terug", () => {
    const label = getMisconceptionLabel("VT_RUWE_STAM_OVERRIDE");
    expect(label).not.toBe("Controleer eerst de grammaticale functie en pas dan de spellingregel toe.");
    expect(label.length).toBeGreaterThan(0);
  });

  it("unit-03 items renderen als korte-correctie modus (geen homofoon/classificatie)", () => {
    const unit03 = getUnit("unit-03-pv-vt")!;
    for (const item of unit03.items) {
      expect(getExerciseMode(item)).toBe("korte-correctie");
    }
  });
});
