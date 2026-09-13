import { describe, expect, it } from "vitest";

import { applyLensAiOffCommit, applyLensAiOffPostCheckSave } from "@/lib/learning/lens-action";
import {
  LENS_AI_OFF_A,
  LENS_AI_OFF_B,
  LENS_AI_OFF_CHALLENGE_IDS,
  classifyLensAiOffPostCheck,
  completeLensAiOffDraft,
  currentLensAiOffChallengeId,
  emptyLensAiOffDraft,
  hasAcceptedLensAiOffChallenges,
  hasCompletedLensAiOff,
  intendedLensAiOffPostCheckIds,
  nextLensAiOffDraft,
  postCheckMatchesRequired,
} from "@/lib/learning/lens-ai-off";
import { LENS_AI_OFF_COPY } from "@/lib/content/convex-lens-optical-bench";
import { LENS_AI_OFF_DRAFT_KEY, lensAiOffDraft } from "@/lib/learning/lens-scene-data";
import { createSession } from "@/lib/learning/session";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

function aiOffSession() {
  return {
    ...createSession(() => "t0", () => "lens-ai-off-post-check", CONVEX_LENS_SCENE_ID),
    stage: LearningStage.AI_OFF,
  };
}

function committedA() {
  const draft = completeLensAiOffDraft(LENS_AI_OFF_A);
  const result = applyLensAiOffCommit(aiOffSession(), {
    ...draft,
    postCheckSelections: [],
    step: "response",
  });
  return result.session;
}

