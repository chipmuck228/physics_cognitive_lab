import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { SCENE_COPY } from "@/lib/content/microwave-bread";
import type { ExamQuestionDefinition } from "@/lib/content/exam-questions";

type ExamPhase = "about" | "model" | "choices";

interface ExamQuestionProps {
  question: ExamQuestionDefinition;
  representation: string;
  modelFocus: string;
  selectedAnswer: string;
  reasoning: string;
  completedCount: number;
  totalCount: number;
  onRepresentationChange: (value: string) => void;
  onModelFocusChange: (value: string) => void;
  onSelectedAnswerChange: (value: string) => void;
  onReasoningChange: (value: string) => void;
  onSubmit: () => void;
  feedback?: string | null;
}

export function ExamQuestion({
  question,
  representation,
  modelFocus,
  selectedAnswer,
  reasoning,
  completedCount,
  totalCount,
  onRepresentationChange,
  onModelFocusChange,
  onSelectedAnswerChange,
  onReasoningChange,
  onSubmit,
  feedback,
}: ExamQuestionProps) {
  const [phase, setPhase] = useState<ExamPhase>("about");

  const canSubmit =
    representation.length > 0 &&
    modelFocus.length > 0 &&
    selectedAnswer.length > 0 &&
    reasoning.trim().length >= 8;

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          {SCENE_COPY.examWorldLabel} · {completedCount + 1} of {totalCount}
        </p>
        <h2 className="font-serif text-xl text-[var(--ink)]">{question.text}</h2>
        <p className="text-sm text-[var(--ink-muted)]">
          Difficulty: {question.difficulty}
        </p>
      </Card>

      <Card className="space-y-5 p-4">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-[var(--ink)]">
            1. What is this question mainly about?
          </legend>
          <div className="grid gap-2">
            {question.representationOptions.map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                  representation === option
                    ? "border-[var(--heat)] bg-[var(--heat)]/8"
                    : "border-[var(--line)] bg-white hover:border-[var(--ink-muted)]"
                }`}
              >
                <input
                  type="radio"
                  name={`${question.id}-representation`}
                  value={option}
                  checked={representation === option}
                  onChange={() => onRepresentationChange(option)}
                  className="mt-1"
                />
                <span className="text-sm text-[var(--ink)]">{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {phase === "about" ? (
          <div className="flex justify-end">
            <Button
              onClick={() => setPhase("model")}
              disabled={representation.length === 0}
            >
              {SCENE_COPY.examContinueToModel}
            </Button>
          </div>
        ) : null}

        {phase === "model" || phase === "choices" ? (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-[var(--ink)]">
              2. What physical relationship or model should you think about?
            </legend>
            <div className="grid gap-2">
              {question.modelOptions.map((option) => (
                <label
                  key={option}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                    modelFocus === option
                      ? "border-[var(--heat)] bg-[var(--heat)]/8"
                      : "border-[var(--line)] bg-white hover:border-[var(--ink-muted)]"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${question.id}-model`}
                    value={option}
                    checked={modelFocus === option}
                    onChange={() => onModelFocusChange(option)}
                    className="mt-1"
                  />
                  <span className="text-sm text-[var(--ink)]">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {phase === "model" ? (
          <div className="flex justify-end">
            <Button
              onClick={() => setPhase("choices")}
              disabled={modelFocus.length === 0}
            >
              {SCENE_COPY.examRevealChoices}
            </Button>
          </div>
        ) : null}

        {phase === "choices" ? (
          <>
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-[var(--ink)]">
                3. Choose your answer.
              </legend>
              <div className="grid gap-2">
                {question.options.map((option) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                      selectedAnswer === option
                        ? "border-[var(--heat)] bg-[var(--heat)]/8"
                        : "border-[var(--line)] bg-white hover:border-[var(--ink-muted)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${question.id}-answer`}
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={() => onSelectedAnswerChange(option)}
                      className="mt-1"
                    />
                    <span className="text-sm text-[var(--ink)]">{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="space-y-2">
              <label
                htmlFor={`${question.id}-reasoning`}
                className="text-sm font-medium text-[var(--ink)]"
              >
                4. {question.reasoningPrompt}
              </label>
              <textarea
                id={`${question.id}-reasoning`}
                value={reasoning}
                onChange={(event) => onReasoningChange(event.target.value)}
                placeholder="Write a short reason using the physics relationship."
                className="min-h-28 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-[var(--ink-muted)]">
                The exam stores the representation, model, answer, and reason separately.
              </p>
              <Button onClick={onSubmit} disabled={!canSubmit}>
                Save exam response
              </Button>
            </div>
          </>
        ) : null}
      </Card>

      {feedback ? (
        <Card className="p-4">
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{feedback}</p>
        </Card>
      ) : null}
    </div>
  );
}
