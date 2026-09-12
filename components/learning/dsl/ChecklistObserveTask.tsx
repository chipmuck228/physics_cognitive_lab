import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export interface ChecklistObserveOption {
  id: string;
  label: string;
}

export interface ChecklistObserveCopy {
  instruction: string;
  prompt: string;
  submit: string;
  needMore: string;
  saved: string;
  playDemo: string;
  pauseDemo: string;
}

interface ChecklistObserveTaskProps {
  copy: ChecklistObserveCopy;
  options: readonly ChecklistObserveOption[];
  selectedOptionIds: string[];
  onToggle: (optionId: string) => void;
  onSubmit: () => void;
  onPlayDemo: () => void;
  needMore: boolean;
  saved: boolean;
  demoPlaying: boolean;
  testId: string;
  playDemoTestId: string;
}

export function ChecklistObserveTask({
  copy,
  options,
  selectedOptionIds,
  onToggle,
  onSubmit,
  onPlayDemo,
  needMore,
  saved,
  demoPlaying,
  testId,
  playDemoTestId,
}: ChecklistObserveTaskProps) {
  const selected = new Set(selectedOptionIds);

  return (
    <div data-testid={testId}>
      <Card className="space-y-4 p-4">
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {copy.instruction}
        </p>
        <Button variant="secondary" onClick={onPlayDemo} data-testid={playDemoTestId}>
          {demoPlaying ? copy.pauseDemo : copy.playDemo}
        </Button>
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-[var(--ink)]">{copy.prompt}</legend>
          {options.map((option) => (
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
          <p className="text-sm text-[var(--ink-muted)]">{copy.needMore}</p>
        ) : null}
        {saved && !needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">{copy.saved}</p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{copy.submit}</Button>
        </div>
      </Card>
    </div>
  );
}
