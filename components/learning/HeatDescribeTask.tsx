import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  HEAT_COPY,
  HEAT_MASS_RELATION_OPTIONS,
  HEAT_OBJECT_OPTIONS,
  HEAT_TEMPERATURE_RELATION_OPTIONS,
} from "@/lib/content/equal-mass-heated-samples";
import type { HeatDescribeInput } from "@/lib/learning/heat-describe";

interface HeatDescribeTaskProps {
  value: HeatDescribeInput;
  onChange: (next: HeatDescribeInput) => void;
  onSubmit: () => void;
  needStructure: boolean;
}

export function HeatDescribeTask({
  value,
  onChange,
  onSubmit,
  needStructure,
}: HeatDescribeTaskProps) {
  return (
    <div data-testid="heat-describe-task" className="space-y-4">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {HEAT_COPY.describeInstruction}
      </p>
      <Card className="space-y-5 p-4">
        <ChoiceGroup
          legend={HEAT_COPY.objectLabel}
          name="heat-object"
          options={HEAT_OBJECT_OPTIONS}
          value={value.object}
          onChange={(object) => onChange({ ...value, object })}
        />
        <ChoiceGroup
          legend={HEAT_COPY.massRelationLabel}
          name="heat-mass"
          options={HEAT_MASS_RELATION_OPTIONS}
          value={value.massRelation}
          onChange={(massRelation) => onChange({ ...value, massRelation })}
        />
        <ChoiceGroup
          legend={HEAT_COPY.temperatureRelationLabel}
          name="heat-temperature"
          options={HEAT_TEMPERATURE_RELATION_OPTIONS}
          value={value.temperatureRelation}
          onChange={(temperatureRelation) =>
            onChange({ ...value, temperatureRelation })
          }
        />
        <div className="space-y-2">
          <label
            htmlFor="heat-describe-text"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {HEAT_COPY.describeQuestion}
          </label>
          <textarea
            id="heat-describe-text"
            value={value.studentDescription}
            onChange={(event) =>
              onChange({ ...value, studentDescription: event.target.value })
            }
            placeholder={HEAT_COPY.describePlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
        </div>
        {needStructure ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {HEAT_COPY.describeNeedStructure}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{HEAT_COPY.describeSubmit}</Button>
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
