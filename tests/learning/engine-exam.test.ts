import { describe, expect, it } from "vitest";

import { examPatterns } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/exam";
import { applyTutorGuardrails, looksLikeAnswerLeak } from "@/lib/ai/guardrails";
import { accumulateEngineSceneEvidence } from "@/lib/learning/engine-evidence";
import {
  ENGINE_EXAM_INTENDED_REPRESENTATION,
  ENGINE_EXAM_PATTERN_IDS,
  buildEngineExamAttempt,
  canCommitEngineExamAttempt,
  completeEngineExamInput,
  currentEngineExamPatternId,
  emptyEngineExamDraft,
  engineExamCognitiveActions,
  engineExamPattern,
  engineExamPatterns,
  evaluateEngineExamAttempt,
  hasCompletedEngineExam,
  hasStructuredEngineExamEvidence,
  intendedExamModel,
  isEngineExamSessionOpen,
  latestEngineExamDraft,
  looksLikeEngineExamAnswerLeak,
  nextEngineExamDraft,
  summarizeEngineExamAttempt,
} from "@/lib/learning/engine-exam";
import { createLearningEvent } from "@/lib/learning/events";
import { canLeaveStage } from "@/lib/learning/progression";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { LearningStage } from "@/types/learning";
import {
  completedEngineExamAttempts,
  examReadySession,
  transferReadySession,
} from "./engine-fixtures";
import {
  buildEngineTransferAttempt,
  completeEngineFullModelInput,
  completeEnginePartialTransferInput,
} from "@/lib/learning/engine-transfer";

const FIRST = ENGINE_EXAM_PATTERN_IDS[0];

