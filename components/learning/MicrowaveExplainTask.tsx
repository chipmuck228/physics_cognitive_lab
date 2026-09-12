import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  MICROWAVE_EXPLAIN_ENERGY_OPTIONS,
  MICROWAVE_EXPLAIN_LINK_OPTIONS,
  MICROWAVE_TASK_COPY,
  SCENE_COPY,
} from "@/lib/content/microwave-bread";
import type { MicrowaveExplainInput } from "@/lib/learning/microwave-explain";

interface MicrowaveExplainTaskProps {
  value: MicrowaveExplainInput;
  onChange: (next: MicrowaveExplainInput) => void;
  onSubmit: () => void;
  needStructure: boolean;
}

export function MicrowaveExplainTask({
  value,
  onChange,
  onSubmit,
  needStructure,
}: MicrowaveExplainTaskProps) {
  return (
    <div data-testid="microwave-explain-task" className="space-y-4">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {SCENE_COPY.explainInstruction}
      </p>
      <Card className="space-y-5 p-4">
        <ChoiceGroup
          legend={MICROWAVE_TASK_COPY.explainEnergyLabel}
          name="microwave-explain-energy"
          options={MICROWAVE_EXPLAIN_ENERGY_OPTIONS}
          value={value.energyTransfer}
          onChange={(energyTransfer) => onChange({ ...value, energyTransfer })}
        />
        <ChoiceGroup
          legend={MICROWAVE_TASK_COPY.explainLinkLabel}
          name="microwave-explain-link"
          options={MICROWAVE_EXPLAIN_LINK_OPTIONS}
          value={value.link}
          onChange={(link) => onChange({ ...value, link })}
        />
        <div className="space-y-2">
          <label
            htmlFor="microwave-explain-text"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {SCENE_COPY.explainQuestion}
          </label>
          <textarea
            id="microwave-explain-text"
            value={value.studentExplanation}
            onChange={(event) =>
              onChange({ ...value, studentExplanation: event.target.value })
            }
            placeholder={SCENE_COPY.explainPlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none"
          />
        </div>
        {needStructure ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {MICROWAVE_TASK_COPY.explainNeedStructure}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{SCENE_COPY.explainSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}

function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  value: string;
  onChange: (value: never) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-[var(--ink)]">{legend}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value as never)}
            className="mt-1"
            aria-label={option.label}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
