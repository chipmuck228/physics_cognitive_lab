import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  MICROWAVE_MODEL_CONDITION_OPTIONS,
  MICROWAVE_MODEL_DISTINCTION_OPTIONS,
  MICROWAVE_MODEL_ENERGY_OPTIONS,
  MICROWAVE_MODEL_INTERNAL_OPTIONS,
  MICROWAVE_MODEL_SYSTEM_OPTIONS,
  MICROWAVE_MODEL_TEMPERATURE_OPTIONS,
  MICROWAVE_TASK_COPY,
  SCENE_COPY,
} from "@/lib/content/microwave-bread";
import type { MicrowaveModelDraft } from "@/lib/learning/microwave-model";

interface MicrowaveModelBoardProps {
  value: MicrowaveModelDraft;
  onChange: (next: MicrowaveModelDraft) => void;
  onSubmit: () => void;
  feedback?: string | null;
  needStructure: boolean;
}

export function MicrowaveModelBoard({
  value,
  onChange,
  onSubmit,
  feedback,
  needStructure,
}: MicrowaveModelBoardProps) {
  return (
    <div data-testid="microwave-model-board" className="space-y-4">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {SCENE_COPY.modelInstruction}
      </p>
      <Card className="space-y-5 p-4">
        <ChoiceGroup
          legend={MICROWAVE_TASK_COPY.modelSystemLabel}
          name="microwave-model-system"
          options={MICROWAVE_MODEL_SYSTEM_OPTIONS}
          value={value.system}
          onChange={(system) => onChange({ ...value, system })}
        />
        <ChoiceGroup
          legend={MICROWAVE_TASK_COPY.modelEnergyLabel}
          name="microwave-model-energy"
          options={MICROWAVE_MODEL_ENERGY_OPTIONS}
          value={value.energyTransfer}
          onChange={(energyTransfer) => onChange({ ...value, energyTransfer })}
        />
        <ChoiceGroup
          legend={MICROWAVE_TASK_COPY.modelInternalLabel}
          name="microwave-model-internal"
          options={MICROWAVE_MODEL_INTERNAL_OPTIONS}
          value={value.internalEnergy}
          onChange={(internalEnergy) => onChange({ ...value, internalEnergy })}
        />
        <ChoiceGroup
          legend={MICROWAVE_TASK_COPY.modelTemperatureLabel}
          name="microwave-model-temperature"
          options={MICROWAVE_MODEL_TEMPERATURE_OPTIONS}
          value={value.temperatureRelation}
          onChange={(temperatureRelation) =>
            onChange({ ...value, temperatureRelation })
          }
        />
        <ChoiceGroup
          legend={MICROWAVE_TASK_COPY.modelDistinctionLabel}
          name="microwave-model-distinction"
          options={MICROWAVE_MODEL_DISTINCTION_OPTIONS}
          value={value.distinction}
          onChange={(distinction) => onChange({ ...value, distinction })}
        />
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-[var(--ink)]">
            {MICROWAVE_TASK_COPY.modelConditionLabel}
          </legend>
          {MICROWAVE_MODEL_CONDITION_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
            >
              <input
                type="checkbox"
                checked={value.conditions.includes(option.id)}
                onChange={() => {
                  const next = value.conditions.includes(option.id)
                    ? value.conditions.filter((id) => id !== option.id)
                    : [...value.conditions, option.id];
                  onChange({ ...value, conditions: next });
                }}
                className="mt-1"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
        <div className="space-y-2">
          <label
            htmlFor="microwave-model-authored"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {MICROWAVE_TASK_COPY.modelAuthoredLabel}
          </label>
          <textarea
            id="microwave-model-authored"
            value={value.authoredDistinction}
            onChange={(event) =>
              onChange({ ...value, authoredDistinction: event.target.value })
            }
            placeholder={MICROWAVE_TASK_COPY.modelAuthoredPlaceholder}
            className="min-h-20 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none"
          />
        </div>
        {needStructure ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {MICROWAVE_TASK_COPY.modelNeedStructure}
          </p>
        ) : null}
        {feedback ? (
          <p className="text-sm text-[var(--ink-muted)]">{feedback}</p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{SCENE_COPY.modelSubmit}</Button>
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
