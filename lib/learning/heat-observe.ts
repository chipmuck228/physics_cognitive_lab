import { HEAT_OBSERVE_OPTIONS } from "@/lib/content/equal-mass-heated-samples";
import type { ObservationEvidence } from "@/types/learning";

export interface HeatObserveEvaluation {
  noticedSameMass: boolean;
  noticedDifferentRise: boolean;
  sufficient: boolean;
  selectedOptionIds: string[];
}

export function evaluateHeatObservation(
  selectedOptionIds: readonly string[],
): HeatObserveEvaluation {
  const selected = new Set(selectedOptionIds);
  const noticedSameMass = selected.has("same-mass");
  const noticedDifferentRise = selected.has("different-rise");

  return {
    noticedSameMass,
    noticedDifferentRise,
    sufficient: noticedSameMass && noticedDifferentRise,
    selectedOptionIds: [...selectedOptionIds],
  };
}

export function hasSufficientHeatObservation(
  observations: ObservationEvidence[],
): boolean {
  return observations.some((observation) => {
    if (observation.sufficient) {
      return true;
    }
    if (!observation.selectedOptionIds) {
      return false;
    }
    return evaluateHeatObservation(observation.selectedOptionIds).sufficient;
  });
}

export function heatObservationLabelsFor(
  selectedOptionIds: readonly string[],
): string {
  return HEAT_OBSERVE_OPTIONS.filter((option) =>
    selectedOptionIds.includes(option.id),
  )
    .map((option) => option.label)
    .join("；");
}
