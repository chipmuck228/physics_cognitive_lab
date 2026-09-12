import { ENGINE_VIEW } from "./geometry";

interface EngineCrankshaftProps {
  pin: { x: number; y: number };
  moving: boolean;
  label: string;
}

export function EngineCrankshaft({ pin, moving, label }: EngineCrankshaftProps) {
  const { crankCx, crankCy, crankRadius } = ENGINE_VIEW;

  return (
    <g data-crankshaft-moving={moving ? "true" : "false"}>
      <title>{label}</title>
      <circle
        cx={crankCx}
        cy={crankCy}
        r={crankRadius + 18}
        fill="#cfc6ba"
        stroke="#6a6258"
        strokeWidth="3"
      />
      <circle
        cx={crankCx}
        cy={crankCy}
        r={crankRadius + 8}
        fill="none"
        stroke="#8d8478"
        strokeWidth="2"
        strokeDasharray={moving ? "0" : "4 5"}
      />
      <line
        x1={crankCx}
        y1={crankCy}
        x2={pin.x}
        y2={pin.y}
        stroke="#5f574e"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx={crankCx} cy={crankCy} r="8" fill="#4d4741" />
      <circle cx={pin.x} cy={pin.y} r="7" fill="#4d4741" stroke="#ece6db" strokeWidth="2" />
      <text
        x={crankCx}
        y={crankCy + crankRadius + 36}
        textAnchor="middle"
        fill="#cfc6ba"
        fontSize="12"
      >
        {label}
      </text>
    </g>
  );
}
