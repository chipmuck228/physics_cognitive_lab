import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  ENGINE_COMPARE_OPTIONS,
  ENGINE_COPY,
  ENGINE_EXPERIMENT_A,
  type EngineSceneExperimentId,
} from "@/lib/content/four-stroke-engine";
import {
  hasCompleteObservedResult,
} from "@/lib/learning/engine-experiment";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import { enginePredictLabel } from "@/lib/learning/engine-predict";
import type { EngineObservedResult, ExperimentEvidence } from "@/types/learning";

interface EngineExperimentTaskProps {
  experimentId: EngineSceneExperimentId;
  evidence?: ExperimentEvidence;
  committedPrediction?: { prediction: string; reasoning: string };
  observed: EngineObservedResult;
  comparison: "" | "same" | "different" | "partial";
  reflection: string;
  canRun: boolean;
  onRun: () => void;
  onRewatch: () => void;
  onObservedChange: (
    field: keyof EngineObservedResult,
    value: "yes" | "no",
  ) => void;
  onSaveObserved: () => void;
  onComparisonChange: (value: "same" | "different" | "partial") => void;
  onSaveComparison: () => void;
  onReflectionChange: (value: string) => void;
  onSaveReflection: () => void;
}

export function EngineExperimentTask({
  experimentId,
  evidence,
  committedPrediction,
  observed,
  comparison,
  reflection,
  canRun,
  onRun,
  onRewatch,
  onObservedChange,
  onSaveObserved,
  onComparisonChange,
  onSaveComparison,
  onReflectionChange,
  onSaveReflection,
}: EngineExperimentTaskProps) {
  const isA = experimentId === ENGINE_EXPERIMENT_A;
  const hasRun = Boolean(evidence?.interventionAt);
  const observedDone = hasCompleteObservedResult(evidence?.observedResult);
  const compared = Boolean(evidence?.comparison);
  const closed = evidence?.sufficient === true;

  return (
    <div className="space-y-4" data-testid={`engine-experiment-${experimentId}`}>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {ENGINE_COPY.experimentInstruction}
      </p>

      {committedPrediction ? (
        <div data-testid="engine-prediction-locked">
        <Card className="space-y-2 p-4">
          <p className="text-xs font-medium tracking-wide text-[var(--ink-muted)]">
            {ENGINE_COPY.predictLocked}
          </p>
          <p className="text-sm text-[var(--ink)]">
            {enginePredictLabel(committedPrediction.prediction)}
          </p>
          <p className="text-sm text-[var(--ink-muted)]">
            {committedPrediction.reasoning}
          </p>
        </Card>
        </div>
      ) : null}

      {!hasRun ? (
        <Card className="space-y-3 p-4">
          {!canRun ? (
            <p className="text-sm text-[var(--ink-muted)]">{ENGINE_COPY.runLocked}</p>
          ) : null}
          <Button onClick={onRun} disabled={!canRun} data-testid="engine-run-experiment">
            {isA ? ENGINE_COPY.runA : ENGINE_COPY.runB}
          </Button>
        </Card>
      ) : null}

      {hasRun && !observedDone && !closed ? (
        <div data-testid="engine-observed-result">
        <Card className="space-y-4 p-4">
          <p className="text-sm font-medium text-[var(--ink)]">
            {ENGINE_COPY.observedQuestion}
          </p>
          {isA ? (
            <p className="text-sm text-[var(--ink-muted)]">{ENGINE_COPY.motionHint}</p>
          ) : null}
          <Choice
            legend={ENGINE_COPY.observedCombustion}
            name={`${experimentId}-combustion`}
            value={observed.combustionOccurred}
            yesLabel={ENGINE_COPY.yes}
            noLabel={ENGINE_COPY.no}
            onChange={(value) => onObservedChange("combustionOccurred", value)}
          />
          <Choice
            legend={isA ? ENGINE_COPY.observedMotion : ENGINE_COPY.observedMotionB}
            name={`${experimentId}-motion`}
            value={observed.mechanismMoving}
            yesLabel={isA ? ENGINE_COPY.motionYes : ENGINE_COPY.yes}
            noLabel={isA ? ENGINE_COPY.motionNo : ENGINE_COPY.no}
            onChange={(value) => onObservedChange("mechanismMoving", value)}
          />
          <Choice
            legend={isA ? ENGINE_COPY.observedOutput : ENGINE_COPY.observedOutputB}
            name={`${experimentId}-output`}
            value={observed.mainOutputOccurred}
            yesLabel={isA ? ENGINE_COPY.outputYes : ENGINE_COPY.outputYesB}
            noLabel={isA ? ENGINE_COPY.outputNo : ENGINE_COPY.outputNoB}
            onChange={(value) => onObservedChange("mainOutputOccurred", value)}
          />
          <div className="flex justify-end">
            <Button
              onClick={onSaveObserved}
              disabled={!hasCompleteObservedResult(observed)}
            >
              {ENGINE_COPY.observeSubmitExperiment}
            </Button>
          </div>
        </Card>
        </div>
      ) : null}

      {hasRun && observedDone && !compared && !closed ? (
        <div data-testid="engine-comparison">
        <Card className="space-y-4 p-4">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-[var(--ink)]">
              {ENGINE_COPY.compareQuestion}
            </legend>
            {ENGINE_COMPARE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 text-sm text-[var(--ink)]"
              >
                <input
                  type="radio"
                  name={`${experimentId}-comparison`}
                  value={option.value}
                  checked={comparison === option.value}
                  onChange={() => onComparisonChange(option.value)}
                />
                {option.label}
              </label>
            ))}
          </fieldset>
          <div className="flex justify-end">
            <Button onClick={onSaveComparison} disabled={!comparison}>
              {ENGINE_COPY.compareSubmit}
            </Button>
          </div>
        </Card>
        </div>
      ) : null}

      {hasRun && observedDone && compared && !closed ? (
        <div data-testid="engine-reflection">
        <Card className="space-y-4 p-4">
          <label htmlFor="engine-reflection" className="text-sm font-medium text-[var(--ink)]">
            {isA ? ENGINE_COPY.reflectionA : ENGINE_COPY.reflectionB}
          </label>
          <textarea
            id="engine-reflection"
            value={reflection}
            onChange={(event) => onReflectionChange(event.target.value)}
            placeholder={ENGINE_COPY.reflectionPlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
          <div className="flex justify-end">
            <Button onClick={onSaveReflection} disabled={!hasOwnWords(reflection)}>
              {ENGINE_COPY.reflectionSubmit}
            </Button>
          </div>
        </Card>
        </div>
      ) : null}

      {closed ? (
        <Card className="space-y-3 p-4">
          <p className="text-sm text-[var(--ink)]">
            {isA ? ENGINE_COPY.experimentAClosed : ENGINE_COPY.experimentBClosed}
          </p>
          <Button variant="secondary" onClick={onRewatch}>
            {ENGINE_COPY.rerun}
          </Button>
        </Card>
      ) : null}

      {hasRun && !closed ? (
        <Button variant="ghost" onClick={onRewatch}>
          {ENGINE_COPY.rerun}
        </Button>
      ) : null}
    </div>
  );
}

function Choice({
  legend,
  name,
  value,
  yesLabel,
  noLabel,
  onChange,
}: {
  legend: string;
  name: string;
  value: string;
  yesLabel: string;
  noLabel: string;
  onChange: (value: "yes" | "no") => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-[var(--ink)]">{legend}</legend>
      <div className="flex flex-wrap gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--ink)]">
          <input
            type="radio"
            name={name}
            checked={value === "yes"}
            onChange={() => onChange("yes")}
            aria-label={`${legend} ${yesLabel}`}
          />
          {yesLabel}
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--ink)]">
          <input
            type="radio"
            name={name}
            checked={value === "no"}
            onChange={() => onChange("no")}
            aria-label={`${legend} ${noLabel}`}
          />
          {noLabel}
        </label>
      </div>
    </fieldset>
  );
}
