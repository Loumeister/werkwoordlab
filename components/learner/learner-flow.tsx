"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Unit, ExerciseItem, PhaseId } from "@/lib/content";
import { isContrastPairItem } from "@/lib/content";
import type { AttemptRecord } from "@/lib/attempt-store";
import { readAttempts } from "@/lib/attempt-store";
import { groupItemsByPhase, PHASE_CONFIGS } from "@/lib/phase-engine";
import { buildRepairItem, shouldUseRepair } from "@/lib/repair-generator";
import type { MisconceptionCode } from "@/lib/feedback/misconceptions";
import { isMisconceptionCode } from "@/lib/feedback/misconceptions";
import { getEffectiveFeedback } from "@/lib/feedback/feedbackLookup";
import { isRichFeedbackEntry } from "@/lib/feedback/types";
import { MISCONCEPTION_TITLES } from "@/lib/feedback/misconceptions";
import { MasteryExercise } from "./mastery-exercise";
import { ContrastPairExercise } from "./contrast-pair-exercise";
import { RepairExercise } from "./repair-exercise";
import { PhaseTransitionBanner } from "./phase-transition-banner";
import { TransferTaskPanel } from "./transfer-task-panel";

type ActivePhase = "verkennen" | "oefenen" | "zelfstandig";
const PHASE_SEQUENCE: ActivePhase[] = ["verkennen", "oefenen", "zelfstandig"];

function nextPhase(current: ActivePhase): ActivePhase | "transfer" {
  const i = PHASE_SEQUENCE.indexOf(current);
  return i < PHASE_SEQUENCE.length - 1 ? PHASE_SEQUENCE[i + 1] : "transfer";
}

/**
 * Phase-aware exercise orchestrator.
 *
 * Flow: Verkennen → [banner] → Oefenen → [banner] → Zelfstandig → [banner] → Transfer → Reflectiekaart
 *
 * Repair exercises are woven into the oefenen/zelfstandig phases adaptively:
 * - shouldUseRepair() decides per item whether to show repair mode
 * - repairCountInPhase tracks the cap (≤30% of phase)
 * - lastWasRepair prevents two repair items in a row
 */
