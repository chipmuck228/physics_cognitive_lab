/**
 * Design-time evidence evaluators for convex-lens-imaging.
 * They accept or reject a committed attempt. They do not assign L-levels.
 * They are not a SceneAdapter and not UI.
 */

import { officialImagingState, type ObjectStation } from "./physics-boundary";

export const CANONICAL_RAY_KINDS = [
  "parallel-axis",
  "through-center",
  "through-near-focus",
] as const;

export type CanonicalRayKind = (typeof CANONICAL_RAY_KINDS)[number];

export const REQUIRED_CONSTRUCTION_RAY_KINDS = [
  "parallel-axis",
  "through-center",
] as const;

export const RAY_SEGMENTS = [
  "parallel-to-principal-axis",
  "toward-optical-center",
  "through-near-focal-point",
  "through-far-focal-point",
  "undeviated",
] as const;

export type RaySegment = (typeof RAY_SEGMENTS)[number];

export type RayIncidentPath = "actual" | "backward-extension";

export type FocalRayReferenceStatus =
  | "actual-optional-reference"
  | "backward-extension-optional-reference"
  | "not-applicable";

/**
 * After-lens pairing for the required pair only.
 * This table is not station-complete and must not be used as the
 * sole coherence proof. Use isCanonicalRayGeometricallyCoherent(station, ray).
 */
export const REQUIRED_RAY_SEGMENT_PAIRING = {
  "parallel-axis": {
    beforeLens: "parallel-to-principal-axis",
    afterLens: "through-far-focal-point",
    incidentPath: "actual",
  },
  "through-center": {
    beforeLens: "toward-optical-center",
    afterLens: "undeviated",
    incidentPath: "actual",
  },
} as const;

/**
 * L4 requires this pair at every station. The third textbook focal ray
 * is VALID_OPTIONAL_REFERENCE only where the object-station geometry allows it.
 */
export const REQUIRED_CANONICAL_RAY_COUNT = 2;

export type MeetingMode =
  | "actual-convergence"
  | "backward-extension"
  | "no-finite-meeting";

export type ImageNature = "real" | "virtual" | "none";
export type ImageOrientation = "inverted" | "upright" | "none";
export type ImageSizeRelation = "reduced" | "same-size" | "enlarged" | "none";
export type ImageSide = "other-side" | "same-side" | "none";

export type ConstructionSource =
  | "student-constructed"
  | "shown-completed-diagram"
  | "recognized-option";

export interface CanonicalRayChoice {
  kind: CanonicalRayKind;
  beforeLens: RaySegment;
  afterLens: RaySegment;
  incidentPath: RayIncidentPath;
}

export interface ImageConsequence {
  side: ImageSide;
  nature: ImageNature;
  orientation: ImageOrientation;
  size: ImageSizeRelation;
  screenReceivable: boolean;
}

export interface ConvexLensModelAttempt {
  objectStation: ObjectStation;
  rays: CanonicalRayChoice[];
  meetingMode: MeetingMode;
  image: ImageConsequence;
  modelReasoning: string;
  constructionSource: ConstructionSource;
}

export type ModelConstructionFailure =
  | "copied-visible-diagram"
  | "recognized-finished-diagram"
  | "missing-or-duplicate-rays"
  | "missing-required-construction-pair"
  | "geometrically-incoherent-rays"
  | "station-impossible-ray"
  | "meeting-mode-conflicts-station"
  | "image-conflicts-meeting-mode"
  | "u-equals-f-as-ordinary-image"
  | "properties-without-relation"
  | "table-row-only"
  | "authored-generic-or-noun-sandwich"
  | "authored-missing-meeting-bind"
  | "ok";

export interface ModelConstructionResult {
  ok: boolean;
  failureKind: ModelConstructionFailure;
}

export function focalRayReferenceStatus(
  objectStation: ObjectStation,
): FocalRayReferenceStatus {
  if (objectStation === "at-f") {
    return "not-applicable";
  }
  if (objectStation === "inside-f") {
    return "backward-extension-optional-reference";
  }
  return "actual-optional-reference";
}

