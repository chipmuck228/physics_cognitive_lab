import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  SAMPLES_COPY,
  SAMPLES_TRANSFER_RELATIONS,
} from "@/lib/content/equal-volume-material-samples";
import type { SamplesTransferJudgment } from "@/lib/learning/samples-transfer";
import { TransferMode } from "@/types/physics-model";

interface SamplesTransferTaskProps {
  targetId: string;
  scenario: string;
  transferMode: typeof TransferMode.FULL_MODEL | typeof TransferMode.BOUNDARY_CONTRAST;
  judgments: Record<string, SamplesTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  feedback?: string | null;
  needMore: boolean;
  hints: string[];
  canRevealHint: boolean;
  canRetryMedium: boolean;
  onJudgmentChange: (relationId: string, judgment: SamplesTransferJudgment) => void;
  onSurfaceCueChange: (selected: boolean) => void;
  onExplanationChange: (value: string) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
  onRetryMedium: () => void;
}

export function SamplesTransferTask({
  targetId,
  scenario,
  transferMode,
  judgments,
  surfaceCueSelected,
  studentExplanation,
  feedback,
  needMore,
  hints,
  canRevealHint,
  canRetryMedium,
  onJudgmentChange,
  onSurfaceCueChange,
  onExplanationChange,
  onSubmit,
  onRevealHint,
  onRetryMedium,
}: SamplesTransferTaskProps) {
  const question =
    transferMode === TransferMode.BOUNDARY_CONTRAST
      ? SAMPLES_COPY.transferBoundaryQuestion
      : SAMPLES_COPY.transferFullQuestion;

  return (
    <div className="space-y-4" data-testid="samples-transfer-task" data-target={targetId}>
      <p className="text-sm font-medium leading-relaxed text-[var(--ink)]">{question}</p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{scenario}</p>

      <Card className="space-y-4 p-4">
        {SAMPLES_TRANSFER_RELATIONS.map((relation) => (
          <fieldset key={relation.id} className="space-y-2">
            <legend className="text-sm font-medium text-[var(--ink)]">
              {relation.label}
            </legend>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]">
              <input
                type="radio"
                name={`samples-transfer-${relation.id}`}
                checked={judgments[relation.id] === "applies"}
                onChange={() => onJudgmentChange(relation.id, "applies")}
                className="mt-1"
                aria-label={`${relation.label} ${SAMPLES_COPY.transferApplies}`}
              />
              <span>{SAMPLES_COPY.transferApplies}</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]">
              <input
                type="radio"
                name={`samples-transfer-${relation.id}`}
                checked={judgments[relation.id] === "not-necessarily"}
                onChange={() => onJudgmentChange(relation.id, "not-necessarily")}
                className="mt-1"
                aria-label={`${relation.label} ${SAMPLES_COPY.transferNotNecessarily}`}
              />
              <span>{SAMPLES_COPY.transferNotNecessarily}</span>
            </label>
          </fieldset>
        ))}

        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]">
          <input
            type="checkbox"
            className="mt-1"
            checked={surfaceCueSelected}
            onChange={(event) => onSurfaceCueChange(event.target.checked)}
          />
          <span>{SAMPLES_COPY.transferSurfaceCue}</span>
        </label>

        <div className="space-y-2">
          <label
            htmlFor="samples-transfer-text"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {SAMPLES_COPY.transferOwnWords}
          </label>
          <textarea
            id="samples-transfer-text"
            value={studentExplanation}
            onChange={(event) => onExplanationChange(event.target.value)}
            placeholder={SAMPLES_COPY.transferPlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
        </div>
        {needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">{SAMPLES_COPY.transferNeedMore}</p>
        ) : null}
        {feedback ? (
          <p className="text-sm text-[var(--ink-muted)]">{feedback}</p>
        ) : null}
        {hints.length > 0 ? (
          <ul className="space-y-1">
            {hints.map((hint) => (
              <li key={hint} className="text-sm text-[var(--ink-muted)]">
                {hint}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap justify-end gap-3">
          {canRetryMedium ? (
            <Button variant="secondary" onClick={onRetryMedium}>
              {SAMPLES_COPY.transferMedium}
            </Button>
          ) : null}
          {canRevealHint ? (
            <Button variant="secondary" onClick={onRevealHint}>
              {SAMPLES_COPY.hintAsk}
            </Button>
          ) : null}
          <Button onClick={onSubmit}>{SAMPLES_COPY.transferSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}
