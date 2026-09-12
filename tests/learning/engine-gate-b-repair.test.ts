import { describe, expect, it } from "vitest";

import { accumulateEngineSceneEvidence } from "@/lib/learning/engine-evidence";
import {
  applyEngineAiOffPostCheck,
  buildEngineAiOffAssessment,
  buildEngineAiOffAttempt,
  completeEngineAiOffAttempt,
  completeEngineAiOffInput,
  ENGINE_AI_OFF_CHALLENGE_IDS,
  evaluateEngineAiOffAttempt,
  intendedAiOffAnswerId,
  intendedAiOffPostCheckIds,
} from "@/lib/learning/engine-ai-off";
import {
  ENGINE_TRANSFER_RELATION_IDS,
  ENGINE_TRANSFER_TARGET_IDS,
  buildEngineTransferAttempt,
  completeEngineFullModelInput,
  completeEnginePartialTransferInput,
  emptyEngineTransferJudgments,
  evaluateEngineTransfer,
} from "@/lib/learning/engine-transfer";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { aiOffReadySession } from "./engine-fixtures";

const CHEMICAL = ENGINE_TRANSFER_RELATION_IDS.chemicalToInternal;
const WORK = ENGINE_TRANSFER_RELATION_IDS.internalToWork;
const MECHANICAL = ENGINE_TRANSFER_RELATION_IDS.systemToMechanical;
const PISTON = ENGINE_AI_OFF_CHALLENGE_IDS[0];
const LOCKED = ENGINE_AI_OFF_CHALLENGE_IDS[1];

function steamStructured(explanation: string) {
  return {
    targetId: ENGINE_TRANSFER_TARGET_IDS.steam,
    judgments: {
      [CHEMICAL]: "not-necessarily" as const,
      [WORK]: "applies" as const,
      [MECHANICAL]: "applies" as const,
    },
    relationOrder: [WORK, MECHANICAL],
    surfaceCueSelected: false,
    studentExplanation: explanation,
    timestamp: "t",
  };
}

