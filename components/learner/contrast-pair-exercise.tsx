"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ContrastPairItem } from "@/lib/content";
import type { AttemptRecord } from "@/lib/attempt-store";
import { saveAttempt } from "@/lib/attempt-store";
import { HintDisclosure } from "./hint-disclosure";

type Props = {
  item: ContrastPairItem;
  unitId: string;
  onComplete: (aCorrect: boolean, bCorrect: boolean) => void;
};

type PairResult = {
  aCorrect: boolean;
  bCorrect: boolean;
};

/**
 * Side-by-side exercise showing two contrasting sentences with the same verb.
 *
 * Both answers are submitted in one action ("Controleer beide") rather than
 * sequentially. This is intentional: seeing both outcomes simultaneously makes
 * the contrast visible — the learner cannot fixate on one sentence in isolation.
 * Individual feedback is shown per column after submission.
 *
 * Attempts are saved with itemId suffixes ":a" and ":b" to keep them distinct
 * from each other and from any regular ExerciseItem with the same base id.
 */
export function ContrastPairExercise({ item, unitId, onComplete }: Props) {
  const [answerA, setAnswerA] = useState("");
  const [answerB, setAnswerB] = useState("");
  const [result, setResult] = useState<PairResult | null>(null);

  const sentenceA = item.sentenceA;
  const sentenceB = item.sentenceB;

  const hintsA = [sentenceA.scaffold.step2, sentenceA.scaffold.step3];
  const hintsB = [sentenceB.scaffold.step2, sentenceB.scaffold.step3];

  /** Normalise for comparison: trim whitespace and lower-case. */
  function normalise(s: string) {
    return s.trim().toLowerCase();
  }

  /** Returns true if `answer` matches `target` or any accepted variant (case/space insensitive). */
  function isCorrect(answer: string, target: string, variants: string[]): boolean {
    const n = normalise(answer);
    return n === normalise(target) || variants.some((v) => normalise(v) === n);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const aCorrect = isCorrect(answerA, sentenceA.target, sentenceA.diagnostic.acceptedVariants);
    const bCorrect = isCorrect(answerB, sentenceB.target, sentenceB.diagnostic.acceptedVariants);
    setResult({ aCorrect, bCorrect });

    saveAttempt({
      unitId,
      itemId: `${item.id}:a`,
      correct: aCorrect,
      misconception: sentenceA.diagnostic.primaryMisconception,
      timestamp: new Date().toISOString(),
    });
    saveAttempt({
      unitId,
      itemId: `${item.id}:b`,
      correct: bCorrect,
      misconception: sentenceB.diagnostic.primaryMisconception,
      timestamp: new Date().toISOString(),
    });
  }

  return (
    <div className="space-y-4 rounded-3xl border border-black/15 bg-white p-6">
      {/* Contrast label */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3">
        <p className="font-semibold text-amber-900">{item.contrastLabel}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Sentence A */}
          <div className="space-y-3 rounded-2xl border border-neutral-200 p-4">
            <h3 className="text-lg font-semibold leading-snug">{sentenceA.prompt}</h3>
            {!result ? (
              <>
                <label htmlFor="answer-a" className="block text-base font-medium text-neutral-700">
                  Jouw antwoord
                </label>
                <input
                  id="answer-a"
                  autoComplete="off"
                  value={answerA}
                  onChange={(e) => setAnswerA(e.target.value)}
                  className="w-full rounded-xl border-2 border-neutral-400 px-3 py-2 text-lg"
                  required
                />
                <HintDisclosure hints={hintsA} />
              </>
            ) : (
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-base ${
                  result.aCorrect
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {result.aCorrect ? (
                  <CheckCircle2 className="shrink-0" aria-hidden />
                ) : (
                  <AlertCircle className="shrink-0" aria-hidden />
                )}
                <p>
                  {result.aCorrect ? (
                    <strong>Correct: {sentenceA.target}</strong>
                  ) : (
                    <>
                      <strong>Verwacht: {sentenceA.target}</strong> — jij: {answerA}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Sentence B */}
          <div className="space-y-3 rounded-2xl border border-neutral-200 p-4">
            <h3 className="text-lg font-semibold leading-snug">{sentenceB.prompt}</h3>
            {!result ? (
              <>
                <label htmlFor="answer-b" className="block text-base font-medium text-neutral-700">
                  Jouw antwoord
                </label>
                <input
                  id="answer-b"
                  autoComplete="off"
                  value={answerB}
                  onChange={(e) => setAnswerB(e.target.value)}
                  className="w-full rounded-xl border-2 border-neutral-400 px-3 py-2 text-lg"
                  required
                />
                <HintDisclosure hints={hintsB} />
              </>
            ) : (
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-base ${
                  result.bCorrect
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {result.bCorrect ? (
                  <CheckCircle2 className="shrink-0" aria-hidden />
                ) : (
                  <AlertCircle className="shrink-0" aria-hidden />
                )}
                <p>
                  {result.bCorrect ? (
                    <strong>Correct: {sentenceB.target}</strong>
                  ) : (
                    <>
                      <strong>Verwacht: {sentenceB.target}</strong> — jij: {answerB}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {!result ? (
          <button
            type="submit"
            className="rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white"
          >
            Controleer beide
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onComplete(result.aCorrect, result.bCorrect)}
            className="rounded-xl border border-black/30 bg-white px-5 py-3 font-semibold"
          >
            Volgende opdracht
          </button>
        )}
      </form>
    </div>
  );
}
