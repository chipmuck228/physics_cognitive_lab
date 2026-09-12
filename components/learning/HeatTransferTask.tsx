import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  HEAT_COPY,
  HEAT_ICE_CONDITION_PROBES,
  HEAT_TRANSFER_RELATIONS,
} from "@/lib/content/equal-mass-heated-samples";
import type { HeatTransferJudgment } from "@/lib/learning/heat-transfer";
import { TransferMode } from "@/types/physics-model";

interface HeatTransferTaskProps {
  targetId: string;
  scenario: string;
  transferMode: typeof TransferMode.FULL_MODEL | typeof TransferMode.BOUNDARY_CONTRAST;
  judgments: Record<string, HeatTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  conditionChecks: Record<string, string>;
  feedback?: string | null;
  needMore: boolean;
  hints: string[];
  canRevealHint: boolean;
  onJudgmentChange: (relationId: string, judgment: HeatTransferJudgment) => void;
  onSurfaceCueChange: (selected: boolean) => void;
  onConditionCheckChange: (probeId: string, value: string) => void;
  onExplanationChange: (value: string) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
}

export function HeatTransferTask({
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
}: HeatTransferTaskProps) {
  const question =
    transferMode === TransferMode.BOUNDARY_CONTRAST
      ? HEAT_COPY.transferBoundaryQuestion
      : HEAT_COPY.transferFullQuestion;

  return (
    <div className="space-y-4" data-testid="heat-transfer-task" data-target={targetId}>
      <p className="text-sm font-medium leading-relaxed text-[var(--ink)]">{question}</p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{scenario}</p>

      <Card className="space-y-4 p-4">
        {transferMode === TransferMode.BOUNDARY_CONTRAST ? (
          <div className="space-y-4" data-testid="heat-ice-condition-probes">
            <p className="text-sm font-medium text-[var(--ink)]">
              {HEAT_COPY.iceConditionTitle}
            </p>
            {HEAT_ICE_CONDITION_PROBES.map((probe) => (
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
                      name={`heat-ice-condition-${probe.id}`}
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
        {HEAT_TRANSFER_RELATIONS.map((relation) => (
          <fieldset key={relation.id} className="space-y-2">
            <legend className="text-sm font-medium text-[var(--ink)]">
              {relation.label}
            </legend>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]">
              <input
                type="radio"
                name={`heat-transfer-${relation.id}`}
                checked={judgments[relation.id] === "applies"}
                onChange={() => onJudgmentChange(relation.id, "applies")}
                className="mt-1"
                aria-label={`${relation.label} ${HEAT_COPY.transferApplies}`}
              />
              <span>{HEAT_COPY.transferApplies}</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]">
              <input
                type="radio"
                name={`heat-transfer-${relation.id}`}
                checked={judgments[relation.id] === "not-necessarily"}
                onChange={() => onJudgmentChange(relation.id, "not-necessarily")}
                className="mt-1"
                aria-label={`${relation.label} ${HEAT_COPY.transferNotNecessarily}`}
              />
              <span>{HEAT_COPY.transferNotNecessarily}</span>
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
          <span>{HEAT_COPY.transferSurfaceCue}</span>
        </label>

        <div className="space-y-2">
          <label
            htmlFor="heat-transfer-text"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {HEAT_COPY.transferOwnWords}
          </label>
          <textarea
            id="heat-transfer-text"
            value={studentExplanation}
            onChange={(event) => onExplanationChange(event.target.value)}
            placeholder={HEAT_COPY.transferPlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
          />
        </div>
        {needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">{HEAT_COPY.transferNeedMore}</p>
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
          {canRevealHint ? (
            <Button variant="secondary" onClick={onRevealHint}>
              {HEAT_COPY.hintAsk}
            </Button>
          ) : null}
          <Button onClick={onSubmit}>{HEAT_COPY.transferSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}