describe("Scene 02 Gate B evidence repair", () => {
  describe("TRANSFER steam partial-structure authorship", () => {
    it("rejects 化学能 alone", () => {
      const result = evaluateEngineTransfer(steamStructured("化学能"));
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toEqual(
        expect.arrayContaining(["generic-boundary-talk", "missing-boundary"]),
      );
    });

    it("rejects 来源 alone", () => {
      const result = evaluateEngineTransfer(steamStructured("来源"));
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toEqual(
        expect.arrayContaining(["generic-boundary-talk", "missing-boundary"]),
      );
    });

    it("rejects 不一定 alone", () => {
      const result = evaluateEngineTransfer(steamStructured("不一定"));
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toEqual(
        expect.arrayContaining(["generic-boundary-talk", "missing-boundary"]),
      );
    });

    it("rejects 好好", () => {
      const result = evaluateEngineTransfer(steamStructured("好好"));
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("generic-boundary-talk");
    });

    it("rejects 情况不一样", () => {
      const result = evaluateEngineTransfer(steamStructured("情况不一样"));
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("generic-boundary-talk");
    });

    it("rejects generic noun/token combinations", () => {
      const result = evaluateEngineTransfer(
        steamStructured("化学能内能做功机械能"),
      );
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("keyword-sandwich");
    });

    it("rejects blind full-model transfer", () => {
      const result = evaluateEngineTransfer({
        targetId: ENGINE_TRANSFER_TARGET_IDS.steam,
        judgments: {
          [CHEMICAL]: "applies",
          [WORK]: "applies",
          [MECHANICAL]: "applies",
        },
        relationOrder: [CHEMICAL, WORK, MECHANICAL],
        surfaceCueSelected: false,
        studentExplanation: "后面的关系还可以用，但前面的能量来源不一定相同。",
        timestamp: "t",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("blind-full-model");
    });

    it("rejects transferable structure without boundary distinction", () => {
      const result = evaluateEngineTransfer(
        steamStructured("气体变化后还能做功，机械部分还能得到运动。"),
      );
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("missing-boundary");
    });

    it("rejects boundary distinction without transferable structure", () => {
      const result = evaluateEngineTransfer({
        targetId: ENGINE_TRANSFER_TARGET_IDS.steam,
        judgments: {
          [CHEMICAL]: "not-necessarily",
          [WORK]: "",
          [MECHANICAL]: "",
        },
        relationOrder: [],
        surfaceCueSelected: false,
        studentExplanation: "前面的化学能不能直接搬过来。",
        timestamp: "t",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toEqual(
        expect.arrayContaining([
          "missing-work",
          "missing-transferable-authorship",
        ]),
      );
    });

    it("accepts explicit transferable plus non-transferable structural reasoning", () => {
      const result = evaluateEngineTransfer(completeEnginePartialTransferInput("t"));
      expect(result.accepted).toBe(true);
      expect(result.failureKinds).toEqual([]);
    });
  });

  describe("TRANSFER motorcycle full-model", () => {
    it("rejects surface recognition alone", () => {
      const result = evaluateEngineTransfer({
        targetId: ENGINE_TRANSFER_TARGET_IDS.motorcycle,
        judgments: emptyEngineTransferJudgments(),
        relationOrder: [],
        surfaceCueSelected: true,
        studentExplanation: "都有活塞，所以是同一个模型。",
        timestamp: "t",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("surface-cue");
    });

    it("accepts valid full-model structural transfer", () => {
      const result = evaluateEngineTransfer(completeEngineFullModelInput("t"));
      expect(result.accepted).toBe(true);
      expect(result.failureKinds).toEqual([]);
    });
  });

  describe("AI_OFF provenance", () => {
    const pistonChecks = intendedAiOffPostCheckIds(PISTON);
    const lockedChecks = intendedAiOffPostCheckIds(LOCKED);

    it("rejects generic piston text plus correct post-checks", () => {
      const result = evaluateEngineAiOffAttempt({
        challengeId: PISTON,
        selectedAnswer: intendedAiOffAnswerId(PISTON),
        studentReasoning: "我觉得这样不太对吧。",
        postCheckIds: pistonChecks,
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
      expect(result.reasoningSignals.preCommitWorkRelation).toBe(false);
      expect(result.reasoningSignals.identifiesWorkRelation).toBe(false);
      expect(result.reasoningSignals.postCheckWorkRelation).toBe(true);
    });

    it("rejects generic locked text plus correct condition checkboxes", () => {
      const result = evaluateEngineAiOffAttempt({
        challengeId: LOCKED,
        selectedAnswer: intendedAiOffAnswerId(LOCKED),
        studentReasoning: "装置看起来和平时不太一样。",
        postCheckIds: lockedChecks,
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
      expect(result.reasoningSignals.preCommitConditionOrBoundary).toBe(false);
      expect(result.reasoningSignals.identifiesConditionOrBoundary).toBe(false);
      expect(result.reasoningSignals.postCheckConditionOrBoundary).toBe(true);
    });

    it("rejects answer-only", () => {
      const result = evaluateEngineAiOffAttempt({
        challengeId: PISTON,
        selectedAnswer: intendedAiOffAnswerId(PISTON),
        studentReasoning: "",
        postCheckIds: pistonChecks,
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
      expect(result.reasoningSignals.hasOwnWords).toBe(false);
    });

    it("rejects post-check-only work relation", () => {
      const result = evaluateEngineAiOffAttempt({
        challengeId: PISTON,
        selectedAnswer: intendedAiOffAnswerId(PISTON),
        studentReasoning: "我觉得这样不太对吧。",
        postCheckIds: pistonChecks,
        llmUsed: false,
      });
      expect(result.reasoningSignals.postCheckWorkRelation).toBe(true);
      expect(result.reasoningSignals.identifiesWorkRelation).toBe(false);
      expect(result.accepted).toBe(false);
    });

    it("rejects post-check-only condition/boundary", () => {
      const result = evaluateEngineAiOffAttempt({
        challengeId: LOCKED,
        selectedAnswer: intendedAiOffAnswerId(LOCKED),
        studentReasoning: "装置看起来和平时不太一样。",
        postCheckIds: lockedChecks,
        llmUsed: false,
      });
      expect(result.reasoningSignals.postCheckConditionOrBoundary).toBe(true);
      expect(result.reasoningSignals.identifiesConditionOrBoundary).toBe(false);
      expect(result.accepted).toBe(false);
    });

    it("does not let post-checks manufacture missing pre-commit reasoning", () => {
      const committed = buildEngineAiOffAttempt(
        {
          challengeId: PISTON,
          selectedAnswer: intendedAiOffAnswerId(PISTON),
          studentReasoning: "我觉得这样不太对吧。",
          timestamp: "t",
        },
        [],
        false,
      );
      const after = applyEngineAiOffPostCheck(committed, pistonChecks, false);
      expect(after.studentReasoning).toBe(committed.studentReasoning);
      expect(after.accepted).toBe(false);
      expect(after.reasoningSignals.preCommitWorkRelation).toBe(false);
      expect(after.reasoningSignals.identifiesWorkRelation).toBe(false);
      expect(after.reasoningSignals.postCheckWorkRelation).toBe(true);
    });

    it("accepts genuine committed work-relation reasoning plus required checks", () => {
      const result = evaluateEngineAiOffAttempt({
        ...completeEngineAiOffInput(PISTON, "t"),
        llmUsed: false,
      });
      expect(result.accepted).toBe(true);
      expect(result.reasoningSignals.preCommitWorkRelation).toBe(true);
      expect(result.reasoningSignals.identifiesWorkRelation).toBe(true);
    });

    it("accepts genuine committed condition/boundary reasoning plus required checks", () => {
      const result = evaluateEngineAiOffAttempt({
        ...completeEngineAiOffInput(LOCKED, "t"),
        llmUsed: false,
      });
      expect(result.accepted).toBe(true);
      expect(result.reasoningSignals.preCommitConditionOrBoundary).toBe(true);
      expect(result.reasoningSignals.identifiesConditionOrBoundary).toBe(true);
    });

    it("accepts the required complete independent path", () => {
      const session = {
        ...aiOffReadySession(),
        independentAssessment: buildEngineAiOffAssessment(
          [
            completeEngineAiOffAttempt(PISTON, "t1"),
            completeEngineAiOffAttempt(LOCKED, "t2"),
          ],
          false,
        ),
      };
      const accumulated = accumulateEngineSceneEvidence(session);
      expect(accumulated.independentAiOffSuccess).toBe(true);
      expect(accumulated.llmDisabledDuringIndependent).toBe(true);
      expect(deriveModelEvidenceLevel(accumulated)).toBe("L6");
    });

    it("fails when llmUsed is not false", () => {
      const result = evaluateEngineAiOffAttempt({
        ...completeEngineAiOffInput(PISTON, "t"),
        llmUsed: true,
      });
      expect(result.accepted).toBe(false);
    });
  });

  describe("L-level path after repair", () => {
    it("does not derive L5 from steam token-level authorship", () => {
      const session = {
        ...aiOffReadySession(),
        transferAttempts: [
          buildEngineTransferAttempt(completeEngineFullModelInput("t1")),
          buildEngineTransferAttempt(steamStructured("化学能")),
        ],
        independentAssessment: undefined,
      };
      const accumulated = accumulateEngineSceneEvidence(session);
      expect(accumulated.successfulTransfer).toBe(false);
      expect(deriveModelEvidenceLevel(accumulated)).toBe("L4");
    });

    it("does not derive L6 from generic AI_OFF plus post-checks", () => {
      const session = {
        ...aiOffReadySession(),
        independentAssessment: buildEngineAiOffAssessment(
          [
            applyEngineAiOffPostCheck(
              buildEngineAiOffAttempt(
                {
                  challengeId: PISTON,
                  selectedAnswer: intendedAiOffAnswerId(PISTON),
                  studentReasoning: "我觉得这样不太对吧。",
                  timestamp: "t1",
                },
                [],
                false,
              ),
              intendedAiOffPostCheckIds(PISTON),
              false,
            ),
            applyEngineAiOffPostCheck(
              buildEngineAiOffAttempt(
                {
                  challengeId: LOCKED,
                  selectedAnswer: intendedAiOffAnswerId(LOCKED),
                  studentReasoning: "装置看起来和平时不太一样。",
                  timestamp: "t2",
                },
                [],
                false,
              ),
              intendedAiOffPostCheckIds(LOCKED),
              false,
            ),
          ],
          false,
        ),
      };
      const accumulated = accumulateEngineSceneEvidence(session);
      expect(accumulated.independentAiOffSuccess).toBeUndefined();
      expect(deriveModelEvidenceLevel(accumulated)).toBe("L5");
    });
  });
});
