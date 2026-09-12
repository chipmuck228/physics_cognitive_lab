import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  OHMS_COMPARE_OPTIONS,
  OHMS_COPY,
  OHMS_CURRENT_CHANGE_OPTIONS,
  OHMS_HELD_OPTIONS,
} from "@/lib/content/simple-resistor-circuit";
import type { OhmsObservedResult } from "@/lib/learning/ohms-experiment";
import type { OhmsExperimentId } from "@/lib/physics/simple-resistor-circuit";

interface OhmsExperimentTaskProps {
  experimentId: OhmsExperimentId;
  title: string;
  canRun: boolean;
  hasRun: boolean;
  observed: OhmsObservedResult;
  comparison: "" | "same" | "different" | "partial";
  reflection: string;
  reflectionPrompt: string;
  onRun: () => void;
  onObservedChange: (next: OhmsObservedResult) => void;
  onSaveObserved: () => void;
  onComparisonChange: (value: "same" | "different" | "partial") => void;
  onSaveComparison: () => void;
  onReflectionChange: (value: string) => void;
  onSaveReflection: () => void;
  observedSaved: boolean;
  comparisonSaved: boolean;
  observedNeedMore: boolean;
  comparisonNeedMore: boolean;
  reflectionNeedMore: boolean;
}

export function OhmsExperimentTask({
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
  observedNeedMore,
  comparisonNeedMore,
  reflectionNeedMore,
}: OhmsExperimentTaskProps) {
  return (
    <div className="space-y-4" data-testid="ohms-experiment-task">
      <p className="text-sm font-medium text-[var(--ink)]">{title}</p>
      <Button onClick={onRun} disabled={!canRun || hasRun} data-testid="ohms-run-experiment">
        {OHMS_COPY.runExperiment}
      </Button>
      {!canRun ? (
        <ValidationMessage kind="missing">{OHMS_COPY.runNeedPrediction}</ValidationMessage>
      ) : null}

      {hasRun ? (
        <Card className="space-y-4 p-4" data-testid="ohms-observed-result">
          <QuestionGroup
            id="ohms-held-quantity"
            question={OHMS_COPY.heldQuantityQuestion}
            value={observed.heldQuantity}
            onChange={(heldQuantity) =>
              onObservedChange({
                ...observed,
                heldQuantity: heldQuantity as OhmsObservedResult["heldQuantity"],
              })
            }
            options={[...OHMS_HELD_OPTIONS]}
          />
          <QuestionGroup
            id="ohms-current-change"
            question={OHMS_COPY.currentChangeQuestion}
            value={observed.currentChange}
            onChange={(currentChange) =>
              onObservedChange({
                ...observed,
                currentChange: currentChange as OhmsObservedResult["currentChange"],
              })
            }
            options={[...OHMS_CURRENT_CHANGE_OPTIONS]}
          />
          {observedNeedMore ? (
            <ValidationMessage kind="missing">{OHMS_COPY.blockedNeedMore}</ValidationMessage>
          ) : null}
          {!observedSaved ? (
            <div className="flex justify-end">
              <Button onClick={onSaveObserved}>{OHMS_COPY.observeSubmitExperiment}</Button>
            </div>
          ) : null}
        </Card>
      ) : null}

      {observedSaved ? (
        <Card className="space-y-4 p-4" data-testid="ohms-comparison">
          <QuestionGroup
            id="ohms-comparison"
            question={OHMS_COPY.compareQuestion}
            value={comparison}
            onChange={(value) =>
              onComparisonChange(value as "same" | "different" | "partial")
            }
            options={[...OHMS_COMPARE_OPTIONS]}
          />
          {comparisonNeedMore ? (
            <ValidationMessage kind="missing">{OHMS_COPY.blockedNeedMore}</ValidationMessage>
          ) : null}
          {!comparisonSaved ? (
            <div className="flex justify-end">
              <Button onClick={onSaveComparison}>{OHMS_COPY.compareSubmit}</Button>
            </div>
          ) : null}
        </Card>
      ) : null}

      {comparisonSaved ? (
        <Card className="space-y-3 p-4" data-testid="ohms-reflection">
          <label className="block space-y-2">
            <span className="text-sm font-medium">{reflectionPrompt}</span>
            <textarea
              id="ohms-reflection"
              className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
              value={reflection}
              onChange={(event) => onReflectionChange(event.target.value)}
            />
          </label>
          {reflectionNeedMore ? (
            <ValidationMessage kind="missing">{OHMS_COPY.blockedNeedMore}</ValidationMessage>
          ) : null}
          <div className="flex justify-end">
            <Button onClick={onSaveReflection}>{OHMS_COPY.reflectionSubmit}</Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
