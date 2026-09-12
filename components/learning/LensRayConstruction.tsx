import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_AFTER_OPTIONS,
  LENS_BEFORE_OPTIONS,
  LENS_COPY,
  LENS_INCIDENT_OPTIONS,
  LENS_MEETING_OPTIONS,
  LENS_NATURE_OPTIONS,
  LENS_ORIENTATION_OPTIONS,
  LENS_RAY_KIND_OPTIONS,
  LENS_RECEIVE_OPTIONS,
  LENS_SIDE_OPTIONS,
  LENS_SIZE_OPTIONS,
  LENS_STATION_OPTIONS,
} from "@/lib/content/convex-lens-optical-bench";
import type { LensModelDraft, LensRayDraft } from "@/lib/learning/lens-model";
import type { StudentUiFeedback } from "@/lib/learning/student-ui-feedback";

interface LensRayConstructionProps {
  draft: LensModelDraft;
  onChange: (next: LensModelDraft) => void;
  onSubmit: () => void;
  feedback?: StudentUiFeedback | null;
  hints: string[];
  canRevealHint: boolean;
  onRevealHint: () => void;
}

export function LensRayConstruction({
  draft,
  onChange,
  onSubmit,
  feedback,
  hints,
  canRevealHint,
  onRevealHint,
}: LensRayConstructionProps) {
  return (
    <div className="space-y-4" data-testid="lens-ray-construction">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        自己决定物体位置、两条光线怎么走、会聚方式，再用一句话说明像为什么这样。这里没有已经画好的标准图可以点选。
      </p>
      <Card className="space-y-5 p-4">
        <QuestionGroup
          id="lens-model-station"
          question="物体相对 F / 2F 在哪里？"
          value={draft.objectStation}
          onChange={(objectStation) => onChange({ ...draft, objectStation })}
          options={[...LENS_STATION_OPTIONS]}
        />
        <RayEditor
          title="第一条光线（必须自己组装）"
          prefix="第一条光线"
          testId="lens-ray-a"
          value={draft.rayA}
          onChange={(rayA) => onChange({ ...draft, rayA })}
        />
        <RayEditor
          title="第二条光线（必须自己组装）"
          prefix="第二条光线"
          testId="lens-ray-b"
          value={draft.rayB}
          onChange={(rayB) => onChange({ ...draft, rayB })}
        />
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={draft.includeOptionalFocal}
            onChange={(event) =>
              onChange({ ...draft, includeOptionalFocal: event.target.checked })
            }
          />
          <span>再加一条过近侧焦点的可选参考光线。它不能代替上面两条。</span>
        </label>
        {draft.includeOptionalFocal ? (
          <RayEditor
            title="可选焦点光线"
            prefix="可选焦点光线"
            testId="lens-ray-focal"
            value={draft.optionalFocal}
            onChange={(optionalFocal) => onChange({ ...draft, optionalFocal })}
          />
        ) : null}
        <QuestionGroup
          id="lens-model-meeting"
          question="过透镜后，光线怎样相遇？"
          value={draft.meetingMode}
          onChange={(meetingMode) => onChange({ ...draft, meetingMode })}
          options={[...LENS_MEETING_OPTIONS]}
        />
        <QuestionGroup
          id="lens-model-side"
          question="像在哪一侧？"
          value={draft.side}
          onChange={(side) => onChange({ ...draft, side })}
          options={[...LENS_SIDE_OPTIONS]}
        />
        <QuestionGroup
          id="lens-model-nature"
          question="这是实像、虚像，还是没有有限远的像？"
          value={draft.nature}
          onChange={(nature) => onChange({ ...draft, nature })}
          options={[...LENS_NATURE_OPTIONS]}
        />
        <QuestionGroup
          id="lens-model-orientation"
          question="像是正立还是倒立？"
          value={draft.orientation}
          onChange={(orientation) => onChange({ ...draft, orientation })}
          options={[...LENS_ORIENTATION_OPTIONS]}
        />
        <QuestionGroup
          id="lens-model-size"
          question="像比物体大还是小？"
          value={draft.size}
          onChange={(size) => onChange({ ...draft, size })}
          options={[...LENS_SIZE_OPTIONS]}
        />
        <QuestionGroup
          id="lens-model-receive"
          question="光屏能不能接到？"
          value={draft.screenReceivable}
          onChange={(screenReceivable) => onChange({ ...draft, screenReceivable })}
          options={[...LENS_RECEIVE_OPTIONS]}
        />
        <label className="block space-y-2">
          <span className="text-sm font-medium">
            用自己的话写出：会聚方式怎样决定像。不要只背表。
          </span>
          <textarea
            data-testid="lens-model-reasoning"
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
            value={draft.studentReasoning}
            onChange={(event) =>
              onChange({ ...draft, studentReasoning: event.target.value })
            }
          />
        </label>
        {feedback ? (
          <ValidationMessage kind={feedback.kind}>{feedback.message}</ValidationMessage>
        ) : null}
        {hints.map((hint) => (
          <ValidationMessage key={hint} kind="info">
            {hint}
          </ValidationMessage>
        ))}
        {canRevealHint ? (
          <Button variant="ghost" onClick={onRevealHint}>
            再想一层
          </Button>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{LENS_COPY.modelSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}

function RayEditor({
  title,
  prefix,
  testId,
  value,
  onChange,
}: {
  title: string;
  prefix: string;
  testId: string;
  value: LensRayDraft;
  onChange: (next: LensRayDraft) => void;
}) {
  return (
    <fieldset className="space-y-3 rounded-2xl border border-[var(--line)] p-3" data-testid={testId}>
      <legend className="text-sm font-medium">{title}</legend>
      <QuestionGroup
        id={`${testId}-kind`}
        question={`${prefix}：这是哪一条光线？`}
        value={value.kind}
        onChange={(kind) => onChange({ ...value, kind })}
        options={[...LENS_RAY_KIND_OPTIONS]}
      />
      <QuestionGroup
        id={`${testId}-incident`}
        question={`${prefix}：这段是实际光线还是反向延长？`}
        value={value.incidentPath}
        onChange={(incidentPath) => onChange({ ...value, incidentPath })}
        options={[...LENS_INCIDENT_OPTIONS]}
      />
      <QuestionGroup
        id={`${testId}-before`}
        question={`${prefix}：到达透镜前怎么走？`}
        value={value.beforeLens}
        onChange={(beforeLens) => onChange({ ...value, beforeLens })}
        options={[...LENS_BEFORE_OPTIONS]}
      />
      <QuestionGroup
        id={`${testId}-after`}
        question={`${prefix}：过透镜后怎么走？`}
        value={value.afterLens}
        onChange={(afterLens) => onChange({ ...value, afterLens })}
        options={[...LENS_AFTER_OPTIONS]}
      />
    </fieldset>
  );
}
