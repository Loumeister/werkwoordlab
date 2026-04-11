"use client";

import { useState } from "react";
import type { Unit } from "@/lib/content";

type Props = {
  /** The transferTask object from the unit JSON (id, type, prompt, rubric). */
  task: Unit["transferTask"];
  unitTitle: string;
  /** Called when the learner presses "Klaar" after reviewing rubric feedback. */
  onFinish: () => void;
};

/**
 * Inline transfer task — a prop-driven version of the /schrijven page.
 * Shown after the learner completes all Zelfstandig items.
 *
 * The rubric feedback is intentionally heuristic (length check, end-letter
 * pattern, rule-word presence). It gives immediate, formative feedback without
 * requiring a server round-trip. A teacher can review the submitted text in the
 * classroom. Replace with an AI-scored rubric when that becomes available.
 */
export function TransferTaskPanel({ task, unitTitle, onFinish }: Props) {
  const [text, setText] = useState("");
  const [reflectie, setReflectie] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Heuristic: did the learner explicitly name the spelling rule they used?
  // We check for core grammatical terms across both the main text and the
  // reflection field. voltooid.?deelwoord covers "voltooiddeelwoord" (no space)
  // as well as "voltooid deelwoord" (with space).
  const hasRuleWords = /persoonsvorm|stam|werkwoord|voltooid.?deelwoord|infinitief/i.test(
    `${text} ${reflectie}`
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-black/15 bg-white p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
          Transferopdracht — {unitTitle}
        </p>
        <h2 className="mt-2 text-2xl font-bold">Laat zien dat je het echt begrijpt</h2>
        <p className="mt-3 text-lg text-neutral-700">{task.prompt}</p>

        {/* Rubric criteria from the unit JSON, shown as a checklist before writing */}
        {task.rubric.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-neutral-500">
            {task.rubric.map((criterion, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 text-neutral-400">•</span>
                {criterion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-black/15 bg-white p-6"
        >
          <label htmlFor="transfer-text" className="block text-xl font-semibold">
            Jouw tekst
          </label>
          {/* minLength=40 forces at least a sentence; browser validation handles it */}
          <textarea
            id="transfer-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-52 w-full rounded-2xl border-2 border-neutral-500 p-4 text-lg"
            minLength={40}
            required
          />

          <label htmlFor="transfer-reflectie" className="block text-lg font-semibold">
            Reflectie (optioneel): Welke regel gebruikte je het vaakst?
          </label>
          <textarea
            id="transfer-reflectie"
            value={reflectie}
            onChange={(e) => setReflectie(e.target.value)}
            className="min-h-28 w-full rounded-2xl border-2 border-neutral-300 p-4 text-lg"
          />

          <button
            type="submit"
            className="rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white"
          >
            Inleveren
          </button>
        </form>
      ) : (
        <section className="space-y-4 rounded-3xl border border-[#f0c972] bg-[#fff9ea] p-6">
          <h2 className="text-xl font-semibold">Rubric-feedback</h2>
          <ul className="space-y-2 text-lg">
            <li>
              Helderheid:{" "}
              <span className="font-medium">
                {/*
                 * Rough proxy for sufficient elaboration: 180 characters ≈ 2–3
                 * sentences. Raise this threshold if responses are too superficial.
                 */}
                {text.length > 180 ? "voldoende" : "voeg meer uitleg toe"}
              </span>
            </li>
            <li>
              Correctheid:{" "}
              <span className="font-medium">
                {/*
                 * /[dt]\b/ flags any word ending in d or t (e.g. "werkt", "reed").
                 * These are exactly the characters werkwoordspelling errors cluster
                 * around. A match is a prompt to double-check, not a hard error.
                 */}
                {/[dt]\b/i.test(text)
                  ? "controleer eindletters zorgvuldig"
                  : "basiscontrole uitgevoerd"}
              </span>
            </li>
            <li>
              Toepassing regel:{" "}
              <span className="font-medium">
                {hasRuleWords ? "regel benoemd" : "noem expliciet de gebruikte werkwoordregel"}
              </span>
            </li>
          </ul>

          <button
            type="button"
            onClick={onFinish}
            className="rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white"
          >
            Klaar — bekijk je resultaten
          </button>
        </section>
      )}
    </div>
  );
}
