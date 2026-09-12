import { describe, expect, it } from "vitest";

import { densityMassVolumeAssessmentOverlay } from "@/content/physics-models/density-mass-volume/assessment-overlay";
import { densityMassVolumeModel as model } from "@/content/physics-models/density-mass-volume";
import {
  extractDensitySignals,
  evaluateTransferAttempt,
} from "@/content/physics-models/density-mass-volume/evaluator";
import {
  MODEL_RELATION_IDS,
  MODEL_REPRESENTATION_KIND,
} from "@/content/physics-models/density-mass-volume/model";
import { DENSITY_MASS_VOLUME_ID } from "@/lib/physics-models/canonical-ids";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import {
  inferModelRepresentationKind,
  validatePhysicsModelReadiness,
} from "@/lib/physics-models/readiness";
import { validatePhysicsModel } from "@/lib/physics-models/validate";
import { ExperimentEvidenceKind, TransferMode } from "@/types/physics-model";

describe("density-mass-volume", () => {
  it("uses the canonical model ID and does not invent a duplicate", () => {
    expect(model.id).toBe(DENSITY_MASS_VOLUME_ID);
    expect(model.id).toBe("density-mass-volume");
  });

  it("passes PhysicsModel schema and referential validation", () => {
    const result = validatePhysicsModel(model);
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("is a ratio model, not an energy chain or force/motion board", () => {
    expect(model.energyRelations ?? []).toEqual([]);
    expect(model.modelEvaluator.requiredComponents.identifiesEnergySource).toBeUndefined();
    expect(
      model.modelEvaluator.requiredComponents.identifiesCurrentMotionState,
    ).toBeUndefined();
    expect(model.modelEvaluator.requiredComponents.identifiesDensity.length).toBeGreaterThan(0);
    expect(model.modelEvaluator.requiredComponents.usesMassVolumeRatio.length).toBeGreaterThan(0);
    expect(inferModelRepresentationKind(model)).toBe("ratio-quantitative");
    expect(MODEL_REPRESENTATION_KIND).toBe("ratio-quantitative");
  });

  it("keeps relation endpoints on defined quantities", () => {
    const quantityIds = new Set(model.quantities.map((item) => item.id));
    for (const relation of model.causalRelations) {
      expect(quantityIds.has(relation.from)).toBe(true);
      expect(quantityIds.has(relation.to)).toBe(true);
      expect(relation.relation).toBe("depends-on");
    }
  });

  it("declares the equal-volume samples Scene and keeps measurement models supporting-only", () => {
    expect(model.scenes).toHaveLength(1);
    expect(model.scenes[0]?.id).toBe("equal-volume-material-samples");
    expect(model.scenes[0]?.primaryModel).toBe(DENSITY_MASS_VOLUME_ID);
    expect(model.scenes[0]?.secondaryModels).toEqual([
      "measurement-mass",
      "measurement-volume",
    ]);
    expect(model.scenes[0]?.physicsEngine).toBe("deterministic-equal-volume-samples");
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
      "cut-uniform-sample",
      "same-mass-different-volume",
      "same-volume-different-mass",
    ]);
    for (const experiment of model.experiments) {
      const kinds = experiment.expectedEvidence.map((item) => item.kind);
      for (const kind of required) {
        expect(kinds).toContain(kind);
      }
    }
  });

  it("treats keyword overlap as a signal, not mastery", () => {
    const signals = extractDensitySignals("更重密度就更大，更大密度就更大，切开密度变小。");
    expect(signals.claimsHeavierMeansDenser).toBe(true);
    expect(signals.claimsBiggerMeansDenser).toBe(true);
    expect(signals.claimsCuttingLowersDensity).toBe(true);
    expect(extractDensitySignals("质量变大，所以密度一定变大。").claimsHeavierMeansDenser).toBe(
      true,
    );
    expect(deriveModelEvidenceLevel({})).toBe("L0");
  });

  it("accepts a full-model transfer only with the ratio relation", () => {
    const accepted = evaluateTransferAttempt({
      targetId: "near-equal-cups-of-liquids",
      transferMode: TransferMode.FULL_MODEL,
      selectedRelations: [MODEL_RELATION_IDS.densityIsMassPerVolume],
      rejectedRelations: [],
      studentExplanation: "杯子体积相同，水和油质量不同，密度是单位体积的质量。",
    });
    expect(accepted.accepted).toBe(true);

    const rejected = evaluateTransferAttempt({
      targetId: "near-equal-cups-of-liquids",
      transferMode: TransferMode.FULL_MODEL,
      selectedRelations: [],
      rejectedRelations: [],
      studentExplanation: "更重密度就更大。",
    });
    expect(rejected.accepted).toBe(false);
    expect(rejected.failureKinds).toContain("missing-mass-volume-ratio");
  });

  it("is IMPLEMENTATION_READY with overlay and does not create L6 from definition alone", () => {
    const result = validatePhysicsModelReadiness(
      model,
      model.scenes[0]!,
      densityMassVolumeAssessmentOverlay,
    );
    expect(result.status).toBe("IMPLEMENTATION_READY");
    expect(result.missing).toEqual([]);
    expect(result.blockers).toEqual([]);
    expect(model.metadata.status).toBe("prototype");
    expect(model.metadata.status).not.toBe("validated");
    expect(deriveModelEvidenceLevel({})).toBe("L0");
  });
});
