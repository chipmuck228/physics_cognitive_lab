import type { WorkingGasState } from "@/lib/physics/engine";
import { ENGINE_GAS_LABELS } from "@/lib/content/engine-visual";
import { ENGINE_VIEW, pistonTopY } from "./geometry";

interface WorkingGasProps {
  gasState: WorkingGasState;
  pistonPosition: number;
  patternPrefix: string;
  intakeOpen: boolean;
  exhaustOpen: boolean;
}

const FILL: Record<WorkingGasState, string> = {
  "fresh-mixture": "#9ec9c4",
  compressed: "#6f9a96",
  "compressed-unburned": "#7a8f8c",
  "combusted-hot": "#e0a56a",
  expanding: "#d9783a",
  exhaust: "#8a7a6c",
};

export function WorkingGas({
  gasState,
  pistonPosition,
  patternPrefix,
  intakeOpen,
  exhaustOpen,
}: WorkingGasProps) {
  const top = ENGINE_VIEW.chamberTop;
  const bottom = pistonTopY(pistonPosition);
  const height = Math.max(6, bottom - top);
  const dense =
    gasState === "compressed" || gasState === "compressed-unburned";

  return (
    <g data-working-gas={gasState}>
      <title>{ENGINE_GAS_LABELS[gasState]}</title>
      <defs>
        <pattern
          id={`${patternPrefix}-gas`}
          width={dense ? 8 : 14}
          height={dense ? 8 : 14}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={dense ? 2 : 3}
            cy={dense ? 2 : 3}
            r={dense ? 1.35 : 1.1}
            fill={FILL[gasState]}
            opacity="0.9"
          />
        </pattern>
      </defs>
      <rect
        x={ENGINE_VIEW.cylinderLeft + 10}
        y={top}
        width={ENGINE_VIEW.cylinderRight - ENGINE_VIEW.cylinderLeft - 20}
        height={height}
        fill={`url(#${patternPrefix}-gas)`}
        opacity="0.92"
      />
      <rect
        x={ENGINE_VIEW.cylinderLeft + 10}
        y={top}
        width={ENGINE_VIEW.cylinderRight - ENGINE_VIEW.cylinderLeft - 20}
        height={height}
        fill={FILL[gasState]}
        opacity="0.28"
      />
      {intakeOpen ? (
        <rect
          x="52"
          y="60"
          width="64"
          height="16"
          rx="8"
          fill="#9ec9c4"
          opacity="0.55"
        />
      ) : null}
      {exhaustOpen ? (
        <rect
          x="244"
          y="60"
          width="64"
          height="16"
          rx="8"
          fill="#8a7a6c"
          opacity="0.5"
        />
      ) : null}
    </g>
  );
}
