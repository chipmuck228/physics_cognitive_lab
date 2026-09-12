import { describe, expect, it } from "vitest";

import {
  actualThroughNearFocusRay,
  officialImageConsequence,
  twoStandardRays,
} from "@/content/physics-models/convex-lens-imaging/construction";
import {
  applyLensAiOffPostCheck,
  buildLensAiOffAssessment,
  buildLensAiOffAttempt,
  completeLensAiOffDraft,
  intendedLensAiOffAnswerId,
  intendedLensAiOffPostCheckIds,
  LENS_AI_OFF_A,
  LENS_AI_OFF_B,
} from "@/lib/learning/lens-ai-off";
import { accumulateConvexLensSceneEvidence } from "@/lib/learning/lens-evidence";
import {
  buildLensExamAttempt,
  LENS_EXAM_PATTERN_IDS,
} from "@/lib/learning/lens-exam";
import {
  buildLensModelAttempt,
  completeLensModelDraft,
  emptyLensModelDraft,
} from "@/lib/learning/lens-model";
import {
  buildLensTransferAttempt,
  completeLensTransferDraft,
} from "@/lib/learning/lens-transfer";
import { createSession } from "@/lib/learning/session";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { CONVEX_LENS_SCENE_ID } from "@/types/learning";

function lensSession() {
  return createSession(() => "t0", () => "lens-session", CONVEX_LENS_SCENE_ID);
}

function withValidModel(session = lensSession()) {
  session.modelAttempts = [buildLensModelAttempt(completeLensModelDraft(), "t1")];
  return session;
}

