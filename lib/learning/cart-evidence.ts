import { hasSufficientCartDescription } from "@/lib/learning/cart-describe";
import {
  cartTutorUsedDuringIndependent,
  hasAcceptedCartAiOffChallenges,
} from "@/lib/learning/cart-ai-off";
import { hasSufficientCartExplanation } from "@/lib/learning/cart-explain";
import { hasCompletedCartModel } from "@/lib/learning/cart-model";
import { hasSufficientCartObservation } from "@/lib/learning/cart-observe";
import { hasCompletedCartTransfer } from "@/lib/learning/cart-transfer";
import type { AccumulatedModelEvidence } from "@/lib/physics-models/evidence";
import type { LearningSession } from "@/types/learning";

/**
 * Scene 03 writes evidence flags only. Official L1–L6 come from
 * deriveModelEvidenceLevel. This helper never returns a level string.
 */
export function accumulateCartSceneEvidence(
  session: LearningSession,
): AccumulatedModelEvidence {
  const observed =
    hasSufficientCartObservation(session.observations) &&
    hasSufficientCartDescription(session.descriptions);
  const identifiedQuantities = hasSufficientCartDescription(session.descriptions);
  const identifiedRelations = hasSufficientCartExplanation(session.explanations);
  const constructedValidCausalModel = hasCompletedCartModel(session.modelAttempts);
  const successfulTransfer =
    constructedValidCausalModel && hasCompletedCartTransfer(session.transferAttempts);
  const tutorUsed = cartTutorUsedDuringIndependent(session);
  const llmUsed = session.independentAssessment?.llmUsed;
  const llmDisabled = llmUsed === false && !tutorUsed;
  const independentSuccess =
    hasAcceptedCartAiOffChallenges(session.independentAssessment) && llmDisabled;
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
