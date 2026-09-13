import { Button } from "@/components/common/Button";
import { LENS_STAGE_LABELS } from "@/lib/content/convex-lens-optical-bench";
import { lensReturnCta } from "@/lib/learning/lens-revisit";
import type { LearningStage } from "@/types/learning";

interface LensReviewBannerProps {
  viewingStage: LearningStage;
  authoritativeStage: LearningStage;
  onReturn: () => void;
}

export function LensReviewBanner({
  viewingStage,
  authoritativeStage,
  onReturn,
}: LensReviewBannerProps) {
  return (
    <div
      className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3"
      data-testid="lens-review-banner"
    >
      <p className="font-medium" data-testid="lens-review-title">
        {`你正在回看：${LENS_STAGE_LABELS[viewingStage]}`}
      </p>
      <p className="text-sm text-[var(--ink-muted)]">之前的进度不会丢失</p>
      <Button onClick={onReturn} data-testid="lens-return-progress">
        {lensReturnCta(authoritativeStage)}
      </Button>
    </div>
  );
}
