import {
  evaluateConvexLensModelConstruction,
  twoStandardRays,
  type CanonicalRayChoice,
  type ConvexLensModelAttempt,
  type ImageConsequence,
  type MeetingMode,
} from "@/content/physics-models/convex-lens-imaging/construction";
import { officialImageConsequence } from "@/content/physics-models/convex-lens-imaging/construction";
import { studentUiFeedback, type StudentUiFeedback } from "@/lib/learning/student-ui-feedback";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import type { ModelAttempt } from "@/types/learning";

export const LENS_MODEL_DRAFT_KIND = "lens-model-draft";

export interface LensRayDraft {
  kind: string;
  beforeLens: string;
  afterLens: string;
  incidentPath: string;
}

export interface LensModelDraft {
  kind: typeof LENS_MODEL_DRAFT_KIND;
  objectStation: string;
  rayA: LensRayDraft;
  rayB: LensRayDraft;
  includeOptionalFocal: boolean;
  optionalFocal: LensRayDraft;
  meetingMode: string;
  side: string;
  nature: string;
  orientation: string;
  size: string;
  screenReceivable: string;
  studentReasoning: string;
}

export function emptyLensRayDraft(): LensRayDraft {
  return { kind: "", beforeLens: "", afterLens: "", incidentPath: "" };
}

export function emptyLensModelDraft(): LensModelDraft {
  return {
    kind: LENS_MODEL_DRAFT_KIND,
    objectStation: "",
    rayA: emptyLensRayDraft(),
    rayB: emptyLensRayDraft(),
    includeOptionalFocal: false,
    optionalFocal: emptyLensRayDraft(),
    meetingMode: "",
    side: "",
    nature: "",
    orientation: "",
    size: "",
    screenReceivable: "",
    studentReasoning: "",
  };
}

function asRay(draft: LensRayDraft): CanonicalRayChoice | null {
  if (!draft.kind || !draft.beforeLens || !draft.afterLens || !draft.incidentPath) {
    return null;
  }
  return {
    kind: draft.kind as CanonicalRayChoice["kind"],
    beforeLens: draft.beforeLens as CanonicalRayChoice["beforeLens"],
    afterLens: draft.afterLens as CanonicalRayChoice["afterLens"],
    incidentPath: draft.incidentPath as CanonicalRayChoice["incidentPath"],
  };
}

export function draftToConvexLensAttempt(
  draft: LensModelDraft,
): ConvexLensModelAttempt | null {
  const rayA = asRay(draft.rayA);
  const rayB = asRay(draft.rayB);
  if (
    !draft.objectStation ||
    !rayA ||
    !rayB ||
    !draft.meetingMode ||
    !draft.side ||
    !draft.nature ||
    !draft.orientation ||
    !draft.size ||
    (draft.screenReceivable !== "true" && draft.screenReceivable !== "false")
  ) {
    return null;
  }
  const rays: CanonicalRayChoice[] = [rayA, rayB];
  if (draft.includeOptionalFocal) {
    const extra = asRay(draft.optionalFocal);
    if (extra) {
      rays.push(extra);
    }
  }
  return {
    objectStation: draft.objectStation as ObjectStation,
    rays,
    meetingMode: draft.meetingMode as MeetingMode,
    image: {
      side: draft.side as ImageConsequence["side"],
      nature: draft.nature as ImageConsequence["nature"],
      orientation: draft.orientation as ImageConsequence["orientation"],
      size: draft.size as ImageConsequence["size"],
      screenReceivable: draft.screenReceivable === "true",
    },
    modelReasoning: draft.studentReasoning,
    constructionSource: "student-constructed",
  };
}

export function buildLensModelAttempt(
  draft: LensModelDraft,
  timestamp: string,
): ModelAttempt {
  const attempt = draftToConvexLensAttempt(draft);
  if (!attempt) {
    return {
      nodes: ["incomplete"],
      connections: [],
      correctStructure: false,
      timestamp,
      failureKinds: ["missing-required-construction-pair"],
      studentReasoning: draft.studentReasoning,
    };
  }
  const result = evaluateConvexLensModelConstruction(attempt);
  return {
    nodes: [
      `station:${attempt.objectStation}`,
      `meeting:${attempt.meetingMode}`,
      ...attempt.rays.map((ray) => `ray:${ray.kind}:${ray.beforeLens}:${ray.afterLens}:${ray.incidentPath}`),
      `image:${attempt.image.side}:${attempt.image.nature}:${attempt.image.orientation}:${attempt.image.size}:${attempt.image.screenReceivable}`,
    ],
    connections: [
      { from: "objectStation", to: "meetingMode" },
      { from: "meetingMode", to: "image" },
    ],
    correctStructure: result.ok,
    timestamp,
    failureKinds: result.ok ? [] : [result.failureKind],
    studentReasoning: attempt.modelReasoning,
    completenessOnly: result.failureKind === "properties-without-relation",
  };
}

export function hasCompletedLensModel(
  attempts: Array<{ correctStructure: boolean }>,
): boolean {
  return attempts.some((attempt) => attempt.correctStructure);
}

