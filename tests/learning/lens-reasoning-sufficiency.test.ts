import { describe, expect, it, vi } from "vitest";

import {
  analyzeConvexLensAuthored,
  classifyLensStep6FastPath,
  evaluateConvexLensAiOff,
  officialImageConsequence,
  officialMeetingMode,
  type LensReasoningSemanticParse,
} from "@/content/physics-models/convex-lens-imaging/construction";
import {
  applyDerivedAiOffFields,
  draftToLensAiOffAttempt,
  emptyLensAiOffDraft,
  evaluateLensAiOffAttempt,
  LENS_AI_OFF_B,
  localRequiredLensAiOffPostCheckIds,
  postCheckMatchesRequired,
} from "@/lib/learning/lens-ai-off";
import { resolveLensAiOffWithoutLlm } from "@/lib/learning/lens-ai-off-semantic";
import {
  evaluateLensLocalReasoning,
  evaluateLensModelCoverage,
  inferLensAiOffLocalTask,
} from "@/lib/learning/lens-local-reasoning";
import { resolveLensAiOffCheck } from "@/lib/learning/lens-step6-parse-client";

const OBSERVED_U_EQUALS_F =
  "物体在F上，光线透过透镜后，光线平行无法相交，在白屏上无法成像，白屏上接不到像。";

const NONE_PARSE: LensReasoningSemanticParse = {
  meetingClaim: "parallel-no-finite-meeting",
  imageNatureClaim: "none",
  screenClaim: "not-receivable",
  hasMeetingClaim: true,
  hasConsequenceClaim: true,
  hasCausalBind: true,
  ambiguity: "none",
};

function atFDraft(reasoning: string) {
  const base = {
    ...emptyLensAiOffDraft(),
    currentChallengeId: LENS_AI_OFF_B,
    objectStation: "at-f" as const,
    selectedAnswer: "virtual-not-on-screen-and-f-is-limit",
    reasoning,
  };
  const fast = classifyLensStep6FastPath(reasoning);
  const parse = fast.kind === "sufficient" ? fast.parse : NONE_PARSE;
  return applyDerivedAiOffFields(base, parse, "deterministic-fast-path");
}

