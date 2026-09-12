import {
  densityGPerCm3,
  visibleSamples,
  type DensitySceneState,
} from "@/lib/physics/equal-volume-material-samples";
import { SAMPLES_COPY } from "@/lib/content/equal-volume-material-samples";

interface EqualVolumeSamplesProps {
  state: DensitySceneState;
}

export function EqualVolumeSamples({ state }: EqualVolumeSamplesProps) {
  const samples = visibleSamples(state);

  return (
    <div
      className="space-y-4"
      data-testid="equal-volume-samples"
      data-comparison-mode={state.comparisonMode}
      data-cut-factor={state.cutFactor}
      data-masses-revealed={state.massesRevealed ? "true" : "false"}
      aria-label={SAMPLES_COPY.sceneAria}
    >
      <div className="flex flex-wrap items-end justify-center gap-6">
        {samples.map((sample) => {
          const size = Math.max(48, Math.min(120, Math.sqrt(sample.volumeCm3) * 18));
          return (
            <div
              key={sample.id}
              className="flex flex-col items-center gap-2"
              data-testid={`sample-${sample.id}`}
              data-mass={sample.massG}
              data-volume={sample.volumeCm3}
            >
              <div
                className="rounded-md border border-[var(--ink)] bg-[var(--paper)] shadow-sm"
                style={{ width: size, height: size }}
                aria-hidden
              />
              <p className="text-sm font-medium text-[var(--ink)]">
                {sample.materialLabel}
              </p>
              <p className="text-xs text-[var(--ink-muted)]">
                {SAMPLES_COPY.volumeUnit} {sample.volumeCm3}
              </p>
              {state.massesRevealed ? (
                <p className="text-xs text-[var(--ink)]">
                  {sample.massG} {SAMPLES_COPY.massUnit}
                </p>
              ) : (
                <p className="text-xs text-[var(--ink-muted)]">质量还没读出来</p>
              )}
              {state.massesRevealed && state.comparisonMode !== "observe" ? (
                <p className="text-xs text-[var(--ink-muted)]">
                  ρ {densityGPerCm3(sample)} {SAMPLES_COPY.densityUnit}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-[var(--ink-muted)]">
        {SAMPLES_COPY.unitsNote}
      </p>
    </div>
  );
}
