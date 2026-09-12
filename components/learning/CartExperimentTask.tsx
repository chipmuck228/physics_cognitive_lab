import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  CART_COMPARE_OPTIONS,
  CART_COPY,
  CART_DIRECTION_CHANGE_OPTIONS,
  CART_MOTION_CHANGE_OPTIONS,
  CART_SPEED_CHANGE_OPTIONS,
} from "@/lib/content/horizontal-force-cart";
import type { CartObservedResult } from "@/lib/learning/cart-experiment";

interface CartExperimentTaskProps {
  title: string;
  canRun: boolean;
  hasRun: boolean;
  showFrictionNote?: boolean;
  observed: CartObservedResult;
  comparison: "" | "same" | "different" | "partial";
  reflection: string;
  reflectionPrompt: string;
  onRun: () => void;
  onObservedChange: (next: CartObservedResult) => void;
  onSaveObserved: () => void;
  onComparisonChange: (value: "same" | "different" | "partial") => void;
  onSaveComparison: () => void;
  onReflectionChange: (value: string) => void;
  onSaveReflection: () => void;
  observedSaved: boolean;
  comparisonSaved: boolean;
}

export function CartExperimentTask({
  title,
  canRun,
  hasRun,
  showFrictionNote = false,
  observed,
  comparison,
  reflection,
  reflectionPrompt,
  onRun,
  onObservedChange,
  onSaveObserved,
  onComparisonChange,
  onSaveComparison,
  onReflectionChange,
  onSaveReflection,
  observedSaved,
  comparisonSaved,
}: CartExperimentTaskProps) {
  return (
    <div className="space-y-4" data-testid="cart-experiment-task">
      <p className="text-sm font-medium text-[var(--ink)]">{title}</p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {CART_COPY.experimentIntro}
      </p>
      <Button
        onClick={onRun}
        disabled={!canRun || hasRun}
        data-testid="cart-run-experiment"
      >
        {CART_COPY.runExperiment}
      </Button>
      {!canRun ? (
        <p className="text-sm text-[var(--ink-muted)]">{CART_COPY.runNeedPrediction}</p>
      ) : null}

      {hasRun ? (
        <Card className="space-y-4 p-4" data-testid="cart-observed-result">
          {showFrictionNote ? (
            <p className="text-sm text-[var(--ink-muted)]">{CART_COPY.frictionNote}</p>
          ) : null}
          <ChoiceGroup
            legend={CART_COPY.speedChangeLabel}
            name="cart-speed-change"
            options={CART_SPEED_CHANGE_OPTIONS}
            value={observed.speedChange}
            onChange={(speedChange) =>
              onObservedChange({ ...observed, speedChange })
            }
          />
          <ChoiceGroup
            legend={CART_COPY.directionChangeLabel}
            name="cart-direction-change"
            options={CART_DIRECTION_CHANGE_OPTIONS}
            value={observed.directionChanged}
            onChange={(directionChanged) =>
              onObservedChange({ ...observed, directionChanged })
            }
          />
          <ChoiceGroup
            legend={CART_COPY.motionChangeLabel}
            name="cart-motion-change"
            options={CART_MOTION_CHANGE_OPTIONS}
            value={observed.motionStateChange}
            onChange={(motionStateChange) =>
              onObservedChange({ ...observed, motionStateChange })
            }
          />
          <div className="flex justify-end">
            <Button onClick={onSaveObserved} variant="secondary">
              {CART_COPY.observeSubmitExperiment}
            </Button>
          </div>
        </Card>
      ) : null}

      {observedSaved ? (
        <Card className="space-y-4 p-4" data-testid="cart-comparison">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-[var(--ink)]">
              {CART_COPY.compareQuestion}
            </legend>
            {CART_COMPARE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
              >
                <input
                  type="radio"
                  name="cart-comparison"
                  value={option.value}
                  checked={comparison === option.value}
                  onChange={() =>
                    onComparisonChange(option.value as "same" | "different" | "partial")
                  }
                  className="mt-1"
                  aria-label={option.label}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          <div className="flex justify-end">
            <Button onClick={onSaveComparison} variant="secondary">
              {CART_COPY.compareSubmit}
            </Button>
          </div>
        </Card>
      ) : null}

      {comparisonSaved ? (
        <Card className="space-y-3 p-4">
          <label htmlFor="cart-reflection" className="text-sm font-medium text-[var(--ink)]">
            {reflectionPrompt}
          </label>
          <textarea
            id="cart-reflection"
            value={reflection}
            onChange={(event) => onReflectionChange(event.target.value)}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
          <div className="flex justify-end">
            <Button onClick={onSaveReflection}>{CART_COPY.reflectionSubmit}</Button>
          </div>
        </Card>
      ) : null}
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
            aria-label={`${legend} ${option.label}`}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
