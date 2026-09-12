import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import { OHMS_COPY, OHMS_PREDICT_OUTCOMES } from "@/lib/content/simple-resistor-circuit";

interface OhmsPredictTaskProps {
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

export function OhmsPredictTask({
  question,
  outcome,
  reason,
  committedLabel,
  locked = false,
  needMore,
  onOutcomeChange,
  onReasonChange,
  onCommit,
}: OhmsPredictTaskProps) {
  return (
    <div className="space-y-4" data-testid="ohms-predict-task">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {OHMS_COPY.predictInstruction}
      </p>
      <Card className="space-y-5 p-4">
        <fieldset disabled={locked} className="space-y-3">
          <QuestionGroup
            id="ohms-predict-outcome"
            question={question}
            value={outcome}
            onChange={onOutcomeChange}
            options={[...OHMS_PREDICT_OUTCOMES]}
          />
        </fieldset>
        <label className="block space-y-2">
          <span className="text-sm font-medium">{OHMS_COPY.reasonLabel}</span>
          <textarea
            id="ohms-predict-reason"
            data-testid="ohms-predict-reason"
            disabled={locked}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
            placeholder={OHMS_COPY.reasonPlaceholder}
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
          />
        </label>
        {needMore ? (
          <ValidationMessage kind="missing">{OHMS_COPY.predictNeedBoth}</ValidationMessage>
        ) : null}
        {committedLabel ? (
          <ValidationMessage kind="info">
            {`${OHMS_COPY.predictLocked}：${committedLabel}`}
          </ValidationMessage>
        ) : null}
        {!locked ? (
          <div className="flex justify-end">
            <Button onClick={onCommit}>{OHMS_COPY.predictSubmit}</Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
