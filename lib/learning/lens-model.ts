import {
  actualThroughNearFocusRay,
  backwardExtensionThroughNearFocusRay,
  classifyLensStep6FastPath,
  evaluateLensAuthoredSemanticClaim,
  evaluateConvexLensModelConstruction,
  focalRayReferenceStatus,
  lensAuthoredBindMissingMessage,
  isCanonicalRayGeometricallyCoherent,
  officialImageConsequence,
  officialMeetingMode,
  normalizeLensStep6Text,
  REQUIRED_RAY_SEGMENT_PAIRING,
  twoStandardRays,
  type CanonicalRayChoice,
  type ConvexLensModelAttempt,
  type ImageConsequence,
  type LensReasoningSemanticParse,
  type MeetingMode,
} from "@/content/physics-models/convex-lens-imaging/construction";
import { LENS_COPY } from "@/lib/content/convex-lens-optical-bench";
import type { LensProjectableRay } from "@/lib/learning/lens-student-ray-geometry";
import { studentUiFeedback, type StudentUiFeedback } from "@/lib/learning/student-ui-feedback";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import { isObjectStation } from "@/lib/physics/convex-lens-optical-bench";
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
  constructionStep: number;
  step6Interpretation?: LensStep6Interpretation | null;
}

export type LensStep6InterpretationSource =
  | "deterministic-fast-path"
  | "llm-semantic-parse";

export interface LensStep6Interpretation {
  provenance: "system-derived";
  source: LensStep6InterpretationSource;
  textNormalized: string;
  parse: LensReasoningSemanticParse;
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
    constructionStep: 1,
    step6Interpretation: null,
  };
}

export function lensStep6InterpretationMatches(
  draft: LensModelDraft,
): draft is LensModelDraft & { step6Interpretation: LensStep6Interpretation } {
  const stored = draft.step6Interpretation;
  return Boolean(
    stored &&
      stored.provenance === "system-derived" &&
      stored.parse &&
      stored.textNormalized === normalizeLensStep6Text(draft.studentReasoning),
  );
}

export function withClearedLensStep6Interpretation(draft: LensModelDraft): LensModelDraft {
  if (!draft.step6Interpretation) {
    return draft;
  }
  return { ...draft, step6Interpretation: null };
}

export function deriveRequiredRaySupport(
  kind: string,
): {
  beforeLens: CanonicalRayChoice["beforeLens"];
  incidentPath: CanonicalRayChoice["incidentPath"];
} | null {
  if (kind === "parallel-axis" || kind === "through-center") {
    const expected = REQUIRED_RAY_SEGMENT_PAIRING[kind];
    return {
      beforeLens: expected.beforeLens,
      incidentPath: expected.incidentPath,
    };
  }
  return null;
}

export function withDerivedRequiredRay(ray: LensRayDraft): LensRayDraft {
  const derived = deriveRequiredRaySupport(ray.kind);
  if (!derived) {
    return ray;
  }
  return { ...ray, ...derived };
}

export function officialOptionalFocalRay(
  station: ObjectStation,
): CanonicalRayChoice | null {
  const status = focalRayReferenceStatus(station);
  if (status === "not-applicable") {
    return null;
  }
  return status === "actual-optional-reference"
    ? actualThroughNearFocusRay()
    : backwardExtensionThroughNearFocusRay();
}

export function asCompletedLensRay(draft: LensRayDraft): CanonicalRayChoice | null {
  const derived = withDerivedRequiredRay(draft);
  if (!derived.kind || !derived.afterLens) {
    return null;
  }
  const support = deriveRequiredRaySupport(derived.kind);
  if (!support) {
    return null;
  }
  return {
    kind: derived.kind as CanonicalRayChoice["kind"],
    beforeLens: support.beforeLens as CanonicalRayChoice["beforeLens"],
    afterLens: derived.afterLens as CanonicalRayChoice["afterLens"],
    incidentPath: support.incidentPath as CanonicalRayChoice["incidentPath"],
  };
}

export function asVisibleLensRay(draft: LensRayDraft): LensProjectableRay | null {
  const support = deriveRequiredRaySupport(draft.kind);
  if (!support || (draft.kind !== "parallel-axis" && draft.kind !== "through-center")) {
    return null;
  }
  return {
    kind: draft.kind,
    beforeLens: support.beforeLens,
    afterLens: draft.afterLens as LensProjectableRay["afterLens"],
    incidentPath: support.incidentPath,
  };
}

export function visibleLensStudentRays(draft: LensModelDraft): LensProjectableRay[] {
  const rays = [draft.rayA, draft.rayB]
    .map((ray) => asVisibleLensRay(ray))
    .filter((ray): ray is LensProjectableRay => ray !== null);
  if (
    draft.includeOptionalFocal &&
    isObjectStation(draft.objectStation)
  ) {
    const extra = officialOptionalFocalRay(draft.objectStation);
    if (extra) {
      rays.push({ ...extra, optionalReference: true });
    }
  }
  return rays;
}

