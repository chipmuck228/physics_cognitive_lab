import { HEAT_COMPARE_OPTIONS } from "@/lib/content/equal-mass-heated-samples";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import { firstCommittedHeatPrediction } from "@/lib/learning/heat-predict";
import {
  HEAT_EXPERIMENT_A,
  HEAT_EXPERIMENT_B,
  HEAT_EXPERIMENT_C,
  HEAT_EXPERIMENT_ORDER,
  runHeatExperiment,
  type HeatExperimentId,
  type HeatExperimentResult,
} from "@/lib/physics/equal-mass-heated-samples";
import type { ExperimentEvidence, LearningSession } from "@/types/learning";

export type HeatObservedResult = {
  massComparison: "" | "same" | "water-heavier" | "sand-heavier" | "left-smaller" | "left-larger";
  energyComparison:
    | ""
    | "similar"
    | "water-more"
    | "sand-more"
    | "time-is-q"
    | "larger-mass-more-q"
    | "right-more"
    | "left-more"
    | "same";
  deltaTComparison:
    | ""
    | "sand-larger"
    | "water-larger"
    | "same"
    | "smaller-mass-larger"
    | "larger-mass-larger"
    | "more-energy-larger"
    | "more-energy-smaller";
};

export function emptyHeatObservedResult(): HeatObservedResult {
  return {
    massComparison: "",
    energyComparison: "",
    deltaTComparison: "",
  };
}

export function asHeatObservedResult(
  observed: object | undefined,
): HeatObservedResult {
  if (!observed || typeof observed !== "object") {
    return emptyHeatObservedResult();
  }
  const record = observed as Record<string, unknown>;
  return {
    massComparison: asField(record.massComparison, [
      "same",
      "water-heavier",
      "sand-heavier",
      "left-smaller",
      "left-larger",
    ]),
    energyComparison: asField(record.energyComparison, [
      "similar",
      "water-more",
      "sand-more",
      "time-is-q",
      "larger-mass-more-q",
      "right-more",
      "left-more",
      "same",
    ]),
    deltaTComparison: asField(record.deltaTComparison, [
      "sand-larger",
      "water-larger",
      "same",
      "smaller-mass-larger",
      "larger-mass-larger",
      "more-energy-larger",
      "more-energy-smaller",
    ]),
  };
}

export function hasCompleteHeatObservedResult(
  observed: object | undefined,
): boolean {
  const result = asHeatObservedResult(observed);
  return (
    result.massComparison !== "" &&
    result.energyComparison !== "" &&
    result.deltaTComparison !== ""
  );
}

export function isHeatComparison(
  value: string,
): value is "same" | "different" | "partial" {
  return HEAT_COMPARE_OPTIONS.some((option) => option.value === value);
}

export function heatComparisonLabel(value: string): string {
  return (
    HEAT_COMPARE_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
}

export function canRunHeatExperiment(
  session: LearningSession,
  experimentId: HeatExperimentId,
): boolean {
  const prediction = firstCommittedHeatPrediction(session.predictions, experimentId);
  if (!prediction) {
    return false;
  }
  if (experimentId === HEAT_EXPERIMENT_B) {
    return hasClosedHeatExperiment(session, HEAT_EXPERIMENT_A);
  }
  if (experimentId === HEAT_EXPERIMENT_C) {
    return hasClosedHeatExperiment(session, HEAT_EXPERIMENT_B);
  }
  return true;
}

export function activeIncompleteHeatEvidence(
  session: LearningSession,
  experimentId: HeatExperimentId,
): ExperimentEvidence | undefined {
  return [...session.experimentEvidence]
    .reverse()
    .find(
      (evidence) =>
        evidence.experimentId === experimentId && evidence.sufficient !== true,
    );
}

export function firstClosedHeatEvidence(
  session: LearningSession,
  experimentId: HeatExperimentId,
): ExperimentEvidence | undefined {
  return session.experimentEvidence.find(
    (evidence) =>
      evidence.experimentId === experimentId && isHeatExperimentClosed(evidence),
  );
}

export function isHeatExperimentClosed(evidence: ExperimentEvidence): boolean {
  if (evidence.sufficient === true) {
    return true;
  }
  if (!evidence.experimentId || !evidence.interventionAt || !evidence.physicsResult) {
    return false;
  }
  if (!evidence.authoredBeforeIntervention) {
    return false;
  }
  if (
    !isHeatExperimentId(evidence.experimentId) ||
    !hasCompleteHeatObservedResult(evidence.observedResult)
  ) {
    return false;
  }
  if (!evidence.comparison || !isHeatComparison(evidence.comparison)) {
    return false;
  }
  return hasOwnWords(evidence.reflection);
}

export function hasClosedHeatExperiment(
  session: LearningSession,
  experimentId: HeatExperimentId,
): boolean {
  return session.experimentEvidence.some(
    (evidence) =>
      evidence.experimentId === experimentId && isHeatExperimentClosed(evidence),
  );
}

export function hasCompletedHeatExperiments(session: LearningSession): boolean {
  return HEAT_EXPERIMENT_ORDER.every((experimentId) =>
    hasClosedHeatExperiment(session, experimentId),
  );
}

export function activeHeatExperimentId(
  session: LearningSession,
): HeatExperimentId | null {
  if (!hasClosedHeatExperiment(session, HEAT_EXPERIMENT_A)) {
    return HEAT_EXPERIMENT_A;
  }
  if (!hasClosedHeatExperiment(session, HEAT_EXPERIMENT_B)) {
    return HEAT_EXPERIMENT_B;
  }
  if (!hasClosedHeatExperiment(session, HEAT_EXPERIMENT_C)) {
    return HEAT_EXPERIMENT_C;
  }
  return null;
}

export function runSceneHeatExperiment(
  experimentId: HeatExperimentId,
): HeatExperimentResult {
  return runHeatExperiment(experimentId);
}

export function authoredBeforeIntervention(
  committedAt: string,
  interventionAt: string,
): boolean {
  return committedAt <= interventionAt;
}

export function heatClosedExperimentReflection(
  session: LearningSession,
  experimentId: HeatExperimentId,
): string | null {
  const evidence = firstClosedHeatEvidence(session, experimentId);
  const reflection = evidence?.reflection?.trim();
  return reflection ? reflection : null;
}

function isHeatExperimentId(value: string): value is HeatExperimentId {
  return (HEAT_EXPERIMENT_ORDER as readonly string[]).includes(value);
}

function asField<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T | "" {
  return allowed.includes(value as T) ? (value as T) : "";
}
