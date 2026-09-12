import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  CART_COPY,
  CART_TRANSFER_RELATION_DISPLAY_ORDER,
  CART_TRANSFER_RELATIONS,
} from "@/lib/content/horizontal-force-cart";
import type { CartTransferJudgment } from "@/lib/learning/cart-transfer";
import { TransferMode } from "@/types/physics-model";

interface CartTransferTaskProps {
  targetId: string;
  scenario: string;
  transferMode: typeof TransferMode.FULL_MODEL | typeof TransferMode.BOUNDARY_CONTRAST;
  judgments: Record<string, CartTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  feedback?: string | null;
  needMore: boolean;
  hints: string[];
  canRevealHint: boolean;
  canRetryMedium: boolean;
  onJudgmentChange: (relationId: string, judgment: CartTransferJudgment) => void;
  onSurfaceCueChange: (selected: boolean) => void;
  onExplanationChange: (value: string) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
  onRetryMedium: () => void;
}

export function CartTransferTask({
  targetId,
  scenario,
  transferMode,
  judgments,
  surfaceCueSelected,
  studentExplanation,
  feedback,
  needMore,
  hints,
  canRevealHint,
  canRetryMedium,
  onJudgmentChange,
  onSurfaceCueChange,
  onExplanationChange,
  onSubmit,
  onRevealHint,
  onRetryMedium,
}: CartTransferTaskProps) {
  const question =
    transferMode === TransferMode.BOUNDARY_CONTRAST
      ? CART_COPY.transferBoundaryQuestion
      : CART_COPY.transferFullQuestion;

  return (
    <div className="space-y-4" data-testid="cart-transfer-task" data-target={targetId}>
      <p className="text-sm font-medium leading-relaxed text-[var(--ink)]">{question}</p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{scenario}</p>

      <Card className="space-y-4 p-4">
        {CART_TRANSFER_RELATION_DISPLAY_ORDER.map((relationId) => {
          const relation = CART_TRANSFER_RELATIONS.find((item) => item.id === relationId);
          if (!relation) {
            return null;
          }
          return (
            <fieldset key={relation.id} className="space-y-2">
              <legend className="text-sm font-medium text-[var(--ink)]">
                {relation.label}
              </legend>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]">
                <input
                  type="radio"
                  name={`cart-transfer-${relation.id}`}
                  checked={judgments[relation.id] === "applies"}
                  onChange={() => onJudgmentChange(relation.id, "applies")}
                  className="mt-1"
                  aria-label={`${relation.label} ${CART_COPY.transferApplies}`}
                />
                <span>{CART_COPY.transferApplies}</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]">
                <input
                  type="radio"
                  name={`cart-transfer-${relation.id}`}
                  checked={judgments[relation.id] === "not-necessarily"}
                  onChange={() => onJudgmentChange(relation.id, "not-necessarily")}
                  className="mt-1"
                  aria-label={`${relation.label} ${CART_COPY.transferNotNecessarily}`}
                />
                <span>{CART_COPY.transferNotNecessarily}</span>
              </label>
            </fieldset>
          );
        })}

        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]">
          <input
            type="checkbox"
            className="mt-1"
            checked={surfaceCueSelected}
            onChange={(event) => onSurfaceCueChange(event.target.checked)}
            data-testid="cart-transfer-surface-cue"
            aria-label={CART_COPY.transferSurfaceCue}
          />
          <span>{CART_COPY.transferSurfaceCue}</span>
        </label>

        <div className="space-y-2">
          <label htmlFor="cart-transfer-text" className="text-sm font-medium text-[var(--ink)]">
            {CART_COPY.transferOwnWords}
          </label>
          <textarea
            id="cart-transfer-text"
            value={studentExplanation}
            onChange={(event) => onExplanationChange(event.target.value)}
            placeholder={CART_COPY.transferPlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
        </div>
      </Card>

      {feedback ? (
        <p className="text-sm text-[var(--ink-muted)]" data-testid="cart-transfer-feedback">
          {feedback}
        </p>
      ) : null}
      {needMore ? (
        <p className="text-sm text-[var(--ink-muted)]">{CART_COPY.transferNeedMore}</p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-2">
        {canRetryMedium ? (
          <Button variant="secondary" onClick={onRetryMedium} data-testid="cart-transfer-medium">
            {CART_COPY.transferMedium}
          </Button>
        ) : null}
        <Button onClick={onSubmit}>{CART_COPY.transferSubmit}</Button>
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
        data-testid="cart-transfer-hint"
      >
        {canRevealHint ? CART_COPY.hintAsk : CART_COPY.hintDone}
      </Button>
    </div>
  );
}
