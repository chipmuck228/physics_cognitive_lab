import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  ENGINE_COPY,
  ENGINE_OBSERVE_OPTIONS,
} from "@/lib/content/four-stroke-engine";

interface EngineObserveTaskProps {
  selectedOptionIds: string[];
  onToggle: (optionId: string) => void;
  onSubmit: () => void;
  needMore: boolean;
  saved: boolean;
}

export function EngineObserveTask({
  selectedOptionIds,
  onToggle,
  onSubmit,
  needMore,
  saved,
}: EngineObserveTaskProps) {
  const selected = new Set(selectedOptionIds);

  return (
    <div data-testid="engine-observe-task">
      <Card className="space-y-4 p-4">
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {ENGINE_COPY.observeInstruction}
        </p>
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-[var(--ink)]">
            {ENGINE_COPY.observePrompt}
          </legend>
          {ENGINE_OBSERVE_OPTIONS.map((option) => (
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
          <p className="text-sm text-[var(--ink-muted)]">{ENGINE_COPY.observeNeedMore}</p>
        ) : null}
        {saved && !needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">{ENGINE_COPY.observeSaved}</p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{ENGINE_COPY.observeSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}