describe("engine EXAM structured evaluation", () => {
  it("uses a representative subset of canonical examPatterns", () => {
    const patterns = engineExamPatterns();
    expect(patterns.map((item) => item.id)).toEqual([...ENGINE_EXAM_PATTERN_IDS]);
    for (const id of ENGINE_EXAM_PATTERN_IDS) {
      expect(examPatterns.some((item) => item.id === id)).toBe(true);
    }
    expect(new Set(ENGINE_EXAM_PATTERN_IDS).size).toBe(3);
  });

  it("keeps the selected subset in a stable order", () => {
    const first = emptyEngineExamDraft().patternIds;
    const second = emptyEngineExamDraft().patternIds;
    expect(first).toEqual([...ENGINE_EXAM_PATTERN_IDS]);
    expect(second).toEqual(first);
  });

  it("covers multiple cognitive actions without exposing them as the student task", () => {
    const actions = engineExamCognitiveActions();
    expect(actions.length).toBeGreaterThan(3);
    expect(actions).toEqual(expect.arrayContaining(["C4", "C5", "C7", "C14"]));
    expect(ENGINE_EXAM_INTENDED_REPRESENTATION[FIRST]).not.toMatch(/^C\d+$/);
  });

  it("does not treat an answer click as commitable without representation and model work", () => {
    const pattern = engineExamPattern(FIRST);
    expect(pattern).toBeTruthy();
    const incomplete = {
      patternId: FIRST,
      representation: "",
      modelRecognition: "",
      selectedAnswer: pattern?.correctAnswer ?? "",
      reasoning: "燃料的化学能经过转化才到机械能。",
      timestamp: "t",
    };
    expect(canCommitEngineExamAttempt(incomplete)).toBe(false);
    const attempt = buildEngineExamAttempt(incomplete);
    expect(attempt.selectedAnswer).toBe(pattern?.correctAnswer);
    expect(attempt.correct).toBe(true);
    expect(hasStructuredEngineExamEvidence(attempt)).toBe(false);
  });

  it("requires the model/relation step", () => {
    const pattern = engineExamPattern(FIRST);
    const input = {
      patternId: FIRST,
      representation: ENGINE_EXAM_INTENDED_REPRESENTATION[FIRST] ?? "",
      modelRecognition: "",
      selectedAnswer: pattern?.correctAnswer ?? "",
      reasoning: "燃料的化学能经过转化才到机械能。",
      timestamp: "t",
    };
    expect(canCommitEngineExamAttempt(input)).toBe(false);
  });

  it("stores selected answer separately from reasoning", () => {
    const attempt = buildEngineExamAttempt(completeEngineExamInput(FIRST, "t"));
    expect(attempt.selectedAnswer).toBe(engineExamPattern(FIRST)?.correctAnswer);
    expect(attempt.reasoning).toBeTruthy();
    expect(attempt.selectedAnswer).not.toBe(attempt.reasoning);
  });

  it("distinguishes a correct click from missing required reasoning", () => {
    const pattern = engineExamPattern(FIRST);
    const weak = evaluateEngineExamAttempt({
      patternId: FIRST,
      representation: ENGINE_EXAM_INTENDED_REPRESENTATION[FIRST] ?? "",
      modelRecognition: intendedExamModel(pattern!),
      selectedAnswer: pattern?.correctAnswer ?? "",
      reasoning: "我选这个。",
      timestamp: "t",
    });
    const strong = evaluateEngineExamAttempt(completeEngineExamInput(FIRST, "t"));
    expect(weak.correct).toBe(true);
    expect(weak.reasoningQuality).toBe("weak");
    expect(weak.reasoningSignals.addressesRequiredReasoning).toBe(false);
    expect(strong.correct).toBe(true);
    expect(strong.reasoningQuality).toBe("strong");
    expect(strong.reasoningSignals.addressesRequiredReasoning).toBe(true);
  });

  it("keeps a wrong attempt and does not erase it on retry", () => {
    const pattern = engineExamPattern(FIRST);
    const first = buildEngineExamAttempt({
      patternId: FIRST,
      representation: ENGINE_EXAM_INTENDED_REPRESENTATION[FIRST] ?? "",
      modelRecognition: intendedExamModel(pattern!),
      selectedAnswer: pattern?.options[1] ?? "wrong",
      reasoning: "因为这一步名字叫做功冲程。",
      timestamp: "t1",
    });
    const second = buildEngineExamAttempt(completeEngineExamInput(FIRST, "t2"));
    const attempts = [first, second];
    expect(first.correct).toBe(false);
    expect(attempts).toHaveLength(2);
    expect(attempts[0]?.selectedAnswer).toBe(pattern?.options[1]);
    expect(attempts[1]?.correct).toBe(true);
  });

  it("grades answer correctness from the canonical correctAnswer only", () => {
    const pattern = engineExamPattern(FIRST);
    const evaluation = evaluateEngineExamAttempt({
      patternId: FIRST,
      representation: "四个冲程的名字",
      modelRecognition: "做功冲程自己产生了能量",
      selectedAnswer: pattern?.correctAnswer ?? "",
      reasoning: "随便写两个字就行。",
      timestamp: "t",
    });
    expect(evaluation.correct).toBe(true);
    expect(evaluation.representationMatchesIntended).toBe(false);
    expect(evaluation.modelMatchesIntended).toBe(false);
  });

  it("does not let tutor text override official correctness", () => {
    const pattern = engineExamPattern(FIRST);
    const evaluation = evaluateEngineExamAttempt({
      patternId: FIRST,
      representation: ENGINE_EXAM_INTENDED_REPRESENTATION[FIRST] ?? "",
      modelRecognition: intendedExamModel(pattern!),
      selectedAnswer: pattern?.options[1] ?? "wrong",
      reasoning: "先回到题目里的条件。",
      timestamp: "t",
    });
    expect(evaluation.correct).toBe(false);
    expect(Object.keys(evaluation)).not.toContain("tutorMessage");
  });

  it("does not immediately reveal the correct option after a wrong attempt", () => {
    const pattern = engineExamPattern(FIRST);
    const attempt = buildEngineExamAttempt({
      patternId: FIRST,
      representation: ENGINE_EXAM_INTENDED_REPRESENTATION[FIRST] ?? "",
      modelRecognition: intendedExamModel(pattern!),
      selectedAnswer: pattern?.options[1] ?? "wrong",
      reasoning: "因为名字叫做功冲程。",
      timestamp: "t",
    });
    const feedback = summarizeEngineExamAttempt(attempt);
    expect(feedback).toContain("先回到题目里");
    expect(feedback).not.toContain(pattern?.correctAnswer ?? "MISSING");
  });

  it("completes after all representative items are attempted, not only when all are correct", () => {
    const pattern = engineExamPattern(FIRST);
    const attempts = ENGINE_EXAM_PATTERN_IDS.map((id, index) => {
      if (id !== FIRST) {
        return buildEngineExamAttempt(completeEngineExamInput(id, `t${index}`));
      }
      return buildEngineExamAttempt({
        patternId: id,
        representation: ENGINE_EXAM_INTENDED_REPRESENTATION[id] ?? "",
        modelRecognition: intendedExamModel(pattern!),
        selectedAnswer: pattern?.options[1] ?? "wrong",
        reasoning: "我先按名字来选。",
        timestamp: `t${index}`,
      });
    });
    expect(hasCompletedEngineExam(attempts)).toBe(true);
    expect(attempts.some((attempt) => attempt.correct === false)).toBe(true);
  });

  it("restores the current question and answers from the persisted draft", () => {
    const draft = {
      ...emptyEngineExamDraft(),
      currentPatternId: ENGINE_EXAM_PATTERN_IDS[1],
      step: "model" as const,
      representation: ENGINE_EXAM_INTENDED_REPRESENTATION[ENGINE_EXAM_PATTERN_IDS[1]] ?? "",
      modelRecognition: engineExamPattern(ENGINE_EXAM_PATTERN_IDS[1])
        ? intendedExamModel(engineExamPattern(ENGINE_EXAM_PATTERN_IDS[1])!)
        : "",
    };
    const restored = latestEngineExamDraft([
      createLearningEvent("student_response", LearningStage.EXAM, draft),
    ]);
    expect(restored?.currentPatternId).toBe(ENGINE_EXAM_PATTERN_IDS[1]);
    expect(restored?.patternIds).toEqual([...ENGINE_EXAM_PATTERN_IDS]);
    expect(restored?.representation).toBe(draft.representation);
    expect(restored?.modelRecognition).toBe(draft.modelRecognition);
  });

  it("does not reshuffle the selected subset when restoring a draft", () => {
    const customOrder = [
      ENGINE_EXAM_PATTERN_IDS[2],
      ENGINE_EXAM_PATTERN_IDS[0],
      ENGINE_EXAM_PATTERN_IDS[1],
    ];
    const restored = latestEngineExamDraft([
      createLearningEvent("student_response", LearningStage.EXAM, {
        ...emptyEngineExamDraft(customOrder),
        patternIds: customOrder,
      }),
    ]);
    expect(restored?.patternIds).toEqual(customOrder);
    expect(emptyEngineExamDraft().patternIds).toEqual([...ENGINE_EXAM_PATTERN_IDS]);
  });

  it("opens EXAM after valid TRANSFER and opens AI_OFF after EXAM", () => {
    const session = examReadySession();
    expect(canLeaveStage(session, LearningStage.AI_OFF)).toBe(false);
    const transferDone = {
      ...transferReadySession(),
      transferAttempts: [
        buildEngineTransferAttempt(completeEngineFullModelInput("t1")),
        buildEngineTransferAttempt(completeEnginePartialTransferInput("t2")),
      ],
    };
    expect(canLeaveStage(transferDone, LearningStage.EXAM)).toBe(true);
    const examDone = {
      ...session,
      examAttempts: completedEngineExamAttempts(),
    };
    expect(hasCompletedEngineExam(examDone.examAttempts)).toBe(true);
    expect(canLeaveStage(examDone, LearningStage.AI_OFF)).toBe(true);
  });

  it("does not create L6 from EXAM completion and keeps L5 transfer evidence", () => {
    const session = {
      ...examReadySession(),
      examAttempts: completedEngineExamAttempts(),
    };
    const accumulated = accumulateEngineSceneEvidence(session);
    expect(accumulated.successfulTransfer).toBe(true);
    expect(accumulated.independentAiOffSuccess).toBeUndefined();
    expect(accumulated.llmDisabledDuringIndependent).toBeUndefined();
    expect(deriveModelEvidenceLevel(accumulated)).toBe("L5");
    expect(JSON.stringify(session)).not.toContain('"L6"');
    expect(JSON.stringify(accumulated)).not.toContain("L6");
  });

  it("rejects tutor leaks that reveal the option before a committed answer", () => {
    const pattern = engineExamPattern(FIRST);
    expect(
      looksLikeAnswerLeak(
        LearningStage.EXAM,
        `正确答案是${pattern?.correctAnswer}`,
        "four-stroke-engine",
      ),
    ).toBe(true);
    expect(looksLikeEngineExamAnswerLeak(`应该选 ${pattern?.correctAnswer}`)).toBe(
      true,
    );
    expect(
      looksLikeAnswerLeak(
        LearningStage.EXAM,
        "先想题目在考哪条关系，再看条件。",
        "four-stroke-engine",
      ),
    ).toBe(false);
    const blocked = applyTutorGuardrails(
      {
        action: "HINT",
        message: pattern?.correctAnswer ?? "正确答案是 A",
        cognitiveGoal: "exam",
        revealsAnswer: false,
        misconceptionDetected: null,
        confidence: "high",
        suggestedNextStage: null,
      },
      LearningStage.EXAM,
      "four-stroke-engine",
    );
    expect(blocked.message).not.toContain(pattern?.correctAnswer ?? "MISSING");
  });

  it("does not treat exam energy vocabulary alone as a leak", () => {
    expect(
      looksLikeAnswerLeak(
        LearningStage.EXAM,
        "可以想想化学能是怎样到机械能的。",
        "four-stroke-engine",
      ),
    ).toBe(false);
  });

  it("moves to the next item after a committed attempt that cannot be retried", () => {
    const firstAttempt = buildEngineExamAttempt(completeEngineExamInput(FIRST, "t1"));
    const draft = nextEngineExamDraft(
      [firstAttempt],
      emptyEngineExamDraft(),
      FIRST,
    );
    expect(draft.currentPatternId).toBe(ENGINE_EXAM_PATTERN_IDS[1]);
    expect(
      currentEngineExamPatternId([firstAttempt], draft),
    ).toBe(ENGINE_EXAM_PATTERN_IDS[1]);
    expect(isEngineExamSessionOpen([firstAttempt], draft)).toBe(true);
  });
});