export function isCanonicalRayGeometricallyCoherent(
  objectStation: ObjectStation,
  ray: CanonicalRayChoice,
): boolean {
  if (ray.kind === "parallel-axis") {
    const expected = REQUIRED_RAY_SEGMENT_PAIRING["parallel-axis"];
    return (
      ray.incidentPath === expected.incidentPath &&
      ray.beforeLens === expected.beforeLens &&
      ray.afterLens === expected.afterLens
    );
  }
  if (ray.kind === "through-center") {
    const expected = REQUIRED_RAY_SEGMENT_PAIRING["through-center"];
    return (
      ray.incidentPath === expected.incidentPath &&
      ray.beforeLens === expected.beforeLens &&
      ray.afterLens === expected.afterLens
    );
  }

  const status = focalRayReferenceStatus(objectStation);
  if (status === "not-applicable") {
    return false;
  }
  if (status === "actual-optional-reference") {
    return (
      ray.incidentPath === "actual" &&
      ray.beforeLens === "through-near-focal-point" &&
      ray.afterLens === "parallel-to-principal-axis"
    );
  }
  return (
    ray.incidentPath === "backward-extension" &&
    ray.beforeLens === "through-near-focal-point" &&
    ray.afterLens === "parallel-to-principal-axis"
  );
}

export function officialMeetingMode(station: ObjectStation): MeetingMode {
  return officialImagingState(station).rayMeetingMode;
}

export function officialImageConsequence(station: ObjectStation): ImageConsequence {
  const state = officialImagingState(station);
  return {
    side: state.imageSide,
    nature: state.imageNature,
    orientation: state.imageOrientation,
    size: state.imageSizeRelation,
    screenReceivable: state.screenReceivableIfAtImagePlane,
  };
}

export function imageMatchesOfficial(
  station: ObjectStation,
  image: ImageConsequence,
): boolean {
  const official = officialImageConsequence(station);
  return (
    image.side === official.side &&
    image.nature === official.nature &&
    image.orientation === official.orientation &&
    image.size === official.size &&
    image.screenReceivable === official.screenReceivable
  );
}

function compact(text: string): string {
  return text.replace(/\s+/g, "");
}

function hasActualConvergenceLanguage(text: string): boolean {
  return /真正会聚|实际会聚|真的交|真正交|会聚在|光线交在一起|出射光线会聚/.test(
    text,
  );
}

function hasBackwardExtensionLanguage(text: string): boolean {
  return /反向延长|延长线相交|光线发散|出射光线散开|散开.*相交/.test(text);
}

function hasNoFiniteMeetingLanguage(text: string): boolean {
  return /有限远.*不相交|不相交|出射光线平行|不成有限远|没有交点|不成完整的像/.test(
    text,
  );
}

function hasMeetingLanguage(text: string): boolean {
  return (
    hasActualConvergenceLanguage(text) ||
    hasBackwardExtensionLanguage(text) ||
    hasNoFiniteMeetingLanguage(text)
  );
}

function hasConsequenceBind(text: string): boolean {
  return /所以|因此|于是|才会|才能接到|接不到|不成/.test(text);
}

function looksLikeTableRowOnly(text: string): boolean {
  const compactText = compact(text);
  const tableRow =
    /[uU＞>大于].*2[fF].*倒立.*缩小.*实像|缩小倒立实像|倒立缩小实像|五种情况|背[Ff]|背2[Ff]/.test(
      compactText,
    );
  return tableRow && !hasMeetingLanguage(compactText);
}

function looksLikeGeneric(text: string): boolean {
  const compactText = compact(text);
  return (
    compactText.length < 8 ||
    /^(好好|我觉得这样|就是这样|这也有凸透镜|都有凸透镜)$/.test(compactText)
  );
}

function looksLikeNounSandwich(text: string): boolean {
  const compactText = compact(text);
  const nouns = (compactText.match(/物距|焦距|像距|实像|虚像|倒立|正立|光屏|焦点/g) ??
    []).length;
  return nouns >= 4 && !hasMeetingLanguage(compactText);
}

function authoredMatchesMeeting(text: string, meetingMode: MeetingMode): boolean {
  const compactText = compact(text);
  if (meetingMode === "actual-convergence") {
    return hasActualConvergenceLanguage(compactText);
  }
  if (meetingMode === "backward-extension") {
    return hasBackwardExtensionLanguage(compactText);
  }
  return hasNoFiniteMeetingLanguage(compactText);
}

export function analyzeConvexLensAuthored(text: string): {
  hasMeetingLanguage: boolean;
  hasConsequenceBind: boolean;
  tableRowOnly: boolean;
  generic: boolean;
  nounSandwich: boolean;
} {
  const compactText = compact(text);
  return {
    hasMeetingLanguage: hasMeetingLanguage(compactText),
    hasConsequenceBind: hasConsequenceBind(compactText),
    tableRowOnly: looksLikeTableRowOnly(text),
    generic: looksLikeGeneric(text),
    nounSandwich: looksLikeNounSandwich(text),
  };
}

