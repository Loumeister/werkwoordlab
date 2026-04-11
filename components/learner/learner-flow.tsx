"use client";

import { useMemo, useState } from "react";
import type { Unit, ExerciseItem, PhaseId } from "@/lib/content";
import { isContrastPairItem } from "@/lib/content";
import type { AttemptRecord } from "@/lib/attempt-store";
import { readAttempts } from "@/lib/attempt-store";
import { groupItemsByPhase } from "@/lib/phase-engine";
import { MasteryExercise } from "./mastery-exercise";
import { ContrastPairExercise } from "./contrast-pair-exercise";
import { PhaseTransitionBanner } from "./phase-transition-banner";
import { TransferTaskPanel } from "./transfer-task-panel";

/**
 * "transfer" is excluded from ActivePhase because it is not an exercise phase
 * — it's a final task rendered by TransferTaskPanel, not part of the phase loop.
 * The separate type prevents accidentally routing to "transfer" via setPhase().
 */
type ActivePhase = "verkennen" | "oefenen" | "zelfstandig";
const PHASE_SEQUENCE: ActivePhase[] = ["verkennen", "oefenen", "zelfstandig"];

/** Returns the next phase in sequence, or "transfer" after the last active phase. */
function nextPhase(current: ActivePhase): ActivePhase | "transfer" {
  const i = PHASE_SEQUENCE.indexOf(current);
  return i < PHASE_SEQUENCE.length - 1 ? PHASE_SEQUENCE[i + 1] : "transfer";
}

/**
 * Phase-aware exercise orchestrator.
 *
 * Flow: Verkennen → [banner] → Oefenen → [banner] → Zelfstandig → [banner] → Transfer → Finished
 *
 * State model:
 * - `phase` + `phaseItemIndex` identify the current item within the active phase.
 * - `globalIndex` maps (phase, phaseItemIndex) → unit.items index via `phaseGroups`.
 * - After each item, `allAttempts` is refreshed from localStorage so subsequent
 *   items benefit from updated mastery state (MasteryExercise uses this for getEntryMode).
 * - The progress bar is scoped to the current phase and resets at each transition.
 */
