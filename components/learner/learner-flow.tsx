"use client";

import { useMemo, useState } from "react";
import type { Unit, ExerciseItem } from "@/lib/content";
import { isContrastPairItem } from "@/lib/content";
import type { AttemptRecord } from "@/lib/attempt-store";
import { readAttempts } from "@/lib/attempt-store";
import { groupItemsByPhase } from "@/lib/phase-engine";
import type { PhaseId } from "@/lib/content";
import { MasteryExercise } from "./mastery-exercise";
import { ContrastPairExercise } from "./contrast-pair-exercise";
import { PhaseTransitionBanner } from "./phase-transition-banner";
import { TransferTaskPanel } from "./transfer-task-panel";

type ActivePhase = "verkennen" | "oefenen" | "zelfstandig";
const PHASE_SEQUENCE: ActivePhase[] = ["verkennen", "oefenen", "zelfstandig"];

function nextPhase(current: ActivePhase): ActivePhase | "transfer" {
  const i = PHASE_SEQUENCE.indexOf(current);
  return i < PHASE_SEQUENCE.length - 1 ? PHASE_SEQUENCE[i + 1] : "transfer";
}

export function LearnerFlow({ unit }: { unit: Unit }) {
  const phaseGroups = useMemo(() => groupItemsByPhase(unit.items), [unit.items]);

  // Find a phase with at least one item, defaulting to first non-empty phase
  const initialPhase = useMemo((): ActivePhase => {
    for (const p of PHASE_SEQUENCE) {
      if (phaseGroups[p].length > 0) return p;
    }
    return "verkennen";
  }, [phaseGroups]);

  const [phase, setPhase] = useState<ActivePhase>(initialPhase);
  const [phaseItemIndex, setPhaseItemIndex] = useState(0);
  const [showPhaseTransition, setShowPhaseTransition] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<PhaseId>("oefenen");
  const [showTransfer, setShowTransfer] = useState(false);
  const [showFinished, setShowFinished] = useState(false);
  const [allAttempts, setAllAttempts] = useState<AttemptRecord[]>(() => readAttempts());

  // -------------------------------------------------------------------------
  // Derived current item
  // -------------------------------------------------------------------------

  const currentIndices = phaseGroups[phase];
  const globalIndex = currentIndices[phaseItemIndex] ?? 0;
  const item = unit.items[globalIndex];

  // Progress within current phase
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

  function handleContrastComplete() {
    handleItemComplete();
  }

  function handleContinueFromTransition() {
    setShowPhaseTransition(false);

    if (transitionTarget === "transfer") {
      setShowTransfer(true);
      return;
    }

    // Skip to next non-empty phase
    let candidate: ActivePhase | "transfer" = transitionTarget as ActivePhase;
    while (candidate !== "transfer") {
      const phase = candidate as ActivePhase;
      if (phaseGroups[phase].length > 0) {
        setPhase(phase);
        setPhaseItemIndex(0);
        return;
      }
      candidate = nextPhase(phase);
    }

    // All active phases exhausted → transfer
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

      {/* Phase label + progress */}
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

      {/* Exercise routing */}
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
