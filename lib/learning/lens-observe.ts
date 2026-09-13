import { LENS_COPY, LENS_OBSERVE_OPTIONS } from "@/lib/content/convex-lens-optical-bench";
import { lensWatchedObserveDemo } from "@/lib/learning/lens-scene-data";
import type { LearningSession, ObservationEvidence } from "@/types/learning";

export type LensObserveMissingKind = "interaction" | "record";

export function evaluateLensObservationRecord(selectedOptionIds: readonly string[]) {
  const selected = new Set(selectedOptionIds);
  const screenCanChange = selected.has("screen-can-change");
  const sizeCanChange = selected.has("size-can-change");
  const screenNotAlways = selected.has("screen-not-always");
  return {
    screenCanChange,
    sizeCanChange,
    screenNotAlways,
    recordComplete: screenCanChange && sizeCanChange && screenNotAlways,
    selectedOptionIds: [...selectedOptionIds],
  };
}

/** Checkbox completeness only. Eligibility also requires a bench interaction. */
export function evaluateLensObservation(selectedOptionIds: readonly string[]) {
  const record = evaluateLensObservationRecord(selectedOptionIds);
  return {
    ...record,
    sufficient: record.recordComplete,
  };
}

export function evaluateLensObservationEligibility(
  selectedOptionIds: readonly string[],
  performedInteraction: boolean,
) {
  const record = evaluateLensObservationRecord(selectedOptionIds);
  const missingKind: LensObserveMissingKind | null = !performedInteraction
    ? "interaction"
    : record.recordComplete
      ? null
      : "record";
  return {
    ...record,
    performedInteraction,
    sufficient: performedInteraction && record.recordComplete,
    missingKind,
  };
}

export function lensPerformedObserveInteraction(session: LearningSession): boolean {
  return lensWatchedObserveDemo(session);
}

export function lensObserveMissingMessage(
  missingKind: LensObserveMissingKind | null,
): string {
  if (missingKind === "interaction") {
    return LENS_COPY.observeNeedInteraction;
  }
  if (missingKind === "record") {
    return LENS_COPY.observeNeedRecord;
  }
  return LENS_COPY.observeNeedRecord;
}

export function hasSufficientLensObservation(
  observations: ObservationEvidence[],
): boolean {
  return observations.some(
    (observation) =>
      observation.sufficient === true && observation.watchedFullCycle === true,
  );
}

export function lensObservationLabelsFor(selectedOptionIds: readonly string[]): string {
  return LENS_OBSERVE_OPTIONS.filter((option) => selectedOptionIds.includes(option.id))
    .map((option) => option.label)
    .join("；");
}
