import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  OHMS_AI_OFF_COPY,
  OHMS_AI_OFF_PRE_COMMIT_A,
  OHMS_AI_OFF_PRE_COMMIT_B,
  OHMS_COPY,
} from "@/lib/content/simple-resistor-circuit";
import {
  OHMS_AI_OFF_A,
  canCommitOhmsAiOffResponse,
  ohmsAiOffChallenge,
  ohmsAiOffJudgments,
  ohmsAiOffPostCheckOptions,
  ohmsJudgmentLabelFor,
  type OhmsAiOffStep,
} from "@/lib/learning/ohms-ai-off";
import type { IndependentChallengeAttempt } from "@/types/learning";

interface OhmsAiOffTaskProps {
  challengeId: string;
  questionIndex: number;
  totalCount: number;
  step: OhmsAiOffStep;
  selectedAnswer: string;
  reasoning: string;
  postCheckSelections: string[];
  preCommitEvidenceIds: string[];
  committed: IndependentChallengeAttempt | null;
  needResponse: boolean;
  needPostCheck: boolean;
  onSelectedAnswerChange: (value: string) => void;
  onReasoningChange: (value: string) => void;
  onPreCommitEvidenceChange: (ids: string[]) => void;
  onPostCheckToggle: (id: string) => void;
  onCommit: () => void;
  onSubmitPostCheck: () => void;
  onRetry: () => void;
}

export function OhmsAiOffTask({
  challengeId,
  questionIndex,
  totalCount,
  step,
  selectedAnswer,
  reasoning,
  postCheckSelections,
  preCommitEvidenceIds,
  committed,
  needResponse,
  needPostCheck,
  onSelectedAnswerChange,
  onReasoningChange,
  onPreCommitEvidenceChange,
  onPostCheckToggle,
  onCommit,
  onSubmitPostCheck,
  onRetry,
}: OhmsAiOffTaskProps) {
  const challenge = ohmsAiOffChallenge(challengeId);
  const judgments = ohmsAiOffJudgments(challengeId);
  const postCheckOptions = ohmsAiOffPostCheckOptions(challengeId);
  const showPostCheck = step === "post-check" && Boolean(committed);
  const selectedFacts = new Set(postCheckSelections);
  const preCommitOptions =
    challengeId === OHMS_AI_OFF_A ? OHMS_AI_OFF_PRE_COMMIT_A : OHMS_AI_OFF_PRE_COMMIT_B;
  const canCommit = canCommitOhmsAiOffResponse({
    challengeId,
    selectedAnswer,
    studentReasoning: reasoning,
    preCommitEvidenceIds,
  });
  const showRetry =
    showPostCheck &&
    committed &&
    committed.accepted === false &&
    committed.postCheckIds.length > 0;

  return (
    <div
      className="space-y-5"
      data-testid="ohms-ai-off-task"
      data-challenge={challengeId}
      data-step={step}
    >
      <article className="space-y-4 border border-[var(--line)] bg-[var(--paper)] px-5 py-5">
        <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">
          {`第 ${questionIndex + 1} 题 / 共 ${totalCount} 题`}
        </p>
        <p className="text-sm leading-relaxed" data-testid="ohms-ai-off-scenario">
          {challenge.scenario}
        </p>
        <p className="font-medium leading-relaxed" data-testid="ohms-ai-off-question">
          {challenge.question}
        </p>
      </article>

      {!showPostCheck ? (
        <>
          <fieldset className="space-y-3" data-testid="ohms-ai-off-options">
            <legend className="text-sm font-medium">选择你的判断</legend>
            {judgments.map((option) => (
              <label key={option.id} className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="radio"
                  name={`ohms-ai-off-${challengeId}`}
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={() => onSelectedAnswerChange(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          <fieldset className="space-y-3" data-testid="ohms-ai-off-pre-commit">
            <legend className="text-sm font-medium">
              {challengeId === OHMS_AI_OFF_A
                ? OHMS_AI_OFF_COPY.preCommitATitle
                : OHMS_AI_OFF_COPY.preCommitBTitle}
            </legend>
            {preCommitOptions.map((option) => (
              <label key={option.id} className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={preCommitEvidenceIds.includes(option.id)}
                  onChange={() => {
                    const next = preCommitEvidenceIds.includes(option.id)
                      ? preCommitEvidenceIds.filter((id) => id !== option.id)
                      : [...preCommitEvidenceIds, option.id];
                    onPreCommitEvidenceChange(next);
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          <label className="block space-y-2" data-testid="ohms-ai-off-reasoning">
            <span className="text-sm font-medium">{OHMS_COPY.reasonLabel}</span>
            <textarea
              id="ohms-ai-off-reason"
              className="min-h-28 w-full rounded-md border border-[var(--line)] bg-[var(--paper)] p-3 text-sm"
              value={reasoning}
              onChange={(event) => onReasoningChange(event.target.value)}
            />
          </label>
          {needResponse || !canCommit ? (
            needResponse ? (
              <ValidationMessage kind="missing">{OHMS_AI_OFF_COPY.needCommit}</ValidationMessage>
            ) : null
          ) : null}
          <Button onClick={onCommit} data-testid="ohms-ai-off-commit">
            {OHMS_AI_OFF_COPY.commit}
          </Button>
        </>
      ) : (
        <>
          <Card className="space-y-2 p-4" data-testid="ohms-ai-off-committed">
            <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">
              你刚才独立写下的内容
            </p>
            <p className="text-sm">
              {ohmsJudgmentLabelFor(challengeId, committed?.selectedAnswer ?? "")}
            </p>
            <p className="text-sm">{committed?.studentReasoning}</p>
          </Card>
          <fieldset className="space-y-3" data-testid="ohms-ai-off-post-check">
            <legend className="text-sm font-medium">{OHMS_AI_OFF_COPY.postCheckTitle}</legend>
            {postCheckOptions.map((option) => (
              <label key={option.id} className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={selectedFacts.has(option.id)}
                  onChange={() => onPostCheckToggle(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          {needPostCheck ? (
            <ValidationMessage kind="missing">请标出你刚才判断时用到的事实。</ValidationMessage>
          ) : null}
          {committed && committed.postCheckIds.length > 0 && !committed.accepted ? (
            <ValidationMessage kind="incorrect" testId="ohms-ai-off-feedback">
              这次还不能算独立完成。你刚才写下的内容会留着。可以再独立写一次。
            </ValidationMessage>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button onClick={onSubmitPostCheck} data-testid="ohms-ai-off-post-check-submit">
              {OHMS_AI_OFF_COPY.postCheckSubmit}
            </Button>
            {showRetry ? (
              <Button variant="secondary" onClick={onRetry} data-testid="ohms-ai-off-retry">
                再独立写一次
              </Button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
