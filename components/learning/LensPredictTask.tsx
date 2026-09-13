import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import { LENS_COPY, LENS_PREDICT_OUTCOMES } from "@/lib/content/convex-lens-optical-bench";

interface LensPredictTaskProps {
  question: string;
  outcome: string;
  reason: string;
  committedLabel?: string | null;
  locked?: boolean;
  needMore: boolean;
  onOutcomeChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onCommit: () => void;
}

export function LensPredictTask({
  question,
  outcome,
  reason,
  committedLabel,
  locked = false,
  needMore,
  onOutcomeChange,
  onReasonChange,
  onCommit,
}: LensPredictTaskProps) {
  return (
    <div className="space-y-4" data-testid="lens-predict-task">
      <Card className="space-y-5 p-4">
        <fieldset disabled={locked} className="space-y-3">
          <QuestionGroup
            id="lens-predict-outcome"
            question={question}
            value={outcome}
            onChange={onOutcomeChange}
            options={[...LENS_PREDICT_OUTCOMES]}
          />
        </fieldset>
        <label className="block space-y-2">
          <span className="text-sm font-medium">{LENS_COPY.reasonLabel}</span>
          <textarea
            id="lens-predict-reason"
            data-testid="lens-predict-reason"
            disabled={locked}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
            placeholder={LENS_COPY.reasonPlaceholder}
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
          />
        </label>
        {needMore ? (
          <ValidationMessage kind="missing">{LENS_COPY.predictNeedBoth}</ValidationMessage>
        ) : null}
        {committedLabel ? (
          <ValidationMessage kind="info">
            {`${LENS_COPY.predictLocked}：${committedLabel}`}
          </ValidationMessage>
        ) : null}
        {!locked ? (
          <div className="flex justify-end">
            <Button onClick={onCommit}>{LENS_COPY.predictSubmit}</Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
