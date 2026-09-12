import { Card } from "@/components/common/Card";

export interface LookbackCompleteCopy {
  title: string;
  caution: string;
  theme: string;
  demonstratedTitle: string;
  demonstrated: readonly string[];
  reviewTitle: string;
}

export interface LookbackCompleteItem {
  id: string;
  label: string;
  value: string;
}

interface LookbackCompleteViewProps {
  copy: LookbackCompleteCopy;
  review: readonly LookbackCompleteItem[];
  testId: string;
  reviewTestId: string;
}

export function LookbackCompleteView({
  copy,
  review,
  testId,
  reviewTestId,
}: LookbackCompleteViewProps) {
  return (
    <div className="space-y-5" data-testid={testId}>
      <div className="space-y-2">
        <h2 className="font-serif text-3xl text-[var(--ink)]">{copy.title}</h2>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{copy.caution}</p>
        <p className="text-sm leading-relaxed text-[var(--ink)]">{copy.theme}</p>
      </div>

      <Card className="space-y-3 p-5">
        <p className="text-sm font-medium text-[var(--ink)]">{copy.demonstratedTitle}</p>
        <ul className="space-y-2">
          {copy.demonstrated.map((item) => (
            <li key={item} className="text-sm leading-relaxed text-[var(--ink)]">
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-4 p-5" data-testid={reviewTestId}>
        <p className="text-sm font-medium text-[var(--ink)]">{copy.reviewTitle}</p>
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
