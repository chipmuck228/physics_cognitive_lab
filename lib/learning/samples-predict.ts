import { SAMPLES_PREDICT_OUTCOMES } from "@/lib/content/equal-volume-material-samples";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { SamplesExperimentId } from "@/lib/physics/equal-volume-material-samples";
import type { PredictionEvidence } from "@/types/learning";

export interface SamplesPredictEvaluation {
  hasOutcome: boolean;
  hasReason: boolean;
  sufficient: boolean;
}

export function evaluateSamplesPrediction(
  outcome: string,
  reason: string,
): SamplesPredictEvaluation {
  const hasOutcome = SAMPLES_PREDICT_OUTCOMES.some(
    (option) => option.value === outcome,
  );
  const hasReason = hasOwnWords(reason);

  return {
    hasOutcome,
    hasReason,
    sufficient: hasOutcome && hasReason,
  };
}

export function firstCommittedSamplesPrediction(
  predictions: PredictionEvidence[],
  experimentId: SamplesExperimentId,
): PredictionEvidence | undefined {
  return predictions.find(
    (prediction) =>
      prediction.experimentId === experimentId &&
      prediction.committed !== false &&
      evaluateSamplesPrediction(prediction.prediction, prediction.reasoning)
        .sufficient,
  );
}

export function hasCommittedSamplesPrediction(
  predictions: PredictionEvidence[],
  experimentId: SamplesExperimentId,
): boolean {
  return Boolean(firstCommittedSamplesPrediction(predictions, experimentId));
}

export function samplesPredictLabel(outcome: string): string {
  return (
    SAMPLES_PREDICT_OUTCOMES.find((option) => option.value === outcome)?.label ??
    outcome
  );
}
