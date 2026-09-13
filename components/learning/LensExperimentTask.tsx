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
  changedVariable: string;
  committedPrediction?: string | null;
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
  reflectionNeedMore?: boolean;
  canSaveObserved?: boolean;
  canSaveComparison?: boolean;
  canSaveReflection?: boolean;
  observedDisabledReason?: string;
  comparisonDisabledReason?: string;
  reflectionDisabledReason?: string;
  reviewOnly?: boolean;
}

export function LensExperimentTask({
  experimentId,
  title,
  changedVariable,
  committedPrediction,
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
  reflectionNeedMore = false,
  canSaveObserved = true,
  canSaveComparison = true,
  canSaveReflection = true,
  observedDisabledReason,
  comparisonDisabledReason,
  reflectionDisabledReason,
  reviewOnly = false,
}: LensExperimentTaskProps) {
  return (
    <div className="space-y-4" data-testid="lens-experiment-task" data-experiment={experimentId}>
      <Card className="space-y-5 p-4">
        <h3 className="font-serif text-xl">{title}</h3>
        <section className="space-y-2">
          <p className="text-sm font-medium">① 我的预测</p>
          <p className="text-sm text-[var(--ink-muted)]" data-testid="lens-experiment-prediction">
            {committedPrediction ?? "还没有锁定预测。"}
          </p>
        </section>
        <section className="space-y-2">
          <p className="text-sm font-medium">② 我做了什么</p>
          <p className="text-sm text-[var(--ink-muted)]" data-testid="lens-experiment-changed">
            {changedVariable}
          </p>
          {!hasRun && !reviewOnly ? (
            <div className="flex justify-end">
              <Button onClick={onRun} disabled={!canRun}>
                {LENS_COPY.runExperiment}
              </Button>
            </div>
          ) : null}
          {!canRun && !hasRun ? (
            <ValidationMessage kind="missing">{LENS_COPY.runNeedPrediction}</ValidationMessage>
          ) : null}
        </section>
        {hasRun ? (
          <fieldset disabled={reviewOnly} className="space-y-4 border-0 p-0">
            <section className="space-y-3">
              <p className="text-sm font-medium">③ 实际看到什么</p>
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
              {reviewOnly ? null : (
                <div className="flex flex-col items-end gap-2">
                  {!canSaveObserved && observedDisabledReason ? (
                    <ValidationMessage kind="info">{observedDisabledReason}</ValidationMessage>
                  ) : null}
                  <Button
                    variant="secondary"
                    onClick={onSaveObserved}
                    disabled={!canSaveObserved}
                    data-testid="lens-save-observed"
                  >
                    {LENS_COPY.observeSubmitExperiment}
                  </Button>
                </div>
              )}
            </section>
            <section className="space-y-3">
              <p className="text-sm font-medium">④ 和预测哪里相同 / 不同</p>
              {committedPrediction ? (
                <p className="text-sm text-[var(--ink-muted)]">{`对照刚才锁定的预测：${committedPrediction}`}</p>
              ) : null}
              <QuestionGroup
                id={`lens-compare-${experimentId}`}
                question={LENS_COPY.compareQuestion}
                value={comparison}
                onChange={onComparisonChange}
                options={[...LENS_COMPARE_OPTIONS]}
              />
              {reviewOnly ? null : (
                <div className="flex flex-col items-end gap-2">
                  {!canSaveComparison && comparisonDisabledReason ? (
                    <ValidationMessage kind="info">{comparisonDisabledReason}</ValidationMessage>
                  ) : null}
                  <Button
                    variant="secondary"
                    onClick={onSaveComparison}
                    disabled={!canSaveComparison}
                    data-testid="lens-save-comparison"
                  >
                    {LENS_COPY.compareSubmit}
                  </Button>
                </div>
              )}
            </section>
            <section className="space-y-3">
              <p className="text-sm font-medium">⑤ 我现在怎么想</p>
              <label className="block space-y-2">
                <span className="text-sm font-medium">{reflectionPrompt}</span>
                <textarea
                  data-testid={`lens-reflection-${experimentId}`}
                  className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm disabled:opacity-60"
                  value={reflection}
                  onChange={(event) => onReflectionChange(event.target.value)}
                  disabled={reviewOnly}
                />
              </label>
              {reflectionNeedMore ? (
                <ValidationMessage kind="missing">先写下你现在怎么想，再记下。</ValidationMessage>
              ) : null}
              {reviewOnly ? null : (
                <div className="flex flex-col items-end gap-2">
                  {!canSaveReflection && reflectionDisabledReason ? (
                    <ValidationMessage kind="info">{reflectionDisabledReason}</ValidationMessage>
                  ) : null}
                  <Button
                    onClick={onSaveReflection}
                    disabled={!canSaveReflection}
                    data-testid="lens-save-reflection"
                  >
                    {LENS_COPY.reflectionSubmit}
                  </Button>
                </div>
              )}
            </section>
          </fieldset>
        ) : null}
      </Card>
    </div>
  );
}
