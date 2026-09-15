import { ENGINE_VOCAB } from "@/lib/content/four-stroke-engine";

export type EngineVocabId = keyof typeof ENGINE_VOCAB;

interface EngineTermTipProps {
  termId: EngineVocabId;
}

export function EngineTermTip({ termId }: EngineTermTipProps) {
  const item = ENGINE_VOCAB[termId];
  return (
    <p className="text-sm leading-relaxed text-[var(--ink)]" data-testid={`engine-vocab-${termId}`}>
      <span className="font-medium">{item.term}</span>
      <span className="text-[var(--ink-muted)]">{` · ${item.body}`}</span>
    </p>
  );
}

interface EngineVocabRowProps {
  terms: readonly EngineVocabId[];
}

export function EngineVocabRow({ terms }: EngineVocabRowProps) {
  return (
    <div className="space-y-1.5" data-testid="engine-vocab-row">
      {terms.map((termId) => (
        <EngineTermTip key={termId} termId={termId} />
      ))}
    </div>
  );
}
