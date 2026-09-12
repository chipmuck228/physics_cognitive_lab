import { useId } from "react";

import {
  ENGINE_PART_LABELS,
  ENGINE_STROKE_LABELS,
} from "@/lib/content/engine-visual";
import type { EngineState } from "@/lib/physics/engine";
import {
  crankAngleRad,
  displayPistonPosition,
} from "@/lib/physics/engine-visual";
import { CombustionEffect } from "./CombustionEffect";
import { EngineConnectingRod } from "./EngineConnectingRod";
import { EngineCrankshaft } from "./EngineCrankshaft";
import { EngineCylinder } from "./EngineCylinder";
import { EnginePiston } from "./EnginePiston";
import { EngineValve } from "./EngineValve";
import { WorkingGas } from "./WorkingGas";
import { ENGINE_VIEW, crankPinPoint, pistonPinPoint } from "./geometry";

interface FourStrokeEngineProps {
  state: EngineState;
  /** 0 = start of this stroke's motion, 1 = EngineState snapshot. Presentation only. */
  motionProgress?: number;
  showStrokeLabel?: boolean;
  testId?: string;
}

export function FourStrokeEngine({
  state,
  motionProgress = 1,
  showStrokeLabel = true,
  testId = "four-stroke-engine",
}: FourStrokeEngineProps) {
  const patternPrefix = useId().replace(/:/g, "");
  const pistonPosition = displayPistonPosition(state, motionProgress);
  const angle = crankAngleRad(state, motionProgress);
  const pin = crankPinPoint(angle);
  const pistonPin = pistonPinPoint(pistonPosition);
  const strokeLabel = ENGINE_STROKE_LABELS[state.stroke];
  const combustionIntensity =
    state.combustionEventActive ? Math.max(0.25, 1 - motionProgress * 0.7) : 0;

  const summary = [
    ENGINE_PART_LABELS.engine,
    showStrokeLabel ? `当前${strokeLabel}` : null,
    `${ENGINE_PART_LABELS.intakeValve}：${state.intakeValveOpen ? ENGINE_PART_LABELS.open : ENGINE_PART_LABELS.closed}`,
    `${ENGINE_PART_LABELS.exhaustValve}：${state.exhaustValveOpen ? ENGINE_PART_LABELS.open : ENGINE_PART_LABELS.closed}`,
    state.combustionEventActive ? ENGINE_PART_LABELS.combustion : null,
  ]
    .filter(Boolean)
    .join("。");

  return (
    <figure
      className="w-full max-w-md"
      data-testid={testId}
      data-stroke={state.stroke}
      data-intake-valve={state.intakeValveOpen ? "open" : "closed"}
      data-exhaust-valve={state.exhaustValveOpen ? "open" : "closed"}
      data-combustion={state.combustionEventActive ? "active" : "off"}
      data-piston-direction={state.pistonDirection}
      data-mechanical-output={state.mechanicalOutput}
      data-crankshaft-moving={state.crankshaftMoving ? "true" : "false"}
      data-working-gas={state.workingGasState}
      aria-label={summary}
    >
      {showStrokeLabel ? (
        <figcaption className="mb-2 text-center text-base font-medium tracking-wide text-white">
          {strokeLabel}
        </figcaption>
      ) : null}
      <svg
        viewBox={`0 0 ${ENGINE_VIEW.width} ${ENGINE_VIEW.height}`}
        role="img"
        aria-hidden="true"
        className="w-full overflow-visible"
      >
        <rect
          x="12"
          y="8"
          width="336"
          height="484"
          rx="28"
          fill="#161412"
        />
        <EngineCylinder label={ENGINE_PART_LABELS.cylinder} />
        <WorkingGas
          gasState={state.workingGasState}
          pistonPosition={pistonPosition}
          patternPrefix={patternPrefix}
          intakeOpen={state.intakeValveOpen}
          exhaustOpen={state.exhaustValveOpen}
        />
        <CombustionEffect
          active={state.combustionEventActive}
          label={ENGINE_PART_LABELS.combustion}
          intensity={combustionIntensity}
        />
        <EnginePiston
          pistonPosition={pistonPosition}
          direction={state.pistonDirection}
          label={ENGINE_PART_LABELS.piston}
        />
        <EngineConnectingRod
          from={pistonPin}
          to={pin}
          label={ENGINE_PART_LABELS.connectingRod}
        />
        <EngineCrankshaft
          pin={pin}
          moving={state.crankshaftMoving}
          label={ENGINE_PART_LABELS.crankshaft}
        />
        <EngineValve
          side="intake"
          open={state.intakeValveOpen}
          name={ENGINE_PART_LABELS.intakeValve}
          openLabel={ENGINE_PART_LABELS.open}
          closedLabel={ENGINE_PART_LABELS.closed}
        />
        <EngineValve
          side="exhaust"
          open={state.exhaustValveOpen}
          name={ENGINE_PART_LABELS.exhaustValve}
          openLabel={ENGINE_PART_LABELS.open}
          closedLabel={ENGINE_PART_LABELS.closed}
        />
      </svg>
    </figure>
  );
}
