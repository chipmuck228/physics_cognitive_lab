import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { SAMPLES_COPY } from "@/lib/content/equal-volume-material-samples";

interface SamplesPredictTaskProps {
  question: string;
  outcomes: ReadonlyArray<{ value: string; label: string }>;
  outcome: string;
  reason: string;
  committedLabel?: string | null;
  locked?: boolean;
  needMore: boolean;
  onOutcomeChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onCommit: () => void;
}

export function SamplesPredictTask({
  question,
  outcomes,
  outcome,
  reason,
  committedLabel,
  locked = false,
  needMore,
  onOutcomeChange,
  onReasonChange,
  onCommit,
}: SamplesPredictTaskProps) {
  return (
    <div className="space-y-4" data-testid="samples-predict-task">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {SAMPLES_COPY.predictInstruction}
      </p>
      <Card className="space-y-5 p-4">
        <p className="text-sm font-medium leading-relaxed text-[var(--ink)]">
          {question}
        </p>
        <fieldset className="space-y-3" disabled={locked}>
          <legend className="sr-only">{question}</legend>
          {outcomes.map((option) => (
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
                name="samples-prediction"
                value={option.value}
                checked={outcome === option.value}
                onChange={() => onOutcomeChange(option.value)}
                className="mt-1"
                aria-label={option.label}
                disabled={locked}
              />
              <span className="text-sm text-[var(--ink)]">{option.label}</span>
            </label>
          ))}
        </fieldset>
        <div className="space-y-2">
          <label
            htmlFor="samples-predict-reason"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {SAMPLES_COPY.reasonLabel}
          </label>
          <textarea
            id="samples-predict-reason"
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder={SAMPLES_COPY.reasonPlaceholder}
            disabled={locked}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20 disabled:opacity-60"
          />
        </div>
        {needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {SAMPLES_COPY.predictNeedBoth}
          </p>
        ) : null}
        {committedLabel ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {SAMPLES_COPY.predictLocked}：{committedLabel}
          </p>
        ) : null}
        {!locked ? (
          <div className="flex justify-end">
            <Button onClick={onCommit}>{SAMPLES_COPY.predictSubmit}</Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
