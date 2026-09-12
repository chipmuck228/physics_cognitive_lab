import { CART_OBSERVE_OPTIONS } from "@/lib/content/horizontal-force-cart";
import type { ObservationEvidence } from "@/types/learning";

export interface CartObserveEvaluation {
  noticedInitialStill: boolean;
  noticedMotionChange: boolean;
  sufficient: boolean;
  selectedOptionIds: string[];
}

export function evaluateCartObservation(
  selectedOptionIds: readonly string[],
): CartObserveEvaluation {
  const selected = new Set(selectedOptionIds);
  const noticedInitialStill = selected.has("initially-still");
  const noticedMotionChange =
    selected.has("started-moving") || selected.has("sped-up");

  return {
    noticedInitialStill,
    noticedMotionChange,
    sufficient: noticedInitialStill && noticedMotionChange,
    selectedOptionIds: [...selectedOptionIds],
  };
}

export function hasSufficientCartObservation(
  observations: ObservationEvidence[],
): boolean {
  return observations.some((observation) => {
    if (observation.sufficient) {
      return true;
    }
    if (!observation.selectedOptionIds) {
      return false;
    }
    return evaluateCartObservation(observation.selectedOptionIds).sufficient;
  });
}

export function cartObservationLabelsFor(
  selectedOptionIds: readonly string[],
): string {
  return CART_OBSERVE_OPTIONS.filter((option) =>
    selectedOptionIds.includes(option.id),
  )
    .map((option) => option.label)
    .join("；");
}