export function reconstructLensAttemptFromModel(
  attempt: ModelAttempt,
): ConvexLensModelAttempt | null {
  const station = attempt.nodes.find((node) => node.startsWith("station:"))?.slice(8);
  const meeting = attempt.nodes.find((node) => node.startsWith("meeting:"))?.slice(8);
  const imageNode = attempt.nodes.find((node) => node.startsWith("image:"));
  const rayNodes = attempt.nodes.filter((node) => node.startsWith("ray:"));
  if (!station || !meeting || !imageNode || rayNodes.length < 2) {
    return null;
  }
  const [, side, nature, orientation, size, receivable] = imageNode.split(":");
  const rays = rayNodes.map((node) => {
    const parts = node.split(":");
    return {
      kind: parts[1] as CanonicalRayChoice["kind"],
      beforeLens: parts[2] as CanonicalRayChoice["beforeLens"],
      afterLens: parts[3] as CanonicalRayChoice["afterLens"],
      incidentPath: parts[4] as CanonicalRayChoice["incidentPath"],
    };
  });
  return {
    objectStation: station as ObjectStation,
    rays,
    meetingMode: meeting as MeetingMode,
    image: {
      side: side as ImageConsequence["side"],
      nature: nature as ImageConsequence["nature"],
      orientation: orientation as ImageConsequence["orientation"],
      size: size as ImageConsequence["size"],
      screenReceivable: receivable === "true",
    },
    modelReasoning: attempt.studentReasoning ?? "",
    constructionSource: "student-constructed",
  };
}

export function lensModelMissingLabels(draft: LensModelDraft): string[] {
  const missing: string[] = [];
  if (!draft.objectStation) {
    missing.push("物体相对 F / 2F 在哪里");
  }
  if (!draft.rayA.kind || !draft.rayA.beforeLens || !draft.rayA.afterLens || !draft.rayA.incidentPath) {
    missing.push("第一条光线怎么走");
  }
  if (!draft.rayB.kind || !draft.rayB.beforeLens || !draft.rayB.afterLens || !draft.rayB.incidentPath) {
    missing.push("第二条光线怎么走");
  }
  if (!draft.meetingMode) {
    missing.push("光线是真正会聚、反向延长，还是不相交");
  }
  if (!draft.side || !draft.nature || !draft.orientation || !draft.size || !draft.screenReceivable) {
    missing.push("像在哪一侧、是什么性质、光屏能不能接到");
  }
  if (!draft.studentReasoning.trim()) {
    missing.push("用一句话写出为什么会聚方式会带来这样的像");
  }
  return missing;
}

export function summarizeLensModelAttempt(attempt: ModelAttempt): string {
  if (attempt.correctStructure) {
    return "你用两条对应这个物距站点的光线，说明了会聚方式和像的后果。";
  }
  const kinds = attempt.failureKinds ?? [];
  if (kinds.includes("recognized-finished-diagram") || kinds.includes("copied-visible-diagram")) {
    return "认出一张画好的图还不够。要自己决定两条光线怎么走。";
  }
  if (kinds.includes("table-row-only")) {
    return "只背“倒立缩小实像”不够。要写出光线是真正会聚还是反向延长。";
  }
  if (kinds.includes("properties-without-relation") || kinds.includes("authored-missing-meeting-bind")) {
    return "像的性质选对了还不够。要用自己的话把会聚方式和像连起来。";
  }
  if (kinds.includes("missing-required-construction-pair")) {
    return "建构必须包含平行主光轴和过光心这两条光线。可选焦点光线不能代替它们。";
  }
  if (kinds.includes("geometrically-incoherent-rays")) {
    return "光线名字和走法要一致。平行主光轴的光线过另一侧焦点；过光心的光线方向不变。";
  }
  if (kinds.includes("station-impossible-ray")) {
    return "过近侧焦点的第三条光线要符合当前物距。焦点以内不能画成实际穿过近侧焦点。";
  }
  if (kinds.includes("u-equals-f-as-ordinary-image")) {
    return "物体正好在焦点上时，有限远处不成完整的像。";
  }
  if (kinds.includes("image-conflicts-meeting-mode") || kinds.includes("meeting-mode-conflicts-station")) {
    return "会聚方式和像的后果要互相匹配，也要符合你选的物距站点。";
  }
  return "先自己组装两条光线，再说明交点怎样决定像。";
}

export function lensModelStudentFeedback(
  draft: LensModelDraft,
  attempt: ModelAttempt,
): StudentUiFeedback {
  return studentUiFeedback(lensModelMissingLabels(draft), summarizeLensModelAttempt(attempt));
}

export function completeLensModelDraft(station: ObjectStation = "beyond-2f"): LensModelDraft {
  const [parallel, center] = twoStandardRays();
  const image = officialImageConsequence(station);
  const meeting =
    station === "at-f"
      ? "no-finite-meeting"
      : station === "inside-f"
        ? "backward-extension"
        : "actual-convergence";
  const reasoning =
    station === "at-f"
      ? "物体正好在焦点上，出射光线平行，有限远处不相交，所以不成完整的像。"
      : station === "inside-f"
        ? "物体在焦点以内，光线发散，反向延长线相交，所以是虚像，屏接不到。"
        : "物体在 2F 以外，光线在另一侧真正会聚，所以成倒立缩小的实像，光屏放到交点才能接到。";
  return {
    kind: LENS_MODEL_DRAFT_KIND,
    objectStation: station,
    rayA: parallel!,
    rayB: center!,
    includeOptionalFocal: false,
    optionalFocal: emptyLensRayDraft(),
    meetingMode: meeting,
    side: image.side,
    nature: image.nature,
    orientation: image.orientation,
    size: image.size,
    screenReceivable: image.screenReceivable ? "true" : "false",
    studentReasoning: reasoning,
  };
}
