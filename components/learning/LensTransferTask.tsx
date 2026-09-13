import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_COPY,
  LENS_MEETING_OPTIONS,
  LENS_NATURE_OPTIONS,
  LENS_ORIENTATION_OPTIONS,
  LENS_RECEIVE_OPTIONS,
  LENS_SIDE_OPTIONS,
  LENS_SIZE_OPTIONS,
  LENS_STATION_OPTIONS,
  lensTransferProgressLabel,
} from "@/lib/content/convex-lens-optical-bench";
import {
  lensTransferJudgmentRecap,
  type LensTransferDraft,
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
        <fieldset disabled={reviewOnly} className="space-y-5 border-0 p-0">
        <p
          className="text-sm text-[var(--ink-muted)]"
          data-testid="lens-transfer-progress"
        >
          {lensTransferProgressLabel(currentIndex, totalCount)}
        </p>
        {firstComplete && currentIndex > 1 ? (
          <p className="text-sm text-[var(--ink-muted)]">{LENS_COPY.transferFirstSaved}</p>
        ) : null}
        <p className="text-sm font-medium">先看这个新情境</p>
        <p className="text-sm leading-relaxed">{target.scenario}</p>
        <QuestionGroup
          id="lens-transfer-station"
          question="这个新情境里，物体相对焦点在哪里？"
          value={draft.objectStation}
          onChange={(objectStation) => onChange({ ...draft, objectStation })}
          options={[...LENS_STATION_OPTIONS]}
        />
        <QuestionGroup
          id="lens-transfer-meeting"
          question="光线怎样相遇？"
          value={draft.meetingMode}
          onChange={(meetingMode) => onChange({ ...draft, meetingMode })}
          options={[...LENS_MEETING_OPTIONS]}
        />
        <QuestionGroup
          id="lens-transfer-side"
          question="像在哪一侧？"
          value={draft.side}
          onChange={(side) => onChange({ ...draft, side })}
          options={[...LENS_SIDE_OPTIONS]}
        />
        <QuestionGroup
          id="lens-transfer-nature"
          question="像的性质？"
          value={draft.nature}
          onChange={(nature) => onChange({ ...draft, nature })}
          options={[...LENS_NATURE_OPTIONS]}
        />
        <QuestionGroup
          id="lens-transfer-orientation"
          question="正立还是倒立？"
          value={draft.orientation}
          onChange={(orientation) => onChange({ ...draft, orientation })}
          options={[...LENS_ORIENTATION_OPTIONS]}
        />
        <QuestionGroup
          id="lens-transfer-size"
          question="大小怎样？"
          value={draft.size}
          onChange={(size) => onChange({ ...draft, size })}
          options={[...LENS_SIZE_OPTIONS]}
        />
        <QuestionGroup
          id="lens-transfer-receive"
          question="屏或幕布能不能接到？"
          value={draft.screenReceivable}
          onChange={(screenReceivable) => onChange({ ...draft, screenReceivable })}
          options={[...LENS_RECEIVE_OPTIONS]}
        />
        <label className="flex items-start gap-3 text-sm">
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
            <li>物体位置：{recap.station}</li>
            <li>光线关系：{recap.meeting}</li>
            <li>像：{recap.image}</li>
            <li>光屏：{recap.screen}</li>
          </ul>
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
            disabled={reviewOnly}
          />
        </label>
        </fieldset>
        {repairMessage ? (
          <ValidationMessage kind={repairKind} testId="lens-transfer-repair">
            {repairMessage}
          </ValidationMessage>
        ) : null}
        {reviewOnly ? null : (
          <div className="flex justify-end">
            <Button onClick={onSubmit}>{LENS_COPY.transferSubmit}</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
