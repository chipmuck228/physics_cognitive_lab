import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { HeatEvidenceDrawer } from "@/components/learning/HeatEvidenceDrawer";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  HEAT_COPY,
  HEAT_MODEL_CONDITIONS,
  HEAT_MODEL_FACTOR_OPTIONS,
  HEAT_MODEL_SAME_C_Q,
  HEAT_MODEL_SAME_MASS_DELTA_T,
  HEAT_MODEL_SAME_MASS_Q,
  HEAT_MODEL_SUFFICIENCY,
} from "@/lib/content/equal-mass-heated-samples";
import type { HeatModelDraft } from "@/lib/learning/heat-model";
import type { StudentUiFeedback } from "@/lib/learning/student-ui-feedback";

interface HeatProductBoardProps {
  draft: HeatModelDraft;
  evidence: { experimentA: string; experimentB: string; experimentC: string };
  feedback?: string | null;
  gateFeedback?: StudentUiFeedback | null;
  hints: string[];
  canRevealHint: boolean;
  needStructure: boolean;
  onChange: (next: HeatModelDraft) => void;
  onToggleCondition: (value: string) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
}

export function HeatProductBoard({
  draft,
  evidence,
  feedback,
  gateFeedback,
  hints,
  canRevealHint,
  needStructure,
  onChange,
  onToggleCondition,
  onSubmit,
  onRevealHint,
}: HeatProductBoardProps) {
  const selected = new Set(draft.conditions);

  return (
    <div className="space-y-4" data-testid="heat-product-board">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {HEAT_COPY.modelInstruction}
      </p>
      <HeatEvidenceDrawer
        experimentA={evidence.experimentA}
        experimentB={evidence.experimentB}
        experimentC={evidence.experimentC}
      />
      <Card className="space-y-5 p-4">
        <p className="text-sm font-medium text-[var(--ink)]">
          {HEAT_COPY.modelProductLabel}
        </p>
        <div
          className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-end gap-2"
          data-testid="heat-product-equation"
        >
          <QuantitySelect
            legend={HEAT_COPY.modelCLabel}
            name="heat-product-c"
            value={draft.factorC}
            onChange={(factorC) => onChange({ ...draft, factorC })}
          />
          <p className="pb-2 text-xl text-[var(--ink)]">×</p>
          <QuantitySelect
            legend={HEAT_COPY.modelMLabel}
            name="heat-product-m"
            value={draft.factorM}
            onChange={(factorM) => onChange({ ...draft, factorM })}
          />
          <p className="pb-2 text-xl text-[var(--ink)]">×</p>
          <QuantitySelect
            legend={HEAT_COPY.modelDeltaTLabel}
            name="heat-product-delta-t"
            value={draft.factorDeltaT}
            onChange={(factorDeltaT) => onChange({ ...draft, factorDeltaT })}
          />
          <p className="pb-2 text-xl text-[var(--ink)]">=</p>
          <QuantitySelect
            legend={HEAT_COPY.modelQLabel}
            name="heat-product-q"
            value={draft.productQ}
            onChange={(productQ) => onChange({ ...draft, productQ })}
          />
        </div>

        <p className="text-xs text-[var(--ink-muted)]">
          下面三次比较都要能从这个乘积推出来。
        </p>
        <div className="space-y-5" data-testid="heat-product-comparisons">
          <ChoiceGroup
            legend={HEAT_COPY.modelSameMassDeltaTLabel}
            name="heat-model-same-mass-delta-t"
            options={HEAT_MODEL_SAME_MASS_DELTA_T}
            value={draft.sameMassSameDeltaT}
            onChange={(sameMassSameDeltaT) =>
              onChange({ ...draft, sameMassSameDeltaT })
            }
          />
          <ChoiceGroup
            legend={HEAT_COPY.modelSameMassQLabel}
            name="heat-model-same-mass-q"
            options={HEAT_MODEL_SAME_MASS_Q}
            value={draft.sameMassSameQ}
            onChange={(sameMassSameQ) => onChange({ ...draft, sameMassSameQ })}
          />
          <ChoiceGroup
            legend={HEAT_COPY.modelSameCQLabel}
            name="heat-model-same-c-q"
            options={HEAT_MODEL_SAME_C_Q}
            value={draft.sameCSameQ}
            onChange={(sameCSameQ) => onChange({ ...draft, sameCSameQ })}
          />
        </div>

        <div className="space-y-3" data-testid="heat-product-sufficiency">
          <p className="text-sm font-medium text-[var(--ink)]">
            {HEAT_COPY.modelSufficiencyLabel}
          </p>
          <ChoiceGroup
            legend={HEAT_COPY.modelSufficiencyLabel}
            name="heat-model-sufficiency"
            options={HEAT_MODEL_SUFFICIENCY}
            value={draft.sufficiency}
            onChange={(sufficiency) => onChange({ ...draft, sufficiency })}
          />
        </div>

        <fieldset className="space-y-2" data-testid="heat-product-conditions">
          <legend className="text-sm font-medium text-[var(--ink)]">
            {HEAT_COPY.modelConditionLabel}
          </legend>
          {HEAT_MODEL_CONDITIONS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
            >
              <input
                type="checkbox"
                checked={selected.has(option.id)}
                onChange={() => onToggleCondition(option.id)}
                value={option.id}
                className="mt-1"
                aria-label={option.label}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>

        {needStructure ? (
          <ValidationMessage kind="info" testId="heat-model-need-structure">
            {HEAT_COPY.modelNeedStructure}
          </ValidationMessage>
        ) : null}
        {gateFeedback ? (
          <ValidationMessage kind={gateFeedback.kind} testId="heat-model-feedback">
            {gateFeedback.message}
          </ValidationMessage>
        ) : feedback ? (
          <ValidationMessage kind="incorrect" testId="heat-model-feedback">
            {feedback}
          </ValidationMessage>
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
          <Button onClick={onSubmit}>{HEAT_COPY.modelSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}

function QuantitySelect({
  legend,
  name,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs text-[var(--ink-muted)]">{legend}</legend>
      {HEAT_MODEL_FACTOR_OPTIONS.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-start gap-2 text-sm text-[var(--ink)]"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="mt-1"
            aria-label={`${legend} ${option.label}`}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
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
            aria-label={`${legend} ${option.label}`}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
