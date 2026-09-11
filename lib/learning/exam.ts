import {
  REQUIRED_EXAM_QUESTION_IDS,
  type ExamQuestionDefinition,
} from "@/lib/content/exam-questions";
import type { ExamAttempt } from "@/types/learning";

export function evaluateExamAttempt(input: {
  question: ExamQuestionDefinition;
  representation: string[];
  modelFocus: string;
  selectedAnswer: string;
  reasoning: string;
}): Pick<ExamAttempt, "correct" | "reasoningQuality"> {
  const correct = input.selectedAnswer === input.question.correctAnswer;
  const reasoningQuality = classifyReasoningQuality({
    reasoning: input.reasoning,
    targetConcepts: input.question.targetConcepts,
    correct,
  });

  return {
    correct,
    reasoningQuality,
  };
}

export function hasCompletedExamSet(attempts: ExamAttempt[]): boolean {
  return REQUIRED_EXAM_QUESTION_IDS.every((id) => {
    const attempt = attempts.find((item) => item.questionId === id);
    if (!attempt) {
      return false;
    }

    const representation = attempt.representation ?? [];
    const modelRecognition = attempt.modelRecognition ?? attempt.modelFocus ?? "";
    const reasoning = attempt.reasoning?.trim() ?? "";

    return (
      representation.length > 0 &&
      modelRecognition.length > 0 &&
      Boolean(attempt.selectedAnswer) &&
      reasoning.length >= 8
    );
  });
}

export function summarizeExamAttempt(
  attempt: Pick<ExamAttempt, "correct" | "reasoningQuality">,
): string {
  if (attempt.correct && attempt.reasoningQuality === "strong") {
    return "You chose an answer supported by the model and your reason used the key physics ideas.";
  }

  if (attempt.correct) {
    return "You chose the supported answer. Strengthen the reason by naming the physics relationship more clearly.";
  }

  return "This answer does not match the model yet. Recheck the physical relationship and the conditions in the question.";
}

function classifyReasoningQuality(input: {
  reasoning: string;
  targetConcepts: string[];
  correct: boolean;
}): "weak" | "adequate" | "strong" {
  const normalized = normalize(input.reasoning);
  if (normalized.length < 8) {
    return "weak";
  }

  const conceptMatches = input.targetConcepts.filter((concept) =>
    normalized.includes(concept.toLowerCase()),
  ).length;

  if (input.correct && conceptMatches >= 2 && normalized.length >= 28) {
    return "strong";
  }

  if ((input.correct && normalized.length >= 14) || conceptMatches >= 1) {
    return "adequate";
  }

  return "weak";
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}
