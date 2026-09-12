import { Card } from "@/components/common/Card";
import { ENGINE_COPY } from "@/lib/content/four-stroke-engine";

interface EngineEvidenceDrawerProps {
  title?: string;
  evidenceA?: string | null;
  evidenceB?: string | null;
}

export function EngineEvidenceDrawer({
  title = ENGINE_COPY.explainEvidenceTitle,
  evidenceA,
  evidenceB,
}: EngineEvidenceDrawerProps) {
  return (
    <Card className="space-y-2 p-4" data-testid="engine-evidence-drawer">
      <p className="text-sm font-medium text-[var(--ink)]">{title}</p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {ENGINE_COPY.explainEvidenceA}
      </p>
      {evidenceA ? (
        <p className="text-sm leading-relaxed text-[var(--ink)]">你记下的：{evidenceA}</p>
      ) : null}
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {ENGINE_COPY.explainEvidenceB}
      </p>
      {evidenceB ? (
        <p className="text-sm leading-relaxed text-[var(--ink)]">你记下的：{evidenceB}</p>
      ) : null}
    </Card>
  );
}
