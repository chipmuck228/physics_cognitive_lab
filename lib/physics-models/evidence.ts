import { ModelEvidenceLevel, type ModelEvidenceLevel as ModelEvidenceLevelType } from "@/types/physics-model";

/**
 * Official L1–L6 mastery is derived from accumulated structured evidence
 * across learning stages. It is not assigned from a single free-text match.
 *
 * Meanings are owned by spec/physics-model-schema.md:
 * L1 observation/description
 * L4 MODEL-stage causal construction
 * L5 successful TRANSFER
 * L6 successful AI_OFF with the LLM disabled
 */
export type ModelEvidenceFloor = ModelEvidenceLevelType | "L0";

export interface AccumulatedModelEvidence {
  observedPhenomenon?: boolean;
  identifiedQuantities?: boolean;
  identifiedRelations?: boolean;
  constructedValidCausalModel?: boolean;
  successfulTransfer?: boolean;
  independentAiOffSuccess?: boolean;
  llmDisabledDuringIndependent?: boolean;
}

export function deriveModelEvidenceLevel(
  evidence: AccumulatedModelEvidence,
): ModelEvidenceFloor {
  const hasValidModel = evidence.constructedValidCausalModel === true;
  const hasTransfer = evidence.successfulTransfer === true;
  const hasIndependent = evidence.independentAiOffSuccess === true;
  const llmOff = evidence.llmDisabledDuringIndependent === true;

  if (hasValidModel && hasTransfer && hasIndependent && llmOff) {
    return ModelEvidenceLevel.L6;
  }
  if (hasValidModel && hasTransfer) {
    return ModelEvidenceLevel.L5;
  }
  if (hasValidModel) {
    return ModelEvidenceLevel.L4;
  }
  if (evidence.identifiedRelations === true) {
    return ModelEvidenceLevel.L3;
  }
  if (evidence.identifiedQuantities === true) {
    return ModelEvidenceLevel.L2;
  }
  if (evidence.observedPhenomenon === true) {
    return ModelEvidenceLevel.L1;
  }
  return "L0";
}
