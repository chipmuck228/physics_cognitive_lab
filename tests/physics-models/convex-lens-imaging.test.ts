import { describe, expect, it } from "vitest";

import {
  convexLensImagingAssessmentOverlay,
  convexLensImagingModel as model,
  EVALUATOR_EXPORT_AUDIT,
  MINIMUM_L4_CONSTRUCTION_EVIDENCE,
  MODEL_QUANTITY_IDS,
  MODEL_REPRESENTATION_KIND,
  officialImagingState,
  officialPartialCoverEffect,
  officialRealImageTrendTowardF,
  officialScreenReceive,
  PRODUCTION_PHYSICS_ENGINE,
  PRODUCTION_SCENE_ID,
  PRODUCTION_TRANSFER_REQUIRED_IDS,
  WEAKEST_PASS_PROBES,
} from "@/content/physics-models/convex-lens-imaging";
import { CONVEX_LENS_IMAGING_ID } from "@/lib/physics-models/canonical-ids";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import {
  inferModelRepresentationKind,
  validatePhysicsModelReadiness,
} from "@/lib/physics-models/readiness";
import { validatePhysicsModel } from "@/lib/physics-models/validate";
import { TransferMode } from "@/types/physics-model";

describe("convex-lens-imaging", () => {
  it("uses the canonical model ID and does not invent a duplicate", () => {
    expect(model.id).toBe(CONVEX_LENS_IMAGING_ID);
    expect(model.id).toBe("convex-lens-imaging");
  });

  it("passes PhysicsModel schema and referential validation", () => {
    const result = validatePhysicsModel(model);
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("stays a quality-reviewed prototype and does not copy energy-chain or ratio-board grammar", () => {
    expect(model.metadata.status).toBe("prototype");
    expect(model.metadata.status).not.toBe("validated");
    expect(model.energyRelations ?? []).toEqual([]);
    expect(model.modelEvaluator.requiredComponents.identifiesEnergySource).toBeUndefined();
    expect(model.modelEvaluator.requiredComponents.identifiesDensity).toBeUndefined();
    expect(MODEL_REPRESENTATION_KIND).toBe("spatial-ray-relation");
    expect(inferModelRepresentationKind(model)).not.toBe("energy-chain");
    expect(inferModelRepresentationKind(model)).not.toBe("ratio-quantitative");
  });

  it("keeps relation endpoints on defined quantities", () => {
    const quantityIds = new Set(model.quantities.map((item) => item.id));
    for (const relation of model.causalRelations) {
      expect(quantityIds.has(relation.from)).toBe(true);
      expect(quantityIds.has(relation.to)).toBe(true);
      expect(relation.relation).toBe("depends-on");
    }
    expect(quantityIds.has(MODEL_QUANTITY_IDS.rayMeetingMode)).toBe(true);
  });

  it("declares the intended bench Scene without secondary teaching targets", () => {
    expect(model.scenes[0]?.id).toBe(PRODUCTION_SCENE_ID);
    expect(model.scenes[0]?.physicsEngine).toBe(PRODUCTION_PHYSICS_ENGINE);
    expect(model.scenes[0]?.secondaryModels ?? []).toEqual([]);
    expect(model.curriculum.formulas ?? []).toEqual([]);
  });

  it("requires a full-model pair that is not only screen applications", () => {
    expect(PRODUCTION_TRANSFER_REQUIRED_IDS).toEqual([
      "near-projector-real-enlarged",
      "far-magnifying-glass-virtual",
    ]);
    const required = model.transferTargets.filter((item) =>
      PRODUCTION_TRANSFER_REQUIRED_IDS.includes(
        item.id as (typeof PRODUCTION_TRANSFER_REQUIRED_IDS)[number],
      ),
    );
    expect(required.every((item) => item.transferMode === TransferMode.FULL_MODEL)).toBe(
      true,
    );
  });

  it("treats official stations as discrete physics truth, not a thin-lens solver", () => {
    expect(officialImagingState("beyond-2f")).toMatchObject({
      rayMeetingMode: "actual-convergence",
      imageNature: "real",
      imageOrientation: "inverted",
      imageSizeRelation: "reduced",
      finiteImage: true,
    });
    expect(officialImagingState("at-2f")).toMatchObject({
      imageSizeRelation: "same-size",
      imageDistanceRegion: "at-2f",
      finiteImage: true,
    });
    expect(officialImagingState("between-f-and-2f")).toMatchObject({
      imageSizeRelation: "enlarged",
      imageDistanceRegion: "beyond-2f",
    });
    expect(officialImagingState("at-f")).toMatchObject({
      rayMeetingMode: "no-finite-meeting",
      imageNature: "none",
      finiteImage: false,
      screenReceivableIfAtImagePlane: false,
    });
    expect(officialImagingState("inside-f")).toMatchObject({
      rayMeetingMode: "backward-extension",
      imageNature: "virtual",
      imageOrientation: "upright",
      screenReceivableIfAtImagePlane: false,
    });
    expect(officialScreenReceive("beyond-2f", true)).toBe("clear");
    expect(officialScreenReceive("beyond-2f", false)).toBe("blurred-or-absent");
    expect(officialScreenReceive("inside-f", true)).toBe("never");
    expect(officialScreenReceive("at-f", true)).toBe("never");
    expect(officialPartialCoverEffect()).toEqual({
      imageComplete: true,
      brightness: "reduced",
    });
    expect(officialRealImageTrendTowardF()).toEqual({
      imageMoves: "farther-from-lens",
      imageSize: "becomes-larger",
    });
  });

  it("locks table recitation and finished-diagram recognition out of L4", () => {
    expect(MINIMUM_L4_CONSTRUCTION_EVIDENCE).toContain(
      "decides-actual-convergence-vs-backward-extension-vs-no-finite-meeting",
    );
    expect(MINIMUM_L4_CONSTRUCTION_EVIDENCE).toContain(
      "authored-meeting-mode-to-image-bind",
    );
    expect(
      WEAKEST_PASS_PROBES.some((item) => item.id === "five-row-table-recitation"),
    ).toBe(true);
    expect(
      WEAKEST_PASS_PROBES.some((item) => item.id === "recognize-completed-ray-diagram"),
    ).toBe(true);
    expect(EVALUATOR_EXPORT_AUDIT.MINIMUM_L4_MODEL_COMPLETENESS).toBe(
      "TOO_WEAK_FOR_L4",
    );
    expect(EVALUATOR_EXPORT_AUDIT.evaluateConvexLensModelConstruction).toBe(
      "READY_FOR_SCENE_EVIDENCE",
    );
    expect(EVALUATOR_EXPORT_AUDIT.assessmentOverlayJudgmentAlone).toBe(
      "TOO_WEAK_FOR_L6",
    );
  });

  it("is information-ready without promoting lifecycle or assigning L-levels", () => {
    const result = validatePhysicsModelReadiness(
      model,
      model.scenes[0]!,
      convexLensImagingAssessmentOverlay,
    );
    expect(result.status).toBe("IMPLEMENTATION_READY");
    expect(result.missing).toEqual([]);
    expect(result.blockers).toEqual([]);
    expect(inferModelRepresentationKind(model)).toBe("relation-condition");
    expect(MODEL_REPRESENTATION_KIND).toBe("spatial-ray-relation");
    expect(model.metadata.status).toBe("prototype");
    expect(model.metadata.status).not.toBe("validated");
    expect(deriveModelEvidenceLevel({})).toBe("L0");
  });
});
