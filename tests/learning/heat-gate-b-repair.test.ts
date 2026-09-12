import { describe, expect, it } from "vitest";

import { MODEL_RELATION_IDS } from "@/content/physics-models/specific-heat-capacity/model";
import { accumulateHeatSceneEvidence } from "@/lib/learning/heat-evidence";
import {
  HEAT_AI_OFF_CHALLENGE_IDS,
  HEAT_AI_OFF_ICE_CHALLENGE_ID,
  HEAT_AI_OFF_LUNCHBOXES_CHALLENGE_ID,
  applyHeatAiOffPostCheck,
  buildHeatAiOffAssessment,
  buildHeatAiOffAttempt,
  completeHeatAiOffAttempt,
  completeHeatAiOffInput,
  evaluateHeatAiOffAttempt,
  intendedHeatAiOffAnswerId,
  intendedHeatAiOffPostCheckIds,
  intendedHeatAiOffPreCommitIds,
} from "@/lib/learning/heat-ai-off";
import {
  buildHeatModelAttempt,
  completeHeatModelInput,
} from "@/lib/learning/heat-model";
import {
  HEAT_ICE_INTENDED_CONDITION_CHECKS,
  buildHeatTransferAttempt,
  completeHeatIceTransferInput,
  completeHeatPotsTransferInput,
  evaluateHeatTransfer,
} from "@/lib/learning/heat-transfer";
import { createSession } from "@/lib/learning/session";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { HEAT_SAMPLES_SCENE_ID, LearningStage } from "@/types/learning";

const CORE = MODEL_RELATION_IDS.heatEqualsCTimesMassTimesDeltaT;
const TEMP_ALONE = MODEL_RELATION_IDS.temperatureAloneDoesNotGiveQ;
const PHASE = MODEL_RELATION_IDS.phaseChangeNeedsAnotherModel;

function heatSession(
  overrides: Partial<ReturnType<typeof createSession>> = {},
) {
  return {
    ...createSession(() => "t0", () => "heat-gate-b", HEAT_SAMPLES_SCENE_ID),
    stage: LearningStage.TRANSFER,
    ...overrides,
  };
}

function iceJudgments() {
  return {
    [CORE]: "applies" as const,
    [MODEL_RELATION_IDS.sameMassSameQLargerCSmallerDeltaT]:
      "not-necessarily" as const,
    [MODEL_RELATION_IDS.sameCSameQLargerMassSmallerDeltaT]:
      "not-necessarily" as const,
    [TEMP_ALONE]: "applies" as const,
    [PHASE]: "applies" as const,
  };
}

