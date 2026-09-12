import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  MICROWAVE_ICE_CONDITION_PROBES,
  MICROWAVE_KETTLE_CONDITION_PROBES,
  MICROWAVE_TASK_COPY,
  MICROWAVE_TRANSFER_RELATIONS,
  SCENE_COPY,
} from "@/lib/content/microwave-bread";
import type { MicrowaveTransferJudgment } from "@/lib/learning/microwave-transfer";
import { MICROWAVE_ICE_TARGET_ID } from "@/lib/learning/microwave-transfer";

interface MicrowaveTransferTaskProps {
  targetId: string;
  scenario: string;
  judgments: Record<string, MicrowaveTransferJudgment>;
  surfaceCueSelected: boolean;
  studentExplanation: string;
  conditionChecks: Record<string, string>;
  feedback?: string | null;
  needMore: boolean;
  onJudgmentChange: (relationId: string, judgment: MicrowaveTransferJudgment) => void;
  onSurfaceCueChange: (selected: boolean) => void;
  onConditionCheckChange: (probeId: string, value: string) => void;
  onExplanationChange: (value: string) => void;
  onSubmit: () => void;
}

export function MicrowaveTransferTask({
  targetId,
  scenario,
  judgments,
  surfaceCueSelected,
  studentExplanation,
  conditionChecks,
  feedback,
  needMore,
  onJudgmentChange,
  onSurfaceCueChange,
  onConditionCheckChange,
  onExplanationChange,
  onSubmit,
}: MicrowaveTransferTaskProps) {
  const isIce = targetId === MICROWAVE_ICE_TARGET_ID;
  const probes = isIce ? MICROWAVE_ICE_CONDITION_PROBES : MICROWAVE_KETTLE_CONDITION_PROBES;
  const question = isIce
    ? MICROWAVE_TASK_COPY.iceQuestion
    : MICROWAVE_TASK_COPY.kettleQuestion;

  return (
    <div className="space-y-4" data-testid="microwave-transfer-task" data-target={targetId}>
      <p className="text-sm font-medium leading-relaxed text-[var(--ink)]">{question}</p>
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{scenario}</p>
      <Card className="space-y-4 p-4">
        <div className="space-y-4" data-testid="microwave-transfer-probes">
          {probes.map((probe) => (
            <fieldset key={probe.id} className="space-y-2">
              <legend className="text-sm font-medium text-[var(--ink)]">{probe.prompt}</legend>
              {probe.options.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]"
                >
                  <input
                    type="radio"
                    name={`microwave-transfer-${probe.id}`}
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
        {MICROWAVE_TRANSFER_RELATIONS.map((relation) => (
          <fieldset key={relation.id} className="space-y-2">
            <legend className="text-sm font-medium text-[var(--ink)]">{relation.label}</legend>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]">
              <input
                type="radio"
                name={`microwave-transfer-rel-${relation.id}`}
                checked={judgments[relation.id] === "applies"}
                onChange={() => onJudgmentChange(relation.id, "applies")}
                className="mt-1"
                aria-label={`${relation.label}：在这里还能用`}
              />
              <span>在这里还能用</span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]">
              <input
                type="radio"
                name={`microwave-transfer-rel-${relation.id}`}
                checked={judgments[relation.id] === "not-necessarily"}
                onChange={() => onJudgmentChange(relation.id, "not-necessarily")}
                className="mt-1"
                aria-label={`${relation.label}：不能原样搬过来`}
              />
              <span>不能原样搬过来</span>
            </label>
          </fieldset>
        ))}
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--ink)]">
          <input
            type="checkbox"
            checked={surfaceCueSelected}
            onChange={(event) => onSurfaceCueChange(event.target.checked)}
            className="mt-1"
          />
          <span>{MICROWAVE_TASK_COPY.transferSurfaceCue}</span>
        </label>
        <div className="space-y-2">
          <label
            htmlFor="microwave-transfer-text"
            className="text-sm font-medium text-[var(--ink)]"
          >
            {SCENE_COPY.yourTake}
          </label>
          <textarea
            id="microwave-transfer-text"
            value={studentExplanation}
            onChange={(event) => onExplanationChange(event.target.value)}
            placeholder={SCENE_COPY.transferPlaceholder}
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none"
          />
        </div>
        {needMore ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {MICROWAVE_TASK_COPY.transferNeedMore}
          </p>
        ) : null}
        {feedback ? <p className="text-sm text-[var(--ink-muted)]">{feedback}</p> : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{SCENE_COPY.saveSituation}</Button>
        </div>
      </Card>
    </div>
  );
}
