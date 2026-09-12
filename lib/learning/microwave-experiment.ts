import {
  MICROWAVE_COMPARE_OPTIONS,
  MICROWAVE_EXPERIMENT_ID,
} from "@/lib/content/microwave-bread";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import { firstCommittedMicrowavePrediction } from "@/lib/learning/microwave-predict";
import { LearningStage, type ExperimentEvidence, type LearningSession } from "@/types/learning";

export type MicrowaveComparison = "same" | "different" | "partial";

export function isMicrowaveComparison(
  value: string,
): value is MicrowaveComparison {
  return MICROWAVE_COMPARE_OPTIONS.some((option) => option.value === value);
}

export function microwaveComparisonLabel(value: string): string {
  return (
    MICROWAVE_COMPARE_OPTIONS.find((option) => option.value === value)?.label ??
    value
  );
}

export function canRunMicrowaveExperiment(
  session: LearningSession,
): boolean {
  if (session.stage === LearningStage.OBSERVE) {
    return true;
  }
  if (session.stage !== LearningStage.EXPERIMENT) {
    return false;
  }
  return Boolean(firstCommittedMicrowavePrediction(session.predictions));
}

export function authoredBeforeIntervention(
  committedAt: string,
  interventionAt: string,
): boolean {
  return committedAt <= interventionAt;
}

export function isMicrowaveExperimentClosed(evidence: ExperimentEvidence): boolean {
  if (evidence.sufficient === true) {
    return (
      evidence.comparison !== undefined &&
      isMicrowaveComparison(evidence.comparison) &&
      hasOwnWords(evidence.reflection) &&
      evidence.authoredBeforeIntervention === true
    );
  }
  if (!evidence.interventionAt || !evidence.committedAt) {
    return false;
  }
  if (evidence.authoredBeforeIntervention !== true) {
    return false;
  }
  if (!evidence.comparison || !isMicrowaveComparison(evidence.comparison)) {
    return false;
  }
  if (!hasOwnWords(evidence.reflection)) {
    return false;
  }
  const finalTemperature =
    evidence.actualResult?.finalTemperatureC ??
    (evidence.physicsResult &&
    typeof evidence.physicsResult === "object" &&
    "finalTemperatureC" in evidence.physicsResult
      ? Number((evidence.physicsResult as { finalTemperatureC?: unknown }).finalTemperatureC)
      : Number.NaN);
  return Number.isFinite(finalTemperature);
}

export function hasCompletedMicrowaveExperiment(session: LearningSession): boolean {
  return session.experimentEvidence.some(
    (evidence) =>
      (evidence.experimentId ?? MICROWAVE_EXPERIMENT_ID) === MICROWAVE_EXPERIMENT_ID &&
      isMicrowaveExperimentClosed(evidence),
  );
}

export function activeIncompleteMicrowaveEvidence(
  session: LearningSession,
): ExperimentEvidence | undefined {
  return [...session.experimentEvidence]
    .reverse()
    .find(
      (evidence) =>
        (evidence.experimentId ?? MICROWAVE_EXPERIMENT_ID) ===
          MICROWAVE_EXPERIMENT_ID && evidence.sufficient !== true,
    );
}

export function experimentClaimsAlwaysRaisesTemperature(
  _evidence: ExperimentEvidence,
): boolean {
  return false;
}
