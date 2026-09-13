import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_AI_OFF_COPY,
  LENS_STATION_OPTIONS,
} from "@/lib/content/convex-lens-optical-bench";
import {
  lensAiOffChallenge,
  lensAiOffJudgments,
  lensAiOffNeedsResponseEdit,
  lensAiOffPostCheckOptions,
  withLensAiOffReasoning,
  withLensAiOffStation,
  type LensAiOffDraft,
  type LensAiOffStep,
} from "@/lib/learning/lens-ai-off";
import type { IndependentChallengeAttempt } from "@/types/learning";

interface LensAiOffTaskProps {
  draft: LensAiOffDraft;
  questionIndex: number;
  totalCount: number;
  step: LensAiOffStep;
  committed: IndependentChallengeAttempt | null;
  needResponse: boolean;
  onChange: (next: LensAiOffDraft) => void;
  onCommit: () => void;
  onSubmitPostCheck: () => void;
  onRetry: () => void;
  repairMessage?: string | null;
  checking?: boolean;
}

export function LensAiOffTask({
  draft,
  questionIndex,
  totalCount,
  step,
  committed,
  needResponse,
  onChange,
  onCommit,
  onSubmitPostCheck,
  onRetry,
  repairMessage = null,
  checking = false,
}: LensAiOffTaskProps) {
  const challenge = lensAiOffChallenge(draft.currentChallengeId);
  const judgments = lensAiOffJudgments(draft.currentChallengeId);
  const postCheckOptions = lensAiOffPostCheckOptions(draft.currentChallengeId);
  const showPostCheck = step === "post-check" && Boolean(committed);
  const selectedFacts = new Set(draft.postCheckSelections);
  const showResponseEdit =
    showPostCheck &&
    committed &&
    committed.accepted === false &&
    lensAiOffNeedsResponseEdit(
      draft.currentChallengeId,
      draft.postCheckSelections,
      committed.reasoningSignals.preCommitRelation === true,
    );

  return (
    <div
      className="space-y-5"
      data-testid="lens-ai-off-task"
      data-challenge={draft.currentChallengeId}
      data-step={step}
    >
      <article className="space-y-4 border border-[var(--line)] bg-[var(--paper)] px-5 py-5">
        <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">
          {`第 ${questionIndex + 1} 题 / 共 ${totalCount} 题`}
        </p>
        <p className="text-sm leading-relaxed" data-testid="lens-ai-off-scenario">
          {challenge.scenario}
        </p>
        <p className="font-medium leading-relaxed" data-testid="lens-ai-off-question">
          {challenge.question}
        </p>
      </article>

      {!showPostCheck ? (
        <Card className="space-y-5 p-4">
          <fieldset disabled={checking} className="space-y-5 border-0 p-0">
            <p className="text-sm font-medium">{LENS_AI_OFF_COPY.structureTitle}</p>
            <QuestionGroup
              id="lens-ai-off-station"
              question={LENS_AI_OFF_COPY.conditionQuestion}
              value={draft.objectStation}
              onChange={(objectStation) => onChange(withLensAiOffStation(draft, objectStation))}
              options={[...LENS_STATION_OPTIONS]}
            />
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">{LENS_AI_OFF_COPY.judgmentQuestion}</legend>
              {judgments.map((option) => (
                <label key={option.id} className="flex cursor-pointer items-start gap-3 text-sm">
                  <input
                    type="radio"
                    name="lens-ai-off-judgment"
                    checked={draft.selectedAnswer === option.id}
                    onChange={() => onChange({ ...draft, selectedAnswer: option.id })}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
            <label className="block space-y-2">
              <span className="text-sm font-medium">{LENS_AI_OFF_COPY.reasonQuestion}</span>
              <textarea
                data-testid="lens-ai-off-reasoning"
                className="min-h-28 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
                value={draft.reasoning}
                onChange={(event) =>
                  onChange(withLensAiOffReasoning(draft, event.target.value))
                }
              />
            </label>
          </fieldset>
          {needResponse || repairMessage ? (
            <ValidationMessage
              kind={needResponse ? "missing" : "incorrect"}
              testId={repairMessage ? "lens-ai-off-repair" : undefined}
            >
              {repairMessage ?? LENS_AI_OFF_COPY.needCommit}
            </ValidationMessage>
          ) : null}
          <div className="flex justify-end">
            <Button onClick={onCommit} disabled={checking} data-testid="lens-ai-off-commit">
              {checking ? LENS_AI_OFF_COPY.checking : LENS_AI_OFF_COPY.commit}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="space-y-4 p-4" data-testid="lens-ai-off-post-check-list">
          <p className="text-sm font-medium">{LENS_AI_OFF_COPY.postCheckTitle}</p>
          {postCheckOptions.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                data-testid={`lens-ai-off-fact-${option.id}`}
                checked={selectedFacts.has(option.id)}
                onChange={() => {
                  const next = selectedFacts.has(option.id)
                    ? draft.postCheckSelections.filter((id) => id !== option.id)
                    : [...draft.postCheckSelections, option.id];
                  onChange({ ...draft, postCheckSelections: next });
                }}
              />
              <span>{option.label}</span>
            </label>
          ))}
          {repairMessage ? (
            <ValidationMessage kind="incorrect" testId="lens-ai-off-repair">
              {repairMessage}
            </ValidationMessage>
          ) : null}
          <div className="flex justify-end gap-2">
            {showResponseEdit ? (
              <Button variant="secondary" onClick={onRetry} data-testid="lens-ai-off-edit-judgment">
                {LENS_AI_OFF_COPY.editJudgment}
              </Button>
            ) : null}
            <Button onClick={onSubmitPostCheck} data-testid="lens-ai-off-post-check">
              {LENS_AI_OFF_COPY.postCheckSubmit}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
