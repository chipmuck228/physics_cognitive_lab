import {
  hasAcceptedOhmsAiOffChallenges,
  ohmsTutorUsedDuringIndependent,
} from "@/lib/learning/ohms-ai-off";
import { hasSufficientOhmsDescription } from "@/lib/learning/ohms-describe";
import { hasSufficientOhmsExplanation } from "@/lib/learning/ohms-explain";
import { hasCompletedOhmsModel } from "@/lib/learning/ohms-model";
import { hasSufficientOhmsObservation } from "@/lib/learning/ohms-observe";
import { hasCompletedOhmsTransfer } from "@/lib/learning/ohms-transfer";
import type { AccumulatedModelEvidence } from "@/lib/physics-models/evidence";
import type { LearningSession } from "@/types/learning";

export function accumulateOhmsSceneEvidence(
  session: LearningSession,
): AccumulatedModelEvidence {
  const observed =
    hasSufficientOhmsObservation(session.observations) &&
    hasSufficientOhmsDescription(session.descriptions);
  const identifiedQuantities = hasSufficientOhmsDescription(session.descriptions);
  const identifiedRelations = hasSufficientOhmsExplanation(session.explanations);
  const constructedValidCausalModel = hasCompletedOhmsModel(session.modelAttempts);
  const successfulTransfer =
    constructedValidCausalModel && hasCompletedOhmsTransfer(session.transferAttempts);
  const tutorUsed = ohmsTutorUsedDuringIndependent(session);
  const llmUsed = session.independentAssessment?.llmUsed;
  const llmDisabled = llmUsed === false && !tutorUsed;
  const independentSuccess =
    hasAcceptedOhmsAiOffChallenges(session.independentAssessment) && llmDisabled;
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
