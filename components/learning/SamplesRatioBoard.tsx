import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { SamplesEvidenceDrawer } from "@/components/learning/SamplesEvidenceDrawer";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  SAMPLES_COPY,
  SAMPLES_MODEL_CONDITION_OPTIONS,
  SAMPLES_MODEL_CUT_MASS_OPTIONS,
  SAMPLES_MODEL_CUT_OPTIONS,
  SAMPLES_MODEL_CUT_RATIO_OPTIONS,
  SAMPLES_MODEL_CUT_VOLUME_OPTIONS,
  SAMPLES_MODEL_CUT_WHY_OPTIONS,
  SAMPLES_MODEL_QUANTITY_OPTIONS,
  SAMPLES_MODEL_SAME_MASS_OPTIONS,
  SAMPLES_MODEL_SAME_VOLUME_OPTIONS,
  SAMPLES_MODEL_SUFFICIENCY_OPTIONS,
} from "@/lib/content/equal-volume-material-samples";
import type { SamplesModelDraft } from "@/lib/learning/samples-model";
import type { StudentUiFeedback } from "@/lib/learning/student-ui-feedback";

interface SamplesRatioBoardProps {
  draft: SamplesModelDraft;
  evidence: { sameVolume: string; sameMass: string; cut: string };
  feedback?: string | null;
  gateFeedback?: StudentUiFeedback | null;
  hints: string[];
  canRevealHint: boolean;
  needStructure: boolean;
  onChange: (next: SamplesModelDraft) => void;
  onToggleCondition: (value: string) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
}

