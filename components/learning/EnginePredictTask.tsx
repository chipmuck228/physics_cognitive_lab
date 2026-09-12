import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  ENGINE_COPY,
  ENGINE_PREDICT_OUTCOMES,
} from "@/lib/content/four-stroke-engine";

interface EnginePredictTaskProps {
  question: string;
  outcome: string;
  reason: string;
  committedLabel?: string | null;
  needMore: boolean;
  onOutcomeChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onCommit: () => void;
}

export function EnginePredictTask({
  question,
  outcome,
  reason,
  committedLabel,
  needMore,
  onOutcomeChange,
  onReasonChange,
  onCommit,
}: EnginePredictTaskProps) {
  return (
    <div className="space-y-4" data-testid="engine-predict-task">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {ENGINE_COPY.predictInstruction}
      </p>
      <Card className="space-y-5 p-4">
        <p className="text-sm font-medium leading-relaxed text-[var(--ink)]">
          {question}
        </p>
        <fieldset className="space-y-3">
          <legend className="sr-only">{question}</legend>
          {ENGINE_PREDICT_OUTCOMES.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                outcome === option.value
                  ? "border-[var(--heat)] bg-[var(--heat)]/8"
                  : "border-[var(--line)] bg-white hover:border-[var(--ink-muted)]"
              }`}
            >
              <input
                type="radio"
                name="engine-prediction"
                value={option.value}
                checked={outcome === option.value}
                onChange={() => onOutcomeChange(option.value)}
                className="mt-1"
                aria-label={option.label}
              />
              <span className="text-sm text-[var(--ink)]">{option.label}</span>
            </label>
          ))}
        </fieldset>
        <div className="space-y-2">
          <label htmlFor="engine-predict-reason" className="text-sm font-medium text-[var(--ink)]">
            {ENGINE_COPY.reasonLabel}
          </label>
          <textarea
            id="engine-predict-reason"
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder={ENGINE_COPY.reasonPlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
        </div>
        {needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">{ENGINE_COPY.predictNeedBoth}</p>
        ) : null}
        {committedLabel ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {ENGINE_COPY.predictLocked}：{committedLabel}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onCommit}>
            {ENGINE_COPY.predictSubmit}
          </Button>
        </div>
      </Card>
    </div>
  );
}
