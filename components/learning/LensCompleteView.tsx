import { Card } from "@/components/common/Card";
import { LENS_COMPLETE_COPY } from "@/lib/content/convex-lens-optical-bench";

interface LensCompleteViewProps {
  prediction: string;
  experiment: string;
  model: string;
  transfer: string;
  independent: string;
}

export function LensCompleteView({
  prediction,
  experiment,
  model,
  transfer,
  independent,
}: LensCompleteViewProps) {
  const review = [
    { id: "predict", label: "你的预测", value: prediction },
    { id: "experiment", label: "你对照的结果", value: experiment },
    { id: "model", label: "你建构的光路", value: model },
    { id: "transfer", label: "换个样子以后", value: transfer },
    { id: "independent", label: "自己做的两题", value: independent },
  ];

  return (
    <div className="space-y-5" data-testid="lens-complete">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl text-[var(--ink)]">{LENS_COMPLETE_COPY.title}</h2>
        <p className="text-sm leading-relaxed">{LENS_COMPLETE_COPY.body}</p>
      </div>
      <Card className="space-y-4 p-5" data-testid="lens-complete-review">
        <p className="text-sm font-medium">你留下的痕迹</p>
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
