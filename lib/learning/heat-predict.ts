import { HEAT_PREDICT_OUTCOMES } from "@/lib/content/equal-mass-heated-samples";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { HeatExperimentId } from "@/lib/physics/equal-mass-heated-samples";
import type { PredictionEvidence } from "@/types/learning";

export interface HeatPredictEvaluation {
  hasOutcome: boolean;
  hasReason: boolean;
  sufficient: boolean;
}

export function evaluateHeatPrediction(
  outcome: string,
  reason: string,
): HeatPredictEvaluation {
  const hasOutcome = HEAT_PREDICT_OUTCOMES.some(
    (option) => option.value === outcome,
  );
  const hasReason = hasOwnWords(reason);

  return {
    hasOutcome,
    hasReason,
    sufficient: hasOutcome && hasReason,
  };
}

export function firstCommittedHeatPrediction(
  predictions: PredictionEvidence[],
  experimentId: HeatExperimentId,
): PredictionEvidence | undefined {
  return predictions.find(
    (prediction) =>
      prediction.experimentId === experimentId &&
      prediction.committed !== false &&
      evaluateHeatPrediction(prediction.prediction, prediction.reasoning).sufficient,
  );
}

export function hasCommittedHeatPrediction(
  predictions: PredictionEvidence[],
  experimentId: HeatExperimentId,
): boolean {
  return Boolean(firstCommittedHeatPrediction(predictions, experimentId));
}

export function heatPredictLabel(outcome: string): string {
  return (
    HEAT_PREDICT_OUTCOMES.find((option) => option.value === outcome)?.label ??
    outcome
  );
}
