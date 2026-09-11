import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { SCENE_COPY } from "@/lib/content/microwave-bread";

interface ExperimentEvidencePanelProps {
  comparison: string;
  reflection: string;
  onComparisonChange: (value: string) => void;
  onReflectionChange: (value: string) => void;
  onSubmit: () => void;
}

export function ExperimentEvidencePanel({
  comparison,
  reflection,
  onComparisonChange,
  onReflectionChange,
  onSubmit,
}: ExperimentEvidencePanelProps) {
  const canSubmit =
    comparison.trim().length >= 8 && reflection.trim().length >= 8;

  return (
    <Card className="space-y-5 p-4">
      <div className="space-y-2">
        <label
          htmlFor="prediction-comparison"
          className="text-sm font-medium text-[var(--ink)]"
        >
          {SCENE_COPY.experimentCompareQuestion}
        </label>
        <textarea
          id="prediction-comparison"
          value={comparison}
          onChange={(event) => onComparisonChange(event.target.value)}
          placeholder="Say whether the result matched your prediction, and what was different."
          className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="experiment-reflection"
          className="text-sm font-medium text-[var(--ink)]"
        >
          {SCENE_COPY.experimentReflectionQuestion}
        </label>
        <textarea
          id="experiment-reflection"
          value={reflection}
          onChange={(event) => onReflectionChange(event.target.value)}
          placeholder="Write a short reflection on what the experiment showed."
          className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--ink-muted)]">
          Compare the actual result with your prediction before explaining.
        </p>
        <Button onClick={onSubmit} disabled={!canSubmit}>
          {SCENE_COPY.experimentSubmit}
        </Button>
      </div>
    </Card>
  );
}
