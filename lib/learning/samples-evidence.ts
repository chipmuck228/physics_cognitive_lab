import { hasSufficientSamplesDescription } from "@/lib/learning/samples-describe";
import {
  hasAcceptedSamplesAiOffChallenges,
  samplesTutorUsedDuringIndependent,
} from "@/lib/learning/samples-ai-off";
import { hasSufficientSamplesExplanation } from "@/lib/learning/samples-explain";
import { hasCompletedSamplesModel } from "@/lib/learning/samples-model";
import { hasSufficientSamplesObservation } from "@/lib/learning/samples-observe";
import { hasCompletedSamplesTransfer } from "@/lib/learning/samples-transfer";
import type { AccumulatedModelEvidence } from "@/lib/physics-models/evidence";
import type { LearningSession } from "@/types/learning";

/**
 * Scene 04 writes evidence flags only. Official L1–L6 come from
 * deriveModelEvidenceLevel. This helper never returns a level string.
 */
export function accumulateSamplesSceneEvidence(
  session: LearningSession,
): AccumulatedModelEvidence {
  const observed =
    hasSufficientSamplesObservation(session.observations) &&
    hasSufficientSamplesDescription(session.descriptions);
  const identifiedQuantities = hasSufficientSamplesDescription(session.descriptions);
  const identifiedRelations = hasSufficientSamplesExplanation(session.explanations);
  const constructedValidCausalModel = hasCompletedSamplesModel(session.modelAttempts);
  const successfulTransfer =
    constructedValidCausalModel &&
    hasCompletedSamplesTransfer(session.transferAttempts);
  const tutorUsed = samplesTutorUsedDuringIndependent(session);
  const llmUsed = session.independentAssessment?.llmUsed;
  const llmDisabled = llmUsed === false && !tutorUsed;
  const independentSuccess =
    hasAcceptedSamplesAiOffChallenges(session.independentAssessment) &&
    llmDisabled;
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
