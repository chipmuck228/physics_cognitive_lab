import { describe, expect, it } from "vitest";

import {
  actualThroughNearFocusRay,
  backwardExtensionThroughNearFocusRay,
  evaluateConvexLensAiOff,
  evaluateConvexLensModelConstruction,
  evaluateConvexLensTransfer,
  evaluateRequiredAiOffPair,
  evaluateRequiredTransferPair,
  focalRayReferenceStatus,
  isCanonicalRayGeometricallyCoherent,
  officialImageConsequence,
  twoStandardRays,
} from "@/content/physics-models/convex-lens-imaging/construction";
import type {
  CanonicalRayChoice,
  ConvexLensAiOffAttempt,
  ConvexLensModelAttempt,
  ConvexLensTransferAttempt,
  ImageConsequence,
} from "@/content/physics-models/convex-lens-imaging/construction";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";

function coherentAttempt(
  overrides: Partial<ConvexLensModelAttempt> = {},
): ConvexLensModelAttempt {
  const objectStation = overrides.objectStation ?? "beyond-2f";
  return {
    objectStation,
    rays: twoStandardRays(),
    meetingMode: "actual-convergence",
    image: officialImageConsequence(objectStation),
    modelReasoning:
      "物体在 2F 以外，光线在另一侧真正会聚，所以成倒立缩小的实像，光屏放到交点才能接到。",
    constructionSource: "student-constructed",
    ...overrides,
  };
}

function insideFAttempt(
  overrides: Partial<ConvexLensModelAttempt> = {},
): ConvexLensModelAttempt {
  return coherentAttempt({
    objectStation: "inside-f",
    meetingMode: "backward-extension",
    image: officialImageConsequence("inside-f"),
    modelReasoning:
      "物体在焦点以内，透镜后面的光是散开的，只有反向延长线相交，所以是虚像，屏接不到。",
    ...overrides,
  });
}

function atFAttempt(
  overrides: Partial<ConvexLensModelAttempt> = {},
): ConvexLensModelAttempt {
  return coherentAttempt({
    objectStation: "at-f",
    meetingMode: "no-finite-meeting",
    image: officialImageConsequence("at-f"),
    modelReasoning:
      "物体正好在焦点上时，折射后的光线彼此平行，有限远处不相交，所以光屏怎么移动都接不到清晰像。",
    ...overrides,
  });
}

const projectorPass: ConvexLensTransferAttempt = {
  targetId: "near-projector-real-enlarged",
  objectStation: "between-f-and-2f",
  meetingMode: "actual-convergence",
  image: officialImageConsequence("between-f-and-2f"),
  explanation:
    "幻灯片在 F 和 2F 之间，光线真正会聚，所以成倒立放大的实像，幕布放到像的位置才能接到。",
};

const magnifierPass: ConvexLensTransferAttempt = {
  targetId: "far-magnifying-glass-virtual",
  objectStation: "inside-f",
  meetingMode: "backward-extension",
  image: officialImageConsequence("inside-f"),
  explanation:
    "邮票在焦点以内，光线发散，反向延长线相交，所以是正立放大的虚像，屏接不到。",
};

const windowPass: ConvexLensAiOffAttempt = {
  challengeId: "ai-off-unfamiliar-window-card-projection",
  objectStation: "beyond-2f",
  meetingMode: "actual-convergence",
  image: officialImageConsequence("beyond-2f"),
  preCommitReasoning:
    "窗外景物在 2F 以外，光线在另一侧真正会聚，所以成倒立缩小实像，白卡片是接收器，要放到像的位置才能接到。",
  judgmentId: "distant-object-real-reduced",
  llmUsed: false,
};

const boundaryPass: ConvexLensAiOffAttempt = {
  challengeId: "ai-off-boundary-magnifier-cannot-catch-virtual",
  objectStation: "inside-f",
  meetingMode: "backward-extension",
  image: officialImageConsequence("inside-f"),
  preCommitReasoning:
    "邮票在焦点以内，光线散开，只有反向延长线相交，所以是虚像，白纸接不到。物体正好在焦点上时，折射后的光线彼此平行，有限远处不相交，所以光屏怎么移动都接不到清晰像。",
  judgmentId: "virtual-not-on-screen-and-f-is-limit",
  llmUsed: false,
};

