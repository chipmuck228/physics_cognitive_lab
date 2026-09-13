import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_COPY,
  LENS_STATION_OPTIONS,
  lensTransferProgressLabel,
} from "@/lib/content/convex-lens-optical-bench";
import {
  lensTransferJudgmentRecap,
  type LensTransferDraft,
  type LensTransferModelLink,
} from "@/lib/learning/lens-transfer";
import type { TransferTarget } from "@/types/physics-model";

interface LensTransferTaskProps {
  target: TransferTarget;
  draft: LensTransferDraft;
  onChange: (next: LensTransferDraft) => void;
  onSubmit: () => void;
  repairMessage?: string | null;
  repairKind?: "missing" | "incorrect";
  reviewOnly?: boolean;
  currentIndex?: number;
  totalCount?: number;
  firstComplete?: boolean;
  modelLink?: LensTransferModelLink;
  checking?: boolean;
}

export function LensTransferTask({
  target,
  draft,
  onChange,
  onSubmit,
  repairMessage = null,
  repairKind = "incorrect",
  reviewOnly = false,
  currentIndex = 1,
  totalCount = 2,
  firstComplete = false,
  modelLink,
  checking = false,
}: LensTransferTaskProps) {
  const recap = lensTransferJudgmentRecap(draft);
  return (
    <div
      className="space-y-4"
      data-testid="lens-transfer-task"
      data-target={target.id}
      data-transfer-current={String(currentIndex)}
      data-transfer-total={String(totalCount)}
    >
      <Card className="space-y-5 p-4">
        <fieldset disabled={reviewOnly || checking} className="space-y-5 border-0 p-0">
        <p
          className="text-sm text-[var(--ink-muted)]"
          data-testid="lens-transfer-progress"
        >
          {lensTransferProgressLabel(currentIndex, totalCount)}
        </p>
        {firstComplete && currentIndex > 1 ? (
          <p className="text-sm text-[var(--ink-muted)]">{LENS_COPY.transferFirstSaved}</p>
        ) : null}
        <p className="text-sm font-medium">{LENS_COPY.transferSituationTitle}</p>
        <p className="text-sm leading-relaxed">{target.scenario}</p>
        <QuestionGroup
          id="lens-transfer-station"
          question={LENS_COPY.transferConditionQuestion}
          value={draft.objectStation}
          onChange={(objectStation) => onChange({ ...draft, objectStation })}
          options={[...LENS_STATION_OPTIONS]}
        />
        <div
          className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm"
          data-testid="lens-transfer-model-link"
        >
          <p className="font-medium">{LENS_COPY.transferModelLinkTitle}</p>
          <p className="mt-2 text-[var(--ink-muted)]">{LENS_COPY.transferModelLinkBody}</p>
          {modelLink ? (
            <p className="mt-2 text-[var(--ink-muted)]">
              你当时搭的是：{modelLink.station} → {modelLink.meeting} → {modelLink.image}
            </p>
          ) : null}
        </div>
        <label className="block space-y-2">
          <span className="text-sm font-medium">{LENS_COPY.transferOwnWords}</span>
          <textarea
            data-testid="lens-transfer-explanation"
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
            value={draft.studentExplanation}
            onChange={(event) =>
              onChange({ ...draft, studentExplanation: event.target.value })
            }
            disabled={reviewOnly || checking}
          />
        </label>
        <label className="flex items-start gap-3 text-sm text-[var(--ink-muted)]">
          <input
            type="checkbox"
            data-testid="lens-transfer-surface-cue"
            checked={draft.surfaceCueSelected}
            onChange={(event) =>
              onChange({ ...draft, surfaceCueSelected: event.target.checked })
            }
          />
          <span>{LENS_COPY.transferSurfaceCue}</span>
        </label>
        <div
          className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm"
          data-testid="lens-transfer-recap"
        >
          <p className="font-medium">{LENS_COPY.transferJudgmentTitle}</p>
          <ul className="mt-2 space-y-1 text-[var(--ink-muted)]">
            <li>这个情境的物体条件：{recap.station}</li>
            <li>你的说明：{recap.explanation}</li>
          </ul>
        </div>
        </fieldset>
        {repairMessage ? (
          <ValidationMessage kind={repairKind} testId="lens-transfer-repair">
            {repairMessage}
          </ValidationMessage>
        ) : null}
        {reviewOnly ? null : (
          <div className="flex justify-end">
            <Button onClick={onSubmit} disabled={checking}>
              {checking ? LENS_COPY.transferChecking : LENS_COPY.transferSubmit}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
