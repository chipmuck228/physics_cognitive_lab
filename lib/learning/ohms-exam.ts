import { ohmsLawAssessmentOverlay } from "@/content/physics-models/ohms-law/assessment-overlay";
import { examPatterns } from "@/content/physics-models/ohms-law/exam";
import {
  EXAM_CALCULATION_INPUT,
  officialCurrentFromVoltageAndResistanceA,
} from "@/content/physics-models/ohms-law/physics-boundary";
import { PRODUCTION_EXAM_PATTERN_IDS } from "@/content/physics-models/ohms-law/implementation-contract";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExamAttempt } from "@/types/learning";
import type { ExamPattern } from "@/types/physics-model";

export const OHMS_EXAM_PATTERN_IDS = [...PRODUCTION_EXAM_PATTERN_IDS] as const;
export const OHMS_EXAM_MAX_ATTEMPTS_PER_ITEM = 2;
export const OHMS_EXAM_DRAFT_KIND = "ohms-exam-draft";

export type OhmsExamStep = "representation" | "model" | "answer";

export interface OhmsExamDraft {
  kind: typeof OHMS_EXAM_DRAFT_KIND;
  patternIds: string[];
  currentPatternId: string;
  step: OhmsExamStep;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  retiredPatternIds: string[];
}

export interface OhmsExamInput {
  patternId: string;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  timestamp: string;
}

export function ohmsExamPatterns(): ExamPattern[] {
  return OHMS_EXAM_PATTERN_IDS.map((id) => {
    const pattern = examPatterns.find((item) => item.id === id);
    if (!pattern) {
      throw new Error(`Missing canonical examPattern: ${id}`);
    }
    return pattern;
  });
}

export function ohmsExamPattern(patternId: string): ExamPattern | undefined {
  return examPatterns.find((item) => item.id === patternId);
}

export function intendedOhmsExamRepresentation(pattern: ExamPattern): string {
  const intended = ohmsLawAssessmentOverlay.exam?.[pattern.id]?.intendedRepresentation;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam representation: ${pattern.id}`);
  }
  return intended;
}

export function intendedOhmsExamModel(pattern: ExamPattern): string {
  const intended = ohmsLawAssessmentOverlay.exam?.[pattern.id]?.intendedModel;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam model: ${pattern.id}`);
  }
  return intended;
}

export function officialExamCalculationAnswer(): string {
  const current = officialCurrentFromVoltageAndResistanceA(
    EXAM_CALCULATION_INPUT.voltageV,
    EXAM_CALCULATION_INPUT.resistanceOhm,
  );
  return `${current} A`;
}

export function emptyOhmsExamDraft(
  patternIds: readonly string[] = OHMS_EXAM_PATTERN_IDS,
): OhmsExamDraft {
  const ids = [...patternIds];
  return {
    kind: OHMS_EXAM_DRAFT_KIND,
    patternIds: ids,
    currentPatternId: ids[0] ?? OHMS_EXAM_PATTERN_IDS[0],
    step: "representation",
    representation: "",
    modelRecognition: "",
    selectedAnswer: "",
    reasoning: "",
    retiredPatternIds: [],
  };
}

export function canCommitOhmsExamAttempt(input: OhmsExamInput): boolean {
  return (
    input.representation.trim().length > 0 &&
    input.modelRecognition.trim().length > 0 &&
    input.selectedAnswer.trim().length > 0 &&
    hasOwnWords(input.reasoning)
  );
}

export function buildOhmsExamAttempt(input: OhmsExamInput): ExamAttempt {
  const pattern = ohmsExamPattern(input.patternId);
  if (!pattern) {
    throw new Error(`Missing exam pattern: ${input.patternId}`);
  }
  const intendedRepresentation = intendedOhmsExamRepresentation(pattern);
  const intendedModel = intendedOhmsExamModel(pattern);
  const officialAnswer =
    pattern.id === "exam-calculate-i-from-u-and-r"
      ? officialExamCalculationAnswer()
      : pattern.correctAnswer;
  const correct = input.selectedAnswer === officialAnswer;
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

export function hasCompletedOhmsExam(attempts: ExamAttempt[]): boolean {
  return OHMS_EXAM_PATTERN_IDS.every((id) =>
    attempts.some((attempt) => attempt.patternId === id || attempt.questionId === id),
  );
}

export function currentOhmsExamPatternId(
  attempts: ExamAttempt[],
  draft: OhmsExamDraft,
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
    (counts.get(draft.currentPatternId) ?? 0) < OHMS_EXAM_MAX_ATTEMPTS_PER_ITEM &&
    !attempts.some(
      (attempt) =>
        (attempt.patternId ?? attempt.questionId) === draft.currentPatternId &&
        attempt.correct === true,
    )
  ) {
    return draft.currentPatternId;
  }
  return (
    draft.patternIds.find((id) => {
      if (retired.has(id)) {
        return false;
      }
      const done =
        attempts.some(
          (attempt) => (attempt.patternId ?? attempt.questionId) === id && attempt.correct,
        ) || (counts.get(id) ?? 0) >= OHMS_EXAM_MAX_ATTEMPTS_PER_ITEM;
      return !done;
    }) ?? null
  );
}

export function isOhmsExamSessionOpen(
  attempts: ExamAttempt[],
  draft: OhmsExamDraft,
): boolean {
  return currentOhmsExamPatternId(attempts, draft) !== null;
}

export function nextOhmsExamDraft(
  attempts: ExamAttempt[],
  previous: OhmsExamDraft,
  justPatternId: string,
): OhmsExamDraft {
  const retired = new Set(previous.retiredPatternIds);
  const tries = attempts.filter(
    (attempt) => (attempt.patternId ?? attempt.questionId) === justPatternId,
  );
  if (
    tries.some((attempt) => attempt.correct) ||
    tries.length >= OHMS_EXAM_MAX_ATTEMPTS_PER_ITEM
  ) {
    retired.add(justPatternId);
  }
  const nextId = currentOhmsExamPatternId(attempts, {
    ...previous,
    currentPatternId: "",
    retiredPatternIds: [...retired],
  });
  return {
    ...emptyOhmsExamDraft(previous.patternIds),
    currentPatternId: nextId ?? justPatternId,
    retiredPatternIds: [...retired],
  };
}

export function summarizeOhmsExamAttempt(attempt: ExamAttempt): string {
  if (attempt.correct) {
    return "这道题的选择和理由都记下来了。";
  }
  return "这道还可以再想。先分清考的是哪种比较，再选关系。";
}

export function looksLikeOhmsExamAnswerLeak(message: string): boolean {
  return /正确答案是|选3 A|应该选3A|电阻不是被制造/.test(message);
}
