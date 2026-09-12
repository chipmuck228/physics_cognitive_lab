import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_COPY,
  LENS_EXPLAIN_MEETING,
  LENS_EXPLAIN_SCREEN,
} from "@/lib/content/convex-lens-optical-bench";
import type { LensExplainInput } from "@/lib/learning/lens-explain";

interface LensExplainTaskProps {
  value: LensExplainInput;
  onChange: (next: LensExplainInput) => void;
  onSubmit: () => void;
  needMore: boolean;
  hints: string[];
  canRevealHint: boolean;
  onRevealHint: () => void;
}

export function LensExplainTask({
  value,
  onChange,
  onSubmit,
  needMore,
  hints,
  canRevealHint,
  onRevealHint,
}: LensExplainTaskProps) {
  return (
    <div data-testid="lens-explain-task" className="space-y-4">
      <Card className="space-y-5 p-4">
        <QuestionGroup
          id="lens-explain-meeting"
          question="光线会怎样相交？"
          value={value.meetingFragment}
          onChange={(meetingFragment) => onChange({ ...value, meetingFragment })}
          options={[...LENS_EXPLAIN_MEETING]}
        />
        <QuestionGroup
          id="lens-explain-screen"
          question="光屏和像是什么关系？"
          value={value.screenFragment}
          onChange={(screenFragment) => onChange({ ...value, screenFragment })}
          options={[...LENS_EXPLAIN_SCREEN]}
        />
        <label className="block space-y-2">
          <span className="text-sm font-medium">{LENS_COPY.explainOwnWords}</span>
          <textarea
            data-testid="lens-explain-text"
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
            value={value.studentExplanation}
            onChange={(event) =>
              onChange({ ...value, studentExplanation: event.target.value })
            }
          />
        </label>
        {needMore ? (
          <ValidationMessage kind="missing">
            先选出一段会聚或接收关系，再用自己的话写。只背“2F 外倒立缩小实像”还不够。
          </ValidationMessage>
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
          <Button onClick={onSubmit}>{LENS_COPY.explainSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}