function evaluateRayConstruction(
  objectStation: ObjectStation,
  rays: CanonicalRayChoice[],
): ModelConstructionResult {
  const parallel = rays.filter((item) => item.kind === "parallel-axis");
  const center = rays.filter((item) => item.kind === "through-center");
  const focal = rays.filter((item) => item.kind === "through-near-focus");

  if (parallel.length !== 1 || center.length !== 1) {
    return { ok: false, failureKind: "missing-required-construction-pair" };
  }
  if (
    !isCanonicalRayGeometricallyCoherent(objectStation, parallel[0]!) ||
    !isCanonicalRayGeometricallyCoherent(objectStation, center[0]!)
  ) {
    return { ok: false, failureKind: "geometrically-incoherent-rays" };
  }
  for (const ray of focal) {
    if (!isCanonicalRayGeometricallyCoherent(objectStation, ray)) {
      return { ok: false, failureKind: "station-impossible-ray" };
    }
  }
  if (rays.length !== parallel.length + center.length + focal.length) {
    return { ok: false, failureKind: "missing-or-duplicate-rays" };
  }
  return { ok: true, failureKind: "ok" };
}

function meetingMatchesStation(station: ObjectStation, meeting: MeetingMode): boolean {
  return officialMeetingMode(station) === meeting;
}

function imageMatchesMeeting(
  meeting: MeetingMode,
  image: ImageConsequence,
): boolean {
  if (meeting === "actual-convergence") {
    return (
      image.nature === "real" &&
      image.side === "other-side" &&
      image.orientation === "inverted" &&
      image.screenReceivable === true
    );
  }
  if (meeting === "backward-extension") {
    return (
      image.nature === "virtual" &&
      image.side === "same-side" &&
      image.orientation === "upright" &&
      image.screenReceivable === false
    );
  }
  return (
    image.nature === "none" &&
    image.side === "none" &&
    image.orientation === "none" &&
    image.size === "none" &&
    image.screenReceivable === false
  );
}

export function evaluateConvexLensModelConstruction(
  attempt: ConvexLensModelAttempt,
): ModelConstructionResult {
  if (attempt.constructionSource === "shown-completed-diagram") {
    return { ok: false, failureKind: "copied-visible-diagram" };
  }
  if (attempt.constructionSource === "recognized-option") {
    return { ok: false, failureKind: "recognized-finished-diagram" };
  }
  const rayResult = evaluateRayConstruction(attempt.objectStation, attempt.rays);
  if (!rayResult.ok) {
    return rayResult;
  }
  if (!meetingMatchesStation(attempt.objectStation, attempt.meetingMode)) {
    if (attempt.objectStation === "at-f" && attempt.meetingMode !== "no-finite-meeting") {
      return { ok: false, failureKind: "u-equals-f-as-ordinary-image" };
    }
    return { ok: false, failureKind: "meeting-mode-conflicts-station" };
  }
  if (attempt.objectStation === "at-f" && attempt.image.nature !== "none") {
    return { ok: false, failureKind: "u-equals-f-as-ordinary-image" };
  }
  if (!imageMatchesMeeting(attempt.meetingMode, attempt.image)) {
    return { ok: false, failureKind: "image-conflicts-meeting-mode" };
  }
  if (!imageMatchesOfficial(attempt.objectStation, attempt.image)) {
    return { ok: false, failureKind: "image-conflicts-meeting-mode" };
  }

  const authored = analyzeConvexLensAuthored(attempt.modelReasoning);
  if (authored.generic) {
    return { ok: false, failureKind: "authored-generic-or-noun-sandwich" };
  }
  if (authored.nounSandwich) {
    return { ok: false, failureKind: "authored-generic-or-noun-sandwich" };
  }
  if (authored.tableRowOnly) {
    return { ok: false, failureKind: "table-row-only" };
  }
  if (
    !authored.hasMeetingLanguage ||
    !authored.hasConsequenceBind ||
    !authoredMatchesMeeting(attempt.modelReasoning, attempt.meetingMode)
  ) {
    if (imageMatchesOfficial(attempt.objectStation, attempt.image)) {
      return { ok: false, failureKind: "properties-without-relation" };
    }
    return { ok: false, failureKind: "authored-missing-meeting-bind" };
  }

  return { ok: true, failureKind: "ok" };
}

