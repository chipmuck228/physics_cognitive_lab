import { Card } from "@/components/common/Card";
import { SAMPLES_COMPLETE_COPY } from "@/lib/content/equal-volume-material-samples";

interface SamplesCompleteViewProps {
  prediction: string;
  experiment: string;
  model: string;
  transfer: string;
  independent: string;
}

export function SamplesCompleteView({
  prediction,
  experiment,
  model,
  transfer,
  independent,
}: SamplesCompleteViewProps) {
  const review = [
    { id: "predict", label: SAMPLES_COMPLETE_COPY.reviewPredict, value: prediction },
    { id: "experiment", label: SAMPLES_COMPLETE_COPY.reviewExperiment, value: experiment },
    { id: "model", label: SAMPLES_COMPLETE_COPY.reviewModel, value: model },
    { id: "transfer", label: SAMPLES_COMPLETE_COPY.reviewTransfer, value: transfer },
    { id: "independent", label: SAMPLES_COMPLETE_COPY.reviewIndependent, value: independent },
  ];

  return (
    <div className="space-y-5" data-testid="samples-complete">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl text-[var(--ink)]">{SAMPLES_COMPLETE_COPY.title}</h2>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {SAMPLES_COMPLETE_COPY.caution}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink)]">{SAMPLES_COMPLETE_COPY.theme}</p>
      </div>

      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-[var(--ink)]">
          {SAMPLES_COMPLETE_COPY.demonstratedTitle}
        </p>
        <ul className="space-y-2">
          {SAMPLES_COMPLETE_COPY.demonstrated.map((item) => (
            <li key={item} className="text-sm leading-relaxed text-[var(--ink)]">
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-4 p-5" data-testid="samples-complete-review">
        <p className="text-sm font-medium text-[var(--ink)]">{SAMPLES_COMPLETE_COPY.reviewTitle}</p>
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
