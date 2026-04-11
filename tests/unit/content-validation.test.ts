import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import taxonomy from "@/content/misconceptions/taxonomy.nl.json";
import { getUnits, isContrastPairItem } from "@/lib/content";

function getUnitJsonPaths() {
  const dir = path.join(process.cwd(), "content", "units");
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.join(dir, name));
}

describe("content contracts", () => {
  it("heeft valide JSON-bestanden", () => {
    const files = [path.join(process.cwd(), "content", "misconceptions", "taxonomy.nl.json"), ...getUnitJsonPaths()];

    for (const filePath of files) {
      const raw = fs.readFileSync(filePath, "utf-8");
      expect(() => JSON.parse(raw)).not.toThrow();
    }
  });

  it("heeft unieke unit- en item-id's", () => {
    const units = getUnits();
    const unitIds = units.map((unit) => unit.id);
    expect(new Set(unitIds).size).toBe(unitIds.length);

    const itemIds = units.flatMap((unit) => unit.items.map((item) => item.id));
    expect(new Set(itemIds).size).toBe(itemIds.length);
  });

  it("heeft geldige taxonomy-referenties", () => {
    const validCodes = new Set(taxonomy.misconceptions.map((misconception) => misconception.code));

    for (const unit of getUnits()) {
      for (const item of unit.items) {
        if (isContrastPairItem(item)) {
          expect(validCodes.has(item.sentenceA.diagnostic.primaryMisconception)).toBe(true);
          expect(validCodes.has(item.sentenceB.diagnostic.primaryMisconception)).toBe(true);
        } else {
          expect(validCodes.has(item.diagnostic.primaryMisconception)).toBe(true);
        }
      }
    }
  });

  it("heeft verplichte velden per item en transfer task", () => {
    for (const unit of getUnits()) {
      expect(unit.transferTask).toBeDefined();
      expect(unit.transferTask.id).toBeTruthy();
      expect(unit.transferTask.type).toBeTruthy();
      expect(unit.transferTask.prompt).toBeTruthy();
      expect(unit.transferTask.rubric.length).toBeGreaterThan(0);

      for (const item of unit.items) {
        expect(item.id).toBeTruthy();
        if (isContrastPairItem(item)) {
          expect(item.contrastLabel).toBeTruthy();
          expect(item.sentenceA.prompt).toBeTruthy();
          expect(item.sentenceA.target).toBeTruthy();
          expect(item.sentenceA.feedback.hint).toBeTruthy();
          expect(item.sentenceA.diagnostic.primaryMisconception).toBeTruthy();
          expect(item.sentenceB.prompt).toBeTruthy();
          expect(item.sentenceB.target).toBeTruthy();
          expect(item.sentenceB.feedback.hint).toBeTruthy();
          expect(item.sentenceB.diagnostic.primaryMisconception).toBeTruthy();
        } else {
          expect(item.prompt).toBeTruthy();
          expect(item.lemma).toBeTruthy();
          expect(item.grammaticalFunction).toBeTruthy();
          expect(item.target).toBeTruthy();
          expect(item.feedback.hint).toBeTruthy();
          expect(item.diagnostic.primaryMisconception).toBeTruthy();
        }
      }
    }
  });

  it("heeft valide acceptedVariants", () => {
    for (const unit of getUnits()) {
      for (const item of unit.items) {
        if (isContrastPairItem(item)) {
          for (const sentence of [item.sentenceA, item.sentenceB]) {
            const variants = sentence.diagnostic.acceptedVariants;
            expect(Array.isArray(variants)).toBe(true);

            const normalizedTarget = sentence.target.trim().toLowerCase();
            const normalizedVariants = variants.map((variant) => variant.trim().toLowerCase());
            const uniqueVariants = new Set(normalizedVariants);

            expect(normalizedVariants.length).toBe(uniqueVariants.size);
            expect(normalizedVariants).not.toContain(normalizedTarget);
            expect(normalizedVariants.every((variant) => variant.length > 0)).toBe(true);
          }
        } else {
          const variants = item.diagnostic.acceptedVariants;
          expect(Array.isArray(variants)).toBe(true);

          const normalizedTarget = item.target.trim().toLowerCase();
          const normalizedVariants = variants.map((variant) => variant.trim().toLowerCase());
          const uniqueVariants = new Set(normalizedVariants);

          expect(normalizedVariants.length).toBe(uniqueVariants.size);
          expect(normalizedVariants).not.toContain(normalizedTarget);
          expect(normalizedVariants.every((variant) => variant.length > 0)).toBe(true);
        }
      }
    }
  });
});
