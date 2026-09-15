import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_AFTER_OPTIONS,
  LENS_COPY,
  LENS_MEETING_OPTIONS,
  LENS_NATURE_OPTIONS,
  LENS_ORIENTATION_OPTIONS,
  LENS_RAY_KIND_OPTIONS,
  LENS_RECEIVE_OPTIONS,
  LENS_REQUIRED_RAY_KIND_OPTIONS,
  LENS_SIDE_OPTIONS,
  LENS_SIZE_OPTIONS,
  LENS_STATION_OPTIONS,
  lensChoiceLabel,
  lensModelRepairLabel,
} from "@/lib/content/convex-lens-optical-bench";
import type { LensFeedback } from "@/lib/learning/lens-feedback";
import {
  LENS_MODEL_STEP_COUNT,
  evaluateLensModelStep,
  officialOptionalFocalRay,
  withDerivedRequiredRay,
  withRequiredRayKind,
  type LensModelDraft,
  type LensRayDraft,
} from "@/lib/learning/lens-model";
import { isObjectStation } from "@/lib/physics/convex-lens-optical-bench";

interface LensRayConstructionProps {
  draft: LensModelDraft;
  onChange: (next: LensModelDraft) => void;
  onSubmit: () => void;
  onCheckStep6?: () => void | Promise<void>;
  step6Checking?: boolean;
  step6CheckMessage?: string | null;
  feedback?: LensFeedback | null;
  repairStep?: number | null;
  reviewOnly?: boolean;
  priorTrials?: ReadonlyArray<{ title: string; result: string }>;
}

const STEP_TITLES = [
  "把刚才几次放在一起看",
  "第一条光线怎么走",
  "第二条光线怎么走",
  "这些光后来怎样",
  "会成什么样的像，光屏能不能接到",
  "用自己的话说说真正起作用的是什么",
  "检查后再提交",
];

