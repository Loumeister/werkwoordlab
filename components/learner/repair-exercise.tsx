"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Lightbulb, Wrench } from "lucide-react";
import type { RepairItem } from "@/lib/repair-generator";
import { saveAttempt } from "@/lib/attempt-store";
import { isMisconceptionCode } from "@/lib/feedback/misconceptions";
import { isRichFeedbackEntry } from "@/lib/feedback/types";
import { getEffectiveFeedback } from "@/lib/feedback/feedbackLookup";
import { HintDisclosure } from "./hint-disclosure";

type Props = {
  repairItem: RepairItem;
  unitId: string;
  onComplete: (correct: boolean) => void;
};

type Stage = "detect" | "fix" | "feedback";

/**
 * Repair exercise: the learner sees a sentence with an incorrect word form
 * already inserted (highlighted). They must:
 *   1. Detect the error ("Er zit een fout in")
 *   2. Provide the correct form
 *   3. Read diagnostic feedback
 *
 * This mirrors real proofreading practice and forces active error detection
 * rather than passive fill-in-the-blank production.
 */
export function RepairExercise({ repairItem, unitId, onComplete }: Props) {
  const { originalItem: item, wrongForm, promptWithError } = repairItem;

  const [stage, setStage] = useState<Stage>("detect");
  const [detectionCorrect, setDetectionCorrect] = useState<boolean | null>(null);
  const [fixAnswer, setFixAnswer] = useState("");
  const [fixResult, setFixResult] = useState<{ correct: boolean; expected: string } | null>(null);
  const [uitlegOpen, setUitlegOpen] = useState(false);

  const uitlegPanelId = `repair-uitleg-${item.id}`;
  const fixInputRef = useRef<HTMLInputElement>(null);

  const rawCode = item.diagnostic.primaryMisconception;
  const code = isMisconceptionCode(rawCode) ? rawCode : undefined;
  const effectiveFeedback = code ? getEffectiveFeedback(code) : undefined;

  // Focus the fix input when stage advances to "fix"
  useEffect(() => {
    if (stage === "fix") {
      fixInputRef.current?.focus();
    }
  }, [stage]);

  // Enter key advances from feedback stage (ignore when focus is on interactive elements)
  useEffect(() => {
    if (stage !== "feedback" || !fixResult) return;
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Enter") onComplete(fixResult!.correct);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stage, fixResult, onComplete]);

  // ─── Highlight wrong form in the sentence ─────────────────────────────────

  /**
   * Splits promptWithError into parts so the wrong form can be rendered with
   * distinct styling. The capturing group in split places the matched token
   * at index 1; we highlight only that position to avoid false positives when
   * the wrong form appears as a substring elsewhere.
   */
  function renderSentenceWithHighlight() {
    const escapedWrong = wrongForm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedWrong})`, "i");
    const parts = promptWithError.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          i === 1 ? (
            <mark
              key={i}
              className="rounded bg-red-100 px-1 font-bold text-red-700 not-italic underline decoration-red-400 decoration-2 underline-offset-2"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  }

  // ─── Handlers ─────────────────────────────────────────────────────────────

  function handleDetect(hasFault: boolean) {
    // The sentence always contains an error, so hasFault === true is correct.
    const correct = hasFault;
    setDetectionCorrect(correct);

    if (correct) {
      setStage("fix");
    } else {
      // Learner said "Dit klopt zo" — detection wrong. Skip to feedback directly
      // and count as incorrect spelling attempt (they missed the error entirely).
      const result = { correct: false, expected: item.target };
      setFixResult(result);
      saveAttempt({
        unitId,
        itemId: `${item.id}:repair`,
        correct: false,
        misconception: item.diagnostic.primaryMisconception,
        timestamp: new Date().toISOString(),
      });
      setStage("feedback");
    }
  }

  function handleFixSubmit(e: React.FormEvent) {
    e.preventDefault();
    const normalized = fixAnswer.trim().toLowerCase();
    const normalizedTarget = item.target.trim().toLowerCase();
    const normalizedVariants = item.diagnostic.acceptedVariants.map((v) =>
      v.trim().toLowerCase()
    );
    const correct =
      normalized === normalizedTarget || normalizedVariants.includes(normalized);

    const result = { correct, expected: item.target };
    setFixResult(result);
    saveAttempt({
      unitId,
      itemId: `${item.id}:repair`,
      correct,
      misconception: item.diagnostic.primaryMisconception,
      timestamp: new Date().toISOString(),
    });
    setStage("feedback");
  }

  // ─── Stage: detect ─────────────────────────────────────────────────────────

  if (stage === "detect") {
    return (
      <div className="animate-slide-up space-y-5 rounded-3xl border border-black/15 bg-white p-6">
        {/* Exercise type badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
            <Wrench className="h-3.5 w-3.5" aria-hidden />
            Reparateur
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
            Er staat een fout in deze zin. Kun jij hem vinden?
          </p>
          <p className="text-[22px] font-semibold leading-snug">
            {renderSentenceWithHighlight()}
          </p>
          <p className="text-sm text-neutral-500">
            Het gemarkeerde woord staat er misschien niet goed in.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleDetect(true)}
            className="flex items-center gap-2 rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white hover:opacity-90"
          >
            <AlertCircle className="h-4 w-4" aria-hidden />
            Er zit een fout in
          </button>
          <button
            type="button"
            onClick={() => handleDetect(false)}
            className="flex items-center gap-2 rounded-xl border border-black/30 bg-white px-5 py-3 font-semibold hover:bg-neutral-50"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Dit klopt zo
          </button>
        </div>
      </div>
    );
  }

  // ─── Stage: fix ────────────────────────────────────────────────────────────

  if (stage === "fix") {
    return (
      <div className="animate-slide-up space-y-5 rounded-3xl border border-black/15 bg-white p-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
            <Wrench className="h-3.5 w-3.5" aria-hidden />
            Reparateur
          </div>
          <span className="text-sm text-neutral-400">Stap 2 van 2 — herstel de fout</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
            Goed gezien! Wat is de juiste vorm?
          </div>
          <p className="text-[22px] font-semibold leading-snug">
            {renderSentenceWithHighlight()}
          </p>
        </div>

        <form onSubmit={handleFixSubmit} className="space-y-4">
          <div>
            <label htmlFor="repair-antwoord" className="mb-2 block text-base font-semibold">
              Jouw correctie
            </label>
            <input
              id="repair-antwoord"
              ref={fixInputRef}
              autoComplete="off"
              value={fixAnswer}
              onChange={(e) => setFixAnswer(e.target.value)}
              placeholder={`in plaats van "${wrongForm}"`}
              className="w-full rounded-2xl border-2 border-neutral-500 px-4 py-3 text-[20px] leading-relaxed"
              required
            />
          </div>

          <HintDisclosure hints={[item.scaffold.step2, item.scaffold.step3]} />

          <button
            type="submit"
            className="rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white hover:opacity-90"
          >
            Herstel de zin
          </button>
        </form>
      </div>
    );
  }

  // ─── Stage: feedback ────────────────────────────────────────────────────────

  if (stage === "feedback" && fixResult) {
    return (
      <section
        className={`animate-slide-up space-y-3 rounded-3xl border p-6 ${
          fixResult.correct
            ? "animate-bounce-in border-green-200 bg-green-50"
            : "animate-shake border-[#f0c972] bg-[#fff9ea]"
        }`}
        aria-live="polite"
      >
        <h2 className="text-xl font-semibold">
          {detectionCorrect === false
            ? "Die fout was er echt"
            : fixResult.correct
            ? "Goed gerepareerd"
            : "Zo zit het"}
        </h2>

        {/* Correctness + expected answer */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#d7b158] bg-white p-4 text-lg">
          {fixResult.correct ? (
            <CheckCircle2 className="mt-1 shrink-0 text-[var(--ok)]" aria-hidden />
          ) : (
            <AlertCircle className="mt-1 shrink-0 text-[var(--error)]" aria-hidden />
          )}
          <p>
            <strong>{fixResult.correct ? "Correct" : "Nog niet"}.</strong>{" "}
            {detectionCorrect === false
              ? <>De fout was: <strong>{wrongForm}</strong> → juist is <strong>{fixResult.expected}</strong>.</>
              : <>Juiste vorm: <strong>{fixResult.expected}</strong>.</>
            }
          </p>
        </div>

        {/* Layered diagnostic feedback */}
        {effectiveFeedback && (
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
                <p>{typeof effectiveFeedback === "string" ? effectiveFeedback : item.feedback.hint}</p>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => onComplete(fixResult.correct)}
          className="rounded-xl border border-black/30 bg-white px-5 py-3 font-semibold hover:bg-neutral-50"
        >
          Verder →
        </button>
      </section>
    );
  }

  return null;
}
