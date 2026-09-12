import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { CART_AI_OFF_COPY } from "@/lib/content/horizontal-force-cart";
import {
  cartAiOffChallenge,
  cartAiOffJudgments,
  cartAiOffPostCheckOptions,
  cartJudgmentLabelFor,
  type CartAiOffStep,
} from "@/lib/learning/cart-ai-off";
import type { IndependentChallengeAttempt } from "@/types/learning";

interface CartAiOffTaskProps {
  challengeId: string;
  questionIndex: number;
  totalCount: number;
  step: CartAiOffStep;
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

export function CartAiOffTask({
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
}: CartAiOffTaskProps) {
  const challenge = cartAiOffChallenge(challengeId);
  const judgments = cartAiOffJudgments(challengeId);
  const postCheckOptions = cartAiOffPostCheckOptions(challengeId);
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
      data-testid="cart-ai-off-task"
      data-challenge={challengeId}
      data-step={step}
    >
      <article className="space-y-4 border border-[var(--line)] bg-[var(--paper)] px-5 py-5 sm:px-6">
        <p
          className="text-xs tracking-[0.16em] text-[var(--ink-muted)]"
          data-testid="cart-ai-off-number"
        >
          {CART_AI_OFF_COPY.progress
            .replace("{n}", String(questionIndex + 1))
            .replace("{total}", String(totalCount))}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink)]" data-testid="cart-ai-off-scenario">
          {challenge.scenario}
        </p>
        <p
          className="font-medium leading-relaxed text-[var(--ink)]"
          data-testid="cart-ai-off-question"
        >
          {challenge.question}
        </p>
      </article>

      {!showPostCheck ? (
        <>
          <fieldset className="space-y-3" data-testid="cart-ai-off-options">
            <legend className="text-sm font-medium text-[var(--ink)]">
              {CART_AI_OFF_COPY.choose}
            </legend>
            {judgments.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--ink)]"
              >
                <input
                  type="radio"
                  name={`cart-ai-off-${challengeId}`}
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={() => onSelectedAnswerChange(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          <div className="space-y-2" data-testid="cart-ai-off-reasoning">
            <label className="text-sm font-medium text-[var(--ink)]" htmlFor="cart-ai-off-reason">
              {CART_AI_OFF_COPY.reasonLabel}
            </label>
            <textarea
              id="cart-ai-off-reason"
              className="min-h-28 w-full rounded-md border border-[var(--line)] bg-[var(--paper)] p-3 text-sm leading-relaxed text-[var(--ink)]"
              placeholder={CART_AI_OFF_COPY.reasonPlaceholder}
              value={reasoning}
              onChange={(event) => onReasoningChange(event.target.value)}
            />
          </div>
          {needResponse ? (
            <p className="text-sm text-[var(--ink-muted)]">{CART_AI_OFF_COPY.needResponse}</p>
          ) : null}
          <Button onClick={onCommit} disabled={!canCommit} data-testid="cart-ai-off-commit">
            {CART_AI_OFF_COPY.commit}
          </Button>
        </>
      ) : (
        <>
          <Card className="space-y-2 p-4" data-testid="cart-ai-off-committed">
            <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">
              {CART_AI_OFF_COPY.committedTitle}
            </p>
            <p className="text-sm leading-relaxed text-[var(--ink)]">
              {cartJudgmentLabelFor(challengeId, committed?.selectedAnswer ?? "")}
            </p>
            <p className="text-sm leading-relaxed text-[var(--ink)]">
              {committed?.studentReasoning}
            </p>
          </Card>
          <fieldset className="space-y-3" data-testid="cart-ai-off-post-check">
            <legend className="text-sm font-medium text-[var(--ink)]">
              {CART_AI_OFF_COPY.postCheckPrompt}
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
            <p className="text-sm text-[var(--ink-muted)]">{CART_AI_OFF_COPY.postCheckNeed}</p>
          ) : null}
          {committed && committed.postCheckIds.length > 0 && !committed.accepted ? (
            <p className="text-sm text-[var(--ink-muted)]" data-testid="cart-ai-off-feedback">
              {CART_AI_OFF_COPY.feedbackFail} {CART_AI_OFF_COPY.feedbackRetry}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={onSubmitPostCheck}
              disabled={!canSubmitPostCheck}
              data-testid="cart-ai-off-post-check-submit"
            >
              {CART_AI_OFF_COPY.postCheckSubmit}
            </Button>
            {showRetry ? (
              <Button variant="secondary" onClick={onRetry} data-testid="cart-ai-off-retry">
                {CART_AI_OFF_COPY.retry}
              </Button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
