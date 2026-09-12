import { Card } from "@/components/common/Card";
import { StudentInput } from "@/components/learning/StudentInput";
import { VocabularyChips } from "@/components/learning/VocabularyChips";
import { SCENE_COPY } from "@/lib/content/microwave-bread";

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
        placeholder={SCENE_COPY.explainPlaceholder}
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        submitLabel={SCENE_COPY.explainSubmit}
        minLength={12}
      />
      <VocabularyChips
        label={SCENE_COPY.physicsWords}
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