export function SamplesRatioBoard({
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
}: SamplesRatioBoardProps) {
  const selected = new Set(draft.conditions);

  return (
    <div className="space-y-4" data-testid="samples-ratio-board">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {SAMPLES_COPY.modelInstruction}
      </p>
      <SamplesEvidenceDrawer
        sameVolume={evidence.sameVolume}
        sameMass={evidence.sameMass}
        cut={evidence.cut}
      />
      <Card className="space-y-5 p-4">
        <p className="text-sm font-medium text-[var(--ink)]">
          {SAMPLES_COPY.modelRatioLabel}
        </p>
        <div
          className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-end gap-2"
          data-testid="samples-ratio-equation"
        >
          <QuantitySelect
            legend={SAMPLES_COPY.modelNumeratorLabel}
            name="samples-ratio-numerator"
            value={draft.numerator}
            onChange={(numerator) => onChange({ ...draft, numerator })}
          />
          <p className="pb-2 text-xl text-[var(--ink)]">÷</p>
          <QuantitySelect
            legend={SAMPLES_COPY.modelDenominatorLabel}
            name="samples-ratio-denominator"
            value={draft.denominator}
            onChange={(denominator) => onChange({ ...draft, denominator })}
          />
          <p className="pb-2 text-xl text-[var(--ink)]">=</p>
          <QuantitySelect
            legend={SAMPLES_COPY.modelResultLabel}
            name="samples-ratio-result"
            value={draft.result}
            onChange={(result) => onChange({ ...draft, result })}
          />
        </div>

        <p className="text-xs text-[var(--ink-muted)]">
          下面三行都要能从这个比值推出来。
        </p>
        <table className="w-full border-collapse text-sm" data-testid="samples-ratio-table">
          <thead>
            <tr className="text-left text-[var(--ink-muted)]">
              <th className="border-b border-[var(--line)] py-2 pr-3">比较</th>
              <th className="border-b border-[var(--line)] py-2">密度怎样变</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 pr-3 align-top">{SAMPLES_COPY.modelSameVolumeLabel}</td>
              <td className="py-3">
                <ChoiceGroup
                  legend={SAMPLES_COPY.modelSameVolumeLabel}
                  name="samples-model-same-volume"
                  options={SAMPLES_MODEL_SAME_VOLUME_OPTIONS}
                  value={draft.sameVolumeConclusion}
                  onChange={(sameVolumeConclusion) =>
                    onChange({ ...draft, sameVolumeConclusion })
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="py-3 pr-3 align-top">{SAMPLES_COPY.modelSameMassLabel}</td>
              <td className="py-3">
                <ChoiceGroup
                  legend={SAMPLES_COPY.modelSameMassLabel}
                  name="samples-model-same-mass"
                  options={SAMPLES_MODEL_SAME_MASS_OPTIONS}
                  value={draft.sameMassConclusion}
                  onChange={(sameMassConclusion) =>
                    onChange({ ...draft, sameMassConclusion })
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="py-3 pr-3 align-top">{SAMPLES_COPY.modelCutLabel}</td>
              <td className="py-3">
                <ChoiceGroup
                  legend={SAMPLES_COPY.modelCutLabel}
                  name="samples-model-cut"
                  options={SAMPLES_MODEL_CUT_OPTIONS}
                  value={draft.cutConclusion}
                  onChange={(cutConclusion) => onChange({ ...draft, cutConclusion })}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="space-y-4" data-testid="samples-ratio-cut">
          <p className="text-sm font-medium text-[var(--ink)]">
            {SAMPLES_COPY.modelCutCompareLabel}
          </p>
          <QuestionGroup
            id="samples-model-cut-mass"
            question={SAMPLES_COPY.modelCutMassLabel}
            options={SAMPLES_MODEL_CUT_MASS_OPTIONS}
            value={draft.cutMassChange}
            onChange={(cutMassChange) => onChange({ ...draft, cutMassChange })}
          />
          <QuestionGroup
            id="samples-model-cut-volume"
            question={SAMPLES_COPY.modelCutVolumeLabel}
            options={SAMPLES_MODEL_CUT_VOLUME_OPTIONS}
            value={draft.cutVolumeChange}
            onChange={(cutVolumeChange) => onChange({ ...draft, cutVolumeChange })}
          />
          <QuestionGroup
            id="samples-model-cut-ratio"
            question={SAMPLES_COPY.modelCutRatioLabel}
            options={SAMPLES_MODEL_CUT_RATIO_OPTIONS}
            value={draft.cutRatioChange}
            onChange={(cutRatioChange) => onChange({ ...draft, cutRatioChange })}
          />
          <QuestionGroup
            id="samples-model-cut-why"
            question={SAMPLES_COPY.modelCutWhyLabel}
            options={SAMPLES_MODEL_CUT_WHY_OPTIONS}
            value={draft.cutWhy}
            onChange={(cutWhy) => onChange({ ...draft, cutWhy })}
          />
        </div>

        <div className="space-y-3" data-testid="samples-ratio-sufficiency">
          <p className="text-sm font-medium text-[var(--ink)]">
            {SAMPLES_COPY.modelSufficiencyLabel}
          </p>
          <ChoiceGroup
            legend={SAMPLES_COPY.modelSufficiencyLabel}
            name="samples-model-sufficiency"
            options={SAMPLES_MODEL_SUFFICIENCY_OPTIONS}
            value={draft.sufficiency}
            onChange={(sufficiency) => onChange({ ...draft, sufficiency })}
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-[var(--ink)]">
            {SAMPLES_COPY.modelConditionLabel}
          </legend>
          {SAMPLES_MODEL_CONDITION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
            >
              <input
                type="checkbox"
                checked={selected.has(option.value)}
                onChange={() => onToggleCondition(option.value)}
                value={option.value}
                className="mt-1"
                aria-label={option.label}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>

        {needStructure ? (
          <ValidationMessage kind="info" testId="samples-model-need-structure">
            {SAMPLES_COPY.modelNeedStructure}
          </ValidationMessage>
        ) : null}
        {gateFeedback ? (
          <ValidationMessage kind={gateFeedback.kind} testId="samples-model-feedback">
            {gateFeedback.message}
          </ValidationMessage>
        ) : feedback ? (
          <ValidationMessage kind="incorrect" testId="samples-model-feedback">
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
              {SAMPLES_COPY.hintAsk}
            </Button>
          ) : null}
          <Button onClick={onSubmit}>{SAMPLES_COPY.modelSubmit}</Button>
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
      {SAMPLES_MODEL_QUANTITY_OPTIONS.map((option) => (
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
      <legend className="sr-only">{legend}</legend>
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
