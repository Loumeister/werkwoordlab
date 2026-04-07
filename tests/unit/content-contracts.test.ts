import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import taxonomy from '@/content/misconceptions/taxonomy.nl.json';
import type { Unit } from '@/lib/content';
import { getUnits } from '@/lib/content';

// ---------------------------------------------------------------------------
// Helpers – dynamically discover and load all unit JSON files from disk
// ---------------------------------------------------------------------------

const UNITS_DIR = path.join(process.cwd(), 'content', 'units');

function getJsonFiles(dirPath: string): string[] {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(dirPath, entry.name));
}

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function getUnitsFromDisk(): Unit[] {
  const files = getJsonFiles(UNITS_DIR);
  return files.map((f) => readJsonFile<Unit>(f));
}

// ---------------------------------------------------------------------------

const units = getUnitsFromDisk();

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

  it('at least one unit file exists on disk', () => {
    expect(units.length).toBeGreaterThan(0);
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

      for (const item of unit.items) {
        expect(item.id).toBeTruthy();
        expect(item.prompt).toBeTruthy();
        expect(item.lemma).toBeTruthy();
        expect(item.grammaticalFunction).toBeTruthy();
        expect(item.target).toBeTruthy();
        expect(item.scaffold.step1).toBeTruthy();
        expect(item.scaffold.step2).toBeTruthy();
        expect(item.scaffold.step3).toBeTruthy();
        expect(item.feedback.correct).toBeTruthy();
        expect(item.feedback.hint).toBeTruthy();

        expect(itemIds.has(item.id)).toBe(false);
        itemIds.add(item.id);
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

      for (const item of unit.items) {
        expect(taxonomyCodes.has(item.diagnostic.primaryMisconception)).toBe(true);
      }
    }
  });

  it('acceptedVariants are explicit, non-empty alternatives and not duplicates of target', () => {
    for (const unit of units) {
      for (const item of unit.items) {
        const variants = item.diagnostic.acceptedVariants;
        expect(Array.isArray(variants)).toBe(true);

        const normalizedTarget = item.target.trim().toLowerCase();
        const normalizedVariants = variants.map((value) => value.trim().toLowerCase());

        for (const variant of variants) {
          expect(typeof variant).toBe('string');
          expect(variant.trim().length).toBeGreaterThan(0);
        }

        expect(normalizedVariants).not.toContain(normalizedTarget);
        expect(new Set(normalizedVariants).size).toBe(normalizedVariants.length);
      }
    }
  });

  it('runtime registry contains exactly the same unit ids as disk files', () => {
    const diskIds = new Set(units.map((u) => u.id));
    const registryIds = new Set(getUnits().map((u) => u.id));

    expect(diskIds).toEqual(registryIds);
  });
});
