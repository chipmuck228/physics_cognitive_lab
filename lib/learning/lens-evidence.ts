import {
  hasAcceptedLensAiOffChallenges,
  lensTutorUsedDuringIndependent,
} from "@/lib/learning/lens-ai-off";
import { hasSufficientLensDescription } from "@/lib/learning/lens-describe";
import { hasSufficientLensExplanation } from "@/lib/learning/lens-explain";
import { hasCompletedLensModel } from "@/lib/learning/lens-model";
import { hasSufficientLensObservation } from "@/lib/learning/lens-observe";
import { hasCompletedLensTransfer } from "@/lib/learning/lens-transfer";
import type { AccumulatedModelEvidence } from "@/lib/physics-models/evidence";
import type { LearningSession } from "@/types/learning";

export function accumulateConvexLensSceneEvidence(
  session: LearningSession,
): AccumulatedModelEvidence {
  const observed =
    hasSufficientLensObservation(session.observations) &&
    hasSufficientLensDescription(session.descriptions);
  const identifiedQuantities = hasSufficientLensDescription(session.descriptions);
  const identifiedRelations = hasSufficientLensExplanation(session.explanations);
  const constructedValidCausalModel = hasCompletedLensModel(session.modelAttempts);
  const successfulTransfer =
    constructedValidCausalModel && hasCompletedLensTransfer(session.transferAttempts);
  const tutorUsed = lensTutorUsedDuringIndependent(session);
  const llmUsed = session.independentAssessment?.llmUsed;
  const llmDisabled = llmUsed === false && !tutorUsed;
  const independentSuccess =
    hasAcceptedLensAiOffChallenges(session.independentAssessment) && llmDisabled;
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
