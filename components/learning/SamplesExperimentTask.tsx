import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  SAMPLES_COMPARE_OPTIONS,
  SAMPLES_COPY,
  SAMPLES_CUT_DENSITY_OPTIONS,
  SAMPLES_CUT_MASS_OPTIONS,
  SAMPLES_CUT_TOGETHER_OPTIONS,
  SAMPLES_CUT_VOLUME_OPTIONS,
  SAMPLES_DENSITY_COMPARE_B_OPTIONS,
  SAMPLES_DENSITY_COMPARE_OPTIONS,
  SAMPLES_MASS_COMPARE_B_OPTIONS,
  SAMPLES_MASS_COMPARE_OPTIONS,
  SAMPLES_VOLUME_COMPARE_B_OPTIONS,
  SAMPLES_VOLUME_COMPARE_OPTIONS,
} from "@/lib/content/equal-volume-material-samples";
import type { SamplesObservedResult } from "@/lib/learning/samples-experiment";
import {
  SAMPLE_CATALOG,
  SAMPLES_EXPERIMENT_B,
  SAMPLES_EXPERIMENT_C,
  applyCutFactor,
  type SamplesExperimentId,
} from "@/lib/physics/equal-volume-material-samples";

interface SamplesExperimentTaskProps {
  experimentId: SamplesExperimentId;
  title: string;
  canRun: boolean;
  hasRun: boolean;
  observed: SamplesObservedResult;
  comparison: "" | "same" | "different" | "partial";
  reflection: string;
  reflectionPrompt: string;
  onRun: () => void;
  onObservedChange: (next: SamplesObservedResult) => void;
  onSaveObserved: () => void;
  onComparisonChange: (value: "same" | "different" | "partial") => void;
  onSaveComparison: () => void;
  onReflectionChange: (value: string) => void;
  onSaveReflection: () => void;
  observedSaved: boolean;
  comparisonSaved: boolean;
}

