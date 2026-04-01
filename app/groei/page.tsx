"use client";

import { AppShell } from "@/components/app-shell";
import { readAttempts } from "@/lib/attempt-store";
import { getUnits } from "@/lib/content";

export default function GroeiPage() {
  const units = getUnits();
  const attempts = readAttempts();

  const byMisconception = attempts.reduce<Record<string, number>>((acc, attempt) => {
    acc[attempt.misconception] = (acc[attempt.misconception] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">Mijn groei</h1>

        <section className="space-y-3 rounded-3xl border border-black/15 bg-white p-6">
          <h2 className="text-2xl font-semibold">Voortgang per unit</h2>
          {units.map((unit) => {
            const unitAttempts = attempts.filter((attempt) => attempt.unitId === unit.id);
            const correct = unitAttempts.filter((attempt) => attempt.correct).length;
            const accuracy = unitAttempts.length ? Math.round((correct / unitAttempts.length) * 100) : 0;

            return (
              <div key={unit.id} className="space-y-2 rounded-2xl border border-neutral-200 p-4">
                <p className="text-lg font-semibold">{unit.title}</p>
                <p className="text-base">{unitAttempts.length} pogingen · {accuracy}% correct</p>
                <div className="h-3 rounded-full bg-neutral-200">
                  <div className="h-3 rounded-full bg-[var(--warm-primary)]" style={{ width: `${accuracy}%` }} />
                </div>
              </div>
            );
          })}
        </section>

        <section className="space-y-3 rounded-3xl border border-black/15 bg-white p-6">
          <h2 className="text-2xl font-semibold">Misconcepties</h2>
          <ul className="space-y-2 text-lg">
            {Object.entries(byMisconception).map(([code, count]) => (
              <li key={code} className="flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3">
                <span>{code}</span>
                <span>{count}</span>
              </li>
            ))}
            {attempts.length === 0 && <li>Nog geen pogingen opgeslagen.</li>}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
