import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_AI_OFF_COPY,
  LENS_MEETING_OPTIONS,
  LENS_NATURE_OPTIONS,
  LENS_ORIENTATION_OPTIONS,
  LENS_RECEIVE_OPTIONS,
  LENS_SIDE_OPTIONS,
  LENS_SIZE_OPTIONS,
  LENS_STATION_OPTIONS,
} from "@/lib/content/convex-lens-optical-bench";
import {
  canCommitLensAiOffResponse,
  lensAiOffChallenge,
  lensAiOffJudgments,
  lensAiOffPostCheckOptions,
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
}: LensAiOffTaskProps) {
  const challenge = lensAiOffChallenge(draft.currentChallengeId);
  const judgments = lensAiOffJudgments(draft.currentChallengeId);
  const postCheckOptions = lensAiOffPostCheckOptions(draft.currentChallengeId);
  const showPostCheck = step === "post-check" && Boolean(committed);
  const selectedFacts = new Set(draft.postCheckSelections);
  const canCommit = canCommitLensAiOffResponse(draft);
  const showRetry =
    showPostCheck && committed && committed.accepted === false && committed.postCheckIds.length > 0;

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
          <p className="text-sm font-medium">{LENS_AI_OFF_COPY.structureTitle}</p>
          <QuestionGroup
            id="lens-ai-off-station"
            question="物体相对焦点在哪里？"
            value={draft.objectStation}
            onChange={(objectStation) => onChange({ ...draft, objectStation })}
            options={[...LENS_STATION_OPTIONS]}
          />
          <QuestionGroup
            id="lens-ai-off-meeting"
            question="光线怎样相遇？"
            value={draft.meetingMode}
            onChange={(meetingMode) => onChange({ ...draft, meetingMode })}
            options={[...LENS_MEETING_OPTIONS]}
          />
          <QuestionGroup
            id="lens-ai-off-side"
            question="像在哪一侧？"
            value={draft.side}
            onChange={(side) => onChange({ ...draft, side })}
            options={[...LENS_SIDE_OPTIONS]}
          />
          <QuestionGroup
            id="lens-ai-off-nature"
            question="像的性质？"
            value={draft.nature}
            onChange={(nature) => onChange({ ...draft, nature })}
            options={[...LENS_NATURE_OPTIONS]}
          />
          <QuestionGroup
            id="lens-ai-off-orientation"
            question="正立还是倒立？"
            value={draft.orientation}
            onChange={(orientation) => onChange({ ...draft, orientation })}
            options={[...LENS_ORIENTATION_OPTIONS]}
          />
          <QuestionGroup
            id="lens-ai-off-size"
            question="大小怎样？"
            value={draft.size}
            onChange={(size) => onChange({ ...draft, size })}
            options={[...LENS_SIZE_OPTIONS]}
          />
          <QuestionGroup
            id="lens-ai-off-receive"
            question="卡片或白纸能不能接到？"
            value={draft.screenReceivable}
            onChange={(screenReceivable) => onChange({ ...draft, screenReceivable })}
            options={[...LENS_RECEIVE_OPTIONS]}
          />
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">你的判断</legend>
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
            <span className="text-sm font-medium">先写下理由，再提交判断。</span>
            <textarea
              data-testid="lens-ai-off-reasoning"
              className="min-h-28 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
              value={draft.reasoning}
              onChange={(event) => onChange({ ...draft, reasoning: event.target.value })}
            />
          </label>
          {needResponse || !canCommit ? (
            <ValidationMessage kind="missing">{LENS_AI_OFF_COPY.needCommit}</ValidationMessage>
          ) : null}
          <div className="flex justify-end">
            <Button onClick={onCommit} disabled={!canCommit} data-testid="lens-ai-off-commit">
              {LENS_AI_OFF_COPY.commit}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="space-y-4 p-4">
          <p className="text-sm font-medium">{LENS_AI_OFF_COPY.postCheckTitle}</p>
          {postCheckOptions.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
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
          <div className="flex justify-end gap-2">
            {showRetry ? (
              <Button variant="secondary" onClick={onRetry}>
                再改一改
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
