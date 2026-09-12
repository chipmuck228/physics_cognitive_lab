import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { independentChallenges } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/independent-challenges";
import { accumulateEngineSceneEvidence } from "@/lib/learning/engine-evidence";
import {
  applyEngineAiOffPostCheck,
  buildEngineAiOffAttempt,
  buildEngineAiOffAssessment,
  completeEngineAiOffAttempt,
  completeEngineAiOffInput,
  ENGINE_AI_OFF_CHALLENGE_IDS,
  engineAiOffChallenge,
  engineAiOffChallenges,
  evaluateEngineAiOffAttempt,
  hasAcceptedEngineAiOffChallenges,
  hasCompletedEngineAiOff,
  hasMeaningfulIndependentReasoning,
  intendedAiOffAnswerId,
  intendedAiOffPostCheckIds,
} from "@/lib/learning/engine-ai-off";
import { createLearningEvent } from "@/lib/learning/events";
import { canLeaveStage } from "@/lib/learning/progression";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { LearningStage } from "@/types/learning";
import { aiOffReadySession, examReadySession, completedEngineExamAttempts } from "./engine-fixtures";

const PISTON = ENGINE_AI_OFF_CHALLENGE_IDS[0];
const LOCKED = ENGINE_AI_OFF_CHALLENGE_IDS[1];

