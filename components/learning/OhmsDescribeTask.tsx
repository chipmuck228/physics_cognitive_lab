import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  OHMS_CHANGE_OPTIONS,
  OHMS_COPY,
  OHMS_OBJECT_OPTIONS,
  OHMS_QUANTITY_OPTIONS,
} from "@/lib/content/simple-resistor-circuit";
import type { OhmsDescribeInput } from "@/lib/learning/ohms-describe";

interface OhmsDescribeTaskProps {
  value: OhmsDescribeInput;
  onChange: (next: OhmsDescribeInput) => void;
  onSubmit: () => void;
  needStructure: boolean;
}

export function OhmsDescribeTask({
  value,
  onChange,
  onSubmit,
  needStructure,
}: OhmsDescribeTaskProps) {
  return (
    <div data-testid="ohms-describe-task" className="space-y-4">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {OHMS_COPY.describeInstruction}
      </p>
      <Card className="space-y-5 p-4">
        <QuestionGroup
          id="ohms-describe-object"
          question={OHMS_COPY.describeObject}
          value={value.object}
          onChange={(object) =>
            onChange({ ...value, object: object as OhmsDescribeInput["object"] })
          }
          options={[...OHMS_OBJECT_OPTIONS]}
        />
        <QuestionGroup
          id="ohms-describe-quantities"
          question={OHMS_COPY.describeQuantities}
          value={value.quantities}
          onChange={(quantities) =>
            onChange({
              ...value,
              quantities: quantities as OhmsDescribeInput["quantities"],
            })
          }
          options={[...OHMS_QUANTITY_OPTIONS]}
        />
        <QuestionGroup
          id="ohms-describe-change"
          question={OHMS_COPY.describeChange}
          value={value.change}
          onChange={(change) =>
            onChange({ ...value, change: change as OhmsDescribeInput["change"] })
          }
          options={[...OHMS_CHANGE_OPTIONS]}
        />
        <label className="block space-y-2">
          <span className="text-sm font-medium">{OHMS_COPY.describeQuestion}</span>
          <textarea
            id="ohms-describe-text"
            data-testid="ohms-describe-text"
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
            value={value.studentDescription}
            onChange={(event) =>
              onChange({ ...value, studentDescription: event.target.value })
            }
          />
        </label>
        {needStructure ? (
          <ValidationMessage kind="missing">{OHMS_COPY.describeNeedStructure}</ValidationMessage>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{OHMS_COPY.describeSubmit}</Button>
        </div>
      </Card>
    </div>
  );
}
