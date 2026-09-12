import { describe, expect, it } from "vitest";

import {
  extractSpecificHeatSignals,
  evaluateTransferAttempt,
  HEATED_SAMPLE_CATALOG,
  MINIMUM_L4_MODEL_EVIDENCE,
  officialAbsorbedEnergyJ,
  officialTemperatureChangeC,
  PRODUCTION_AI_OFF_IDS,
  PRODUCTION_EXAM_PATTERN_IDS,
  PRODUCTION_PHYSICS_ENGINE,
  PRODUCTION_SCENE_ID,
  PRODUCTION_TRANSFER_REQUIRED_IDS,
  specificHeatCapacityAssessmentOverlay,
  specificHeatCapacityModel as model,
} from "@/content/physics-models/specific-heat-capacity";
import {
  MODEL_CONDITION_IDS,
  MODEL_QUANTITY_IDS,
  MODEL_RELATION_IDS,
  MODEL_REPRESENTATION_KIND,
} from "@/content/physics-models/specific-heat-capacity/model";
import { SPECIFIC_HEAT_CAPACITY_ID } from "@/lib/physics-models/canonical-ids";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import {
  inferModelRepresentationKind,
  validatePhysicsModelReadiness,
} from "@/lib/physics-models/readiness";
import { validatePhysicsModel } from "@/lib/physics-models/validate";
import { ExperimentEvidenceKind, TransferMode } from "@/types/physics-model";

