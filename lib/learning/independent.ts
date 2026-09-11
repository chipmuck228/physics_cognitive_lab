import { INDEPENDENT_EXAM_QUESTION } from "@/lib/content/independent-challenge";
import { classifyExplanationLevel } from "@/lib/learning/explanation";
import type { IndependentAssessment } from "@/types/learning";

export function hasCompletedIndependentAssessment(
  assessment: IndependentAssessment | undefined,
): boolean {
  return Boolean(assessment?.completedWithoutAI);
}

export function isIndependentAssessmentReady(
  assessment: IndependentAssessment | undefined,
): boolean {
  if (!assessment) {
    return false;
  }

  return (
    assessment.explanation.trim().length > 0 &&
    Boolean(assessment.examResponses[INDEPENDENT_EXAM_QUESTION.id])
  );
}

export function markIndependentAssessmentComplete(
  assessment: IndependentAssessment,
): IndependentAssessment {
  return {
    ...assessment,
    completedWithoutAI: isIndependentAssessmentReady(assessment),
  };
}

export function independentExplanationUsesModel(text: string): boolean {
  return classifyExplanationLevel(text) >= 2;
}
