import { SAMPLES_COMPARE_OPTIONS } from "@/lib/content/equal-volume-material-samples";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import { firstCommittedSamplesPrediction } from "@/lib/learning/samples-predict";
import {
  SAMPLES_EXPERIMENT_A,
  SAMPLES_EXPERIMENT_B,
  SAMPLES_EXPERIMENT_C,
  SAMPLES_EXPERIMENT_ORDER,
  runSamplesExperiment,
  type SamplesExperimentId,
  type SamplesExperimentResult,
} from "@/lib/physics/equal-volume-material-samples";
import type { ExperimentEvidence, LearningSession } from "@/types/learning";

export type SamplesObservedResult = {
  massComparison: "" | "iron-heavier" | "wood-heavier" | "same" | "metal-heavier" | "plastic-heavier";
  volumeComparison:
    | ""
    | "same"
    | "iron-larger"
    | "wood-larger"
    | "plastic-larger"
    | "metal-larger";
  densityComparison:
    | ""
    | "iron-denser"
    | "wood-denser"
    | "same"
    | "metal-denser"
    | "plastic-denser";
  massChange: "" | "half" | "unchanged" | "gone";
  volumeChange: "" | "half" | "unchanged" | "gone";
  densityChange: "" | "unchanged" | "half" | "smaller";
  togetherChange: "" | "same-proportion" | "only-mass" | "only-volume" | "both-so-density-down";
};

export function emptySamplesObservedResult(): SamplesObservedResult {
  return {
    massComparison: "",
    volumeComparison: "",
    densityComparison: "",
    massChange: "",
    volumeChange: "",
    densityChange: "",
    togetherChange: "",
  };
}

export function asSamplesObservedResult(
  observed: object | undefined,
): SamplesObservedResult {
  if (!observed || typeof observed !== "object") {
    return emptySamplesObservedResult();
  }
  const record = observed as Record<string, unknown>;
  return {
    massComparison: asField(record.massComparison, [
      "iron-heavier",
      "wood-heavier",
      "same",
      "metal-heavier",
      "plastic-heavier",
    ]),
    volumeComparison: asField(record.volumeComparison, [
      "same",
      "iron-larger",
      "wood-larger",
      "plastic-larger",
      "metal-larger",
    ]),
    densityComparison: asField(record.densityComparison, [
      "iron-denser",
      "wood-denser",
      "same",
      "metal-denser",
      "plastic-denser",
    ]),
    massChange: asField(record.massChange, ["half", "unchanged", "gone"]),
    volumeChange: asField(record.volumeChange, ["half", "unchanged", "gone"]),
    densityChange: asField(record.densityChange, ["unchanged", "half", "smaller"]),
    togetherChange: asField(record.togetherChange, [
      "same-proportion",
      "only-mass",
      "only-volume",
      "both-so-density-down",
    ]),
  };
}

export function hasCompleteSamplesObservedResult(
  experimentId: SamplesExperimentId,
  observed: object | undefined,
): boolean {
  const result = asSamplesObservedResult(observed);
  if (experimentId === SAMPLES_EXPERIMENT_C) {
    return (
      result.massChange !== "" &&
      result.volumeChange !== "" &&
      result.densityChange !== "" &&
      result.togetherChange !== ""
    );
  }
  return (
    result.massComparison !== "" &&
    result.volumeComparison !== "" &&
    result.densityComparison !== ""
  );
}

export function isSamplesComparison(
  value: string,
): value is "same" | "different" | "partial" {
  return SAMPLES_COMPARE_OPTIONS.some((option) => option.value === value);
}

export function samplesComparisonLabel(value: string): string {
  return (
    SAMPLES_COMPARE_OPTIONS.find((option) => option.value === value)?.label ??
    value
  );
}

export function canRunSamplesExperiment(
  session: LearningSession,
  experimentId: SamplesExperimentId,
): boolean {
  const prediction = firstCommittedSamplesPrediction(
    session.predictions,
    experimentId,
  );
  if (!prediction) {
    return false;
  }
  if (experimentId === SAMPLES_EXPERIMENT_B) {
    return hasClosedSamplesExperiment(session, SAMPLES_EXPERIMENT_A);
  }
  if (experimentId === SAMPLES_EXPERIMENT_C) {
    return hasClosedSamplesExperiment(session, SAMPLES_EXPERIMENT_B);
  }
  return true;
}

export function activeIncompleteSamplesEvidence(
  session: LearningSession,
  experimentId: SamplesExperimentId,
): ExperimentEvidence | undefined {
  return [...session.experimentEvidence]
    .reverse()
    .find(
      (evidence) =>
        evidence.experimentId === experimentId && evidence.sufficient !== true,
    );
}

export function firstClosedSamplesEvidence(
  session: LearningSession,
  experimentId: SamplesExperimentId,
): ExperimentEvidence | undefined {
  return session.experimentEvidence.find(
    (evidence) =>
      evidence.experimentId === experimentId &&
      isSamplesExperimentClosed(evidence),
  );
}

export function isSamplesExperimentClosed(evidence: ExperimentEvidence): boolean {
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
    !isSamplesExperimentId(evidence.experimentId) ||
    !hasCompleteSamplesObservedResult(evidence.experimentId, evidence.observedResult)
  ) {
    return false;
  }
  if (!evidence.comparison || !isSamplesComparison(evidence.comparison)) {
    return false;
  }
  return hasOwnWords(evidence.reflection);
}

export function hasClosedSamplesExperiment(
  session: LearningSession,
  experimentId: SamplesExperimentId,
): boolean {
  return session.experimentEvidence.some(
    (evidence) =>
      evidence.experimentId === experimentId && isSamplesExperimentClosed(evidence),
  );
}

export function hasCompletedSamplesExperiments(session: LearningSession): boolean {
  return SAMPLES_EXPERIMENT_ORDER.every((experimentId) =>
    hasClosedSamplesExperiment(session, experimentId),
  );
}

export function activeSamplesExperimentId(
  session: LearningSession,
): SamplesExperimentId | null {
  if (!hasClosedSamplesExperiment(session, SAMPLES_EXPERIMENT_A)) {
    return SAMPLES_EXPERIMENT_A;
  }
  if (!hasClosedSamplesExperiment(session, SAMPLES_EXPERIMENT_B)) {
    return SAMPLES_EXPERIMENT_B;
  }
  if (!hasClosedSamplesExperiment(session, SAMPLES_EXPERIMENT_C)) {
    return SAMPLES_EXPERIMENT_C;
  }
  return null;
}

export function runSceneSamplesExperiment(
  experimentId: SamplesExperimentId,
): SamplesExperimentResult {
  return runSamplesExperiment(experimentId);
}

export function authoredBeforeIntervention(
  committedAt: string,
  interventionAt: string,
): boolean {
  return committedAt <= interventionAt;
}

export function samplesClosedExperimentReflection(
  session: LearningSession,
  experimentId: SamplesExperimentId,
): string | null {
  const evidence = firstClosedSamplesEvidence(session, experimentId);
  const reflection = evidence?.reflection?.trim();
  return reflection ? reflection : null;
}

function isSamplesExperimentId(value: string): value is SamplesExperimentId {
  return (SAMPLES_EXPERIMENT_ORDER as readonly string[]).includes(value);
}

function asField<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T | "" {
  return allowed.includes(value as T) ? (value as T) : "";
}
