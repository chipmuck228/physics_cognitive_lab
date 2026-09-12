import { Card } from "@/components/common/Card";
import { SCENE_COPY } from "@/lib/content/microwave-bread";

interface MicrowaveCompleteViewProps {
  description: string;
  prediction: string;
  experiment: string;
  model: string;
  transfer: string;
  independent: string;
}

export function MicrowaveCompleteView({
  description,
  prediction,
  experiment,
  model,
  transfer,
  independent,
}: MicrowaveCompleteViewProps) {
  const review = [
    { id: "describe", label: "你刚才的说法", value: description },
    { id: "predict", label: "你的猜测", value: prediction },
    { id: "experiment", label: "这次对照", value: experiment },
    { id: "model", label: "你连起来的想法", value: model },
    { id: "transfer", label: "换个情况", value: transfer },
    { id: "independent", label: "独立挑战", value: independent },
  ];

  return (
    <div className="space-y-5" data-testid="microwave-complete">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl text-[var(--ink)]">{SCENE_COPY.completeTitle}</h2>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {SCENE_COPY.completeCaution}
        </p>
      </div>
      <Card className="space-y-4 p-5">
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
