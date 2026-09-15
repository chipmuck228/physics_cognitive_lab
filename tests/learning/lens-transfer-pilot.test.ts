import { describe, expect, it } from "vitest";

import {
  evaluateConvexLensTransfer,
  evaluateRequiredTransferPair,
  officialImageConsequence,
  type LensReasoningSemanticParse,
} from "@/content/physics-models/convex-lens-imaging/construction";
import { LENS_COPY } from "@/lib/content/convex-lens-optical-bench";
import { accumulateConvexLensSceneEvidence } from "@/lib/learning/lens-evidence";
import { lensTransferRepairFeedback } from "@/lib/learning/lens-feedback";
import {
  applyDerivedTransferFields,
  buildLensTransferAttempt,
  completeLensTransferDraft,
  deriveLensTransferInternalFields,
  draftToLensTransferAttempt,
  emptyLensTransferDraft,
  hasCompletedLensTransfer,
  LENS_TRANSFER_FIELD_PROVENANCE,
  LENS_TRANSFER_LEARNER_OWNED_FIELDS,
  LENS_TRANSFER_OPTIONAL_DISTRACTOR_FIELDS,
  LENS_TRANSFER_SYSTEM_DERIVED_FIELDS,
  LENS_TRANSFER_UNITS_BEFORE_PER_TARGET,
} from "@/lib/learning/lens-transfer";
import { applyLensTransferParse } from "@/lib/learning/lens-transfer-semantic";
import { resolveLensTransferCheck } from "@/lib/learning/lens-step6-parse-client";
import { applyLensTransferSubmit } from "@/lib/learning/lens-action";
import { completeLensModelDraft, buildLensModelAttempt } from "@/lib/learning/lens-model";
import { createSession } from "@/lib/learning/session";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

const ACTUAL_REAL: LensReasoningSemanticParse = {
  meetingClaim: "actual-convergence",
  imageNatureClaim: "real",
  screenClaim: "receivable",
  hasMeetingClaim: true,
  hasConsequenceClaim: true,
  hasCausalBind: true,
  ambiguity: "none",
};

const BACKWARD_VIRTUAL: LensReasoningSemanticParse = {
  meetingClaim: "backward-extension",
  imageNatureClaim: "virtual",
  screenClaim: "not-receivable",
  hasMeetingClaim: true,
  hasConsequenceClaim: true,
  hasCausalBind: true,
  ambiguity: "none",
};

const CONTRADICT_CONVERGE_VIRTUAL: LensReasoningSemanticParse = {
  meetingClaim: "actual-convergence",
  imageNatureClaim: "virtual",
  screenClaim: "not-receivable",
  hasMeetingClaim: true,
  hasConsequenceClaim: true,
  hasCausalBind: true,
  ambiguity: "none",
};

const CONTRADICT_BACKWARD_REAL: LensReasoningSemanticParse = {
  meetingClaim: "backward-extension",
  imageNatureClaim: "real",
  screenClaim: "receivable",
  hasMeetingClaim: true,
  hasConsequenceClaim: true,
  hasCausalBind: true,
  ambiguity: "none",
};

function transferSession() {
  return {
    ...createSession(() => "t0", () => "lens-transfer-pilot", CONVEX_LENS_SCENE_ID),
    stage: LearningStage.TRANSFER,
  };
}

function withValidModel() {
  const session = transferSession();
  const model = buildLensModelAttempt(completeLensModelDraft("beyond-2f"), "t1");
  return { ...session, modelAttempts: [model] };
}

function projectorDraft(explanation: string, parse: LensReasoningSemanticParse | null = ACTUAL_REAL) {
  const base = {
    ...emptyLensTransferDraft("near-projector-real-enlarged"),
    objectStation: "between-f-and-2f",
    studentExplanation: explanation,
  };
  return parse ? applyDerivedTransferFields(base, parse, "llm-semantic-parse") : base;
}

