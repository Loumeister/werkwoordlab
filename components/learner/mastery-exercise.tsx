"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";
import type { ExerciseItem } from "@/lib/content";
import type { AttemptRecord } from "@/lib/attempt-store";
import { saveAttempt } from "@/lib/attempt-store";
import { getFunctionOptions, getClassifyOptions, getHomophoneOptions } from "@/lib/evaluator";
import {
  FUNCTION_STEP_CODE,
  getEntryMode,
  getProofChips,
  getVerbFunctionHints,
  isFirstOccurrenceOfPattern,
} from "@/lib/phase-engine";
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

type Stage = "function-step" | "spelling-step" | "proof-chips" | "feedback";

/**
 * Adaptive exercise component with three entry modes:
 *
 * "full"        — Stage A (classify function) → Stage B (spelling) → [proof chips] → feedback
 * "spell-first" — Skip Stage A; spelling only, with function label visible
 * "independent" — Spelling only, hints on demand
 *
 * Proof chips appear (selectively) between spelling submit and full feedback,
 * asking the learner to identify which reasoning they used. This makes the
 * reasoning process visible without adding a heavy extra step — chips only
 * appear after incorrect answers or on first encounter with a misconception.
 */
export function MasteryExercise({ item, unitId, attempts, onComplete }: Props) {
  const unitAttempts = attempts.filter((a) => a.unitId === unitId);
  const entryMode = getEntryMode(item, unitAttempts);

  const [stage, setStage] = useState<Stage>(() => {
    // Classify items have no separate function step — they are their own
    // categorisation exercise, so we go straight to the answer step.
    if (item.type === "classify") return "spelling-step";
    return entryMode === "full" ? "function-step" : "spelling-step";
  });

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
  const [emptyAnswerError, setEmptyAnswerError] = useState(false);

  // Proof chips state
  const [proofChips, setProofChips] = useState<[string, string] | null>(null);
  const [proofAnswer, setProofAnswer] = useState<string | null>(null);
  const [shuffledChips, setShuffledChips] = useState<string[]>([]);

  const uitlegPanelId = `uitleg-${item.id}`;
  // Stage B display mode:
  //   "classificatie" — classify items: show item.classifyOptions as radio buttons
  //   "homofonen"     — homophone items: show split homophonePair as radio buttons
  //   "korte-correctie" — default: free-text input
  const spellingDisplayMode: "classificatie" | "homofonen" | "korte-correctie" =
    item.type === "classify" ? "classificatie" :
    item.homophonePair ? "homofonen" : "korte-correctie";
  const functionHints = getVerbFunctionHints(item);
  const functionOptions = getFunctionOptions();
  const classifyOptions = getClassifyOptions(item);
  const homophoneOptions = getHomophoneOptions(item);
  const spellingHints = [item.scaffold.step2, item.scaffold.step3];

  useEffect(() => {
    const rawCode = item.diagnostic?.primaryMisconception;
    const code: MisconceptionCode | undefined =
      rawCode && isMisconceptionCode(rawCode) ? rawCode : undefined;
    setEffectiveFeedback(code ? getEffectiveFeedback(code) : undefined);
    setUitlegOpen(false);
  }, [item]);

  // Determine proof chip visibility after spelling submit
  const shouldShowProofChips = useMemo(() => {
    if (!spellingResult) return false;
    // Show chips after wrong answers, or on first encounter with this pattern.
    return !spellingResult.correct || isFirstOccurrenceOfPattern(item, unitAttempts);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spellingResult]);

  // Enter key: advance from feedback stage
  useEffect(() => {
    if (stage !== "feedback" || !spellingResult) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") onComplete(spellingResult!.correct);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stage, spellingResult, onComplete]);

  // Enter key: advance from function-step feedback (when canAdvance is true)
  useEffect(() => {
    if (stage !== "function-step" || !funcSubmitted) return;
    const canAdvance = funcCorrect === true || wrongFuncAttempts >= 2;
    if (!canAdvance) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") advanceToSpelling();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, funcSubmitted, funcCorrect, wrongFuncAttempts]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function handleFuncSubmit(e: React.FormEvent) {
    e.preventDefault();
    const correct = funcAnswer.toLowerCase() === item.grammaticalFunction.toLowerCase();
    setFuncSubmitted(true);
    setFuncCorrect(correct);
    saveAttempt({
      unitId,
      itemId: `${item.id}:function`,
      correct,
      misconception: FUNCTION_STEP_CODE,
      timestamp: new Date().toISOString(),
    });
    if (!correct) setWrongFuncAttempts((n) => n + 1);
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
    if (spellingAnswer.trim() === "") {
      setEmptyAnswerError(true);
      return;
    }
    setEmptyAnswerError(false);
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

    const result = { correct, expected };
    setSpellingResult(result);

    // Decide whether to show proof chips
    const firstOccurrence = isFirstOccurrenceOfPattern(item, unitAttempts);
    if (!correct || firstOccurrence) {
      // Defer saving the attempt until proof chip selection so proofCorrect can be attached.
      const chips = getProofChips(item);
      const shuffled = Math.random() < 0.5 ? [chips[0], chips[1]] : [chips[1], chips[0]];
      setProofChips(chips);
      setShuffledChips(shuffled);
      setStage("proof-chips");
    } else {
      // No proof chips: save immediately without proofCorrect.
      saveAttempt({
        unitId,
        itemId: item.id,
        correct,
        misconception: item.diagnostic.primaryMisconception,
        timestamp: new Date().toISOString(),
      });
      setStage("feedback");
    }
  }

  function handleProofChipSelect(chip: string) {
    if (!proofChips || !spellingResult) return;
    const proofCorrect = chip === proofChips[0]; // proofChips[0] is always the correct chip
    setProofAnswer(chip);
    // Save spelling attempt now with proof chip accuracy attached.
    saveAttempt({
      unitId,
      itemId: item.id,
      correct: spellingResult.correct,
      misconception: item.diagnostic.primaryMisconception,
      timestamp: new Date().toISOString(),
      proofCorrect,
    });
    // Advance to feedback after a brief delay so the selection is visible.
    setTimeout(() => setStage("feedback"), 350);
  }

  // ─── Step indicator component ─────────────────────────────────────────────

  function StepIndicator({ currentStep }: { currentStep: 1 | 2 }) {
    const totalSteps = entryMode === "full" ? 2 : 1;
    if (totalSteps === 1) return null;

    return (
      <div className="flex items-center gap-2">
        {[1, 2].map((step) => {
          const done = step < currentStep;
          const active = step === currentStep;
          return (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  done
                    ? "bg-green-500 text-white"
                    : active
                    ? "bg-[var(--warm-primary)] text-white"
                    : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {done ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : step}
              </div>
              <span
                className={`text-xs font-medium ${
                  done ? "text-green-600" : active ? "text-[var(--warm-primary)]" : "text-neutral-400"
                }`}
              >
                {step === 1 ? "Functie" : "Spelling"}
              </span>
              {step < 2 && (
                <div
                  className={`h-0.5 w-5 rounded-full ${done ? "bg-green-400" : "bg-neutral-200"}`}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ─── Stage A — Function classification ────────────────────────────────────

  if (stage === "function-step") {
    const canAdvance = funcCorrect === true || wrongFuncAttempts >= 2;

    return (
      <div className="animate-slide-up space-y-4 rounded-3xl border border-blue-100 bg-blue-50/40 p-6">
        <StepIndicator currentStep={1} />

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
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-300 bg-white p-3 text-lg hover:bg-neutral-50"
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
              className="rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white hover:opacity-90"
            >
              Controleer
            </button>
          )}
        </form>

        {funcSubmitted && funcCorrect === true && (
          <div className="animate-bounce-in flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800">
            <CheckCircle2 className="shrink-0" aria-hidden />
            <p className="font-semibold">Klopt! Nu de spelling.</p>
          </div>
        )}

        {funcSubmitted && funcCorrect === false && (
          <div className="animate-shake flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
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
            className="rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white hover:opacity-90"
          >
            Ga naar de spelling →
          </button>
        )}

        {funcSubmitted && funcCorrect === false && !canAdvance && (
          <button
            type="button"
            onClick={retryFuncStep}
            className="rounded-xl border border-black/30 bg-white px-5 py-3 font-semibold hover:bg-neutral-50"
          >
            Probeer nog een keer
          </button>
        )}
      </div>
    );
  }

  // ─── Stage B — Spelling step ───────────────────────────────────────────────

  if (stage === "spelling-step") {
    return (
      <form
        onSubmit={handleSpellingSubmit}
        className="animate-slide-up space-y-4 rounded-3xl border border-black/15 bg-white p-6"
      >
        <StepIndicator currentStep={2} />

        {item.type !== "classify" && (entryMode === "spell-first" || entryMode === "independent") && (
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
              onChange={(e) => { setSpellingAnswer(e.target.value); setEmptyAnswerError(false); }}
              className="w-full rounded-2xl border-2 border-neutral-500 px-4 py-3 text-[20px] leading-relaxed"
            />
          )}

          {spellingDisplayMode === "classificatie" && (
            <fieldset className="space-y-2">
              {classifyOptions.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-300 p-3 text-lg"
                >
                  <input
                    type="radio"
                    name="antwoord"
                    value={option}
                    checked={spellingAnswer === option}
                    onChange={(e) => { setSpellingAnswer(e.target.value); setEmptyAnswerError(false); }}
                  />
                  {option}
                </label>
              ))}
            </fieldset>
          )}

          {spellingDisplayMode === "homofonen" && (
            <fieldset className="space-y-2">
              {homophoneOptions.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-300 p-3 text-lg hover:bg-neutral-50"
                >
                  <input
                    type="radio"
                    name="antwoord"
                    value={option}
                    checked={spellingAnswer === option}
                    onChange={(e) => { setSpellingAnswer(e.target.value); setEmptyAnswerError(false); }}
                  />
                  {option}
                </label>
              ))}
            </fieldset>
          )}

          {emptyAnswerError && (
            <p role="alert" className="mt-2 text-sm font-semibold text-red-600">
              Vul een antwoord in voor je verder gaat.
            </p>
          )}
        </section>

        <HintDisclosure hints={spellingHints} />

        <button
          type="submit"
          className="rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white hover:opacity-90"
        >
          Controleer antwoord
        </button>
      </form>
    );
  }

  // ─── Proof chips — bewijs kiezen ───────────────────────────────────────────

  if (stage === "proof-chips" && spellingResult) {
    return (
      <div className="animate-slide-up space-y-5 rounded-3xl border border-black/15 bg-white p-6">
        <div className="flex items-start gap-3 rounded-2xl border bg-white p-4 text-lg
          border-[#d7b158]"
        >
          {spellingResult.correct ? (
            <CheckCircle2 className="mt-1 shrink-0 text-[var(--ok)]" aria-hidden />
          ) : (
            <AlertCircle className="mt-1 shrink-0 text-[var(--error)]" aria-hidden />
          )}
          <p>
            <strong>{spellingResult.correct ? "Correct" : "Nog niet"}.</strong>{" "}
            Juiste vorm: <strong>{spellingResult.expected}</strong>
          </p>
        </div>

        <div>
          <p className="mb-3 font-semibold text-neutral-700">
            Waarom klopt deze regel hier?
          </p>
          <div className="flex flex-col gap-2">
            {shuffledChips.map((chip, i) => {
              const isCorrectChip = proofChips ? chip === proofChips[0] : false;
              const isSelected = proofAnswer === chip;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleProofChipSelect(chip)}
                  disabled={proofAnswer !== null}
                  className={`rounded-xl border px-4 py-3 text-left text-base font-medium transition-colors ${
                    isSelected
                      ? isCorrectChip
                        ? "border-green-400 bg-green-50 text-green-800"
                        : "border-red-300 bg-red-50 text-red-800"
                      : proofAnswer !== null && isCorrectChip
                      ? "border-green-400 bg-green-50 text-green-800"
                      : "border-neutral-300 bg-white hover:bg-neutral-50"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── Feedback stage ────────────────────────────────────────────────────────

  if (stage === "feedback" && spellingResult) {
    return (
      <section
        className={`space-y-3 rounded-3xl border p-6 ${
          spellingResult.correct
            ? "animate-bounce-in border-green-200 bg-green-50"
            : "animate-shake border-[#f0c972] bg-[#fff9ea]"
        }`}
        aria-live="polite"
      >
        <h2 className="text-xl font-semibold">
          {spellingResult.correct ? "Goed geredeneerd" : "Zo zit het"}
        </h2>

        {/* Correctness + expected answer */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#d7b158] bg-white p-4 text-lg">
          {spellingResult.correct ? (
            <CheckCircle2 className="mt-1 text-[var(--ok)]" aria-hidden />
          ) : (
            <AlertCircle className="mt-1 text-[var(--error)]" aria-hidden />
          )}
          <p>
            <strong>{spellingResult.correct ? "Correct" : "Nog niet correct"}.</strong>{" "}
            Verwacht antwoord: <strong>{spellingResult.expected}</strong>
          </p>
        </div>

        {/* Layered diagnostic feedback — layer 1 always visible */}
        <div className="rounded-2xl border border-[#7db1d8] bg-white p-4 text-lg">
          {isRichFeedbackEntry(effectiveFeedback) ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-1 shrink-0 text-[#1f5da0]" aria-hidden />
                <p>{effectiveFeedback.herstelvraag}</p>
              </div>
              <button
                type="button"
                onClick={() => setUitlegOpen((o) => !o)}
                aria-expanded={uitlegOpen}
                aria-controls={uitlegPanelId}
                className="ml-9 rounded-lg border border-[#bee3ff] bg-[#f2f9ff] px-3 py-1.5 text-sm font-semibold text-[#1f5da0] hover:bg-[#e0f0ff]"
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
                {typeof effectiveFeedback === "string"
                  ? effectiveFeedback
                  : item.feedback.hint}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onComplete(spellingResult.correct)}
          className="rounded-xl border border-black/30 bg-white px-5 py-3 font-semibold hover:bg-neutral-50"
        >
          Verder →
        </button>
      </section>
    );
  }

  return null;
}
