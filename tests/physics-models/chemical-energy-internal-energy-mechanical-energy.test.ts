import { describe, expect, it } from "vitest";

import { chemicalEnergyInternalEnergyMechanicalEnergyModel as model } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy";
import {
  extractCausalSignals,
  evaluateTransferAttempt,
} from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/evaluator";
import { MODEL_RELATION_IDS } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/model";
import { CHEMICAL_ENERGY_INTERNAL_ENERGY_MECHANICAL_ENERGY_ID } from "@/lib/physics-models/canonical-ids";
import { isCognitiveActionId } from "@/lib/physics-models/cognitive-actions";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { validatePhysicsModel } from "@/lib/physics-models/validate";
import { ExperimentEvidenceKind, TransferMode } from "@/types/physics-model";

const COMPLETE_CHAIN =
  "燃料的化学能在燃烧时转化，工作气体的内能和状态发生变化，气体对活塞做功，最后表现为机械能。";

describe("chemical-energy-internal-energy-mechanical-energy", () => {
  it("uses the canonical model ID", () => {
    expect(model.id).toBe(CHEMICAL_ENERGY_INTERNAL_ENERGY_MECHANICAL_ENERGY_ID);
  });

  it("passes PhysicsModel schema and referential validation", () => {
    const result = validatePhysicsModel(model);
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("keeps causal relation endpoints on defined quantities", () => {
    const quantityIds = new Set(model.quantities.map((item) => item.id));
    for (const relation of model.causalRelations) {
      expect(quantityIds.has(relation.from)).toBe(true);
      expect(quantityIds.has(relation.to)).toBe(true);
    }
  });

  it("does not model combustion as a PhysicalQuantity", () => {
    expect(model.quantities.some((item) => item.id === "combustion")).toBe(false);
    expect(model.conditions.some((item) => item.id === "combustion-occurs")).toBe(true);
    expect(
      model.energyRelations?.some(
        (item) =>
          item.mechanism === "conversion" &&
          item.conditions?.includes("combustion-occurs"),
      ),
    ).toBe(true);
  });

  it("does not assert that gas pressure always increases", () => {
    expect(model.quantities.some((item) => item.id === "gas-pressure")).toBe(false);
    expect(
      model.causalRelations.some(
        (item) => item.to === "gas-pressure" && item.direction === "increase",
      ),
    ).toBe(false);
  });

  it("keeps energy transfer by work explicit", () => {
    expect(
      model.energyRelations?.some(
        (item) =>
          item.mechanism === "work" &&
          item.source === "working-gas-internal-energy" &&
          item.destination === "mechanical-energy",
      ),
    ).toBe(true);
    expect(
      model.causalRelations.some(
        (item) =>
          item.from === "working-gas-state" &&
          item.to === "piston-mechanical-motion" &&
          item.relation === "transfers",
      ),
    ).toBe(false);
  });

  it("does not allow LLM on AI_OFF challenges", () => {
    expect(model.independentChallenges.length).toBeGreaterThanOrEqual(2);
    for (const challenge of model.independentChallenges) {
      expect(challenge.llmAllowed).toBe(false);
    }
  });

  it("gives every misconception diagnostic signals and interventions", () => {
    expect(model.misconceptions.map((item) => item.id)).toEqual([
      "ceime-M1",
      "ceime-M2",
      "ceime-M3",
      "ceime-M4",
      "ceime-M5",
      "ceime-M6",
    ]);
    for (const misconception of model.misconceptions) {
      expect(misconception.diagnosticSignals.length).toBeGreaterThan(0);
      expect(misconception.recommendedInterventions.length).toBeGreaterThan(0);
    }
  });

  it("requires the UPLP experiment evidence closure", () => {
    const required = [
      ExperimentEvidenceKind.PREDICTION,
      ExperimentEvidenceKind.INTERVENTION,
      ExperimentEvidenceKind.OBSERVED_RESULT,
      ExperimentEvidenceKind.PREDICTION_VS_RESULT,
      ExperimentEvidenceKind.REFLECTION,
    ];

    expect(model.experiments[0]?.id).toBe("ignition-energy-release");
    for (const experiment of model.experiments) {
      for (const kind of required) {
        const spec = experiment.expectedEvidence.find((item) => item.kind === kind);
        expect(spec?.required).toBe(true);
      }
    }
  });

  it("uses canonical cognitive-action IDs in exam patterns", () => {
    expect(model.examPatterns.length).toBeGreaterThanOrEqual(5);
    for (const pattern of model.examPatterns) {
      expect(pattern.requiredCognitiveActions.every(isCognitiveActionId)).toBe(true);
      expect(pattern.options).toContain(pattern.correctAnswer);
    }
  });

  it("extracts complete-chain signals without assigning mastery", () => {
    const signals = extractCausalSignals(COMPLETE_CHAIN);
    expect(signals.suggestsCompleteChain).toBe(true);
    expect(signals).not.toHaveProperty("evidenceLevel");
    expect(
      deriveModelEvidenceLevel({
        constructedValidCausalModel: signals.suggestsCompleteChain,
      }),
    ).toBe("L4");
  });

  it("does not mark an answer complete if it skips the work step", () => {
    const signals = extractCausalSignals(
      "燃料的化学能转化后，气体内能变化，最后变成了机械能。",
    );
    expect(signals.identifiesWorkProcess).toBe(false);
    expect(signals.skipsWorkStep).toBe(true);
    expect(signals.suggestsCompleteChain).toBe(false);
  });

  it("does not treat combustion as direct mechanical output", () => {
    const signals = extractCausalSignals("燃烧直接让曲轴转动，所以有机械能。");
    expect(signals.treatsCombustionAsDirectOutput).toBe(true);
    expect(signals.suggestsCompleteChain).toBe(false);
  });

  it("encodes steam transfer as partial-structure, not full-model", () => {
    const steam = model.transferTargets.find((item) => item.id === "far-steam-piston");
    expect(steam?.transferMode).toBe(TransferMode.PARTIAL_STRUCTURE);
    expect(steam?.expectedModelId).toBeUndefined();
    expect(steam?.transferableRelations).toEqual([
      MODEL_RELATION_IDS.internalEnergyChangesState,
      MODEL_RELATION_IDS.workingGasDoesWork,
      MODEL_RELATION_IDS.mechanicalEnergyOutput,
    ]);
    expect(steam?.nonTransferableRelations).toEqual([
      MODEL_RELATION_IDS.chemicalConvertsToInternal,
    ]);
  });

  it("does not accept steam transfer just because something pushes a piston", () => {
    const pistonOnly = evaluateTransferAttempt({
      text: "蒸汽也是 something pushing a piston。",
      transferMode: TransferMode.PARTIAL_STRUCTURE,
    });
    expect(pistonOnly.accepted).toBe(false);

    const partial = evaluateTransferAttempt({
      text: "蒸汽不是燃料化学能。后半段还能用：气体内能变化后对活塞做功，得到机械能。",
      transferMode: TransferMode.PARTIAL_STRUCTURE,
    });
    expect(partial.accepted).toBe(true);
  });

  it("declares the four-stroke engine as an anchor phenomenon, not the model", () => {
    expect(model.phenomena[0]?.id).toBe("four-stroke-internal-combustion-engine");
    expect(model.scenes[0]?.primaryModel).toBe(model.id);
    expect(model.coreIdea.includes("吸气")).toBe(false);
  });
});

describe("deriveModelEvidenceLevel", () => {
  it("reaches L1 from observation evidence alone", () => {
    expect(deriveModelEvidenceLevel({ observedPhenomenon: true })).toBe("L1");
  });

  it("reaches L2 and L3 from quantity and relation evidence", () => {
    expect(deriveModelEvidenceLevel({ identifiedQuantities: true })).toBe("L2");
    expect(deriveModelEvidenceLevel({ identifiedRelations: true })).toBe("L3");
  });

  it("assigns L4 from valid MODEL construction, never L5 or L6", () => {
    expect(
      deriveModelEvidenceLevel({ constructedValidCausalModel: true }),
    ).toBe("L4");
  });

  it("requires successful transfer evidence for L5", () => {
    expect(
      deriveModelEvidenceLevel({
        constructedValidCausalModel: true,
        successfulTransfer: true,
      }),
    ).toBe("L5");
  });

  it("requires successful AI_OFF with LLM disabled for L6", () => {
    expect(
      deriveModelEvidenceLevel({
        constructedValidCausalModel: true,
        successfulTransfer: true,
        independentAiOffSuccess: true,
        llmDisabledDuringIndependent: false,
      }),
    ).toBe("L5");
    expect(
      deriveModelEvidenceLevel({
        constructedValidCausalModel: true,
        successfulTransfer: true,
        independentAiOffSuccess: true,
        llmDisabledDuringIndependent: true,
      }),
    ).toBe("L6");
  });

  it("does not let MODEL-stage free text become L5 or L6", () => {
    const signals = extractCausalSignals(COMPLETE_CHAIN);
    const fromModelStageOnly = deriveModelEvidenceLevel({
      constructedValidCausalModel: signals.suggestsCompleteChain,
    });
    expect(fromModelStageOnly).toBe("L4");
    expect(fromModelStageOnly).not.toBe("L5");
    expect(fromModelStageOnly).not.toBe("L6");
  });
});
