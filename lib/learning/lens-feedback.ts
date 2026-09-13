import { analyzeConvexLensAuthored } from "@/content/physics-models/convex-lens-imaging/construction";
import { LENS_COPY } from "@/lib/content/convex-lens-optical-bench";
import {
  draftToLensTransferAttempt,
  firstLensTransferStructuredMismatch,
  type LensTransferDraft,
  type LensTransferStructuredMismatch,
} from "@/lib/learning/lens-transfer";
import { evaluateConvexLensTransfer } from "@/content/physics-models/convex-lens-imaging/construction";

export type LensFeedbackKind =
  | "missing"
  | "inconsistent"
  | "think_again"
  | "blocked"
  | "error";

export function lensBlockedFeedback(message: string): LensFeedback {
  return { kind: "blocked", message };
}

export function lensErrorFeedback(message: string): LensFeedback {
  return { kind: "error", message };
}

export interface LensFeedback {
  kind: LensFeedbackKind;
  message: string;
}

const INCONSISTENT = new Set([
  "image-conflicts-meeting-mode",
  "meeting-mode-conflicts-station",
  "geometrically-incoherent-rays",
  "station-impossible-ray",
]);

export function lensFeedbackForFailureKind(
  failureKind: string | undefined,
  missingLabels: string[],
): LensFeedback {
  if (missingLabels.length > 0) {
    return {
      kind: "missing",
      message: `还有没写完的：${missingLabels.join("；")}。`,
    };
  }
  if (failureKind && INCONSISTENT.has(failureKind)) {
    if (failureKind === "geometrically-incoherent-rays") {
      return {
        kind: "inconsistent",
        message:
          "这条光线的名字和经过透镜后的走法还对不上，再看看这条特殊光线经过凸透镜后的规律。",
      };
    }
    if (failureKind === "station-impossible-ray") {
      return {
        kind: "inconsistent",
        message:
          "你选的第三条光线，和现在的物体位置放在一起走不通。先回到两条必做的光线。",
      };
    }
    return {
      kind: "inconsistent",
      message:
        "你对光线怎样相遇和像的判断放在一起有冲突。先回到两条光线，看它们是真的相交，还是只有延长线相交。",
    };
  }
  if (failureKind === "table-row-only" || failureKind === "properties-without-relation") {
    return {
      kind: "think_again",
      message: "性质选出来了还不够。用一句话说明：会聚方式怎样带来这样的像。",
    };
  }
  if (failureKind === "authored-missing-meeting-bind") {
    return {
      kind: "think_again",
      message: "还要用自己的话把光线怎样相遇和像的后果连起来。不要只堆性质词。",
    };
  }
  if (failureKind === "u-equals-f-as-ordinary-image") {
    return {
      kind: "think_again",
      message:
        "物体正好在焦点上时，先看折射后的光线是不是彼此平行、会不会在有限位置会聚，再谈像。不要把它说成普通的清晰成像。",
    };
  }
  if (
    failureKind === "recognized-finished-diagram" ||
    failureKind === "copied-visible-diagram"
  ) {
    return {
      kind: "think_again",
      message: "这里没有已经画好的标准图可以点选。要自己决定两条光线怎么走。",
    };
  }
  return {
    kind: "think_again",
    message: "先自己组装两条光线，再说明交点怎样决定像。不要只背表。",
  };
}

export function lensTransferStructuredMismatchMessage(
  draft: LensTransferDraft,
): string {
  const mismatch = firstLensTransferStructuredMismatch(draft);
  return lensTransferMismatchCopy(draft.targetId, mismatch);
}

