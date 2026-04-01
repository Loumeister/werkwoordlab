import { AppShell } from "@/components/app-shell";
import { LearnerFlow } from "@/components/learner/learner-flow";
import { getUnit } from "@/lib/content";

export default function UnitExercisePage({ params }: { params: { unitId: string } }) {
  const { unitId } = params;
  const unit = getUnit(unitId);

  return (
    <AppShell>
      <LearnerFlow unit={unit} />
    </AppShell>
  );
}
