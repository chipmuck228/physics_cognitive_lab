import { transferTargets } from "@/content/physics-models/convex-lens-imaging/transfer";
import {
  evaluateConvexLensTransfer,
  evaluateRequiredTransferPair,
  officialImageConsequence,
  officialMeetingMode,
  type ConvexLensTransferAttempt,
  type ImageConsequence,
  type MeetingMode,
} from "@/content/physics-models/convex-lens-imaging/construction";
import { PRODUCTION_TRANSFER_REQUIRED_IDS } from "@/content/physics-models/convex-lens-imaging/implementation-contract";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import {
  LENS_MEETING_OPTIONS,
  LENS_NATURE_OPTIONS,
  LENS_ORIENTATION_OPTIONS,
  LENS_RECEIVE_OPTIONS,
  LENS_SIDE_OPTIONS,
  LENS_SIZE_OPTIONS,
  LENS_STATION_OPTIONS,
} from "@/lib/content/convex-lens-optical-bench";
import type { TransferAttempt } from "@/types/learning";
import type { TransferTarget } from "@/types/physics-model";

export const LENS_TRANSFER_DRAFT_KIND = "lens-transfer-draft";
export const LENS_TRANSFER_REQUIRED_IDS = [...PRODUCTION_TRANSFER_REQUIRED_IDS] as const;

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
}

export function lensTransferTarget(targetId: string): TransferTarget | undefined {
  return transferTargets.find((target) => target.id === targetId);
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
  };
}

export function draftToLensTransferAttempt(
  draft: LensTransferDraft,
): ConvexLensTransferAttempt | null {
  if (
    !draft.targetId ||
    !draft.objectStation ||
    !draft.meetingMode ||
    !draft.side ||
    !draft.nature ||
    !draft.orientation ||
    !draft.size ||
    (draft.screenReceivable !== "true" && draft.screenReceivable !== "false")
  ) {
    return null;
  }
  return {
    targetId: draft.targetId,
    objectStation: draft.objectStation as ObjectStation,
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

export function isLensTransferDraftComplete(draft: LensTransferDraft): boolean {
  return draftToLensTransferAttempt(draft) !== null;
}

export const LENS_TRANSFER_MISMATCH_ORDER = [
  "object-station",
  "meeting-mode",
  "image-side",
  "image-nature",
  "orientation",
  "size",
  "screen-receivable",
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

/** First complete-structure mismatch vs the target-required row. Repair only. */
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
  if (structured.meetingMode !== expected.meetingMode) {
    return "meeting-mode";
  }
  if (structured.image.side !== expected.image.side) {
    return "image-side";
  }
  if (structured.image.nature !== expected.image.nature) {
    return "image-nature";
  }
  if (structured.image.orientation !== expected.image.orientation) {
    return "orientation";
  }
  if (structured.image.size !== expected.image.size) {
    return "size";
  }
  if (structured.image.screenReceivable !== expected.image.screenReceivable) {
    return "screen-receivable";
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
  meeting: string;
  image: string;
  screen: string;
}

export function lensTransferJudgmentRecap(
  draft: LensTransferDraft,
): LensTransferJudgmentRecap {
  const unset = "还没选";
  const imageParts = [
    optionLabel(LENS_SIDE_OPTIONS, draft.side),
    optionLabel(LENS_NATURE_OPTIONS, draft.nature),
    optionLabel(LENS_ORIENTATION_OPTIONS, draft.orientation),
    optionLabel(LENS_SIZE_OPTIONS, draft.size),
  ].filter(Boolean);
  return {
    station: optionLabel(LENS_STATION_OPTIONS, draft.objectStation) || unset,
    meeting: optionLabel(LENS_MEETING_OPTIONS, draft.meetingMode) || unset,
    image: imageParts.length > 0 ? imageParts.join(" · ") : unset,
    screen: optionLabel(LENS_RECEIVE_OPTIONS, draft.screenReceivable) || unset,
  };
}

export function buildLensTransferAttempt(
  draft: LensTransferDraft,
  timestamp: string,
): TransferAttempt {
  const structured = draftToLensTransferAttempt(draft);
  const evaluation = structured
    ? evaluateConvexLensTransfer(structured)
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
  const reconstructed = reconstructFromAccepted(attempts);
  return evaluateRequiredTransferPair(reconstructed).ok;
}

function reconstructFromAccepted(attempts: TransferAttempt[]): ConvexLensTransferAttempt[] {
  return attempts.flatMap((attempt) => {
    if (!attempt.accepted) {
      return [];
    }
    const targetId = attempt.targetId ?? attempt.scenarioId;
    const parts = attempt.selectedRelations ?? [];
    if (parts.length < 2) {
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
  const image = officialImageConsequence(station);
  return {
    kind: LENS_TRANSFER_DRAFT_KIND,
    targetId,
    objectStation: station,
    meetingMode: station === "inside-f" ? "backward-extension" : "actual-convergence",
    side: image.side,
    nature: image.nature,
    orientation: image.orientation,
    size: image.size,
    screenReceivable: image.screenReceivable ? "true" : "false",
    studentExplanation:
      station === "inside-f"
        ? "邮票在焦点以内，光线发散，反向延长线相交，所以是正立放大的虚像，屏接不到。"
        : "幻灯片在 F 和 2F 之间，光线真正会聚，所以成倒立放大的实像，幕布放到像的位置才能接到。",
    surfaceCueSelected: false,
  };
}