export function draftToConvexLensAttempt(
  draft: LensModelDraft,
): ConvexLensModelAttempt | null {
  const rayA = asCompletedLensRay(draft.rayA);
  const rayB = asCompletedLensRay(draft.rayB);
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
  if (draft.includeOptionalFocal && isObjectStation(draft.objectStation)) {
    const extra = officialOptionalFocalRay(draft.objectStation);
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
    authoredInterpretation: lensStep6InterpretationMatches(draft)
      ? draft.step6Interpretation.parse
      : null,
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
  if (!draft.rayA.kind || !draft.rayA.afterLens) {
    missing.push("第一条光线怎么走");
  }
  if (!draft.rayB.kind || !draft.rayB.afterLens) {
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
    return "这条光线的名字和经过透镜后的走法还对不上，再看看这条特殊光线经过凸透镜后的规律。";
  }
  if (kinds.includes("station-impossible-ray")) {
    return "过近侧焦点的第三条光线要符合当前物距。焦点以内不能画成实际穿过近侧焦点。";
  }
  if (kinds.includes("u-equals-f-as-ordinary-image")) {
    return "物体正好在焦点上时，折射后的光线彼此平行，不会在有限位置会聚，所以光屏怎么移动都接不到清晰像。";
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

export const LENS_MODEL_STEP_COUNT = 7;

export type LensModelStepCheck =
  | { status: "ready" }
  | { status: "missing"; message: string }
  | { status: "inconsistent"; message: string };

function rayDraftComplete(ray: LensRayDraft): boolean {
  return Boolean(ray.kind && ray.afterLens && deriveRequiredRaySupport(ray.kind));
}

function rayCoherenceCheck(
  draft: LensModelDraft,
  ray: LensRayDraft,
  which: "第一条" | "第二条" | "可选",
): LensModelStepCheck | null {
  const completed = asCompletedLensRay(ray);
  if (!completed || !isObjectStation(draft.objectStation)) {
    return null;
  }
  if (isCanonicalRayGeometricallyCoherent(draft.objectStation, completed)) {
    return null;
  }
  if (completed.kind === "through-near-focus") {
    return {
      status: "inconsistent",
      message:
        which === "可选"
          ? "这条可选光线和现在的物体位置放在一起走不通。先回到两条必做的光线。"
          : "你选的过近侧焦点光线，和现在的物体位置放在一起走不通。再检查这一条。",
    };
  }
  return {
    status: "inconsistent",
    message:
      "这条光线的名字和经过透镜后的走法还对不上，再看看这条特殊光线经过凸透镜后的规律。",
  };
}

function imageCompatibleWithMeeting(draft: LensModelDraft): boolean {
  if (draft.meetingMode === "actual-convergence") {
    return (
      draft.nature === "real" &&
      draft.side === "other-side" &&
      draft.orientation === "inverted" &&
      draft.screenReceivable === "true"
    );
  }
  if (draft.meetingMode === "backward-extension") {
    return (
      draft.nature === "virtual" &&
      draft.side === "same-side" &&
      draft.orientation === "upright" &&
      draft.screenReceivable === "false"
    );
  }
  if (draft.meetingMode === "no-finite-meeting") {
    return (
      draft.nature === "none" &&
      draft.side === "none" &&
      draft.orientation === "none" &&
      draft.size === "none" &&
      draft.screenReceivable === "false"
    );
  }
  return false;
}

function claimToStepCheck(
  claim: ReturnType<typeof evaluateLensAuthoredSemanticClaim>,
): LensModelStepCheck {
  if (claim.status === "ready") {
    return { status: "ready" };
  }
  return {
    status: claim.status,
    message: claim.message,
  };
}

export function evaluateLensModelStep6(draft: LensModelDraft): LensModelStepCheck {
  if (!draft.studentReasoning.trim()) {
    return {
      status: "missing",
      message: "还需要用一句话写出为什么会聚方式会带来这样的像。",
    };
  }
  const meetingMode = draft.meetingMode as MeetingMode;
  const image = {
    nature: draft.nature as ImageConsequence["nature"],
    screenReceivable: draft.screenReceivable === "true",
  };
  if (lensStep6InterpretationMatches(draft)) {
    return claimToStepCheck(
      evaluateLensAuthoredSemanticClaim(draft.step6Interpretation.parse, meetingMode, image),
    );
  }
  const fast = classifyLensStep6FastPath(draft.studentReasoning);
  if (fast.kind === "sufficient") {
    return claimToStepCheck(
      evaluateLensAuthoredSemanticClaim(fast.parse, meetingMode, image),
    );
  }
  if (fast.kind === "insufficient") {
    return {
      status: "inconsistent",
      message: lensAuthoredBindMissingMessage(fast.authored),
    };
  }
  return {
    status: "missing",
    message: LENS_COPY.modelStep6NeedCheck,
  };
}

export function evaluateLensModelStep(
  draft: LensModelDraft,
  step: number,
): LensModelStepCheck {
  if (step <= 1) {
    return draft.objectStation
      ? { status: "ready" }
      : { status: "missing", message: "还需要先选出物体相对 F / 2F 在哪里。" };
  }
  if (step === 2) {
    if (!rayDraftComplete(draft.rayA)) {
      return {
        status: "missing",
        message: "还需要选出第一条光线的种类，以及它经过透镜后怎么走。",
      };
    }
    return rayCoherenceCheck(draft, draft.rayA, "第一条") ?? { status: "ready" };
  }
  if (step === 3) {
    if (!rayDraftComplete(draft.rayB)) {
      return {
        status: "missing",
        message: "还需要选出第二条光线的种类，以及它经过透镜后怎么走。",
      };
    }
    const rayBInconsistent = rayCoherenceCheck(draft, draft.rayB, "第二条");
    if (rayBInconsistent) {
      return rayBInconsistent;
    }
    if (
      draft.includeOptionalFocal &&
      (!isObjectStation(draft.objectStation) ||
        !officialOptionalFocalRay(draft.objectStation))
    ) {
      return {
        status: "inconsistent",
        message: "现在的物体位置没有合法的可选焦点参考光线。",
      };
    }
    const kinds = [draft.rayA.kind, draft.rayB.kind];
    const hasPair =
      kinds.includes("parallel-axis") && kinds.includes("through-center");
    if (!hasPair) {
      return {
        status: "inconsistent",
        message: "这两条光线还没有组成当前模型要求的两条必做光线。",
      };
    }
    return { status: "ready" };
  }
  if (step === 4) {
    if (!draft.meetingMode) {
      return { status: "missing", message: "还需要选出过透镜后光线怎样相遇。" };
    }
    if (
      isObjectStation(draft.objectStation) &&
      officialMeetingMode(draft.objectStation) !== draft.meetingMode
    ) {
      return {
        status: "inconsistent",
        message:
          "你选的相遇方式和现在的物体位置、已经画出的光线放在一起对不上。先回到光具座上看光线是散开、会聚，还是彼此平行。",
      };
    }
    return { status: "ready" };
  }
  if (step === 5) {
    if (!draft.side || !draft.nature || !draft.orientation || !draft.size || !draft.screenReceivable) {
      return {
        status: "missing",
        message:
          "还需要选出像在哪一侧、是实像还是虚像、正立还是倒立、大小，以及光屏能不能接到。",
      };
    }
    if (!imageCompatibleWithMeeting(draft)) {
      return {
        status: "inconsistent",
        message:
          "你选的像的后果，和刚才选的相遇方式对不上。先对照相遇方式，再看像在哪一侧、能不能接到。",
      };
    }
    return { status: "ready" };
  }
  if (step === 6) {
    return evaluateLensModelStep6(draft);
  }
  return { status: "ready" };
}

export function lensModelStepMissingReason(draft: LensModelDraft, step: number): string | null {
  const check = evaluateLensModelStep(draft, step);
  return check.status === "ready" ? null : check.message;
}

export function lensModelStepComplete(draft: LensModelDraft, step: number): boolean {
  return evaluateLensModelStep(draft, step).status === "ready";
}

export function lensModelRepairStep(
  failureKind: string | undefined,
  draft?: LensModelDraft,
): number {
  if (
    failureKind === "geometrically-incoherent-rays" ||
    failureKind === "station-impossible-ray" ||
    failureKind === "missing-required-construction-pair" ||
    failureKind === "missing-or-duplicate-rays"
  ) {
    const rayA = draft ? asCompletedLensRay(draft.rayA) : null;
    if (
      draft &&
      isObjectStation(draft.objectStation) &&
      rayA &&
      isCanonicalRayGeometricallyCoherent(draft.objectStation, rayA)
    ) {
      return 3;
    }
    return 2;
  }
  if (
    failureKind === "meeting-mode-conflicts-station" ||
    failureKind === "u-equals-f-as-ordinary-image"
  ) {
    return 4;
  }
  if (failureKind === "image-conflicts-meeting-mode") {
    return 5;
  }
  if (
    failureKind === "properties-without-relation" ||
    failureKind === "authored-missing-meeting-bind" ||
    failureKind === "authored-generic-or-noun-sandwich" ||
    failureKind === "table-row-only"
  ) {
    return 6;
  }
  return 7;
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
      ? "物体正好在焦点上时，折射后的光线彼此平行，有限远处不相交，所以光屏怎么移动都接不到清晰像。"
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
    constructionStep: 7,
  };
}
