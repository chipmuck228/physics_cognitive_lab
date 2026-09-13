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

export type LensReasoningMeetingClaim =
  | "actual-convergence"
  | "backward-extension"
  | "parallel-no-finite-meeting"
  | "unclear";

export type LensReasoningImageNatureClaim = "real" | "virtual" | "none" | "unclear";
export type LensReasoningScreenClaim = "receivable" | "not-receivable" | "unclear";
export type LensReasoningAmbiguity = "none" | "low" | "high";

/** System-derived interpretation of learner language. Not student evidence. */
export interface LensReasoningSemanticParse {
  meetingClaim: LensReasoningMeetingClaim;
  imageNatureClaim: LensReasoningImageNatureClaim;
  screenClaim: LensReasoningScreenClaim;
  hasMeetingClaim: boolean;
  hasConsequenceClaim: boolean;
  hasCausalBind: boolean;
  ambiguity: LensReasoningAmbiguity;
  unsupportedAdditions?: string[];
}

export interface ConvexLensModelAttempt {
  objectStation: ObjectStation;
  rays: CanonicalRayChoice[];
  meetingMode: MeetingMode;
  image: ImageConsequence;
  modelReasoning: string;
  constructionSource: ConstructionSource;
  authoredInterpretation?: LensReasoningSemanticParse | null;
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

type AuthoredMeetingKind = MeetingMode | "mixed" | null;
type AuthoredConsequenceKind = "real" | "virtual" | "none" | "mixed" | null;
export type LensAuthoredMissingKind =
  | "meeting"
  | "consequence"
  | "relation"
  | "contradiction"
  | "generic"
  | null;

interface TextSpan {
  start: number;
  end: number;
}

interface MeetingSpan extends TextSpan {
  kind: MeetingMode;
}

interface ConsequenceSpan extends TextSpan {
  kind: "real" | "virtual" | "none";
}

const MEETING_PATTERNS: ReadonlyArray<{ kind: MeetingMode; source: string }> = [
  { kind: "backward-extension", source: "反向延长.{0,8}(相交|交在一起)" },
  { kind: "backward-extension", source: "延长线.{0,6}(相交|交在一起)" },
  { kind: "backward-extension", source: "光线发散" },
  { kind: "backward-extension", source: "出射光线散开" },
  { kind: "backward-extension", source: "散开.{0,6}相交" },
  { kind: "no-finite-meeting", source: "没有在有限.{0,8}相交" },
  { kind: "no-finite-meeting", source: "有限远.{0,8}不相交" },
  { kind: "no-finite-meeting", source: "彼此平行" },
  { kind: "no-finite-meeting", source: "出射光线平行" },
  { kind: "no-finite-meeting", source: "折射后.{0,12}平行" },
  { kind: "no-finite-meeting", source: "光线彼此平行" },
  { kind: "no-finite-meeting", source: "光线平行" },
  { kind: "no-finite-meeting", source: "没有交点" },
  { kind: "no-finite-meeting", source: "不成有限远" },
  { kind: "actual-convergence", source: "真正[会汇]聚" },
  { kind: "actual-convergence", source: "实际[会汇]聚" },
  { kind: "actual-convergence", source: "真的交" },
  { kind: "actual-convergence", source: "真正相交" },
  { kind: "actual-convergence", source: "真正交" },
  { kind: "actual-convergence", source: "[会汇]聚在一起" },
  { kind: "actual-convergence", source: "聚到一起" },
  { kind: "actual-convergence", source: "聚在一起" },
  { kind: "actual-convergence", source: "光线交在一起" },
  { kind: "actual-convergence", source: "出射光线[会汇]聚" },
  { kind: "actual-convergence", source: "[会汇]聚在" },
  { kind: "actual-convergence", source: "(光线|折射后).{0,12}[会汇]聚" },
  { kind: "actual-convergence", source: "(光线|折射后).{0,12}相交" },
  { kind: "actual-convergence", source: "交在一起" },
];

const CONSEQUENCE_PATTERNS: ReadonlyArray<{
  kind: "real" | "virtual" | "none";
  source: string;
}> = [
  { kind: "none", source: "接不到清晰像" },
  { kind: "none", source: "不能形成清晰像" },
  { kind: "none", source: "有限远.{0,12}(接不到|不能形成|没有).{0,6}(清晰|完整)" },
  { kind: "real", source: "(成|形成).{0,8}实像" },
  { kind: "real", source: "接到实像" },
  { kind: "real", source: "(光屏|幕布).{0,10}(能接到|可以接到)" },
  { kind: "real", source: "就能接到" },
  { kind: "real", source: "这是实像" },
  { kind: "real", source: "是实像" },
  { kind: "virtual", source: "(成|形成).{0,8}虚像" },
  { kind: "virtual", source: "这是虚像" },
  { kind: "virtual", source: "是虚像" },
  { kind: "virtual", source: "(光屏|幕布|屏).{0,6}接不到" },
];

const CAUSAL_BIND = /所以|因此|于是|因而|从而|便|才会|才能接到|就能接到|就能|就成|就会/;

function collectSpans<K extends string>(
  text: string,
  patterns: ReadonlyArray<{ kind: K; source: string }>,
): Array<TextSpan & { kind: K }> {
  const occupied = Array.from({ length: text.length }, () => false);
  const spans: Array<TextSpan & { kind: K }> = [];
  for (const pattern of patterns) {
    const matcher = new RegExp(pattern.source, "g");
    let match: RegExpExecArray | null;
    while ((match = matcher.exec(text))) {
      const start = match.index;
      const end = start + match[0].length;
      if (occupied.slice(start, end).some(Boolean)) {
        continue;
      }
      for (let index = start; index < end; index += 1) {
        occupied[index] = true;
      }
      spans.push({ kind: pattern.kind, start, end });
    }
  }
  return spans;
}

function findMeetingSpans(text: string): MeetingSpan[] {
  return collectSpans(text, MEETING_PATTERNS);
}

function findConsequenceSpans(text: string): ConsequenceSpan[] {
  return collectSpans(text, CONSEQUENCE_PATTERNS);
}

function uniqueKinds<T extends string>(spans: ReadonlyArray<{ kind: T }>): T[] {
  return [...new Set(spans.map((span) => span.kind))];
}

function resolveKind<T extends string>(kinds: readonly T[]): T | "mixed" | null {
  if (kinds.length === 0) {
    return null;
  }
  return kinds.length === 1 ? kinds[0]! : "mixed";
}

function meetingConsequenceCompatible(
  meetingKind: MeetingMode,
  consequenceKind: "real" | "virtual" | "none",
): boolean {
  if (meetingKind === "actual-convergence") {
    return consequenceKind === "real";
  }
  if (meetingKind === "backward-extension") {
    return consequenceKind === "virtual" || consequenceKind === "none";
  }
  return consequenceKind === "none" || consequenceKind === "virtual";
}

function hasCompatibleMeetingConsequence(
  meetingKinds: readonly MeetingMode[],
  consequenceKinds: ReadonlyArray<"real" | "virtual" | "none">,
): boolean {
  return meetingKinds.some((meetingKind) =>
    consequenceKinds.some((consequenceKind) =>
      meetingConsequenceCompatible(meetingKind, consequenceKind),
    ),
  );
}

function hasLocallyContradictoryBind(
  meetingKinds: readonly MeetingMode[],
  consequenceKinds: ReadonlyArray<"real" | "virtual" | "none">,
): boolean {
  if (meetingKinds.length === 0 || consequenceKinds.length === 0) {
    return false;
  }
  if (consequenceKinds.includes("real") && !meetingKinds.includes("actual-convergence")) {
    return true;
  }
  if (
    meetingKinds.includes("actual-convergence") &&
    !consequenceKinds.includes("real") &&
    (consequenceKinds.includes("virtual") || consequenceKinds.includes("none"))
  ) {
    return true;
  }
  if (
    meetingKinds.length === 1 &&
    meetingKinds[0] === "no-finite-meeting" &&
    consequenceKinds.includes("virtual") &&
    !consequenceKinds.includes("none")
  ) {
    return true;
  }
  return !hasCompatibleMeetingConsequence(meetingKinds, consequenceKinds);
}

function hasCausalOrSequentialBind(
  text: string,
  meetings: readonly MeetingSpan[],
  consequences: readonly ConsequenceSpan[],
): boolean {
  if (meetings.length === 0 || consequences.length === 0) {
    return false;
  }
  if (CAUSAL_BIND.test(text)) {
    return true;
  }
  return meetings.some((meeting) =>
    consequences.some((consequence) => {
      if (consequence.start < meeting.end) {
        return false;
      }
      const gap = text.slice(meeting.end, consequence.start);
      return gap.length <= 16;
    }),
  );
}

function looksLikeTokenSandwich(text: string): boolean {
  const compactText = compact(text);
  const stripped = compactText
    .replace(/倒立|正立|缩小|放大|实像|虚像|光屏|光线|会聚|汇聚|相交|焦点|物距|像距|透镜/g, "")
    .replace(/[。，、,.\s的和与]/g, "");
  return compactText.length >= 4 && stripped.length === 0;
}

function hasMeetingLanguage(text: string): boolean {
  return findMeetingSpans(compact(text)).length > 0 && !looksLikeTokenSandwich(text);
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
  if (looksLikeTokenSandwich(text)) {
    return true;
  }
  const compactText = compact(text);
  const nouns = (compactText.match(/物距|焦距|像距|实像|虚像|倒立|正立|光屏|焦点/g) ??
    []).length;
  return nouns >= 4 && !hasMeetingLanguage(compactText);
}

export interface ConvexLensAuthoredAnalysis {
  hasMeetingLanguage: boolean;
  hasConsequenceLanguage: boolean;
  hasConsequenceBind: boolean;
  tableRowOnly: boolean;
  generic: boolean;
  nounSandwich: boolean;
  contradictory: boolean;
  meetingKind: AuthoredMeetingKind;
  consequenceKind: AuthoredConsequenceKind;
  missingKind: LensAuthoredMissingKind;
}

export function analyzeConvexLensAuthored(text: string): ConvexLensAuthoredAnalysis {
  const compactText = compact(text);
  const generic = looksLikeGeneric(text);
  const nounSandwich = looksLikeNounSandwich(text);
  const tableRowOnly = looksLikeTableRowOnly(text);
  if (generic || nounSandwich || tableRowOnly || looksLikeTokenSandwich(text)) {
    return {
      hasMeetingLanguage: false,
      hasConsequenceLanguage: false,
      hasConsequenceBind: false,
      tableRowOnly,
      generic,
      nounSandwich: nounSandwich || looksLikeTokenSandwich(text),
      contradictory: false,
      meetingKind: null,
      consequenceKind: null,
      missingKind: "generic",
    };
  }

  const meetings = findMeetingSpans(compactText);
  const consequences = findConsequenceSpans(compactText);
  const meetingKinds = uniqueKinds(meetings);
  const consequenceKinds = uniqueKinds(consequences);
  const meetingKind = resolveKind(meetingKinds);
  const consequenceKind = resolveKind(consequenceKinds);
  const hasMeeting = meetings.length > 0;
  const hasConsequence = consequences.length > 0;
  const bound = hasCausalOrSequentialBind(compactText, meetings, consequences);
  const contradictory = hasLocallyContradictoryBind(meetingKinds, consequenceKinds);
  const hasConsequenceBind =
    hasMeeting &&
    hasConsequence &&
    bound &&
    !contradictory &&
    hasCompatibleMeetingConsequence(meetingKinds, consequenceKinds);

  let missingKind: LensAuthoredMissingKind = null;
  if (contradictory) {
    missingKind = "contradiction";
  } else if (!hasMeeting && !hasConsequence) {
    missingKind = "meeting";
  } else if (!hasMeeting) {
    missingKind = "meeting";
  } else if (!hasConsequence) {
    missingKind = "consequence";
  } else if (!bound) {
    missingKind = "relation";
  }

  return {
    hasMeetingLanguage: hasMeeting,
    hasConsequenceLanguage: hasConsequence,
    hasConsequenceBind,
    tableRowOnly,
    generic,
    nounSandwich,
    contradictory,
    meetingKind,
    consequenceKind,
    missingKind: hasConsequenceBind ? null : missingKind,
  };
}

export function lensAuthoredBindMissingMessage(
  authored: ConvexLensAuthoredAnalysis,
): string {
  if (authored.generic || authored.nounSandwich || authored.tableRowOnly) {
    return "这句话还只是在背表或堆名词。先写出光线怎样相遇，再接到像的后果。";
  }
  if (authored.missingKind === "contradiction") {
    return "你写的相遇方式和像的后果对不上。先看光线是会聚、反向延长还是平行，再接到对应的像。";
  }
  if (authored.missingKind === "meeting") {
    return authored.hasConsequenceLanguage
      ? "还要写出光线怎样相遇：是会聚到一起、反向延长后相交，还是彼此平行。"
      : "先写出光线怎样相遇，再接到像的后果。";
  }
  if (authored.missingKind === "consequence") {
    return "还要写出这样相遇之后，像会怎样，比如成实像还是光屏接不到。";
  }
  if (authored.missingKind === "relation") {
    return "相遇方式和像的后果都有了。还要用一句话把这两件事连起来。";
  }
  return "先写出光线怎样相遇，再接到像的后果。";
}

export function normalizeLensStep6Text(text: string): string {
  return compact(text);
}

function hasLensAuthoredPhysicsCue(text: string): boolean {
  return /光线|会聚|汇聚|相交|光屏|实像|虚像|平行|延长|接到|聚到|交在|碰到|散开|发散/.test(
    compact(text),
  );
}

function meetingClaimFromKind(
  kind: ConvexLensAuthoredAnalysis["meetingKind"],
): LensReasoningMeetingClaim {
  if (kind === "actual-convergence" || kind === "backward-extension") {
    return kind;
  }
  if (kind === "no-finite-meeting") {
    return "parallel-no-finite-meeting";
  }
  return "unclear";
}

function meetingModeFromClaim(claim: LensReasoningMeetingClaim): MeetingMode | null {
  if (claim === "actual-convergence" || claim === "backward-extension") {
    return claim;
  }
  if (claim === "parallel-no-finite-meeting") {
    return "no-finite-meeting";
  }
  return null;
}

export function parseFromLensAuthoredAnalysis(
  authored: ConvexLensAuthoredAnalysis,
): LensReasoningSemanticParse {
  const imageNatureClaim: LensReasoningImageNatureClaim =
    authored.consequenceKind === "real" ||
    authored.consequenceKind === "virtual" ||
    authored.consequenceKind === "none"
      ? authored.consequenceKind
      : "unclear";
  const screenClaim: LensReasoningScreenClaim =
    imageNatureClaim === "real"
      ? "receivable"
      : imageNatureClaim === "virtual" || imageNatureClaim === "none"
        ? "not-receivable"
        : "unclear";
  return {
    meetingClaim: meetingClaimFromKind(authored.meetingKind),
    imageNatureClaim,
    screenClaim,
    hasMeetingClaim: authored.hasMeetingLanguage,
    hasConsequenceClaim: authored.hasConsequenceLanguage,
    hasCausalBind: authored.hasConsequenceBind,
    ambiguity: authored.hasConsequenceBind ? "none" : "low",
  };
}

export type LensStep6FastPath =
  | { kind: "sufficient"; parse: LensReasoningSemanticParse }
  | { kind: "insufficient"; authored: ConvexLensAuthoredAnalysis }
  | { kind: "needs-llm" };

function hasUnrecognizedMeetingCue(text: string): boolean {
  return /碰到一起|碰到|聚到|交在|汇到/.test(compact(text));
}

export function classifyLensStep6FastPath(text: string): LensStep6FastPath {
  const authored = analyzeConvexLensAuthored(text);
  if (authored.generic || authored.nounSandwich || authored.tableRowOnly) {
    return { kind: "insufficient", authored };
  }
  if (authored.contradictory) {
    return { kind: "insufficient", authored };
  }
  if (authored.hasConsequenceBind) {
    return { kind: "sufficient", parse: parseFromLensAuthoredAnalysis(authored) };
  }
  if (authored.hasMeetingLanguage || authored.hasConsequenceLanguage) {
    if (
      !authored.hasMeetingLanguage &&
      authored.hasConsequenceLanguage &&
      hasUnrecognizedMeetingCue(text)
    ) {
      return { kind: "needs-llm" };
    }
    return { kind: "insufficient", authored };
  }
  if (hasUnrecognizedMeetingCue(text) && compact(text).length >= 8) {
    return { kind: "needs-llm" };
  }
  return { kind: "insufficient", authored };
}

export type LensAuthoredClaimCheck =
  | { status: "ready" }
  | { status: "missing"; missingKind: LensAuthoredMissingKind | "unclear"; message: string }
  | { status: "inconsistent"; missingKind: "contradiction"; message: string };

export const LENS_STEP6_UNCLEAR_MESSAGE =
  "这句话我还没判断清楚。你可以再说具体一点：光线怎样相遇？然后形成什么像？";

export function evaluateLensAuthoredSemanticClaim(
  parse: LensReasoningSemanticParse,
  meetingMode: MeetingMode,
  image: Pick<ImageConsequence, "nature" | "screenReceivable">,
): LensAuthoredClaimCheck {
  if (parse.ambiguity === "high" || parse.meetingClaim === "unclear") {
    return {
      status: "missing",
      missingKind: "unclear",
      message: LENS_STEP6_UNCLEAR_MESSAGE,
    };
  }
  if (!parse.hasMeetingClaim) {
    return {
      status: "missing",
      missingKind: "meeting",
      message: parse.hasConsequenceClaim
        ? "还要写出光线怎样相遇：是会聚到一起、反向延长后相交，还是彼此平行。"
        : "先写出光线怎样相遇，再接到像的后果。",
    };
  }
  if (!parse.hasConsequenceClaim && parse.imageNatureClaim === "unclear" && parse.screenClaim === "unclear") {
    return {
      status: "missing",
      missingKind: "consequence",
      message: "还要写出这样相遇之后，像会怎样，比如成实像还是光屏接不到。",
    };
  }
  if (!parse.hasCausalBind) {
    return {
      status: "missing",
      missingKind: "relation",
      message: "相遇方式和像的后果都有了。还要用一句话把这两件事连起来。",
    };
  }
  const parsedMeeting = meetingModeFromClaim(parse.meetingClaim);
  if (parsedMeeting && parsedMeeting !== meetingMode) {
    return {
      status: "inconsistent",
      missingKind: "contradiction",
      message: "你写的相遇方式，和刚才选的光线相遇方式对不上。",
    };
  }
  if (parse.imageNatureClaim !== "unclear" && parse.imageNatureClaim !== image.nature) {
    return {
      status: "inconsistent",
      missingKind: "contradiction",
      message: "你写的像的性质，和刚才选的像的后果对不上。",
    };
  }
  if (parse.screenClaim !== "unclear") {
    const receivable = parse.screenClaim === "receivable";
    if (receivable !== image.screenReceivable) {
      return {
        status: "inconsistent",
        missingKind: "contradiction",
        message: "你写的光屏能不能接到，和刚才选的像的后果对不上。",
      };
    }
  }
  return { status: "ready" };
}

export function resolveLensStep6Parse(
  text: string,
  stored?: LensReasoningSemanticParse | null,
): { parse: LensReasoningSemanticParse | null; source: "deterministic-fast-path" | "stored" | "none" } {
  const fast = classifyLensStep6FastPath(text);
  if (fast.kind === "sufficient") {
    return { parse: fast.parse, source: "deterministic-fast-path" };
  }
  if (stored) {
    return { parse: stored, source: "stored" };
  }
  return { parse: null, source: "none" };
}

function authoredMatchesMeeting(text: string, meetingMode: MeetingMode): boolean {
  const authored = analyzeConvexLensAuthored(text);
  if (!authored.hasMeetingLanguage) {
    return false;
  }
  if (authored.meetingKind === meetingMode) {
    return true;
  }
  return (
    authored.meetingKind === "mixed" &&
    findMeetingSpans(compact(text)).some((span) => span.kind === meetingMode)
  );
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

  const resolved = resolveLensStep6Parse(
    attempt.modelReasoning,
    attempt.authoredInterpretation,
  );
  if (!resolved.parse) {
    const authored = analyzeConvexLensAuthored(attempt.modelReasoning);
    if (authored.generic || authored.nounSandwich) {
      return { ok: false, failureKind: "authored-generic-or-noun-sandwich" };
    }
    if (authored.tableRowOnly) {
      return { ok: false, failureKind: "table-row-only" };
    }
    if (imageMatchesOfficial(attempt.objectStation, attempt.image)) {
      return { ok: false, failureKind: "properties-without-relation" };
    }
    return { ok: false, failureKind: "authored-missing-meeting-bind" };
  }
  const claim = evaluateLensAuthoredSemanticClaim(
    resolved.parse,
    attempt.meetingMode,
    attempt.image,
  );
  if (claim.status !== "ready") {
    const authored = analyzeConvexLensAuthored(attempt.modelReasoning);
    if (authored.tableRowOnly) {
      return { ok: false, failureKind: "table-row-only" };
    }
    if (authored.generic || authored.nounSandwich) {
      return { ok: false, failureKind: "authored-generic-or-noun-sandwich" };
    }
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
