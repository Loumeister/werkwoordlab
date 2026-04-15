"use client";

import { AppShell } from "@/components/app-shell";
import { useAttempts } from "@/lib/use-attempts";
import { getUnits } from "@/lib/content";
import { FEEDBACK_GROUPS } from "@/lib/feedback/misconceptions";
import type { MisconceptionCode } from "@/lib/feedback/misconceptions";
import { MISCONCEPTION_TITLES } from "@/lib/feedback/misconceptions";

/**
 * Mastery level per skill category based on attempt accuracy.
 * "onbekend" when fewer than 3 attempts exist (not enough data).
 */
type MasteryLevel = "sterk" | "groeiende" | "lastig" | "onbekend";

function getMasteryLevel(correct: number, total: number): MasteryLevel {
  if (total < 3) return "onbekend";
  const ratio = correct / total;
  if (ratio >= 0.8) return "sterk";
  if (ratio >= 0.5) return "groeiende";
  return "lastig";
}

const MASTERY_CONFIG: Record<MasteryLevel, { label: string; icon: string; color: string; bg: string; border: string }> = {
  sterk:     { label: "Sterk",    icon: "✓", color: "text-green-800",  bg: "bg-green-50",   border: "border-green-200" },
  groeiende: { label: "Groeiende", icon: "⚡", color: "text-amber-800",  bg: "bg-amber-50",   border: "border-amber-200" },
  lastig:    { label: "Nog lastig", icon: "○", color: "text-neutral-700", bg: "bg-neutral-50", border: "border-neutral-200" },
  onbekend:  { label: "Nog weinig data", icon: "–", color: "text-neutral-400", bg: "bg-neutral-50", border: "border-neutral-200" },
};