describe("Scene 07 adversarial L4 / L5 / L6", () => {
  it("properties-only cannot set L4", () => {
    const draft = completeLensModelDraft();
    draft.studentReasoning = "这是实像，倒立，比物体小，光屏可以接到。";
    const attempt = buildLensModelAttempt(draft, "t1");
    expect(attempt.correctStructure).toBe(false);
    const session = lensSession();
    session.modelAttempts = [attempt];
    const evidence = accumulateConvexLensSceneEvidence(session);
    expect(evidence.constructedValidCausalModel).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).not.toBe("L4");
  });

  it("finished diagram recognition cannot set L4", () => {
    const draft = completeLensModelDraft();
    const attempt = buildLensModelAttempt(draft, "t1");
    expect(attempt.correctStructure).toBe(true);
    attempt.failureKinds = ["recognized-finished-diagram"];
    attempt.correctStructure = false;
    const session = lensSession();
    session.modelAttempts = [attempt];
    expect(accumulateConvexLensSceneEvidence(session).constructedValidCausalModel).toBeUndefined();
  });

  it("table row cannot set L4", () => {
    const draft = completeLensModelDraft();
    draft.studentReasoning = "u>2f，所以倒立缩小实像";
    const attempt = buildLensModelAttempt(draft, "t1");
    expect(attempt.failureKinds).toContain("table-row-only");
    expect(attempt.correctStructure).toBe(false);
  });

  it("incoherent rays cannot set L4", () => {
    const draft = completeLensModelDraft();
    draft.rayA = {
      kind: "parallel-axis",
      beforeLens: "parallel-to-principal-axis",
      afterLens: "undeviated",
      incidentPath: "actual",
    };
    const attempt = buildLensModelAttempt(draft, "t1");
    expect(attempt.failureKinds).toContain("geometrically-incoherent-rays");
    expect(attempt.correctStructure).toBe(false);
  });

  it("station-impossible ray cannot set L4", () => {
    const draft = completeLensModelDraft("inside-f");
    const extra = actualThroughNearFocusRay();
    draft.includeOptionalFocal = true;
    draft.optionalFocal = extra;
    const attempt = buildLensModelAttempt(draft, "t1");
    expect(attempt.failureKinds).toContain("station-impossible-ray");
    expect(attempt.correctStructure).toBe(false);
  });

  it("valid spatial construction sets L4 flag", () => {
    const session = withValidModel();
    const evidence = accumulateConvexLensSceneEvidence(session);
    expect(evidence.constructedValidCausalModel).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L4");
    expect(emptyLensModelDraft().kind).toBe("lens-model-draft");
  });

  it("one transfer target does not set L5", () => {
    const session = withValidModel();
    session.transferAttempts = [
      buildLensTransferAttempt(completeLensTransferDraft("near-projector-real-enlarged"), "t2"),
    ];
    const evidence = accumulateConvexLensSceneEvidence(session);
    expect(evidence.successfulTransfer).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).toBe("L4");
  });

  it("both valid transfer targets set L5", () => {
    const session = withValidModel();
    session.transferAttempts = [
      buildLensTransferAttempt(completeLensTransferDraft("near-projector-real-enlarged"), "t2"),
      buildLensTransferAttempt(completeLensTransferDraft("far-magnifying-glass-virtual"), "t3"),
    ];
    const evidence = accumulateConvexLensSceneEvidence(session);
    expect(evidence.successfulTransfer).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
  });

  it("camera cannot substitute for the required pair", () => {
    const session = withValidModel();
    const camera = completeLensTransferDraft("near-projector-real-enlarged");
    camera.targetId = "medium-camera-real-reduced";
    camera.objectStation = "beyond-2f";
    camera.meetingMode = "actual-convergence";
    const image = officialImageConsequence("beyond-2f");
    camera.side = image.side;
    camera.nature = image.nature;
    camera.orientation = image.orientation;
    camera.size = image.size;
    camera.screenReceivable = "true";
    camera.studentExplanation =
      "远处景物在 2F 以外，光线真正会聚，所以成倒立缩小实像，感光面放到像的位置才能接到。";
    session.transferAttempts = [
      buildLensTransferAttempt(camera, "t2"),
      buildLensTransferAttempt(completeLensTransferDraft("far-magnifying-glass-virtual"), "t3"),
    ];
    const evidence = accumulateConvexLensSceneEvidence(session);
    expect(evidence.successfulTransfer).toBeUndefined();
  });

  it("EXAM cannot set L6", () => {
    const session = withValidModel();
    session.transferAttempts = [
      buildLensTransferAttempt(completeLensTransferDraft("near-projector-real-enlarged"), "t2"),
      buildLensTransferAttempt(completeLensTransferDraft("far-magnifying-glass-virtual"), "t3"),
    ];
    session.examAttempts = LENS_EXAM_PATTERN_IDS.map((patternId) =>
      buildLensExamAttempt({
        patternId,
        representation: "物距相对 2F 的光具座图",
        modelRecognition: "u > 2f 时另一侧成倒立、缩小的实像，光屏可接到",
        selectedAnswer: "另一侧成倒立、缩小的实像，光屏放在像的位置可以接到。",
        reasoning: "先判断物体在 2F 以外，光线真正会聚。",
        timestamp: "t4",
      }),
    );
    const evidence = accumulateConvexLensSceneEvidence(session);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
    expect(evidence.independentAiOffSuccess).toBeUndefined();
  });

  it("one AI_OFF challenge cannot set L6", () => {
    const session = withValidModel();
    session.transferAttempts = [
      buildLensTransferAttempt(completeLensTransferDraft("near-projector-real-enlarged"), "t2"),
      buildLensTransferAttempt(completeLensTransferDraft("far-magnifying-glass-virtual"), "t3"),
    ];
    const draft = completeLensAiOffDraft(LENS_AI_OFF_A);
    session.independentAssessment = buildLensAiOffAssessment(
      [buildLensAiOffAttempt(draft, "t5", intendedLensAiOffPostCheckIds(LENS_AI_OFF_A), false)],
      false,
    );
    const evidence = accumulateConvexLensSceneEvidence(session);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
  });

  it("post-check cannot manufacture L6", () => {
    const session = withValidModel();
    session.transferAttempts = [
      buildLensTransferAttempt(completeLensTransferDraft("near-projector-real-enlarged"), "t2"),
      buildLensTransferAttempt(completeLensTransferDraft("far-magnifying-glass-virtual"), "t3"),
    ];
    const weak = completeLensAiOffDraft(LENS_AI_OFF_A);
    weak.reasoning = "这也有凸透镜";
    weak.objectStation = "inside-f";
    const committed = buildLensAiOffAttempt(weak, "t5", [], false);
    const patched = applyLensAiOffPostCheck(
      committed,
      weak,
      intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
      false,
    );
    expect(patched.accepted).toBe(false);
    session.independentAssessment = buildLensAiOffAssessment(
      [
        patched,
        buildLensAiOffAttempt(
          completeLensAiOffDraft(LENS_AI_OFF_B),
          "t6",
          intendedLensAiOffPostCheckIds(LENS_AI_OFF_B),
          false,
        ),
      ],
      false,
    );
    const evidence = accumulateConvexLensSceneEvidence(session);
    expect(evidence.independentAiOffSuccess).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
  });

  it("llmUsed true blocks L6", () => {
    const session = withValidModel();
    session.transferAttempts = [
      buildLensTransferAttempt(completeLensTransferDraft("near-projector-real-enlarged"), "t2"),
      buildLensTransferAttempt(completeLensTransferDraft("far-magnifying-glass-virtual"), "t3"),
    ];
    session.independentAssessment = buildLensAiOffAssessment(
      [
        buildLensAiOffAttempt(
          completeLensAiOffDraft(LENS_AI_OFF_A),
          "t5",
          intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
          true,
        ),
        buildLensAiOffAttempt(
          completeLensAiOffDraft(LENS_AI_OFF_B),
          "t6",
          intendedLensAiOffPostCheckIds(LENS_AI_OFF_B),
          true,
        ),
      ],
      true,
    );
    const evidence = accumulateConvexLensSceneEvidence(session);
    expect(evidence.independentAiOffSuccess).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
  });

  it("both valid AI_OFF precommits permit L6", () => {
    const session = withValidModel();
    session.transferAttempts = [
      buildLensTransferAttempt(completeLensTransferDraft("near-projector-real-enlarged"), "t2"),
      buildLensTransferAttempt(completeLensTransferDraft("far-magnifying-glass-virtual"), "t3"),
    ];
    session.independentAssessment = buildLensAiOffAssessment(
      [
        buildLensAiOffAttempt(
          completeLensAiOffDraft(LENS_AI_OFF_A),
          "t5",
          intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
          false,
        ),
        buildLensAiOffAttempt(
          completeLensAiOffDraft(LENS_AI_OFF_B),
          "t6",
          intendedLensAiOffPostCheckIds(LENS_AI_OFF_B),
          false,
        ),
      ],
      false,
    );
    const evidence = accumulateConvexLensSceneEvidence(session);
    expect(evidence.independentAiOffSuccess).toBe(true);
    expect(evidence.llmDisabledDuringIndependent).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L6");
    expect(intendedLensAiOffAnswerId(LENS_AI_OFF_A)).toBe("distant-object-real-reduced");
    expect(twoStandardRays()).toHaveLength(2);
  });
});
