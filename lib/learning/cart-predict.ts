import { CART_PREDICT_OUTCOMES } from "@/lib/content/horizontal-force-cart";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { CartExperimentId } from "@/lib/physics/horizontal-force-cart";
import type { PredictionEvidence } from "@/types/learning";

export interface CartPredictEvaluation {
  hasOutcome: boolean;
  hasReason: boolean;
  sufficient: boolean;
}

export function evaluateCartPrediction(
  outcome: string,
  reason: string,
): CartPredictEvaluation {
  const hasOutcome = CART_PREDICT_OUTCOMES.some(
    (option) => option.value === outcome,
  );
  const hasReason = hasOwnWords(reason);

  return {
    hasOutcome,
    hasReason,
    sufficient: hasOutcome && hasReason,
  };
}

export function firstCommittedCartPrediction(
  predictions: PredictionEvidence[],
  experimentId: CartExperimentId,
): PredictionEvidence | undefined {
  return predictions.find(
    (prediction) =>
      prediction.experimentId === experimentId &&
      prediction.committed !== false &&
      evaluateCartPrediction(prediction.prediction, prediction.reasoning)
        .sufficient,
  );
}

export function hasCommittedCartPrediction(
  predictions: PredictionEvidence[],
  experimentId: CartExperimentId,
): boolean {
  return Boolean(firstCommittedCartPrediction(predictions, experimentId));
}

export function cartPredictLabel(outcome: string): string {
  return (
    CART_PREDICT_OUTCOMES.find((option) => option.value === outcome)?.label ??
    outcome
  );
}
