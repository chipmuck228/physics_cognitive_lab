import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { LensExamDiagram } from "@/components/learning/LensExamDiagram";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import { LENS_EXAM_COPY } from "@/lib/content/convex-lens-optical-bench";
import { lensExamDiagramSpec } from "@/lib/learning/lens-exam-diagram";
import type { LensExamStep } from "@/lib/learning/lens-exam";
import type { ExamPattern } from "@/types/physics-model";

interface LensExamTaskProps {
  pattern: ExamPattern;
  questionIndex: number;
  totalCount: number;
  step: LensExamStep;
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

export function LensExamTask({
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
}: LensExamTaskProps) {
  const showModel = step === "model" || step === "answer";
  const showOptions = step === "answer";
  const diagram = lensExamDiagramSpec(pattern);

  return (
    <div className="space-y-5" data-testid="lens-exam-world" data-pattern={pattern.id}>
      <p className="text-sm text-[var(--ink-muted)]">{LENS_EXAM_COPY.worldTrail}</p>
      <article className="space-y-4 border border-[var(--line)] bg-[var(--paper)] px-5 py-5">
        <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">
          {`第 ${questionIndex + 1} 题 / 共 ${totalCount} 题 · ${LENS_EXAM_COPY.stemLabel}`}
        </p>
        <h2 className="font-serif text-xl leading-relaxed" data-testid="lens-exam-stem">
          {pattern.stem}
        </h2>
        {diagram ? (
          <LensExamDiagram spec={diagram} caption={pattern.representation} />
        ) : null}
      </article>
      <section className="space-y-5 border border-[var(--line)] bg-[var(--paper)] px-5 py-5">
        <ExamChoiceList
          testId="lens-exam-representation"
          legend={LENS_EXAM_COPY.representationQuestion}
          name={`${pattern.id}-representation`}
          value={representation}
          options={pattern.representationOptions}
          onChange={onRepresentationChange}
        />
        {step === "representation" ? (
          <div className="flex justify-end">
            <Button onClick={onContinueToModel} data-testid="lens-exam-continue-model">
              {LENS_EXAM_COPY.continueModel}
            </Button>
          </div>
        ) : null}
        {showModel ? (
          <ExamChoiceList
            testId="lens-exam-model"
            legend={LENS_EXAM_COPY.modelQuestion}
            name={`${pattern.id}-model`}
            value={modelRecognition}
            options={pattern.modelOptions}
            onChange={onModelRecognitionChange}
          />
        ) : null}
        {step === "model" ? (
          <div className="flex justify-end">
            <Button onClick={onRevealChoices} data-testid="lens-exam-reveal-options">
              {LENS_EXAM_COPY.revealOptions}
            </Button>
          </div>
        ) : null}
        {showOptions ? (
          <>
            <fieldset className="space-y-3" data-testid="lens-exam-options">
              <legend className="text-sm font-medium">{LENS_EXAM_COPY.answerQuestion}</legend>
              {pattern.options.map((option, index) => {
                const letter = OPTION_LETTERS[index] ?? String(index + 1);
                return (
                  <label key={option} className="flex cursor-pointer items-start gap-3 border px-4 py-3">
                    <input
                      type="radio"
                      name={`${pattern.id}-answer`}
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={() => onSelectedAnswerChange(option)}
                    />
                    <span className="text-sm leading-relaxed">
                      <span className="mr-2 font-medium">{letter}.</span>
                      {option}
                    </span>
                  </label>
                );
              })}
            </fieldset>
            <label className="block space-y-2" data-testid="lens-exam-reasoning">
              <span className="text-sm font-medium">
                {pattern.reasoningPrompt || LENS_EXAM_COPY.reasoningQuestion}
              </span>
              <textarea
                className="min-h-28 w-full border border-[var(--line)] bg-white px-4 py-3 text-sm"
                value={reasoning}
                onChange={(event) => onReasoningChange(event.target.value)}
              />
            </label>
            {needSteps ? (
              <ValidationMessage kind="missing">
                先判断物体处在哪个成像区域，再选用关系，最后作答。
              </ValidationMessage>
            ) : null}
            <div className="flex justify-end">
              <Button onClick={onSubmit} data-testid="lens-exam-submit">
                {LENS_EXAM_COPY.submit}
              </Button>
            </div>
          </>
        ) : null}
      </section>
      {feedback ? (
        <p className="border border-[var(--line)] bg-[var(--paper)] px-5 py-4 text-sm" data-testid="lens-exam-feedback">
          {feedback}
        </p>
      ) : null}
      {canRetry && feedback ? (
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onNext} data-testid="lens-exam-next">
            下一题
          </Button>
        </div>
      ) : null}
      {hints.length > 0 ? (
        <Card className="space-y-2 p-4">
          {hints.map((hint) => (
            <p key={hint} className="text-sm text-[var(--ink-muted)]">
              {hint}
            </p>
          ))}
        </Card>
      ) : null}
      {canRevealHint ? (
        <Button variant="ghost" onClick={onRevealHint}>
          给我一个台阶
        </Button>
      ) : null}
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
      <legend className="text-sm font-medium">{legend}</legend>
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-start gap-3 border px-4 py-3">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="mt-1"
          />
          <span className="text-sm leading-relaxed">{option}</span>
        </label>
      ))}
    </fieldset>
  );
}
