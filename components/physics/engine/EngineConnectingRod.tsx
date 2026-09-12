interface EngineConnectingRodProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  label: string;
}

export function EngineConnectingRod({
  from,
  to,
  label,
}: EngineConnectingRodProps) {
  return (
    <g>
      <title>{label}</title>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="#6a6258"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="#cfc6ba"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}
