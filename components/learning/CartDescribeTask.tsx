import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  CART_CHANGE_OPTIONS,
  CART_COPY,
  CART_FORCE_DIRECTION_OPTIONS,
  CART_INITIAL_MOTION_OPTIONS,
  CART_OBJECT_OPTIONS,
} from "@/lib/content/horizontal-force-cart";
import type { CartDescribeInput } from "@/lib/learning/cart-describe";

interface CartDescribeTaskProps {
  value: CartDescribeInput;
  onChange: (next: CartDescribeInput) => void;
  onSubmit: () => void;
  needStructure: boolean;
}

export function CartDescribeTask({
  value,
  onChange,
  onSubmit,
  needStructure,
}: CartDescribeTaskProps) {
  return (
    <div data-testid="cart-describe-task" className="space-y-4">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {CART_COPY.describeInstruction}
      </p>
      <Card className="space-y-5 p-4">
        <ChoiceGroup
          legend={CART_COPY.objectLabel}
          name="cart-object"
          options={CART_OBJECT_OPTIONS}
          value={value.object}
          onChange={(object) => onChange({ ...value, object })}
        />
        <ChoiceGroup
          legend={CART_COPY.initialMotionLabel}
          name="cart-initial-motion"
          options={CART_INITIAL_MOTION_OPTIONS}
          value={value.initialMotionState}
          onChange={(initialMotionState) =>
            onChange({ ...value, initialMotionState })
          }
        />
        <ChoiceGroup
          legend={CART_COPY.forceDirectionLabel}
          name="cart-force-direction"
          options={CART_FORCE_DIRECTION_OPTIONS}
          value={value.forceDirection}
          onChange={(forceDirection) => onChange({ ...value, forceDirection })}
        />
        <ChoiceGroup
          legend={CART_COPY.observedChangeLabel}
          name="cart-observed-change"
          options={CART_CHANGE_OPTIONS}
          value={value.observedChange}
          onChange={(observedChange) => onChange({ ...value, observedChange })}
        />
        <div className="space-y-2">
          <label htmlFor="cart-describe-text" className="text-sm font-medium text-[var(--ink)]">
            {CART_COPY.describeQuestion}
          </label>
          <textarea
            id="cart-describe-text"
            value={value.studentDescription}
            onChange={(event) =>
              onChange({ ...value, studentDescription: event.target.value })
            }
            placeholder={CART_COPY.describePlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
        </div>
        {needStructure ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {CART_COPY.describeNeedStructure}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{CART_COPY.describeSubmit}</Button>
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
  onChange: (value: never) => void;
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
            onChange={() => onChange(option.value as never)}
            className="mt-1"
            aria-label={option.label}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
