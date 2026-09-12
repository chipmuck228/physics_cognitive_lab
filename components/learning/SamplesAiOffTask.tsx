import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { SAMPLES_AI_OFF_COPY } from "@/lib/content/equal-volume-material-samples";
import {
  samplesAiOffChallenge,
  samplesAiOffJudgments,
  samplesAiOffPostCheckOptions,
  samplesJudgmentLabelFor,
  type SamplesAiOffStep,
} from "@/lib/learning/samples-ai-off";
import type { IndependentChallengeAttempt } from "@/types/learning";

interface SamplesAiOffTaskProps {
  challengeId: string;
  questionIndex: number;
  totalCount: number;
  step: SamplesAiOffStep;
  selectedAnswer: string;
  reasoning: string;
  postCheckSelections: string[];
  committed: IndependentChallengeAttempt | null;
  needResponse: boolean;
  needPostCheck: boolean;
  onSelectedAnswerChange: (value: string) => void;
  onReasoningChange: (value: string) => void;
  onPostCheckToggle: (id: string) => void;
  onCommit: () => void;
  onSubmitPostCheck: () => void;
  onRetry: () => void;
}

export function SamplesAiOffTask({
  challengeId,
  questionIndex,
  totalCount,
  step,
  selectedAnswer,
  reasoning,
  postCheckSelections,
  committed,
  needResponse,
  needPostCheck,
  onSelectedAnswerChange,
  onReasoningChange,
  onPostCheckToggle,
  onCommit,
  onSubmitPostCheck,
  onRetry,
}: SamplesAiOffTaskProps) {
  const challenge = samplesAiOffChallenge(challengeId);
  const judgments = samplesAiOffJudgments(challengeId);
  const postCheckOptions = samplesAiOffPostCheckOptions(challengeId);
  const showPostCheck = step === "post-check" && Boolean(committed);
  const selectedFacts = new Set(postCheckSelections);
  const canCommit = selectedAnswer.length > 0 && reasoning.trim().length > 0;
  const canSubmitPostCheck = postCheckSelections.length > 0;
  const showRetry =
    showPostCheck &&
    committed &&
    committed.accepted === false &&
    committed.postCheckIds.length > 0;

  return (
    <div
      className="space-y-5"
      data-testid="samples-ai-off-task"
      data-challenge={challengeId}
      data-step={step}
    >
      <article className="space-y-4 border border-[var(--line)] bg-[var(--paper)] px-5 py-5 sm:px-6">
        <p
          className="text-xs tracking-[0.16em] text-[var(--ink-muted)]"
          data-testid="samples-ai-off-number"
        >
          {SAMPLES_AI_OFF_COPY.progress
            .replace("{n}", String(questionIndex + 1))
            .replace("{total}", String(totalCount))}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink)]" data-testid="samples-ai-off-scenario">
          {challenge.scenario}
        </p>
        <p
          className="font-medium leading-relaxed text-[var(--ink)]"
          data-testid="samples-ai-off-question"
        >
          {challenge.question}
        </p>
      </article>

      {!showPostCheck ? (
        <>
          <fieldset className="space-y-3" data-testid="samples-ai-off-options">
            <legend className="text-sm font-medium text-[var(--ink)]">
              {SAMPLES_AI_OFF_COPY.choose}
            </legend>
            {judgments.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--ink)]"
              >
                <input
                  type="radio"
                  name={`samples-ai-off-${challengeId}`}
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={() => onSelectedAnswerChange(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          <div className="space-y-2" data-testid="samples-ai-off-reasoning">
            <label
              className="text-sm font-medium text-[var(--ink)]"
              htmlFor="samples-ai-off-reason"
            >
              {SAMPLES_AI_OFF_COPY.reasonLabel}
            </label>
            <textarea
              id="samples-ai-off-reason"
              className="min-h-28 w-full rounded-md border border-[var(--line)] bg-[var(--paper)] p-3 text-sm leading-relaxed text-[var(--ink)]"
              placeholder={SAMPLES_AI_OFF_COPY.reasonPlaceholder}
              value={reasoning}
              onChange={(event) => onReasoningChange(event.target.value)}
            />
          </div>
          {needResponse ? (
            <p className="text-sm text-[var(--ink-muted)]">{SAMPLES_AI_OFF_COPY.needResponse}</p>
          ) : null}
          <Button onClick={onCommit} disabled={!canCommit} data-testid="samples-ai-off-commit">
            {SAMPLES_AI_OFF_COPY.commit}
          </Button>
        </>
      ) : (
        <>
          <Card className="space-y-2 p-4" data-testid="samples-ai-off-committed">
            <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">
              {SAMPLES_AI_OFF_COPY.committedTitle}
            </p>
            <p className="text-sm leading-relaxed text-[var(--ink)]">
              {samplesJudgmentLabelFor(challengeId, committed?.selectedAnswer ?? "")}
            </p>
            <p className="text-sm leading-relaxed text-[var(--ink)]">
              {committed?.studentReasoning}
            </p>
          </Card>
          <fieldset className="space-y-3" data-testid="samples-ai-off-post-check">
            <legend className="text-sm font-medium text-[var(--ink)]">
              {SAMPLES_AI_OFF_COPY.postCheckPrompt}
            </legend>
            {postCheckOptions.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--ink)]"
              >
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
            <p className="text-sm text-[var(--ink-muted)]">{SAMPLES_AI_OFF_COPY.postCheckNeed}</p>
          ) : null}
          {committed && committed.postCheckIds.length > 0 && !committed.accepted ? (
            <p className="text-sm text-[var(--ink-muted)]" data-testid="samples-ai-off-feedback">
              {SAMPLES_AI_OFF_COPY.feedbackFail} {SAMPLES_AI_OFF_COPY.feedbackRetry}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={onSubmitPostCheck}
              disabled={!canSubmitPostCheck}
              data-testid="samples-ai-off-post-check-submit"
            >
              {SAMPLES_AI_OFF_COPY.postCheckSubmit}
            </Button>
            {showRetry ? (
              <Button variant="secondary" onClick={onRetry} data-testid="samples-ai-off-retry">
                {SAMPLES_AI_OFF_COPY.retry}
              </Button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
