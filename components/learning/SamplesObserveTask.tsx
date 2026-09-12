import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  SAMPLES_COPY,
  SAMPLES_OBSERVE_OPTIONS,
} from "@/lib/content/equal-volume-material-samples";

interface SamplesObserveTaskProps {
  selectedOptionIds: string[];
  onToggle: (optionId: string) => void;
  onSubmit: () => void;
  onPlayDemo: () => void;
  needMore: boolean;
  saved: boolean;
  demoPlaying: boolean;
}

export function SamplesObserveTask({
  selectedOptionIds,
  onToggle,
  onSubmit,
  onPlayDemo,
  needMore,
  saved,
  demoPlaying,
}: SamplesObserveTaskProps) {
  const selected = new Set(selectedOptionIds);

  return (
    <div data-testid="samples-observe-task">
      <Card className="space-y-4 p-4">
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {SAMPLES_COPY.observeInstruction}
        </p>
        <Button
          variant="secondary"
          onClick={onPlayDemo}
          data-testid="samples-play-demo"
        >
          {demoPlaying ? SAMPLES_COPY.pauseDemo : SAMPLES_COPY.playDemo}
        </Button>
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-[var(--ink)]">
            {SAMPLES_COPY.observePrompt}
          </legend>
          {SAMPLES_OBSERVE_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--ink)]"
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={selected.has(option.id)}
                onChange={() => onToggle(option.id)}
                value={option.id}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
        {needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {SAMPLES_COPY.observeNeedMore}
          </p>
        ) : null}
        {saved && !needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">{SAMPLES_COPY.observeSaved}</p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{SAMPLES_COPY.observeSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}
