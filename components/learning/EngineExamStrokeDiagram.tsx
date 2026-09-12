export function EngineExamStrokeDiagram() {
  return (
    <figure
      className="rounded-xl border border-[var(--line)] bg-white p-4"
      data-testid="engine-exam-diagram"
    >
      <svg
        viewBox="0 0 640 170"
        role="img"
        aria-label="吸气、压缩、燃烧膨胀、排气示意图"
        className="h-auto w-full"
      >
        <ExamStrokeCell
          x={16}
          label="吸气"
          pistonY={78}
          intakeOpen
          note="空气进入"
        />
        <ExamStrokeCell
          x={168}
          label="压缩"
          pistonY={42}
          note="气体被压紧"
        />
        <ExamStrokeCell
          x={320}
          label="燃烧膨胀"
          pistonY={78}
          combustion
          note="气体推动活塞"
        />
        <ExamStrokeCell
          x={472}
          label="排气"
          pistonY={42}
          exhaustOpen
          note="废气离开"
        />
      </svg>
      <figcaption className="mt-2 text-center text-xs text-[var(--ink-muted)]">
        示意图：机械能主要在哪一步、通过什么过程得到？
      </figcaption>
    </figure>
  );
}

function ExamStrokeCell({
  x,
  label,
  pistonY,
  intakeOpen = false,
  exhaustOpen = false,
  combustion = false,
  note,
}: {
  x: number;
  label: string;
  pistonY: number;
  intakeOpen?: boolean;
  exhaustOpen?: boolean;
  combustion?: boolean;
  note: string;
}) {
  return (
    <g transform={`translate(${x} 8)`}>
      <rect
        x={0}
        y={18}
        width={136}
        height={118}
        rx={6}
        fill="#f8f6f1"
        stroke="#cfc6b8"
      />
      <text
        x={68}
        y={14}
        textAnchor="middle"
        fontSize={13}
        fill="#3f3a32"
      >
        {label}
      </text>
      <rect
        x={38}
        y={32}
        width={60}
        height={70}
        fill="#fff"
        stroke="#8c8376"
      />
      <rect x={50} y={pistonY} width={36} height={10} fill="#6d6558" />
      <line
        x1={68}
        y1={pistonY + 10}
        x2={68}
        y2={102}
        stroke="#6d6558"
        strokeWidth={3}
      />
      <rect
        x={46}
        y={28}
        width={12}
        height={6}
        fill={intakeOpen ? "#3f3a32" : "#cfc6b8"}
      />
      <rect
        x={78}
        y={28}
        width={12}
        height={6}
        fill={exhaustOpen ? "#3f3a32" : "#cfc6b8"}
      />
      {combustion ? (
        <circle cx={68} cy={58} r={8} fill="#d97746" opacity={0.85} />
      ) : null}
      <text
        x={68}
        y={122}
        textAnchor="middle"
        fontSize={11}
        fill="#6d6558"
      >
        {note}
      </text>
    </g>
  );
}
