import {
  engineTutorUsedDuringIndependent,
  hasAcceptedEngineAiOffChallenges,
} from "@/lib/learning/engine-ai-off";
import { hasSufficientEngineDescription } from "@/lib/learning/engine-describe";
import { hasSufficientEngineExplanation } from "@/lib/learning/engine-explain";
import { hasCompletedEngineModel } from "@/lib/learning/engine-model";
import { hasSufficientEngineObservation } from "@/lib/learning/engine-observe";
import { hasCompletedEngineTransfer } from "@/lib/learning/engine-transfer";
import type { AccumulatedModelEvidence } from "@/lib/physics-models/evidence";
import type { LearningSession } from "@/types/learning";

/**
 * Scene 02 writes evidence flags only. Official levels come from
 * deriveModelEvidenceLevel. This helper never returns a level string.
 */
export function accumulateEngineSceneEvidence(
  session: LearningSession,
): AccumulatedModelEvidence {
  const constructedValidCausalModel = hasCompletedEngineModel(session.modelAttempts);
  const tutorUsed = engineTutorUsedDuringIndependent(session);
  const llmUsed = session.independentAssessment?.llmUsed;
  const llmDisabled = llmUsed === false && !tutorUsed;
  const independentSuccess =
    hasAcceptedEngineAiOffChallenges(session.independentAssessment) && llmDisabled;
  const hasIndependentAttempts = Boolean(
    session.independentAssessment?.challengeAttempts?.length,
  );

  return {
    observedPhenomenon:
      hasSufficientEngineObservation(session.observations) &&
      hasSufficientEngineDescription(session.descriptions),
    identifiedQuantities: hasSufficientEngineDescription(session.descriptions),
    identifiedRelations: hasSufficientEngineExplanation(session.explanations),
    constructedValidCausalModel,
    successfulTransfer:
      constructedValidCausalModel &&
      hasCompletedEngineTransfer(session.transferAttempts),
    independentAiOffSuccess: independentSuccess || undefined,
    llmDisabledDuringIndependent: hasIndependentAttempts
      ? llmDisabled
      : undefined,
  };
}
