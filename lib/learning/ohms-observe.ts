import { OHMS_OBSERVE_OPTIONS } from "@/lib/content/simple-resistor-circuit";
import type { ObservationEvidence } from "@/types/learning";

export function evaluateOhmsObservation(selectedOptionIds: readonly string[]) {
  const selected = new Set(selectedOptionIds);
  const threeQuantities = selected.has("three-quantities");
  const readingsDiffer = selected.has("readings-differ");
  const openCurrentZero = selected.has("open-current-zero");
  return {
    threeQuantities,
    readingsDiffer,
    openCurrentZero,
    sufficient: threeQuantities && readingsDiffer && openCurrentZero,
    selectedOptionIds: [...selectedOptionIds],
  };
}

export function hasSufficientOhmsObservation(
  observations: ObservationEvidence[],
): boolean {
  return observations.some((observation) => {
    if (observation.sufficient) {
      return true;
    }
    if (!observation.selectedOptionIds) {
      return false;
    }
    return evaluateOhmsObservation(observation.selectedOptionIds).sufficient;
  });
}

export function ohmsObservationLabelsFor(selectedOptionIds: readonly string[]): string {
  return OHMS_OBSERVE_OPTIONS.filter((option) => selectedOptionIds.includes(option.id))
    .map((option) => option.label)
    .join("；");
}