export const REQUIRED_TRANSFER_TARGET_IDS = [
  "near-projector-real-enlarged",
  "far-magnifying-glass-virtual",
] as const;

export type RequiredTransferTargetId = (typeof REQUIRED_TRANSFER_TARGET_IDS)[number];

export interface ConvexLensTransferAttempt {
  targetId: string;
  objectStation: ObjectStation;
  meetingMode: MeetingMode;
  image: ImageConsequence;
  explanation: string;
}

export type TransferFailure =
  | "unknown-or-unrequired-target"
  | "wrong-target-structure"
  | "surface-convex-lens-slogan"
  | "table-row-only"
  | "properties-without-relation"
  | "ok";

export interface TransferAttemptResult {
  ok: boolean;
  failureKind: TransferFailure;
}

const TARGET_STATION: Record<RequiredTransferTargetId, ObjectStation> = {
  "near-projector-real-enlarged": "between-f-and-2f",
  "far-magnifying-glass-virtual": "inside-f",
};

function isRequiredTransferTarget(id: string): id is RequiredTransferTargetId {
  return (REQUIRED_TRANSFER_TARGET_IDS as readonly string[]).includes(id);
}

function looksLikeSurfaceConvexLensSlogan(text: string): boolean {
  return /都有凸透镜|也有凸透镜|放大镜也是凸透镜|投影仪能放大/.test(compact(text)) &&
    !hasMeetingLanguage(compact(text));
}

export function evaluateConvexLensTransfer(
  attempt: ConvexLensTransferAttempt,
): TransferAttemptResult {
  if (!isRequiredTransferTarget(attempt.targetId)) {
    return { ok: false, failureKind: "unknown-or-unrequired-target" };
  }
  const expectedStation = TARGET_STATION[attempt.targetId];
  if (
    attempt.objectStation !== expectedStation ||
    attempt.meetingMode !== officialMeetingMode(expectedStation) ||
    !imageMatchesOfficial(expectedStation, attempt.image)
  ) {
    return { ok: false, failureKind: "wrong-target-structure" };
  }
  if (looksLikeSurfaceConvexLensSlogan(attempt.explanation)) {
    return { ok: false, failureKind: "surface-convex-lens-slogan" };
  }
  const authored = analyzeConvexLensAuthored(attempt.explanation);
  if (authored.tableRowOnly) {
    return { ok: false, failureKind: "table-row-only" };
  }
  if (
    !authored.hasMeetingLanguage ||
    !authored.hasConsequenceBind ||
    !authoredMatchesMeeting(attempt.explanation, attempt.meetingMode)
  ) {
    return { ok: false, failureKind: "properties-without-relation" };
  }
  return { ok: true, failureKind: "ok" };
}

export function evaluateRequiredTransferPair(
  attempts: ConvexLensTransferAttempt[],
): { ok: boolean; passedTargetIds: string[] } {
  const passed = REQUIRED_TRANSFER_TARGET_IDS.filter((targetId) =>
    attempts.some(
      (attempt) =>
        attempt.targetId === targetId && evaluateConvexLensTransfer(attempt).ok,
    ),
  );
  return {
    ok: passed.length === REQUIRED_TRANSFER_TARGET_IDS.length,
    passedTargetIds: [...passed],
  };
}

export type AiOffChallengeId =
  | "ai-off-unfamiliar-window-card-projection"
  | "ai-off-boundary-magnifier-cannot-catch-virtual";

export interface ConvexLensAiOffAttempt {
  challengeId: AiOffChallengeId;
  objectStation: ObjectStation;
  meetingMode: MeetingMode;
  image: ImageConsequence;
  preCommitReasoning: string;
  judgmentId: string;
  postCheckIds?: string[];
  llmUsed: boolean;
}

export type AiOffFailure =
  | "llm-used"
  | "answer-only"
  | "wrong-precommit-structure"
  | "post-check-cannot-manufacture"
  | "surface-or-table"
  | "ok";

export interface AiOffAttemptResult {
  ok: boolean;
  failureKind: AiOffFailure;
}

const AIOFF_EXPECTED: Record<
  AiOffChallengeId,
  { station: ObjectStation; judgmentId: string }
> = {
  "ai-off-unfamiliar-window-card-projection": {
    station: "beyond-2f",
    judgmentId: "distant-object-real-reduced",
  },
  "ai-off-boundary-magnifier-cannot-catch-virtual": {
    station: "inside-f",
    judgmentId: "virtual-not-on-screen-and-f-is-limit",
  },
};

