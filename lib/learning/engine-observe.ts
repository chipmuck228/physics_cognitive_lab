import {
  ENGINE_OBSERVE_OPTIONS,
  type EngineObserveOption,
} from "@/lib/content/four-stroke-engine";
import type { ObservationEvidence } from "@/types/learning";

export interface EngineObserveEvaluation {
  noticedPistonMotion: boolean;
  noticedValveOrCombustion: boolean;
  sufficient: boolean;
  selectedOptionIds: string[];
}

/**
 * OBSERVE gate for the four-stroke engine.
 *
 * Required:
 * - piston motion: 活塞会上下运动
 * - AND at least one of: intake opens, exhaust opens, combustion on one stage
 *
 * Autoplay / watchedFullCycle is not sufficient.
 * Distractors never satisfy the gate.
 */
export function evaluateEngineObservation(
  selectedOptionIds: readonly string[],
): EngineObserveEvaluation {
  const selected = new Set(selectedOptionIds);
  const noticedPistonMotion = selected.has("piston-up-down");
  const noticedValveOrCombustion =
    selected.has("intake-opens") ||
    selected.has("exhaust-opens") ||
    selected.has("combustion-one-stage");

  return {
    noticedPistonMotion,
    noticedValveOrCombustion,
    sufficient: noticedPistonMotion && noticedValveOrCombustion,
    selectedOptionIds: [...selectedOptionIds],
  };
}

export function hasSufficientEngineObservation(
  observations: ObservationEvidence[],
): boolean {
  return observations.some((observation) => {
    if (observation.sufficient) {
      return true;
    }
    if (!observation.selectedOptionIds) {
      return false;
    }
    return evaluateEngineObservation(observation.selectedOptionIds).sufficient;
  });
}

export function observationLabelsFor(
  selectedOptionIds: readonly string[],
): string {
  return ENGINE_OBSERVE_OPTIONS.filter((option) =>
    selectedOptionIds.includes(option.id),
  )
    .map((option: EngineObserveOption) => option.label)
    .join("；");
}
