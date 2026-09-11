import { Card } from "@/components/common/Card";
import { StudentInput } from "@/components/learning/StudentInput";
import { VocabularyChips } from "@/components/learning/VocabularyChips";

interface ExplanationPanelProps {
  prompt: string;
  question: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  feedback?: string | null;
  words: readonly string[];
  onSelectWord: (word: string) => void;
}

export function ExplanationPanel({
  prompt,
  question,
  value,
  onChange,
  onSubmit,
  feedback,
  words,
  onSelectWord,
}: ExplanationPanelProps) {
  return (
    <div className="space-y-4">
      <StudentInput
        label={question}
        prompt={prompt}
        placeholder="For example: Energy entered the bread, so its internal energy changed and its temperature increased."
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        submitLabel="Save explanation"
        minLength={12}
      />
      <VocabularyChips
        label="Useful physics words"
        words={words}
        onSelect={onSelectWord}
      />
      {feedback ? (
        <Card className="p-4">
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{feedback}</p>
        </Card>
      ) : null}
    </div>
  );
}
