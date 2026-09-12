import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import { OHMS_COPY, OHMS_OBSERVE_OPTIONS } from "@/lib/content/simple-resistor-circuit";

interface OhmsObserveTaskProps {
  selectedOptionIds: string[];
  onToggle: (optionId: string) => void;
  onSubmit: () => void;
  onPlayDemo: () => void;
  onToggleCircuit: () => void;
  circuitClosed: boolean;
  needMore: boolean;
  saved: boolean;
  demoPlaying: boolean;
}

export function OhmsObserveTask({
  selectedOptionIds,
  onToggle,
  onSubmit,
  onPlayDemo,
  onToggleCircuit,
  circuitClosed,
  needMore,
  saved,
  demoPlaying,
}: OhmsObserveTaskProps) {
  const selected = new Set(selectedOptionIds);

  return (
    <div data-testid="ohms-observe-task">
      <Card className="space-y-4 p-4">
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {OHMS_COPY.observeCaption}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onPlayDemo} data-testid="ohms-play-demo">
            {demoPlaying ? OHMS_COPY.pauseDemo : OHMS_COPY.playDemo}
          </Button>
          <Button
            variant="secondary"
            onClick={onToggleCircuit}
            data-testid="ohms-toggle-circuit"
          >
            {circuitClosed ? OHMS_COPY.openSwitchDemo : OHMS_COPY.closeSwitchDemo}
          </Button>
        </div>
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-[var(--ink)]">
            {OHMS_COPY.observePrompt}
          </legend>
          {OHMS_OBSERVE_OPTIONS.map((option) => (
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
          <ValidationMessage kind="missing">{OHMS_COPY.observeNeedMore}</ValidationMessage>
        ) : null}
        {saved && !needMore ? (
          <ValidationMessage kind="info">已经记下你看见的。</ValidationMessage>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{OHMS_COPY.observeSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}
