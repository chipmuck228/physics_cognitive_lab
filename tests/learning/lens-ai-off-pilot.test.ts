import { describe, expect, it, vi } from "vitest";

import {
  classifyLensStep6FastPath,
  evaluateConvexLensAiOff,
  evaluateRequiredAiOffPair,
  officialImageConsequence,
  type LensReasoningSemanticParse,
} from "@/content/physics-models/convex-lens-imaging/construction";
import { LENS_AI_OFF_COPY } from "@/lib/content/convex-lens-optical-bench";
import { accumulateConvexLensSceneEvidence } from "@/lib/learning/lens-evidence";
import {
  applyDerivedAiOffFields,
  applyLensAiOffPostCheck,
  buildLensAiOffAssessment,
  buildLensAiOffAttempt,
  completeLensAiOffDraft,
  deriveLensAiOffInternalFields,
  draftToLensAiOffAttempt,
  emptyLensAiOffDraft,
  evaluateLensAiOffAttempt,
  hasAcceptedLensAiOffChallenges,
  intendedLensAiOffPostCheckIds,
  LENS_AI_OFF_A,
  LENS_AI_OFF_B,
  LENS_AI_OFF_FIELD_PROVENANCE,
  LENS_AI_OFF_LEARNER_OWNED_FIELDS,
  LENS_AI_OFF_SYSTEM_DERIVED_FIELDS,
  LENS_AI_OFF_UNITS_BEFORE_PER_CHALLENGE,
} from "@/lib/learning/lens-ai-off";
import {
  applyLensAiOffParse,
  resolveLensAiOffWithoutLlm,
} from "@/lib/learning/lens-ai-off-semantic";
import { applyLensAiOffCommit, applyLensAiOffPostCheckSave } from "@/lib/learning/lens-action";
import { resolveLensAiOffCheck } from "@/lib/learning/lens-step6-parse-client";
import { buildLensModelAttempt, completeLensModelDraft } from "@/lib/learning/lens-model";
import { buildLensTransferAttempt, completeLensTransferDraft } from "@/lib/learning/lens-transfer";
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

function aiOffSession() {
  return {
    ...createSession(() => "t0", () => "lens-ai-off-pilot", CONVEX_LENS_SCENE_ID),
    stage: LearningStage.AI_OFF,
  };
}

function windowDraft(
  reasoning: string,
  parse: LensReasoningSemanticParse | null = ACTUAL_REAL,
  extras: Partial<ReturnType<typeof emptyLensAiOffDraft>> = {},
) {
  const base = {
    ...emptyLensAiOffDraft(),
    currentChallengeId: LENS_AI_OFF_A,
    objectStation: "beyond-2f",
    selectedAnswer: "distant-object-real-reduced",
    reasoning,
    ...extras,
  };
  return parse ? applyDerivedAiOffFields(base, parse, "llm-semantic-parse") : base;
}

function magnifierDraft(
  reasoning: string,
  parse: LensReasoningSemanticParse | null = BACKWARD_VIRTUAL,
  extras: Partial<ReturnType<typeof emptyLensAiOffDraft>> = {},
) {
  const base = {
    ...emptyLensAiOffDraft(),
    currentChallengeId: LENS_AI_OFF_B,
    objectStation: "inside-f",
    selectedAnswer: "virtual-not-on-screen-and-f-is-limit",
    reasoning,
    ...extras,
  };
  return parse ? applyDerivedAiOffFields(base, parse, "llm-semantic-parse") : base;
}

function acceptBoth() {
  return buildLensAiOffAssessment(
    [
      buildLensAiOffAttempt(
        completeLensAiOffDraft(LENS_AI_OFF_A),
        "t5",
        intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
        false,
      ),
      buildLensAiOffAttempt(
        completeLensAiOffDraft(LENS_AI_OFF_B),
        "t6",
        intendedLensAiOffPostCheckIds(LENS_AI_OFF_B),
        false,
      ),
    ],
    false,
  );
}

