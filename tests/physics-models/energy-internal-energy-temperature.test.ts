import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  PRODUCTION_AI_OFF_IDS,
  PRODUCTION_AI_OFF_PURPOSE,
  PRODUCTION_EXAM_PATTERN_IDS,
  PRODUCTION_EXPERIMENT_SCOPE,
  PRODUCTION_MODEL_REPRESENTATION,
  PRODUCTION_SCENE_ID,
  PRODUCTION_TRANSFER_AVAILABLE_NOT_REQUIRED_IDS,
  PRODUCTION_TRANSFER_REQUIRED_IDS,
  energyInternalEnergyTemperatureAssessmentOverlay,
  energyInternalEnergyTemperatureModel as model,
} from "@/content/physics-models/energy-internal-energy-temperature";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import {
  inferModelRepresentationKind,
  validatePhysicsModelReadiness,
} from "@/lib/physics-models/readiness";
import { validatePhysicsModel } from "@/lib/physics-models/validate";

describe("energy-internal-energy-temperature canonical model", () => {
  it("validates as a complete prototype Physics Model", () => {
    const result = validatePhysicsModel(model);
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
    expect(model.metadata.status).toBe("prototype");
    expect(model.id).toBe("energy-internal-energy-temperature");
  });

  it("keeps microwave as the anchor phenomenon, not the model", () => {
    expect(model.coreIdea).not.toMatch(/微波炉加热面包就是模型/);
    expect(model.phenomena.some((item) => item.modelRole === "anchor")).toBe(true);
    expect(model.scenes[0]?.id).toBe("microwave-bread");
    expect(model.conditions.some((item) => item.id === "microwave-mechanism-not-required")).toBe(
      true,
    );
  });

  it("does not copy Scene 02 work/mechanical evaluator keys", () => {
    const keys = Object.keys(model.modelEvaluator.requiredComponents);
    expect(keys).not.toContain("identifiesWorkProcess");
    expect(keys).not.toContain("identifiesMechanicalOutput");
    expect(inferModelRepresentationKind(model)).toBe("energy-chain");
    expect(PRODUCTION_MODEL_REPRESENTATION.kind).toBe("energy-state-chain");
  });

  it("locks the required kettle + ice transfer pair and keeps rubbing optional", () => {
    expect(PRODUCTION_TRANSFER_REQUIRED_IDS).toEqual([
      "near-kettle-heating-water",
      "far-ice-absorbs-energy",
    ]);
    expect(PRODUCTION_TRANSFER_AVAILABLE_NOT_REQUIRED_IDS).toContain("partial-rubbing-hands");
    expect(PRODUCTION_TRANSFER_REQUIRED_IDS).not.toContain("partial-rubbing-hands");
    expect(model.transferTargets.find((target) => target.id === "near-kettle-heating-water")?.transferMode).toBe(
      "full-model",
    );
    expect(model.transferTargets.find((target) => target.id === "far-ice-absorbs-energy")?.transferMode).toBe(
      "boundary-contrast",
    );
  });

  it("splits AI_OFF A ordinary application from AI_OFF B boundary check", () => {
    expect(PRODUCTION_AI_OFF_IDS).toEqual([
      "ai-off-unfamiliar-metal-spoon",
      "ai-off-condition-ice-absorbs-energy",
    ]);
    expect(PRODUCTION_AI_OFF_PURPOSE["ai-off-unfamiliar-metal-spoon"]).toMatch(
      /NORMAL APPLICATION/,
    );
    expect(PRODUCTION_AI_OFF_PURPOSE["ai-off-condition-ice-absorbs-energy"]).toMatch(
      /BOUNDARY CHECK/,
    );
    const spoon = model.independentChallenges.find(
      (item) => item.id === "ai-off-unfamiliar-metal-spoon",
    );
    const ice = model.independentChallenges.find(
      (item) => item.id === "ai-off-condition-ice-absorbs-energy",
    );
    expect(spoon?.question).toMatch(/不要.*冰或物态变化/);
    expect(ice?.question).toMatch(/检查的是条件/);
    expect(ice?.requiredEvidence.some((item) => item.id === "identifiesConditionOrBoundary")).toBe(
      true,
    );
    expect(spoon?.requiredEvidence.some((item) => item.id === "identifiesConditionOrBoundary")).toBe(
      false,
    );
  });

  it("has overlay coverage for exam and AI_OFF design, unwired to the legacy adapter", () => {
    expect(Object.keys(energyInternalEnergyTemperatureAssessmentOverlay.exam ?? {})).toEqual(
      expect.arrayContaining([...PRODUCTION_EXAM_PATTERN_IDS]),
    );
    for (const challenge of model.independentChallenges) {
      expect(
        energyInternalEnergyTemperatureAssessmentOverlay.independent?.[challenge.id],
      ).toBeDefined();
    }
  });

  it("is IMPLEMENTATION_READY without creating L-levels or changing metadata.status", () => {
    const result = validatePhysicsModelReadiness(
      model,
      model.scenes[0]!,
      energyInternalEnergyTemperatureAssessmentOverlay,
    );
    expect(result.status).toBe("IMPLEMENTATION_READY");
    expect(result.missing).toEqual([]);
    expect(result.blockers).toEqual([]);
    expect(result.warnings.map((item) => item.path)).toEqual(
      expect.arrayContaining(["energyRelations"]),
    );
    expect(model.scenes[0]?.id).toBe(PRODUCTION_SCENE_ID);
    expect(model.metadata.status).toBe("prototype");
    expect(model.metadata.status).not.toBe("validated");
    expect(deriveModelEvidenceLevel({})).toBe("L0");
    expect(PRODUCTION_EXPERIMENT_SCOPE.microwaveDoesNotProve).toMatch(/ALWAYS raises temperature/);
  });
});

describe("Scene 01 Evidence Claim Design", () => {
  const design = readFileSync("spec/scenes/microwave-bread/evidence-claim-design.md", "utf8");

  it("records L1-L6 claims against the Evidence Design Contract", () => {
    expect(design).toMatch(/Evidence Claim Matrix/);
    expect(design).toMatch(/identifiedQuantities/);
    expect(design).toMatch(/constructedValidCausalModel/);
    expect(design).toMatch(/successfulTransfer/);
    expect(design).toMatch(/independentAiOffSuccess/);
    expect(design).toMatch(/PRE_COMMIT_STRUCTURED/);
    expect(design).toMatch(/PRE_COMMIT_AUTHORED/);
    expect(design).not.toMatch(/status:\s*"evidence-claim-design"/);
  });

  it("rejects named L4/L5/L6 shortcuts and post-check manufacture", () => {
    expect(design).toMatch(/变热了/);
    expect(design).toMatch(/吸收热量所以升温/);
    expect(design).toMatch(/也是加热/);
    expect(design).toMatch(/post-check cannot manufacture/);
    expect(design).toMatch(/EXPLAIN cannot set L4/);
    expect(design).toMatch(/Never write `"L4" \| "L5" \| "L6"`/);
  });
});