function magnifierDraft(explanation: string, parse: LensReasoningSemanticParse | null = BACKWARD_VIRTUAL) {
  const base = {
    ...emptyLensTransferDraft("far-magnifying-glass-virtual"),
    objectStation: "inside-f",
    studentExplanation: explanation,
  };
  return parse ? applyDerivedTransferFields(base, parse, "llm-semantic-parse") : base;
}

describe("Scene 07 TRANSFER learning-experience pilot", () => {
  it("reports BEFORE 9 / AFTER 2 required learner units per target", () => {
    expect(LENS_TRANSFER_UNITS_BEFORE_PER_TARGET).toBe(9);
    expect(LENS_TRANSFER_LEARNER_OWNED_FIELDS).toEqual([
      "objectStation",
      "studentExplanation",
    ]);
    expect(LENS_TRANSFER_OPTIONAL_DISTRACTOR_FIELDS).toEqual(["surfaceCueSelected"]);
    expect(LENS_TRANSFER_SYSTEM_DERIVED_FIELDS).toEqual([
      "meetingMode",
      "side",
      "nature",
      "orientation",
      "size",
      "screenReceivable",
    ]);
    expect(LENS_TRANSFER_FIELD_PROVENANCE.objectStation).toBe("pre-commit-structured");
    expect(LENS_TRANSFER_FIELD_PROVENANCE.studentExplanation).toBe("pre-commit-authored");
    expect(LENS_TRANSFER_FIELD_PROVENANCE.meetingMode).toBe("system-derived");
    expect(LENS_TRANSFER_FIELD_PROVENANCE.image).toBe("system-derived");
    expect(LENS_TRANSFER_FIELD_PROVENANCE.authoredInterpretation).toBe("system-derived");
  });

  it("derives implied image fields only after station + matching causal claim", () => {
    const derived = deriveLensTransferInternalFields("between-f-and-2f", ACTUAL_REAL);
    expect(derived?.meetingMode).toBe("actual-convergence");
    expect(derived?.image).toEqual(officialImageConsequence("between-f-and-2f"));
  });

  it("does not copy official projector fields from targetId alone", () => {
    const draft = emptyLensTransferDraft("near-projector-real-enlarged");
    expect(draftToLensTransferAttempt(draft)).toBeNull();
    expect(applyLensTransferSubmit(transferSession(), draft).outcome.kind).toBe("missing");
  });

  it("canonical projector wording still reaches the deterministic evaluator", () => {
    const draft = completeLensTransferDraft("near-projector-real-enlarged");
    const structured = draftToLensTransferAttempt(draft);
    expect(structured).not.toBeNull();
    expect(evaluateConvexLensTransfer(structured!).ok).toBe(true);
  });

  it("canonical magnifier wording still reaches the deterministic evaluator", () => {
    const draft = completeLensTransferDraft("far-magnifying-glass-virtual");
    expect(evaluateConvexLensTransfer(draftToLensTransferAttempt(draft)!).ok).toBe(true);
  });

  it("projector: correct station + correct paraphrase can pass via stored parse", () => {
    const text = "光穿过透镜以后在另一边碰到了一起，所以成了实像。";
    const draft = projectorDraft(text, ACTUAL_REAL);
    expect(draft.authoredInterpretation?.provenance).toBe("system-derived");
    const structured = draftToLensTransferAttempt(draft);
    expect(structured?.authoredInterpretation).toEqual(ACTUAL_REAL);
    expect(evaluateConvexLensTransfer(structured!).ok).toBe(true);
    expect(applyLensTransferSubmit(transferSession(), draft).outcome.kind).toBe("committed");
  });

  it("projector: wrong station + plausible explanation is rejected", () => {
    const draft = {
      ...projectorDraft("光穿过透镜以后在另一边碰到了一起，所以成了实像。"),
      objectStation: "inside-f",
    };
    const repair = lensTransferRepairFeedback(draft);
    expect(repair?.message).toBe(LENS_COPY.transferMismatchStationProjector);
    expect(applyLensTransferSubmit(transferSession(), draft).session.transferAttempts[0]?.accepted).toBe(
      false,
    );
  });

  it("projector: correct station + virtual mechanism is rejected", () => {
    const draft = projectorDraft(
      "这里物体在焦点里面，出来的光是散开的，往回延长才碰到，所以看到的是虚像。",
      BACKWARD_VIRTUAL,
    );
    expect(evaluateConvexLensTransfer(draftToLensTransferAttempt(draft)!).ok).toBe(false);
    expect(lensTransferRepairFeedback(draft)?.message).toBe(LENS_COPY.transferClaimMismatch);
  });

  it("magnifier: correct inside-F + virtual mechanism passes", () => {
    const draft = magnifierDraft(
      "这里物体在焦点里面，出来的光是散开的，往回延长才碰到，所以看到的是虚像。",
    );
    expect(evaluateConvexLensTransfer(draftToLensTransferAttempt(draft)!).ok).toBe(true);
  });

  it("magnifier: correct station + actual-convergence claim is rejected", () => {
    const draft = magnifierDraft(
      "光穿过透镜以后在另一边碰到了一起，所以成了实像。",
      ACTUAL_REAL,
    );
    expect(evaluateConvexLensTransfer(draftToLensTransferAttempt(draft)!).ok).toBe(false);
    expect(lensTransferRepairFeedback(draft)?.message).toBe(LENS_COPY.transferClaimMismatch);
  });

  it("magnifier: wrong station + virtual words is rejected", () => {
    const draft = {
      ...magnifierDraft("反向延长线相交，所以是虚像，屏接不到。"),
      objectStation: "between-f-and-2f",
    };
    expect(lensTransferRepairFeedback(draft)?.message).toBe(
      LENS_COPY.transferMismatchStationMagnifier,
    );
  });

  it("surface slogan cannot pass", () => {
    const draft = {
      ...completeLensTransferDraft("near-projector-real-enlarged"),
      studentExplanation: "都有凸透镜，所以一样。",
      authoredInterpretation: null,
    };
    expect(evaluateConvexLensTransfer(draftToLensTransferAttempt(draft)!).ok).toBe(false);
    expect(lensTransferRepairFeedback(draft)?.message).toBe(LENS_COPY.transferSloganOnly);
  });

  it("paraphrase regression A/B/C are interpretable; D/E/F do not pass", () => {
    const a = projectorDraft("光穿过透镜以后在另一边碰到了一起，所以成了实像。", ACTUAL_REAL);
    const b = projectorDraft("这些光最后汇到同一个地方，所以成了实像。", ACTUAL_REAL);
    const c = projectorDraft(
      "从透镜出来以后，它们不是继续散开，而是在另一侧相交，幕布就能接到。",
      ACTUAL_REAL,
    );
    expect(evaluateConvexLensTransfer(draftToLensTransferAttempt(a)!).ok).toBe(true);
    expect(evaluateConvexLensTransfer(draftToLensTransferAttempt(b)!).ok).toBe(true);
    expect(evaluateConvexLensTransfer(draftToLensTransferAttempt(c)!).ok).toBe(true);

    const d = projectorDraft("光线真正会聚，所以形成虚像。", CONTRADICT_CONVERGE_VIRTUAL);
    const e = projectorDraft("实像是因为反向延长线真正会聚。", CONTRADICT_BACKWARD_REAL);
    const f = {
      ...emptyLensTransferDraft("near-projector-real-enlarged"),
      objectStation: "between-f-and-2f",
      studentExplanation: "变了。",
    };
    expect(evaluateConvexLensTransfer(draftToLensTransferAttempt(d)!).ok).toBe(false);
    expect(evaluateConvexLensTransfer(draftToLensTransferAttempt(e)!).ok).toBe(false);
    expect(draftToLensTransferAttempt(f)).toBeNull();
    expect(lensTransferRepairFeedback(f)?.message).toBe(LENS_COPY.transferVague);
  });

  it("LLM parse cannot directly accept transfer", () => {
    const parseResult = applyLensTransferParse(
      {
        ...emptyLensTransferDraft("near-projector-real-enlarged"),
        objectStation: "inside-f",
        studentExplanation: "光穿过透镜以后在另一边碰到了一起，所以成了实像。",
      },
      ACTUAL_REAL,
      "llm-semantic-parse",
    );
    expect(parseResult.check.status).toBe("ready");
    expect(parseResult.draft.authoredInterpretation?.source).toBe("llm-semantic-parse");
    const evaluation = evaluateConvexLensTransfer(draftToLensTransferAttempt(parseResult.draft)!);
    expect(evaluation.ok).toBe(false);
    expect(evaluation.failureKind).toBe("wrong-target-structure");
  });

  it("parser failure is recoverable and does not invent correctness", async () => {
    const draft = {
      ...emptyLensTransferDraft("near-projector-real-enlarged"),
      objectStation: "between-f-and-2f",
      studentExplanation: "光最后碰到了，所以成了实像。",
    };
    const resolved = await resolveLensTransferCheck(draft, async () => ({
      ok: false,
      reason: "unavailable",
    }));
    expect(resolved.check.status).toBe("missing");
    expect(resolved.check.status === "missing" && resolved.check.message).toBe(
      LENS_COPY.transferUnclear,
    );
    expect(resolved.draft.studentExplanation).toBe(draft.studentExplanation);
    expect(draftToLensTransferAttempt(resolved.draft)).toBeNull();
  });

  it("natural paraphrase can reach the semantic fallback", async () => {
    const draft = {
      ...emptyLensTransferDraft("near-projector-real-enlarged"),
      objectStation: "between-f-and-2f",
      studentExplanation: "这些光最后汇到同一个地方，所以成了实像。",
    };
    const resolved = await resolveLensTransferCheck(draft, async () => ({
      ok: true,
      parse: ACTUAL_REAL,
    }));
    expect(resolved.check.status).toBe("ready");
    expect(resolved.draft.authoredInterpretation?.source).toBe("llm-semantic-parse");
    expect(evaluateConvexLensTransfer(draftToLensTransferAttempt(resolved.draft)!).ok).toBe(true);
  });

  it("one accepted transfer is not L5; the required pair still is", () => {
    const session = withValidModel();
    session.transferAttempts = [
      buildLensTransferAttempt(completeLensTransferDraft("near-projector-real-enlarged"), "t2"),
    ];
    const one = accumulateConvexLensSceneEvidence(session);
    expect(one.successfulTransfer).toBeUndefined();
    expect(deriveModelEvidenceLevel(one)).toBe("L4");

    session.transferAttempts = [
      buildLensTransferAttempt(completeLensTransferDraft("near-projector-real-enlarged"), "t2"),
      buildLensTransferAttempt(completeLensTransferDraft("far-magnifying-glass-virtual"), "t3"),
    ];
    const pair = accumulateConvexLensSceneEvidence(session);
    expect(pair.successfulTransfer).toBe(true);
    expect(deriveModelEvidenceLevel(pair)).toBe("L5");
    expect(
      evaluateRequiredTransferPair([
        draftToLensTransferAttempt(completeLensTransferDraft("near-projector-real-enlarged"))!,
        draftToLensTransferAttempt(completeLensTransferDraft("far-magnifying-glass-virtual"))!,
      ]).ok,
    ).toBe(true);
  });

  it("accepted paraphrase pair completes TRANSFER without re-lexing stored text", () => {
    const attempts = [
      buildLensTransferAttempt(
        projectorDraft("光穿过透镜以后在另一边碰到了一起，所以成了实像。"),
        "t2",
      ),
      buildLensTransferAttempt(
        magnifierDraft("这里物体在焦点里面，出来的光是散开的，往回延长才碰到，所以看到的是虚像。"),
        "t3",
      ),
    ];
    expect(attempts.every((attempt) => attempt.accepted)).toBe(true);
    expect(hasCompletedLensTransfer(attempts)).toBe(true);
    expect(hasCompletedLensTransfer(attempts.slice(0, 1))).toBe(false);
  });
});
