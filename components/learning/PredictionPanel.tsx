import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { PREDICTION_OPTIONS, SCENE_COPY } from "@/lib/content/microwave-bread";

interface PredictionPanelProps {
  selected: string;
  reasoning: string;
  onSelect: (value: string) => void;
  onReasoningChange: (value: string) => void;
  onSubmit: () => void;
}

export function PredictionPanel({
  selected,
  reasoning,
  onSelect,
  onReasoningChange,
  onSubmit,
}: PredictionPanelProps) {
  const canSubmit = selected.length > 0 && reasoning.trim().length > 0;

  return (
    <Card className="space-y-5 p-4">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-[var(--ink)]">
          {SCENE_COPY.chooseGuess}
        </legend>
        <div className="space-y-2">
          {PREDICTION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                selected === option.value
                  ? "border-[var(--heat)] bg-[var(--heat)]/8"
                  : "border-[var(--line)] bg-white hover:border-[var(--ink-muted)]"
              }`}
            >
              <input
                type="radio"
                name="prediction"
                value={option.value}
                checked={selected === option.value}
                onChange={() => onSelect(option.value)}
                className="mt-1"
              />
              <span className="text-sm text-[var(--ink)]">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="prediction-reasoning" className="text-sm font-medium text-[var(--ink)]">
          {SCENE_COPY.whyGuess}
        </label>
        <textarea
          id="prediction-reasoning"
          value={reasoning}
          onChange={(event) => onReasoningChange(event.target.value)}
          placeholder={SCENE_COPY.whyGuessPlaceholder}
          className="min-h-28 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--ink-muted)]">
          {SCENE_COPY.guessBeforeTest}
        </p>
        <Button onClick={onSubmit} disabled={!canSubmit}>
          {SCENE_COPY.predictSubmit}
        </Button>
      </div>
    </Card>
  );
}
