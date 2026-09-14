"use client";

import { AppShell } from "@/components/app-shell";
import { getUnits } from "@/lib/content";
import { isMisconceptionCode, MISCONCEPTION_TITLES } from "@/lib/feedback/misconceptions";
import { useAttempts } from "@/lib/use-attempts";

export default function InzichtenPage() {
  const attempts = useAttempts();
  const units = getUnits();
  const spellingAttempts = attempts.filter(
    (attempt) =>
      !attempt.itemId.endsWith(":function") &&
      !attempt.itemId.endsWith(":repair"),
  );
  const patternAttempts = spellingAttempts.filter(
    (attempt) => !attempt.correct && isMisconceptionCode(attempt.misconception),
  );

  const patternCounts = patternAttempts.reduce<Record<string, number>>((acc, attempt) => {
    acc[attempt.misconception] = (acc[attempt.misconception] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">Inzichten op dit apparaat</h1>
        <p>Dit overzicht gebruikt alleen pogingen uit deze browser; het bevat geen klasgegevens.</p>

        <section className="rounded-3xl border border-black/15 bg-white p-6">
          <h2 className="text-2xl font-semibold">Accuratesse per unit</h2>
          <ul className="mt-4 space-y-3 text-lg">
            {units.map((unit) => {
              const unitAttempts = spellingAttempts.filter((attempt) => attempt.unitId === unit.id);
              const accuracy = unitAttempts.length
                ? Math.round((unitAttempts.filter((attempt) => attempt.correct).length / unitAttempts.length) * 100)
                : 0;

              return (
                <li key={unit.id} className="rounded-xl border border-neutral-200 p-4">
                  {unit.title}: {accuracy}% · {unitAttempts.length} pogingen
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-3xl border border-black/15 bg-white p-6">
          <h2 className="text-2xl font-semibold">Waargenomen foutpatronen</h2>
          <p className="mt-2 text-neutral-600">
            Alleen onjuiste spellingantwoorden tellen mee. De gekoppelde foutcode kiest een herstelpad en bewijst niet wat de leerling dacht.
          </p>
          <ul className="mt-4 space-y-2 text-lg">
            {Object.entries(patternCounts).map(([code, count]) => (
              <li key={code} className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3">
                <span>{isMisconceptionCode(code) ? MISCONCEPTION_TITLES[code] : code}</span>
                <span>{count}</span>
              </li>
            ))}
            {patternAttempts.length === 0 && <li>Nog geen onjuiste spellingantwoorden beschikbaar.</li>}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
