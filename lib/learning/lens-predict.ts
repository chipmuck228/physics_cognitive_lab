import { LENS_PREDICT_OUTCOMES } from "@/lib/content/convex-lens-optical-bench";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { LensExperimentId } from "@/lib/physics/convex-lens-optical-bench";
import type { PredictionEvidence } from "@/types/learning";

export function evaluateLensPrediction(outcome: string, reason: string) {
  const hasOutcome = LENS_PREDICT_OUTCOMES.some((option) => option.value === outcome);
  const hasReason = hasOwnWords(reason);
  return {
    hasOutcome,
    hasReason,
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