export function LearnerFlow({ unit }: { unit: Unit }) {
  const phaseGroups = useMemo(() => groupItemsByPhase(unit.items), [unit.items]);

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

  // Repair tracking
  const [repairCountInPhase, setRepairCountInPhase] = useState(0);
  const [lastWasRepair, setLastWasRepair] = useState(false);

  // ─── Derived current item ─────────────────────────────────────────────────

  const currentIndices = phaseGroups[phase];
  const globalIndex = currentIndices[phaseItemIndex] ?? 0;
  const item = unit.items[globalIndex];

  // Determine if this item should render as a repair exercise
  const repairItem = useMemo(() => {
    if (!item || isContrastPairItem(item)) return null;
    const ex = item as ExerciseItem;
    const unitAttempts = allAttempts.filter((a) => a.unitId === unit.id);
    if (
      shouldUseRepair(
        ex,
        phase,
        unitAttempts,
        repairCountInPhase,
        currentIndices.length,
        lastWasRepair
      )
    ) {
      return buildRepairItem(ex);
    }
    return null;
  }, [item, phase, allAttempts, repairCountInPhase, currentIndices.length, lastWasRepair, unit.id]);

  const phaseProgress =
    currentIndices.length > 0
      ? Math.round(((phaseItemIndex + 1) / currentIndices.length) * 100)
      : 0;

  // ─── Navigation ───────────────────────────────────────────────────────────

  function refreshAttempts() {
    setAllAttempts(readAttempts());
  }

  function handleItemComplete(wasRepair: boolean) {
    refreshAttempts();

    if (wasRepair) {
      setRepairCountInPhase((n) => n + 1);
      setLastWasRepair(true);
    } else {
      setLastWasRepair(false);
    }

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
    setLastWasRepair(false);
    handleItemComplete(false);
  }

  function handleContinueFromTransition() {
    setShowPhaseTransition(false);

    if (transitionTarget === "transfer") {
      setShowTransfer(true);
      return;
    }

    // Reset repair counters for the new phase
    setRepairCountInPhase(0);
    setLastWasRepair(false);

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

    setShowTransfer(true);
  }

  function handleTransferFinish() {
    setShowFinished(true);
  }

  // ─── Render: reflectiekaart (vervangt "Unit voltooid!") ───────────────────

  if (showFinished) {
    const unitAttempts = allAttempts.filter((a) => a.unitId === unit.id);

    // Group spelling attempts by misconception code (exclude function/repair-detect)
    const wrongByCode: Record<string, number> = {};
    const correctByCode: Record<string, number> = {};

    for (const attempt of unitAttempts) {
      if (attempt.itemId.endsWith(":function") || attempt.itemId.endsWith(":repair-detect")) {
        continue;
      }
      const code = attempt.misconception;
      if (attempt.correct) {
        correctByCode[code] = (correctByCode[code] ?? 0) + 1;
      } else {
        wrongByCode[code] = (wrongByCode[code] ?? 0) + 1;
      }
    }

    const totalCorrect = Object.values(correctByCode).reduce((a, b) => a + b, 0);
    const totalAttempts = unitAttempts.filter(
      (a) => !a.itemId.endsWith(":function") && !a.itemId.endsWith(":repair-detect")
    ).length;

    // Worst-performing misconception code
    const worstCode = Object.entries(wrongByCode).sort((a, b) => b[1] - a[1])[0]?.[0];
    const worstRawCode = worstCode && isMisconceptionCode(worstCode) ? worstCode as MisconceptionCode : undefined;
    const worstFeedback = worstRawCode ? getEffectiveFeedback(worstRawCode) : undefined;
    const worstLabel = worstCode ? (MISCONCEPTION_TITLES[worstCode as MisconceptionCode] ?? worstCode) : null;

    // Best-performing code
    const allCodes = new Set([...Object.keys(wrongByCode), ...Object.keys(correctByCode)]);
    let bestCode: string | null = null;
    let bestAccuracy = -1;
    for (const code of allCodes) {
      const c = correctByCode[code] ?? 0;
      const w = wrongByCode[code] ?? 0;
      const total = c + w;
      if (total >= 2) {
        const acc = c / total;
        if (acc > bestAccuracy) {
          bestAccuracy = acc;
          bestCode = code;
        }
      }
    }
    const bestLabel = bestCode ? (MISCONCEPTION_TITLES[bestCode as MisconceptionCode] ?? bestCode) : null;

    return (
      <div className="animate-bounce-in mx-auto max-w-2xl space-y-6 py-10 text-center">
        <p className="text-6xl" aria-hidden>
          🎓
        </p>
        <h2 className="text-3xl font-bold">Unit voltooid!</h2>
        <p className="text-lg text-neutral-600">{unit.title}</p>

        {/* Reflection card */}
        <div className="space-y-3 rounded-3xl border border-black/10 bg-white p-6 text-left">
          {bestLabel && bestAccuracy >= 0.8 && (
            <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
              <span className="text-xl" aria-hidden>✓</span>
              <p className="text-base">
                <strong>Gaat al goed:</strong> {bestLabel}
              </p>
            </div>
          )}

          {worstLabel && (wrongByCode[worstCode!] ?? 0) > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <span className="text-xl" aria-hidden>⚡</span>
              <p className="text-base">
                <strong>Nog oefenen:</strong> {worstLabel} ({wrongByCode[worstCode!]} keer fout)
              </p>
            </div>
          )}

          {worstFeedback && isRichFeedbackEntry(worstFeedback) && (
            <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
              <span className="text-xl" aria-hidden>💡</span>
              <p className="text-base">
                <strong>Tip:</strong> {worstFeedback.herstelvraag}
              </p>
            </div>
          )}

          {totalAttempts > 0 && (
            <p className="text-center text-sm text-neutral-500">
              {totalCorrect} van {totalAttempts} pogingen correct
            </p>
          )}
        </div>

        <Link
          href="/groei"
          className="inline-block rounded-xl bg-[var(--warm-primary)] px-6 py-3 font-semibold text-white hover:opacity-90"
        >
          Bekijk je vaardigheden →
        </Link>
      </div>
    );
  }

  // ─── Render: transfer task ────────────────────────────────────────────────

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

  // ─── Render: phase transition banner ─────────────────────────────────────

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

  // ─── Render: active exercise ──────────────────────────────────────────────

  if (!item) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight">{unit.title}</h1>

      {/* Phase label + animated progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span className="font-medium">{PHASE_CONFIGS[phase].label}</span>
          <span>
            {phaseItemIndex + 1} / {currentIndices.length}
          </span>
        </div>
        <div
          className="h-3 w-full overflow-hidden rounded-full bg-neutral-200"
          aria-label={`Voortgang ${PHASE_CONFIGS[phase].label}`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={phaseProgress}
        >
          <div
            className="h-full rounded-full bg-[var(--warm-primary)]"
            style={{
              width: `${phaseProgress}%`,
              transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
        </div>
      </div>

      {/* Exercise routing */}
      {repairItem ? (
        <RepairExercise
          key={`repair-${phase}-${phaseItemIndex}`}
          repairItem={repairItem}
          unitId={unit.id}
          onComplete={() => handleItemComplete(true)}
        />
      ) : isContrastPairItem(item) ? (
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
          onComplete={() => handleItemComplete(false)}
        />
      )}
    </div>
  );
}
