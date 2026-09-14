import Link from "next/link";

import { AppShell } from "@/components/app-shell";

export default function NotFound() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl rounded-3xl border border-black/15 bg-white p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">404</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Pagina niet gevonden</h1>
        <p className="mt-4 text-lg text-neutral-700">
          Deze pagina bestaat niet of is verplaatst.
        </p>
        <Link
          href="/oefenen"
          className="mt-6 inline-flex rounded-xl bg-[var(--sidebar)] px-5 py-3 font-semibold text-white"
        >
          Terug naar oefenen
        </Link>
      </div>
    </AppShell>
  );
}
