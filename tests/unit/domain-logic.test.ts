import { describe, expect, it } from "vitest";
import { getUnit, getUnits, getMisconceptionLabel, isContrastPairItem } from "@/lib/content";
import type { ExerciseItem } from "@/lib/content";
import { evaluateAnswer, getExerciseMode, getClassifyOptions, getFunctionOptions } from "@/lib/evaluator";

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
    const item = getUnit("unit-01-pv-tt")!.items[0] as ExerciseItem;
    expect(evaluateAnswer(item, item.target).correct).toBe(true);
    expect(evaluateAnswer(item, "fout-antwoord").correct).toBe(false);
  });

  it("evaluateAnswer ondersteunt acceptedVariants en hoofdletter-normalisatie", () => {
    const baseItem = getUnit("unit-01-pv-tt")!.items[0] as ExerciseItem;
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
    const classItem = getUnit("unit-02-voltooid-deelwoord")!.items[0] as ExerciseItem;
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
    const classItem = getUnit("unit-02-voltooid-deelwoord")!.items[0] as ExerciseItem;
    const homophoneItem = getUnit("unit-01-pv-tt")!.items[0] as ExerciseItem;
    const shortItem = getUnit("unit-01-pv-tt")!.items
      .filter((item): item is ExerciseItem => !isContrastPairItem(item))
      .find((item) => item.homophonePair === null)!;

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
    const bedoelItem = unit01.items
      .filter((item): item is ExerciseItem => !isContrastPairItem(item))
      .find((item) => item.homophonePair === "bedoel/bedoelt");
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
    const exerciseItems01 = unit01.items.filter((item): item is ExerciseItem => !isContrastPairItem(item));
    const beloofItem = exerciseItems01.find((item) => item.homophonePair === "beloof/belooft");
    const vertrouwItem = exerciseItems01.find((item) => item.homophonePair === "vertrouw/vertrouwt");
    expect(beloofItem).toBeDefined();
    expect(vertrouwItem).toBeDefined();
    expect(getExerciseMode(beloofItem!)).toBe("homofonen");
    expect(getExerciseMode(vertrouwItem!)).toBe("homofonen");
  });

  it("detecteert classificatie-modus voor Tier-1 contrastparen belooft/beloofd en vertrouwt/vertrouwd in unit-02", () => {
    const unit02 = getUnit("unit-02-voltooid-deelwoord")!;
    const exerciseItems02 = unit02.items.filter((item): item is ExerciseItem => !isContrastPairItem(item));
    const belooftItem = exerciseItems02.find((item) => item.homophonePair === "belooft/beloofd");
    const vertrouwtItem = exerciseItems02.find((item) => item.homophonePair === "vertrouwt/vertrouwd");
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
    const exerciseItems = unit03.items.filter((item): item is ExerciseItem => !isContrastPairItem(item));
    for (const item of exerciseItems) {
      expect(getExerciseMode(item)).toBe("korte-correctie");
    }
  });

  // Unit 04 — Infinitief
  it("unit-04-infinitief bestaat en heeft items met grammaticalFunction infinitief", () => {
    const unit04 = getUnit("unit-04-infinitief");
    expect(unit04).toBeDefined();
    expect(unit04!.items.length).toBeGreaterThanOrEqual(20);
    const exerciseItems = unit04!.items.filter((item): item is ExerciseItem => !isContrastPairItem(item));
    for (const item of exerciseItems) {
      expect(item.grammaticalFunction).toBe("infinitief");
    }
  });

  it("INF_PV_CONFUSION geeft begrijpelijke learner-label terug", () => {
    const label = getMisconceptionLabel("INF_PV_CONFUSION");
    expect(label).not.toBe("Controleer eerst de grammaticale functie en pas dan de spellingregel toe.");
    expect(label.length).toBeGreaterThan(0);
  });

  it("INF_VD_CONFUSION geeft begrijpelijke learner-label terug", () => {
    const label = getMisconceptionLabel("INF_VD_CONFUSION");
    expect(label).not.toBe("Controleer eerst de grammaticale functie en pas dan de spellingregel toe.");
    expect(label.length).toBeGreaterThan(0);
  });

  it("unit-04 items renderen als korte-correctie modus", () => {
    const unit04 = getUnit("unit-04-infinitief")!;
    const exerciseItems = unit04.items.filter((item): item is ExerciseItem => !isContrastPairItem(item));
    for (const item of exerciseItems) {
      expect(getExerciseMode(item)).toBe("korte-correctie");
    }
  });

  // Unit 05 — Bijvoeglijk gebruikt VD + classify-modus
  it("unit-05-bijvoeglijk-vd bestaat en begint met classify-items", () => {
    const unit05 = getUnit("unit-05-bijvoeglijk-vd");
    expect(unit05).toBeDefined();
    expect(unit05!.items.length).toBeGreaterThanOrEqual(16);
    expect(unit05!.items[0].type).toBe("classify");
  });

  it("classify-items krijgen classificatie-modus via item.type", () => {
    const unit05 = getUnit("unit-05-bijvoeglijk-vd")!;
    const classifyItem = unit05.items.find((item) => item.type === "classify")! as ExerciseItem;
    expect(getExerciseMode(classifyItem)).toBe("classificatie");
  });

  it("evaluateAnswer gebruikt item.target als verwacht antwoord bij classify-items", () => {
    const unit05 = getUnit("unit-05-bijvoeglijk-vd")!;
    const classifyItem = unit05.items.find((item) => item.type === "classify")! as ExerciseItem;
    expect(evaluateAnswer(classifyItem, classifyItem.target).correct).toBe(true);
    expect(evaluateAnswer(classifyItem, "fout-antwoord").correct).toBe(false);
    // evaluateAnswer should NOT use grammaticalFunction for classify items
    const wrongAnswer = classifyItem.grammaticalFunction;
    if (wrongAnswer !== classifyItem.target) {
      expect(evaluateAnswer(classifyItem, wrongAnswer).correct).toBe(false);
    }
  });

  it("getClassifyOptions geeft classifyOptions terug voor classify-items", () => {
    const unit05 = getUnit("unit-05-bijvoeglijk-vd")!;
    const classifyItem = unit05.items.find((item) => item.type === "classify")! as ExerciseItem;
    const options = getClassifyOptions(classifyItem);
    expect(options).toEqual(classifyItem.classifyOptions);
    expect(options).toContain("werkwoordelijk");
    expect(options).toContain("bijvoeglijk");
  });

  it("getClassifyOptions geeft getFunctionOptions terug voor niet-classify-items", () => {
    const unit01 = getUnit("unit-01-pv-tt")!;
    const fillInItem = unit01.items.find((item) => item.type === "fill-in")! as ExerciseItem;
    const options = getClassifyOptions(fillInItem);
    expect(options).toEqual(getFunctionOptions());
  });

  it("VD_ADJ_FUNCTION_CONFUSION geeft begrijpelijke learner-label terug", () => {
    const label = getMisconceptionLabel("VD_ADJ_FUNCTION_CONFUSION");
    expect(label).not.toBe("Controleer eerst de grammaticale functie en pas dan de spellingregel toe.");
    expect(label.length).toBeGreaterThan(0);
  });

  // Unit 06 — Onvoltooid deelwoord
  it("unit-06-onvoltooid-deelwoord bestaat en heeft classify-items met drie opties", () => {
    const unit06 = getUnit("unit-06-onvoltooid-deelwoord");
    expect(unit06).toBeDefined();
    expect(unit06!.items.length).toBeGreaterThanOrEqual(16);
    const classifyItem = unit06!.items.find((item) => item.type === "classify") as ExerciseItem | undefined;
    expect(classifyItem).toBeDefined();
    expect(classifyItem!.classifyOptions?.length).toBe(3);
    expect(classifyItem!.classifyOptions).toContain("onvoltooid-deelwoord");
  });

  it("OVD_FUNCTION_CONFUSION geeft begrijpelijke learner-label terug", () => {
    const label = getMisconceptionLabel("OVD_FUNCTION_CONFUSION");
    expect(label).not.toBe("Controleer eerst de grammaticale functie en pas dan de spellingregel toe.");
    expect(label.length).toBeGreaterThan(0);
  });

  it("getUnits retourneert alle zes units", () => {
    const allUnits = getUnits();
    expect(allUnits.length).toBe(6);
    const ids = allUnits.map((u) => u.id);
    expect(ids).toContain("unit-04-infinitief");
    expect(ids).toContain("unit-05-bijvoeglijk-vd");
    expect(ids).toContain("unit-06-onvoltooid-deelwoord");
  });
});
