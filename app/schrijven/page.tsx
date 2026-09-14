"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { TransferTaskPanel } from "@/components/learner/transfer-task-panel";
import { getUnit } from "@/lib/content";

export default function SchrijvenPage() {
  const router = useRouter();
  const unit = getUnit("unit-01-pv-tt")!;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">Schrijven & zelfcontrole</h1>
        <TransferTaskPanel
          task={unit.transferTask}
          unitTitle={unit.title}
          onFinish={() => router.push("/groei")}
        />
      </div>
    </AppShell>
  );
}
