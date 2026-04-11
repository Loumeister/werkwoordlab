"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";
import type { ExerciseItem } from "@/lib/content";
import { getMisconceptionLabel } from "@/lib/content";
import type { AttemptRecord } from "@/lib/attempt-store";
import { saveAttempt } from "@/lib/attempt-store";
import { getFunctionOptions, getHomophoneOptions } from "@/lib/evaluator";
import { FUNCTION_STEP_CODE, getEntryMode, getVerbFunctionHints } from "@/lib/phase-engine";
import type { FeedbackEntry } from "@/lib/feedback/types";
import { isRichFeedbackEntry } from "@/lib/feedback/types";
import type { MisconceptionCode } from "@/lib/feedback/misconceptions";
import { isMisconceptionCode } from "@/lib/feedback/misconceptions";
import { getEffectiveFeedback } from "@/lib/feedback/feedbackLookup";
import { HintDisclosure } from "./hint-disclosure";

type Props = {
  item: ExerciseItem;
  unitId: string;
  attempts: AttemptRecord[];
  onComplete: (correct: boolean) => void;
};

type Stage = "function-step" | "spelling-step" | "feedback";

/**
 * Adaptive exercise component with three entry modes:
 *
 * "full"        — Stage A (classify function) → Stage B (spelling)
 * "spell-first" — Skip Stage A; spelling only, with function label visible
 * "independent" — Spelling only, hints on demand
 */
