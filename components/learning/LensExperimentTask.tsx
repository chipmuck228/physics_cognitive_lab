import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_COMPARE_OPTIONS,
  LENS_COPY,
  LENS_OBSERVED_FIELDS,
  lensObservedLabel,
  lensStartNextTrialLabel,
  lensTrialCompleteLabel,
} from "@/lib/content/convex-lens-optical-bench";
import type { LensObservedResult } from "@/lib/learning/lens-experiment";
import type { LensTrialCapability } from "@/lib/learning/lens-trial-intervention";
import type { LensExperimentId } from "@/lib/physics/convex-lens-optical-bench";

interface LensExperimentTaskProps {
  experimentId: LensExperimentId;
  trialIndex: number;
  title: string;
  instruction: string;
  whatChanges: string;
  whatStays: string;
  capability: LensTrialCapability;
  committedPrediction?: string | null;
  predictionLocked: boolean;
  interventionDone: boolean;
  observedSaved: boolean;
  comparisonSaved: boolean;
  reflectionSaved: boolean;
  awaitingNext?: boolean;
  nextTrialIndex?: number | null;
  observed: LensObservedResult;
  comparison: string;
  reflection: string;
  reflectionPrompt: string;
  onCover: () => void;
  onLookScreen?: () => void;
  screenAtImagePlane?: boolean;
  onStartNext?: () => void;
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

function Status({ done, label }: { done: boolean; label: string }) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs ${
        done
          ? "bg-[var(--paper)] text-[var(--ink)]"
          : "bg-transparent text-[var(--ink-muted)]"
      }`}
    >
      {`${label}${done ? "：已完成" : "：还没做"}`}
    </span>
  );
}

export function LensExperimentTask({
  experimentId,
  trialIndex,
  title,
  instruction,
  whatChanges,
  whatStays,
  capability,
  committedPrediction,
  predictionLocked,
  interventionDone,
  observedSaved,
  comparisonSaved,
  reflectionSaved,
  awaitingNext = false,
  nextTrialIndex = null,
  observed,
  comparison,
  reflection,
  reflectionPrompt,
  onCover,
  onLookScreen,
  screenAtImagePlane = true,
  onStartNext,
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
  if (awaitingNext && nextTrialIndex) {
    return (
      <div className="space-y-4" data-testid="lens-trial-complete">
        <Card className="space-y-4 p-4">
          <p className="font-serif text-xl">{lensTrialCompleteLabel(trialIndex)}</p>
          <p className="text-sm text-[var(--ink-muted)]">
            这一轮已经记下。下一轮会换一件要改的事，先不要沿用刚才的操作。
          </p>
          {reviewOnly ? null : (
            <div className="flex justify-end">
              <Button onClick={onStartNext} data-testid="lens-start-next-trial">
                {lensStartNextTrialLabel(nextTrialIndex)}
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  const phase = !predictionLocked
    ? "predict"
    : !interventionDone
      ? "intervene"
      : !observedSaved
        ? "record"
        : !comparisonSaved
          ? "compare"
          : "reflect";

  return (
    <div
      className="space-y-4"
      data-testid="lens-experiment-task"
      data-experiment={experimentId}
      data-trial-index={trialIndex}
      data-phase={phase}
    >
      <Card className="space-y-5 p-4">
        <p className="font-serif text-lg text-[var(--ink-muted)]">{title}</p>
        <div
          className="flex flex-wrap gap-2"
          data-testid="lens-experiment-status"
        >
          <Status done={predictionLocked} label="猜想" />
          <Status done={interventionDone} label="动手" />
          <Status done={observedSaved} label="看见" />
          <Status done={comparisonSaved} label="对照" />
          <Status done={reflectionSaved} label="想法" />
        </div>

        {committedPrediction ? (
          <p className="text-sm text-[var(--ink-muted)]" data-testid="lens-experiment-prediction">
            {`你刚才猜的：${committedPrediction}`}
          </p>
        ) : (
          <ValidationMessage kind="missing">{LENS_COPY.runNeedPrediction}</ValidationMessage>
        )}

        {phase === "intervene" ? (
          <section className="space-y-2">
            <p className="text-sm" data-testid="lens-intervention-prompt">
              {instruction}
            </p>
            <p className="text-sm text-[var(--ink-muted)]" data-testid="lens-experiment-changed">
              {`会变的：${whatChanges}。不变的：${whatStays}。`}
            </p>
            {!reviewOnly && capability === "cover-lens" ? (
              <div className="flex justify-end">
                <Button onClick={onCover} data-testid="lens-cover-lens">
                  {LENS_COPY.coverLens}
                </Button>
              </div>
            ) : null}
          </section>
        ) : null}

        {phase === "record" || phase === "compare" || phase === "reflect" ? (
          <fieldset disabled={reviewOnly} className="space-y-4 border-0 p-0">
            {interventionDone ? (
              <div data-testid="lens-experiment-completion">
                <ValidationMessage kind="info">已经在光具座上完成这次改变。</ValidationMessage>
              </div>
            ) : null}

            {phase === "record" ? (
              <section className="space-y-3">
                <p className="text-sm text-[var(--ink-muted)]">{LENS_COPY.observeAfterIntervention}</p>
                {onLookScreen && capability === "move-object" && !reviewOnly ? (
                  <div className="flex justify-end">
                    <Button
                      variant="secondary"
                      onClick={onLookScreen}
                      data-testid="lens-experiment-look-screen"
                    >
                      {screenAtImagePlane ? LENS_COPY.screenOffImage : LENS_COPY.screenAtImage}
                    </Button>
                  </div>
                ) : null}
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
            ) : null}

            {phase === "compare" ? (
              <section className="space-y-3" data-testid="lens-compare-surface">
                <div className="grid gap-3 rounded-2xl border border-[var(--line)] p-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-[var(--ink-muted)]">{LENS_COPY.compareMine}</p>
                    <p className="text-sm" data-testid="lens-compare-prediction">
                      {committedPrediction ?? "还没有记下猜想。"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--ink-muted)]">{LENS_COPY.compareActual}</p>
                    <p className="text-sm" data-testid="lens-compare-observation">
                      {`${lensObservedLabel("screen", observed.screen)}；${lensObservedLabel("sizeOrCover", observed.sizeOrCover)}`}
                    </p>
                  </div>
                </div>
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
            ) : null}

            {phase === "reflect" ? (
              <section className="space-y-3">
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
                  <ValidationMessage kind="missing">{LENS_COPY.reflectionNeedOwnWords}</ValidationMessage>
                ) : null}
                {reviewOnly ? null : (
                  <div className="flex flex-col items-end gap-2">
                    {!canSaveReflection && reflectionDisabledReason ? (
                      <ValidationMessage kind="info">{reflectionDisabledReason}</ValidationMessage>
                    ) : null}
                    {!reflection.trim() ? (
                      <ValidationMessage kind="info">{LENS_COPY.reflectionNeedOwnWords}</ValidationMessage>
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
            ) : null}
          </fieldset>
        ) : null}
      </Card>
    </div>
  );
}
