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

describe("Scene 07 TRANSFER pilot repair", () => {
  it("A. missing distinctive condition is missing, not wrong", () => {
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

  it("A2. station without authored text is missing", () => {
    const draft = {
      ...emptyLensTransferDraft(),
      objectStation: "between-f-and-2f",
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.kind).toBe("missing");
    expect(repair?.message).toBe(LENS_COPY.transferNeedAuthored);
  });

  it("B. wrong distinctive condition names the station, not seven fields", () => {
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      objectStation: "beyond-2f",
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.kind).toBe("inconsistent");
    expect(repair?.message).toBe(LENS_COPY.transferMismatchStationProjector);
    expect(repair?.message).not.toMatch(/物体位置、光线关系和像的结果还对不上/);
    const result = applyLensTransferSubmit(transferSession(), draft);
    expect(result.outcome.kind).toBe("rejected");
    expect(result.outcome.kind === "rejected" && result.outcome.message).toBe(
      LENS_COPY.transferMismatchStationProjector,
    );
  });

  it("C. structure correct + meeting missing", () => {
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      studentExplanation: "这是实像，光屏可以接到。",
      authoredInterpretation: null,
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferMeetingMissing);
  });

  it("D. structure correct + consequence missing", () => {
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      studentExplanation: "光线在另一侧真正汇聚。",
      authoredInterpretation: null,
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferConsequenceMissing);
  });

  it("E. meeting and consequence present but not bound", () => {
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      studentExplanation: "成实像。另外我看见光线真正会聚。",
      authoredInterpretation: null,
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferBindMissing);
  });

  it("F. authored meeting contradicts this target", () => {
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      studentExplanation: "光线反向延长后相交，所以是正立放大的虚像，屏接不到。",
      authoredInterpretation: null,
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferClaimMismatch);
  });

  it("G. slogan-only is one anti-surface message", () => {
    const draft = {
      ...completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      studentExplanation: "投影仪也有凸透镜。",
      authoredInterpretation: null,
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
      authoredInterpretation: null,
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

  it("recap mirrors the learner-owned claim, not derived image fields", () => {
    const draft = {
      ...emptyLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]),
      objectStation: "inside-f",
      studentExplanation: "先写着。",
    };
    const recap = lensTransferJudgmentRecap(draft);
    expect(recap.station).toMatch(/焦点以内/);
    expect(recap.explanation).toBe("先写着。");
  });

  it("TRANSFER help talks about the bind, not moving the screen", () => {
    const lines = lensHelpLadder("how-say", {
      stage: LearningStage.TRANSFER,
      capabilities: [],
      references: [],
    });
    expect(lines.join("\n")).toMatch(/光线/);
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

  it("station correct and virtual mechanism on the projector uses the claim repair", () => {
    const draft = {
      ...completeLensTransferDraft("near-projector-real-enlarged"),
      studentExplanation: "光线反向延长后相交，所以是正立放大的虚像，屏接不到。",
      authoredInterpretation: null,
    };
    expect(lensTransferRepairFeedback(draft)?.message).toBe(LENS_COPY.transferClaimMismatch);
  });

  it("prompt asks for the causal bind, not a 7-field restatement", () => {
    expect(LENS_COPY.transferOwnWords).toMatch(/为什么能用刚才的模型/);
    expect(LENS_COPY.transferOwnWords).not.toMatch(/物体相对焦点在哪里/);
    expect(LENS_COPY.transferConditionQuestion).toMatch(/相对焦点/);
  });
});
