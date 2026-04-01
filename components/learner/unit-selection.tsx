"use client";

import Link from "next/link";
import { getUnits } from "@/lib/content";
import { useAttempts } from "@/lib/use-attempts";

export function UnitSelection() {
  const units = getUnits();
  const attempts = useAttempts();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <h1 className="text-4xl font-semibold tracking-tight">Oefenen</h1>
      <div className="space-y-4">
        {units.map((unit, index) => {
          const unitAttempts = attempts.filter((attempt) => attempt.unitId === unit.id);
          const hasProgress = unitAttempts.length > 0;
          const completedIds = new Set(unitAttempts.filter((attempt) => attempt.correct).map((attempt) => attempt.itemId));

          return (
            <article key={unit.id} className={`rounded-3xl border border-black/20 p-6 ${index % 2 === 0 ? "bg-[#ffe08b]" : "bg-[#d8c4ff]"}`}>
              <h2 className="text-2xl font-semibold">{unit.title}</h2>
              <p className="mt-2 text-lg text-black/80">{unit.learningGoals[0]}</p>
              <p className="mt-3 text-base text-black/70">Voortgang: {completedIds.size}/{unit.items.length} afgerond</p>
              <div className="mt-2 h-3 rounded-full bg-black/15">
                <div className="h-full rounded-full bg-[var(--warm-primary)]" style={{ width: `${Math.round((completedIds.size / unit.items.length) * 100)}%` }} />
              </div>
              <Link href={`/oefenen/${unit.id}`} className="mt-4 inline-block rounded-xl bg-[var(--warm-primary)] px-4 py-3 font-semibold text-white">
                {hasProgress ? "Ga verder" : "Start"}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