export default function GroeiPage() {
  const units = getUnits();
  const attempts = useAttempts();

  // Spelling-only attempts (exclude :function and :repair-detect)
  const spellingAttempts = attempts.filter(
    (a: import("@/lib/attempt-store").AttemptRecord) =>
      !a.itemId.endsWith(":function") && !a.itemId.endsWith(":repair-detect")
  );

  // Aggregate per subvaardigheid (misconception category)
  type SkillStats = {
    correct: number;
    total: number;
    codes: MisconceptionCode[];
    proofCorrect: number;
    proofTotal: number;
  };
  const skillStats: Record<string, SkillStats> = {};

  for (const group of FEEDBACK_GROUPS) {
    const groupAttempts = spellingAttempts.filter(
      (a: import("@/lib/attempt-store").AttemptRecord) =>
        (group.codes as string[]).includes(a.misconception)
    );
    const correct = groupAttempts.filter(
      (a: import("@/lib/attempt-store").AttemptRecord) => a.correct
    ).length;
    // Proof chip accuracy: only attempts where the chip was actually shown
    const proofAttempts = groupAttempts.filter(
      (a: import("@/lib/attempt-store").AttemptRecord) => a.proofCorrect !== undefined
    );
    const proofCorrect = proofAttempts.filter(
      (a: import("@/lib/attempt-store").AttemptRecord) => a.proofCorrect
    ).length;
    skillStats[group.label] = {
      correct,
      total: groupAttempts.length,
      codes: group.codes,
      proofCorrect,
      proofTotal: proofAttempts.length,
    };
  }

  // Focus tip: the lastig/groeiende skill with most attempts
  const focusEntry = Object.entries(skillStats)
    .filter(([, s]) => s.total >= 3 && getMasteryLevel(s.correct, s.total) !== "sterk")
    .sort((a, b) => b[1].total - a[1].total)[0];

  // Per-unit progress
  const unitProgress = units.map((unit) => {
    const unitAttempts = spellingAttempts.filter(
      (a: import("@/lib/attempt-store").AttemptRecord) => a.unitId === unit.id
    );
    const correct = unitAttempts.filter(
      (a: import("@/lib/attempt-store").AttemptRecord) => a.correct
    ).length;
    const total = unitAttempts.length;
    return { unit, correct, total, accuracy: total ? Math.round((correct / total) * 100) : 0 };
  });

  // Recent attempts (last 6, with readable labels)
  const recent = attempts.slice(0, 6);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">Mijn groei</h1>

        {/* Focus tip */}
        {focusEntry && (
          <div className="rounded-3xl border border-[var(--warm-primary)]/30 bg-orange-50 px-6 py-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">
              Focus voor nu
            </p>
            <p className="mt-1 text-lg font-semibold">{focusEntry[0]}</p>
            <p className="text-sm text-neutral-600">
              {focusEntry[1].correct} van {focusEntry[1].total} correct — blijf hier op oefenen.
            </p>
          </div>
        )}

        {/* Subvaardigheid mastery cards */}
        <section className="space-y-3 rounded-3xl border border-black/15 bg-white p-6">
          <h2 className="text-2xl font-semibold">Vaardigheden</h2>
          <p className="text-sm text-neutral-500">
            Gebaseerd op je antwoorden — minimaal 3 pogingen nodig voor een level.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {FEEDBACK_GROUPS.map((group) => {
              const stats = skillStats[group.label];
              const level = getMasteryLevel(stats.correct, stats.total);
              const cfg = MASTERY_CONFIG[level];

              // Show reasoning insight when spelling is OK but proof-chip accuracy is weak
              const reasoningWeak =
                stats.proofTotal >= 3 &&
                level !== "lastig" &&
                level !== "onbekend" &&
                stats.proofCorrect / stats.proofTotal < 0.6;

              return (
                <div
                  key={group.label}
                  className={`rounded-2xl border p-4 ${cfg.bg} ${cfg.border}`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`font-semibold ${cfg.color}`}>{group.label}</p>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${cfg.color} ${cfg.bg} border ${cfg.border}`}
                      aria-label={cfg.label}
                    >
                      {cfg.icon}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${cfg.color}`}>
                    {cfg.label}
                    {stats.total >= 3 && (
                      <span className="ml-1 font-normal opacity-70">
                        — {stats.correct}/{stats.total} correct
                      </span>
                    )}
                    {stats.total < 3 && stats.total > 0 && (
                      <span className="ml-1 font-normal opacity-70">
                        — {stats.total} poging{stats.total !== 1 ? "en" : ""}
                      </span>
                    )}
                    {stats.total === 0 && (
                      <span className="ml-1 font-normal opacity-70">— nog niet geoefend</span>
                    )}
                  </p>

                  {/* Reasoning insight: good spelling but unstable reasoning */}
                  {reasoningWeak && (
                    <p className="mt-2 text-xs text-amber-700">
                      Je schrijft het goed, maar de redenering is nog niet stabiel.
                    </p>
                  )}

                  {/* Progress bar (only when enough data) */}
                  {stats.total >= 3 && (
                    <div className="mt-2 h-2 w-full rounded-full bg-black/10">
                      <div
                        className="h-full rounded-full bg-current transition-all duration-500"
                        style={{ width: `${Math.round((stats.correct / stats.total) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Unit progress */}
        <section className="space-y-3 rounded-3xl border border-black/15 bg-white p-6">
          <h2 className="text-2xl font-semibold">Voortgang per unit</h2>
          {unitProgress.map(({ unit, correct, total, accuracy }) => (
            <div key={unit.id} className="space-y-2 rounded-2xl border border-neutral-200 p-4">
              <p className="text-lg font-semibold">{unit.title}</p>
              {total > 0 ? (
                <>
                  <p className="text-base">
                    {total} pogingen · {accuracy}% correct
                  </p>
                  <div className="h-3 rounded-full bg-neutral-200">
                    <div
                      className="h-3 rounded-full bg-[var(--warm-primary)] transition-all duration-500"
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-neutral-400">Nog niet geoefend</p>
              )}
            </div>
          ))}
        </section>

        {/* Recent attempts with readable labels */}
        {recent.length > 0 && (
          <section className="space-y-3 rounded-3xl border border-black/15 bg-white p-6">
            <h2 className="text-2xl font-semibold">Recente pogingen</h2>
            <ul className="space-y-2 text-base">
              {recent.map((attempt) => {
                const code = attempt.misconception as MisconceptionCode;
                const label =
                  attempt.itemId.endsWith(":function")
                    ? "Functie bepalen"
                    : MISCONCEPTION_TITLES[code] ?? attempt.misconception;

                return (
                  <li
                    key={`${attempt.timestamp}-${attempt.itemId}`}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                      attempt.correct
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <span className={attempt.correct ? "text-green-800" : "text-red-800"}>
                      {label}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        attempt.correct ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {attempt.correct ? "✓ correct" : "✗ fout"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {attempts.length === 0 && (
          <div className="rounded-3xl border border-black/15 bg-white px-6 py-12 text-center">
            <p className="text-xl font-semibold">Nog geen pogingen</p>
            <p className="mt-2 text-neutral-500">
              Begin met oefenen om hier je groei te zien.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
