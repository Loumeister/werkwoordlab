"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { type Unit, getMisconceptionLabel } from "@/lib/content";
import { evaluateAnswer, getExerciseMode, getFunctionOptions, getHomophoneOptions } from "@/lib/evaluator";
import { saveAttempt } from "@/lib/attempt-store";

export function LearnerFlow({ unit }: { unit: Unit }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);

  const item = unit.items[index];
  const mode = getExerciseMode(item);
  const evaluation = submitted ? evaluateAnswer(item, answer) : null;
  const progress = Math.round(((index + 1) / unit.items.length) * 100);

  const instruction = useMemo(() => {
    if (mode === "classificatie") {
      return "Bepaal eerst de grammaticale functie van het onderstreepte werkwoord.";
    }
    if (mode === "homofonen") {
      return "Kies de juiste homofone vorm op basis van grammaticale functie.";
    }
    return "Vul de correcte werkwoordsvorm in.";
  }, [mode]);

  const functionOptions = getFunctionOptions();
  const homophoneOptions = getHomophoneOptions(item);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = evaluateAnswer(item, answer);
    setSubmitted(true);
    setLastCorrect(result.correct);

    saveAttempt({
      unitId: unit.id,
      itemId: item.id,
      correct: result.correct,
      misconception: item.diagnostic.primaryMisconception,
      timestamp: new Date().toISOString()
    });
  }

  function handleNext() {
    setSubmitted(false);
    setAnswer("");
    setIndex((current) => (current + 1 < unit.items.length ? current + 1 : current));
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight">{unit.title}</h1>

      <div className="h-4 w-full overflow-hidden rounded-full bg-neutral-200" aria-label="Voortgang">
        <div className="h-full rounded-full bg-[var(--warm-primary)]" style={{ width: `${progress}%` }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-black/15 bg-white p-6">
        <p className="text-lg font-semibold text-neutral-700">Opdracht {index + 1} van {unit.items.length}</p>
        <p className="text-lg text-neutral-700">{instruction}</p>

        <h2 className="text-[22px] font-semibold leading-snug">{item.prompt}</h2>

        <section className="rounded-2xl border border-[var(--focus-blue)] bg-[#f2f9ff] p-5">
          <h3 className="mb-2 text-xl font-semibold">Scaffold</h3>
          <ol className="list-decimal space-y-2 pl-6 text-lg">
            <li>{item.scaffold.step1}</li>
            <li>{item.scaffold.step2}</li>
            <li>{item.scaffold.step3}</li>
          </ol>
        </section>

        <section>
          <label htmlFor="antwoord" className="mb-2 block text-xl font-semibold">
            Jouw antwoord
          </label>

          {mode === "korte-correctie" && (
            <input
              id="antwoord"
              autoComplete="off"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="w-full rounded-2xl border-2 border-neutral-500 px-4 py-3 text-[20px] leading-relaxed"
              required
            />
          )}

          {mode === "homofonen" && (
            <fieldset className="space-y-2">
              {homophoneOptions.map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-300 p-3 text-lg">
                  <input
                    type="radio"
                    name="antwoord"
                    value={option}
                    checked={answer === option}
                    onChange={(event) => setAnswer(event.target.value)}
                    required
                  />
                  {option}
                </label>
              ))}
            </fieldset>
          )}

          {mode === "classificatie" && (
            <fieldset className="space-y-2">
              {functionOptions.map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-300 p-3 text-lg">
                  <input
                    type="radio"
                    name="antwoord"
                    value={option}
                    checked={answer === option}
                    onChange={(event) => setAnswer(event.target.value)}
                    required
                  />
                  {option}
                </label>
              ))}
            </fieldset>
          )}
        </section>

        <button type="submit" className="rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white">
          Controleer antwoord
        </button>
      </form>

      {submitted && evaluation && (
        <section className="space-y-3 rounded-3xl border border-[#f0c972] bg-[#fff9ea] p-6" aria-live="polite">
          <h2 className="text-xl font-semibold">Diagnostische feedback</h2>

          <div className="flex items-start gap-3 rounded-2xl border border-[#d7b158] bg-white p-4 text-lg">
            {lastCorrect ? <CheckCircle2 className="mt-1 text-[var(--ok)]" aria-hidden /> : <AlertCircle className="mt-1 text-[var(--error)]" aria-hidden />}
            <p>
              <strong>{lastCorrect ? "Correct" : "Nog niet correct"}.</strong> Verwacht antwoord: {evaluation.expected}
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-[#80c59c] bg-white p-4 text-lg">
            <AlertCircle className="mt-1 text-[var(--warn)]" aria-hidden />
            <p>
              <strong>Misconceptiecode:</strong> {item.diagnostic.primaryMisconception}
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-[#7db1d8] bg-white p-4 text-lg">
            <Lightbulb className="mt-1 text-[#1f5da0]" aria-hidden />
            <p>
              <strong>Hint:</strong> {item.feedback.hint} {getMisconceptionLabel(item.diagnostic.primaryMisconception)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={index === unit.items.length - 1}
            className="rounded-xl border border-black/30 bg-white px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            Volgende opdracht
          </button>
        </section>
      )}
    </div>
  );
}
