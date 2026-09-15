import { LENS_PREDICT_OUTCOMES, LENS_COPY } from "@/lib/content/convex-lens-optical-bench";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { LensExperimentId } from "@/lib/physics/convex-lens-optical-bench";
import type { PredictionEvidence } from "@/types/learning";

export type LensPredictReasonStance = "" | "has-idea" | "guess-only" | "unknown";

const HONEST_NO_REASON: ReadonlySet<string> = new Set([
  LENS_COPY.reasonUnknown,
  LENS_COPY.reasonGuessOnly,
]);

export function lensPredictReasonForCommit(
  stance: LensPredictReasonStance,
  authored: string,
): string {
  if (stance === "unknown") {
    return LENS_COPY.reasonUnknown;
  }
  if (stance === "guess-only") {
    return LENS_COPY.reasonGuessOnly;
  }
  if (stance === "has-idea") {
    return authored;
  }
  return "";
}

export function lensPredictStanceFromReason(reason: string): LensPredictReasonStance {
  const trimmed = reason.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed === LENS_COPY.reasonUnknown) {
    return "unknown";
  }
  if (trimmed === LENS_COPY.reasonGuessOnly) {
    return "guess-only";
  }
  return "has-idea";
}

export function isLensHonestNoReason(reason: string): boolean {
  return HONEST_NO_REASON.has(reason.trim());
}

export function evaluateLensPrediction(outcome: string, reason: string) {
  const hasOutcome = LENS_PREDICT_OUTCOMES.some((option) => option.value === outcome);
  const honest = isLensHonestNoReason(reason);
  const hasReason = honest || hasOwnWords(reason);
  return {
    hasOutcome,
    hasReason,
    honestUnknown: honest,
    sufficient: hasOutcome && hasReason,
  };
}

export function firstCommittedLensPrediction(
  predictions: PredictionEvidence[],
  experimentId: LensExperimentId,
): PredictionEvidence | undefined {
  return predictions.find(
    (prediction) =>
      prediction.experimentId === experimentId &&
      prediction.committed !== false &&
      evaluateLensPrediction(prediction.prediction, prediction.reasoning).sufficient,
  );
}

export function hasCommittedLensPrediction(
  predictions: PredictionEvidence[],
  experimentId: LensExperimentId,
): boolean {
  return Boolean(firstCommittedLensPrediction(predictions, experimentId));
}

export function lensPredictLabel(outcome: string): string {
  return (
    LENS_PREDICT_OUTCOMES.find((option) => option.value === outcome)?.label ?? outcome
  );
}
