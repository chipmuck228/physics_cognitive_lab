import type { LensExamDiagramSpec } from "@/lib/learning/lens-exam-diagram";

interface LensExamDiagramProps {
  spec: LensExamDiagramSpec;
  caption?: string;
}

export function LensExamDiagram({ spec, caption }: LensExamDiagramProps) {
  const { layout } = spec;
  return (
    <figure
      className="space-y-2"
      data-testid="lens-exam-diagram"
      data-pattern={spec.patternId}
      data-object-station={spec.objectStation}
      data-shows-image={String(spec.showImage)}
      data-shows-rays={String(spec.showRays)}
      data-shows-screen={String(spec.showScreen)}
      data-screen-region={spec.screenRegion}
      data-object-x={String(layout.objectX)}
      data-screen-x={String(layout.screenX)}
    >
      <svg
        viewBox="0 0 560 168"
        className="w-full rounded-xl border border-[var(--line)] bg-white"
        role="img"
        aria-label="光具座示意图：物体在 2F 以外，另一侧光屏放在 F 和 2F 之间。图上没有画出像。"
      >
        <line x1="24" y1="84" x2="536" y2="84" stroke="currentColor" strokeWidth="1.5" />
        <text x="28" y="76" className="fill-current text-[10px]">
          主光轴
        </text>
        <ellipse
          cx={layout.lensX}
          cy="84"
          rx="10"
          ry="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text x={layout.lensX - 22} y="140" className="fill-current text-[11px]">
          凸透镜
        </text>
        <Tick x={layout.left2F} label="2F" />
        <Tick x={layout.leftF} label="F" />
        <Tick x={layout.rightF} label="F" />
        <Tick x={layout.right2F} label="2F" />
        <line
          x1={layout.objectX}
          y1="84"
          x2={layout.objectX}
          y2="36"
          stroke="currentColor"
          strokeWidth="2"
        />
        <polygon
          points={`${layout.objectX},28 ${layout.objectX - 6},42 ${layout.objectX + 6},42`}
          fill="currentColor"
        />
        <text x={layout.objectX - 24} y="156" className="fill-current text-[11px]">
          物体
        </text>
        {spec.showScreen ? (
          <>
            <rect
              x={layout.screenX}
              y="40"
              width={layout.screenWidth}
              height="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <text x={layout.screenX - 18} y="156" className="fill-current text-[11px]">
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
