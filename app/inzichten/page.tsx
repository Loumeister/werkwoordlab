"use client";

import { AppShell } from "@/components/app-shell";
import { useAttempts } from "@/lib/use-attempts";
import { getUnits } from "@/lib/content";

export default function InzichtenPage() {
  const attempts = useAttempts();
  const units = getUnits();

  const misconceptionCounts = attempts.reduce<Record<string, number>>((acc, item) => {
    acc[item.misconception] = (acc[item.misconception] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">Inzichten (docent)</h1>

        <section className="rounded-3xl border border-black/15 bg-white p-6">
          <h2 className="text-2xl font-semibold">Accuratesse per unit</h2>
          <ul className="mt-4 space-y-3 text-lg">
            {units.map((unit) => {
              const unitAttempts = attempts.filter((attempt) => attempt.unitId === unit.id);
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
          <h2 className="text-2xl font-semibold">Misconceptieverdeling</h2>
          <ul className="mt-4 space-y-2 text-lg">
            {Object.entries(misconceptionCounts).map(([code, count]) => (
              <li key={code} className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3">
                <span>{code}</span>
                <span>{count}</span>
              </li>
            ))}
            {attempts.length === 0 && <li>Nog geen klasdata beschikbaar.</li>}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
