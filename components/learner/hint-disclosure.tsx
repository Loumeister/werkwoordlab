"use client";

import { useState } from "react";

type Props = {
  hints: string[];
  label?: string;
};

/**
 * Reveals hints one at a time. Shows nothing by default — learner must press
 * "Toon hint" to see the first hint, then "Nog een hint" for each subsequent
 * one. The button disappears after all hints have been revealed.
 */
export function HintDisclosure({ hints, label }: Props) {
  const [revealed, setRevealed] = useState(0);

  if (hints.length === 0) return null;

  const showMore = revealed < hints.length;

  return (
    <div className="mt-3 space-y-2">
      {revealed > 0 && (
        <ul className="space-y-1.5">
          {hints.slice(0, revealed).map((hint, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-900"
            >
              <span className="mt-0.5 shrink-0 text-amber-500">💡</span>
              <span>{hint}</span>
            </li>
          ))}
        </ul>
      )}

      {showMore && (
        <button
          type="button"
          onClick={() => setRevealed((n) => n + 1)}
          aria-label={label}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          {revealed === 0 ? "Toon hint" : "Nog een hint"}
        </button>
      )}
    </div>
  );
}
