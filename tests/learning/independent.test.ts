import { INDEPENDENT_EXAM_QUESTION } from "@/lib/content/independent-challenge";
import {
  isIndependentAssessmentReady,
  markIndependentAssessmentComplete,
} from "@/lib/learning/independent";
import {
  buildMicrowaveAiOffAssessment,
  completeMicrowaveAiOffAttempt,
  MICROWAVE_AI_OFF_ICE_ID,
  MICROWAVE_AI_OFF_SPOON_ID,
} from "@/lib/learning/microwave-ai-off";
import { canLeaveStage } from "@/lib/learning/progression";
import { createSession } from "@/lib/learning/session";
import { LearningStage } from "@/types/learning";
import { describe, expect, it } from "vitest";

describe("independent assessment", () => {
  it("is ready only after explanation and exam response exist", () => {
    expect(
      isIndependentAssessmentReady({
        explanation: "Energy entered the spoon so its temperature increased.",
        examResponses: {},
        completedWithoutAI: false,
      }),
    ).toBe(false);

    const ready = markIndependentAssessmentComplete({
      explanation: "Energy entered the spoon so its temperature increased.",
      examResponses: {
        [INDEPENDENT_EXAM_QUESTION.id]: INDEPENDENT_EXAM_QUESTION.correctAnswer,
      },
      completedWithoutAI: false,
    });

    expect(ready.completedWithoutAI).toBe(true);
  });

  it("reaches COMPLETE only after AI_OFF is finished", () => {
    const session = {
      ...createSession(),
      stage: LearningStage.AI_OFF,
    };

    expect(canLeaveStage(session, LearningStage.COMPLETE)).toBe(false);
    expect(
      canLeaveStage(
        {
          ...session,
          independentAssessment: {
            explanation: "Energy entered the spoon and its temperature increased.",
            examResponses: { [INDEPENDENT_EXAM_QUESTION.id]: "answer" },
            completedWithoutAI: true,
          },
        },
        LearningStage.COMPLETE,
      ),
    ).toBe(false);
    expect(
      canLeaveStage(
        {
          ...session,
          independentAssessment: buildMicrowaveAiOffAssessment(
            [
              completeMicrowaveAiOffAttempt(MICROWAVE_AI_OFF_SPOON_ID, "t1"),
              completeMicrowaveAiOffAttempt(MICROWAVE_AI_OFF_ICE_ID, "t2"),
            ],
            false,
          ),
        },
        LearningStage.COMPLETE,
      ),
    ).toBe(true);
  });
});