export function SamplesExperimentTask({
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
}: SamplesExperimentTaskProps) {
  const isCut = experimentId === SAMPLES_EXPERIMENT_C;
  const isSameMass = experimentId === SAMPLES_EXPERIMENT_B;

  return (
    <div className="space-y-4" data-testid="samples-experiment-task">
      <p className="text-sm font-medium text-[var(--ink)]">{title}</p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {SAMPLES_COPY.experimentIntro}
      </p>
      <Button
        onClick={onRun}
        disabled={!canRun || hasRun}
        data-testid="samples-run-experiment"
      >
        {SAMPLES_COPY.runExperiment}
      </Button>
      {!canRun ? (
        <p className="text-sm text-[var(--ink-muted)]">
          {SAMPLES_COPY.runNeedPrediction}
        </p>
      ) : null}

      {hasRun ? (
        <Card className="space-y-4 p-4" data-testid="samples-observed-result">
          {isCut ? (
            <>
              <CutBeforeAfter />
              <ChoiceGroup
                legend={SAMPLES_COPY.massChangeLabel}
                name="samples-mass-change"
                options={SAMPLES_CUT_MASS_OPTIONS}
                value={observed.massChange}
                onChange={(massChange) =>
                  onObservedChange({
                    ...observed,
                    massChange: massChange as SamplesObservedResult["massChange"],
                  })
                }
              />
              <ChoiceGroup
                legend={SAMPLES_COPY.volumeChangeLabel}
                name="samples-volume-change"
                options={SAMPLES_CUT_VOLUME_OPTIONS}
                value={observed.volumeChange}
                onChange={(volumeChange) =>
                  onObservedChange({
                    ...observed,
                    volumeChange: volumeChange as SamplesObservedResult["volumeChange"],
                  })
                }
              />
              <ChoiceGroup
                legend={SAMPLES_COPY.densityChangeLabel}
                name="samples-density-change"
                options={SAMPLES_CUT_DENSITY_OPTIONS}
                value={observed.densityChange}
                onChange={(densityChange) =>
                  onObservedChange({
                    ...observed,
                    densityChange: densityChange as SamplesObservedResult["densityChange"],
                  })
                }
              />
              <ChoiceGroup
                legend={SAMPLES_COPY.experimentTogetherLabel}
                name="samples-together-change"
                options={SAMPLES_CUT_TOGETHER_OPTIONS}
                value={observed.togetherChange}
                onChange={(togetherChange) =>
                  onObservedChange({
                    ...observed,
                    togetherChange:
                      togetherChange as SamplesObservedResult["togetherChange"],
                  })
                }
              />
            </>
          ) : (
            <>
              <ChoiceGroup
                legend={SAMPLES_COPY.massCompareLabel}
                name="samples-mass-compare"
                options={
                  isSameMass
                    ? SAMPLES_MASS_COMPARE_B_OPTIONS
                    : SAMPLES_MASS_COMPARE_OPTIONS
                }
                value={observed.massComparison}
                onChange={(massComparison) =>
                  onObservedChange({
                    ...observed,
                    massComparison:
                      massComparison as SamplesObservedResult["massComparison"],
                  })
                }
              />
              <ChoiceGroup
                legend={SAMPLES_COPY.volumeCompareLabel}
                name="samples-volume-compare"
                options={
                  isSameMass
                    ? SAMPLES_VOLUME_COMPARE_B_OPTIONS
                    : SAMPLES_VOLUME_COMPARE_OPTIONS
                }
                value={observed.volumeComparison}
                onChange={(volumeComparison) =>
                  onObservedChange({
                    ...observed,
                    volumeComparison:
                      volumeComparison as SamplesObservedResult["volumeComparison"],
                  })
                }
              />
              <ChoiceGroup
                legend={SAMPLES_COPY.densityCompareLabel}
                name="samples-density-compare"
                options={
                  isSameMass
                    ? SAMPLES_DENSITY_COMPARE_B_OPTIONS
                    : SAMPLES_DENSITY_COMPARE_OPTIONS
                }
                value={observed.densityComparison}
                onChange={(densityComparison) =>
                  onObservedChange({
                    ...observed,
                    densityComparison:
                      densityComparison as SamplesObservedResult["densityComparison"],
                  })
                }
              />
            </>
          )}
          {!observedSaved ? (
            <div className="flex justify-end">
              <Button onClick={onSaveObserved}>
                {SAMPLES_COPY.observeSubmitExperiment}
              </Button>
            </div>
          ) : null}
        </Card>
      ) : null}

      {observedSaved ? (
        <Card className="space-y-4 p-4" data-testid="samples-comparison">
          <ChoiceGroup
            legend={SAMPLES_COPY.compareQuestion}
            name="samples-comparison"
            options={SAMPLES_COMPARE_OPTIONS}
            value={comparison}
            onChange={(value) =>
              onComparisonChange(value as "same" | "different" | "partial")
            }
          />
          {!comparisonSaved ? (
            <div className="flex justify-end">
              <Button onClick={onSaveComparison}>{SAMPLES_COPY.compareSubmit}</Button>
            </div>
          ) : null}
        </Card>
      ) : null}

      {comparisonSaved ? (
        <Card className="space-y-3 p-4" data-testid="samples-reflection">
          <label
            htmlFor="samples-reflection"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {reflectionPrompt}
          </label>
          <textarea
            id="samples-reflection"
            value={reflection}
            onChange={(event) => onReflectionChange(event.target.value)}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
          <div className="flex justify-end">
            <Button onClick={onSaveReflection}>{SAMPLES_COPY.reflectionSubmit}</Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function CutBeforeAfter() {
  const before = SAMPLE_CATALOG["iron-cube"];
  const after = applyCutFactor(before, 0.5);
  return (
    <div
      className="grid grid-cols-2 gap-3 rounded-2xl border border-[var(--line)] px-4 py-3 text-sm"
      data-testid="samples-cut-before-after"
    >
      <p className="col-span-2 text-xs tracking-[0.12em] text-[var(--ink-muted)]">
        {SAMPLES_COPY.experimentBeforeAfter}
      </p>
      <p>
        切开前：{before.massG} g ÷ {before.volumeCm3} cm³
      </p>
      <p>
        切开后：{after.massG} g ÷ {after.volumeCm3} cm³
      </p>
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
