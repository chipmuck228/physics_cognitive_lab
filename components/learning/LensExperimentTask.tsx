import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_COMPARE_OPTIONS,
  LENS_COPY,
  LENS_OBSERVED_FIELDS,
} from "@/lib/content/convex-lens-optical-bench";
import type { LensObservedResult } from "@/lib/learning/lens-experiment";
import type { LensExperimentId } from "@/lib/physics/convex-lens-optical-bench";

interface LensExperimentTaskProps {
  experimentId: LensExperimentId;
  title: string;
  canRun: boolean;
  hasRun: boolean;
  observed: LensObservedResult;
  comparison: string;
  reflection: string;
  reflectionPrompt: string;
  onRun: () => void;
  onObservedChange: (next: LensObservedResult) => void;
  onSaveObserved: () => void;
  onComparisonChange: (value: string) => void;
  onSaveComparison: () => void;
  onReflectionChange: (value: string) => void;
  onSaveReflection: () => void;
  observedNeedMore: boolean;
}

export function LensExperimentTask({
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
  observedNeedMore,
}: LensExperimentTaskProps) {
  return (
    <div className="space-y-4" data-testid="lens-experiment-task" data-experiment={experimentId}>
      <Card className="space-y-4 p-4">
        <h3 className="font-serif text-xl">{title}</h3>
        {!hasRun ? (
          <div className="flex justify-end">
            <Button onClick={onRun} disabled={!canRun}>
              {LENS_COPY.runExperiment}
            </Button>
          </div>
        ) : null}
        {!canRun && !hasRun ? (
          <ValidationMessage kind="missing">{LENS_COPY.runNeedPrediction}</ValidationMessage>
        ) : null}
        {hasRun ? (
          <>
            <QuestionGroup
              id={`lens-observed-screen-${experimentId}`}
              question="光屏上怎样了？"
              value={observed.screen}
              onChange={(screen) =>
                onObservedChange({ ...observed, screen: screen as LensObservedResult["screen"] })
              }
              options={[...LENS_OBSERVED_FIELDS.screen]}
            />
            <QuestionGroup
              id={`lens-observed-size-${experimentId}`}
              question="像本身怎样了？"
              value={observed.sizeOrCover}
              onChange={(sizeOrCover) =>
                onObservedChange({
                  ...observed,
                  sizeOrCover: sizeOrCover as LensObservedResult["sizeOrCover"],
                })
              }
              options={[...LENS_OBSERVED_FIELDS.sizeOrCover]}
            />
            {observedNeedMore ? (
              <ValidationMessage kind="missing">先记下光屏和像分别怎样了。</ValidationMessage>
            ) : null}
            <div className="flex justify-end">
              <Button variant="secondary" onClick={onSaveObserved}>
                {LENS_COPY.observeSubmitExperiment}
              </Button>
            </div>
            <QuestionGroup
              id={`lens-compare-${experimentId}`}
              question={LENS_COPY.compareQuestion}
              value={comparison}
              onChange={onComparisonChange}
              options={[...LENS_COMPARE_OPTIONS]}
            />
            <div className="flex justify-end">
              <Button variant="secondary" onClick={onSaveComparison}>
                {LENS_COPY.compareSubmit}
              </Button>
            </div>
            <label className="block space-y-2">
              <span className="text-sm font-medium">{reflectionPrompt}</span>
              <textarea
                data-testid={`lens-reflection-${experimentId}`}
                className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
                value={reflection}
                onChange={(event) => onReflectionChange(event.target.value)}
              />
            </label>
            <div className="flex justify-end">
              <Button onClick={onSaveReflection}>{LENS_COPY.reflectionSubmit}</Button>
            </div>
          </>
        ) : null}
      </Card>
    </div>
  );
}
