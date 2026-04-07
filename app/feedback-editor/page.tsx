import { AppShell } from "@/components/app-shell";
import { FeedbackEditor } from "@/components/feedback/FeedbackEditor";

export const metadata = {
  title: "Feedback editor – Werkwoordlab",
};

export default function FeedbackEditorPage() {
  return (
    <AppShell>
      <FeedbackEditor />
    </AppShell>
  );
}