export function MasteryExercise({ item, unitId, attempts, onComplete }: Props) {
  // Scope mastery tracking to the current unit so that function mastery
  // earned in unit-01 (persoonsvorm) does not skip the function step in
  // unit-02 (voltooid-deelwoord) — each unit family is its own context.
  const unitAttempts = attempts.filter((a) => a.unitId === unitId);
  const entryMode = getEntryMode(item, unitAttempts);

  const [stage, setStage] = useState<Stage>(() =>
    entryMode === "full" ? "function-step" : "spelling-step"
  );

  // Function step state
  const [funcAnswer, setFuncAnswer] = useState("");
  const [funcSubmitted, setFuncSubmitted] = useState(false);
  const [funcCorrect, setFuncCorrect] = useState<boolean | null>(null);
  const [wrongFuncAttempts, setWrongFuncAttempts] = useState(0);

  // Spelling step state
  const [spellingAnswer, setSpellingAnswer] = useState("");
  const [spellingResult, setSpellingResult] = useState<{ correct: boolean; expected: string } | null>(null);
  const [effectiveFeedback, setEffectiveFeedback] = useState<FeedbackEntry | undefined>(undefined);
  const [uitlegOpen, setUitlegOpen] = useState(false);

  const uitlegPanelId = `uitleg-${item.id}`;
  // Stage B always tests spelling — never function classification again.
  // HOMOPHONE_FUNCTION_CONFUSION items have a homophonePair (e.g. "belooft/beloofd")
  // and Stage A already covered the function question, so Stage B shows the
  // homophone choice and evaluates against item.target (the correct word form).
  const spellingDisplayMode: "homofonen" | "korte-correctie" = item.homophonePair
    ? "homofonen"
    : "korte-correctie";
  const functionHints = getVerbFunctionHints(item);
  const functionOptions = getFunctionOptions();
  const homophoneOptions = getHomophoneOptions(item);
  const spellingHints = [item.scaffold.step2, item.scaffold.step3];

  useEffect(() => {
    const rawCode = item.diagnostic?.primaryMisconception;
    const code: MisconceptionCode | undefined =
      rawCode && isMisconceptionCode(rawCode) ? rawCode : undefined;
    setEffectiveFeedback(code ? getEffectiveFeedback(code) : undefined);
    setUitlegOpen(false);
  }, [item]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  function handleFuncSubmit(e: React.FormEvent) {
    e.preventDefault();
    const correct = funcAnswer.toLowerCase() === item.grammaticalFunction.toLowerCase();
    setFuncSubmitted(true);
    setFuncCorrect(correct);

    // Convention: function-step attempts use itemId = "<item.id>:function" so
    // they are distinct from spelling-step attempts for the same item. This also
    // means hasFunctionMastery can filter them by misconception === FUNCTION_STEP_CODE
    // without confusing them with regular spelling attempts.
    saveAttempt({
      unitId,
      itemId: `${item.id}:function`,
      correct,
      misconception: FUNCTION_STEP_CODE,
      timestamp: new Date().toISOString(),
    });

    if (!correct) {
      setWrongFuncAttempts((n) => n + 1);
    }
  }

  function retryFuncStep() {
    setFuncSubmitted(false);
    setFuncCorrect(null);
    setFuncAnswer("");
  }

  function advanceToSpelling() {
    setStage("spelling-step");
  }

  function handleSpellingSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Always evaluate against item.target — never item.grammaticalFunction.
    // This avoids the classificatie-mode trap where evaluateAnswer() would
    // expect the grammatical function string instead of the word form.
    const expected = item.target;
    const normalized = spellingAnswer.trim().toLowerCase();
    const normalizedTarget = expected.trim().toLowerCase();
    const normalizedVariants = item.diagnostic.acceptedVariants.map((v) =>
      v.trim().toLowerCase()
    );
    const correct =
      normalized === normalizedTarget || normalizedVariants.includes(normalized);

    setSpellingResult({ correct, expected });
    setStage("feedback");

    saveAttempt({
      unitId,
      itemId: item.id,
      correct,
      misconception: item.diagnostic.primaryMisconception,
      timestamp: new Date().toISOString(),
    });
  }

  // -------------------------------------------------------------------------
  // Stage A — Function classification
  // -------------------------------------------------------------------------

  if (stage === "function-step") {
    const canAdvance = funcCorrect === true || wrongFuncAttempts >= 2;

    return (
      <div className="space-y-4 rounded-3xl border border-black/15 bg-white p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
          Stap 1 — Functie bepalen
        </p>

        <h2 className="text-[22px] font-semibold leading-snug">{item.prompt}</h2>

        <form onSubmit={handleFuncSubmit} className="space-y-4">
          <fieldset className="space-y-2">
            <legend className="mb-2 text-lg font-semibold text-neutral-700">
              Welke grammaticale functie heeft het werkwoord in de zin?
            </legend>
            {functionOptions.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-300 p-3 text-lg hover:bg-neutral-50"
              >
                <input
                  type="radio"
                  name="function"
                  value={option}
                  checked={funcAnswer === option}
                  onChange={(e) => setFuncAnswer(e.target.value)}
                  disabled={funcSubmitted}
                  required
                />
                {option}
              </label>
            ))}
          </fieldset>

          <HintDisclosure hints={functionHints} label="Hoe vind ik de grammaticale functie?" />

          {!funcSubmitted && (
            <button
              type="submit"
              className="rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white"
            >
              Controleer
            </button>
          )}
        </form>

        {funcSubmitted && funcCorrect === true && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            <CheckCircle2 className="shrink-0" aria-hidden />
            <p className="font-semibold">Klopt! Nu de spelling.</p>
          </div>
        )}

        {funcSubmitted && funcCorrect === false && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            <AlertCircle className="shrink-0" aria-hidden />
            <p>
              <span className="font-semibold">Niet helemaal.</span> Het is een{" "}
              <strong>{item.grammaticalFunction}</strong>.
            </p>
          </div>
        )}

        {funcSubmitted && canAdvance && (
          <button
            type="button"
            onClick={advanceToSpelling}
            className="rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white"
          >
            Ga naar de spelling
          </button>
        )}

        {funcSubmitted && funcCorrect === false && !canAdvance && (
          <button
            type="button"
            onClick={retryFuncStep}
            className="rounded-xl border border-black/30 bg-white px-5 py-3 font-semibold"
          >
            Probeer nog een keer
          </button>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Stage B — Spelling step
  // -------------------------------------------------------------------------

  if (stage === "spelling-step") {
    return (
      <form
        onSubmit={handleSpellingSubmit}
        className="space-y-4 rounded-3xl border border-black/15 bg-white p-6"
      >
        {(entryMode === "spell-first" || entryMode === "independent") && (
          <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
            Functie: <span className="font-semibold text-slate-600">{item.grammaticalFunction}</span>
            {entryMode === "independent" && (
              <span className="ml-2 text-slate-400">· Zelfstandig</span>
            )}
          </p>
        )}

        <h2 className="text-[22px] font-semibold leading-snug">{item.prompt}</h2>

        <section>
          <label htmlFor="antwoord" className="mb-2 block text-xl font-semibold">
            Jouw antwoord
          </label>

          {spellingDisplayMode === "korte-correctie" && (
            <input
              id="antwoord"
              autoComplete="off"
              value={spellingAnswer}
              onChange={(e) => setSpellingAnswer(e.target.value)}
              className="w-full rounded-2xl border-2 border-neutral-500 px-4 py-3 text-[20px] leading-relaxed"
              required
            />
          )}

          {spellingDisplayMode === "homofonen" && (
            <fieldset className="space-y-2">
              {homophoneOptions.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-300 p-3 text-lg"
                >
                  <input
                    type="radio"
                    name="antwoord"
                    value={option}
                    checked={spellingAnswer === option}
                    onChange={(e) => setSpellingAnswer(e.target.value)}
                    required
                  />
                  {option}
                </label>
              ))}
            </fieldset>
          )}
        </section>

        <HintDisclosure hints={spellingHints} />

        <button
          type="submit"
          className="rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white"
        >
          Controleer antwoord
        </button>
      </form>
    );
  }

  // -------------------------------------------------------------------------
  // Feedback stage
  // -------------------------------------------------------------------------

  if (stage === "feedback" && spellingResult) {
    return (
      <section
        className="space-y-3 rounded-3xl border border-[#f0c972] bg-[#fff9ea] p-6"
        aria-live="polite"
      >
        <h2 className="text-xl font-semibold">Diagnostische feedback</h2>

        <div className="flex items-start gap-3 rounded-2xl border border-[#d7b158] bg-white p-4 text-lg">
          {spellingResult.correct ? (
            <CheckCircle2 className="mt-1 text-[var(--ok)]" aria-hidden />
          ) : (
            <AlertCircle className="mt-1 text-[var(--error)]" aria-hidden />
          )}
          <p>
            <strong>{spellingResult.correct ? "Correct" : "Nog niet correct"}.</strong> Verwacht
            antwoord: {spellingResult.expected}
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-[#80c59c] bg-white p-4 text-lg">
          <AlertCircle className="mt-1 text-[var(--warn)]" aria-hidden />
          <p>
            <strong>Misconceptiecode:</strong> {item.diagnostic.primaryMisconception}
          </p>
        </div>

        <div className="rounded-2xl border border-[#7db1d8] bg-white p-4 text-lg">
          {isRichFeedbackEntry(effectiveFeedback) ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-1 shrink-0 text-[#1f5da0]" aria-hidden />
                <p>
                  <strong>Hint:</strong> {effectiveFeedback.herstelvraag}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUitlegOpen((o) => !o)}
                aria-expanded={uitlegOpen}
                aria-controls={uitlegPanelId}
                className="ml-9 text-sm font-semibold text-[#1f5da0] underline underline-offset-2 hover:no-underline"
              >
                {uitlegOpen
                  ? "Verberg uitleg"
                  : `Meer uitleg over '${effectiveFeedback.sleutelwoord}'`}
              </button>
              <div
                id={uitlegPanelId}
                hidden={!uitlegOpen}
                className="ml-9 space-y-2 rounded-xl border border-[#bee3ff] bg-[#f2f9ff] p-4 text-base"
              >
                <p>
                  <strong>Diagnose:</strong> {effectiveFeedback.uitleg.diagnose}
                </p>
                <p>
                  <strong>Redenering:</strong> {effectiveFeedback.uitleg.redenering}
                </p>
                <p>
                  <strong>Herprobeer:</strong> {effectiveFeedback.uitleg.herprobeer}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-1 text-[#1f5da0]" aria-hidden />
              <p>
                <strong>Hint:</strong>{" "}
                {typeof effectiveFeedback === "string"
                  ? effectiveFeedback
                  : item.feedback.hint}{" "}
                {getMisconceptionLabel(item.diagnostic.primaryMisconception)}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onComplete(spellingResult.correct)}
          className="rounded-xl border border-black/30 bg-white px-5 py-3 font-semibold"
        >
          Volgende opdracht
        </button>
      </section>
    );
  }

  return null;
}
