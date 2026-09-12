import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { CartEvidenceDrawer } from "@/components/learning/CartEvidenceDrawer";
import {
  CART_COPY,
  CART_EXPLAIN_FORCE_VS_MOTION,
  CART_EXPLAIN_OPPOSITE_DIRECTION,
  CART_EXPLAIN_SAME_DIRECTION,
  CART_EXPLAIN_ZERO_NET_FORCE,
} from "@/lib/content/horizontal-force-cart";
import type { CartExplainInput } from "@/lib/learning/cart-explain";

interface CartExplainTaskProps {
  value: CartExplainInput;
  needMore: boolean;
  evidenceSame?: string | null;
  evidenceOpposite?: string | null;
  evidenceZero?: string | null;
  hints: string[];
  canRevealHint: boolean;
  onChange: (next: CartExplainInput) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
}

export function CartExplainTask({
  value,
  needMore,
  evidenceSame,
  evidenceOpposite,
  evidenceZero,
  hints,
  canRevealHint,
  onChange,
  onSubmit,
  onRevealHint,
}: CartExplainTaskProps) {
  return (
    <div className="space-y-4" data-testid="cart-explain-task">
      <div className="space-y-2">
        <p className="text-sm font-medium leading-relaxed text-[var(--ink)]">
          {CART_COPY.explainLead}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {CART_COPY.explainFollow}
        </p>
      </div>

      <CartEvidenceDrawer
        same={evidenceSame}
        opposite={evidenceOpposite}
        zero={evidenceZero}
      />

      <Card className="space-y-5 p-4">
        <ExplainStep
          testId="cart-explain-force-vs-motion"
          question={CART_COPY.explainForceVsMotion}
          name="cart-explain-force-vs-motion"
          value={value.forceVsMotion}
          options={CART_EXPLAIN_FORCE_VS_MOTION}
          onChange={(forceVsMotion) => onChange({ ...value, forceVsMotion })}
        />
        <ExplainStep
          testId="cart-explain-same"
          question={CART_COPY.explainSameDirection}
          name="cart-explain-same"
          value={value.sameDirection}
          options={CART_EXPLAIN_SAME_DIRECTION}
          onChange={(sameDirection) => onChange({ ...value, sameDirection })}
        />
        <ExplainStep
          testId="cart-explain-opposite"
          question={CART_COPY.explainOppositeDirection}
          name="cart-explain-opposite"
          value={value.oppositeDirection}
          options={CART_EXPLAIN_OPPOSITE_DIRECTION}
          onChange={(oppositeDirection) => onChange({ ...value, oppositeDirection })}
        />
        <ExplainStep
          testId="cart-explain-zero"
          question={CART_COPY.explainZeroNetForce}
          name="cart-explain-zero"
          value={value.zeroNetForce}
          options={CART_EXPLAIN_ZERO_NET_FORCE}
          onChange={(zeroNetForce) => onChange({ ...value, zeroNetForce })}
        />
        <div className="space-y-2">
          <label htmlFor="cart-explain-text" className="text-sm font-medium text-[var(--ink)]">
            {CART_COPY.explainOwnWords}
          </label>
          <textarea
            id="cart-explain-text"
            value={value.studentExplanation}
            onChange={(event) =>
              onChange({ ...value, studentExplanation: event.target.value })
            }
            placeholder={CART_COPY.explainPlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
        </div>
        {needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">{CART_COPY.explainNeedMore}</p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{CART_COPY.explainSubmit}</Button>
        </div>
      </Card>

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
        data-testid="cart-explain-hint"
      >
        {canRevealHint ? CART_COPY.hintAsk : CART_COPY.hintDone}
      </Button>
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
  options: ReadonlyArray<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-2" data-testid={testId}>
      <legend className="text-sm font-medium text-[var(--ink)]">{question}</legend>
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
