"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { getUnit } from "@/lib/content";

export default function SchrijvenPage() {
  const [text, setText] = useState("");
  const [reflectie, setReflectie] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const transfer = getUnit("unit-01-pv-tt")!.transferTask;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">Schrijven & nakijken</h1>
        <section className="rounded-3xl border border-black/15 bg-white p-6">
          <h2 className="text-2xl font-semibold">Transferopdracht</h2>
          <p className="mt-2 text-lg">{transfer.prompt}</p>
        </section>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-4 rounded-3xl border border-black/15 bg-white p-6"
        >
          <label htmlFor="transfer" className="block text-xl font-semibold">
            Jouw tekst
          </label>
          <textarea
            id="transfer"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="min-h-52 w-full rounded-2xl border-2 border-neutral-500 p-4 text-lg"
            required
          />

          <label htmlFor="reflectie" className="block text-lg font-semibold">
            Reflectie (optioneel): Welke regel gebruikte je het vaakst?
          </label>
          <textarea
            id="reflectie"
            value={reflectie}
            onChange={(event) => setReflectie(event.target.value)}
            className="min-h-28 w-full rounded-2xl border-2 border-neutral-300 p-4 text-lg"
          />

          <button className="rounded-xl bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white">Open zelfcontrole</button>
        </form>

        {submitted && (
          <section className="space-y-3 rounded-3xl border border-[#f0c972] bg-[#fff9ea] p-6">
            <h2 className="text-xl font-semibold">Zelfcontrole</h2>
            <p>De app kan je tekst niet inhoudelijk beoordelen. Controleer hem met deze criteria:</p>
            <ul className="list-disc space-y-2 pl-6 text-lg">
              {transfer.rubric.map((criterion) => <li key={criterion}>{criterion}</li>)}
            </ul>
          </section>
        )}
      </div>
    </AppShell>
  );
}
