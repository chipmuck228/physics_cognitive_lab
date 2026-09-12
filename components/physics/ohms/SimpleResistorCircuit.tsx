import { OHMS_COPY } from "@/lib/content/simple-resistor-circuit";
import {
  ohmsVisibleReadings,
  type OhmsSceneState,
} from "@/lib/physics/simple-resistor-circuit";

interface SimpleResistorCircuitProps {
  state: OhmsSceneState;
  frozen?: boolean;
}

export function SimpleResistorCircuit({ state, frozen = false }: SimpleResistorCircuitProps) {
  const left = ohmsVisibleReadings({
    ...state.left,
    circuitClosed: state.circuitClosed && state.left.circuitClosed,
  });
  const right = ohmsVisibleReadings({
    ...state.right,
    circuitClosed: state.circuitClosed && state.right.circuitClosed,
  });
  const caption =
    state.comparisonMode === "same-voltage-different-resistance"
      ? OHMS_COPY.sameUCaption
      : state.comparisonMode === "same-resistance-different-voltage"
        ? OHMS_COPY.sameRCaption
        : OHMS_COPY.observeCaption;

  return (
    <div
      className="space-y-3"
      data-testid="simple-resistor-circuit"
      data-comparison-mode={state.comparisonMode}
      data-circuit-closed={state.circuitClosed ? "true" : "false"}
      data-readings-revealed={state.readingsRevealed ? "true" : "false"}
      data-frozen={frozen ? "true" : "false"}
    >
      <p className="text-center text-sm text-[var(--ink-muted)]">
        {frozen ? OHMS_COPY.modelFrozenCaption : caption}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <CircuitCard
          title={OHMS_COPY.leftCircuit}
          testId="ohms-left"
          readings={left}
          revealed={state.readingsRevealed}
          closed={state.circuitClosed && state.left.circuitClosed}
        />
        <CircuitCard
          title={OHMS_COPY.rightCircuit}
          testId="ohms-right"
          readings={right}
          revealed={state.readingsRevealed}
          closed={state.circuitClosed && state.right.circuitClosed}
        />
      </div>
    </div>
  );
}

function CircuitCard({
  title,
  testId,
  readings,
  revealed,
  closed,
}: {
  title: string;
  testId: string;
  readings: ReturnType<typeof ohmsVisibleReadings>;
  revealed: boolean;
  closed: boolean;
}) {
  return (
    <div
      className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-4"
      data-testid={testId}
    >
      <p className="text-sm font-medium text-[var(--ink)]">{title}</p>
      <p className="mt-2 text-xs text-[var(--ink-muted)]">{OHMS_COPY.resistorGraphic}</p>
      <dl className="mt-3 space-y-1 text-sm">
        <Reading
          testId={`${testId}-resistance`}
          quantityId="resistance"
          label={OHMS_COPY.resistanceLabel}
          value={readings.resistanceOhm}
          unit={OHMS_COPY.resistanceUnit}
        />
        <Reading
          testId={`${testId}-source-voltage`}
          quantityId="source-voltage"
          label={OHMS_COPY.sourceVoltageLabel}
          value={readings.sourceVoltageV}
          unit={OHMS_COPY.voltageUnit}
        />
        <Reading
          testId={`${testId}-resistor-voltage`}
          quantityId="voltage"
          label={OHMS_COPY.resistorVoltageLabel}
          value={revealed ? readings.voltageAcrossResistorV : null}
          unit={OHMS_COPY.voltageUnit}
        />
        <Reading
          testId={`${testId}-current`}
          quantityId="current"
          label={OHMS_COPY.currentLabel}
          value={revealed ? readings.currentA : null}
          unit={OHMS_COPY.currentUnit}
        />
      </dl>
      <p className="mt-2 text-xs text-[var(--ink-muted)]">
        {closed ? OHMS_COPY.closedLabel : OHMS_COPY.openLabel}
      </p>
    </div>
  );
}

function Reading({
  testId,
  quantityId,
  label,
  value,
  unit,
}: {
  testId: string;
  quantityId: "current" | "voltage" | "resistance" | "source-voltage";
  label: string;
  value: number | null;
  unit: string;
}) {
  return (
    <div className="flex justify-between gap-3" data-testid={testId} data-quantity-id={quantityId}>
      <dt>{label}</dt>
      <dd data-quantity={quantityId} data-unit={unit}>
        {value == null ? "还没读出来" : `${value} ${unit}`}
      </dd>
    </div>
  );
}
