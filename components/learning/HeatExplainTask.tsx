import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { HeatEvidenceDrawer } from "@/components/learning/HeatEvidenceDrawer";
import {
  HEAT_COPY,
  HEAT_EXPLAIN_HEAT_VS_TEMP,
  HEAT_EXPLAIN_SAME_C_Q,
  HEAT_EXPLAIN_SAME_MASS_Q,
  HEAT_EXPLAIN_TIME_PHASE,
} from "@/lib/content/equal-mass-heated-samples";
import type { HeatExplainInput } from "@/lib/learning/heat-explain";

interface HeatExplainTaskProps {
  value: HeatExplainInput;
  evidence: { experimentA: string; experimentB: string; experimentC: string };
  hints: string[];
  canRevealHint: boolean;
  needMore: boolean;
  onChange: (next: HeatExplainInput) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
}

export function HeatExplainTask({
  value,
  evidence,
  hints,
  canRevealHint,
  needMore,
  onChange,
  onSubmit,
  onRevealHint,
}: HeatExplainTaskProps) {
  return (
    <div className="space-y-4" data-testid="heat-explain-task">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {HEAT_COPY.explainLead}
      </p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {HEAT_COPY.explainFollow}
      </p>
      <HeatEvidenceDrawer
        experimentA={evidence.experimentA}
        experimentB={evidence.experimentB}
        experimentC={evidence.experimentC}
      />
      <Card className="space-y-5 p-4">
        <ChoiceGroup
          legend={HEAT_COPY.explainHeatVsTemp}
          name="heat-explain-heat-vs-temp"
          options={HEAT_EXPLAIN_HEAT_VS_TEMP}
          value={value.heatVsTemperature}
          onChange={(heatVsTemperature) => onChange({ ...value, heatVsTemperature })}
        />
        <ChoiceGroup
          legend={HEAT_COPY.explainSameMassSameQ}
          name="heat-explain-same-mass-q"
          options={HEAT_EXPLAIN_SAME_MASS_Q}
          value={value.sameMassSameQ}
          onChange={(sameMassSameQ) => onChange({ ...value, sameMassSameQ })}
        />
        <ChoiceGroup
          legend={HEAT_COPY.explainSameCSameQ}
          name="heat-explain-same-c-q"
          options={HEAT_EXPLAIN_SAME_C_Q}
          value={value.sameCSameQ}
          onChange={(sameCSameQ) => onChange({ ...value, sameCSameQ })}
        />
        <ChoiceGroup
          legend={HEAT_COPY.explainTimeAndPhase}
          name="heat-explain-time-phase"
          options={HEAT_EXPLAIN_TIME_PHASE}
          value={value.timeAndPhase}
          onChange={(timeAndPhase) => onChange({ ...value, timeAndPhase })}
        />
        <div className="space-y-2">
          <label
            htmlFor="heat-explain-text"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {HEAT_COPY.explainOwnWords}
          </label>
          <textarea
            id="heat-explain-text"
            value={value.studentExplanation}
            onChange={(event) =>
              onChange({ ...value, studentExplanation: event.target.value })
            }
            placeholder={HEAT_COPY.explainPlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
        </div>
        {needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">{HEAT_COPY.explainNeedMore}</p>
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
              {HEAT_COPY.hintAsk}
            </Button>
          ) : null}
          <Button onClick={onSubmit}>{HEAT_COPY.explainSubmit}</Button>
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
