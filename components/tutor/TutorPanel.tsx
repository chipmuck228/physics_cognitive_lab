import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { TutorLoading } from "@/components/tutor/TutorLoading";
import { TutorMessage } from "@/components/tutor/TutorMessage";

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
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          Coach
        </p>
        <Button
          variant="secondary"
          onClick={onAsk}
          disabled={disabled || loading}
          aria-label="Ask the coach one question"
        >
          Ask one question
        </Button>
      </div>
      {loading ? <TutorLoading /> : null}
      {!loading && message ? <TutorMessage message={message} /> : null}
      {!loading && !message ? (
        <p className="text-sm text-[var(--ink-muted)]">
          Optional. The coach can ask one question about what you just wrote.
        </p>
      ) : null}
    </Card>
  );
}
