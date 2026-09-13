import { transferTargets } from "@/content/physics-models/convex-lens-imaging/transfer";
import {
  classifyLensStep6FastPath,
  evaluateConvexLensTransfer,
  looksLikeSurfaceConvexLensSlogan,
  meetingModeFromClaim,
  officialImageConsequence,
  officialMeetingMode,
  type ConvexLensTransferAttempt,
  type ImageConsequence,
  type LensReasoningSemanticParse,
  type MeetingMode,
} from "@/content/physics-models/convex-lens-imaging/construction";
import { PRODUCTION_TRANSFER_REQUIRED_IDS } from "@/content/physics-models/convex-lens-imaging/implementation-contract";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import {
  LENS_MEETING_OPTIONS,
  LENS_NATURE_OPTIONS,
  LENS_ORIENTATION_OPTIONS,
  LENS_SIDE_OPTIONS,
  LENS_SIZE_OPTIONS,
  LENS_STATION_OPTIONS,
} from "@/lib/content/convex-lens-optical-bench";
import type { LensModelDraft, LensStep6Interpretation } from "@/lib/learning/lens-model";
import { normalizeLensStep6Text } from "@/content/physics-models/convex-lens-imaging/construction";
import type { TransferAttempt } from "@/types/learning";
import type { TransferTarget } from "@/types/physics-model";

export const LENS_TRANSFER_DRAFT_KIND = "lens-transfer-draft";
export const LENS_TRANSFER_REQUIRED_IDS = [...PRODUCTION_TRANSFER_REQUIRED_IDS] as const;

/**
 * Pilot metric: committed learner-facing units per TRANSFER target.
 * BEFORE: 7 imaging radios + surface checkbox + authored text.
 * AFTER: 1 distinctive station + authored causal bind; surface checkbox is optional distractor.
 */
export const LENS_TRANSFER_UNITS_BEFORE_PER_TARGET = 9;
export const LENS_TRANSFER_LEARNER_OWNED_FIELDS = [
  "objectStation",
  "studentExplanation",
] as const;
export const LENS_TRANSFER_OPTIONAL_DISTRACTOR_FIELDS = ["surfaceCueSelected"] as const;
export const LENS_TRANSFER_SYSTEM_DERIVED_FIELDS = [
  "meetingMode",
  "side",
  "nature",
  "orientation",
  "size",
  "screenReceivable",
] as const;

export type LensTransferFieldProvenance = {
  objectStation: "pre-commit-structured";
  studentExplanation: "pre-commit-authored";
  authoredInterpretation: "system-derived";
  meetingMode: "system-derived";
  image: "system-derived";
};

export const LENS_TRANSFER_FIELD_PROVENANCE: LensTransferFieldProvenance = {
  objectStation: "pre-commit-structured",
  studentExplanation: "pre-commit-authored",
  authoredInterpretation: "system-derived",
  meetingMode: "system-derived",
  image: "system-derived",
};

export interface LensTransferDraft {
  kind: typeof LENS_TRANSFER_DRAFT_KIND;
  targetId: string;
  objectStation: string;
  meetingMode: string;
  side: string;
  nature: string;
  orientation: string;
  size: string;
  screenReceivable: string;
  studentExplanation: string;
  surfaceCueSelected: boolean;
  authoredInterpretation?: LensStep6Interpretation | null;
}

export function lensTransferTarget(targetId: string): TransferTarget | undefined {
  return transferTargets.find((target) => target.id === targetId);
}

export function withLensTransferExplanation(
  draft: LensTransferDraft,
  studentExplanation: string,
): LensTransferDraft {
  if (studentExplanation === draft.studentExplanation) {
    return draft;
  }
  return {
    ...draft,
    studentExplanation,
    authoredInterpretation: null,
    meetingMode: "",
    side: "",
    nature: "",
    orientation: "",
    size: "",
    screenReceivable: "",
  };
}

export function emptyLensTransferDraft(
  targetId: string = LENS_TRANSFER_REQUIRED_IDS[0],
): LensTransferDraft {
  return {
    kind: LENS_TRANSFER_DRAFT_KIND,
    targetId,
    objectStation: "",
    meetingMode: "",
    side: "",
    nature: "",
    orientation: "",
    size: "",
    screenReceivable: "",
    studentExplanation: "",
    surfaceCueSelected: false,
    authoredInterpretation: null,
  };
}

