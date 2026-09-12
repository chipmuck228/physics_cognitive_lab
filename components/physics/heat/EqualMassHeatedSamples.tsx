import {
  finalTemperatureC,
  temperatureChangeC,
  type HeatSamplesSceneState,
} from "@/lib/physics/equal-mass-heated-samples";
import { HEAT_COPY } from "@/lib/content/equal-mass-heated-samples";

interface EqualMassHeatedSamplesProps {
  state: HeatSamplesSceneState;
}

export function EqualMassHeatedSamples({ state }: EqualMassHeatedSamplesProps) {
  return (
    <div
      className="space-y-4"
      data-testid="equal-mass-heated-samples"
      data-comparison-mode={state.comparisonMode}
      data-heating-energy={state.heatingEnergy}
      data-temperatures-revealed={state.temperaturesRevealed ? "true" : "false"}
      aria-label={HEAT_COPY.sceneAria}
    >
      <div className="flex flex-wrap items-end justify-center gap-6">
        {state.samples.map((sample) => (
          <div
            key={sample.slotId}
            className="flex flex-col items-center gap-2"
            data-testid={`heat-sample-${sample.slotId}`}
            data-sample-id={sample.sampleId}
            data-mass={sample.massKg}
            data-energy={sample.absorbedEnergyJ}
          >
            <div
              className="h-20 w-24 rounded-md border border-[var(--ink)] bg-[var(--paper)] shadow-sm"
              style={{
                backgroundColor:
                  sample.sampleId === "sand-100g" ? "#d6c09a" : "#c5e4f3",
              }}
              aria-hidden
            />
            <p className="text-sm font-medium text-[var(--ink)]">
              {sample.materialLabel}
            </p>
            <p className="text-xs text-[var(--ink-muted)]">
              {sample.massKg} {HEAT_COPY.massUnit}
            </p>
            {sample.heated ? (
              <p className="text-xs text-[var(--ink)]">
                Q {sample.absorbedEnergyJ} {HEAT_COPY.energyUnit}
              </p>
            ) : (
              <p className="text-xs text-[var(--ink-muted)]">还没加热</p>
            )}
            {state.temperaturesRevealed ? (
              <>
                <p
                  className="text-xs text-[var(--ink)]"
                  data-testid={`heat-sample-${sample.slotId}-temperature-state`}
                  data-temp-initial={sample.initialTemperatureC}
                  data-temp-final={finalTemperatureC(sample)}
                >
                  {`${HEAT_COPY.temperatureStateLabel}：${sample.initialTemperatureC}${HEAT_COPY.tempUnit} → ${finalTemperatureC(sample)}${HEAT_COPY.tempUnit}`}
                </p>
                <p
                  className="text-xs text-[var(--ink-muted)]"
                  data-testid={`heat-sample-${sample.slotId}-temperature-change`}
                  data-temp-delta={temperatureChangeC(sample)}
                >
                  {`${HEAT_COPY.temperatureRiseLabel}：${temperatureChangeC(sample)}${HEAT_COPY.tempUnit}`}
                </p>
              </>
            ) : (
              <p className="text-xs text-[var(--ink-muted)]">温度还没读出来</p>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-[var(--ink-muted)]">{HEAT_COPY.unitsNote}</p>
    </div>
  );
}
