import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_COPY,
  LENS_PREDICT_OUTCOMES,
  LENS_PREDICT_REASON_STANCES,
} from "@/lib/content/convex-lens-optical-bench";
import type { LensPredictReasonStance } from "@/lib/learning/lens-predict";

interface LensPredictTaskProps {
  question: string;
  outcome: string;
  reasonStance: LensPredictReasonStance;
  reason: string;
  committedLabel?: string | null;
  locked?: boolean;
  needMore: boolean;
  needMoreMessage?: string;
  onOutcomeChange: (value: string) => void;
  onReasonStanceChange: (value: LensPredictReasonStance) => void;
  onReasonChange: (value: string) => void;
  onCommit: () => void;
}

export function LensPredictTask({
  question,
  outcome,
  reasonStance,
  reason,
  committedLabel,
  locked = false,
  needMore,
  needMoreMessage,
  onOutcomeChange,
  onReasonStanceChange,
  onReasonChange,
  onCommit,
}: LensPredictTaskProps) {
  return (
    <div className="space-y-4" data-testid="lens-predict-task">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]" data-testid="lens-predict-not-exam">
        {LENS_COPY.predictNotExam}
      </p>
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
        <fieldset disabled={locked} className="space-y-3" data-testid="lens-predict-reason-stance">
          <QuestionGroup
            id="lens-predict-reason-stance"
            question={LENS_COPY.reasonAvailability}
            value={reasonStance}
            onChange={(value) => onReasonStanceChange(value as LensPredictReasonStance)}
            options={[...LENS_PREDICT_REASON_STANCES]}
          />
        </fieldset>
        {reasonStance === "has-idea" ? (
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
        ) : null}
        {needMore ? (
          <ValidationMessage kind="missing">
            {needMoreMessage ?? LENS_COPY.predictNeedBoth}
          </ValidationMessage>
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
