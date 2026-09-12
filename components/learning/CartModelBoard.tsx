import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { CartEvidenceDrawer } from "@/components/learning/CartEvidenceDrawer";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  CART_COPY,
  CART_MODEL_CASE_IDS,
  CART_MODEL_CHANGE_OPTIONS,
  CART_MODEL_CONDITION_OPTIONS,
  CART_MODEL_FORCE_OPTIONS,
  CART_MODEL_MOTION_OPTIONS,
  type CartModelCaseId,
} from "@/lib/content/horizontal-force-cart";
import type { CartModelCase, CartModelDraft } from "@/lib/learning/cart-model";
import type { StudentUiFeedback } from "@/lib/learning/student-ui-feedback";

interface CartModelBoardProps {
  draft: CartModelDraft;
  feedback?: string | null;
  gateFeedback?: StudentUiFeedback | null;
  needStructure: boolean;
  evidenceSame?: string | null;
  evidenceOpposite?: string | null;
  evidenceZero?: string | null;
  hints: string[];
  canRevealHint: boolean;
  onCaseChange: (caseId: CartModelCaseId, next: CartModelCase) => void;
  onToggleCondition: (value: string) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
}

const CASE_LABELS: Record<CartModelCaseId, string> = {
  same: CART_COPY.modelSameLabel,
  opposite: CART_COPY.modelOppositeLabel,
  zero: CART_COPY.modelZeroLabel,
};

export function CartModelBoard({
  draft,
  feedback,
  gateFeedback,
  needStructure,
  evidenceSame,
  evidenceOpposite,
  evidenceZero,
  hints,
  canRevealHint,
  onCaseChange,
  onToggleCondition,
  onSubmit,
  onRevealHint,
}: CartModelBoardProps) {
  const selected = new Set(draft.conditions);

  return (
    <div className="space-y-4" data-testid="cart-model-board">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {CART_COPY.modelInstruction}
      </p>

      <CartEvidenceDrawer
        title={CART_COPY.modelEvidenceTitle}
        same={evidenceSame}
        opposite={evidenceOpposite}
        zero={evidenceZero}
      />

      {CART_MODEL_CASE_IDS.map((caseId) => (
        <Card key={caseId} className="space-y-3 p-4" data-testid={`cart-model-case-${caseId}`}>
          <p className="text-sm font-medium text-[var(--ink)]">{CASE_LABELS[caseId]}</p>
          <SelectField
            legend={CART_COPY.modelMotionLabel}
            name={`cart-model-${caseId}-motion`}
            options={CART_MODEL_MOTION_OPTIONS}
            value={draft.cases[caseId].currentMotionState}
            prefix={CASE_LABELS[caseId]}
            onChange={(currentMotionState) =>
              onCaseChange(caseId, { ...draft.cases[caseId], currentMotionState })
            }
          />
          <SelectField
            legend={CART_COPY.modelForceLabel}
            name={`cart-model-${caseId}-force`}
            options={CART_MODEL_FORCE_OPTIONS}
            value={draft.cases[caseId].netForceCondition}
            prefix={CASE_LABELS[caseId]}
            onChange={(netForceCondition) =>
              onCaseChange(caseId, { ...draft.cases[caseId], netForceCondition })
            }
          />
          <SelectField
            legend={CART_COPY.modelChangeLabel}
            name={`cart-model-${caseId}-change`}
            options={CART_MODEL_CHANGE_OPTIONS}
            value={draft.cases[caseId].resultingChange}
            prefix={CASE_LABELS[caseId]}
            onChange={(resultingChange) =>
              onCaseChange(caseId, { ...draft.cases[caseId], resultingChange })
            }
          />
        </Card>
      ))}

      <Card className="space-y-3 p-4" data-testid="cart-model-conditions">
        <p className="text-sm font-medium text-[var(--ink)]">{CART_COPY.modelConditionLabel}</p>
        {CART_MODEL_CONDITION_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={selected.has(option.value)}
              onChange={() => onToggleCondition(option.value)}
              value={option.value}
              aria-label={option.label}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </Card>

      {needStructure ? (
        <ValidationMessage kind="info" testId="cart-model-need-structure">
          {CART_COPY.modelNeedStructure}
        </ValidationMessage>
      ) : null}
      {gateFeedback ? (
        <ValidationMessage kind={gateFeedback.kind} testId="cart-model-feedback">
          {gateFeedback.message}
        </ValidationMessage>
      ) : feedback ? (
        <ValidationMessage kind="incorrect" testId="cart-model-feedback">
          {feedback}
        </ValidationMessage>
      ) : null}

      <div className="flex justify-end">
        <Button onClick={onSubmit}>{CART_COPY.modelSubmit}</Button>
      </div>

      {hints.length > 0 ? (
        <Card className="space-y-2 p-4" data-testid="cart-hint-list">
          {hints.map((hint) => (
            <p key={hint} className="text-sm leading-relaxed text-[var(--ink-muted)]">
              {hint}
            </p>
          ))}
        </Card>
      ) : null}

      <Button
        variant="secondary"
        onClick={onRevealHint}
        disabled={!canRevealHint}
        data-testid="cart-model-hint"
      >
        {canRevealHint ? CART_COPY.hintAsk : CART_COPY.hintDone}
      </Button>
    </div>
  );
}

function SelectField({
  legend,
  name,
  options,
  value,
  prefix,
  onChange,
}: {
  legend: string;
  name: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  value: string;
  prefix: string;
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
            aria-label={`${prefix} ${legend} ${option.label}`}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
