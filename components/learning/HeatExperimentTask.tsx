import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  HEAT_COMPARE_OPTIONS,
  HEAT_COPY,
  HEAT_DELTA_T_COMPARE_OPTIONS_A,
  HEAT_DELTA_T_COMPARE_OPTIONS_B,
  HEAT_DELTA_T_COMPARE_OPTIONS_C,
  HEAT_ENERGY_COMPARE_OPTIONS_A,
  HEAT_ENERGY_COMPARE_OPTIONS_B,
  HEAT_ENERGY_COMPARE_OPTIONS_C,
  HEAT_MASS_COMPARE_OPTIONS_A,
  HEAT_MASS_COMPARE_OPTIONS_B,
  HEAT_MASS_COMPARE_OPTIONS_C,
} from "@/lib/content/equal-mass-heated-samples";
import type { HeatObservedResult } from "@/lib/learning/heat-experiment";
import {
  HEAT_EXPERIMENT_B,
  HEAT_EXPERIMENT_C,
  type HeatExperimentId,
} from "@/lib/physics/equal-mass-heated-samples";

interface HeatExperimentTaskProps {
  experimentId: HeatExperimentId;
  title: string;
  canRun: boolean;
  hasRun: boolean;
  observed: HeatObservedResult;
  comparison: "" | "same" | "different" | "partial";
  reflection: string;
  reflectionPrompt: string;
  onRun: () => void;
  onObservedChange: (next: HeatObservedResult) => void;
  onSaveObserved: () => void;
  onComparisonChange: (value: "same" | "different" | "partial") => void;
  onSaveComparison: () => void;
  onReflectionChange: (value: string) => void;
  onSaveReflection: () => void;
  observedSaved: boolean;
  comparisonSaved: boolean;
}

export function HeatExperimentTask({
  experimentId,
  title,
  canRun,
  hasRun,
  observed,
  comparison,
  reflection,
  reflectionPrompt,
  onRun,
  onObservedChange,
  onSaveObserved,
  onComparisonChange,
  onSaveComparison,
  onReflectionChange,
  onSaveReflection,
  observedSaved,
  comparisonSaved,
}: HeatExperimentTaskProps) {
  const massOptions =
    experimentId === HEAT_EXPERIMENT_C
      ? HEAT_MASS_COMPARE_OPTIONS_C
      : experimentId === HEAT_EXPERIMENT_B
        ? HEAT_MASS_COMPARE_OPTIONS_B
        : HEAT_MASS_COMPARE_OPTIONS_A;
  const energyOptions =
    experimentId === HEAT_EXPERIMENT_C
      ? HEAT_ENERGY_COMPARE_OPTIONS_C
      : experimentId === HEAT_EXPERIMENT_B
        ? HEAT_ENERGY_COMPARE_OPTIONS_B
        : HEAT_ENERGY_COMPARE_OPTIONS_A;
  const deltaTOptions =
    experimentId === HEAT_EXPERIMENT_C
      ? HEAT_DELTA_T_COMPARE_OPTIONS_C
      : experimentId === HEAT_EXPERIMENT_B
        ? HEAT_DELTA_T_COMPARE_OPTIONS_B
        : HEAT_DELTA_T_COMPARE_OPTIONS_A;

  return (
    <div className="space-y-4" data-testid="heat-experiment-task">
      <p className="text-sm font-medium text-[var(--ink)]">{title}</p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {HEAT_COPY.experimentIntro}
      </p>
      <Button
        onClick={onRun}
        disabled={!canRun || hasRun}
        data-testid="heat-run-experiment"
      >
        {HEAT_COPY.runExperiment}
      </Button>
      {!canRun ? (
        <p className="text-sm text-[var(--ink-muted)]">{HEAT_COPY.runNeedPrediction}</p>
      ) : null}

      {hasRun ? (
        <Card className="space-y-4 p-4" data-testid="heat-observed-result">
          <ChoiceGroup
            legend={HEAT_COPY.massCompareLabel}
            name="heat-mass-compare"
            options={massOptions}
            value={observed.massComparison}
            onChange={(massComparison) =>
              onObservedChange({
                ...observed,
                massComparison: massComparison as HeatObservedResult["massComparison"],
              })
            }
          />
          <ChoiceGroup
            legend={HEAT_COPY.energyCompareLabel}
            name="heat-energy-compare"
            options={energyOptions}
            value={observed.energyComparison}
            onChange={(energyComparison) =>
              onObservedChange({
                ...observed,
                energyComparison:
                  energyComparison as HeatObservedResult["energyComparison"],
              })
            }
          />
          <ChoiceGroup
            legend={HEAT_COPY.deltaTCompareLabel}
            name="heat-delta-t-compare"
            options={deltaTOptions}
            value={observed.deltaTComparison}
            onChange={(deltaTComparison) =>
              onObservedChange({
                ...observed,
                deltaTComparison:
                  deltaTComparison as HeatObservedResult["deltaTComparison"],
              })
            }
          />
          {!observedSaved ? (
            <div className="flex justify-end">
              <Button onClick={onSaveObserved}>
                {HEAT_COPY.observeSubmitExperiment}
              </Button>
            </div>
          ) : null}
        </Card>
      ) : null}

      {observedSaved ? (
        <Card className="space-y-4 p-4" data-testid="heat-comparison">
          <ChoiceGroup
            legend={HEAT_COPY.compareQuestion}
            name="heat-comparison"
            options={HEAT_COMPARE_OPTIONS}
            value={comparison}
            onChange={(value) =>
              onComparisonChange(value as "same" | "different" | "partial")
            }
          />
          {!comparisonSaved ? (
            <div className="flex justify-end">
              <Button onClick={onSaveComparison}>{HEAT_COPY.compareSubmit}</Button>
            </div>
          ) : null}
        </Card>
      ) : null}

      {comparisonSaved ? (
        <Card className="space-y-3 p-4" data-testid="heat-reflection">
          <label
            htmlFor="heat-reflection"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {reflectionPrompt}
          </label>
          <textarea
            id="heat-reflection"
            value={reflection}
            onChange={(event) => onReflectionChange(event.target.value)}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
          <div className="flex justify-end">
            <Button onClick={onSaveReflection}>{HEAT_COPY.reflectionSubmit}</Button>
          </div>
        </Card>
      ) : null}
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
  onChange: (value: string) => void;
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
            onChange={() => onChange(option.value)}
            className="mt-1"
            aria-label={`${legend} ${option.label}`}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
