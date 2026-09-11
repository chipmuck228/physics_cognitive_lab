import { formatTemperature } from "@/lib/physics/visual";
import type { MicrowaveExperimentResult } from "@/types/physics";
import type { MicrowavePhysicsState } from "@/types/physics";

interface ExperimentResultProps {
  physicsState: MicrowavePhysicsState;
  result: MicrowaveExperimentResult;
}

export function ExperimentResult({ physicsState, result }: ExperimentResultProps) {
  const rows = [
    {
      label: "Initial temperature",
      value: formatTemperature(result.finalTemperatureC - result.deltaTemperatureC),
    },
    { label: "Final temperature", value: formatTemperature(result.finalTemperatureC) },
    { label: "Heating time", value: `${physicsState.heatingTimeSec} s` },
    { label: "Power", value: `${physicsState.powerW} W` },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 text-sm">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="text-[var(--ink-muted)]">{row.label}</dt>
          <dd className="mt-0.5 font-medium tabular-nums text-[var(--ink)]">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
