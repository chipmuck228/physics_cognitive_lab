import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { SCENE_COPY } from "@/lib/content/microwave-bread";
import type { TransferScenarioDefinition } from "@/lib/content/transfer-scenarios";

interface TransferScenarioProps {
  scenario: TransferScenarioDefinition;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  completedCount: number;
  totalCount: number;
  feedback?: string | null;
}

export function TransferScenario({
  scenario,
  value,
  onChange,
  onSubmit,
  completedCount,
  totalCount,
  feedback,
}: TransferScenarioProps) {
  const canSubmit = value.trim().length >= 8;

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4">
        <p className="text-xs font-medium tracking-[0.14em] text-[var(--ink-muted)]">
          {SCENE_COPY.situationN
            .replace("{n}", String(completedCount + 1))
            .replace("{total}", String(totalCount))}
        </p>
        <h2 className="font-serif text-xl text-[var(--ink)]">{scenario.title}</h2>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {scenario.situation}
        </p>
        <p className="text-sm font-medium text-[var(--ink)]">{scenario.prompt}</p>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
          {scenario.focus}
        </p>
      </Card>

      <Card className="space-y-4 p-4">
        <label htmlFor={`transfer-${scenario.id}`} className="text-sm font-medium text-[var(--ink)]">
          {SCENE_COPY.yourTake}
        </label>
        <textarea
          id={`transfer-${scenario.id}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={SCENE_COPY.transferPlaceholder}
          className="min-h-32 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[var(--ink-muted)]">{SCENE_COPY.transferHint}</p>
          <Button onClick={onSubmit} disabled={!canSubmit}>
            {SCENE_COPY.saveSituation}
          </Button>
        </div>
      </Card>

      {feedback ? (
        <Card className="p-4">
          <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{feedback}</p>
        </Card>
      ) : null}
    </div>
  );
}
