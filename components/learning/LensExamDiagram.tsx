import type { LensExamDiagramSpec } from "@/lib/learning/lens-exam-diagram";

interface LensExamDiagramProps {
  spec: LensExamDiagramSpec;
  caption?: string;
}

export function LensExamDiagram({ spec, caption }: LensExamDiagramProps) {
  return (
    <figure
      className="space-y-2"
      data-testid="lens-exam-diagram"
      data-pattern={spec.patternId}
      data-object-station={spec.objectStation}
      data-shows-image={String(spec.showImage)}
      data-shows-rays={String(spec.showRays)}
      data-shows-screen={String(spec.showScreen)}
    >
      <svg
        viewBox="0 0 560 168"
        className="w-full rounded-xl border border-[var(--line)] bg-white"
        role="img"
        aria-label="光具座示意图：物体在 2F 以外，另一侧有光屏。图上没有画出像。"
      >
        <line x1="24" y1="84" x2="536" y2="84" stroke="currentColor" strokeWidth="1.5" />
        <text x="28" y="76" className="fill-current text-[10px]">
          主光轴
        </text>
        <ellipse
          cx="280"
          cy="84"
          rx="10"
          ry="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text x="258" y="140" className="fill-current text-[11px]">
          凸透镜
        </text>
        <Tick x={196} label="2F" />
        <Tick x={238} label="F" />
        <Tick x={322} label="F" />
        <Tick x={364} label="2F" />
        <line x1="132" y1="84" x2="132" y2="36" stroke="currentColor" strokeWidth="2" />
        <polygon points="132,28 126,42 138,42" fill="currentColor" />
        <text x="108" y="156" className="fill-current text-[11px]">
          物体
        </text>
        {spec.showScreen ? (
          <>
            <rect
              x="448"
              y="40"
              width="10"
              height="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <text x="430" y="156" className="fill-current text-[11px]">
              光屏
            </text>
          </>
        ) : null}
      </svg>
      {caption ? (
        <figcaption className="text-xs text-[var(--ink-muted)]">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function Tick({ x, label }: { x: number; label: string }) {
  return (
    <g>
      <line x1={x} y1="76" x2={x} y2="92" stroke="currentColor" strokeWidth="1.5" />
      <text x={x - 8} y="108" className="fill-current text-[11px]">
        {label}
      </text>
    </g>
  );
}