export function LearnerFlow({ unit }: { unit: Unit }) {
  const phaseGroups = useMemo(() => groupItemsByPhase(unit.items), [unit.items]);

  // Start at the first phase that has at least one item.
  // In practice all units have verkennen items, but empty phases are safe.
  const initialPhase = useMemo((): ActivePhase => {
    for (const p of PHASE_SEQUENCE) {
      if (phaseGroups[p].length > 0) return p;
    }
    return "verkennen";
  }, [phaseGroups]);

  const [phase, setPhase] = useState<ActivePhase>(initialPhase);
  const [phaseItemIndex, setPhaseItemIndex] = useState(0);
  const [showPhaseTransition, setShowPhaseTransition] = useState(false);
  // transitionTarget is set before the banner is shown so the banner can read
  // the correct next phase without recalculating it inside the render.
  const [transitionTarget, setTransitionTarget] = useState<PhaseId>("oefenen");
  const [showTransfer, setShowTransfer] = useState(false);
  const [showFinished, setShowFinished] = useState(false);
  // allAttempts is read from localStorage on mount and refreshed after each
  // item submission so MasteryExercise always sees the latest mastery state.
  const [allAttempts, setAllAttempts] = useState<AttemptRecord[]>(() => readAttempts());

  // -------------------------------------------------------------------------
  // Derived current item
  // -------------------------------------------------------------------------

  // phaseGroups[phase] holds the global item indices for this phase in order.
  const currentIndices = phaseGroups[phase];
  // Fallback to 0 is a safety net; phaseItemIndex is always < currentIndices.length
  // during normal navigation (guarded by isLastInPhase in handleItemComplete).
  const globalIndex = currentIndices[phaseItemIndex] ?? 0;
  const item = unit.items[globalIndex];

  // Progress within the current phase (0–100). Resets when the phase changes.
  const phaseProgress =
    currentIndices.length > 0
      ? Math.round(((phaseItemIndex + 1) / currentIndices.length) * 100)
      : 0;

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------

  function refreshAttempts() {
    setAllAttempts(readAttempts());
  }

  function handleItemComplete() {
    // Re-read localStorage so the next item sees any mastery gained on this one.
    refreshAttempts();

    const isLastInPhase = phaseItemIndex >= currentIndices.length - 1;

    if (isLastInPhase) {
      const next = nextPhase(phase);
      setTransitionTarget(next);
      setShowPhaseTransition(true);
    } else {
      setPhaseItemIndex((n) => n + 1);
    }
  }

  // ContrastPairExercise reports (aCorrect, bCorrect) but the orchestrator only
  // needs to know "done" — individual correctness is handled inside the component.
  function handleContrastComplete() {
    handleItemComplete();
  }

  function handleContinueFromTransition() {
    setShowPhaseTransition(false);

    if (transitionTarget === "transfer") {
      setShowTransfer(true);
      return;
    }

    // Advance to the next non-empty phase. A phase can be empty when a unit
    // author assigns all items to specific phases and leaves one phase blank.
    let candidate: ActivePhase | "transfer" = transitionTarget as ActivePhase;
    while (candidate !== "transfer") {
      const candidatePhase = candidate as ActivePhase;
      if (phaseGroups[candidatePhase].length > 0) {
        setPhase(candidatePhase);
        setPhaseItemIndex(0);
        return;
      }
      candidate = nextPhase(candidatePhase);
    }

    // All active phases exhausted (every phase after current is empty) → transfer.
    setShowTransfer(true);
  }

  function handleTransferFinish() {
    setShowFinished(true);
  }

  // -------------------------------------------------------------------------
  // Render: finished
  // -------------------------------------------------------------------------

  if (showFinished) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center">
        <p className="text-5xl" aria-hidden>
          🎓
        </p>
        <h2 className="mt-4 text-3xl font-bold">Unit voltooid!</h2>
        <p className="mt-2 text-lg text-neutral-600">
          Je hebt alle oefeningen en de transfertaak afgerond. Goed gedaan!
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: transfer task
  // -------------------------------------------------------------------------

  if (showTransfer) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">{unit.title}</h1>
        <TransferTaskPanel
          task={unit.transferTask}
          unitTitle={unit.title}
          onFinish={handleTransferFinish}
        />
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: phase transition banner
  // -------------------------------------------------------------------------

  if (showPhaseTransition) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">{unit.title}</h1>
        <PhaseTransitionBanner
          completedPhase={phase}
          nextPhase={transitionTarget}
          onContinue={handleContinueFromTransition}
        />
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: active exercise
  // -------------------------------------------------------------------------

  if (!item) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight">{unit.title}</h1>

      {/* Phase label + within-phase progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span className="font-medium capitalize">{phase}</span>
          <span>
            {phaseItemIndex + 1} / {currentIndices.length}
          </span>
        </div>
        <div
          className="h-3 w-full overflow-hidden rounded-full bg-neutral-200"
          aria-label={`Voortgang ${phase}`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={phaseProgress}
        >
          <div
            className="h-full rounded-full bg-[var(--warm-primary)] transition-all duration-300"
            style={{ width: `${phaseProgress}%` }}
          />
        </div>
      </div>

      {/*
       * Exercise routing: contrast-pair items render as a two-column exercise;
       * all other items render as MasteryExercise (which handles full/spell-first/
       * independent modes internally via getEntryMode).
       * The key prop forces a full remount on each new item so all internal state
       * (stage, answers, feedback) resets cleanly.
       */}
      {isContrastPairItem(item) ? (
        <ContrastPairExercise
          key={`${phase}-${phaseItemIndex}`}
          item={item}
          unitId={unit.id}
          onComplete={handleContrastComplete}
        />
      ) : (
        <MasteryExercise
          key={`${phase}-${phaseItemIndex}`}
          item={item as ExerciseItem}
          unitId={unit.id}
          attempts={allAttempts}
          onComplete={handleItemComplete}
        />
      )}
    </div>
  );
}
