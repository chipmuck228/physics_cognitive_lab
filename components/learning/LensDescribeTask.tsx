import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { QuestionGroup } from "@/components/learning/QuestionGroup";
import { ValidationMessage } from "@/components/learning/ValidationMessage";
import {
  LENS_CHANGE_OPTIONS,
  LENS_COPY,
  LENS_OBJECT_OPTIONS,
  LENS_QUANTITY_OPTIONS,
} from "@/lib/content/convex-lens-optical-bench";
import type { LensDescribeInput } from "@/lib/learning/lens-describe";

interface LensDescribeTaskProps {
  value: LensDescribeInput;
  onChange: (next: LensDescribeInput) => void;
  onSubmit: () => void;
  needStructure: boolean;
  reviewOnly?: boolean;
}

export function LensDescribeTask({
  value,
  onChange,
  onSubmit,
  needStructure,
  reviewOnly = false,
}: LensDescribeTaskProps) {
  return (
    <div data-testid="lens-describe-task" className="space-y-4">
      <Card className="space-y-5 p-4">
        <QuestionGroup
          id="lens-describe-object"
          question={LENS_COPY.describeObject}
          value={value.object}
          onChange={(object) =>
            onChange({ ...value, object: object as LensDescribeInput["object"] })
          }
          options={[...LENS_OBJECT_OPTIONS]}
        />
        <QuestionGroup
          id="lens-describe-quantities"
          question={LENS_COPY.describeQuantities}
          value={value.quantities}
          onChange={(quantities) =>
            onChange({
              ...value,
              quantities: quantities as LensDescribeInput["quantities"],
            })
          }
          options={[...LENS_QUANTITY_OPTIONS]}
        />
        <QuestionGroup
          id="lens-describe-change"
          question={LENS_COPY.describeChange}
          value={value.change}
          onChange={(change) =>
            onChange({ ...value, change: change as LensDescribeInput["change"] })
          }
          options={[...LENS_CHANGE_OPTIONS]}
        />
        <label className="block space-y-2">
          <span className="text-sm font-medium">{LENS_COPY.describeQuestion}</span>
          <textarea
            id="lens-describe-text"
            data-testid="lens-describe-text"
            className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm"
            value={value.studentDescription}
            onChange={(event) =>
              onChange({ ...value, studentDescription: event.target.value })
            }
          />
        </label>
        {needStructure ? (
          <ValidationMessage kind="missing">{LENS_COPY.describeNeedStructure}</ValidationMessage>
        ) : null}
        {reviewOnly ? null : (
          <div className="flex justify-end">
            <Button onClick={onSubmit}>{LENS_COPY.describeSubmit}</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
