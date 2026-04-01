import Link from "next/link";
import { getUnits } from "@/lib/content";

export function UnitSelection() {
  const units = getUnits();

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <h1 className="text-4xl font-semibold tracking-tight">Oefenen</h1>
      <div className="space-y-4">
        {units.map((unit, index) => (
          <article key={unit.id} className={`rounded-3xl border border-black/20 p-6 ${index % 2 === 0 ? "bg-[#ffe08b]" : "bg-[#d8c4ff]"}`}>
            <h2 className="text-2xl font-semibold">{unit.title}</h2>
            <p className="mt-2 text-lg text-black/80">{unit.learningGoals[0]}</p>
            <p className="mt-3 text-base text-black/70">Voortgang: 0/{unit.items.length} afgerond</p>
            <Link href={`/oefenen/${unit.id}`} className="mt-4 inline-block rounded-xl bg-[var(--warm-primary)] px-4 py-3 font-semibold text-white">
              Start
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
