import { Card } from "@/components/common/Card";
import { CART_COPY } from "@/lib/content/horizontal-force-cart";

interface CartEvidenceDrawerProps {
  title?: string;
  same?: string | null;
  opposite?: string | null;
  zero?: string | null;
}

export function CartEvidenceDrawer({
  title = CART_COPY.explainEvidenceTitle,
  same,
  opposite,
  zero,
}: CartEvidenceDrawerProps) {
  return (
    <Card className="space-y-2 p-4" data-testid="cart-evidence-drawer">
      <p className="text-sm font-medium text-[var(--ink)]">{title}</p>
      <EvidenceLine label={CART_COPY.experimentATitle} text={same} />
      <EvidenceLine label={CART_COPY.experimentBTitle} text={opposite} />
      <EvidenceLine label={CART_COPY.experimentCTitle} text={zero} />
    </Card>
  );
}

function EvidenceLine({ label, text }: { label: string; text?: string | null }) {
  return (
    <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
      {label}
      {text ? <span className="text-[var(--ink)]">：{text}</span> : "：还没有记下。"}
    </p>
  );
}
