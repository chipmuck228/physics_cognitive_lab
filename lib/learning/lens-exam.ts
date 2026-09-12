import { convexLensImagingAssessmentOverlay } from "@/content/physics-models/convex-lens-imaging/assessment-overlay";
import { examPatterns } from "@/content/physics-models/convex-lens-imaging/exam";
import { PRODUCTION_EXAM_PATTERN_IDS } from "@/content/physics-models/convex-lens-imaging/implementation-contract";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExamAttempt } from "@/types/learning";
import type { ExamPattern } from "@/types/physics-model";

export const LENS_EXAM_PATTERN_IDS = [...PRODUCTION_EXAM_PATTERN_IDS] as const;
export const LENS_EXAM_MAX_ATTEMPTS_PER_ITEM = 2;
export const LENS_EXAM_DRAFT_KIND = "lens-exam-draft";

export type LensExamStep = "representation" | "model" | "answer";

export interface LensExamDraft {
  kind: typeof LENS_EXAM_DRAFT_KIND;
  patternIds: string[];
  currentPatternId: string;
  step: LensExamStep;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  retiredPatternIds: string[];
}

export interface LensExamInput {
  patternId: string;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  timestamp: string;
}

export function lensExamPatterns(): ExamPattern[] {
  return LENS_EXAM_PATTERN_IDS.map((id) => {
    const pattern = examPatterns.find((item) => item.id === id);
    if (!pattern) {
      throw new Error(`Missing canonical examPattern: ${id}`);
    }
    return pattern;
  });
}

export function lensExamPattern(patternId: string): ExamPattern | undefined {
  return examPatterns.find((item) => item.id === patternId);
}

export function intendedLensExamRepresentation(pattern: ExamPattern): string {
  const intended =
    convexLensImagingAssessmentOverlay.exam?.[pattern.id]?.intendedRepresentation;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam representation: ${pattern.id}`);
  }
  return intended;
}

export function intendedLensExamModel(pattern: ExamPattern): string {
  const intended = convexLensImagingAssessmentOverlay.exam?.[pattern.id]?.intendedModel;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam model: ${pattern.id}`);
  }
  return intended;
}

export function emptyLensExamDraft(
  patternIds: readonly string[] = LENS_EXAM_PATTERN_IDS,
): LensExamDraft {
  const ids = [...patternIds];
  return {
    kind: LENS_EXAM_DRAFT_KIND,
    patternIds: ids,
    currentPatternId: ids[0] ?? LENS_EXAM_PATTERN_IDS[0],
    step: "representation",
    representation: "",
    modelRecognition: "",
    selectedAnswer: "",
    reasoning: "",
    retiredPatternIds: [],
  };
}

export function canCommitLensExamAttempt(input: LensExamInput): boolean {
  return (
    input.representation.trim().length > 0 &&
    input.modelRecognition.trim().length > 0 &&
    input.selectedAnswer.trim().length > 0 &&
    hasOwnWords(input.reasoning)
  );
}

export function buildLensExamAttempt(input: LensExamInput): ExamAttempt {
  const pattern = lensExamPattern(input.patternId);
  if (!pattern) {
    throw new Error(`Missing exam pattern: ${input.patternId}`);
  }
  const intendedRepresentation = intendedLensExamRepresentation(pattern);
  const intendedModel = intendedLensExamModel(pattern);
  const correct = input.selectedAnswer === pattern.correctAnswer;
  return {
    questionId: pattern.id,
    patternId: pattern.id,
    representation: [input.representation],
    modelFocus: input.modelRecognition,
    modelRecognition: input.modelRecognition,
    selectedAnswer: input.selectedAnswer,
    reasoning: input.reasoning,
    correct,
    correctness: correct,
    timestamp: input.timestamp,
    cognitiveActions: pattern.requiredCognitiveActions,
    representationMatchesIntended: input.representation === intendedRepresentation,
    modelMatchesIntended: input.modelRecognition === intendedModel,
    reasoningSignals: {
      hasOwnWords: hasOwnWords(input.reasoning),
      addressesRequiredReasoning: hasOwnWords(input.reasoning),
    },
  };
}

export function hasCompletedLensExam(attempts: ExamAttempt[]): boolean {
  return LENS_EXAM_PATTERN_IDS.every((id) =>
    attempts.some((attempt) => attempt.patternId === id || attempt.questionId === id),
  );
}

export function currentLensExamPatternId(
  attempts: ExamAttempt[],
  draft: LensExamDraft,
): string | null {
  const retired = new Set(draft.retiredPatternIds);
  const counts = new Map<string, number>();
  for (const attempt of attempts) {
    const id = attempt.patternId ?? attempt.questionId;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  if (
    draft.currentPatternId &&
    !retired.has(draft.currentPatternId) &&
    (counts.get(draft.currentPatternId) ?? 0) < LENS_EXAM_MAX_ATTEMPTS_PER_ITEM &&
    !attempts.some(
      (attempt) =>
        (attempt.patternId ?? attempt.questionId) === draft.currentPatternId &&
        attempt.correct,
    )
  ) {
    return draft.currentPatternId;
  }
  return (
    draft.patternIds.find((id) => {
      if (retired.has(id)) {
        return false;
      }
      const done = attempts.some(
        (attempt) => (attempt.patternId ?? attempt.questionId) === id,
      );
      return !done;
    }) ?? null
  );
}

export function isLensExamSessionOpen(
  attempts: ExamAttempt[],
  draft: LensExamDraft,
): boolean {
  return currentLensExamPatternId(attempts, draft) !== null;
}

export function nextLensExamDraft(
  attempts: ExamAttempt[],
  previous: LensExamDraft,
  justPatternId: string,
): LensExamDraft {
  const retired = new Set(previous.retiredPatternIds);
  const count = attempts.filter(
    (attempt) => (attempt.patternId ?? attempt.questionId) === justPatternId,
  ).length;
  const passed = attempts.some(
    (attempt) =>
      (attempt.patternId ?? attempt.questionId) === justPatternId && attempt.correct,
  );
  if (passed || count >= LENS_EXAM_MAX_ATTEMPTS_PER_ITEM) {
    retired.add(justPatternId);
  }
  const nextId = currentLensExamPatternId(attempts, {
    ...previous,
    currentPatternId: "",
    retiredPatternIds: [...retired],
  });
  return {
    ...emptyLensExamDraft(previous.patternIds),
    currentPatternId: nextId ?? justPatternId,
    retiredPatternIds: [...retired],
  };
}

export function summarizeLensExamAttempt(attempt: ExamAttempt): string {
  if (attempt.correct) {
    return "这道题已经记下。";
  }
  return "先判断物体相对 F / 2F 在哪里，再说光线会不会真正会聚。不要只背表。";
}
