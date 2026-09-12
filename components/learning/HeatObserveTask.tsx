import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  HEAT_COPY,
  HEAT_OBSERVE_OPTIONS,
} from "@/lib/content/equal-mass-heated-samples";

interface HeatObserveTaskProps {
  selectedOptionIds: string[];
  onToggle: (optionId: string) => void;
  onSubmit: () => void;
  onPlayDemo: () => void;
  needMore: boolean;
  saved: boolean;
  demoPlaying: boolean;
}

export function HeatObserveTask({
  selectedOptionIds,
  onToggle,
  onSubmit,
  onPlayDemo,
  needMore,
  saved,
  demoPlaying,
}: HeatObserveTaskProps) {
  const selected = new Set(selectedOptionIds);

  return (
    <div data-testid="heat-observe-task">
      <Card className="space-y-4 p-4">
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {HEAT_COPY.observeInstruction}
        </p>
        <Button
          variant="secondary"
          onClick={onPlayDemo}
          data-testid="heat-play-demo"
        >
          {demoPlaying ? HEAT_COPY.pauseDemo : HEAT_COPY.playDemo}
        </Button>
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-[var(--ink)]">
            {HEAT_COPY.observePrompt}
          </legend>
          {HEAT_OBSERVE_OPTIONS.map((option) => (
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
          <p className="text-sm text-[var(--ink-muted)]">{HEAT_COPY.observeNeedMore}</p>
        ) : null}
        {saved && !needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">{HEAT_COPY.observeSaved}</p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{HEAT_COPY.observeSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}
