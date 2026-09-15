import { LENS_VOCAB } from "@/lib/content/convex-lens-optical-bench";

export type LensVocabId = keyof typeof LENS_VOCAB;

interface LensTermTipProps {
  termId: LensVocabId;
}

export function LensTermTip({ termId }: LensTermTipProps) {
  const item = LENS_VOCAB[termId];
  return (
    <p className="text-sm leading-relaxed text-[var(--ink)]" data-testid={`lens-vocab-${termId}`}>
      <span className="font-medium">{item.term}</span>
      <span className="text-[var(--ink-muted)]">{` · ${item.body}`}</span>
    </p>
  );
}

interface LensVocabRowProps {
  terms: readonly LensVocabId[];
}

export function LensVocabRow({ terms }: LensVocabRowProps) {
  return (
    <div className="space-y-1.5" data-testid="lens-vocab-row">
      {terms.map((termId) => (
        <LensTermTip key={termId} termId={termId} />
      ))}
    </div>
  );
}
