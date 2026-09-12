import { LENS_OBSERVE_OPTIONS } from "@/lib/content/convex-lens-optical-bench";
import type { ObservationEvidence } from "@/types/learning";

export function evaluateLensObservation(selectedOptionIds: readonly string[]) {
  const selected = new Set(selectedOptionIds);
  const screenCanChange = selected.has("screen-can-change");
  const sizeCanChange = selected.has("size-can-change");
  const screenNotAlways = selected.has("screen-not-always");
  return {
    screenCanChange,
    sizeCanChange,
    screenNotAlways,
    sufficient: screenCanChange && sizeCanChange && screenNotAlways,
    selectedOptionIds: [...selectedOptionIds],
  };
}

export function hasSufficientLensObservation(
  observations: ObservationEvidence[],
): boolean {
  return observations.some((observation) => {
    if (observation.sufficient) {
      return true;
    }
    if (!observation.selectedOptionIds) {
      return false;
    }
    return evaluateLensObservation(observation.selectedOptionIds).sufficient;
  });
}

export function lensObservationLabelsFor(selectedOptionIds: readonly string[]): string {
  return LENS_OBSERVE_OPTIONS.filter((option) => selectedOptionIds.includes(option.id))
    .map((option) => option.label)
    .join("；");
}
