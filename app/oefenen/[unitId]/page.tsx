import { AppShell } from "@/components/app-shell";
import { LearnerFlow } from "@/components/learner/learner-flow";
import { getUnit } from "@/lib/content";

export default async function UnitExercisePage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  const unit = getUnit(unitId);

  return (
    <AppShell>
      <LearnerFlow unit={unit} />
    </AppShell>
  );
}
