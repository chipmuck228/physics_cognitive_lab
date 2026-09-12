import { Card } from "@/components/common/Card";
import { CART_COMPLETE_COPY } from "@/lib/content/horizontal-force-cart";

interface CartCompleteViewProps {
  prediction: string;
  experiment: string;
  model: string;
  transfer: string;
  independent: string;
}

export function CartCompleteView({
  prediction,
  experiment,
  model,
  transfer,
  independent,
}: CartCompleteViewProps) {
  const review = [
    { id: "predict", label: CART_COMPLETE_COPY.reviewPredict, value: prediction },
    { id: "experiment", label: CART_COMPLETE_COPY.reviewExperiment, value: experiment },
    { id: "model", label: CART_COMPLETE_COPY.reviewModel, value: model },
    { id: "transfer", label: CART_COMPLETE_COPY.reviewTransfer, value: transfer },
    { id: "independent", label: CART_COMPLETE_COPY.reviewIndependent, value: independent },
  ];

  return (
    <div className="space-y-5" data-testid="cart-complete">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl text-[var(--ink)]">{CART_COMPLETE_COPY.title}</h2>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {CART_COMPLETE_COPY.caution}
        </p>
        <p className="text-sm leading-relaxed text-[var(--ink)]">{CART_COMPLETE_COPY.theme}</p>
      </div>

      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-[var(--ink)]">
          {CART_COMPLETE_COPY.demonstratedTitle}
        </p>
        <ul className="space-y-2">
          {CART_COMPLETE_COPY.demonstrated.map((item) => (
            <li key={item} className="text-sm leading-relaxed text-[var(--ink)]">
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-4 p-5" data-testid="cart-complete-review">
        <p className="text-sm font-medium text-[var(--ink)]">{CART_COMPLETE_COPY.reviewTitle}</p>
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
