import { Card } from "@/components/common/Card";
import {
  SAMPLES_COPY,
  SAMPLES_EXPERIMENT_TITLES,
} from "@/lib/content/equal-volume-material-samples";
import {
  SAMPLES_EXPERIMENT_A,
  SAMPLES_EXPERIMENT_B,
  SAMPLES_EXPERIMENT_C,
} from "@/lib/physics/equal-volume-material-samples";

interface SamplesEvidenceDrawerProps {
  sameVolume: string;
  sameMass: string;
  cut: string;
}

export function SamplesEvidenceDrawer({
  sameVolume,
  sameMass,
  cut,
}: SamplesEvidenceDrawerProps) {
  const rows = [
    { id: SAMPLES_EXPERIMENT_A, title: SAMPLES_EXPERIMENT_TITLES[SAMPLES_EXPERIMENT_A], value: sameVolume },
    { id: SAMPLES_EXPERIMENT_B, title: SAMPLES_EXPERIMENT_TITLES[SAMPLES_EXPERIMENT_B], value: sameMass },
    { id: SAMPLES_EXPERIMENT_C, title: SAMPLES_EXPERIMENT_TITLES[SAMPLES_EXPERIMENT_C], value: cut },
  ];

  return (
    <Card className="space-y-3 p-4" data-testid="samples-evidence-drawer">
      <p className="text-sm font-medium text-[var(--ink)]">
        {SAMPLES_COPY.explainEvidenceTitle}
      </p>
      {rows.map((row) => (
        <div key={row.id} className="space-y-1">
          <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">{row.title}</p>
          <p className="text-sm leading-relaxed text-[var(--ink)]">
            {row.value || "还没有记下。"}
          </p>
        </div>
      ))}
    </Card>
  );
}