describe("Scene 02 AI_OFF evaluation", () => {
  it("loads both challenges from the canonical Physics Model", () => {
    const challenges = engineAiOffChallenges();
    expect(challenges.map((item) => item.id)).toEqual([...ENGINE_AI_OFF_CHALLENGE_IDS]);
    expect(independentChallenges.map((item) => item.id)).toEqual(
      [...ENGINE_AI_OFF_CHALLENGE_IDS],
    );
    expect(engineAiOffChallenge(PISTON).llmAllowed).toBe(false);
    expect(engineAiOffChallenge(LOCKED).llmAllowed).toBe(false);
    expect(engineAiOffChallenge(PISTON).question).toContain("能量是从哪里来的");
    expect(engineAiOffChallenge(LOCKED).question).toContain("输出机械能");
  });

  it("does not treat short or empty reasoning as independent evidence", () => {
    expect(hasMeaningfulIndependentReasoning("")).toBe(false);
    expect(hasMeaningfulIndependentReasoning("因为")).toBe(false);
    expect(hasMeaningfulIndependentReasoning("刀具转了。")).toBe(false);
    expect(
      hasMeaningfulIndependentReasoning(
        "燃料燃烧后气体先发生变化，再推动可以运动的部分。",
      ),
    ).toBe(true);
  });

  it("cannot pass on a correct answer alone", () => {
    const evaluation = evaluateEngineAiOffAttempt({
      challengeId: PISTON,
      selectedAnswer: intendedAiOffAnswerId(PISTON),
      studentReasoning:
        "燃料燃烧后气体先发生变化，再推动可以运动的部分，刀具才转起来。",
      postCheckIds: [],
      llmUsed: false,
    });
    expect(evaluation.answerCorrect).toBe(true);
    expect(evaluation.accepted).toBe(false);
    expect(evaluation.reasoningSignals.postCheckMatchesRequired).toBe(false);
  });

  it("accepts valid independent causal reasoning for the unfamiliar piston challenge", () => {
    const input = completeEngineAiOffInput(PISTON, "t1");
    const evaluation = evaluateEngineAiOffAttempt({
      ...input,
      llmUsed: false,
    });
    expect(evaluation.answerCorrect).toBe(true);
    expect(evaluation.accepted).toBe(true);
    expect(evaluation.reasoningSignals.identifiesWorkRelation).toBe(true);
    expect(evaluation.reasoningSignals.avoidsDirectCombustionToMotion).toBe(true);
  });

  it("rejects direct combustion-to-motion reasoning on challenge 1", () => {
    const evaluation = evaluateEngineAiOffAttempt({
      challengeId: PISTON,
      selectedAnswer: intendedAiOffAnswerId(PISTON),
      studentReasoning: "燃烧直接让机械转起来，所以刀具会动。",
      postCheckIds: intendedAiOffPostCheckIds(PISTON),
      llmUsed: false,
    });
    expect(evaluation.accepted).toBe(false);
    expect(evaluation.reasoningSignals.avoidsDirectCombustionToMotion).toBe(false);
  });

  it("rejects missing work or mechanical-interaction evidence on challenge 1", () => {
    const required = intendedAiOffPostCheckIds(PISTON).filter(
      (id) => id !== "identifiesWorkProcess",
    );
    const evaluation = evaluateEngineAiOffAttempt({
      challengeId: PISTON,
      selectedAnswer: intendedAiOffAnswerId(PISTON),
      studentReasoning:
        "燃料里有能量，气体变了，刀具就转了，中间没有做功这一步。",
      postCheckIds: required,
      llmUsed: false,
    });
    expect(evaluation.accepted).toBe(false);
    expect(evaluation.reasoningSignals.identifiesWorkRelation).toBe(false);
  });

  it("accepts locked-mechanism reasoning that combustion can occur while output fails", () => {
    const input = completeEngineAiOffInput(LOCKED, "t2");
    const evaluation = evaluateEngineAiOffAttempt({
      ...input,
      llmUsed: false,
    });
    expect(evaluation.accepted).toBe(true);
    expect(evaluation.reasoningSignals.identifiesConditionOrBoundary).toBe(true);
  });

  it("rejects equating combustion with guaranteed output on challenge 2", () => {
    const evaluation = evaluateEngineAiOffAttempt({
      challengeId: LOCKED,
      selectedAnswer: "combustion-guarantees-output",
      studentReasoning: "燃烧了所以一定有机械能输出，气体变热就够了。",
      postCheckIds: intendedAiOffPostCheckIds(LOCKED),
      llmUsed: false,
    });
    expect(evaluation.answerCorrect).toBe(false);
    expect(evaluation.accepted).toBe(false);
  });

  it("requires condition or boundary reasoning on challenge 2", () => {
    const withoutCondition = intendedAiOffPostCheckIds(LOCKED).filter(
      (id) => id !== "checksNecessaryConditions",
    );
    const evaluation = evaluateEngineAiOffAttempt({
      challengeId: LOCKED,
      selectedAnswer: intendedAiOffAnswerId(LOCKED),
      studentReasoning: "燃烧可以发生，气体也会变热，但机械卡住后没法做功，所以不能按原来方式输出。",
      postCheckIds: withoutCondition,
      llmUsed: false,
    });
    expect(evaluation.accepted).toBe(false);
    expect(evaluation.reasoningSignals.preCommitConditionOrBoundary).toBe(true);
    expect(evaluation.reasoningSignals.identifiesConditionOrBoundary).toBe(true);
    expect(evaluation.reasoningSignals.postCheckMatchesRequired).toBe(false);
  });

  it("keeps the original committed response when a post-check is attached", () => {
    const first = buildEngineAiOffAttempt(
      {
        challengeId: PISTON,
        selectedAnswer: intendedAiOffAnswerId(PISTON),
        studentReasoning: "燃料燃烧后气体先发生变化，再推动可以运动的部分，刀具才转起来。",
        timestamp: "t1",
      },
      [],
      false,
    );
    const next = applyEngineAiOffPostCheck(
      first,
      intendedAiOffPostCheckIds(PISTON),
      false,
    );
    expect(next.selectedAnswer).toBe(first.selectedAnswer);
    expect(next.studentReasoning).toBe(first.studentReasoning);
    expect(next.accepted).toBe(true);
    expect(first.postCheckIds).toEqual([]);
    expect(first.accepted).toBe(false);
  });

  it("retains the original attempt after a later retry", () => {
    const first = buildEngineAiOffAttempt(
      {
        challengeId: PISTON,
        selectedAnswer: "combustion-turns-cutter",
        studentReasoning: "燃烧直接让刀具转起来，所以它会动。",
        timestamp: "t1",
      },
      intendedAiOffPostCheckIds(PISTON),
      false,
    );
    const second = completeEngineAiOffAttempt(PISTON, "t2");
    const attempts = [first, second];
    expect(attempts[0]?.selectedAnswer).toBe("combustion-turns-cutter");
    expect(attempts[0]?.accepted).toBe(false);
    expect(attempts[1]?.accepted).toBe(true);
  });

  it("blocks independent success when llmUsed is not false", () => {
    const evaluation = evaluateEngineAiOffAttempt({
      ...completeEngineAiOffInput(PISTON, "t1"),
      llmUsed: true,
    });
    expect(evaluation.accepted).toBe(false);
    const assessment = buildEngineAiOffAssessment(
      [
        completeEngineAiOffAttempt(PISTON, "t1"),
        completeEngineAiOffAttempt(LOCKED, "t2"),
      ],
      true,
    );
    expect(assessment.completedWithoutAI).toBe(false);
    expect(assessment.llmUsed).toBe(true);
    expect(hasAcceptedEngineAiOffChallenges(assessment)).toBe(true);
    const session = {
      ...aiOffReadySession(),
      independentAssessment: assessment,
    };
    expect(hasCompletedEngineAiOff(session)).toBe(false);
    const accumulated = accumulateEngineSceneEvidence(session);
    expect(accumulated.independentAiOffSuccess).toBeUndefined();
    expect(deriveModelEvidenceLevel(accumulated)).toBe("L5");
  });

  it("does not derive L6 from EXAM completion alone", () => {
    const session = {
      ...examReadySession(),
      examAttempts: completedEngineExamAttempts(),
    };
    const accumulated = accumulateEngineSceneEvidence(session);
    expect(accumulated.independentAiOffSuccess).toBeUndefined();
    expect(deriveModelEvidenceLevel(accumulated)).toBe("L5");
  });

  it("does not derive L6 from AI_OFF answer correctness alone", () => {
    const session = {
      ...aiOffReadySession(),
      independentAssessment: buildEngineAiOffAssessment(
        [
          buildEngineAiOffAttempt(
            {
              challengeId: PISTON,
              selectedAnswer: intendedAiOffAnswerId(PISTON),
              studentReasoning:
                "燃料燃烧后气体先发生变化，再推动可以运动的部分，刀具才转起来。",
              timestamp: "t1",
            },
            [],
            false,
          ),
          buildEngineAiOffAttempt(
            {
              challengeId: LOCKED,
              selectedAnswer: intendedAiOffAnswerId(LOCKED),
              studentReasoning:
                "燃烧可以发生，气体也会变热，但机械卡住后没法做功，所以不能按原来方式输出。",
              timestamp: "t2",
            },
            [],
            false,
          ),
        ],
        false,
      ),
    };
    const accumulated = accumulateEngineSceneEvidence(session);
    expect(hasCompletedEngineAiOff(session)).toBe(false);
    expect(accumulated.independentAiOffSuccess).toBeUndefined();
    expect(deriveModelEvidenceLevel(accumulated)).toBe("L5");
  });

  it("may derive L6 from valid prior L5 plus accepted AI_OFF evidence", () => {
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
    expect(hasCompletedEngineAiOff(session)).toBe(true);
    expect(accumulated.independentAiOffSuccess).toBe(true);
    expect(accumulated.llmDisabledDuringIndependent).toBe(true);
    expect(deriveModelEvidenceLevel(accumulated)).toBe("L6");
    expect(JSON.stringify(session)).not.toContain('"L6"');
    expect(JSON.stringify(accumulated)).not.toContain("L6");
  });

  it("never writes L6 in Scene AI_OFF or evidence accumulation source", () => {
    expect(readFileSync("lib/learning/engine-ai-off.ts", "utf8")).not.toMatch(/["']L6["']/);
    expect(readFileSync("lib/learning/engine-evidence.ts", "utf8")).not.toMatch(/["']L6["']/);
    expect(
      readFileSync("components/learning/FourStrokeEngineLab.tsx", "utf8"),
    ).not.toMatch(/["']L6["']/);
    expect(
      readFileSync("components/learning/EngineCompleteView.tsx", "utf8"),
    ).not.toMatch(/L6|evidenceLevel|transferMode|C1|C14/);
  });

  it("opens AI_OFF after EXAM and waits for independent evidence before COMPLETE", () => {
    const examDone = {
      ...examReadySession(),
      examAttempts: completedEngineExamAttempts(),
    };
    expect(canLeaveStage(examDone, LearningStage.AI_OFF)).toBe(true);
    const aiOff = aiOffReadySession();
    expect(canLeaveStage(aiOff, LearningStage.COMPLETE)).toBe(false);
    const completeReady = {
      ...aiOff,
      independentAssessment: buildEngineAiOffAssessment(
        [
          completeEngineAiOffAttempt(PISTON, "t1"),
          completeEngineAiOffAttempt(LOCKED, "t2"),
        ],
        false,
      ),
    };
    expect(canLeaveStage(completeReady, LearningStage.COMPLETE)).toBe(true);
    expect(
      canLeaveStage(
        { ...completeReady, stage: LearningStage.COMPLETE, completed: true },
        LearningStage.AI_OFF,
      ),
    ).toBe(false);
  });

  it("treats tutor events during AI_OFF as independent-success blockers", () => {
    const session = {
      ...aiOffReadySession(),
      independentAssessment: buildEngineAiOffAssessment(
        [
          completeEngineAiOffAttempt(PISTON, "t1"),
          completeEngineAiOffAttempt(LOCKED, "t2"),
        ],
        false,
      ),
      events: [
        ...aiOffReadySession().events,
        createLearningEvent("ai_interaction", LearningStage.AI_OFF, {
          source: "hidden",
        }),
      ],
    };
    expect(hasCompletedEngineAiOff(session)).toBe(false);
    expect(accumulateEngineSceneEvidence(session).independentAiOffSuccess).toBeUndefined();
  });
});