export function transferParseFromDraft(
  draft: LensTransferDraft,
): LensReasoningSemanticParse | null {
  const text = draft.studentExplanation;
  const stored = draft.authoredInterpretation;
  if (
    stored &&
    stored.provenance === "system-derived" &&
    stored.textNormalized === normalizeLensStep6Text(text)
  ) {
    return stored.parse;
  }
  const fast = classifyLensStep6FastPath(text);
  return fast.kind === "sufficient" ? fast.parse : null;
}

/**
 * Derive internal imaging fields only after the learner supplied station + a
 * normalized causal claim. These fields are SYSTEM_DERIVED, not learner clicks.
 *
 * Rules:
 * - meetingMode comes from the parsed claim, never from targetId.
 * - If parsed meeting + nature + screen match official Physics Truth for the
 *   learner's station, side / orientation / size / screenReceivable are the
 *   official entailed image for that station.
 * - Otherwise reconstruct the implied family from the claim so the
 *   target-bound evaluator can reject the mismatch.
 */
export function deriveLensTransferInternalFields(
  objectStation: ObjectStation,
  parse: LensReasoningSemanticParse,
): { meetingMode: MeetingMode; image: ImageConsequence } | null {
  const meetingMode = meetingModeFromClaim(parse.meetingClaim);
  if (!meetingMode) {
    return null;
  }
  const official = officialImageConsequence(objectStation);
  const officialMeeting = officialMeetingMode(objectStation);
  const claimedNature =
    parse.imageNatureClaim === "real" ||
    parse.imageNatureClaim === "virtual" ||
    parse.imageNatureClaim === "none"
      ? parse.imageNatureClaim
      : meetingMode === "actual-convergence"
        ? "real"
        : meetingMode === "backward-extension"
          ? "virtual"
          : "none";
  const claimedScreen =
    parse.screenClaim === "receivable"
      ? true
      : parse.screenClaim === "not-receivable"
        ? false
        : claimedNature === "real";
  if (
    meetingMode === officialMeeting &&
    claimedNature === official.nature &&
    claimedScreen === official.screenReceivable
  ) {
    return { meetingMode, image: official };
  }
  return {
    meetingMode,
    image: imageFamilyFromClaim(claimedNature, claimedScreen, official.size),
  };
}

function imageFamilyFromClaim(
  nature: ImageConsequence["nature"],
  screenReceivable: boolean,
  size: ImageConsequence["size"],
): ImageConsequence {
  if (nature === "real") {
    return {
      side: "other-side",
      nature: "real",
      orientation: "inverted",
      size: size === "none" ? "enlarged" : size,
      screenReceivable,
    };
  }
  if (nature === "virtual") {
    return {
      side: "same-side",
      nature: "virtual",
      orientation: "upright",
      size: size === "none" ? "enlarged" : size,
      screenReceivable,
    };
  }
  return {
    side: "none",
    nature: "none",
    orientation: "none",
    size: "none",
    screenReceivable: false,
  };
}

export function applyDerivedTransferFields(
  draft: LensTransferDraft,
  parse: LensReasoningSemanticParse,
  source: LensStep6Interpretation["source"],
): LensTransferDraft {
  if (!isObjectStationValue(draft.objectStation)) {
    return {
      ...draft,
      authoredInterpretation: {
        provenance: "system-derived",
        source,
        textNormalized: normalizeLensStep6Text(draft.studentExplanation),
        parse,
      },
    };
  }
  const derived = deriveLensTransferInternalFields(draft.objectStation, parse);
  return {
    ...draft,
    meetingMode: derived?.meetingMode ?? "",
    side: derived?.image.side ?? "",
    nature: derived?.image.nature ?? "",
    orientation: derived?.image.orientation ?? "",
    size: derived?.image.size ?? "",
    screenReceivable:
      derived == null ? "" : derived.image.screenReceivable ? "true" : "false",
    authoredInterpretation: {
      provenance: "system-derived",
      source,
      textNormalized: normalizeLensStep6Text(draft.studentExplanation),
      parse,
    },
  };
}

function isObjectStationValue(value: string): value is ObjectStation {
  return (
    value === "beyond-2f" ||
    value === "at-2f" ||
    value === "between-f-and-2f" ||
    value === "at-f" ||
    value === "inside-f"
  );
}

