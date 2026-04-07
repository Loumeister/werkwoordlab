import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { LearnerFlow } from "@/components/learner/learner-flow";
import { getUnit, getUnits } from "@/lib/content";

// Required for static export: tells Next.js which [unitId] values to pre-render.
export function generateStaticParams() {
  return getUnits().map((unit) => ({ unitId: unit.id }));
}

// params is a Promise in Next.js 15+.
export default async function UnitExercisePage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;
  const unit = getUnit(unitId);

  if (!unit) {
    notFound();
  }

  return (
    <AppShell>
      <LearnerFlow unit={unit} />
    </AppShell>
  );
}
