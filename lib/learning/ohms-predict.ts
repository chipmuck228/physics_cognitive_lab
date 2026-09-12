import { OHMS_PREDICT_OUTCOMES } from "@/lib/content/simple-resistor-circuit";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { OhmsExperimentId } from "@/lib/physics/simple-resistor-circuit";
import type { PredictionEvidence } from "@/types/learning";

export function evaluateOhmsPrediction(outcome: string, reason: string) {
  const hasOutcome = OHMS_PREDICT_OUTCOMES.some((option) => option.value === outcome);
  const hasReason = hasOwnWords(reason);
  return {
    hasOutcome,
    hasReason,
    sufficient: hasOutcome && hasReason,
  };
}

export function firstCommittedOhmsPrediction(
  predictions: PredictionEvidence[],
  experimentId: OhmsExperimentId,
): PredictionEvidence | undefined {
  return predictions.find(
    (prediction) =>
      prediction.experimentId === experimentId &&
      prediction.committed !== false &&
      evaluateOhmsPrediction(prediction.prediction, prediction.reasoning).sufficient,
  );
}

export function hasCommittedOhmsPrediction(
  predictions: PredictionEvidence[],
  experimentId: OhmsExperimentId,
): boolean {
  return Boolean(firstCommittedOhmsPrediction(predictions, experimentId));
}

export function ohmsPredictLabel(outcome: string): string {
  return (
    OHMS_PREDICT_OUTCOMES.find((option) => option.value === outcome)?.label ?? outcome
  );
}