describe("convex-lens-imaging evidence contract", () => {
  it("passes one coherent spatial-ray construction, including equivalent wording", () => {
    expect(evaluateConvexLensModelConstruction(coherentAttempt()).ok).toBe(true);
    expect(evaluateConvexLensModelConstruction(insideFAttempt()).ok).toBe(true);
    expect(evaluateConvexLensModelConstruction(atFAttempt()).ok).toBe(true);
    expect(
      evaluateConvexLensModelConstruction(
        coherentAttempt({
          modelReasoning:
            "2F 以外时出射光线会聚，因此另一侧成实像，光屏放到交点才能接到。",
        }),
      ).ok,
    ).toBe(true);
  });

  it("fails L4 weakest-pass probes", () => {
    const correctImage = officialImageConsequence("beyond-2f");
    expect(
      evaluateConvexLensModelConstruction(
        coherentAttempt({
          modelReasoning: "这是实像，倒立，比物体小，光屏可以接到。",
        }),
      ).failureKind,
    ).toBe("properties-without-relation");
    expect(
      evaluateConvexLensModelConstruction(
        coherentAttempt({
          modelReasoning: "u>2f，所以倒立缩小实像",
        }),
      ).failureKind,
    ).toBe("table-row-only");
    expect(
      evaluateConvexLensModelConstruction(
        coherentAttempt({
          constructionSource: "recognized-option",
        }),
      ).failureKind,
    ).toBe("recognized-finished-diagram");
    expect(
      evaluateConvexLensModelConstruction(
        coherentAttempt({
          constructionSource: "shown-completed-diagram",
        }),
      ).failureKind,
    ).toBe("copied-visible-diagram");

    const incoherent: CanonicalRayChoice[] = [
      {
        kind: "parallel-axis",
        beforeLens: "parallel-to-principal-axis",
        afterLens: "undeviated",
        incidentPath: "actual",
      },
      {
        kind: "through-center",
        beforeLens: "toward-optical-center",
        afterLens: "undeviated",
        incidentPath: "actual",
      },
    ];
    expect(
      evaluateConvexLensModelConstruction(coherentAttempt({ rays: incoherent }))
        .failureKind,
    ).toBe("geometrically-incoherent-rays");

    const virtual: ImageConsequence = {
      side: "same-side",
      nature: "virtual",
      orientation: "upright",
      size: "enlarged",
      screenReceivable: false,
    };
    expect(
      evaluateConvexLensModelConstruction(
        coherentAttempt({
          meetingMode: "actual-convergence",
          image: virtual,
        }),
      ).failureKind,
    ).toBe("image-conflicts-meeting-mode");
    expect(
      evaluateConvexLensModelConstruction(
        insideFAttempt({
          meetingMode: "backward-extension",
          image: correctImage,
        }),
      ).failureKind,
    ).toBe("image-conflicts-meeting-mode");
    expect(
      evaluateConvexLensModelConstruction(
        atFAttempt({
          meetingMode: "actual-convergence",
          image: correctImage,
        }),
      ).failureKind,
    ).toBe("u-equals-f-as-ordinary-image");
    expect(
      evaluateConvexLensModelConstruction(
        coherentAttempt({
          modelReasoning: "物距焦距像距实像虚像倒立正立光屏焦点都说到了。",
        }),
      ).failureKind,
    ).toBe("authored-generic-or-noun-sandwich");
  });

  it("requires both target-bound transfers and rejects substitutions", () => {
    expect(evaluateConvexLensTransfer(projectorPass).ok).toBe(true);
    expect(evaluateConvexLensTransfer(magnifierPass).ok).toBe(true);
    expect(
      evaluateConvexLensTransfer({
        ...projectorPass,
        explanation: "投影仪也有凸透镜。",
      }).failureKind,
    ).toBe("surface-convex-lens-slogan");
    expect(
      evaluateConvexLensTransfer({
        ...magnifierPass,
        explanation: "放大镜也是凸透镜",
      }).failureKind,
    ).toBe("surface-convex-lens-slogan");
    expect(
      evaluateConvexLensTransfer({
        ...magnifierPass,
        ...projectorPass,
        targetId: "far-magnifying-glass-virtual",
      }).failureKind,
    ).toBe("wrong-target-structure");
    expect(
      evaluateConvexLensTransfer({
        ...projectorPass,
        targetId: "medium-camera-real-reduced",
      }).failureKind,
    ).toBe("unknown-or-unrequired-target");
    expect(evaluateRequiredTransferPair([projectorPass]).ok).toBe(false);
    expect(evaluateRequiredTransferPair([projectorPass, magnifierPass]).ok).toBe(
      true,
    );
  });

  it("accepts the required pair at every official station", () => {
    expect(evaluateConvexLensModelConstruction(coherentAttempt()).ok).toBe(true);
    expect(
      evaluateConvexLensModelConstruction(
        coherentAttempt({
          objectStation: "between-f-and-2f",
          image: officialImageConsequence("between-f-and-2f"),
          modelReasoning:
            "物体在 F 与 2F 之间，光线在另一侧真正会聚，所以成倒立放大的实像，光屏放到交点才能接到。",
        }),
      ).ok,
    ).toBe(true);
    expect(evaluateConvexLensModelConstruction(insideFAttempt()).ok).toBe(true);
    expect(evaluateConvexLensModelConstruction(atFAttempt()).ok).toBe(true);
  });

  it("makes focal-ray geometry station-aware", () => {
    expect(focalRayReferenceStatus("beyond-2f")).toBe("actual-optional-reference");
    expect(focalRayReferenceStatus("between-f-and-2f")).toBe(
      "actual-optional-reference",
    );
    expect(focalRayReferenceStatus("inside-f")).toBe(
      "backward-extension-optional-reference",
    );
    expect(focalRayReferenceStatus("at-f")).toBe("not-applicable");

    const actualFocus = actualThroughNearFocusRay();
    expect(isCanonicalRayGeometricallyCoherent("beyond-2f", actualFocus)).toBe(
      true,
    );
    expect(isCanonicalRayGeometricallyCoherent("inside-f", actualFocus)).toBe(
      false,
    );
    expect(isCanonicalRayGeometricallyCoherent("at-f", actualFocus)).toBe(false);

    expect(
      evaluateConvexLensModelConstruction(
        insideFAttempt({
          rays: [...twoStandardRays(), actualThroughNearFocusRay()],
        }),
      ).failureKind,
    ).toBe("station-impossible-ray");
    expect(
      evaluateConvexLensModelConstruction(
        atFAttempt({
          rays: [...twoStandardRays(), actualThroughNearFocusRay()],
        }),
      ).failureKind,
    ).toBe("station-impossible-ray");
    expect(
      evaluateConvexLensModelConstruction(
        coherentAttempt({
          rays: [twoStandardRays()[1]!, actualThroughNearFocusRay()],
        }),
      ).failureKind,
    ).toBe("missing-required-construction-pair");
    expect(
      evaluateConvexLensModelConstruction(
        coherentAttempt({
          rays: [...twoStandardRays(), actualThroughNearFocusRay()],
        }),
      ).ok,
    ).toBe(true);
    expect(
      evaluateConvexLensModelConstruction(
        insideFAttempt({
          rays: [...twoStandardRays(), backwardExtensionThroughNearFocusRay()],
        }),
      ).ok,
    ).toBe(true);
  });

  it("keeps L6 on pre-commit structure and rejects post-check manufacture", () => {
    expect(evaluateConvexLensAiOff(windowPass).ok).toBe(true);
    expect(evaluateConvexLensAiOff(boundaryPass).ok).toBe(true);
    expect(
      evaluateConvexLensAiOff({
        ...windowPass,
        preCommitReasoning: "",
        judgmentId: "distant-object-real-reduced",
      }).ok,
    ).toBe(false);
    expect(
      evaluateConvexLensAiOff({
        ...windowPass,
        preCommitReasoning: "这也有凸透镜，所以一样。",
        judgmentId: "distant-object-real-reduced",
        postCheckIds: [
          "identifiesObjectRelativeToF",
          "identifiesRayMeetingMode",
          "identifiesImageNatureAndOrientation",
          "checksScreenIsReceiver",
        ],
      }).failureKind,
    ).toBe("post-check-cannot-manufacture");
    expect(
      evaluateConvexLensAiOff({
        ...windowPass,
        llmUsed: true,
      }).failureKind,
    ).toBe("llm-used");
    expect(evaluateRequiredAiOffPair([windowPass]).ok).toBe(false);
    expect(evaluateRequiredAiOffPair([windowPass, boundaryPass]).ok).toBe(true);
    expect(
      deriveModelEvidenceLevel({
        constructedValidCausalModel: true,
        successfulTransfer: true,
        independentAiOffSuccess: false,
        llmDisabledDuringIndependent: true,
      }),
    ).toBe("L5");
  });
});
