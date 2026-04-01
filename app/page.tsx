import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getUnits } from "@/lib/content";

export default function Dashboard() {
  const units = getUnits();

  return (
    <AppShell>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-base text-neutral-600">Welkom terug, leerling</p>
          <h1 className="text-4xl font-semibold tracking-tight">Mijn werkwoordlab</h1>
        </div>
        <Link
          href="/oefenen"
          className="rounded-full bg-[var(--warm-primary)] px-5 py-3 font-semibold text-white hover:brightness-95"
        >
          Start oefening
        </Link>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {units.map((unit, index) => (
          <article key={unit.id} className={`rounded-3xl border border-black/20 p-5 ${index % 2 === 0 ? "bg-[#ffe08b]" : "bg-[#d8c4ff]"}`}>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-black/70">Unit</p>
            <h2 className="mb-2 text-2xl font-semibold leading-tight">{unit.title}</h2>
            <p className="mb-5 text-lg">{unit.items.length} oefenitems + transfer</p>
            <Link href="/oefenen" className="inline-block rounded-full border border-black/60 bg-white px-4 py-2 font-medium">
              Verder
            </Link>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
