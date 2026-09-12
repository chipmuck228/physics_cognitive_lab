import { hasSufficientMicrowaveDescription } from "@/lib/learning/microwave-describe";
import {
  hasAcceptedMicrowaveAiOffChallenges,
  microwaveTutorUsedDuringIndependent,
} from "@/lib/learning/microwave-ai-off";
import { hasSufficientMicrowaveExplanation } from "@/lib/learning/microwave-explain";
import { hasCompletedMicrowaveModel } from "@/lib/learning/microwave-model";
import { hasSufficientMicrowaveObservation } from "@/lib/learning/microwave-observe";
import { hasCompletedMicrowaveTransfer } from "@/lib/learning/microwave-transfer";
import type { AccumulatedModelEvidence } from "@/lib/physics-models/evidence";
import type { LearningSession } from "@/types/learning";

/**
 * Scene 01 writes evidence flags only. Official L1–L6 come from
 * deriveModelEvidenceLevel. This helper never returns a level string.
 */
export function accumulateMicrowaveSceneEvidence(
  session: LearningSession,
): AccumulatedModelEvidence {
  const observed =
    hasSufficientMicrowaveObservation(session.observations) &&
    hasSufficientMicrowaveDescription(session.descriptions);
  const identifiedQuantities = hasSufficientMicrowaveDescription(session.descriptions);
  const identifiedRelations = hasSufficientMicrowaveExplanation(session.explanations);
  const constructedValidCausalModel = hasCompletedMicrowaveModel(session.modelAttempts);
  const successfulTransfer =
    constructedValidCausalModel &&
    hasCompletedMicrowaveTransfer(session.transferAttempts);
  const tutorUsed = microwaveTutorUsedDuringIndependent(session);
  const llmUsed = session.independentAssessment?.llmUsed;
  const llmDisabled = llmUsed === false && !tutorUsed;
  const independentSuccess =
    hasAcceptedMicrowaveAiOffChallenges(session.independentAssessment) && llmDisabled;
  const hasIndependentAttempts = Boolean(
    session.independentAssessment?.challengeAttempts?.length,
  );

  return {
    observedPhenomenon: observed || undefined,
    identifiedQuantities: identifiedQuantities || undefined,
    identifiedRelations: identifiedRelations || undefined,
    constructedValidCausalModel: constructedValidCausalModel || undefined,
    successfulTransfer: successfulTransfer || undefined,
    independentAiOffSuccess: independentSuccess || undefined,
    llmDisabledDuringIndependent: hasIndependentAttempts ? llmDisabled : undefined,
  };
}
