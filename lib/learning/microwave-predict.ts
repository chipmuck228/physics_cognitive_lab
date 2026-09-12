import { MICROWAVE_EXPERIMENT_ID, PREDICTION_OPTIONS } from "@/lib/content/microwave-bread";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { PredictionEvidence } from "@/types/learning";

export interface MicrowavePredictEvaluation {
  hasOutcome: boolean;
  hasReason: boolean;
  sufficient: boolean;
}

export function evaluateMicrowavePrediction(
  outcome: string,
  reason: string,
): MicrowavePredictEvaluation {
  const hasOutcome = PREDICTION_OPTIONS.some((option) => option.value === outcome);
  const hasReason = hasOwnWords(reason);

  return {
    hasOutcome,
    hasReason,
    sufficient: hasOutcome && hasReason,
  };
}

export function firstCommittedMicrowavePrediction(
  predictions: PredictionEvidence[],
  experimentId: string = MICROWAVE_EXPERIMENT_ID,
): PredictionEvidence | undefined {
  return predictions.find(
    (prediction) =>
      (prediction.experimentId ?? MICROWAVE_EXPERIMENT_ID) === experimentId &&
      prediction.committed !== false &&
      evaluateMicrowavePrediction(prediction.prediction, prediction.reasoning).sufficient,
  );
}

export function hasCommittedMicrowavePrediction(
  predictions: PredictionEvidence[],
  experimentId: string = MICROWAVE_EXPERIMENT_ID,
): boolean {
  return Boolean(firstCommittedMicrowavePrediction(predictions, experimentId));
}

export function microwavePredictLabel(outcome: string): string {
  return (
    PREDICTION_OPTIONS.find((option) => option.value === outcome)?.label ?? outcome
  );
}