export function LensRayConstruction({
  draft,
  onChange,
  onSubmit,
  onCheckStep6,
  step6Checking = false,
  step6CheckMessage = null,
  feedback,
  repairStep = null,
  reviewOnly = false,
  priorTrials = [],
}: LensRayConstructionProps) {
  const step = Math.min(Math.max(draft.constructionStep || 1, 1), LENS_MODEL_STEP_COUNT);
  const stepCheck = evaluateLensModelStep(draft, step);
  const needsSemanticCheck =
    step === 6 &&
    stepCheck.status === "missing" &&
    stepCheck.message === LENS_COPY.modelStep6NeedCheck;
  const canAdvance =
    step === 6
      ? Boolean(draft.studentReasoning.trim()) &&
        !step6Checking &&
        (stepCheck.status === "ready" || needsSemanticCheck)
      : stepCheck.status === "ready";
  const nextBlockedReason = step6Checking
    ? LENS_COPY.modelStep6Checking
    : step6CheckMessage ?? (stepCheck.status === "ready" ? null : stepCheck.message);
  return (
    <div
      className="space-y-4"
      data-testid="lens-ray-construction"
      data-step={step}
      data-step-status={stepCheck.status}
    >
      <p className="text-sm text-[var(--ink-muted)]">
        {`第 ${step} 步 / 共 ${LENS_MODEL_STEP_COUNT} 步：${STEP_TITLES[step - 1]}`}
      </p>
      <Card className="space-y-5 p-4">
        <fieldset disabled={reviewOnly} className="space-y-5 border-0 p-0">
        {step === 1 ? (
          <>
            <div className="space-y-2" data-testid="lens-model-experiment-recap">
              <p className="text-sm text-[var(--ink)]">
                前面几次实验，物体放的位置不一样，最后看到的结果也不一样。把它们放在一起看看：到底是哪一步开始变得不一样？
              </p>
              {priorTrials.length > 0 ? (
                <ul className="space-y-1 text-sm text-[var(--ink-muted)]">
                  {priorTrials.map((trial) => (
                    <li key={trial.title}>{`${trial.title}：${trial.result}`}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--ink-muted)]">先回头看看你刚才记下的实验结果。</p>
              )}
            </div>
            <QuestionGroup
            id="lens-model-station"
            question="这一次，你要连起来说明的是物体相对 F / 2F 在哪里？"
            value={draft.objectStation}
            onChange={(objectStation) =>
              onChange({
                ...draft,
                objectStation,
                includeOptionalFocal:
                  isObjectStation(objectStation) && officialOptionalFocalRay(objectStation)
                    ? draft.includeOptionalFocal
                    : false,
              })
            }
            options={[...LENS_STATION_OPTIONS]}
          />
          </>
        ) : null}
        {step === 2 ? (
          <RayEditor
            title="第一条必做光线"
            prefix="第一条光线"
            testId="lens-ray-a"
            value={draft.rayA}
            onChange={(rayA) => onChange({ ...draft, rayA })}
          />
        ) : null}
        {step === 3 ? (
          <>
            <RayEditor
              title="第二条必做光线"
              prefix="第二条光线"
              testId="lens-ray-b"
              value={draft.rayB}
              onChange={(rayB) => onChange({ ...draft, rayB })}
            />
            {isObjectStation(draft.objectStation) &&
            officialOptionalFocalRay(draft.objectStation) ? (
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  data-testid="lens-optional-focal"
                  checked={draft.includeOptionalFocal}
                  onChange={(event) =>
                    onChange({
                      ...draft,
                      includeOptionalFocal: event.target.checked,
                    })
                  }
                />
                <span>
                  显示一条可选参考光线
                  <span className="mt-1 block text-[var(--ink-muted)]">
                    可选参考，不计入两条必做光线
                  </span>
                </span>
              </label>
            ) : null}
          </>
        ) : null}
        {step === 4 ? (
          <QuestionGroup
            id="lens-model-meeting"
            question="沿着这些光往前看，它们会在前面碰到一起吗？"
            value={draft.meetingMode}
            onChange={(meetingMode) => onChange({ ...draft, meetingMode })}
            options={[...LENS_MEETING_OPTIONS]}
          />
        ) : null}
        {step === 5 ? (
          <>
            <QuestionGroup
              id="lens-model-side"
              question="像在哪一侧？"
              value={draft.side}
              onChange={(side) => onChange({ ...draft, side })}
              options={[...LENS_SIDE_OPTIONS]}
            />
            <QuestionGroup
              id="lens-model-nature"
              question="这是实像、虚像，还是接不到清楚的实像？"
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
              question="什么时候光屏能接到清晰的像？这一次能不能？"
              value={draft.screenReceivable}
              onChange={(screenReceivable) => onChange({ ...draft, screenReceivable })}
              options={[...LENS_RECEIVE_OPTIONS]}
            />
          </>
        ) : null}
        {step === 6 ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium">
              现在不用背几种情况。用自己的话说说：你觉得真正决定最后成像结果的是什么？
            </span>
            <textarea
              data-testid="lens-model-reasoning"
              className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
              value={draft.studentReasoning}
              onChange={(event) =>
                onChange({
                  ...draft,
                  studentReasoning: event.target.value,
                  step6Interpretation: null,
                })
              }
            />
          </label>
        ) : null}
        {step === 7 ? (
          <div className="space-y-2 text-sm" data-testid="lens-model-review">
            <p>检查你刚才建构的关系，再提交。这里仍然没有已经画好的标准图。</p>
            <p data-testid="lens-model-review-station">
              {`物体位置：${lensChoiceLabel(LENS_STATION_OPTIONS, draft.objectStation) || "还没选"}`}
            </p>
            <p data-testid="lens-model-review-ray-a">
              {`第一条光线：${summarizeRay(draft.rayA)}`}
            </p>
            <p data-testid="lens-model-review-ray-b">
              {`第二条光线：${summarizeRay(draft.rayB)}`}
            </p>
            <p data-testid="lens-model-review-meeting">
              {`会聚方式：${lensChoiceLabel(LENS_MEETING_OPTIONS, draft.meetingMode) || "还没选"}`}
            </p>
            <p data-testid="lens-model-review-image">
              {`像的后果：${[
                lensChoiceLabel(LENS_SIDE_OPTIONS, draft.side),
                lensChoiceLabel(LENS_NATURE_OPTIONS, draft.nature),
                lensChoiceLabel(LENS_ORIENTATION_OPTIONS, draft.orientation),
                lensChoiceLabel(LENS_SIZE_OPTIONS, draft.size),
                lensChoiceLabel(LENS_RECEIVE_OPTIONS, draft.screenReceivable),
              ]
                .filter(Boolean)
                .join("；") || "还没选"}`}
            </p>
            <p data-testid="lens-model-review-bind">{draft.studentReasoning || "还没有写下联系。"}</p>
          </div>
        ) : null}
        </fieldset>
        {feedback ? (
          <ValidationMessage
            kind={feedback.kind === "missing" ? "missing" : "incorrect"}
            testId={`lens-feedback-${feedback.kind}`}
          >
            {feedback.message}
          </ValidationMessage>
        ) : null}
        {reviewOnly ? null : (
          <div className="flex justify-between gap-2">
            {step > 1 ? (
              <Button
                variant="secondary"
                onClick={() => onChange({ ...draft, constructionStep: step - 1 })}
              >
                上一步
              </Button>
            ) : (
              <span />
            )}
            {step < LENS_MODEL_STEP_COUNT ? (
              <div className="flex flex-col items-end gap-2">
                {nextBlockedReason && (step6CheckMessage || step6Checking || !canAdvance) ? (
                  <ValidationMessage
                    kind={
                      step6Checking
                        ? "info"
                        : stepCheck.status === "inconsistent"
                          ? "incorrect"
                          : "info"
                    }
                    testId={step6Checking ? "lens-model-step6-checking" : "lens-model-next-reason"}
                  >
                    {nextBlockedReason}
                  </ValidationMessage>
                ) : null}
                <Button
                  onClick={() => {
                    if (step === 6 && onCheckStep6) {
                      void onCheckStep6();
                      return;
                    }
                    onChange({ ...draft, constructionStep: step + 1 });
                  }}
                  disabled={!canAdvance}
                  data-testid="lens-model-next"
                  data-checking={step6Checking ? "true" : "false"}
                >
                  {step === 6 && step6Checking ? LENS_COPY.modelStep6Checking : "下一步"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-end gap-2">
                {feedback && repairStep ? (
                  <div className="space-y-2 text-right" data-testid="lens-model-repair-panel">
                    <p className="text-sm font-medium">{LENS_COPY.modelCannotSubmit}</p>
                    <Button
                      variant="secondary"
                      onClick={() => onChange({ ...draft, constructionStep: repairStep })}
                      data-testid="lens-model-repair"
                      data-repair-step={String(repairStep)}
                    >
                      {lensModelRepairLabel(repairStep)}
                    </Button>
                  </div>
                ) : null}
                <Button onClick={onSubmit} data-testid="lens-model-submit">
                  {LENS_COPY.modelSubmit}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function summarizeRay(ray: LensRayDraft): string {
  if (!ray.kind || !ray.afterLens) {
    return "还没装完";
  }
  return [
    lensChoiceLabel(LENS_REQUIRED_RAY_KIND_OPTIONS, ray.kind) ||
      lensChoiceLabel(LENS_RAY_KIND_OPTIONS, ray.kind),
    lensChoiceLabel(LENS_AFTER_OPTIONS, ray.afterLens),
  ].join("；");
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
        question={`${prefix}：先选一条要用的特殊光线。`}
        value={value.kind}
        onChange={(kind) => onChange(withRequiredRayKind(value, kind))}
        options={[...LENS_REQUIRED_RAY_KIND_OPTIONS]}
      />
      <QuestionGroup
        id={`${testId}-after`}
        question={`${prefix}：经过透镜后，它应该怎样走？`}
        value={value.afterLens}
        onChange={(afterLens) => onChange(withDerivedRequiredRay({ ...value, afterLens }))}
        options={[...LENS_AFTER_OPTIONS]}
      />
    </fieldset>
  );
}
