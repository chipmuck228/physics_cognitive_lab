import { Button } from "@/components/common/Button";

interface VocabularyChipsProps {
  label: string;
  words: readonly string[];
  onSelect: (word: string) => void;
}

export function VocabularyChips({
  label,
  words,
  onSelect,
}: VocabularyChipsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-muted)]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {words.map((word) => (
          <Button
            key={word}
            variant="secondary"
            className="h-9 rounded-full px-3 text-xs"
            onClick={() => onSelect(word)}
          >
            {word}
          </Button>
        ))}
      </div>
    </div>
  );
}
