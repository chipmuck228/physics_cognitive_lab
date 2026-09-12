import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  MICROWAVE_CHANGE_OPTIONS,
  MICROWAVE_OBJECT_OPTIONS,
  MICROWAVE_QUANTITY_OPTIONS,
  MICROWAVE_TASK_COPY,
  SCENE_COPY,
} from "@/lib/content/microwave-bread";
import type { MicrowaveDescribeInput } from "@/lib/learning/microwave-describe";

interface MicrowaveDescribeTaskProps {
  value: MicrowaveDescribeInput;
  onChange: (next: MicrowaveDescribeInput) => void;
  onSubmit: () => void;
  needStructure: boolean;
}

export function MicrowaveDescribeTask({
  value,
  onChange,
  onSubmit,
  needStructure,
}: MicrowaveDescribeTaskProps) {
  return (
    <div data-testid="microwave-describe-task" className="space-y-4">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {SCENE_COPY.describeInstruction}
      </p>
      <Card className="space-y-5 p-4">
        <ChoiceGroup
          legend={MICROWAVE_TASK_COPY.describeObjectLabel}
          name="microwave-object"
          options={MICROWAVE_OBJECT_OPTIONS}
          value={value.object}
          onChange={(object) => onChange({ ...value, object })}
        />
        <ChoiceGroup
          legend={MICROWAVE_TASK_COPY.describeQuantityLabel}
          name="microwave-quantity"
          options={MICROWAVE_QUANTITY_OPTIONS}
          value={value.quantity}
          onChange={(quantity) => onChange({ ...value, quantity })}
        />
        <ChoiceGroup
          legend={MICROWAVE_TASK_COPY.describeChangeLabel}
          name="microwave-change"
          options={MICROWAVE_CHANGE_OPTIONS}
          value={value.change}
          onChange={(change) => onChange({ ...value, change })}
        />
        <div className="space-y-2">
          <label
            htmlFor="microwave-describe-text"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {SCENE_COPY.describeQuestion}
          </label>
          <textarea
            id="microwave-describe-text"
            value={value.studentDescription}
            onChange={(event) =>
              onChange({ ...value, studentDescription: event.target.value })
            }
            placeholder={SCENE_COPY.describePlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
        </div>
        {needStructure ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {MICROWAVE_TASK_COPY.describeNeedStructure}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{SCENE_COPY.describeSubmit}</Button>
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
