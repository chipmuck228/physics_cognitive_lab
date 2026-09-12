import { ENGINE_VIEW, pistonTopY } from "./geometry";

interface EnginePistonProps {
  pistonPosition: number;
  direction: "up" | "down" | "held";
  label: string;
}

export function EnginePiston({
  pistonPosition,
  direction,
  label,
}: EnginePistonProps) {
  const y = pistonTopY(pistonPosition);
  const { cx, pistonHeight } = ENGINE_VIEW;
  const width = 116;

  return (
    <g
      data-testid="engine-piston"
      data-piston-direction={direction}
      data-piston-held={direction === "held" ? "true" : "false"}
      transform={`translate(0 ${y})`}
    >
      <title>{label}</title>
      <rect
        x={cx - width / 2}
        y={0}
        width={width}
        height={pistonHeight}
        rx="5"
        fill="#b7aea0"
        stroke="#5f574e"
        strokeWidth="2"
      />
      <rect
        x={cx - width / 2 + 6}
        y={8}
        width={width - 12}
        height={10}
        rx="2"
        fill="#9c9488"
      />
      <rect
        x={cx - width / 2 + 6}
        y={22}
        width={width - 12}
        height={8}
        rx="2"
        fill="#9c9488"
      />
      <circle cx={cx} cy={pistonHeight - 10} r="6" fill="#6f675e" />
      <text
        x={cx}
        y={pistonHeight / 2 + 4}
        textAnchor="middle"
        fill="#3f3a35"
        fontSize="11"
        fontWeight="600"
      >
        {label}
      </text>
    </g>
  );
}
