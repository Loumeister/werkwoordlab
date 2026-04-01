import Link from "next/link";
import { BookOpenText, ChartColumn, PenLine, SquarePen, TrendingUp } from "lucide-react";

const navItems = [
  { href: "/oefenen", label: "Oefenen", icon: PenLine },
  { href: "/schrijven", label: "Schrijven & nakijken", icon: SquarePen },
  { href: "/groei", label: "Mijn groei", icon: TrendingUp },
  { href: "/inzichten", label: "Inzichten (docent)", icon: ChartColumn },
  { href: "/content", label: "Content", icon: BookOpenText }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-[230px_1fr] gap-4 rounded-[32px] bg-[var(--bg-surface)] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.13)]">
        <aside className="flex min-h-[820px] flex-col rounded-[24px] bg-[var(--sidebar)] p-5">
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-[var(--warm-soft)] p-3">
            <BookOpenText aria-hidden className="text-black" />
            <p className="text-lg font-semibold text-black">Werkwoordlab</p>
          </div>

          <nav aria-label="Hoofdnavigatie" className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-white/90 transition hover:bg-white/10 hover:text-white"
              >
                <Icon aria-hidden size={20} />
                <span className="text-base font-medium">{label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <section className="rounded-[24px] bg-[#fcfcfb] p-5 md:p-8">{children}</section>
      </div>
    </main>
  );
}
