"use client";

import { useState } from "react";
import type { Unit } from "@/lib/content";

type Props = {
  /** The transferTask object from the unit JSON (id, type, prompt, rubric). */
  task: Unit["transferTask"];
  unitTitle: string;
  /** Called when the learner finishes the self-check. */
  onFinish: () => void;
};

/**
 * Inline transfer task — a prop-driven version of the /schrijven page.
 * Shown after the learner completes all Zelfstandig items.
 */
export function TransferTaskPanel({ task, unitTitle, onFinish }: Props) {
  const [text, setText] = useState("");
  const [reflectie, setReflectie] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
          <textarea
            id="transfer-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-52 w-full rounded-2xl border-2 border-neutral-500 p-4 text-lg"
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
            Open zelfcontrole
          </button>
        </form>
      ) : (
        <section className="space-y-4 rounded-3xl border border-[#f0c972] bg-[#fff9ea] p-6">
          <h2 className="text-xl font-semibold">Zelfcontrole</h2>
          <p>De app kan je tekst niet inhoudelijk beoordelen. Controleer hem met deze criteria:</p>
          <ul className="list-disc space-y-2 pl-6 text-lg">
            {task.rubric.map((criterion) => <li key={criterion}>{criterion}</li>)}
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
