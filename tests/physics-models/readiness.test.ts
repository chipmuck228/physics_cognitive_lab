import { describe, expect, it } from "vitest";

import { chemicalEnergyMechanicalAssessmentOverlay } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/assessment-overlay";
import { chemicalEnergyInternalEnergyMechanicalEnergyModel } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy";
import { densityMassVolumeAssessmentOverlay } from "@/content/physics-models/density-mass-volume/assessment-overlay";
import { densityMassVolumeModel } from "@/content/physics-models/density-mass-volume";
import { forceChangesMotionStateAssessmentOverlay } from "@/content/physics-models/force-changes-motion-state/assessment-overlay";
import { forceChangesMotionStateModel } from "@/content/physics-models/force-changes-motion-state";
import { TutorAction } from "@/types/ai";
import { LearningStage } from "@/types/learning";
import type { PhysicsModel, SceneDefinition } from "@/types/physics-model";
import {
  inferModelRepresentationKind,
  validatePhysicsModelReadiness,
} from "@/lib/physics-models/readiness";

function cloneModel(model: PhysicsModel): PhysicsModel {
  return structuredClone(model);
}

describe("validatePhysicsModelReadiness", () => {
  const engineScene = chemicalEnergyInternalEnergyMechanicalEnergyModel.scenes[0] as SceneDefinition;
  const cartScene = forceChangesMotionStateModel.scenes[0] as SceneDefinition;

  it("marks Scene 02 ready without requiring a force/motion board", () => {
    const result = validatePhysicsModelReadiness(
      chemicalEnergyInternalEnergyMechanicalEnergyModel,
      engineScene,
      chemicalEnergyMechanicalAssessmentOverlay,
    );
    expect(result.status).toBe("IMPLEMENTATION_READY");
    expect(result.missing).toEqual([]);
    expect(result.blockers).toEqual([]);
    expect(inferModelRepresentationKind(chemicalEnergyInternalEnergyMechanicalEnergyModel)).toBe(
      "energy-chain",
    );
  });

  it("marks Scene 03 ready without requiring an energy chain", () => {
    const result = validatePhysicsModelReadiness(
      forceChangesMotionStateModel,
      cartScene,
      forceChangesMotionStateAssessmentOverlay,
    );
    expect(result.status).toBe("IMPLEMENTATION_READY");
    expect(result.missing).toEqual([]);
    expect(result.blockers).toEqual([]);
    expect(forceChangesMotionStateModel.energyRelations ?? []).toEqual([]);
    expect(inferModelRepresentationKind(forceChangesMotionStateModel)).toBe(
      "relation-condition",
    );
  });

  it("marks density-mass-volume ready without requiring an energy chain or force board", () => {
    const densityScene = densityMassVolumeModel.scenes[0] as SceneDefinition;
    const result = validatePhysicsModelReadiness(
      densityMassVolumeModel,
      densityScene,
      densityMassVolumeAssessmentOverlay,
    );
    expect(result.status).toBe("IMPLEMENTATION_READY");
    expect(result.missing).toEqual([]);
    expect(result.blockers).toEqual([]);
    expect(inferModelRepresentationKind(densityMassVolumeModel)).toBe(
      "ratio-quantitative",
    );
  });

  it("returns NOT_READY when AssessmentOverlay is missing", () => {
    const result = validatePhysicsModelReadiness(
      forceChangesMotionStateModel,
      cartScene,
    );
    expect(result.status).toBe("NOT_READY");
    expect(result.missing.some((issue) => issue.path === "assessmentOverlay")).toBe(
      true,
    );
  });

  it("returns BLOCKED_BY_SCHEMA for an intentionally incomplete model", () => {
    const incomplete = cloneModel(forceChangesMotionStateModel);
    incomplete.experiments = [];
    incomplete.examPatterns = [];
    incomplete.independentChallenges = [];
    incomplete.coreIdea = "";

    const result = validatePhysicsModelReadiness(
      incomplete,
      incomplete.scenes[0] as SceneDefinition,
      forceChangesMotionStateAssessmentOverlay,
    );
    expect(result.status).toBe("BLOCKED_BY_SCHEMA");
    expect(result.blockers.length).toBeGreaterThan(0);
  });

  it("returns AMBIGUOUS_PHYSICS when an energy-chain evaluator is forced onto a non-energy model", () => {
    const confused = cloneModel(forceChangesMotionStateModel);
    confused.modelEvaluator.requiredComponents.identifiesEnergySource =
      "指出起始能量来自燃料。";

    const result = validatePhysicsModelReadiness(
      confused,
      confused.scenes[0] as SceneDefinition,
      forceChangesMotionStateAssessmentOverlay,
    );
    expect(result.status).toBe("AMBIGUOUS_PHYSICS");
    expect(
      result.blockers.some((issue) => issue.path === "modelEvaluator.requiredComponents"),
    ).toBe(true);
  });

  it("returns BLOCKED_BY_RUNTIME when tutor policy would operate in AI_OFF", () => {
    const leaked = cloneModel(forceChangesMotionStateModel);
    leaked.tutorPolicy.allowedActionsByStage[LearningStage.AI_OFF] = [
      TutorAction.HINT,
    ];

    const result = validatePhysicsModelReadiness(
      leaked,
      leaked.scenes[0] as SceneDefinition,
      forceChangesMotionStateAssessmentOverlay,
    );
    expect(result.status).toBe("BLOCKED_BY_RUNTIME");
    expect(
      result.blockers.some((issue) =>
        issue.path.startsWith("tutorPolicy.allowedActionsByStage"),
      ),
    ).toBe(true);
  });
});
