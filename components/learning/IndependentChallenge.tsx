import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { StudentInput } from "@/components/learning/StudentInput";
import {
  INDEPENDENT_EXAM_QUESTION,
  INDEPENDENT_EXPLANATION,
} from "@/lib/content/independent-challenge";
import { SCENE_COPY } from "@/lib/content/microwave-bread";

interface IndependentChallengeProps {
  explanation: string;
  savedExplanation: string;
  onExplanationChange: (value: string) => void;
  onSubmitExplanation: () => void;
  explanationSaved: boolean;
  selectedAnswer: string;
  onSelectAnswer: (value: string) => void;
  onSubmitExam: () => void;
  examSaved: boolean;
}

export function IndependentChallenge({
  explanation,
  savedExplanation,
  onExplanationChange,
  onSubmitExplanation,
  explanationSaved,
  selectedAnswer,
  onSelectAnswer,
  onSubmitExam,
  examSaved,
}: IndependentChallengeProps) {
  return (
    <div className="space-y-6">
      <Card className="space-y-3 border-[var(--ink)]/10 bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          Independent assessment
        </p>
        <h2 className="font-serif text-2xl text-[var(--ink)]">
          {SCENE_COPY.aiOffBanner}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {SCENE_COPY.aiOffInstruction}
        </p>
      </Card>

      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-[var(--ink)]">Situation</p>
        <p className="text-sm leading-relaxed text-[var(--ink)]">
          {INDEPENDENT_EXPLANATION.situation}
        </p>
      </Card>

      {explanationSaved ? (
        <Card className="space-y-2 p-4">
          <p className="text-sm font-medium text-[var(--ink)]">Your explanation</p>
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
            {savedExplanation}
          </p>
        </Card>
      ) : (
        <StudentInput
          label={INDEPENDENT_EXPLANATION.prompt}
          prompt="Write your own explanation. This page will not hint or correct you."
          placeholder="Explain the temperature change using the model you built."
          value={explanation}
          onChange={onExplanationChange}
          onSubmit={onSubmitExplanation}
          submitLabel={SCENE_COPY.independentExplainSubmit}
          minLength={12}
        />
      )}

      {explanationSaved ? (
        <Card className="space-y-4 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            {SCENE_COPY.independentExamIntro}
          </p>
          <fieldset className="space-y-3">
            <legend className="font-serif text-xl text-[var(--ink)]">
              {INDEPENDENT_EXAM_QUESTION.text}
            </legend>
            <div className="grid gap-2">
              {INDEPENDENT_EXAM_QUESTION.options.map((option) => (
                <label
                  key={option}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                    selectedAnswer === option
                      ? "border-[var(--ink)] bg-[var(--paper)]"
                      : "border-[var(--line)] bg-white hover:border-[var(--ink-muted)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="independent-exam"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={() => onSelectAnswer(option)}
                    disabled={examSaved}
                    className="mt-1"
                  />
                  <span className="text-sm text-[var(--ink)]">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {!examSaved ? (
            <div className="flex justify-end">
              <Button
                onClick={onSubmitExam}
                disabled={selectedAnswer.length === 0}
                aria-label="Submit independent exam answer"
              >
                {SCENE_COPY.independentExamSubmit}
              </Button>
            </div>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
