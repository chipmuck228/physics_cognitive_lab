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
    return "你选的答案站得住，理由里也用到了关键关系。";
  }

  if (attempt.correct) {
    return "答案选对了。理由可以再写清楚一点：到底是哪种关系在起作用。";
  }

  return "这里有一个地方值得再想一想。再对照题目条件和你刚才连起来的想法。";
}

const CONCEPT_TERMS: Record<string, string[]> = {
  temperature: ["temperature", "温度"],
  "internal energy": ["internal energy", "内能"],
  "energy transfer": ["energy transfer", "能量传递", "热传递", "能量转移"],
  conditions: ["conditions", "条件", "一定"],
  mechanism: ["mechanism", "方式", "怎样进入"],
  "temperature difference": ["temperature difference", "温度差"],
  direction: ["direction", "方向"],
  "specific heat capacity": ["specific heat capacity", "比热容"],
  "controlled variables": ["controlled variables", "质量相同", "保持不变"],
  "quantitative reasoning": ["quantitative reasoning", "比较", "两倍"],
};

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
    (CONCEPT_TERMS[concept] ?? [concept]).some((term) =>
      normalized.includes(term.toLowerCase()),
    ),
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
