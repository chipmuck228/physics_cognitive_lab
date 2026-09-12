import { MICROWAVE_OBSERVE_OPTIONS } from "@/lib/content/microwave-bread";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ObservationEvidence } from "@/types/learning";

export interface MicrowaveObserveInput {
  selectedOptionIds: string[];
  studentObservation: string;
}

export interface MicrowaveObserveEvaluation {
  identifiedBreadSystem: boolean;
  hasMeaningfulObservation: boolean;
  sufficient: boolean;
}

export function evaluateMicrowaveObservation(
  input: MicrowaveObserveInput,
): MicrowaveObserveEvaluation {
  const identifiedBreadSystem = input.selectedOptionIds.includes("bread-warmer");
  const hasMeaningfulObservation = hasOwnWords(input.studentObservation);

  return {
    identifiedBreadSystem,
    hasMeaningfulObservation,
    sufficient: identifiedBreadSystem && hasMeaningfulObservation,
  };
}

export function hasSufficientMicrowaveObservation(
  observations: ObservationEvidence[],
): boolean {
  return observations.some((observation) => {
    if (observation.sufficient === true) {
      return true;
    }
    return evaluateMicrowaveObservation({
      selectedOptionIds: observation.selectedOptionIds ?? [],
      studentObservation: observation.text,
    }).sufficient;
  });
}

export function microwaveObservationLabelsFor(
  selectedOptionIds: readonly string[],
): string {
  return MICROWAVE_OBSERVE_OPTIONS.filter((option) =>
    selectedOptionIds.includes(option.id),
  )
    .map((option) => option.label)
    .join("；");
}

export function emptyMicrowaveObserveInput(): MicrowaveObserveInput {
  return {
    selectedOptionIds: [],
    studentObservation: "",
  };
}