describe("Scene 07 AI_OFF post-check progression", () => {
  it("empty post-check stays on the same challenge with a missing reason", () => {
    const session = committedA();
    const result = applyLensAiOffPostCheckSave(session, {
      challengeId: LENS_AI_OFF_A,
      postCheckIds: [],
    });
    expect(result.outcome.kind).toBe("missing");
    expect(result.outcome.kind === "missing" && result.outcome.message).toMatch(/勾出/);
    expect(result.session.stage).toBe(LearningStage.AI_OFF);
    expect(
      currentLensAiOffChallengeId(
        result.session.independentAssessment,
        lensAiOffDraft(result.session),
      ),
    ).toBe(LENS_AI_OFF_A);
    expect(result.session.independentAssessment?.challengeAttempts?.[0]?.accepted).toBe(false);
  });

  it("accepts the exact screenshot required set in any order", () => {
    const required = intendedLensAiOffPostCheckIds(LENS_AI_OFF_A);
    expect(required).toEqual([
      "identifiesObjectRelativeToF",
      "identifiesRayMeetingMode",
      "identifiesImageNatureAndOrientation",
      "checksScreenIsReceiver",
    ]);
    expect(postCheckMatchesRequired(LENS_AI_OFF_A, [...required].reverse())).toBe(true);
    expect(postCheckMatchesRequired(LENS_AI_OFF_A, required.slice(0, 3))).toBe(false);
    expect(postCheckMatchesRequired(LENS_AI_OFF_A, [...required, "surface-slogan"])).toBe(false);
    expect(
      postCheckMatchesRequired(LENS_AI_OFF_A, [
        ...required,
        "surface-slogan",
        "table-row-only",
      ]),
    ).toBe(false);
    expect(postCheckMatchesRequired(LENS_AI_OFF_A, [])).toBe(false);
    expect(postCheckMatchesRequired(LENS_AI_OFF_B, required)).toBe(false);
  });

  it("classifies missing, distractor, and precommit failures separately", () => {
    const required = intendedLensAiOffPostCheckIds(LENS_AI_OFF_A);
    const missing = classifyLensAiOffPostCheck({
      challengeId: LENS_AI_OFF_A,
      postCheckIds: required.slice(0, 3),
      officialOk: true,
    });
    const distractor = classifyLensAiOffPostCheck({
      challengeId: LENS_AI_OFF_A,
      postCheckIds: [...required, "surface-slogan"],
      officialOk: true,
    });
    const precommit = classifyLensAiOffPostCheck({
      challengeId: LENS_AI_OFF_A,
      postCheckIds: required,
      officialOk: false,
    });
    const wrongChallenge = classifyLensAiOffPostCheck({
      challengeId: LENS_AI_OFF_B,
      postCheckIds: required,
      officialOk: true,
    });
    expect(missing.kind === "rejected" && missing.message).toBe(LENS_AI_OFF_COPY.postCheckMissingRequired);
    expect(distractor.kind === "rejected" && distractor.message).toBe(LENS_AI_OFF_COPY.postCheckDistractor);
    expect(precommit.kind === "rejected" && precommit.message).toBe(LENS_AI_OFF_COPY.postCheckPrecommit);
    expect(wrongChallenge.kind === "rejected" && wrongChallenge.message).toBe(
      LENS_AI_OFF_COPY.postCheckWrongChallenge,
    );
  });

  it("wrong post-check stays current with one rejected reason", () => {
    const session = committedA();
    const result = applyLensAiOffPostCheckSave(session, {
      challengeId: LENS_AI_OFF_A,
      postCheckIds: ["surface-slogan"],
    });
    expect(result.outcome.kind).toBe("rejected");
    expect(result.outcome.message).toBe(LENS_AI_OFF_COPY.postCheckDistractor);
    expect(result.session.stage).toBe(LearningStage.AI_OFF);
    expect(result.session.independentAssessment?.challengeAttempts?.[0]?.accepted).toBe(false);
    expect(lensAiOffDraft(result.session).currentChallengeId).toBe(LENS_AI_OFF_A);
    expect(lensAiOffDraft(result.session).step).toBe("post-check");
  });

  it("selecting every option is rejected as a distractor", () => {
    const result = applyLensAiOffPostCheckSave(committedA(), {
      challengeId: LENS_AI_OFF_A,
      postCheckIds: [
        ...intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
        "surface-slogan",
        "table-row-only",
      ],
    });
    expect(result.outcome.kind).toBe("rejected");
    expect(result.outcome.message).toBe(LENS_AI_OFF_COPY.postCheckDistractor);
    expect(result.session.independentAssessment?.challengeAttempts?.[0]?.accepted).toBe(false);
  });

  it("missing one required fact names the missing class, not the distractor", () => {
    const required = intendedLensAiOffPostCheckIds(LENS_AI_OFF_A);
    const result = applyLensAiOffPostCheckSave(committedA(), {
      challengeId: LENS_AI_OFF_A,
      postCheckIds: required.slice(0, 3),
    });
    expect(result.outcome.kind).toBe("rejected");
    expect(result.outcome.message).toBe(LENS_AI_OFF_COPY.postCheckMissingRequired);
    expect(result.session.independentAssessment?.challengeAttempts?.[0]?.accepted).toBe(false);
  });

  it("still accepts when live draft structure was wiped after a valid commit", () => {
    const session = committedA();
    const wiped = {
      ...session,
      sceneData: {
        ...session.sceneData,
        [LENS_AI_OFF_DRAFT_KEY]: emptyLensAiOffDraft(),
      },
    };
    const result = applyLensAiOffPostCheckSave(wiped, {
      challengeId: LENS_AI_OFF_A,
      postCheckIds: intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
    });
    expect(wiped.independentAssessment?.challengeAttempts?.[0]?.preCommitEvidenceIds).toHaveLength(7);
    expect(result.outcome.kind).toBe("committed");
  });

  it("accepted first post-check opens the second challenge on response", () => {
    const session = committedA();
    const result = applyLensAiOffPostCheckSave(session, {
      challengeId: LENS_AI_OFF_A,
      postCheckIds: intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
    });
    expect(result.outcome.kind).toBe("committed");
    expect(result.session.independentAssessment?.challengeAttempts?.[0]?.accepted).toBe(true);
    const draft = lensAiOffDraft(result.session);
    expect(draft.currentChallengeId).toBe(LENS_AI_OFF_B);
    expect(draft.step).toBe("response");
    expect(draft.postCheckSelections).toEqual([]);
    expect(draft.objectStation).toBe("");
    expect(
      currentLensAiOffChallengeId(result.session.independentAssessment, draft),
    ).toBe(LENS_AI_OFF_B);
  });

  it("accepted final post-check leaves AI_OFF when the pair is complete", () => {
    const first = committedA();
    const afterFirst = applyLensAiOffPostCheckSave(first, {
      challengeId: LENS_AI_OFF_A,
      postCheckIds: intendedLensAiOffPostCheckIds(LENS_AI_OFF_A),
    }).session;
    const committedB = applyLensAiOffCommit(
      afterFirst,
      completeLensAiOffDraft(LENS_AI_OFF_B),
    ).session;
    const result = applyLensAiOffPostCheckSave(committedB, {
      challengeId: LENS_AI_OFF_B,
      postCheckIds: intendedLensAiOffPostCheckIds(LENS_AI_OFF_B),
    });
    expect(result.outcome.kind).toBe("committed");
    expect(result.outcome.kind === "committed" && result.outcome.advanced).toBe(true);
    expect(hasAcceptedLensAiOffChallenges(result.session.independentAssessment)).toBe(true);
    expect(hasCompletedLensAiOff(result.session)).toBe(true);
    expect(result.session.stage).toBe(LearningStage.COMPLETE);
    expect(result.session.independentAssessment?.challengeAttempts?.every((item) => item.accepted)).toBe(
      true,
    );
    expect(LENS_AI_OFF_CHALLENGE_IDS).toHaveLength(2);
    expect(nextLensAiOffDraft(
      result.session.independentAssessment,
      lensAiOffDraft(committedB),
      LENS_AI_OFF_B,
    ).currentChallengeId).toBe(LENS_AI_OFF_B);
  });
});
