interface EngineValveProps {
  side: "intake" | "exhaust";
  open: boolean;
  name: string;
  openLabel: string;
  closedLabel: string;
}

export function EngineValve({
  side,
  open,
  name,
  openLabel,
  closedLabel,
}: EngineValveProps) {
  const isIntake = side === "intake";
  const x = isIntake ? 58 : 302;
  const stemX = isIntake ? 118 : 242;
  const lift = open ? -20 : 0;
  const stateLabel = open ? openLabel : closedLabel;

  return (
    <g
      data-valve={side}
      data-valve-open={open ? "true" : "false"}
      aria-label={`${name}：${stateLabel}`}
    >
      <title>{`${name}：${stateLabel}`}</title>
      <path
        d={
          isIntake
            ? "M48 58 H118 V78 H70 Q48 78 48 58 Z"
            : "M242 78 H310 Q312 78 312 58 H242 V78 Z"
        }
        fill={open ? "#d7ece7" : "#d8d0c4"}
        stroke="#8d8478"
        strokeWidth="2"
      />
      <g transform={`translate(0 ${lift})`}>
        <rect
          x={stemX - 4}
          y={28}
          width="8"
          height="48"
          rx="2"
          fill="#7a7268"
        />
        <ellipse
          cx={stemX}
          cy={76}
          rx="16"
          ry="7"
          fill="#5f574e"
          stroke="#3f3a35"
          strokeWidth="1.5"
        />
      </g>
      {open ? (
        <polygon
          points={
            isIntake
              ? "58,64 74,64 74,58 88,70 74,82 74,76 58,76"
              : "302,64 286,64 286,58 272,70 286,82 286,76 302,76"
          }
          fill="#4f7d76"
        />
      ) : (
        <line
          x1={isIntake ? 70 : 246}
          y1={78}
          x2={isIntake ? 118 : 310}
          y2={78}
          stroke="#3f3a35"
          strokeWidth="3"
        />
      )}
      <text
        x={x}
        y={20}
        textAnchor="middle"
        fill="#efe8dc"
        fontSize="11"
        fontWeight="600"
      >
        {name}
      </text>
      <text
        x={x}
        y={114}
        textAnchor="middle"
        fill="#cfc6ba"
        fontSize="10"
      >
        {stateLabel}
      </text>
    </g>
  );
}
