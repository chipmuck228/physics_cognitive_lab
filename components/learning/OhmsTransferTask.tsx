import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  OHMS_COPY,
  OHMS_FILAMENT_PROBES,
  OHMS_TRANSFER_RELATIONS,
} from "@/lib/content/simple-resistor-circuit";
import type { OhmsTransferJudgment } from "@/lib/learning/ohms-transfer";
import { TransferMode } from "@/types/physics-model";

interface OhmsTransferTaskProps {
  targetId: string;
  scenario: string;
  transferMode: typeof TransferMode.FULL_MODEL | typeof TransferMode.BOUNDARY_CONTRAST;
  judgments: Record<string, OhmsTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  conditionChecks: Record<string, string>;
  feedback?: string | null;
  needMore: boolean;
  hints: string[];
  canRevealHint: boolean;
  onJudgmentChange: (relationId: string, judgment: OhmsTransferJudgment) => void;
  onSurfaceCueChange: (selected: boolean) => void;
  onConditionCheckChange: (probeId: string, value: string) => void;
  onExplanationChange: (value: string) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
}

export function OhmsTransferTask({
  targetId,
  scenario,
  transferMode,
  judgments,
  surfaceCueSelected,
  studentExplanation,
  conditionChecks,
  feedback,
  needMore,
  hints,
  canRevealHint,
  onJudgmentChange,
  onSurfaceCueChange,
  onConditionCheckChange,
  onExplanationChange,
  onSubmit,
  onRevealHint,
}: OhmsTransferTaskProps) {
  const question =
    transferMode === TransferMode.BOUNDARY_CONTRAST
      ? OHMS_COPY.transferBoundaryQuestion
      : OHMS_COPY.transferFullQuestion;

  return (
    <div className="space-y-4" data-testid="ohms-transfer-task" data-target={targetId}>
      <p className="text-sm font-medium leading-relaxed text-[var(--ink)]">{question}</p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{scenario}</p>
      <Card className="space-y-4 p-4">
        {transferMode === TransferMode.BOUNDARY_CONTRAST ? (
          <div className="space-y-4" data-testid="ohms-filament-condition-probes">
            {OHMS_FILAMENT_PROBES.map((probe) => (
              <fieldset key={probe.id} className="space-y-2">
                <legend className="text-sm font-medium text-[var(--ink)]">
                  {probe.prompt}
                </legend>
                {probe.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
                  >
                    <input
                      type="radio"
                      name={`ohms-filament-${probe.id}`}
                      checked={conditionChecks[probe.id] === option.value}
                      onChange={() => onConditionCheckChange(probe.id, option.value)}
                      className="mt-1"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>
            ))}
          </div>
        ) : null}
        {OHMS_TRANSFER_RELATIONS.map((relation) => (
          <fieldset key={relation.id} className="space-y-2">
            <legend className="text-sm font-medium text-[var(--ink)]">
              {relation.label}
            </legend>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="radio"
                name={`ohms-transfer-${relation.id}`}
                checked={judgments[relation.id] === "applies"}
                onChange={() => onJudgmentChange(relation.id, "applies")}
                className="mt-1"
                aria-label={`${relation.label} ${OHMS_COPY.transferApplies}`}
              />
              <span>{OHMS_COPY.transferApplies}</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="radio"
                name={`ohms-transfer-${relation.id}`}
                checked={judgments[relation.id] === "not-necessarily"}
                onChange={() => onJudgmentChange(relation.id, "not-necessarily")}
                className="mt-1"
                aria-label={`${relation.label} ${OHMS_COPY.transferNotNecessarily}`}
              />
              <span>{OHMS_COPY.transferNotNecessarily}</span>
            </label>
          </fieldset>
        ))}
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={surfaceCueSelected}
            onChange={(event) => onSurfaceCueChange(event.target.checked)}
          />
          <span>{OHMS_COPY.transferSurfaceCue}</span>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">{OHMS_COPY.transferOwnWords}</span>
          <textarea
            id="ohms-transfer-text"
            data-testid="ohms-transfer-text"
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
            value={studentExplanation}
            onChange={(event) => onExplanationChange(event.target.value)}
          />
        </label>
        {needMore ? (
          <ValidationMessage kind="missing">{OHMS_COPY.transferNeedMore}</ValidationMessage>
        ) : null}
        {feedback ? <ValidationMessage kind="incorrect">{feedback}</ValidationMessage> : null}
        {hints.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--ink-muted)]">
            {hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap justify-end gap-3">
          {canRevealHint ? (
            <Button variant="secondary" onClick={onRevealHint}>
              给我一个台阶
            </Button>
          ) : null}
          <Button onClick={onSubmit}>{OHMS_COPY.transferSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}