export function draftToLensTransferAttempt(
  draft: LensTransferDraft,
): ConvexLensTransferAttempt | null {
  if (!draft.targetId || !isObjectStationValue(draft.objectStation)) {
    return null;
  }
  if (!draft.studentExplanation.trim()) {
    return null;
  }
  const parse = transferParseFromDraft(draft);
  if (parse) {
    const derived = deriveLensTransferInternalFields(draft.objectStation, parse);
    if (!derived) {
      return null;
    }
    return {
      targetId: draft.targetId,
      objectStation: draft.objectStation,
      meetingMode: derived.meetingMode,
      image: derived.image,
      explanation: draft.studentExplanation,
      authoredInterpretation: parse,
    };
  }
  if (
    draft.meetingMode &&
    draft.side &&
    draft.nature &&
    draft.orientation &&
    draft.size &&
    (draft.screenReceivable === "true" || draft.screenReceivable === "false")
  ) {
    return {
      targetId: draft.targetId,
      objectStation: draft.objectStation,
      meetingMode: draft.meetingMode as MeetingMode,
      image: {
        side: draft.side as ImageConsequence["side"],
        nature: draft.nature as ImageConsequence["nature"],
        orientation: draft.orientation as ImageConsequence["orientation"],
        size: draft.size as ImageConsequence["size"],
        screenReceivable: draft.screenReceivable === "true",
      },
      explanation: draft.studentExplanation,
    };
  }
  return null;
}

export function isLensTransferDraftComplete(draft: LensTransferDraft): boolean {
  return draftToLensTransferAttempt(draft) !== null;
}

export function isLensTransferLearnerReady(draft: LensTransferDraft): boolean {
  return Boolean(draft.objectStation && draft.studentExplanation.trim());
}

export const LENS_TRANSFER_MISMATCH_ORDER = [
  "object-station",
  "authored-claim",
] as const;

export type LensTransferStructuredMismatch =
  (typeof LENS_TRANSFER_MISMATCH_ORDER)[number];

export function officialLensTransferStructure(targetId: string): {
  objectStation: ObjectStation;
  meetingMode: MeetingMode;
  image: ImageConsequence;
} | null {
  const objectStation =
    targetId === "near-projector-real-enlarged"
      ? "between-f-and-2f"
      : targetId === "far-magnifying-glass-virtual"
        ? "inside-f"
        : null;
  if (!objectStation) {
    return null;
  }
  return {
    objectStation,
    meetingMode: officialMeetingMode(objectStation),
    image: officialImageConsequence(objectStation),
  };
}

/** First learner-owned mismatch vs the target-required row. Repair only. */
export function firstLensTransferStructuredMismatch(
  draft: LensTransferDraft,
): LensTransferStructuredMismatch | null {
  const expected = officialLensTransferStructure(draft.targetId);
  const structured = draftToLensTransferAttempt(draft);
  if (!expected || !structured) {
    return null;
  }
  if (structured.objectStation !== expected.objectStation) {
    return "object-station";
  }
  if (
    structured.meetingMode !== expected.meetingMode ||
    structured.image.side !== expected.image.side ||
    structured.image.nature !== expected.image.nature ||
    structured.image.orientation !== expected.image.orientation ||
    structured.image.size !== expected.image.size ||
    structured.image.screenReceivable !== expected.image.screenReceivable
  ) {
    return "authored-claim";
  }
  return null;
}

