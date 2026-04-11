import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import taxonomy from '@/content/misconceptions/taxonomy.nl.json';
import unit01 from '@/content/units/unit-01-pv-tt.json';
import unit02 from '@/content/units/unit-02-voltooid-deelwoord.json';
import unit03 from '@/content/units/unit-03-pv-vt.json';
import { BUILT_IN_FEEDBACK } from '@/lib/feedback/builtInFeedback';
import type { AnyItem } from '@/lib/content';
import { isContrastPairItem } from '@/lib/content';

type UnitLike = typeof unit01;

const units: UnitLike[] = [unit01, unit02, unit03];

function getJsonFiles(dirPath: string): string[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(dirPath, entry.name));
}

describe('content contracts', () => {
  it('all content JSON files parse as valid JSON', () => {
    const contentRoot = path.join(process.cwd(), 'content');
    const files = [
      ...getJsonFiles(path.join(contentRoot, 'misconceptions')),
      ...getJsonFiles(path.join(contentRoot, 'units')),
    ];

    expect(files.length).toBeGreaterThan(0);

    for (const filePath of files) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      expect(() => JSON.parse(raw)).not.toThrow();
    }
  });

  it('unit and item ids are unique and required fields exist', () => {
    const unitIds = new Set<string>();
    const itemIds = new Set<string>();

    for (const unit of units) {
      expect(unit.id).toBeTruthy();
      expect(unit.title).toBeTruthy();
      expect(unit.language).toBe('nl');
      expect(unit.learningGoals.length).toBeGreaterThan(0);
      expect(unit.items.length).toBeGreaterThanOrEqual(8);

      expect(unitIds.has(unit.id)).toBe(false);
      unitIds.add(unit.id);

      for (const item of unit.items as AnyItem[]) {
        expect(item.id).toBeTruthy();

        expect(itemIds.has(item.id)).toBe(false);
        itemIds.add(item.id);

        if (isContrastPairItem(item)) {
          // Contrast-pair top-level required fields
          expect(item.contrastLabel).toBeTruthy();
          expect(item.phase).toBeTruthy();

          // Sentence A — all ContrastSentence fields
          expect(item.sentenceA.prompt).toBeTruthy();
          expect(item.sentenceA.lemma).toBeTruthy();
          expect(item.sentenceA.grammaticalFunction).toBeTruthy();
          expect(item.sentenceA.target).toBeTruthy();
          expect(item.sentenceA.scaffold.step1).toBeTruthy();
          expect(item.sentenceA.scaffold.step2).toBeTruthy();
          expect(item.sentenceA.scaffold.step3).toBeTruthy();
          expect(item.sentenceA.feedback.correct).toBeTruthy();
          expect(item.sentenceA.feedback.hint).toBeTruthy();
          expect(item.sentenceA.diagnostic.primaryMisconception).toBeTruthy();
          expect(Array.isArray(item.sentenceA.diagnostic.acceptedVariants)).toBe(true);

          // Sentence B — all ContrastSentence fields
          expect(item.sentenceB.prompt).toBeTruthy();
          expect(item.sentenceB.lemma).toBeTruthy();
          expect(item.sentenceB.grammaticalFunction).toBeTruthy();
          expect(item.sentenceB.target).toBeTruthy();
          expect(item.sentenceB.scaffold.step1).toBeTruthy();
          expect(item.sentenceB.scaffold.step2).toBeTruthy();
          expect(item.sentenceB.scaffold.step3).toBeTruthy();
          expect(item.sentenceB.feedback.correct).toBeTruthy();
          expect(item.sentenceB.feedback.hint).toBeTruthy();
          expect(item.sentenceB.diagnostic.primaryMisconception).toBeTruthy();
          expect(Array.isArray(item.sentenceB.diagnostic.acceptedVariants)).toBe(true);
        } else {
          // Regular ExerciseItem required fields
          expect(item.prompt).toBeTruthy();
          expect(item.lemma).toBeTruthy();
          expect(item.grammaticalFunction).toBeTruthy();
          expect(item.target).toBeTruthy();
          expect(item.scaffold.step1).toBeTruthy();
          expect(item.scaffold.step2).toBeTruthy();
          expect(item.scaffold.step3).toBeTruthy();
          expect(item.feedback.correct).toBeTruthy();
          expect(item.feedback.hint).toBeTruthy();
        }
      }
    }
  });

  it('taxonomy references are valid and transfer task is present', () => {
    const taxonomyCodes = new Set(taxonomy.misconceptions.map((entry) => entry.code));
    expect(taxonomyCodes.size).toBeGreaterThan(0);

    for (const unit of units) {
      expect(unit.transferTask.id).toBeTruthy();
      expect(unit.transferTask.type).toMatch(/revision|short-writing/);
      expect(unit.transferTask.prompt).toBeTruthy();
      expect(unit.transferTask.rubric.length).toBeGreaterThan(0);

      for (const item of unit.items as AnyItem[]) {
        if (isContrastPairItem(item)) {
          expect(
            taxonomyCodes.has(item.sentenceA.diagnostic.primaryMisconception),
            `Invalid taxonomy code "${item.sentenceA.diagnostic.primaryMisconception}" in ${item.id}.sentenceA`
          ).toBe(true);
          expect(
            taxonomyCodes.has(item.sentenceB.diagnostic.primaryMisconception),
            `Invalid taxonomy code "${item.sentenceB.diagnostic.primaryMisconception}" in ${item.id}.sentenceB`
          ).toBe(true);
        } else {
          expect(taxonomyCodes.has(item.diagnostic.primaryMisconception)).toBe(true);
        }
      }
    }
  });

  it('all primaryMisconception codes used in units have a BUILT_IN_FEEDBACK entry', () => {
    for (const unit of units) {
      for (const item of unit.items as AnyItem[]) {
        if (isContrastPairItem(item)) {
          const codeA = item.sentenceA.diagnostic.primaryMisconception;
          expect(
            BUILT_IN_FEEDBACK,
            `No BUILT_IN_FEEDBACK entry for "${codeA}" (used in ${item.id}.sentenceA)`
          ).toHaveProperty(codeA);

          const codeB = item.sentenceB.diagnostic.primaryMisconception;
          expect(
            BUILT_IN_FEEDBACK,
            `No BUILT_IN_FEEDBACK entry for "${codeB}" (used in ${item.id}.sentenceB)`
          ).toHaveProperty(codeB);
        } else {
          const code = item.diagnostic.primaryMisconception;
          expect(
            BUILT_IN_FEEDBACK,
            `No BUILT_IN_FEEDBACK entry for "${code}" (used in ${item.id})`
          ).toHaveProperty(code);
        }
      }
    }
  });

  it('acceptedVariants are explicit, non-empty alternatives and not duplicates of target', () => {
    for (const unit of units) {
      for (const item of unit.items as AnyItem[]) {
        if (isContrastPairItem(item)) {
          for (const sentence of [item.sentenceA, item.sentenceB]) {
            const variants = sentence.diagnostic.acceptedVariants;
            expect(Array.isArray(variants)).toBe(true);

            const normalizedTarget = sentence.target.trim().toLowerCase();
            const normalizedVariants = variants.map((value: string) => value.trim().toLowerCase());

            for (const variant of variants) {
              expect(typeof variant).toBe('string');
              expect(variant.trim().length).toBeGreaterThan(0);
            }

            expect(normalizedVariants).not.toContain(normalizedTarget);
            expect(new Set(normalizedVariants).size).toBe(normalizedVariants.length);
          }
        } else {
          const variants = item.diagnostic.acceptedVariants;
          expect(Array.isArray(variants)).toBe(true);

          const normalizedTarget = item.target.trim().toLowerCase();
          const normalizedVariants = variants.map((value: string) => value.trim().toLowerCase());

          for (const variant of variants) {
            expect(typeof variant).toBe('string');
            expect(variant.trim().length).toBeGreaterThan(0);
          }

          expect(normalizedVariants).not.toContain(normalizedTarget);
          expect(new Set(normalizedVariants).size).toBe(normalizedVariants.length);
        }
      }
    }
  });
});
