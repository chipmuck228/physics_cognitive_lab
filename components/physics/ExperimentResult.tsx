import { formatTemperature } from "@/lib/physics/visual";
import { SCENE_COPY } from "@/lib/content/microwave-bread";
import type { MicrowaveExperimentResult } from "@/types/physics";
import type { MicrowavePhysicsState } from "@/types/physics";

interface ExperimentResultProps {
  physicsState: MicrowavePhysicsState;
  result: MicrowaveExperimentResult;
}

export function ExperimentResult({ physicsState, result }: ExperimentResultProps) {
  const rows = [
    {
      label: SCENE_COPY.initialTemperature,
      value: formatTemperature(result.finalTemperatureC - result.deltaTemperatureC),
    },
    { label: SCENE_COPY.finalTemperature, value: formatTemperature(result.finalTemperatureC) },
    { label: SCENE_COPY.heatingTime, value: `${physicsState.heatingTimeSec} s` },
    { label: SCENE_COPY.power, value: `${physicsState.powerW} W` },
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
