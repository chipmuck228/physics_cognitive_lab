import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { FourStrokeEngine } from "@/components/physics/engine/FourStrokeEngine";
import {
  ENGINE_COPY,
  ENGINE_DESCRIBE_SNAPSHOTS,
  type EngineCombustionChoice,
  type EnginePistonChoice,
  type EngineValveChoice,
} from "@/lib/content/four-stroke-engine";
import type { EngineSnapshotAnswer } from "@/lib/learning/engine-describe";
import { DEFAULT_ENGINE_CONFIG, getStrokeState } from "@/lib/physics/engine";

interface EngineDescribeTaskProps {
  snapshots: EngineSnapshotAnswer[];
  studentDescription: string;
  onSnapshotChange: (
    stroke: EngineSnapshotAnswer["stroke"],
    field: "piston" | "intake" | "exhaust" | "combustion",
    value: string,
  ) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  needStructure: boolean;
}

export function EngineDescribeTask({
  snapshots,
  studentDescription,
  onSnapshotChange,
  onDescriptionChange,
  onSubmit,
  needStructure,
}: EngineDescribeTaskProps) {
  return (
    <div className="space-y-4" data-testid="engine-describe-task">
      <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
        {ENGINE_COPY.describeInstruction}
      </p>

      {ENGINE_DESCRIBE_SNAPSHOTS.map((spec) => {
        const answer = snapshots.find((item) => item.stroke === spec.stroke);
        return (
          <Card key={spec.id} className="space-y-4 p-4">
            <p className="text-sm font-medium text-[var(--ink)]">{spec.label}</p>
            <div className="mx-auto max-w-[14rem] rounded-2xl bg-[var(--scene)] p-3">
              <FourStrokeEngine
                state={getStrokeState(spec.stroke, DEFAULT_ENGINE_CONFIG)}
                showStrokeLabel={false}
                testId={`engine-${spec.id}`}
              />
            </div>
            <ChoiceGroup
              legend={ENGINE_COPY.pistonLabel}
              name={`${spec.id}-piston`}
              value={answer?.piston ?? ""}
              options={[
                { value: "up", label: ENGINE_COPY.pistonUp },
                { value: "down", label: ENGINE_COPY.pistonDown },
                { value: "held", label: ENGINE_COPY.pistonHeld },
              ]}
              onChange={(value) =>
                onSnapshotChange(spec.stroke, "piston", value as EnginePistonChoice)
              }
            />
            <ChoiceGroup
              legend={ENGINE_COPY.intakeLabel}
              name={`${spec.id}-intake`}
              value={answer?.intake ?? ""}
              options={[
                { value: "open", label: ENGINE_COPY.valveOpen },
                { value: "closed", label: ENGINE_COPY.valveClosed },
              ]}
              onChange={(value) =>
                onSnapshotChange(spec.stroke, "intake", value as EngineValveChoice)
              }
            />
            <ChoiceGroup
              legend={ENGINE_COPY.exhaustLabel}
              name={`${spec.id}-exhaust`}
              value={answer?.exhaust ?? ""}
              options={[
                { value: "open", label: ENGINE_COPY.valveOpen },
                { value: "closed", label: ENGINE_COPY.valveClosed },
              ]}
              onChange={(value) =>
                onSnapshotChange(spec.stroke, "exhaust", value as EngineValveChoice)
              }
            />
            <ChoiceGroup
              legend={ENGINE_COPY.combustionLabel}
              name={`${spec.id}-combustion`}
              value={answer?.combustion ?? ""}
              options={[
                { value: "present", label: ENGINE_COPY.combustionPresent },
                { value: "absent", label: ENGINE_COPY.combustionAbsent },
              ]}
              onChange={(value) =>
                onSnapshotChange(
                  spec.stroke,
                  "combustion",
                  value as EngineCombustionChoice,
                )
              }
            />
          </Card>
        );
      })}

      <Card className="space-y-3 p-4">
        <label htmlFor="engine-describe-text" className="text-sm font-medium text-[var(--ink)]">
          {ENGINE_COPY.describeQuestion}
        </label>
        <textarea
          id="engine-describe-text"
          value={studentDescription}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder={ENGINE_COPY.describePlaceholder}
          className="min-h-24 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--ink)] outline-none transition focus:border-[var(--heat)] focus:ring-2 focus:ring-[var(--heat)]/20"
        />
        {needStructure ? (
          <p className="text-sm text-[var(--ink-muted)]">
            {ENGINE_COPY.describeNeedStructure}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button onClick={onSubmit}>{ENGINE_COPY.describeSubmit}</Button>
        </div>
      </Card>

    </div>
  );
}

function ChoiceGroup({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-[var(--ink)]">{legend}</legend>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 text-sm text-[var(--ink)]"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              aria-label={`${legend} ${option.label}`}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
