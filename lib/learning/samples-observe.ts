import { SAMPLES_OBSERVE_OPTIONS } from "@/lib/content/equal-volume-material-samples";
import type { ObservationEvidence } from "@/types/learning";

export interface SamplesObserveEvaluation {
  noticedSameSize: boolean;
  noticedMassDifference: boolean;
  sufficient: boolean;
  selectedOptionIds: string[];
}

export function evaluateSamplesObservation(
  selectedOptionIds: readonly string[],
): SamplesObserveEvaluation {
  const selected = new Set(selectedOptionIds);
  const noticedSameSize = selected.has("same-size");
  const noticedMassDifference = selected.has("one-heavier");

  return {
    noticedSameSize,
    noticedMassDifference,
    sufficient: noticedSameSize && noticedMassDifference,
    selectedOptionIds: [...selectedOptionIds],
  };
}

export function hasSufficientSamplesObservation(
  observations: ObservationEvidence[],
): boolean {
  return observations.some((observation) => {
    if (observation.sufficient) {
      return true;
    }
    if (!observation.selectedOptionIds) {
      return false;
    }
    return evaluateSamplesObservation(observation.selectedOptionIds).sufficient;
  });
}

export function samplesObservationLabelsFor(
  selectedOptionIds: readonly string[],
): string {
  return SAMPLES_OBSERVE_OPTIONS.filter((option) =>
    selectedOptionIds.includes(option.id),
  )
    .map((option) => option.label)
    .join("；");
}
