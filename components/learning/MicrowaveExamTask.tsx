import { Button } from "@/components/common/Button";
import { SCENE_COPY } from "@/lib/content/microwave-bread";
import {
  microwaveExamAnswerOptionsVisible,
  type MicrowaveExamStep,
} from "@/lib/learning/microwave-exam";
import type { ExamPattern } from "@/types/physics-model";

interface MicrowaveExamTaskProps {
  pattern: ExamPattern;
  questionIndex: number;
  totalCount: number;
  step: MicrowaveExamStep;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  feedback?: string | null;
  onRepresentationChange: (value: string) => void;
  onModelRecognitionChange: (value: string) => void;
  onSelectedAnswerChange: (value: string) => void;
  onReasoningChange: (value: string) => void;
  onContinueToModel: () => void;
  onRevealChoices: () => void;
  onSubmit: () => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

export function MicrowaveExamTask({
  pattern,
  questionIndex,
  totalCount,
  step,
  representation,
  modelRecognition,
  selectedAnswer,
  reasoning,
  feedback,
  onRepresentationChange,
  onModelRecognitionChange,
  onSelectedAnswerChange,
  onReasoningChange,
  onContinueToModel,
  onRevealChoices,
  onSubmit,
}: MicrowaveExamTaskProps) {
  const showModel = step === "model" || step === "answer";
  const showOptions = microwaveExamAnswerOptionsVisible(step);
  const canSubmit =
    representation.length > 0 &&
    modelRecognition.length > 0 &&
    selectedAnswer.length > 0 &&
    reasoning.trim().length > 0;

  return (
    <div className="space-y-5" data-testid="microwave-exam-world" data-pattern={pattern.id}>
      <article className="space-y-4 border border-[var(--line)] bg-[var(--paper)] px-5 py-5">
        <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">
          {SCENE_COPY.examProgress
            .replace("{n}", String(questionIndex + 1))
            .replace("{total}", String(totalCount))}
        </p>
        <h2 className="font-serif text-xl leading-relaxed text-[var(--ink)]">{pattern.stem}</h2>
      </article>
      <section className="space-y-5 border border-[var(--line)] bg-[var(--paper)] px-5 py-5">
        <ChoiceList
          legend={SCENE_COPY.examAbout}
          name={`${pattern.id}-representation`}
          value={representation}
          options={pattern.representationOptions}
          onChange={onRepresentationChange}
        />
        {step === "representation" ? (
          <div className="flex justify-end">
            <Button onClick={onContinueToModel} disabled={representation.length === 0}>
              {SCENE_COPY.examContinueToModel}
            </Button>
          </div>
        ) : null}
        {showModel ? (
          <ChoiceList
            legend={SCENE_COPY.examRelationship}
            name={`${pattern.id}-model`}
            value={modelRecognition}
            options={pattern.modelOptions}
            onChange={onModelRecognitionChange}
          />
        ) : null}
        {step === "model" ? (
          <div className="flex justify-end">
            <Button onClick={onRevealChoices} disabled={modelRecognition.length === 0}>
              {SCENE_COPY.examRevealChoices}
            </Button>
          </div>
        ) : null}
        {showOptions ? (
          <>
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-[var(--ink)]">
                {SCENE_COPY.examChoose}
              </legend>
              {pattern.options.map((option, index) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
                >
                  <input
                    type="radio"
                    name={`${pattern.id}-answer`}
                    checked={selectedAnswer === option}
                    onChange={() => onSelectedAnswerChange(option)}
                    className="mt-1"
                    aria-label={option}
                  />
                  <span>
                    <span className="mr-2 font-medium">
                      {OPTION_LETTERS[index] ?? index + 1}.
                    </span>
                    {option}
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="space-y-2">
              <label
                htmlFor={`${pattern.id}-reasoning`}
                className="text-sm font-medium text-[var(--ink)]"
              >
                {pattern.reasoningPrompt}
              </label>
              <textarea
                id={`${pattern.id}-reasoning`}
                value={reasoning}
                onChange={(event) => onReasoningChange(event.target.value)}
                placeholder={SCENE_COPY.examReasonPlaceholder}
                className="min-h-24 w-full border border-[var(--line)] bg-white px-4 py-3 text-sm outline-none"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={onSubmit} disabled={!canSubmit}>
                {SCENE_COPY.examSave}
              </Button>
            </div>
          </>
        ) : null}
      </section>
      {feedback ? (
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{feedback}</p>
      ) : null}
    </div>
  );
}

function ChoiceList({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-[var(--ink)]">{legend}</legend>
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
        >
          <input
            type="radio"
            name={name}
            checked={value === option}
            onChange={() => onChange(option)}
            className="mt-1"
            aria-label={option}
          />
          <span>{option}</span>
        </label>
      ))}
    </fieldset>
  );
}
