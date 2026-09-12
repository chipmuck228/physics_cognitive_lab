import { Card } from "@/components/common/Card";
import {
  HEAT_COPY,
  heatExperimentTitle,
} from "@/lib/content/equal-mass-heated-samples";
import {
  HEAT_EXPERIMENT_A,
  HEAT_EXPERIMENT_B,
  HEAT_EXPERIMENT_C,
} from "@/lib/physics/equal-mass-heated-samples";

interface HeatEvidenceDrawerProps {
  experimentA: string;
  experimentB: string;
  experimentC: string;
}

export function HeatEvidenceDrawer({
  experimentA,
  experimentB,
  experimentC,
}: HeatEvidenceDrawerProps) {
  const rows = [
    {
      id: HEAT_EXPERIMENT_A,
      title: heatExperimentTitle(HEAT_EXPERIMENT_A),
      value: experimentA,
    },
    {
      id: HEAT_EXPERIMENT_B,
      title: heatExperimentTitle(HEAT_EXPERIMENT_B),
      value: experimentB,
    },
    {
      id: HEAT_EXPERIMENT_C,
      title: heatExperimentTitle(HEAT_EXPERIMENT_C),
      value: experimentC,
    },
  ];

  return (
    <Card className="space-y-3 p-4" data-testid="heat-evidence-drawer">
      <p className="text-sm font-medium text-[var(--ink)]">
        {HEAT_COPY.explainEvidenceTitle}
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
