import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import type { StudentUiFeedback } from "@/lib/learning/student-ui-feedback";
import type { OhmsModelDraft } from "@/lib/learning/ohms-model";

interface OhmsRelationBoardProps {
  draft: OhmsModelDraft;
  gateFeedback: StudentUiFeedback | null;
  needStructure: boolean;
  hints: string[];
  canRevealHint: boolean;
  onChange: (draft: OhmsModelDraft) => void;
  onSubmit: () => void;
  onRevealHint: () => void;
}

export function OhmsRelationBoard({
  draft,
  gateFeedback,
  needStructure,
  hints,
  canRevealHint,
  onChange,
  onSubmit,
  onRevealHint,
}: OhmsRelationBoardProps) {
  return (
    <Card className="space-y-5 p-4" data-testid="ohms-relation-board">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        把电流、电压和电阻放在同一块板上。两种比较必须来自同一个关系。最后用一句话写出哪个量不变、电流怎样变。
      </p>
      <QuestionGroup
        id="ohms-model-i"
        question="通过这段电阻的量是什么？"
        value={draft.currentIdentity}
        onChange={(currentIdentity) => onChange({ ...draft, currentIdentity })}
        options={[
          { value: "current", label: "电流 I" },
          { value: "voltage", label: "电压 U" },
          { value: "internal-energy", label: "内能" },
        ]}
      />
      <QuestionGroup
        id="ohms-model-u"
        question="这段电阻两端的量是什么？"
        value={draft.voltageIdentity}
        onChange={(voltageIdentity) => onChange({ ...draft, voltageIdentity })}
        options={[
          { value: "voltage", label: "电压 U" },
          { value: "current", label: "电流 I" },
          { value: "chemical-energy", label: "化学能" },
        ]}
      />
      <QuestionGroup
        id="ohms-model-r"
        question="这段导体本身的属性是什么？"
        value={draft.resistanceIdentity}
        onChange={(resistanceIdentity) => onChange({ ...draft, resistanceIdentity })}
        options={[
          { value: "resistance", label: "电阻 R" },
          { value: "current", label: "电流 I" },
          { value: "mechanical-energy", label: "机械能" },
        ]}
      />
      <QuestionGroup
        id="ohms-model-relation"
        question="这三个量用哪一句关系连在一起？"
        value={draft.relation}
        onChange={(relation) => onChange({ ...draft, relation })}
        options={[
          { value: "i-equals-u-over-r", label: "I = U / R（同一个关系）" },
          { value: "energy-chain", label: "化学能 → 内能 → 机械能" },
          { value: "formula-only-slogan", label: "只要会背公式就够了" },
        ]}
      />
      <div className="rounded-xl border border-[var(--line)] p-3 space-y-4">
        <p className="text-sm font-medium">同一个关系还能说明两次比较</p>
        <QuestionGroup
          id="ohms-model-same-r"
          question="电阻不变时，电压更大，电流怎样？"
          value={draft.sameRConsequence}
          onChange={(sameRConsequence) => onChange({ ...draft, sameRConsequence })}
          options={[
            { value: "larger-u-larger-i", label: "电流更大" },
            { value: "same-i", label: "电流不变" },
            { value: "smaller-i", label: "电流更小" },
          ]}
        />
        <QuestionGroup
          id="ohms-model-same-u"
          question="电压不变时，电阻更大，电流怎样？"
          value={draft.sameUConsequence}
          onChange={(sameUConsequence) => onChange({ ...draft, sameUConsequence })}
          options={[
            { value: "larger-r-smaller-i", label: "电流更小" },
            { value: "larger-r-larger-i", label: "电流更大" },
            { value: "same-i", label: "电流不变" },
          ]}
        />
      </div>
      <QuestionGroup
        id="ohms-model-rearrangement"
        question="有人说 R = U / I，所以改变电压就制造了新的电阻。你怎么看？"
        value={draft.rearrangement}
        onChange={(rearrangement) => onChange({ ...draft, rearrangement })}
        options={[
          {
            value: "same-relation-r-is-property",
            label: "这只是同一个关系。电阻是这段导体的属性，不是被算出来才有的。",
          },
          {
            value: "u-makes-r",
            label: "电压变了，电阻一定变成一个新的电阻。",
          },
        ]}
      />
      <QuestionGroup
        id="ohms-model-condition"
        question="这个关系在什么条件下能用？"
        value={draft.condition}
        onChange={(condition) => onChange({ ...draft, condition })}
        options={[
          { value: "closed-ohmic", label: "电路闭合，并且电阻可以看成不变" },
          { value: "always", label: "只要有电源就一定能用" },
        ]}
      />
      <label className="block space-y-2">
        <span className="text-sm font-medium">用一句话写出：哪个量不变，哪个量变了，电流怎样。</span>
        <textarea
          data-testid="ohms-model-reasoning"
          className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3 text-sm"
          rows={3}
          value={draft.studentReasoning}
          onChange={(event) =>
            onChange({ ...draft, studentReasoning: event.target.value })
          }
        />
      </label>
      {needStructure ? (
        <ValidationMessage kind="missing">还有问题没写完，不能只点格子。</ValidationMessage>
      ) : null}
      {gateFeedback ? (
        <ValidationMessage kind={gateFeedback.kind}>{gateFeedback.message}</ValidationMessage>
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
            给我一个台阶
          </Button>
        ) : null}
        <Button onClick={onSubmit} data-testid="ohms-model-submit">
          提交关系
        </Button>
      </div>
    </Card>
  );
}
