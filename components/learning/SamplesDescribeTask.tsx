import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  SAMPLES_COPY,
  SAMPLES_MASS_RELATION_OPTIONS,
  SAMPLES_OBJECT_OPTIONS,
  SAMPLES_SIZE_RELATION_OPTIONS,
} from "@/lib/content/equal-volume-material-samples";
import type { SamplesDescribeInput } from "@/lib/learning/samples-describe";

interface SamplesDescribeTaskProps {
  value: SamplesDescribeInput;
  onChange: (next: SamplesDescribeInput) => void;
  onSubmit: () => void;
  needStructure: boolean;
}

export function SamplesDescribeTask({
  value,
  onChange,
  onSubmit,
  needStructure,
}: SamplesDescribeTaskProps) {
  return (
    <div data-testid="samples-describe-task" className="space-y-4">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {SAMPLES_COPY.describeInstruction}
      </p>
      <Card className="space-y-5 p-4">
        <ChoiceGroup
          legend={SAMPLES_COPY.objectLabel}
          name="samples-object"
          options={SAMPLES_OBJECT_OPTIONS}
          value={value.object}
          onChange={(object) => onChange({ ...value, object })}
        />
        <ChoiceGroup
          legend={SAMPLES_COPY.sizeRelationLabel}
          name="samples-size"
          options={SAMPLES_SIZE_RELATION_OPTIONS}
          value={value.sizeRelation}
          onChange={(sizeRelation) => onChange({ ...value, sizeRelation })}
        />
        <ChoiceGroup
          legend={SAMPLES_COPY.massRelationLabel}
          name="samples-mass"
          options={SAMPLES_MASS_RELATION_OPTIONS}
          value={value.massRelation}
          onChange={(massRelation) => onChange({ ...value, massRelation })}
        />
        <div className="space-y-2">
          <label
            htmlFor="samples-describe-text"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {SAMPLES_COPY.describeQuestion}
          </label>
          <textarea
            id="samples-describe-text"
            value={value.studentDescription}
            onChange={(event) =>
              onChange({ ...value, studentDescription: event.target.value })
            }
            placeholder={SAMPLES_COPY.describePlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
        </div>
        {needStructure ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {SAMPLES_COPY.describeNeedStructure}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{SAMPLES_COPY.describeSubmit}</Button>
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
