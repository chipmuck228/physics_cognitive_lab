import {
  ENGINE_PREDICT_OUTCOMES,
  type EnginePredictOutcome,
  type EngineSceneExperimentId,
} from "@/lib/content/four-stroke-engine";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { PredictionEvidence } from "@/types/learning";

export interface EnginePredictEvaluation {
  hasOutcome: boolean;
  hasReason: boolean;
  sufficient: boolean;
}

export function evaluateEnginePrediction(
  outcome: string,
  reason: string,
): EnginePredictEvaluation {
  const hasOutcome = ENGINE_PREDICT_OUTCOMES.some(
    (option) => option.value === outcome,
  );
  const hasReason = hasOwnWords(reason);

  return {
    hasOutcome,
    hasReason,
    sufficient: hasOutcome && hasReason,
  };
}

export function isEnginePredictOutcome(
  value: string,
): value is EnginePredictOutcome {
  return ENGINE_PREDICT_OUTCOMES.some((option) => option.value === value);
}

export function hasCommittedEnginePrediction(
  predictions: PredictionEvidence[],
  experimentId: EngineSceneExperimentId,
): boolean {
  return Boolean(firstCommittedEnginePrediction(predictions, experimentId));
}

export function firstCommittedEnginePrediction(
  predictions: PredictionEvidence[],
  experimentId: EngineSceneExperimentId,
): PredictionEvidence | undefined {
  return predictions.find(
    (prediction) =>
      prediction.experimentId === experimentId &&
      prediction.committed !== false &&
      evaluateEnginePrediction(prediction.prediction, prediction.reasoning)
        .sufficient,
  );
}

export function latestCommittedEnginePrediction(
  predictions: PredictionEvidence[],
  experimentId: EngineSceneExperimentId,
): PredictionEvidence | undefined {
  return [...predictions]
    .reverse()
    .find(
      (prediction) =>
        prediction.experimentId === experimentId &&
        prediction.committed !== false &&
        evaluateEnginePrediction(prediction.prediction, prediction.reasoning)
          .sufficient,
    );
}

export function enginePredictLabel(outcome: string): string {
  return (
    ENGINE_PREDICT_OUTCOMES.find((option) => option.value === outcome)?.label ??
    outcome
  );
}
