import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { independentChallenges } from "@/content/physics-models/density-mass-volume/independent-challenges";
import { SAMPLES_COMPLETE_COPY } from "@/lib/content/equal-volume-material-samples";
import { accumulateSamplesSceneEvidence } from "@/lib/learning/samples-evidence";
import {
  SAMPLES_AI_OFF_CHALLENGE_IDS,
  applySamplesAiOffPostCheck,
  buildSamplesAiOffAttempt,
  buildSamplesAiOffAssessment,
  completeSamplesAiOffAttempt,
  completeSamplesAiOffInput,
  evaluateSamplesAiOffAttempt,
  hasAcceptedSamplesAiOffChallenges,
  hasCompletedSamplesAiOff,
  hasMeaningfulSamplesIndependentReasoning,
  intendedSamplesAiOffAnswerId,
  intendedSamplesAiOffPostCheckIds,
  samplesAiOffChallenge,
  samplesAiOffChallenges,
} from "@/lib/learning/samples-ai-off";
import { completedSamplesExamAttempts } from "@/lib/learning/samples-exam";
import {
  buildSamplesModelAttempt,
  completeSamplesModelInput,
} from "@/lib/learning/samples-model";
import { createLearningEvent } from "@/lib/learning/events";
import { createSession } from "@/lib/learning/session";
import {
  buildSamplesTransferAttempt,
  completeSamplesCupsTransferInput,
  completeSamplesHollowTransferInput,
} from "@/lib/learning/samples-transfer";
import { canLeaveStage } from "@/lib/learning/progression";
import { canTransition, nextStage } from "@/lib/learning/state-machine";
import { isTutorHardBlocked } from "@/lib/learning/stage-policy";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { LearningStage, SAMPLES_SCENE_ID } from "@/types/learning";
import type { LearningSession } from "@/types/learning";

const PACKAGES = SAMPLES_AI_OFF_CHALLENGE_IDS[0];
const CUT = SAMPLES_AI_OFF_CHALLENGE_IDS[1];

function samplesSession(overrides: Partial<LearningSession> = {}): LearningSession {
  return {
    ...createSession(() => "t0", () => "samples-session", SAMPLES_SCENE_ID),
    ...overrides,
  };
}

function l5Session(overrides: Partial<LearningSession> = {}): LearningSession {
  return samplesSession({
    stage: LearningStage.AI_OFF,
    modelAttempts: [buildSamplesModelAttempt(completeSamplesModelInput("t"))],
    transferAttempts: [
      buildSamplesTransferAttempt(completeSamplesCupsTransferInput("t1")),
      buildSamplesTransferAttempt(completeSamplesHollowTransferInput("t2")),
    ],
    examAttempts: completedSamplesExamAttempts(),
    ...overrides,
  });
}

