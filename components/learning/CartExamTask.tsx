import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { CartExamForceDiagram } from "@/components/learning/CartExamForceDiagram";
import { CART_EXAM_COPY } from "@/lib/content/horizontal-force-cart";
import {
  cartExamAnswerOptionsVisible,
  type CartExamStep,
} from "@/lib/learning/cart-exam";
import type { ExamPattern } from "@/types/physics-model";

interface CartExamTaskProps {
  pattern: ExamPattern;
  questionIndex: number;
  totalCount: number;
  step: CartExamStep;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  feedback?: string | null;
  needSteps: boolean;
  canRetry: boolean;
  hints: string[];
  canRevealHint: boolean;
  onRepresentationChange: (value: string) => void;
  onModelRecognitionChange: (value: string) => void;
  onSelectedAnswerChange: (value: string) => void;
  onReasoningChange: (value: string) => void;
  onContinueToModel: () => void;
  onRevealChoices: () => void;
  onSubmit: () => void;
  onNext: () => void;
  onRevealHint: () => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

export function CartExamTask({
  pattern,
  questionIndex,
  totalCount,
  step,
  representation,
  modelRecognition,
  selectedAnswer,
  reasoning,
  feedback,
  needSteps,
  canRetry,
  hints,
  canRevealHint,
  onRepresentationChange,
  onModelRecognitionChange,
  onSelectedAnswerChange,
  onReasoningChange,
  onContinueToModel,
  onRevealChoices,
  onSubmit,
  onNext,
  onRevealHint,
}: CartExamTaskProps) {
  const showModel = step === "model" || step === "answer";
  const showOptions = cartExamAnswerOptionsVisible(step);
  const canSubmit =
    representation.length > 0 &&
    modelRecognition.length > 0 &&
    selectedAnswer.length > 0 &&
    reasoning.trim().length > 0;

  return (
    <div className="space-y-5" data-testid="cart-exam-world" data-pattern={pattern.id}>
      <article className="space-y-4 border border-[var(--line)] bg-[var(--paper)] px-5 py-5 sm:px-6">
        <p
          className="text-xs tracking-[0.16em] text-[var(--ink-muted)]"
          data-testid="cart-exam-number"
        >
          {CART_EXAM_COPY.progress
            .replace("{n}", String(questionIndex + 1))
            .replace("{total}", String(totalCount))}
        </p>
        <h2
          className="font-serif text-xl leading-relaxed text-[var(--ink)] sm:text-2xl"
          data-testid="cart-exam-stem"
        >
          {pattern.stem}
        </h2>
        {pattern.id === "exam-force-motion-arrow-diagram" ? <CartExamForceDiagram /> : null}
      </article>

      <section className="space-y-5 border border-[var(--line)] bg-[var(--paper)] px-5 py-5 sm:px-6">
        <ExamChoiceList
          testId="cart-exam-representation"
          legend={CART_EXAM_COPY.about}
          name={`${pattern.id}-representation`}
          value={representation}
          options={pattern.representationOptions}
          onChange={onRepresentationChange}
        />

        {step === "representation" ? (
          <div className="flex justify-end">
            <Button
              onClick={onContinueToModel}
              disabled={representation.length === 0}
              data-testid="cart-exam-continue-model"
            >
              {CART_EXAM_COPY.continueToModel}
            </Button>
          </div>
        ) : null}

        {showModel ? (
          <ExamChoiceList
            testId="cart-exam-model"
            legend={CART_EXAM_COPY.relationship}
            name={`${pattern.id}-model`}
            value={modelRecognition}
            options={pattern.modelOptions}
            onChange={onModelRecognitionChange}
          />
        ) : null}

        {step === "model" ? (
          <div className="flex justify-end">
            <Button
              onClick={onRevealChoices}
              disabled={modelRecognition.length === 0}
              data-testid="cart-exam-reveal-options"
            >
              {CART_EXAM_COPY.revealChoices}
            </Button>
          </div>
        ) : null}

        {showOptions ? (
          <>
            <fieldset className="space-y-3" data-testid="cart-exam-options">
              <legend className="text-sm font-medium text-[var(--ink)]">
                {CART_EXAM_COPY.choose}
              </legend>
              <div className="grid gap-2">
                {pattern.options.map((option, index) => {
                  const letter = OPTION_LETTERS[index] ?? String(index + 1);
                  return (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-start gap-3 border px-4 py-3 ${
                        selectedAnswer === option
                          ? "border-[var(--ink)] bg-white"
                          : "border-[var(--line)] bg-white hover:border-[var(--ink-muted)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${pattern.id}-answer`}
                        value={option}
                        checked={selectedAnswer === option}
                        onChange={() => onSelectedAnswerChange(option)}
                        className="mt-1"
                      />
                      <span className="text-sm leading-relaxed text-[var(--ink)]">
                        <span className="mr-2 font-medium">{letter}.</span>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="space-y-2" data-testid="cart-exam-reasoning">
              <label
                htmlFor={`${pattern.id}-reasoning`}
                className="text-sm font-medium text-[var(--ink)]"
              >
                {pattern.reasoningPrompt || CART_EXAM_COPY.reasonLabel}
              </label>
              <textarea
                id={`${pattern.id}-reasoning`}
                value={reasoning}
                onChange={(event) => onReasoningChange(event.target.value)}
                placeholder={CART_EXAM_COPY.reasonPlaceholder}
                className="min-h-28 w-full border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--ink)]"
              />
            </div>

            {needSteps ? (
              <p className="text-sm text-[var(--ink-muted)]">{CART_EXAM_COPY.needSteps}</p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[var(--ink-muted)]">{CART_EXAM_COPY.stores}</p>
              <Button onClick={onSubmit} disabled={!canSubmit} data-testid="cart-exam-submit">
                {CART_EXAM_COPY.submit}
              </Button>
            </div>
          </>
        ) : null}
      </section>

      {feedback ? (
        <p
          className="border border-[var(--line)] bg-[var(--paper)] px-5 py-4 text-sm leading-relaxed text-[var(--ink)]"
          data-testid="cart-exam-feedback"
        >
          {feedback}
        </p>
      ) : null}

      {canRetry && feedback ? (
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onNext} data-testid="cart-exam-next">
            {CART_EXAM_COPY.next}
          </Button>
        </div>
      ) : null}

      {hints.length > 0 ? (
        <Card className="space-y-2 p-4" data-testid="cart-exam-hint">
          {hints.map((hint) => (
            <p key={hint} className="text-sm leading-relaxed text-[var(--ink-muted)]">
              {hint}
            </p>
          ))}
        </Card>
      ) : null}

      <div className="flex justify-start">
        <Button
          variant="ghost"
          onClick={onRevealHint}
          disabled={!canRevealHint}
          data-testid="cart-exam-hint-button"
        >
          {canRevealHint ? CART_EXAM_COPY.hint : CART_EXAM_COPY.hintDone}
        </Button>
      </div>
    </div>
  );
}

function ExamChoiceList({
  testId,
  legend,
  name,
  value,
  options,
  onChange,
}: {
  testId: string;
  legend: string;
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-3" data-testid={testId}>
      <legend className="text-sm font-medium text-[var(--ink)]">{legend}</legend>
      <div className="grid gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-start gap-3 border px-4 py-3 ${
              value === option
                ? "border-[var(--ink)] bg-white"
                : "border-[var(--line)] bg-white hover:border-[var(--ink-muted)]"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="mt-1"
            />
            <span className="text-sm leading-relaxed text-[var(--ink)]">{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
