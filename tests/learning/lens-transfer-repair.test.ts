import { describe, expect, it } from "vitest";

import { evaluateConvexLensTransfer } from "@/content/physics-models/convex-lens-imaging/construction";
import { LENS_COPY } from "@/lib/content/convex-lens-optical-bench";
import { lensHelpLadder } from "@/lib/learning/lens-help-intents";
import { lensTransferRepairFeedback } from "@/lib/learning/lens-feedback";
import {
  buildLensTransferAttempt,
  completeLensTransferDraft,
  draftToLensTransferAttempt,
  emptyLensTransferDraft,
  LENS_TRANSFER_REQUIRED_IDS,
  lensTransferJudgmentRecap,
} from "@/lib/learning/lens-transfer";
import { applyLensTransferSubmit } from "@/lib/learning/lens-action";
import { createSession } from "@/lib/learning/session";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

function transferSession() {
  return {
    ...createSession(() => "t0", () => "lens-transfer-repair", CONVEX_LENS_SCENE_ID),
    stage: LearningStage.TRANSFER,
  };
}

describe("Scene 07 TRANSFER authored explanation repair", () => {
  it("A. incomplete structure is missing, not wrong", () => {
    const draft = emptyLensTransferDraft();
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.kind).toBe("missing");
    expect(repair?.message).toBe(LENS_COPY.transferStructureIncomplete);
    expect(repair?.message).not.toMatch(/对不上/);
    const attempt = buildLensTransferAttempt(draft, "t0");
    expect(attempt.accepted).toBe(false);
    expect(attempt.failureKinds).toEqual(["incomplete-target-structure"]);
    const result = applyLensTransferSubmit(transferSession(), draft);
    expect(result.outcome.kind).toBe("missing");
    expect(result.outcome.kind === "missing" && result.outcome.message).toBe(
      LENS_COPY.transferStructureIncomplete,
    );
  });

  it("B. complete but wrong structure names the first concrete field", () => {
    const accepted = completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]);
    const draft = {
      ...accepted,
      meetingMode:
        accepted.meetingMode === "actual-convergence"
          ? "backward-extension"
          : "actual-convergence",
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.kind).toBe("inconsistent");
    expect(repair?.message).toBe(LENS_COPY.transferMismatchMeeting);
    expect(repair?.message).not.toMatch(/连起来/);
    expect(repair?.message).not.toMatch(/怎样相遇的/);
    expect(repair?.message).not.toMatch(/物体位置、光线关系和像的结果还对不上/);
    const result = applyLensTransferSubmit(transferSession(), draft);
    expect(result.outcome.kind).toBe("rejected");
    expect(result.outcome.kind === "rejected" && result.outcome.message).toBe(
      LENS_COPY.transferMismatchMeeting,
    );
  });

  it("C. structure correct + meeting missing", () => {
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      studentExplanation: "这是实像，光屏可以接到。",
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferMeetingMissing);
  });

  it("D. structure correct + consequence missing", () => {
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      studentExplanation: "光线在另一侧真正汇聚。",
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferConsequenceMissing);
  });

  it("E. meeting and consequence present but not bound", () => {
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      studentExplanation: "成实像。另外我看见光线真正会聚。",
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferBindMissing);
  });

  it("F. authored meeting contradicts the selected meeting", () => {
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      studentExplanation: "光线反向延长后相交，所以是正立放大的虚像，屏接不到。",
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferAuthoredContradicts);
  });

  it("G. slogan-only is one anti-surface message", () => {
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      studentExplanation: "投影仪也有凸透镜。",
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferSloganOnly);
    const structured = draftToLensTransferAttempt(draft);
    expect(structured && evaluateConvexLensTransfer(structured).ok).toBe(false);
  });

  it("H. table-row-only asks for a relation", () => {
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      studentExplanation: "u>2f，所以倒立缩小实像",
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferTableRowOnly);
  });

  it("I. accepted causal explanation has no repair", () => {
    const draft = completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]);
    expect(lensTransferRepairFeedback(draft)).toBeNull();
    const result = applyLensTransferSubmit(transferSession(), draft);
    expect(result.outcome.kind).toBe("committed");
    expect(result.session.transferAttempts[0]?.accepted).toBe(true);
  });

  it("J. surface checkbox does not mutate authored text", () => {
    const authored = "光线真正会聚，所以成倒立放大的实像，幕布放到像的位置才能接到。";
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      studentExplanation: authored,
      surfaceCueSelected: true,
    };
    const structured = draftToLensTransferAttempt(draft);
    expect(structured?.explanation).toBe(authored);
    const attempt = buildLensTransferAttempt(draft, "t0");
    expect(attempt.response).toBe(authored);
    expect(attempt.surfaceCueSelected).toBe(true);
    expect(attempt.response).not.toMatch(/都有凸透镜/);
  });

  it("recap mirrors the learner draft, not the official row", () => {
    const draft = {
      ...emptyLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      objectStation: "inside-f",
      meetingMode: "actual-convergence",
    };
    const recap = lensTransferJudgmentRecap(draft);
    expect(recap.station).toMatch(/焦点以内/);
    expect(recap.meeting).toMatch(/真正会聚/);
    expect(recap.image).toBe("还没选");
    expect(recap.screen).toBe("还没选");
  });

  it("TRANSFER help talks about the bind, not moving the screen", () => {
    const lines = lensHelpLadder("how-say", {
      stage: LearningStage.TRANSFER,
      capabilities: [],
      references: [],
    });
    expect(lines.join("\n")).toMatch(/光线关系/);
    expect(lines.join("\n")).not.toMatch(/改的是物体位置还是光屏/);
  });

  it("only object station wrong uses the projector station repair", () => {
    const draft = {
      ...completeLensTransferDraft("near-projector-real-enlarged"),
      objectStation: "beyond-2f",
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferMismatchStationProjector);
    expect(repair?.message).not.toMatch(/正确答案是/);
    expect(repair?.message).not.toMatch(/F 和 2F 之间/);
  });

  it("station correct and meeting wrong uses the meeting repair", () => {
    const draft = {
      ...completeLensTransferDraft("near-projector-real-enlarged"),
      meetingMode: "backward-extension",
    };
    expect(lensTransferRepairFeedback(draft)?.message).toBe(LENS_COPY.transferMismatchMeeting);
  });

  it("station and meeting correct, size wrong uses the size repair", () => {
    const draft = {
      ...completeLensTransferDraft("near-projector-real-enlarged"),
      size: "reduced",
    };
    expect(lensTransferRepairFeedback(draft)?.message).toBe(LENS_COPY.transferMismatchSize);
  });

  it("only screen wrong uses the screen repair", () => {
    const draft = {
      ...completeLensTransferDraft("near-projector-real-enlarged"),
      screenReceivable: "false",
    };
    expect(lensTransferRepairFeedback(draft)?.message).toBe(LENS_COPY.transferMismatchScreen);
  });

  it("multiple wrong fields return exactly the first mismatch", () => {
    const draft = {
      ...completeLensTransferDraft("near-projector-real-enlarged"),
      objectStation: "beyond-2f",
      meetingMode: "backward-extension",
      size: "reduced",
      screenReceivable: "false",
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferMismatchStationProjector);
    expect(repair?.message).not.toMatch(/大小/);
    expect(repair?.message).not.toMatch(/光屏接到/);
  });

  it("prompt no longer asks to restate object station", () => {
    expect(LENS_COPY.transferOwnWords).toMatch(/光线怎样相遇，为什么会得到这样的像/);
    expect(LENS_COPY.transferOwnWords).not.toMatch(/物体相对焦点在哪里/);
  });
});