describe("Scene 07 local reasoning sufficiency", () => {
  it("accepts the observed u=f learner sentence as locally sufficient", () => {
    const authored = analyzeConvexLensAuthored(OBSERVED_U_EQUALS_F);
    expect(authored.contradictory).toBe(false);
    expect(authored.meetingKind).toBe("no-finite-meeting");
    expect(authored.consequenceKind).toBe("none");
    expect(classifyLensStep6FastPath(OBSERVED_U_EQUALS_F).kind).toBe("sufficient");
    const local = evaluateLensLocalReasoning(OBSERVED_U_EQUALS_F, "u-equals-f");
    expect(local.status).toBe("sufficient");
    expect(local.sufficient).toBe(true);
    expect(local.missingRequiredRelations).toEqual([]);
  });

  it.each([
    "物体在焦点上，透镜后的光没有聚到一起，所以光屏移到哪里都接不到清楚的像。",
    "物体在F上，光通过透镜以后没有交到一起，白屏上接不到像。",
    "因为物体在焦点上，光线一直没有会聚到一个位置，所以光屏移到哪里都接不到清楚的像。",
  ])("accepts u=f paraphrase: %s", (text) => {
    const local = evaluateLensLocalReasoning(text, "u-equals-f");
    expect(local.status).toBe("sufficient");
    expect(local.sufficient).toBe(true);
  });

  it("treats result-only reasoning as insufficient and names the missing mechanism", () => {
    const local = evaluateLensLocalReasoning("因为物体在F，所以光屏接不到。", "u-equals-f");
    expect(local.status).toBe("insufficient");
    expect(local.sufficient).toBe(false);
    expect(local.missingRequiredRelations).toContain("no-finite-meeting");
    expect(local.feedback).toMatch(/怎么走|中间一步/);
    expect(local.feedback).not.toMatch(/会聚/);
  });

  it("rejects keyword-rich but physically wrong u=f reasoning", () => {
    const local = evaluateLensLocalReasoning(
      "物体在F，光线会聚，光屏接到实像。",
      "u-equals-f",
    );
    expect(local.sufficient).toBe(false);
    expect(local.status === "incorrect" || local.status === "contradictory").toBe(true);
  });

  it("does not accept no-screen-means-no-image as causal reasoning", () => {
    const local = evaluateLensLocalReasoning(
      "光屏上看不到，所以这里根本没有像。",
      "u-equals-f",
    );
    expect(local.sufficient).toBe(false);
    expect(local.status).toBe("incorrect");
  });

  it("rejects ordinary real-image-at-F as incorrect", () => {
    const local = evaluateLensLocalReasoning(
      "物体在焦点上也会正常形成实像，只是光屏位置不好找。",
      "u-equals-f",
    );
    expect(local.sufficient).toBe(false);
    expect(local.status).toBe("incorrect");
  });

  it("does not require the u<f branch for a u=f local task", () => {
    const local = evaluateLensLocalReasoning(OBSERVED_U_EQUALS_F, "u-equals-f");
    expect(local.sufficient).toBe(true);
    expect(local.missingRequiredRelations).not.toContain("backward-extension");
    expect(local.missingRequiredRelations).not.toContain("virtual-not-on-screen");
    const coverage = evaluateLensModelCoverage(OBSERVED_U_EQUALS_F);
    expect(coverage.missingBranches).toContain("backward-extension");
    expect(local.sufficient).toBe(true);
  });

  it("keeps incomplete whole-model coverage from blocking the local u=f result", () => {
    const coverage = evaluateLensModelCoverage(OBSERVED_U_EQUALS_F);
    expect(coverage.coveredBranches).toContain("no-finite-meeting");
    expect(coverage.missingBranches.length).toBeGreaterThan(0);
    expect(evaluateLensLocalReasoning(OBSERVED_U_EQUALS_F, "u-equals-f").sufficient).toBe(true);
  });

  it("does not require the u<f post-check when the current judgment is u=f", () => {
    expect(inferLensAiOffLocalTask({
      challengeId: LENS_AI_OFF_B,
      objectStation: "at-f",
      reasoning: OBSERVED_U_EQUALS_F,
    })).toBe("u-equals-f");
    expect(localRequiredLensAiOffPostCheckIds(LENS_AI_OFF_B, "u-equals-f")).toEqual([
      "f-is-not-ordinary",
    ]);
    expect(postCheckMatchesRequired(LENS_AI_OFF_B, ["f-is-not-ordinary"], "u-equals-f")).toBe(true);
    expect(
      postCheckMatchesRequired(LENS_AI_OFF_B, ["f-is-not-ordinary"], "compound"),
    ).toBe(false);

    const draft = atFDraft(OBSERVED_U_EQUALS_F);
    const evaluation = evaluateLensAiOffAttempt({
      draft,
      postCheckIds: ["f-is-not-ordinary"],
      llmUsed: false,
    });
    expect(evaluation.official.ok).toBe(true);
    expect(evaluation.accepted).toBe(true);
    expect(evaluation.reasoningSignals.postCheckMatchesRequired).toBe(true);
  });

  it("marks unparseable as missing, not physically incorrect", () => {
    const local = evaluateLensLocalReasoning("这些光穿过去以后有一种特别的走法。", "u-equals-f");
    expect(local.status).toBe("unparseable");
    expect(local.sufficient).toBe(false);
    const resolved = resolveLensAiOffWithoutLlm({
      ...emptyLensAiOffDraft(),
      currentChallengeId: LENS_AI_OFF_B,
      objectStation: "at-f",
      selectedAnswer: "virtual-not-on-screen-and-f-is-limit",
      reasoning: "这些光穿过去以后有一种特别的走法。",
    });
    expect(resolved.handled).toBe(true);
    expect(resolved.check.status).toBe("missing");
    expect(resolved.check.status === "missing" && resolved.check.message).toMatch(/还没看清/);
  });

  it("makes zero LLM parse calls in AI_OFF for the observed sentence", async () => {
    const requestParse = vi.fn(async () => ({
      ok: true as const,
      parse: NONE_PARSE,
    }));
    const draft = {
      ...emptyLensAiOffDraft(),
      currentChallengeId: LENS_AI_OFF_B,
      objectStation: "at-f" as const,
      selectedAnswer: "virtual-not-on-screen-and-f-is-limit",
      reasoning: OBSERVED_U_EQUALS_F,
    };
    const resolved = await resolveLensAiOffCheck(draft, requestParse);
    expect(requestParse).not.toHaveBeenCalled();
    expect(resolved.check.status).toBe("ready");
    expect(evaluateConvexLensAiOff(draftToLensAiOffAttempt(resolved.draft, false)!).ok).toBe(true);
    expect(officialMeetingMode("at-f")).toBe("no-finite-meeting");
    expect(officialImageConsequence("at-f").nature).toBe("none");
  });
});