describe("specific-heat-capacity", () => {
  it("uses the canonical model ID and does not invent a duplicate", () => {
    expect(model.id).toBe(SPECIFIC_HEAT_CAPACITY_ID);
    expect(model.id).toBe("specific-heat-capacity");
  });

  it("passes PhysicsModel schema and referential validation", () => {
    const result = validatePhysicsModel(model);
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("is a quantitative relation model, not an energy chain, force board, or density board", () => {
    expect(model.energyRelations ?? []).toEqual([]);
    expect(model.modelEvaluator.requiredComponents.identifiesEnergySource).toBeUndefined();
    expect(
      model.modelEvaluator.requiredComponents.identifiesCurrentMotionState,
    ).toBeUndefined();
    expect(model.modelEvaluator.requiredComponents.identifiesDensity).toBeUndefined();
    expect(
      model.modelEvaluator.requiredComponents.usesHeatMassTempRelation.length,
    ).toBeGreaterThan(0);
    expect(MODEL_REPRESENTATION_KIND).toBe("ratio-quantitative");
    expect(inferModelRepresentationKind(model)).not.toBe("energy-chain");
    expect(inferModelRepresentationKind(model)).not.toBe("ratio-quantitative");
  });

  it("keeps relation endpoints on defined quantities and required controls", () => {
    const quantityIds = new Set(model.quantities.map((item) => item.id));
    for (const relation of model.causalRelations) {
      expect(quantityIds.has(relation.from)).toBe(true);
      expect(quantityIds.has(relation.to)).toBe(true);
      expect(relation.relation).toBe("depends-on");
    }
    const cToQ = model.causalRelations.find(
      (item) =>
        item.from === MODEL_QUANTITY_IDS.specificHeatCapacity &&
        item.to === MODEL_QUANTITY_IDS.heatEnergy,
    );
    expect(cToQ?.conditions).toEqual(
      expect.arrayContaining([
        MODEL_CONDITION_IDS.sameMassComparison,
        MODEL_CONDITION_IDS.sameDeltaTComparison,
      ]),
    );
    const deltaTToQ = model.causalRelations.find(
      (item) =>
        item.from === MODEL_QUANTITY_IDS.temperatureChange &&
        item.to === MODEL_QUANTITY_IDS.heatEnergy,
    );
    expect(deltaTToQ?.conditions).toEqual(
      expect.arrayContaining([
        MODEL_CONDITION_IDS.sameMassComparison,
        MODEL_CONDITION_IDS.sameMaterialComparison,
      ]),
    );
  });

  it("locks L4 to six-part ratio evidence, not the formula alone", () => {
    expect(MINIMUM_L4_MODEL_EVIDENCE).toEqual([
      "core-relation-q-equals-c-m-delta-t",
      "same-mass-same-delta-t-larger-c-larger-q",
      "same-mass-same-q-larger-c-smaller-delta-t",
      "same-c-same-q-larger-mass-smaller-delta-t",
      "no-phase-change-and-time-is-not-q",
      "c13-temperature-alone-is-insufficient",
    ]);
    expect(model.modelEvaluator.evidenceLevels.L4).toMatch(/只写出公式或三条口号不算/);
    expect(model.modelEvaluator.requiredComponents.checksTemperatureSufficiency).toMatch(
      /只知道温度升了/,
    );
  });

  it("keeps same heating time as an approximation of Q, not an identity", () => {
    const heatingCompare = model.experiments.find(
      (item) => item.id === "same-mass-same-heating-different-material",
    );
    expect(heatingCompare?.question).toMatch(/不是时间等于能量|近似/);
    expect(heatingCompare?.allowedOperations[0]?.description).toMatch(/近似/);
  });

  it("finalizes the production anchor Scene and keeps measurement models supporting-only", () => {
    expect(model.scenes).toHaveLength(1);
    expect(model.scenes[0]?.id).toBe(PRODUCTION_SCENE_ID);
    expect(model.scenes[0]?.id).toBe("equal-mass-heated-samples");
    expect(model.scenes[0]?.primaryModel).toBe(SPECIFIC_HEAT_CAPACITY_ID);
    expect(model.scenes[0]?.secondaryModels).toEqual([
      "measurement-mass",
      "measurement-temperature",
    ]);
    expect(model.scenes[0]?.physicsEngine).toBe(PRODUCTION_PHYSICS_ENGINE);
    expect(model.scenes[0]?.observableVariables).toContain(MODEL_QUANTITY_IDS.heatEnergy);
    expect(PRODUCTION_TRANSFER_REQUIRED_IDS).toEqual([
      "near-two-pots-water-and-oil",
      "far-ice-water-heated",
    ]);
    expect(PRODUCTION_EXAM_PATTERN_IDS).toHaveLength(5);
    expect(PRODUCTION_AI_OFF_IDS).toEqual([
      "ai-off-unfamiliar-two-lunchboxes",
      "ai-off-condition-ice-pack-stays-cold",
    ]);
  });

  it("locks official catalog outcomes without treating time as Q", () => {
    const qSame = officialAbsorbedEnergyJ("Q-same");
    const qDouble = officialAbsorbedEnergyJ("Q-double");
    expect(officialTemperatureChangeC(HEATED_SAMPLE_CATALOG["water-100g"], qSame)).toBe(10);
    expect(officialTemperatureChangeC(HEATED_SAMPLE_CATALOG["sand-100g"], qSame)).toBe(50);
    expect(officialTemperatureChangeC(HEATED_SAMPLE_CATALOG["water-200g"], qSame)).toBe(5);
    expect(officialTemperatureChangeC(HEATED_SAMPLE_CATALOG["water-100g"], qDouble)).toBe(20);
    expect(() =>
      officialTemperatureChangeC(HEATED_SAMPLE_CATALOG["water-100g"], 50_000),
    ).toThrow(/phase-change/);
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
      "same-mass-same-heating-different-material",
      "same-material-same-heating-different-mass",
      "same-material-same-mass-different-energy",
    ]);
    for (const experiment of model.experiments) {
      const kinds = experiment.expectedEvidence.map((item) => item.kind);
      for (const kind of required) {
        expect(kinds).toContain(kind);
      }
    }
  });

  it("treats keyword overlap as a signal, not mastery", () => {
    const signals = extractSpecificHeatSignals("更烫能量就更多，加热一样久温度就一样。");
    expect(signals.claimsHotterMeansMoreHeat).toBe(true);
    expect(signals.claimsSameTimeSameRise).toBe(true);
    expect(deriveModelEvidenceLevel({})).toBe("L0");
  });

  it("accepts a full-model transfer only with the heat-mass-temperature relation", () => {
    const accepted = evaluateTransferAttempt({
      targetId: "near-two-pots-water-and-oil",
      transferMode: TransferMode.FULL_MODEL,
      selectedRelations: [MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT],
      rejectedRelations: [],
      studentExplanation: "质量和加热可以看成相同，油的比热容不同，所以升温不同。",
    });
    expect(accepted.accepted).toBe(true);

    const rejected = evaluateTransferAttempt({
      targetId: "near-two-pots-water-and-oil",
      transferMode: TransferMode.FULL_MODEL,
      selectedRelations: [],
      rejectedRelations: [],
      studentExplanation: "更烫能量就更多。",
    });
    expect(rejected.accepted).toBe(false);
    expect(rejected.failureKinds).toContain("missing-heat-mass-temp-relation");

    const coastalWithoutLimit = evaluateTransferAttempt({
      targetId: "medium-coastal-vs-inland",
      transferMode: TransferMode.FULL_MODEL,
      selectedRelations: [MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT],
      rejectedRelations: [],
      studentExplanation: "海边水多，比热容更大，所以温差更小。",
    });
    expect(coastalWithoutLimit.accepted).toBe(false);
    expect(coastalWithoutLimit.failureKinds).toContain("missing-non-transfer-limit");

    const coastalWithLimit = evaluateTransferAttempt({
      targetId: "medium-coastal-vs-inland",
      transferMode: TransferMode.FULL_MODEL,
      selectedRelations: [MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT],
      rejectedRelations: [],
      studentExplanation:
        "水的比热容更大，同样能量下温度变化更小。风力、季节不能直接搬过来。",
    });
    expect(coastalWithLimit.accepted).toBe(true);

    const iceShortcut = evaluateTransferAttempt({
      targetId: "far-ice-water-heated",
      transferMode: TransferMode.BOUNDARY_CONTRAST,
      selectedRelations: [MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT],
      rejectedRelations: [],
      studentExplanation: "两边都还在加热。",
    });
    expect(iceShortcut.accepted).toBe(false);
    expect(iceShortcut.failureKinds).toContain("missing-phase-change-boundary");

    const iceBoundary = evaluateTransferAttempt({
      targetId: "far-ice-water-heated",
      transferMode: TransferMode.BOUNDARY_CONTRAST,
      selectedRelations: [
        MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT,
        MODEL_RELATION_IDS.temperatureAloneDoesNotGiveQ,
        MODEL_RELATION_IDS.phaseChangeNeedsAnotherModel,
      ],
      rejectedRelations: [],
      studentExplanation:
        "还可能有能量进入，但冰在熔化，没有 ΔT 时不能用 Q = c m ΔT 写完这段过程。",
      conditionChecks: [
        "melting-phase-change",
        "energy-can-enter-without-rise",
        "cannot-finish-with-q-equals-c-m-dt",
      ],
    });
    expect(iceBoundary.accepted).toBe(true);
  });

  it("rejects material-name-only reasoning as conclusion-only", () => {
    const weak = extractSpecificHeatSignals("因为材料不同，所以升温不同。");
    expect(weak.claimsMaterialNameAlone).toBe(true);
    expect(weak.conclusionOnlyMaterialReasoning).toBe(true);
    const stronger = extractSpecificHeatSignals(
      "质量几乎相同，加热时间只说明能量可以看成相近。材料比热容不同，所以温度变化不同。",
    );
    expect(stronger.conclusionOnlyMaterialReasoning).toBe(false);
    expect(stronger.considersQMassAndDeltaTTogether).toBe(true);
    expect(
      specificHeatCapacityAssessmentOverlay.independent?.[
        "ai-off-unfamiliar-two-lunchboxes"
      ]?.postCheck.some((item) => item.id === "material-name-alone" && item.distractor),
    ).toBe(true);
  });

  it("can be information-ready without creating L-levels or validation", () => {
    const result = validatePhysicsModelReadiness(
      model,
      model.scenes[0]!,
      specificHeatCapacityAssessmentOverlay,
    );
    expect(result.status).toBe("IMPLEMENTATION_READY");
    expect(result.missing).toEqual([]);
    expect(result.blockers).toEqual([]);
    expect(result.warnings.map((item) => item.path)).toEqual(
      expect.arrayContaining(["energyRelations", "modelRepresentation"]),
    );
    expect(inferModelRepresentationKind(model)).toBe("relation-condition");
    expect(MODEL_REPRESENTATION_KIND).toBe("ratio-quantitative");
    expect(model.metadata.status).toBe("prototype");
    expect(model.metadata.status).not.toBe("validated");
    expect(deriveModelEvidenceLevel({})).toBe("L0");
  });
});