function aiOffAuthoredOk(
  challengeId: AiOffChallengeId,
  text: string,
  meetingMode: MeetingMode,
): boolean {
  const authored = analyzeConvexLensAuthored(text);
  if (
    authored.generic ||
    authored.nounSandwich ||
    authored.tableRowOnly ||
    looksLikeSurfaceConvexLensSlogan(text)
  ) {
    return false;
  }
  if (
    !authored.hasMeetingLanguage ||
    !authored.hasConsequenceBind ||
    !authoredMatchesMeeting(text, meetingMode)
  ) {
    return false;
  }
  if (challengeId === "ai-off-boundary-magnifier-cannot-catch-virtual") {
    const compactText = compact(text);
    const rejectsVirtualOnScreen = /接不到|不能接到|虚像.*屏/.test(compactText);
    const treatsFAsLimit = /焦点上|u=f|正好在[Ff]|有限远|不成完整/.test(compactText);
    return rejectsVirtualOnScreen && treatsFAsLimit;
  }
  return /接收|光屏|卡片|放到像/.test(compact(text));
}

export function evaluateConvexLensAiOff(
  attempt: ConvexLensAiOffAttempt,
): AiOffAttemptResult {
  if (attempt.llmUsed) {
    return { ok: false, failureKind: "llm-used" };
  }
  const expected = AIOFF_EXPECTED[attempt.challengeId];
  const preCommitStructureOk =
    attempt.objectStation === expected.station &&
    attempt.meetingMode === officialMeetingMode(expected.station) &&
    imageMatchesOfficial(expected.station, attempt.image) &&
    aiOffAuthoredOk(
      attempt.challengeId,
      attempt.preCommitReasoning,
      attempt.meetingMode,
    );
  const judgmentOk = attempt.judgmentId === expected.judgmentId;
  const postCheckLooksComplete = (attempt.postCheckIds?.length ?? 0) >= 3;

  if (!preCommitStructureOk && (judgmentOk || postCheckLooksComplete)) {
    return { ok: false, failureKind: "post-check-cannot-manufacture" };
  }
  if (!preCommitStructureOk) {
    const authored = analyzeConvexLensAuthored(attempt.preCommitReasoning);
    if (authored.tableRowOnly || looksLikeSurfaceConvexLensSlogan(attempt.preCommitReasoning)) {
      return { ok: false, failureKind: "surface-or-table" };
    }
    if (!attempt.preCommitReasoning.trim() && judgmentOk) {
      return { ok: false, failureKind: "answer-only" };
    }
    return { ok: false, failureKind: "wrong-precommit-structure" };
  }
  if (!judgmentOk) {
    return { ok: false, failureKind: "answer-only" };
  }
  return { ok: true, failureKind: "ok" };
}

export function evaluateRequiredAiOffPair(
  attempts: ConvexLensAiOffAttempt[],
): { ok: boolean; passedChallengeIds: string[] } {
  const ids: AiOffChallengeId[] = [
    "ai-off-unfamiliar-window-card-projection",
    "ai-off-boundary-magnifier-cannot-catch-virtual",
  ];
  const passed = ids.filter((challengeId) =>
    attempts.some(
      (attempt) =>
        attempt.challengeId === challengeId && evaluateConvexLensAiOff(attempt).ok,
    ),
  );
  return { ok: passed.length === ids.length, passedChallengeIds: [...passed] };
}

export function twoStandardRays(): CanonicalRayChoice[] {
  return [
    {
      kind: "parallel-axis",
      beforeLens: "parallel-to-principal-axis",
      afterLens: "through-far-focal-point",
      incidentPath: "actual",
    },
    {
      kind: "through-center",
      beforeLens: "toward-optical-center",
      afterLens: "undeviated",
      incidentPath: "actual",
    },
  ];
}

export function actualThroughNearFocusRay(): CanonicalRayChoice {
  return {
    kind: "through-near-focus",
    beforeLens: "through-near-focal-point",
    afterLens: "parallel-to-principal-axis",
    incidentPath: "actual",
  };
}

export function backwardExtensionThroughNearFocusRay(): CanonicalRayChoice {
  return {
    kind: "through-near-focus",
    beforeLens: "through-near-focal-point",
    afterLens: "parallel-to-principal-axis",
    incidentPath: "backward-extension",
  };
}