function optionLabel(
  options: readonly { value: string; label: string }[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.label ?? "";
}

export interface LensTransferJudgmentRecap {
  station: string;
  explanation: string;
}

export function lensTransferJudgmentRecap(
  draft: LensTransferDraft,
): LensTransferJudgmentRecap {
  return {
    station: optionLabel(LENS_STATION_OPTIONS, draft.objectStation) || "还没选",
    explanation: draft.studentExplanation.trim() || "还没写",
  };
}

export interface LensTransferModelLink {
  station: string;
  meeting: string;
  image: string;
}

export function lensTransferModelLink(model: LensModelDraft): LensTransferModelLink {
  const imageParts = [
    optionLabel(LENS_SIDE_OPTIONS, model.side),
    optionLabel(LENS_NATURE_OPTIONS, model.nature),
    optionLabel(LENS_ORIENTATION_OPTIONS, model.orientation),
    optionLabel(LENS_SIZE_OPTIONS, model.size),
  ].filter(Boolean);
  return {
    station: optionLabel(LENS_STATION_OPTIONS, model.objectStation) || "物体条件",
    meeting: optionLabel(LENS_MEETING_OPTIONS, model.meetingMode) || "光线怎样相遇",
    image: imageParts.length > 0 ? imageParts.join(" · ") : "像的结果",
  };
}

export function buildLensTransferAttempt(
  draft: LensTransferDraft,
  timestamp: string,
): TransferAttempt {
  const structured = draftToLensTransferAttempt(draft);
  const evaluation = structured
    ? evaluateConvexLensTransfer(structured)
    : looksLikeSurfaceConvexLensSlogan(draft.studentExplanation)
      ? { ok: false, failureKind: "surface-convex-lens-slogan" as const }
      : { ok: false, failureKind: "incomplete-target-structure" as const };
  return {
    scenarioId: draft.targetId,
    targetId: draft.targetId,
    response: draft.studentExplanation,
    timestamp,
    accepted: evaluation.ok,
    failureKinds: evaluation.ok ? [] : [evaluation.failureKind],
    identifiedSharedModel: evaluation.ok,
    surfaceCueSelected: draft.surfaceCueSelected,
    selectedRelations: structured
      ? [
          structured.objectStation,
          structured.meetingMode,
          structured.image.nature,
          structured.image.side,
        ]
      : [],
    conditionReasoning: structured?.explanation,
  };
}

export function reconstructLensTransferAttempts(
  attempts: TransferAttempt[],
): ConvexLensTransferAttempt[] {
  return attempts.flatMap((attempt) => {
    const targetId = attempt.targetId ?? attempt.scenarioId;
    const parts = attempt.selectedRelations ?? [];
    if (parts.length < 4) {
      return [];
    }
    const station = parts[0] as ObjectStation;
    return [
      {
        targetId,
        objectStation: station,
        meetingMode: parts[1] as MeetingMode,
        image: officialImageConsequence(station),
        explanation: attempt.response,
      },
    ];
  });
}

export function hasCompletedLensTransfer(attempts: TransferAttempt[]): boolean {
  return LENS_TRANSFER_REQUIRED_IDS.every((id) =>
    attempts.some((attempt) => {
      if (!attempt.accepted) {
        return false;
      }
      if ((attempt.targetId ?? attempt.scenarioId) !== id) {
        return false;
      }
      return (attempt.selectedRelations?.length ?? 0) >= 2;
    }),
  );
}

export function activeLensTransferTargetId(attempts: TransferAttempt[]): string {
  const passed = new Set(
    attempts.filter((attempt) => attempt.accepted).map((attempt) => attempt.targetId ?? attempt.scenarioId),
  );
  return (
    LENS_TRANSFER_REQUIRED_IDS.find((id) => !passed.has(id)) ?? LENS_TRANSFER_REQUIRED_IDS[0]
  );
}

export function lensTransferProgress(attempts: TransferAttempt[]): {
  current: number;
  total: number;
  firstComplete: boolean;
} {
  const total = LENS_TRANSFER_REQUIRED_IDS.length;
  const passed = LENS_TRANSFER_REQUIRED_IDS.filter((id) =>
    attempts.some(
      (attempt) => attempt.accepted && (attempt.targetId ?? attempt.scenarioId) === id,
    ),
  ).length;
  if (passed >= total) {
    return { current: total, total, firstComplete: total > 1 };
  }
  return {
    current: passed + 1,
    total,
    firstComplete: passed >= 1,
  };
}

export function completeLensTransferDraft(targetId: string): LensTransferDraft {
  const station =
    targetId === "far-magnifying-glass-virtual" ? "inside-f" : "between-f-and-2f";
  const explanation =
    station === "inside-f"
      ? "邮票在焦点以内，光线发散，反向延长线相交，所以是正立放大的虚像，屏接不到。"
      : "幻灯片在 F 和 2F 之间，光线真正会聚，所以成倒立放大的实像，幕布放到像的位置才能接到。";
  const base = emptyLensTransferDraft(targetId);
  const withText = {
    ...base,
    objectStation: station,
    studentExplanation: explanation,
    surfaceCueSelected: false,
  };
  const parse = transferParseFromDraft(withText);
  return parse
    ? applyDerivedTransferFields(withText, parse, "deterministic-fast-path")
    : withText;
}
