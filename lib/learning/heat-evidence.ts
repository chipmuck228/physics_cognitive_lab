import { hasSufficientHeatDescription } from "@/lib/learning/heat-describe";
import {
  hasAcceptedHeatAiOffChallenges,
  heatTutorUsedDuringIndependent,
} from "@/lib/learning/heat-ai-off";
import { hasSufficientHeatExplanation } from "@/lib/learning/heat-explain";
import { hasCompletedHeatModel } from "@/lib/learning/heat-model";
import { hasSufficientHeatObservation } from "@/lib/learning/heat-observe";
import { hasCompletedHeatTransfer } from "@/lib/learning/heat-transfer";
import type { AccumulatedModelEvidence } from "@/lib/physics-models/evidence";
import type { LearningSession } from "@/types/learning";

/**
 * Scene 05 writes evidence flags only. Official L1–L6 come from
 * deriveModelEvidenceLevel. This helper never returns a level string.
 */
export function accumulateHeatSceneEvidence(
  session: LearningSession,
): AccumulatedModelEvidence {
  const observed =
    hasSufficientHeatObservation(session.observations) &&
    hasSufficientHeatDescription(session.descriptions);
  const identifiedQuantities = hasSufficientHeatDescription(session.descriptions);
  const identifiedRelations = hasSufficientHeatExplanation(session.explanations);
  const constructedValidCausalModel = hasCompletedHeatModel(session.modelAttempts);
  const successfulTransfer =
    constructedValidCausalModel && hasCompletedHeatTransfer(session.transferAttempts);
  const tutorUsed = heatTutorUsedDuringIndependent(session);
  const llmUsed = session.independentAssessment?.llmUsed;
  const llmDisabled = llmUsed === false && !tutorUsed;
  const independentSuccess =
    hasAcceptedHeatAiOffChallenges(session.independentAssessment) && llmDisabled;
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
