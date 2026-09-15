import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EngineEvidenceDrawer } from "@/components/learning/EngineEvidenceDrawer";
import {
  ENGINE_COPY,
  ENGINE_EXPLAIN_STEP1,
  ENGINE_EXPLAIN_STEP2,
  ENGINE_EXPLAIN_STEP3,
} from "@/lib/content/four-stroke-engine";

interface EngineExplainTaskProps {
  firstChange: string;
  gasEffect: string;
  mechanicalGain: string;
  studentExplanation: string;
  needMore: boolean;
  evidenceA?: string | null;
  evidenceB?: string | null;
  hints: string[];
  canRevealHint: boolean;
  onFirstChange: (value: string) => void;
  onGasEffect: (value: string) => void;
  onMechanicalGain: (value: string) => void;
  onExplanationChange: (value: string) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
  hideLead?: boolean;
}

export function EngineExplainTask({
  firstChange,
  gasEffect,
  mechanicalGain,
  studentExplanation,
  needMore,
  evidenceA,
  evidenceB,
  hints,
  canRevealHint,
  onFirstChange,
  onGasEffect,
  onMechanicalGain,
  onExplanationChange,
  onSubmit,
  onRevealHint,
  hideLead = false,
}: EngineExplainTaskProps) {
  const showStep2 = firstChange.length > 0;
  const showStep3 = showStep2 && gasEffect.length > 0;
  const showOwnWords = showStep3 && mechanicalGain.length > 0;

  return (
    <div className="space-y-4" data-testid="engine-explain-task">
      {hideLead ? null : (
      <div className="space-y-2">
        <p className="text-sm font-medium leading-relaxed text-[var(--ink)]">
          {ENGINE_COPY.explainLead}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {ENGINE_COPY.explainFollow}
        </p>
      </div>
      )}

      <EngineEvidenceDrawer evidenceA={evidenceA} evidenceB={evidenceB} />

      <Card className="space-y-5 p-4">
        <ExplainStep
          testId="engine-explain-step-1"
          question={ENGINE_COPY.explainStep1}
          name="engine-explain-first-change"
          value={firstChange}
          options={ENGINE_EXPLAIN_STEP1}
          onChange={onFirstChange}
        />
        {showStep2 ? (
          <ExplainStep
            testId="engine-explain-step-2"
            question={ENGINE_COPY.explainStep2}
            name="engine-explain-gas-effect"
            value={gasEffect}
            options={ENGINE_EXPLAIN_STEP2}
            onChange={onGasEffect}
          />
        ) : null}
        {showStep3 ? (
          <ExplainStep
            testId="engine-explain-step-3"
            question={ENGINE_COPY.explainStep3}
            name="engine-explain-mechanical-gain"
            value={mechanicalGain}
            options={ENGINE_EXPLAIN_STEP3}
            onChange={onMechanicalGain}
          />
        ) : null}
        {showOwnWords ? (
          <div className="space-y-2" data-testid="engine-explain-own-words">
            <label
              htmlFor="engine-explain-text"
              className="text-sm font-medium text-[var(--ink)]"
            >
              {ENGINE_COPY.explainOwnWords}
            </label>
            <textarea
              id="engine-explain-text"
              value={studentExplanation}
              onChange={(event) => onExplanationChange(event.target.value)}
              placeholder={ENGINE_COPY.explainPlaceholder}
              className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
            />
          </div>
        ) : null}
        {needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">{ENGINE_COPY.explainNeedMore}</p>
        ) : null}
        {showOwnWords ? (
          <div className="flex justify-end">
            <Button onClick={onSubmit}>{ENGINE_COPY.explainSubmit}</Button>
          </div>
        ) : null}
      </Card>

      {hints.length > 0 ? (
        <Card className="space-y-2 p-4" data-testid="engine-hint-list">
          {hints.map((hint) => (
            <p key={hint} className="text-sm leading-relaxed text-[var(--ink-muted)]">
              {hint}
            </p>
          ))}
        </Card>
      ) : null}

      <div className="flex justify-start">
        <Button
          variant="secondary"
          onClick={onRevealHint}
          disabled={!canRevealHint}
          data-testid="engine-explain-hint"
        >
          {canRevealHint ? ENGINE_COPY.explainHint : ENGINE_COPY.explainHintDone}
        </Button>
      </div>
    </div>
  );
}

function ExplainStep({
  testId,
  question,
  name,
  value,
  options,
  onChange,
}: {
  testId: string;
  question: string;
  name: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-3" data-testid={testId}>
      <legend className="text-sm font-medium leading-relaxed text-[var(--ink)]">
        {question}
      </legend>
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
            value === option.value
              ? "border-[var(--heat)] bg-[var(--heat)]/8"
              : "border-[var(--line)] bg-white hover:border-[var(--ink-muted)]"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="mt-1"
            aria-label={option.label}
          />
          <span className="text-sm text-[var(--ink)]">{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
