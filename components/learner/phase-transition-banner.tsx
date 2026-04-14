"use client";

import { CheckCircle2 } from "lucide-react";
import { PHASE_CONFIGS } from "@/lib/phase-engine";
import type { PhaseId } from "@/lib/content";

type Props = {
  completedPhase: PhaseId;
  nextPhase: PhaseId;
  onContinue: () => void;
};

const PHASE_ORDER: PhaseId[] = ["verkennen", "oefenen", "zelfstandig", "transfer"];

/**
 * Shown between phases. Includes a visual stepper (all four phases), a
 * motivational message for the next phase, and a continue button.
 */
export function PhaseTransitionBanner({ completedPhase, nextPhase, onContinue }: Props) {
  const completedIndex = PHASE_ORDER.indexOf(completedPhase);

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8 text-center">
      {/* Phase stepper */}
      <nav aria-label="Voortgang fases" className="flex items-center justify-center gap-2">
        {PHASE_ORDER.map((phase, i) => {
          const isDone = i <= completedIndex;
          const isCurrent = phase === nextPhase;

          return (
            <div key={phase} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    isDone
                      ? "bg-green-500 text-white"
                      : isCurrent
                      ? "bg-[var(--warm-primary)] text-white ring-2 ring-[var(--warm-primary)] ring-offset-2"
                      : "bg-neutral-200 text-neutral-500"
                  }`}
                  aria-label={`${PHASE_CONFIGS[phase].label}${isDone ? " (voltooid)" : isCurrent ? " (huidig)" : ""}`}
                >
                  {isDone ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isDone
                      ? "text-green-600"
                      : isCurrent
                      ? "text-[var(--warm-primary)]"
                      : "text-neutral-400"
                  }`}
                >
                  {PHASE_CONFIGS[phase].label}
                </span>
              </div>

              {i < PHASE_ORDER.length - 1 && (
                <div
                  className={`mb-4 h-0.5 w-8 rounded-full transition-colors ${
                    isDone ? "bg-green-400" : "bg-neutral-200"
                  }`}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </nav>

      {/* Celebration + description */}
      <div className="rounded-3xl border border-[#f0c972] bg-[#fff9ea] px-8 py-10 shadow-sm">
        <p className="text-4xl" aria-hidden>
          🎉
        </p>
        <h2 className="mt-3 text-2xl font-bold">
          {PHASE_CONFIGS[completedPhase].label} voltooid!
        </h2>
        <p className="mt-2 text-lg text-neutral-600">
          {PHASE_CONFIGS[nextPhase].description}
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="mt-6 rounded-xl bg-[var(--warm-primary)] px-6 py-3 font-semibold text-white hover:opacity-90"
        >
          Ga door naar {PHASE_CONFIGS[nextPhase].label}
        </button>
      </div>
    </div>
  );
}
