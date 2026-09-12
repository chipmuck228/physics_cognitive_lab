import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { SamplesEvidenceDrawer } from "@/components/learning/SamplesEvidenceDrawer";
import {
  SAMPLES_COPY,
  SAMPLES_EXPLAIN_DENSITY_VS_MASS,
  SAMPLES_EXPLAIN_SAME_MASS,
  SAMPLES_EXPLAIN_SAME_VOLUME,
  SAMPLES_EXPLAIN_UNIFORM_CUT,
} from "@/lib/content/equal-volume-material-samples";
import type { SamplesExplainInput } from "@/lib/learning/samples-explain";

interface SamplesExplainTaskProps {
  value: SamplesExplainInput;
  evidence: { sameVolume: string; sameMass: string; cut: string };
  hints: string[];
  canRevealHint: boolean;
  needMore: boolean;
  onChange: (next: SamplesExplainInput) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
}

export function SamplesExplainTask({
  value,
  evidence,
  hints,
  canRevealHint,
  needMore,
  onChange,
  onSubmit,
  onRevealHint,
}: SamplesExplainTaskProps) {
  return (
    <div className="space-y-4" data-testid="samples-explain-task">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {SAMPLES_COPY.explainLead}
      </p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {SAMPLES_COPY.explainFollow}
      </p>
      <SamplesEvidenceDrawer
        sameVolume={evidence.sameVolume}
        sameMass={evidence.sameMass}
        cut={evidence.cut}
      />
      <Card className="space-y-5 p-4">
        <ChoiceGroup
          legend={SAMPLES_COPY.explainDensityVsMass}
          name="samples-explain-density-vs-mass"
          options={SAMPLES_EXPLAIN_DENSITY_VS_MASS}
          value={value.densityVsMass}
          onChange={(densityVsMass) => onChange({ ...value, densityVsMass })}
        />
        <ChoiceGroup
          legend={SAMPLES_COPY.explainSameVolume}
          name="samples-explain-same-volume"
          options={SAMPLES_EXPLAIN_SAME_VOLUME}
          value={value.sameVolume}
          onChange={(sameVolume) => onChange({ ...value, sameVolume })}
        />
        <ChoiceGroup
          legend={SAMPLES_COPY.explainSameMass}
          name="samples-explain-same-mass"
          options={SAMPLES_EXPLAIN_SAME_MASS}
          value={value.sameMass}
          onChange={(sameMass) => onChange({ ...value, sameMass })}
        />
        <ChoiceGroup
          legend={SAMPLES_COPY.explainUniformCut}
          name="samples-explain-cut"
          options={SAMPLES_EXPLAIN_UNIFORM_CUT}
          value={value.uniformCut}
          onChange={(uniformCut) => onChange({ ...value, uniformCut })}
        />
        <div className="space-y-2">
          <label
            htmlFor="samples-explain-text"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {SAMPLES_COPY.explainOwnWords}
          </label>
          <textarea
            id="samples-explain-text"
            value={value.studentExplanation}
            onChange={(event) =>
              onChange({ ...value, studentExplanation: event.target.value })
            }
            placeholder={SAMPLES_COPY.explainPlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
        </div>
        {needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">{SAMPLES_COPY.explainNeedMore}</p>
        ) : null}
        {hints.length > 0 ? (
          <ul className="space-y-1">
            {hints.map((hint) => (
              <li key={hint} className="text-sm text-[var(--ink-muted)]">
                {hint}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex justify-end gap-3">
          {canRevealHint ? (
            <Button variant="secondary" onClick={onRevealHint}>
              {SAMPLES_COPY.hintAsk}
            </Button>
          ) : null}
          <Button onClick={onSubmit}>{SAMPLES_COPY.explainSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}

function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-[var(--ink)]">{legend}</legend>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
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
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