describe("Scene 05 Gate B evidence repair", () => {
  describe("TRANSFER ice boundary", () => {
    it("rejects core relation plus generic physics nouns", () => {
      const result = evaluateHeatTransfer({
        targetId: "far-ice-water-heated",
        judgments: iceJudgments(),
        surfaceCueSelected: false,
        studentExplanation: "质量温度能量都有。",
        conditionChecks: [...HEAT_ICE_INTENDED_CONDITION_CHECKS],
        timestamp: "t",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("keyword-sandwich");
    });

    it("rejects still-heating without phase-change boundary reasoning", () => {
      const result = evaluateHeatTransfer({
        targetId: "far-ice-water-heated",
        judgments: { [CORE]: "applies" },
        surfaceCueSelected: false,
        studentExplanation: "两边都还在加热。",
        timestamp: "t",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("missing-phase-change-boundary");
      expect(result.failureKinds).toContain("generic-boundary-talk");
    });

    it("rejects surface difference alone", () => {
      const result = evaluateHeatTransfer({
        targetId: "far-ice-water-heated",
        judgments: iceJudgments(),
        surfaceCueSelected: true,
        studentExplanation: "看起来像课堂上见过，也是加热。",
        conditionChecks: [...HEAT_ICE_INTENDED_CONDITION_CHECKS],
        timestamp: "t",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("surface-similarity-only");
    });

    it("accepts condition-aware phase-change boundary reasoning", () => {
      const result = evaluateHeatTransfer(completeHeatIceTransferInput("t"));
      expect(result.accepted).toBe(true);
      expect(result.failureKinds).toEqual([]);
    });
  });

  describe("TRANSFER pots keyword sandwich", () => {
    it("rejects noun presence without a comparison relation", () => {
      const result = evaluateHeatTransfer({
        ...completeHeatPotsTransferInput("t"),
        studentExplanation: "质量温度能量都有。",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("keyword-sandwich");
    });
  });

  describe("AI_OFF ice provenance", () => {
    const ice = HEAT_AI_OFF_ICE_CHALLENGE_ID;
    const postChecks = intendedHeatAiOffPostCheckIds(ice);
    const preCommit = intendedHeatAiOffPreCommitIds(ice);

    it("rejects 8-Han generic text plus correct post-checks", () => {
      const result = evaluateHeatAiOffAttempt({
        challengeId: ice,
        selectedAnswer: intendedHeatAiOffAnswerId(ice),
        studentReasoning: "我觉得这样不太对吧。",
        postCheckIds: postChecks,
        preCommitEvidenceIds: preCommit,
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
      expect(result.reasoningSignals.preCommitBoundaryReasoning).toBe(false);
    });

    it("rejects cold-and-strange authorship plus correct post-checks", () => {
      const result = evaluateHeatAiOffAttempt({
        challengeId: ice,
        selectedAnswer: intendedHeatAiOffAnswerId(ice),
        studentReasoning: "我觉得冰袋还是冷的所以很奇怪。",
        postCheckIds: postChecks,
        preCommitEvidenceIds: preCommit,
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
    });

    it("does not let post-checks manufacture missing pre-commit reasoning", () => {
      const committed = buildHeatAiOffAttempt(
        {
          challengeId: ice,
          selectedAnswer: intendedHeatAiOffAnswerId(ice),
          studentReasoning: "我觉得冰袋还是冷的所以很奇怪。",
          preCommitEvidenceIds: [],
          timestamp: "t",
        },
        [],
        false,
      );
      const after = applyHeatAiOffPostCheck(committed, postChecks, false);
      expect(after.studentReasoning).toBe(committed.studentReasoning);
      expect(after.preCommitEvidenceIds).toEqual([]);
      expect(after.accepted).toBe(false);
      expect(after.reasoningSignals.preCommitBoundaryReasoning).toBe(false);
      expect(after.reasoningSignals.identifiesConditionOrBoundary).toBe(false);
    });

    it("rejects a keyword sandwich", () => {
      const result = evaluateHeatAiOffAttempt({
        challengeId: ice,
        selectedAnswer: intendedHeatAiOffAnswerId(ice),
        studentReasoning: "质量温度能量都有。",
        postCheckIds: postChecks,
        preCommitEvidenceIds: preCommit,
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
    });

    it("accepts genuine pre-commit boundary reasoning plus required post-checks", () => {
      const input = completeHeatAiOffInput(ice, "t");
      const result = evaluateHeatAiOffAttempt({
        challengeId: ice,
        selectedAnswer: input.selectedAnswer,
        studentReasoning: input.studentReasoning,
        postCheckIds: input.postCheckIds,
        preCommitEvidenceIds: input.preCommitEvidenceIds,
        llmUsed: false,
      });
      expect(result.accepted).toBe(true);
      expect(result.reasoningSignals.preCommitBoundaryReasoning).toBe(true);
    });

    it("rejects answer-only", () => {
      const result = evaluateHeatAiOffAttempt({
        challengeId: ice,
        selectedAnswer: intendedHeatAiOffAnswerId(ice),
        studentReasoning: "对",
        postCheckIds: postChecks,
        preCommitEvidenceIds: preCommit,
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
    });

    it("rejects llmUsed !== false", () => {
      const input = completeHeatAiOffInput(ice, "t");
      const result = evaluateHeatAiOffAttempt({
        challengeId: ice,
        selectedAnswer: input.selectedAnswer,
        studentReasoning: input.studentReasoning,
        postCheckIds: input.postCheckIds,
        preCommitEvidenceIds: input.preCommitEvidenceIds,
        llmUsed: true,
      });
      expect(result.accepted).toBe(false);
    });
  });

  describe("AI_OFF lunchboxes keyword sandwich", () => {
    it("rejects noun presence without a comparison relation", () => {
      const lunch = HEAT_AI_OFF_LUNCHBOXES_CHALLENGE_ID;
      const result = evaluateHeatAiOffAttempt({
        challengeId: lunch,
        selectedAnswer: intendedHeatAiOffAnswerId(lunch),
        studentReasoning: "质量温度能量都有。",
        postCheckIds: intendedHeatAiOffPostCheckIds(lunch),
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
      expect(result.reasoningSignals.considersQMassAndDeltaTTogether).toBe(false);
    });
  });

  describe("evidence ladder", () => {
    it("does not create successfulTransfer or L5 from failed ice transfer", () => {
      const session = heatSession({
        modelAttempts: [buildHeatModelAttempt(completeHeatModelInput("t"))],
        transferAttempts: [
          buildHeatTransferAttempt(completeHeatPotsTransferInput("t1")),
          buildHeatTransferAttempt({
            targetId: "far-ice-water-heated",
            judgments: { [CORE]: "applies" },
            surfaceCueSelected: false,
            studentExplanation: "两边都还在加热。",
            timestamp: "t2",
          }),
        ],
      });
      const evidence = accumulateHeatSceneEvidence(session);
      expect(evidence.constructedValidCausalModel).toBe(true);
      expect(evidence.successfulTransfer).toBeUndefined();
      expect(deriveModelEvidenceLevel(evidence)).toBe("L4");
    });

    it("does not create L6 from failed independent ice reasoning", () => {
      const ice = completeHeatAiOffInput(HEAT_AI_OFF_ICE_CHALLENGE_ID, "t-ice");
      const failedIce = buildHeatAiOffAttempt(
        {
          challengeId: ice.challengeId,
          selectedAnswer: ice.selectedAnswer,
          studentReasoning: "我觉得冰袋还是冷的所以很奇怪。",
          preCommitEvidenceIds: [],
          timestamp: "t-ice",
        },
        ice.postCheckIds,
        false,
      );
      const session = heatSession({
        stage: LearningStage.AI_OFF,
        modelAttempts: [buildHeatModelAttempt(completeHeatModelInput("t"))],
        transferAttempts: [
          buildHeatTransferAttempt(completeHeatPotsTransferInput("t1")),
          buildHeatTransferAttempt(completeHeatIceTransferInput("t2")),
        ],
        independentAssessment: buildHeatAiOffAssessment(
          [
            completeHeatAiOffAttempt(HEAT_AI_OFF_CHALLENGE_IDS[0], "t-lunch"),
            failedIce,
          ],
          false,
        ),
      });
      const evidence = accumulateHeatSceneEvidence(session);
      expect(evidence.successfulTransfer).toBe(true);
      expect(evidence.independentAiOffSuccess).toBeUndefined();
      expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
    });

    it("derives L5 and L6 only through the accumulator and deriveModelEvidenceLevel", () => {
      const attempts = HEAT_AI_OFF_CHALLENGE_IDS.map((id, index) =>
        completeHeatAiOffAttempt(id, `t${index}`),
      );
      const session = heatSession({
        stage: LearningStage.AI_OFF,
        modelAttempts: [buildHeatModelAttempt(completeHeatModelInput("t"))],
        transferAttempts: [
          buildHeatTransferAttempt(completeHeatPotsTransferInput("t1")),
          buildHeatTransferAttempt(completeHeatIceTransferInput("t2")),
        ],
        independentAssessment: buildHeatAiOffAssessment(attempts, false),
      });
      const evidence = accumulateHeatSceneEvidence(session);
      expect(evidence.constructedValidCausalModel).toBe(true);
      expect(evidence.successfulTransfer).toBe(true);
      expect(evidence.independentAiOffSuccess).toBe(true);
      expect(deriveModelEvidenceLevel(evidence)).toBe("L6");
    });
  });
});