describe("Scene 04 AI_OFF evaluation", () => {
  it("loads both challenges from the canonical Physics Model", () => {
    expect(samplesAiOffChallenges().map((item) => item.id)).toEqual([
      ...SAMPLES_AI_OFF_CHALLENGE_IDS,
    ]);
    expect(independentChallenges.map((item) => item.id)).toEqual(
      expect.arrayContaining([...SAMPLES_AI_OFF_CHALLENGE_IDS]),
    );
    expect(samplesAiOffChallenge(PACKAGES).llmAllowed).toBe(false);
    expect(samplesAiOffChallenge(CUT).llmAllowed).toBe(false);
  });

  it("does not treat short or empty reasoning as independent evidence", () => {
    expect(hasMeaningfulSamplesIndependentReasoning("")).toBe(false);
    expect(hasMeaningfulSamplesIndependentReasoning("因为")).toBe(false);
    expect(
      hasMeaningfulSamplesIndependentReasoning(
        "两个包装外形体积几乎相同，更沉的那个单位体积的质量更大。",
      ),
    ).toBe(true);
  });

  it("cannot pass on a correct answer alone", () => {
    const result = evaluateSamplesAiOffAttempt({
      challengeId: PACKAGES,
      selectedAnswer: intendedSamplesAiOffAnswerId(PACKAGES),
      studentReasoning: "",
      postCheckIds: [],
      llmUsed: false,
    });
    expect(result.answerCorrect).toBe(true);
    expect(result.accepted).toBe(false);
  });

  it("accepts valid independent reasoning for sealed packages", () => {
    const input = completeSamplesAiOffInput(PACKAGES, "t");
    expect(
      evaluateSamplesAiOffAttempt({
        ...input,
        llmUsed: false,
      }).accepted,
    ).toBe(true);
  });

  it("rejects misconception-containing reasoning", () => {
    const result = evaluateSamplesAiOffAttempt({
      challengeId: PACKAGES,
      selectedAnswer: intendedSamplesAiOffAnswerId(PACKAGES),
      studentReasoning: "更重密度就更大，不用看体积。",
      postCheckIds: intendedSamplesAiOffPostCheckIds(PACKAGES),
      llmUsed: false,
    });
    expect(result.accepted).toBe(false);
    expect(result.reasoningSignals.avoidsDensityMisconception).toBe(false);
  });

  it("rejects surface-only packaging reasoning", () => {
    const result = evaluateSamplesAiOffAttempt({
      challengeId: PACKAGES,
      selectedAnswer: intendedSamplesAiOffAnswerId(PACKAGES),
      studentReasoning: "都是包装，看起来像课堂上见过的样品。",
      postCheckIds: intendedSamplesAiOffPostCheckIds(PACKAGES),
      llmUsed: false,
    });
    expect(result.accepted).toBe(false);
  });

  it("accepts uniform-cut condition reasoning", () => {
    const input = completeSamplesAiOffInput(CUT, "t");
    expect(
      evaluateSamplesAiOffAttempt({
        ...input,
        llmUsed: false,
      }).accepted,
    ).toBe(true);
  });

  it("rejects treating a cut as automatically lowering density", () => {
    const result = evaluateSamplesAiOffAttempt({
      challengeId: CUT,
      selectedAnswer: intendedSamplesAiOffAnswerId(CUT),
      studentReasoning: "切开密度变小，变小了密度就变小。",
      postCheckIds: intendedSamplesAiOffPostCheckIds(CUT),
      llmUsed: false,
    });
    expect(result.accepted).toBe(false);
  });

  it("keeps the original committed response when a post-check is attached", () => {
    const input = completeSamplesAiOffInput(PACKAGES, "t");
    const first = buildSamplesAiOffAttempt(input, [], false);
    const updated = applySamplesAiOffPostCheck(first, input.postCheckIds, false);
    expect(updated.selectedAnswer).toBe(first.selectedAnswer);
    expect(updated.studentReasoning).toBe(first.studentReasoning);
    expect(updated.accepted).toBe(true);
    expect(first.accepted).toBe(false);
  });

  it("retains the original attempt after a later retry", () => {
    const failed = buildSamplesAiOffAttempt(
      {
        challengeId: PACKAGES,
        selectedAnswer: "heavier-always-denser",
        studentReasoning: "更重密度就更大。",
        timestamp: "t1",
      },
      [],
      false,
    );
    const passed = completeSamplesAiOffAttempt(PACKAGES, "t2");
    expect(failed.accepted).toBe(false);
    expect([failed, passed][0]?.timestamp).toBe("t1");
    expect(passed.studentReasoning).not.toBe(failed.studentReasoning);
  });

  it("blocks independent success when llmUsed is not false", () => {
    const input = completeSamplesAiOffInput(PACKAGES, "t");
    expect(
      evaluateSamplesAiOffAttempt({
        ...input,
        llmUsed: true,
      }).accepted,
    ).toBe(false);
  });

  it("requires both challenges", () => {
    const assessment = buildSamplesAiOffAssessment(
      [completeSamplesAiOffAttempt(PACKAGES, "t")],
      false,
    );
    expect(hasAcceptedSamplesAiOffChallenges(assessment)).toBe(false);
  });

  it("does not derive L6 from EXAM completion alone", () => {
    const session = l5Session({
      stage: LearningStage.EXAM,
      independentAssessment: undefined,
    });
    expect(deriveModelEvidenceLevel(accumulateSamplesSceneEvidence(session))).toBe(
      "L5",
    );
  });

  it("does not derive L6 from AI_OFF answer correctness alone", () => {
    const session = l5Session({
      independentAssessment: buildSamplesAiOffAssessment(
        [
          buildSamplesAiOffAttempt(completeSamplesAiOffInput(PACKAGES, "t1"), [], false),
          buildSamplesAiOffAttempt(completeSamplesAiOffInput(CUT, "t2"), [], false),
        ],
        false,
      ),
    });
    const evidence = accumulateSamplesSceneEvidence(session);
    expect(evidence.independentAiOffSuccess).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
  });

  it("may derive L6 from valid prior L5 plus accepted AI_OFF evidence", () => {
    const session = l5Session({
      independentAssessment: buildSamplesAiOffAssessment(
        [
          completeSamplesAiOffAttempt(PACKAGES, "t1"),
          completeSamplesAiOffAttempt(CUT, "t2"),
        ],
        false,
      ),
    });
    expect(hasCompletedSamplesAiOff(session)).toBe(true);
    const evidence = accumulateSamplesSceneEvidence(session);
    expect(evidence.independentAiOffSuccess).toBe(true);
    expect(evidence.llmDisabledDuringIndependent).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L6");
    expect(JSON.stringify(session)).not.toMatch(/"L6"/);
  });

  it("never writes L6 in Scene AI_OFF or evidence accumulation source", () => {
    expect(readFileSync("lib/learning/samples-ai-off.ts", "utf8")).not.toMatch(
      /["']L6["']/,
    );
    expect(readFileSync("lib/learning/samples-evidence.ts", "utf8")).not.toMatch(
      /["']L6["']/,
    );
  });

  it("opens AI_OFF after EXAM and waits for independent evidence before COMPLETE", () => {
    const examDone = l5Session({
      stage: LearningStage.EXAM,
      independentAssessment: undefined,
    });
    expect(canLeaveStage(examDone, LearningStage.AI_OFF)).toBe(true);
    const aiOff = l5Session();
    expect(canLeaveStage(aiOff, LearningStage.COMPLETE)).toBe(false);
    const ready = l5Session({
      independentAssessment: buildSamplesAiOffAssessment(
        [
          completeSamplesAiOffAttempt(PACKAGES, "t1"),
          completeSamplesAiOffAttempt(CUT, "t2"),
        ],
        false,
      ),
    });
    expect(canLeaveStage(ready, LearningStage.COMPLETE)).toBe(true);
  });

  it("treats tutor events during AI_OFF as independent-success blockers", () => {
    const session = l5Session({
      independentAssessment: buildSamplesAiOffAssessment(
        [
          completeSamplesAiOffAttempt(PACKAGES, "t1"),
          completeSamplesAiOffAttempt(CUT, "t2"),
        ],
        false,
      ),
      events: [
        createLearningEvent("ai_interaction", LearningStage.AI_OFF, {
          source: "tutor",
        }),
      ],
    });
    expect(hasCompletedSamplesAiOff(session)).toBe(false);
    expect(accumulateSamplesSceneEvidence(session).independentAiOffSuccess).toBeUndefined();
  });

  it("makes COMPLETE terminal with no tutor and evidence-bounded wording", () => {
    expect(nextStage(LearningStage.COMPLETE)).toBeNull();
    expect(canTransition(LearningStage.COMPLETE, LearningStage.AI_OFF)).toBe(false);
    expect(isTutorHardBlocked(LearningStage.AI_OFF)).toBe(true);
    expect(isTutorHardBlocked(LearningStage.COMPLETE)).toBe(true);
    expect(SAMPLES_COMPLETE_COPY.title).not.toMatch(/完全掌握|提高成绩/);
    expect(SAMPLES_COMPLETE_COPY.caution).toMatch(/不表示已经掌握|不保证/);
  });
});
