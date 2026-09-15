import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_COMPARE_OPTIONS,
  LENS_COPY,
  LENS_OBSERVED_FIELDS,
  lensLightPathNeedCopy,
  lensObservedLabel,
  lensObservedSizeOptions,
  lensRevealBackwardExtensionLabel,
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
  screenInspected?: boolean;
  hidePhysicalControls?: boolean;
  lightPathNote?: string | null;
  showBackwardExtensionReveal?: boolean;
  backwardExtensionRevealed?: boolean;
  onRevealBackwardExtension?: () => void;
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
  screenInspected,
  hidePhysicalControls = false,
  lightPathNote = null,
  showBackwardExtensionReveal = false,
  backwardExtensionRevealed = false,
  onRevealBackwardExtension,
}: LensExperimentTaskProps) {
  void title;
  void whatChanges;
  void whatStays;
  if (awaitingNext && nextTrialIndex) {
    return (
      <div className="space-y-4" data-testid="lens-trial-complete">
        <Card className="space-y-4 p-4">
          <p className="font-serif text-xl">{lensTrialCompleteLabel(trialIndex)}</p>
          <p className="text-sm text-[var(--ink-muted)]">
            这一轮已经记下。下一次会换一个新的问题，先不要沿用刚才的操作。
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

  const waitingForInspect =
    capability === "move-object" && screenInspected === false;
  const phase = !predictionLocked
    ? "predict"
    : !interventionDone
      ? "intervene"
      : waitingForInspect
        ? "inspect"
        : !observedSaved
          ? "record"
          : !comparisonSaved
            ? "compare"
            : "reflect";

  const physicalControlsHidden = hidePhysicalControls || reviewOnly;
  const showInterveneControls =
    phase === "intervene" && !physicalControlsHidden && capability === "cover-lens";
  const showInspectControls =
    phase === "inspect" && !physicalControlsHidden && Boolean(onLookScreen);

  return (
    <div
      className="space-y-4"
      data-testid="lens-experiment-task"
      data-experiment={experimentId}
      data-trial-index={trialIndex}
      data-phase={phase}
    >
      {phase === "intervene" || phase === "inspect" ? (
        <>
          {phase === "intervene" ? (
            <p className="sr-only" data-testid="lens-intervention-prompt">
              {instruction}
            </p>
          ) : null}
          {showInterveneControls ? (
            <div className="flex justify-end">
              <Button onClick={onCover} data-testid="lens-cover-lens">
                {LENS_COPY.coverLens}
              </Button>
            </div>
          ) : null}
          {showInspectControls ? (
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => onLookScreen?.()}
                data-testid="lens-experiment-look-screen"
              >
                {screenAtImagePlane ? LENS_COPY.screenOffImage : LENS_COPY.screenAtImage}
              </Button>
            </div>
          ) : null}
        </>
      ) : (
      <Card className="space-y-5 p-4">
        {lightPathNote && (phase === "compare" || phase === "reflect") ? (
          <p className="text-sm text-[var(--ink-muted)]" data-testid="lens-light-path-note">
            {lightPathNote}
          </p>
        ) : null}
        {phase === "record" || phase === "compare" || phase === "reflect" ? (
          <fieldset disabled={reviewOnly} className="space-y-4 border-0 p-0">
            {phase === "record" ? (
              <section className="space-y-3">
                {!hidePhysicalControls &&
                onLookScreen &&
                capability === "move-object" &&
                !reviewOnly ? (
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
                  options={[...lensObservedSizeOptions(experimentId)]}
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
                <p className="text-sm text-[var(--ink-muted)]" data-testid="lens-experiment-prediction">
                  {`你刚才猜的：${committedPrediction ?? "还没有记下猜想。"}`}
                </p>
                <p className="sr-only" data-testid="lens-compare-prediction">
                  {committedPrediction ?? "还没有记下猜想。"}
                </p>
                <p className="sr-only" data-testid="lens-compare-observation">
                  {`${lensObservedLabel("screen", observed.screen)}；${lensObservedLabel("sizeOrCover", observed.sizeOrCover)}`}
                </p>
                <QuestionGroup
                  id={`lens-compare-${experimentId}`}
                  question={LENS_COPY.compareQuestion}
                  hideQuestion
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
                {showBackwardExtensionReveal && !reviewOnly ? (
                  <div className="flex justify-end">
                    <Button
                      variant="secondary"
                      onClick={onRevealBackwardExtension}
                      disabled={backwardExtensionRevealed || !onRevealBackwardExtension}
                      data-testid="lens-reveal-backward-extension"
                    >
                      {backwardExtensionRevealed
                        ? "已经往回画了"
                        : lensRevealBackwardExtensionLabel()}
                    </Button>
                  </div>
                ) : null}
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
      )}
    </div>
  );
}
