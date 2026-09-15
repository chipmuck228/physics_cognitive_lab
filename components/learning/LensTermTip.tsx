import { LENS_VOCAB } from "@/lib/content/convex-lens-optical-bench";

export type LensVocabId = keyof typeof LENS_VOCAB;

interface LensTermTipProps {
  termId: LensVocabId;
}

export function LensTermTip({ termId }: LensTermTipProps) {
  const item = LENS_VOCAB[termId];
  return (
    <div
      className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2"
      data-testid={`lens-vocab-${termId}`}
    >
      <p className="text-sm font-medium text-[var(--ink)]">{item.term}</p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">{item.body}</p>
    </div>
  );
}

interface LensVocabRowProps {
  terms: readonly LensVocabId[];
}

export function LensVocabRow({ terms }: LensVocabRowProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-3" data-testid="lens-vocab-row">
      {terms.map((termId) => (
        <LensTermTip key={termId} termId={termId} />
      ))}
    </div>
  );
}
