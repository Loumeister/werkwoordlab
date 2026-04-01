import { AppShell } from "@/components/app-shell";
import { getUnits } from "@/lib/content";

export default function ContentPage() {
  const units = getUnits();

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">Contentbibliotheek</h1>
        {units.map((unit) => (
          <section key={unit.id} className="space-y-4 rounded-3xl border border-black/15 bg-white p-6">
            <h2 className="text-2xl font-semibold">{unit.title}</h2>
            <ul className="space-y-3">
              {unit.items.map((item) => (
                <li key={item.id} className="rounded-2xl border border-neutral-200 p-4">
                  <p className="text-lg font-semibold">{item.prompt}</p>
                  <p className="text-base">Scaffold: {item.scaffold.step1} / {item.scaffold.step2} / {item.scaffold.step3}</p>
                  <p className="text-base">Misconceptie: {item.diagnostic.primaryMisconception}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
