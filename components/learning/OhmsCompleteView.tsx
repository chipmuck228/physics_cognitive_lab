import { Card } from "@/components/common/Card";
import { OHMS_COMPLETE_COPY } from "@/lib/content/simple-resistor-circuit";

interface OhmsCompleteViewProps {
  prediction: string;
  experiment: string;
  model: string;
  transfer: string;
  independent: string;
}

export function OhmsCompleteView({
  prediction,
  experiment,
  model,
  transfer,
  independent,
}: OhmsCompleteViewProps) {
  const review = [
    { id: "predict", label: "你的预测", value: prediction },
    { id: "experiment", label: "你对照的结果", value: experiment },
    { id: "model", label: "你写出的关系", value: model },
    { id: "transfer", label: "换个样子以后", value: transfer },
    { id: "independent", label: "自己做的两题", value: independent },
  ];

  return (
    <div className="space-y-5" data-testid="ohms-complete">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl text-[var(--ink)]">{OHMS_COMPLETE_COPY.title}</h2>
        <p className="text-sm leading-relaxed">{OHMS_COMPLETE_COPY.body}</p>
      </div>
      <Card className="space-y-4 p-5" data-testid="ohms-complete-review">
        <p className="text-sm font-medium">回头看看</p>
        {review.map((item) => (
          <div key={item.id} className="space-y-1">
            <p className="text-xs tracking-[0.16em] text-[var(--ink-muted)]">{item.label}</p>
            <p className="text-sm leading-relaxed">{item.value}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
