import { Card } from "@/components/common/Card";
import { HEAT_COMPLETE_COPY } from "@/lib/content/equal-mass-heated-samples";

interface HeatCompleteViewProps {
  prediction: string;
  experiment: string;
  model: string;
  transfer: string;
  independent: string;
}

export function HeatCompleteView({
  prediction,
  experiment,
  model,
  transfer,
  independent,
}: HeatCompleteViewProps) {
  const review = [
    { id: "predict", label: "你的预测", value: prediction },
    { id: "experiment", label: "实验结果", value: experiment },
    { id: "model", label: "你建立的关系", value: model },
    { id: "transfer", label: "你完成的迁移", value: transfer },
    { id: "independent", label: "独立挑战", value: independent },
  ];

  return (
    <div className="space-y-5" data-testid="heat-complete">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl text-[var(--ink)]">{HEAT_COMPLETE_COPY.title}</h2>
        <p className="text-sm leading-relaxed text-[var(--ink)]">{HEAT_COMPLETE_COPY.body}</p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {HEAT_COMPLETE_COPY.noMastery}
        </p>
      </div>

      <Card className="space-y-4 p-5" data-testid="heat-complete-review">
        <p className="text-sm font-medium text-[var(--ink)]">回头看看</p>
        {review.map((item) => (
          <div key={item.id} className="space-y-1">
            <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">{item.label}</p>
            <p className="text-sm leading-relaxed text-[var(--ink)]">{item.value}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
