import { describe, expect, it } from "vitest";

import { EXAM_QUESTIONS } from "@/lib/content/exam-questions";
import {
  evaluateExamAttempt,
  hasCompletedExamSet,
  summarizeExamAttempt,
} from "@/lib/learning/exam";

describe("exam evaluation", () => {
  it("marks the correct answer and recognizes stronger reasoning", () => {
    const question = EXAM_QUESTIONS[0];
    const result = evaluateExamAttempt({
      question,
      representation: ["internal energy"],
      modelFocus:
        "energy enters -> internal energy changes -> temperature increases",
      selectedAnswer: question.correctAnswer,
      reasoning:
        "The temperature increased because energy entered the bread and its internal energy increased.",
    });

    expect(result.correct).toBe(true);
    expect(result.reasoningQuality).toBe("strong");
  });

  it("marks weak or incorrect attempts safely", () => {
    const question = EXAM_QUESTIONS[1];
    const result = evaluateExamAttempt({
      question,
      representation: ["temperature"],
      modelFocus: "assume temperature and internal energy are interchangeable",
      selectedAnswer: question.options[0],
      reasoning: "It is hotter.",
    });

    expect(result.correct).toBe(false);
    expect(result.reasoningQuality).toBe("weak");
    expect(summarizeExamAttempt(result)).toContain("值得再想");
  });

  it("requires the whole curated set before EXAM is complete", () => {
    expect(
      hasCompletedExamSet([
        {
          questionId: EXAM_QUESTIONS[0].id,
          representation: ["internal energy"],
          modelRecognition:
            "energy enters -> internal energy changes -> temperature increases",
          selectedAnswer: EXAM_QUESTIONS[0].correctAnswer,
          reasoning: "Because energy and internal energy changed.",
          correct: true,
          correctness: true,
          reasoningQuality: "adequate",
          timestamp: "t",
        },
      ]),
    ).toBe(false);

    expect(
      hasCompletedExamSet(
        EXAM_QUESTIONS.map((question) => ({
          questionId: question.id,
          selectedAnswer: question.correctAnswer,
          timestamp: "t",
        })),
      ),
    ).toBe(false);

    expect(
      hasCompletedExamSet(
        EXAM_QUESTIONS.map((question) => ({
          questionId: question.id,
          representation: [question.representationOptions[0]],
          modelRecognition: question.modelOptions[0],
          selectedAnswer: question.correctAnswer,
          reasoning: "A saved response.",
          correct: true,
          correctness: true,
          reasoningQuality: "adequate" as const,
          timestamp: "t",
        })),
      ),
    ).toBe(true);
  });
});