function lensTransferMismatchCopy(
  targetId: string,
  mismatch: LensTransferStructuredMismatch | null,
): string {
  if (mismatch === "object-station") {
    if (targetId === "near-projector-real-enlarged") {
      return LENS_COPY.transferMismatchStationProjector;
    }
    if (targetId === "far-magnifying-glass-virtual") {
      return LENS_COPY.transferMismatchStationMagnifier;
    }
    return LENS_COPY.transferStructureInconsistent;
  }
  if (mismatch === "meeting-mode") {
    return LENS_COPY.transferMismatchMeeting;
  }
  if (mismatch === "image-side") {
    return LENS_COPY.transferMismatchSide;
  }
  if (mismatch === "image-nature") {
    return LENS_COPY.transferMismatchNature;
  }
  if (mismatch === "orientation") {
    return LENS_COPY.transferMismatchOrientation;
  }
  if (mismatch === "size") {
    return LENS_COPY.transferMismatchSize;
  }
  if (mismatch === "screen-receivable") {
    return LENS_COPY.transferMismatchScreen;
  }
  return LENS_COPY.transferStructureInconsistent;
}

export function lensTransferRepairFeedback(draft: LensTransferDraft): LensFeedback | null {
  const structured = draftToLensTransferAttempt(draft);
  if (!structured) {
    return {
      kind: "missing",
      message: LENS_COPY.transferStructureIncomplete,
    };
  }
  const evaluation = evaluateConvexLensTransfer(structured);
  if (evaluation.ok) {
    return null;
  }
  if (evaluation.failureKind === "wrong-target-structure") {
    return {
      kind: "inconsistent",
      message: lensTransferStructuredMismatchMessage(draft),
    };
  }
  if (evaluation.failureKind === "unknown-or-unrequired-target") {
    return {
      kind: "inconsistent",
      message: LENS_COPY.transferStructureInconsistent,
    };
  }
  if (evaluation.failureKind === "surface-convex-lens-slogan") {
    return {
      kind: "think_again",
      message: LENS_COPY.transferSloganOnly,
    };
  }
  if (evaluation.failureKind === "table-row-only") {
    return {
      kind: "think_again",
      message: LENS_COPY.transferTableRowOnly,
    };
  }
  const authored = analyzeConvexLensAuthored(structured.explanation);
  if (
    authored.hasMeetingLanguage &&
    authored.meetingKind &&
    authored.meetingKind !== "mixed" &&
    authored.meetingKind !== structured.meetingMode
  ) {
    return {
      kind: "inconsistent",
      message: LENS_COPY.transferAuthoredContradicts,
    };
  }
  if (authored.missingKind === "contradiction") {
    return {
      kind: "inconsistent",
      message: LENS_COPY.transferAuthoredContradicts,
    };
  }
  if (
    authored.missingKind === "meeting" ||
    authored.generic ||
    !authored.hasMeetingLanguage
  ) {
    return {
      kind: "think_again",
      message: LENS_COPY.transferMeetingMissing,
    };
  }
  if (authored.missingKind === "consequence") {
    return {
      kind: "think_again",
      message: LENS_COPY.transferConsequenceMissing,
    };
  }
  if (authored.missingKind === "relation") {
    return {
      kind: "think_again",
      message: LENS_COPY.transferBindMissing,
    };
  }
  if (authored.tableRowOnly || authored.nounSandwich) {
    return {
      kind: "think_again",
      message: LENS_COPY.transferTableRowOnly,
    };
  }
  return {
    kind: "think_again",
    message: LENS_COPY.transferBindMissing,
  };
}

export function lensTransferFeedback(failureKind: string | undefined): LensFeedback {
  if (failureKind === "incomplete-target-structure") {
    return {
      kind: "missing",
      message: LENS_COPY.transferStructureIncomplete,
    };
  }
  if (failureKind === "surface-convex-lens-slogan") {
    return {
      kind: "think_again",
      message: LENS_COPY.transferSloganOnly,
    };
  }
  if (failureKind === "wrong-target-structure" || failureKind === "unknown-or-unrequired-target") {
    return {
      kind: "inconsistent",
      message: LENS_COPY.transferStructureInconsistent,
    };
  }
  if (failureKind === "table-row-only") {
    return {
      kind: "think_again",
      message: LENS_COPY.transferTableRowOnly,
    };
  }
  return {
    kind: "think_again",
    message: LENS_COPY.transferBindMissing,
  };
}
