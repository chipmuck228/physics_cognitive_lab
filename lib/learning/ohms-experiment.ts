import { OHMS_COMPARE_OPTIONS } from "@/lib/content/simple-resistor-circuit";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import { firstCommittedOhmsPrediction } from "@/lib/learning/ohms-predict";
import {
  OHMS_EXPERIMENT_A,
  OHMS_EXPERIMENT_B,
  OHMS_EXPERIMENT_ORDER,
  runOhmsExperiment,
  type OhmsExperimentId,
  type OhmsExperimentResult,
} from "@/lib/physics/simple-resistor-circuit";
import type { ExperimentEvidence, LearningSession } from "@/types/learning";

export type OhmsObservedResult = {
  heldQuantity: "" | "resistance" | "voltage" | "neither";
  currentChange: "" | "larger" | "smaller" | "same" | "unsure";
};

export function emptyOhmsObservedResult(): OhmsObservedResult {
  return { heldQuantity: "", currentChange: "" };
}

export function asOhmsObservedResult(observed: object | undefined): OhmsObservedResult {
  if (!observed || typeof observed !== "object") {
    return emptyOhmsObservedResult();
  }
  const record = observed as Record<string, unknown>;
  return {
    heldQuantity: asField(record.heldQuantity, ["resistance", "voltage", "neither"]),
    currentChange: asField(record.currentChange, ["larger", "smaller", "same", "unsure"]),
  };
}

export function hasCompleteOhmsObservedResult(observed: object | undefined): boolean {
  const result = asOhmsObservedResult(observed);
  return result.heldQuantity !== "" && result.currentChange !== "";
}

export function isOhmsComparison(
  value: string,
): value is "same" | "different" | "partial" {
  return OHMS_COMPARE_OPTIONS.some((option) => option.value === value);
}

export function ohmsComparisonLabel(value: string): string {
  return (
    OHMS_COMPARE_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
}

export function canRunOhmsExperiment(
  session: LearningSession,
  experimentId: OhmsExperimentId,
): boolean {
  const prediction = firstCommittedOhmsPrediction(session.predictions, experimentId);
  if (!prediction) {
    return false;
  }
  if (experimentId === OHMS_EXPERIMENT_B) {
    return hasClosedOhmsExperiment(session, OHMS_EXPERIMENT_A);
  }
  return true;
}

export function activeIncompleteOhmsEvidence(
  session: LearningSession,
  experimentId: OhmsExperimentId,
): ExperimentEvidence | undefined {
  return [...session.experimentEvidence]
    .reverse()
    .find(
      (evidence) =>
        evidence.experimentId === experimentId && evidence.sufficient !== true,
    );
}

export function firstClosedOhmsEvidence(
  session: LearningSession,
  experimentId: OhmsExperimentId,
): ExperimentEvidence | undefined {
  return session.experimentEvidence.find(
    (evidence) =>
      evidence.experimentId === experimentId && isOhmsExperimentClosed(evidence),
  );
}

export function isOhmsExperimentClosed(evidence: ExperimentEvidence): boolean {
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
    !isOhmsExperimentId(evidence.experimentId) ||
    !hasCompleteOhmsObservedResult(evidence.observedResult)
  ) {
    return false;
  }
  if (!evidence.comparison || !isOhmsComparison(evidence.comparison)) {
    return false;
  }
  return hasOwnWords(evidence.reflection);
}

export function hasClosedOhmsExperiment(
  session: LearningSession,
  experimentId: OhmsExperimentId,
): boolean {
  return session.experimentEvidence.some(
    (evidence) =>
      evidence.experimentId === experimentId && isOhmsExperimentClosed(evidence),
  );
}

export function hasCompletedOhmsExperiments(session: LearningSession): boolean {
  return OHMS_EXPERIMENT_ORDER.every((experimentId) =>
    hasClosedOhmsExperiment(session, experimentId),
  );
}

export function ohmsClosedExperimentReflection(
  session: LearningSession,
  experimentId: OhmsExperimentId,
): string | undefined {
  return firstClosedOhmsEvidence(session, experimentId)?.reflection;
}

export function activeOhmsExperimentId(
  session: LearningSession,
): OhmsExperimentId | null {
  if (!hasClosedOhmsExperiment(session, OHMS_EXPERIMENT_A)) {
    return OHMS_EXPERIMENT_A;
  }
  if (!hasClosedOhmsExperiment(session, OHMS_EXPERIMENT_B)) {
    return OHMS_EXPERIMENT_B;
  }
  return null;
}

export function runSceneOhmsExperiment(
  experimentId: OhmsExperimentId,
): OhmsExperimentResult {
  return runOhmsExperiment(experimentId);
}

export function authoredBeforeIntervention(
  committedAt: string,
  interventionAt: string,
): boolean {
  return committedAt <= interventionAt;
}

function isOhmsExperimentId(value: string): value is OhmsExperimentId {
  return (OHMS_EXPERIMENT_ORDER as readonly string[]).includes(value);
}

function asField<T extends string>(value: unknown, allowed: readonly T[]): T | "" {
  return allowed.includes(value as T) ? (value as T) : "";
}
