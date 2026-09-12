import { describe, expect, it } from "vitest";

import { forceChangesMotionStateModel as model } from "@/content/physics-models/force-changes-motion-state";
import {
  extractForceMotionSignals,
  evaluateTransferAttempt,
} from "@/content/physics-models/force-changes-motion-state/evaluator";
import { MODEL_RELATION_IDS } from "@/content/physics-models/force-changes-motion-state/model";
import { FORCE_CHANGES_MOTION_STATE_ID } from "@/lib/physics-models/canonical-ids";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { validatePhysicsModel } from "@/lib/physics-models/validate";
import { ExperimentEvidenceKind, TransferMode } from "@/types/physics-model";

describe("force-changes-motion-state", () => {
  it("uses the canonical model ID", () => {
    expect(model.id).toBe(FORCE_CHANGES_MOTION_STATE_ID);
  });

  it("passes PhysicsModel schema and referential validation", () => {
    const result = validatePhysicsModel(model);
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("does not encode an energy-conversion chain", () => {
    expect(model.energyRelations ?? []).toEqual([]);
    expect(model.modelEvaluator.requiredComponents.identifiesEnergySource).toBeUndefined();
    expect(
      model.modelEvaluator.requiredComponents.identifiesCurrentMotionState.length,
    ).toBeGreaterThan(0);
    expect(
      model.modelEvaluator.requiredComponents.identifiesNetForceCondition.length,
    ).toBeGreaterThan(0);
  });

  it("keeps causal relation endpoints on defined quantities", () => {
    const quantityIds = new Set(model.quantities.map((item) => item.id));
    for (const relation of model.causalRelations) {
      expect(quantityIds.has(relation.from)).toBe(true);
      expect(quantityIds.has(relation.to)).toBe(true);
    }
  });

  it("declares the horizontal cart as the only Scene and keeps secondary models supporting-only", () => {
    expect(model.scenes).toHaveLength(1);
    expect(model.scenes[0]?.id).toBe("horizontal-force-cart");
    expect(model.scenes[0]?.primaryModel).toBe(FORCE_CHANGES_MOTION_STATE_ID);
    expect(model.scenes[0]?.secondaryModels).toEqual([
      "force-equilibrium",
      "inertia-motion-state",
    ]);
  });

  it("requires UPLP five-part evidence on every experiment", () => {
    const required = [
      ExperimentEvidenceKind.PREDICTION,
      ExperimentEvidenceKind.INTERVENTION,
      ExperimentEvidenceKind.OBSERVED_RESULT,
      ExperimentEvidenceKind.PREDICTION_VS_RESULT,
      ExperimentEvidenceKind.REFLECTION,
    ];
    expect(model.experiments.map((item) => item.id).sort()).toEqual([
      "force-against-motion",
      "force-with-motion",
      "zero-net-force-while-moving",
    ]);
    for (const experiment of model.experiments) {
      const kinds = experiment.expectedEvidence.map((item) => item.kind);
      for (const kind of required) {
        expect(kinds).toContain(kind);
      }
    }
  });

  it("treats keyword overlap as a signal, not mastery", () => {
    const signals = extractForceMotionSignals(
      "有力就一定运动，没有力就会停下，平衡力就是没有力。",
    );
    expect(signals.claimsForceMeansMotion).toBe(true);
    expect(signals.claimsZeroNetForceMustStop).toBe(true);
    expect(signals.claimsBalancedMeansNoForce).toBe(true);
    expect(
      deriveModelEvidenceLevel({
        identifiedRelations: true,
      }),
    ).not.toBe("L4");
  });

  it("does not accept wheel-only near transfer", () => {
    const result = evaluateTransferAttempt({
      targetId: "near-bicycle-speeding-up",
      transferMode: TransferMode.FULL_MODEL,
      selectedRelations: [],
      rejectedRelations: [],
      studentExplanation: "因为自行车也有轮子。",
    });
    expect(result.accepted).toBe(false);
    expect(result.failureKinds.length).toBeGreaterThan(0);
  });

  it("accepts a structured near transfer that uses the force-motion relation", () => {
    const result = evaluateTransferAttempt({
      targetId: "near-bicycle-speeding-up",
      transferMode: TransferMode.FULL_MODEL,
      selectedRelations: [MODEL_RELATION_IDS.sameDirectionIncreasesSpeed],
      rejectedRelations: [],
      studentExplanation: "车子原来已经在向前运动，蹬车让合力和运动方向相同，所以会加快。",
    });
    expect(result.accepted).toBe(true);
  });

  it("rejects a zero-net-force far transfer that still demands a forward force", () => {
    const result = evaluateTransferAttempt({
      targetId: "far-hover-constant-velocity",
      transferMode: TransferMode.BOUNDARY_CONTRAST,
      selectedRelations: [MODEL_RELATION_IDS.sameDirectionIncreasesSpeed],
      rejectedRelations: [],
      studentExplanation: "没有向前的力，滑块一定会停下。",
    });
    expect(result.accepted).toBe(false);
    expect(result.failureKinds).toContain("missing-zero-net-force-boundary");
  });

  it("accepts the hover boundary when zero net force leaves motion unchanged", () => {
    const result = evaluateTransferAttempt({
      targetId: "far-hover-constant-velocity",
      transferMode: TransferMode.BOUNDARY_CONTRAST,
      selectedRelations: [MODEL_RELATION_IDS.zeroNetForceLeavesMotionUnchanged],
      rejectedRelations: [MODEL_RELATION_IDS.sameDirectionIncreasesSpeed],
      studentExplanation: "水平合力为零，原来在动的滑块运动状态可以保持不变，不必立刻停下。",
    });
    expect(result.accepted).toBe(true);
  });

  it("derives L4–L6 only from accumulated evidence flags", () => {
    expect(
      deriveModelEvidenceLevel({
        observedPhenomenon: true,
        identifiedQuantities: true,
        identifiedRelations: true,
        constructedValidCausalModel: true,
      }),
    ).toBe("L4");
    expect(
      deriveModelEvidenceLevel({
        observedPhenomenon: true,
        identifiedQuantities: true,
        identifiedRelations: true,
        constructedValidCausalModel: true,
        successfulTransfer: true,
      }),
    ).toBe("L5");
    expect(
      deriveModelEvidenceLevel({
        observedPhenomenon: true,
        identifiedQuantities: true,
        identifiedRelations: true,
        constructedValidCausalModel: true,
        successfulTransfer: true,
        independentAiOffSuccess: true,
        llmDisabledDuringIndependent: true,
      }),
    ).toBe("L6");
  });
});
