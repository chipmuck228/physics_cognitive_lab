import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EngineExamStrokeDiagram } from "@/components/learning/EngineExamStrokeDiagram";
import { ENGINE_EXAM_COPY } from "@/lib/content/four-stroke-engine";
import {
  engineExamAnswerOptionsVisible,
  type EngineExamStep,
} from "@/lib/learning/engine-exam";
import type { ExamPattern } from "@/types/physics-model";

interface EngineExamTaskProps {
  pattern: ExamPattern;
  questionIndex: number;
  totalCount: number;
  step: EngineExamStep;
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

export function EngineExamTask({
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
}: EngineExamTaskProps) {
  const showModel = step === "model" || step === "answer";
  const showOptions = engineExamAnswerOptionsVisible(step);
  const canSubmit =
    representation.length > 0 &&
    modelRecognition.length > 0 &&
    selectedAnswer.length > 0 &&
    reasoning.trim().length > 0;

  return (
    <div
      className="space-y-5"
      data-testid="engine-exam-world"
      data-pattern={pattern.id}
    >
      <article className="space-y-4 border border-[var(--line)] bg-[var(--paper)] px-5 py-5 sm:px-6">
        <p
          className="text-xs tracking-[0.16em] text-[var(--ink-muted)]"
          data-testid="engine-exam-number"
        >
          {ENGINE_EXAM_COPY.progress
            .replace("{n}", String(questionIndex + 1))
            .replace("{total}", String(totalCount))}
        </p>
        <h2
          className="font-serif text-xl leading-relaxed text-[var(--ink)] sm:text-2xl"
          data-testid="engine-exam-stem"
        >
          {pattern.stem}
        </h2>
        {pattern.id === "exam-stroke-diagram-energy-flow" ? (
          <EngineExamStrokeDiagram />
        ) : null}
      </article>

      <section className="space-y-5 border border-[var(--line)] bg-[var(--paper)] px-5 py-5 sm:px-6">
        <ExamChoiceList
          testId="engine-exam-representation"
          legend={ENGINE_EXAM_COPY.about}
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
              data-testid="engine-exam-continue-model"
            >
              {ENGINE_EXAM_COPY.continueToModel}
            </Button>
          </div>
        ) : null}

        {showModel ? (
          <ExamChoiceList
            testId="engine-exam-model"
            legend={ENGINE_EXAM_COPY.relationship}
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
              data-testid="engine-exam-reveal-options"
            >
              {ENGINE_EXAM_COPY.revealChoices}
            </Button>
          </div>
        ) : null}

        {showOptions ? (
          <>
            <fieldset className="space-y-3" data-testid="engine-exam-options">
              <legend className="text-sm font-medium text-[var(--ink)]">
                {ENGINE_EXAM_COPY.choose}
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

            <div className="space-y-2" data-testid="engine-exam-reasoning">
              <label
                htmlFor={`${pattern.id}-reasoning`}
                className="text-sm font-medium text-[var(--ink)]"
              >
                {pattern.reasoningPrompt || ENGINE_EXAM_COPY.reasonLabel}
              </label>
              <textarea
                id={`${pattern.id}-reasoning`}
                value={reasoning}
                onChange={(event) => onReasoningChange(event.target.value)}
                placeholder={ENGINE_EXAM_COPY.reasonPlaceholder}
                className="min-h-28 w-full border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--ink)]"
              />
            </div>

            {needSteps ? (
              <p className="text-sm text-[var(--ink-muted)]">
                {ENGINE_EXAM_COPY.needSteps}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[var(--ink-muted)]">
                {ENGINE_EXAM_COPY.stores}
              </p>
              <Button
                onClick={onSubmit}
                disabled={!canSubmit}
                data-testid="engine-exam-submit"
              >
                {ENGINE_EXAM_COPY.submit}
              </Button>
            </div>
          </>
        ) : null}
      </section>

      {feedback ? (
        <p
          className="border border-[var(--line)] bg-[var(--paper)] px-5 py-4 text-sm leading-relaxed text-[var(--ink)]"
          data-testid="engine-exam-feedback"
        >
          {feedback}
        </p>
      ) : null}

      {canRetry && feedback ? (
        <div className="flex justify-end">
          <Button
            variant="secondary"
            onClick={onNext}
            data-testid="engine-exam-next"
          >
            {ENGINE_EXAM_COPY.next}
          </Button>
        </div>
      ) : null}

      {hints.length > 0 ? (
        <Card className="space-y-2 p-4" data-testid="engine-exam-hint">
          <div data-testid="engine-hint-list" className="space-y-2">
            {hints.map((hint) => (
              <p key={hint} className="text-sm leading-relaxed text-[var(--ink-muted)]">
                {hint}
              </p>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="flex justify-start">
        <Button
          variant="ghost"
          onClick={onRevealHint}
          disabled={!canRevealHint}
          data-testid="engine-exam-hint-button"
        >
          {canRevealHint ? ENGINE_EXAM_COPY.hint : ENGINE_EXAM_COPY.hintDone}
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
            <span className="text-sm leading-relaxed text-[var(--ink)]">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
