import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { TutorLoading } from "@/components/tutor/TutorLoading";
import { TutorMessage } from "@/components/tutor/TutorMessage";
import { STUDENT_CHROME } from "@/lib/content/student-language";

interface TutorPanelProps {
  message: string | null;
  loading: boolean;
  disabled?: boolean;
  onAsk: () => void;
}

export function TutorPanel({
  message,
  loading,
  disabled = false,
  onAsk,
}: TutorPanelProps) {
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-[0.14em] text-[var(--ink-muted)]">
          {STUDENT_CHROME.tutorName}
        </p>
        <Button
          variant="secondary"
          onClick={onAsk}
          disabled={disabled || loading}
          aria-label={STUDENT_CHROME.tutorAskAria}
        >
          {STUDENT_CHROME.tutorAsk}
        </Button>
      </div>
      {loading ? <TutorLoading /> : null}
      {!loading && message ? <TutorMessage message={message} /> : null}
      {!loading && !message ? (
        <p className="text-sm text-[var(--ink-muted)]">
          {STUDENT_CHROME.tutorIdle}
        </p>
      ) : null}
    </Card>
  );
}