describe("Scene 07 AI_OFF independent-use pilot", () => {
  it("reports BEFORE 10 / AFTER 3 learner-owned units per challenge", () => {
    expect(LENS_AI_OFF_UNITS_BEFORE_PER_CHALLENGE).toBe(10);
    expect(LENS_AI_OFF_LEARNER_OWNED_FIELDS).toEqual([
      "objectStation",
      "selectedAnswer",
      "reasoning",
    ]);
    expect(LENS_AI_OFF_SYSTEM_DERIVED_FIELDS).toEqual([
      "meetingMode",
      "side",
      "nature",
      "orientation",
      "size",
      "screenReceivable",
    ]);
    expect(LENS_AI_OFF_FIELD_PROVENANCE.objectStation).toBe("pre-commit-structured");
    expect(LENS_AI_OFF_FIELD_PROVENANCE.selectedAnswer).toBe("pre-commit-structured");
    expect(LENS_AI_OFF_FIELD_PROVENANCE.reasoning).toBe("pre-commit-authored");
    expect(LENS_AI_OFF_FIELD_PROVENANCE.authoredInterpretation).toBe("system-derived");
    expect(LENS_AI_OFF_FIELD_PROVENANCE.meetingMode).toBe("system-derived");
    expect(LENS_AI_OFF_FIELD_PROVENANCE.image).toBe("system-derived");
    expect(LENS_AI_OFF_FIELD_PROVENANCE.postCheck).toBe("post-commit-confirmation");
  });

  it("derives image fields from station + claim, never from challengeId alone", () => {
    const derived = deriveLensAiOffInternalFields("beyond-2f", ACTUAL_REAL);
    expect(derived?.meetingMode).toBe("actual-convergence");
    expect(derived?.image).toEqual(officialImageConsequence("beyond-2f"));
    expect(draftToLensAiOffAttempt(emptyLensAiOffDraft(), false)).toBeNull();
    expect(applyLensAiOffCommit(aiOffSession(), emptyLensAiOffDraft()).outcome.kind).toBe(
      "missing",
    );
  });

  it("challenge A: correct station + judgment + natural paraphrase can pass", () => {
    const draft = windowDraft("这些光穿过去以后在另一边碰到了一起，所以会形成能接到的像。");
    const structured = draftToLensAiOffAttempt(draft, false);
    expect(structured?.authoredInterpretation).toEqual(ACTUAL_REAL);
    expect(evaluateConvexLensAiOff(structured!).ok).toBe(true);
  });

  it("challenge A: wrong station is rejected", () => {
    const draft = windowDraft(
      "这些光穿过去以后在另一边碰到了一起，所以会形成能接到的像。",
      ACTUAL_REAL,
      { objectStation: "inside-f" },
    );
    expect(evaluateConvexLensAiOff(draftToLensAiOffAttempt(draft, false)!).ok).toBe(false);
  });

  it("challenge A: correct station + wrong integrated judgment is rejected", () => {
    const draft = windowDraft(
      "这些光穿过去以后在另一边碰到了一起，所以会形成能接到的像。",
      ACTUAL_REAL,
      { selectedAnswer: "also-convex-lens" },
    );
    expect(evaluateConvexLensAiOff(draftToLensAiOffAttempt(draft, false)!).ok).toBe(false);
  });

  it("challenge B: correct station + judgment + virtual paraphrase with F-limit can pass", () => {
    const draft = magnifierDraft(
      "出来以后还是散开的，往回画才碰到，所以只能看到虚像，白纸接不到。物体正好在焦点上时，有限远处不成完整的像。",
    );
    expect(evaluateConvexLensAiOff(draftToLensAiOffAttempt(draft, false)!).ok).toBe(true);
  });

  it("challenge B: virtual paraphrase without F-limit can pass locally", () => {
    const draft = magnifierDraft("出来以后还是散开的，往回画才碰到，所以只能看到虚像，白纸接不到。");
    expect(evaluateConvexLensAiOff(draftToLensAiOffAttempt(draft, false)!).ok).toBe(true);
  });

  it("paraphrase A/B/C are interpretable; D/E rejected; F insufficient", () => {
    expect(classifyLensStep6FastPath("光最后汇到一起了，所以卡片能看到清楚的像。").kind).not.toBe(
      "insufficient",
    );
    const a = applyLensAiOffParse(
      windowDraft("这些光穿过去以后在另一边碰到了一起，所以会形成能接到的像。", null),
      ACTUAL_REAL,
      "llm-semantic-parse",
    );
    const b = applyLensAiOffParse(
      windowDraft("光最后汇到一起了，所以卡片能看到清楚的像。", null),
      ACTUAL_REAL,
      "llm-semantic-parse",
    );
    const c = applyLensAiOffParse(
      magnifierDraft("出来以后还是散开的，往回画才碰到，所以只能看到虚像。", null),
      BACKWARD_VIRTUAL,
      "llm-semantic-parse",
    );
    expect(a.check.status).toBe("ready");
    expect(b.check.status).toBe("ready");
    expect(c.check.status).toBe("ready");

    const d = applyLensAiOffParse(
      windowDraft("光线真正会聚，所以形成虚像。", null),
      CONTRADICT_CONVERGE_VIRTUAL,
      "llm-semantic-parse",
    );
    const e = applyLensAiOffParse(
      windowDraft("反向延长线相交，所以可以在光屏上接到实像。", null),
      CONTRADICT_BACKWARD_REAL,
      "llm-semantic-parse",
    );
    const f = resolveLensAiOffWithoutLlm(windowDraft("变了。", null));
    expect(d.check.status).toBe("inconsistent");
    expect(e.check.status).toBe("inconsistent");
    expect(f.handled).toBe(true);
    expect(f.check.status).not.toBe("ready");
    expect(
      f.check.status === "missing" || f.check.status === "inconsistent"
        ? f.check.message
        : "",
    ).toMatch(/笼统|相遇|具体/);
  });

  it("LLM parse cannot accept a challenge by itself", () => {
    const parsed = applyLensAiOffParse(
      {
        ...emptyLensAiOffDraft(),
        currentChallengeId: LENS_AI_OFF_A,
        objectStation: "inside-f",
        selectedAnswer: "also-convex-lens",
        reasoning: "这些光穿过去以后在另一边碰到了一起，所以会形成能接到的像。",
      },
      ACTUAL_REAL,
      "llm-semantic-parse",
    );
    expect(parsed.draft.authoredInterpretation?.source).toBe("llm-semantic-parse");
    expect(evaluateConvexLensAiOff(draftToLensAiOffAttempt(parsed.draft, false)!).ok).toBe(false);
  });

  it("parser failure stays recoverable and does not accept", async () => {
    const draft = windowDraft("这些光穿过去以后有一种特别的走法。", null);
    const resolved = await resolveLensAiOffCheck(draft, async () => ({
      ok: false,
      reason: "unavailable",
    }));
    expect(resolved.check.status).toBe("missing");
    expect(resolved.check.status === "missing" && resolved.check.message).toBe(
      LENS_AI_OFF_COPY.unclear,
    );
    expect(draftToLensAiOffAttempt(resolved.draft, false)).toBeNull();
  });

  it("never calls a parse provider in AI_OFF", async () => {
    const requestParse = vi.fn(async () => ({
      ok: true as const,
      parse: ACTUAL_REAL,
    }));
    const draft = windowDraft("这些光穿过去以后在另一边碰到了一起，所以会形成能接到的像。", null);
    await resolveLensAiOffCheck(draft, requestParse);
    expect(requestParse).not.toHaveBeenCalled();
  });

  it("post-check cannot manufacture acceptance", () => {
    const weak = windowDraft("这也有凸透镜", null, { objectStation: "inside-f" });
    const committed = buildLensAiOffAttempt(weak, "t5", [], false);
    const patched = applyLensAiOffPostCheck(
      committed,
      weak,
      intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
      false,
    );
    expect(patched.accepted).toBe(false);
  });

  it("one accepted challenge is not independent completion", () => {
    const session = {
      ...aiOffSession(),
      modelAttempts: [buildLensModelAttempt(completeLensModelDraft("beyond-2f"), "t1")],
      transferAttempts: [
        buildLensTransferAttempt(completeLensTransferDraft("near-projector-real-enlarged"), "t2"),
        buildLensTransferAttempt(completeLensTransferDraft("far-magnifying-glass-virtual"), "t3"),
      ],
      independentAssessment: buildLensAiOffAssessment(
        [
          buildLensAiOffAttempt(
            completeLensAiOffDraft(LENS_AI_OFF_A),
            "t5",
            intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
            false,
          ),
        ],
        false,
      ),
    };
    const evidence = accumulateConvexLensSceneEvidence(session);
    expect(hasAcceptedLensAiOffChallenges(session.independentAssessment)).toBe(false);
    expect(evaluateRequiredAiOffPair([]).ok).toBe(false);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
  });

  it("required accepted pair still yields L6", () => {
    const session = {
      ...aiOffSession(),
      modelAttempts: [buildLensModelAttempt(completeLensModelDraft("beyond-2f"), "t1")],
      transferAttempts: [
        buildLensTransferAttempt(completeLensTransferDraft("near-projector-real-enlarged"), "t2"),
        buildLensTransferAttempt(completeLensTransferDraft("far-magnifying-glass-virtual"), "t3"),
      ],
      independentAssessment: acceptBoth(),
    };
    const evidence = accumulateConvexLensSceneEvidence(session);
    expect(hasAcceptedLensAiOffChallenges(session.independentAssessment)).toBe(true);
    expect(evidence.independentAiOffSuccess).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L6");
  });

  it("history is append-only and latest attempt is authoritative", () => {
    const first = applyLensAiOffCommit(
      aiOffSession(),
      windowDraft("这些光穿过去以后在另一边碰到了一起，所以会形成能接到的像。", ACTUAL_REAL, {
        selectedAnswer: "also-convex-lens",
      }),
    ).session;
    const second = applyLensAiOffCommit(first, completeLensAiOffDraft(LENS_AI_OFF_A)).session;
    expect(second.independentAssessment?.challengeAttempts).toHaveLength(2);
    const result = applyLensAiOffPostCheckSave(second, {
      challengeId: LENS_AI_OFF_A,
      postCheckIds: intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
    });
    const attempts = result.session.independentAssessment?.challengeAttempts ?? [];
    expect(attempts[0]?.accepted).toBe(false);
    expect(attempts[1]?.accepted).toBe(true);
  });

  it("evaluateLensAiOffAttempt still requires post-check and forbids llmUsed", () => {
    const draft = completeLensAiOffDraft(LENS_AI_OFF_A);
    expect(
      evaluateLensAiOffAttempt({
        draft,
        postCheckIds: intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
        llmUsed: true,
      }).accepted,
    ).toBe(false);
    expect(
      evaluateLensAiOffAttempt({
        draft,
        postCheckIds: intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
        llmUsed: false,
      }).accepted,
    ).toBe(true);
    expect(
      evaluateLensAiOffAttempt({
        draft,
        postCheckIds: [],
        llmUsed: false,
      }).accepted,
    ).toBe(false);
  });
});
