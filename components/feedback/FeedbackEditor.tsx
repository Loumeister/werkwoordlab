"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Download, RotateCcw } from "lucide-react";
import {
  type FeedbackEntry,
  type RichFeedbackEntry,
  isRichFeedbackEntry,
} from "@/lib/feedback/types";
import {
  type MisconceptionCode,
  MISCONCEPTION_TITLES,
  FEEDBACK_GROUPS,
} from "@/lib/feedback/misconceptions";
import { BUILT_IN_FEEDBACK } from "@/lib/feedback/builtInFeedback";
import {
  getFeedbackOverrides,
  setFeedbackOverride,
  resetFeedbackOverride,
  clearAllFeedbackOverrides,
  exportFeedbackOverrides,
} from "@/lib/feedback/feedbackOverrides";

// ---------------------------------------------------------------------------
// Field sub-component
// ---------------------------------------------------------------------------

function Field({
  label,
  hint,
  value,
  rows = 2,
  multiline = true,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  rows?: number;
  multiline?: boolean;
  onChange: (v: string) => void;
}) {
  const fieldId = useId();

  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-sm font-semibold text-neutral-700">
        {label}
        {hint && <span className="ml-2 font-normal text-neutral-400">{hint}</span>}
      </label>
      {multiline ? (
        <textarea
          id={fieldId}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm leading-relaxed focus:border-[var(--focus-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--focus-blue)]"
        />
      ) : (
        <input
          id={fieldId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-[var(--focus-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--focus-blue)]"
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MisconceptionCard
// ---------------------------------------------------------------------------

function MisconceptionCard({
  code,
  overrides,
  onSave,
  onReset,
}: {
  code: MisconceptionCode;
  overrides: Partial<Record<MisconceptionCode, FeedbackEntry>>;
  onSave: (code: MisconceptionCode, value: FeedbackEntry) => void;
  onReset: (code: MisconceptionCode) => void;
}) {
  const builtIn = BUILT_IN_FEEDBACK[code];
  const override = overrides[code];
  const effective = override ?? builtIn;
  const isOverridden = override !== undefined;

  // Determine default mode from the effective entry
  const defaultMode = isRichFeedbackEntry(effective) ? "rich" : "plain";
  const [mode, setMode] = useState<"plain" | "rich">(defaultMode);

  // Plain draft
  const [plainDraft, setPlainDraft] = useState(
    typeof effective === "string" ? effective : ""
  );

  // Rich draft — initialised from effective entry
  const effectiveRich: RichFeedbackEntry = isRichFeedbackEntry(effective)
    ? effective
    : { herstelvraag: "", sleutelwoord: "", uitleg: { diagnose: "", redenering: "", herprobeer: "" } };

  const [richDraft, setRichDraft] = useState<RichFeedbackEntry>(effectiveRich);

  // Dirty state: has the draft diverged from the saved override (or built-in if no override)?
  const savedEntry = override ?? builtIn;
  const currentDraft: FeedbackEntry = mode === "plain" ? plainDraft : richDraft;
  const isDirty = JSON.stringify(currentDraft) !== JSON.stringify(savedEntry);

  const [savedFlash, setSavedFlash] = useState(false);
  const savedFlashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (savedFlashTimeoutRef.current !== null) {
        clearTimeout(savedFlashTimeoutRef.current);
      }
    };
  }, []);

  // Sync drafts when override changes externally (e.g. after reset-all)
  useEffect(() => {
    const eff = overrides[code] ?? builtIn;
    if (isRichFeedbackEntry(eff)) {
      setRichDraft(eff);
      setMode("rich");
    } else {
      setPlainDraft(typeof eff === "string" ? eff : "");
      setMode("plain");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides, code]);

  function handleSave() {
    const value: FeedbackEntry = mode === "plain" ? plainDraft : richDraft;
    onSave(code, value);
    setSavedFlash(true);
    if (savedFlashTimeoutRef.current !== null) {
      clearTimeout(savedFlashTimeoutRef.current);
    }
    savedFlashTimeoutRef.current = setTimeout(() => {
      setSavedFlash(false);
      savedFlashTimeoutRef.current = null;
    }, 1200);
  }

  function updateRich(field: keyof RichFeedbackEntry | `uitleg.${keyof RichFeedbackEntry["uitleg"]}`, value: string) {
    if (field.startsWith("uitleg.")) {
      const subfield = field.slice(7) as keyof RichFeedbackEntry["uitleg"];
      setRichDraft((prev) => ({ ...prev, uitleg: { ...prev.uitleg, [subfield]: value } }));
    } else {
      setRichDraft((prev) => ({ ...prev, [field]: value }));
    }
  }

  return (
    <div
      className={`rounded-2xl border p-5 transition-colors ${
        isOverridden ? "border-amber-400 bg-amber-50" : "border-neutral-200 bg-white"
      }`}
    >
      {/* Header row */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-base font-semibold text-neutral-800">{MISCONCEPTION_TITLES[code]}</p>
          <p className="mt-0.5 font-mono text-xs text-neutral-400">{code}</p>
        </div>
        <div className="flex items-center gap-2">
          {isOverridden && (
            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-800">
              Aangepast
            </span>
          )}
          {isDirty && !savedFlash && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              Niet opgeslagen
            </span>
          )}
          {savedFlash && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
              ✓ Opgeslagen
            </span>
          )}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("plain")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            mode === "plain"
              ? "bg-neutral-800 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          Eenvoudig
        </button>
        <button
          type="button"
          onClick={() => setMode("rich")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            mode === "rich"
              ? "bg-neutral-800 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          Uitgebreid
        </button>
      </div>

      {/* Edit form */}
      <div className="space-y-3">
        {mode === "plain" && (
          <Field
            label="Feedbacktekst"
            hint="korte hint voor de leerling"
            value={plainDraft}
            rows={2}
            onChange={setPlainDraft}
          />
        )}

        {mode === "rich" && (
          <>
            <Field
              label="Herstelvraag"
              hint="max. ~15 woorden"
              value={richDraft.herstelvraag}
              rows={2}
              onChange={(v) => updateRich("herstelvraag", v)}
            />
            <Field
              label="Sleutelwoord"
              hint="één woord uit herstelvraag"
              value={richDraft.sleutelwoord}
              rows={1}
              multiline={false}
              onChange={(v) => updateRich("sleutelwoord", v)}
            />
            <Field
              label="Diagnose"
              hint="wat ging er waarschijnlijk mis"
              value={richDraft.uitleg.diagnose}
              rows={2}
              onChange={(v) => updateRich("uitleg.diagnose", v)}
            />
            <Field
              label="Redenering"
              hint="de grammaticaregel in 1-2 zinnen"
              value={richDraft.uitleg.redenering}
              rows={3}
              onChange={(v) => updateRich("uitleg.redenering", v)}
            />
            <Field
              label="Herprobeer"
              hint="één concrete actie voor de leerling"
              value={richDraft.uitleg.herprobeer}
              rows={2}
              onChange={(v) => updateRich("uitleg.herprobeer", v)}
            />
          </>
        )}
      </div>

      {/* Action row */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty}
          className="rounded-xl bg-[var(--warm-primary)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Opslaan
        </button>
        {isOverridden && (
          <button
            type="button"
            onClick={() => onReset(code)}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50"
          >
            Reset naar origineel
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FeedbackEditor
// ---------------------------------------------------------------------------

export function FeedbackEditor() {
  const [overrides, setOverrides] = useState<Partial<Record<MisconceptionCode, FeedbackEntry>>>({});
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(FEEDBACK_GROUPS.map((g) => g.label)));
  const [resetAllConfirm, setResetAllConfirm] = useState(false);

  // Load overrides from localStorage on mount
  useEffect(() => {
    setOverrides(getFeedbackOverrides());
  }, []);

  function handleSave(code: MisconceptionCode, value: FeedbackEntry) {
    setFeedbackOverride(code, value);
    setOverrides(getFeedbackOverrides());
  }

  function handleReset(code: MisconceptionCode) {
    resetFeedbackOverride(code);
    setOverrides(getFeedbackOverrides());
  }

  function handleResetAll() {
    if (!resetAllConfirm) {
      setResetAllConfirm(true);
      return;
    }
    clearAllFeedbackOverrides();
    setOverrides({});
    setResetAllConfirm(false);
  }

  function handleExport() {
    const json = exportFeedbackOverrides();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "feedback-aanpassingen.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleGroup(label: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  const overrideCount = Object.keys(overrides).length;

  // Filter helper: does this misconception match the search query?
  function matchesSearch(code: MisconceptionCode): boolean {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const title = MISCONCEPTION_TITLES[code].toLowerCase();
    const entry = overrides[code] ?? BUILT_IN_FEEDBACK[code];
    const entryText = JSON.stringify(entry).toLowerCase();
    return code.toLowerCase().includes(q) || title.includes(q) || entryText.includes(q);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Feedback editor</h1>
          <p className="mt-1 text-neutral-500">
            Pas de diagnostische feedback per misconceptietype aan.{" "}
            {overrideCount > 0 && (
              <span className="font-medium text-amber-700">{overrideCount} aangepast</span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            <Download size={16} aria-hidden />
            Exporteer aanpassingen
          </button>
          <button
            type="button"
            onClick={handleResetAll}
            onBlur={() => setResetAllConfirm(false)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              resetAllConfirm
                ? "bg-red-600 text-white"
                : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            <RotateCcw size={16} aria-hidden />
            {resetAllConfirm ? "Zeker weten?" : "Reset alles"}
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="search"
        aria-label="Zoek op code, titel of feedbacktekst"
        placeholder="Zoek op code, titel of feedbacktekst…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-base focus:border-[var(--focus-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--focus-blue)]"
      />

      {/* Accordion groups */}
      <div className="space-y-4">
        {FEEDBACK_GROUPS.map((group) => {
          const visibleCodes = group.codes.filter(matchesSearch);
          if (visibleCodes.length === 0) return null;
          const isExpanded = expandedGroups.has(group.label);
          const groupOverrideCount = group.codes.filter((c) => overrides[c] !== undefined).length;
          const panelId = `feedback-group-${group.label.toLowerCase().replace(/\s+/g, "-")}`;

          return (
            <div key={group.label} className="rounded-2xl border border-neutral-200 bg-[#fafaf9]">
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown size={18} className="text-neutral-500" aria-hidden />
                  ) : (
                    <ChevronRight size={18} className="text-neutral-500" aria-hidden />
                  )}
                  <span className="text-lg font-semibold">{group.label}</span>
                  {groupOverrideCount > 0 && (
                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-800">
                      {groupOverrideCount} aangepast
                    </span>
                  )}
                </div>
                <span className="text-sm text-neutral-400">{visibleCodes.length} items</span>
              </button>

              <div id={panelId} hidden={!isExpanded} className="space-y-3 px-5 pb-5">
                {isExpanded && visibleCodes.map((code) => (
                  <MisconceptionCard
                    key={code}
                    code={code}
                    overrides={overrides}
                    onSave={handleSave}
                    onReset={handleReset}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
