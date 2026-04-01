import { describe, expect, it } from 'vitest';
import { getMisconceptionLabel, getUnit } from '@/lib/content';
import { evaluateAnswer, getExerciseMode } from '@/lib/evaluator';

describe('domain logic', () => {
  it('getUnit returns exact unit and does not fallback for invalid unitId', () => {
    const valid = getUnit('unit-01-pv-tt');
    const invalid = getUnit('unit-does-not-exist');

    expect(valid?.id).toBe('unit-01-pv-tt');
    expect(invalid).toBeUndefined();
  });

  it('evaluateAnswer is correct for exact target and incorrect for wrong answer', () => {
    const item = getUnit('unit-01-pv-tt')!.items[0];

    expect(evaluateAnswer(item, item.target).correct).toBe(true);
    expect(evaluateAnswer(item, 'fout antwoord').correct).toBe(false);
  });

  it('evaluateAnswer supports acceptedVariants with case/whitespace normalization', () => {
    const item = getUnit('unit-01-pv-tt')!.items[0];
    const withVariant = {
      ...item,
      diagnostic: {
        ...item.diagnostic,
        acceptedVariants: [' VINDT '],
      },
    };

    expect(evaluateAnswer(withVariant, 'vindt').correct).toBe(true);
    expect(evaluateAnswer(withVariant, '  VINDT  ').correct).toBe(true);
  });

  it('detects exercise mode deterministically from item contract', () => {
    const homophoneItem = getUnit('unit-01-pv-tt')!.items[0];
    const classificationItem = getUnit('unit-02-voltooid-deelwoord')!.items[0];

    expect(getExerciseMode(homophoneItem)).toBe('homofonen');
    expect(getExerciseMode(classificationItem)).toBe('classificatie');
  });

  it('misconception label lookup is safe for known and unknown codes', () => {
    expect(getMisconceptionLabel('PV_STAM_T_OMISSION')).toBeTruthy();
    expect(getMisconceptionLabel('UNKNOWN_CODE')).toMatch(/grammaticale functie/i);
  });
});
