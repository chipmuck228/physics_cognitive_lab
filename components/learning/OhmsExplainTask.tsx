import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import { OHMS_COPY } from "@/lib/content/simple-resistor-circuit";
import type { OhmsExplainInput } from "@/lib/learning/ohms-explain";

interface OhmsExplainTaskProps {
  value: OhmsExplainInput;
  needMore: boolean;
  evidence: { experimentA: string; experimentB: string };
  hints: string[];
  canRevealHint: boolean;
  onChange: (next: OhmsExplainInput) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
}

export function OhmsExplainTask({
  value,
  needMore,
  evidence,
  hints,
  canRevealHint,
  onChange,
  onSubmit,
  onRevealHint,
}: OhmsExplainTaskProps) {
  return (
    <div className="space-y-4" data-testid="ohms-explain-task">
      <Card className="space-y-5 p-4">
        {(evidence.experimentA || evidence.experimentB) && (
          <div className="space-y-2 text-sm text-[var(--ink-muted)]">
            {evidence.experimentA ? <p>第一次对照：{evidence.experimentA}</p> : null}
            {evidence.experimentB ? <p>第二次对照：{evidence.experimentB}</p> : null}
          </div>
        )}
        <QuestionGroup
          id="ohms-explain-distinct"
          question="电流、电压、电阻是一回事吗？"
          value={value.quantitiesDistinct}
          onChange={(quantitiesDistinct) => onChange({ ...value, quantitiesDistinct })}
          options={[
            { value: "distinct", label: "不是一回事，是三个不同的量" },
            { value: "same-thing", label: "其实就是同一件事" },
            { value: "formula-enough", label: "只要会背公式就够了" },
          ]}
        />
        <QuestionGroup
          id="ohms-explain-same-r"
          question="电阻可以看成不变时，电压更大，电流怎样？"
          value={value.sameR}
          onChange={(sameR) => onChange({ ...value, sameR })}
          options={[
            { value: "larger-u-larger-i", label: "电流更大" },
            { value: "voltage-alone", label: "电压大电流一定大，电阻不用看" },
            { value: "same-i", label: "电流不变" },
          ]}
        />
        <QuestionGroup
          id="ohms-explain-same-u"
          question="电压可以看成不变时，电阻更大，电流怎样？"
          value={value.sameU}
          onChange={(sameU) => onChange({ ...value, sameU })}
          options={[
            { value: "larger-r-smaller-i", label: "电流更小" },
            { value: "larger-r-larger-i", label: "电阻大电流就大" },
            { value: "same-i", label: "电流不变" },
          ]}
        />
        <label className="block space-y-2">
          <span className="text-sm font-medium">{OHMS_COPY.explainOwnWords}</span>
          <textarea
            data-testid="ohms-explain-text"
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
            value={value.studentExplanation}
            onChange={(event) =>
              onChange({ ...value, studentExplanation: event.target.value })
            }
          />
        </label>
        {needMore ? (
          <ValidationMessage kind="missing">{OHMS_COPY.blockedNeedMore}</ValidationMessage>
        ) : null}
        {hints.length > 0 ? (
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--ink-muted)]">
            {hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        ) : null}
        <div className="flex justify-end gap-2">
          {canRevealHint ? (
            <Button variant="secondary" onClick={onRevealHint}>
              {OHMS_COPY.continue === "继续" ? "给我一个台阶" : "给我一个台阶"}
            </Button>
          ) : null}
          <Button onClick={onSubmit}>{OHMS_COPY.explainSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}
