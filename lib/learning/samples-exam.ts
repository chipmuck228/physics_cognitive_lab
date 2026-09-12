import { densityMassVolumeAssessmentOverlay } from "@/content/physics-models/density-mass-volume/assessment-overlay";
import { examPatterns } from "@/content/physics-models/density-mass-volume/exam";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExamAttempt } from "@/types/learning";
import type { ExamPattern } from "@/types/physics-model";

export const SAMPLES_EXAM_PATTERN_IDS = [
  "exam-density-is-not-mass-or-size",
  "exam-same-volume-larger-mass",
  "exam-cut-uniform-density-unchanged",
  "exam-calculate-density-ratio",
  "exam-mass-volume-density-table",
] as const;

export const SAMPLES_EXAM_MAX_ATTEMPTS_PER_ITEM = 2;

export const SAMPLES_EXAM_DRAFT_KIND = "samples-exam-draft";

export const SAMPLES_EXAM_INTENDED_REPRESENTATION: Record<string, string> =
  Object.fromEntries(
    Object.entries(densityMassVolumeAssessmentOverlay.exam ?? {}).map(
      ([id, definition]) => [id, definition.intendedRepresentation],
    ),
  );

export type SamplesExamStep = "representation" | "model" | "answer";

export interface SamplesExamDraft {
  kind: typeof SAMPLES_EXAM_DRAFT_KIND;
  patternIds: string[];
  currentPatternId: string;
  step: SamplesExamStep;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  retiredPatternIds: string[];
}

export interface SamplesExamInput {
  patternId: string;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  timestamp: string;
}

export function samplesExamPatterns(): ExamPattern[] {
  return SAMPLES_EXAM_PATTERN_IDS.map((id) => {
    const pattern = examPatterns.find((item) => item.id === id);
    if (!pattern) {
      throw new Error(`Missing canonical examPattern: ${id}`);
    }
    return pattern;
  });
}

export function samplesExamPattern(patternId: string): ExamPattern | undefined {
  return examPatterns.find((item) => item.id === patternId);
}

export function samplesExamCorrectAnswers(): string[] {
  return samplesExamPatterns().map((pattern) => pattern.correctAnswer);
}

export function intendedSamplesExamRepresentation(pattern: ExamPattern): string {
  const intended =
    densityMassVolumeAssessmentOverlay.exam?.[pattern.id]?.intendedRepresentation;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam representation: ${pattern.id}`);
  }
  return intended;
}

export function intendedSamplesExamModel(pattern: ExamPattern): string {
  const intended =
    densityMassVolumeAssessmentOverlay.exam?.[pattern.id]?.intendedModel;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam model: ${pattern.id}`);
  }
  return intended;
}

export function samplesExamAnswerOptionsVisible(step: SamplesExamStep): boolean {
  return step === "answer";
}

export function emptySamplesExamDraft(
  patternIds: readonly string[] = SAMPLES_EXAM_PATTERN_IDS,
): SamplesExamDraft {
  const ids = stabilizeExamPatternIds(patternIds);
  return {
    kind: SAMPLES_EXAM_DRAFT_KIND,
    patternIds: ids,
    currentPatternId: ids[0] ?? SAMPLES_EXAM_PATTERN_IDS[0],
    step: "representation",
    representation: "",
    modelRecognition: "",
    selectedAnswer: "",
    reasoning: "",
    retiredPatternIds: [],
  };
}

export function canCommitSamplesExamAttempt(input: SamplesExamInput): boolean {
  return (
    input.representation.trim().length > 0 &&
    input.modelRecognition.trim().length > 0 &&
    input.selectedAnswer.trim().length > 0 &&
    hasOwnWords(input.reasoning)
  );
}

export function buildSamplesExamAttempt(input: SamplesExamInput): ExamAttempt {
  const pattern = samplesExamPattern(input.patternId);
  const evaluation = evaluateSamplesExamAttempt(input);
  return {
    questionId: input.patternId,
    patternId: input.patternId,
    representation: input.representation ? [input.representation] : [],
    modelFocus: input.modelRecognition,
    modelRecognition: input.modelRecognition,
    selectedAnswer: input.selectedAnswer,
    reasoning: input.reasoning.trim(),
    correct: evaluation.correct,
    correctness: evaluation.correct,
    reasoningQuality: evaluation.reasoningQuality,
    timestamp: input.timestamp,
    cognitiveActions: pattern?.requiredCognitiveActions ?? [],
    selectedRelations: input.modelRecognition ? [input.modelRecognition] : [],
    representationMatchesIntended: evaluation.representationMatchesIntended,
    modelMatchesIntended: evaluation.modelMatchesIntended,
    reasoningSignals: evaluation.reasoningSignals,
  };
}

export function evaluateSamplesExamAttempt(input: SamplesExamInput): {
  correct: boolean;
  representationMatchesIntended: boolean;
  modelMatchesIntended: boolean;
  reasoningQuality: NonNullable<ExamAttempt["reasoningQuality"]>;
  reasoningSignals: NonNullable<ExamAttempt["reasoningSignals"]>;
} {
  const pattern = samplesExamPattern(input.patternId);
  const correct = Boolean(
    pattern && input.selectedAnswer === pattern.correctAnswer,
  );
  const representationMatchesIntended = Boolean(
    pattern && input.representation === intendedSamplesExamRepresentation(pattern),
  );
  const modelMatchesIntended = Boolean(
    pattern && input.modelRecognition === intendedSamplesExamModel(pattern),
  );
  const ownWords = hasOwnWords(input.reasoning);
  const addressesRequiredReasoning = addressesExamReasoning(
    input.reasoning,
    pattern?.requiredReasoning ?? [],
  );

  return {
    correct,
    representationMatchesIntended,
    modelMatchesIntended,
    reasoningQuality: classifySamplesExamReasoning({
      correct,
      ownWords,
      addressesRequiredReasoning,
    }),
    reasoningSignals: {
      hasOwnWords: ownWords,
      addressesRequiredReasoning,
    },
  };
}

export function hasStructuredSamplesExamEvidence(attempt: ExamAttempt): boolean {
  const representation = attempt.representation ?? [];
  const model = attempt.modelRecognition ?? attempt.modelFocus ?? "";
  return (
    representation.length > 0 &&
    model.length > 0 &&
    Boolean(attempt.selectedAnswer) &&
    hasOwnWords(attempt.reasoning ?? "")
  );
}

export function samplesExamAttemptsFor(
  attempts: ExamAttempt[],
  patternId: string,
): ExamAttempt[] {
  return attempts.filter(
    (attempt) => (attempt.patternId ?? attempt.questionId) === patternId,
  );
}

export function hasCompletedSamplesExamItem(
  attempts: ExamAttempt[],
  patternId: string,
): boolean {
  return samplesExamAttemptsFor(attempts, patternId).some(
    hasStructuredSamplesExamEvidence,
  );
}

export function canRetrySamplesExamItem(
  attempts: ExamAttempt[],
  patternId: string,
): boolean {
  const forItem = samplesExamAttemptsFor(attempts, patternId).filter(
    hasStructuredSamplesExamEvidence,
  );
  const latest = forItem.at(-1);
  if (!latest || latest.correct) {
    return false;
  }
  return forItem.length < SAMPLES_EXAM_MAX_ATTEMPTS_PER_ITEM;
}

export function hasCompletedSamplesExam(
  attempts: ExamAttempt[],
  patternIds: readonly string[] = SAMPLES_EXAM_PATTERN_IDS,
): boolean {
  return stabilizeExamPatternIds(patternIds).every((id) =>
    hasCompletedSamplesExamItem(attempts, id),
  );
}

export function currentSamplesExamPatternId(
  attempts: ExamAttempt[],
  draft: Pick<
    SamplesExamDraft,
    "patternIds" | "currentPatternId" | "retiredPatternIds"
  >,
): string | null {
  const patternIds = stabilizeExamPatternIds(draft.patternIds);
  const retired = new Set(draft.retiredPatternIds);
  const current = draft.currentPatternId;
  if (
    current &&
    patternIds.includes(current) &&
    !retired.has(current) &&
    (canRetrySamplesExamItem(attempts, current) ||
      !hasCompletedSamplesExamItem(attempts, current))
  ) {
    return current;
  }
  return (
    patternIds.find(
      (id) =>
        !retired.has(id) &&
        (canRetrySamplesExamItem(attempts, id) ||
          !hasCompletedSamplesExamItem(attempts, id)),
    ) ?? null
  );
}

export function isSamplesExamSessionOpen(
  attempts: ExamAttempt[],
  draft: Pick<
    SamplesExamDraft,
    "patternIds" | "currentPatternId" | "retiredPatternIds"
  >,
): boolean {
  return currentSamplesExamPatternId(attempts, draft) !== null;
}

export function nextSamplesExamDraft(
  attempts: ExamAttempt[],
  previous: SamplesExamDraft,
  justAnsweredPatternId: string,
): SamplesExamDraft {
  const patternIds = stabilizeExamPatternIds(previous.patternIds);
  const retired = new Set(previous.retiredPatternIds);

  if (canRetrySamplesExamItem(attempts, justAnsweredPatternId)) {
    return {
      ...previous,
      patternIds,
      currentPatternId: justAnsweredPatternId,
      step: "answer",
      selectedAnswer: "",
      reasoning: "",
      retiredPatternIds: [...retired],
    };
  }

  retired.add(justAnsweredPatternId);
  const nextId = currentSamplesExamPatternId(attempts, {
    patternIds,
    currentPatternId: "",
    retiredPatternIds: [...retired],
  });

  if (!nextId) {
    return {
      ...emptySamplesExamDraft(patternIds),
      currentPatternId: justAnsweredPatternId,
      step: "answer",
      retiredPatternIds: [...retired],
    };
  }

  return {
    ...emptySamplesExamDraft(patternIds),
    currentPatternId: nextId,
    retiredPatternIds: [...retired],
  };
}

export function retireSamplesExamDraft(
  attempts: ExamAttempt[],
  previous: SamplesExamDraft,
): SamplesExamDraft {
  const patternIds = stabilizeExamPatternIds(previous.patternIds);
  const retired = new Set(previous.retiredPatternIds);
  retired.add(previous.currentPatternId);
  const nextId = currentSamplesExamPatternId(attempts, {
    patternIds,
    currentPatternId: "",
    retiredPatternIds: [...retired],
  });

  if (!nextId) {
    return {
      ...previous,
      patternIds,
      retiredPatternIds: [...retired],
      step: "answer",
    };
  }

  return {
    ...emptySamplesExamDraft(patternIds),
    currentPatternId: nextId,
    retiredPatternIds: [...retired],
  };
}

export function summarizeSamplesExamAttempt(attempt: ExamAttempt): string {
  if (attempt.correct && attempt.reasoningQuality === "strong") {
    return "这题的选择和理由都用到了刚才的关系。";
  }
  if (attempt.correct && attempt.reasoningQuality === "weak") {
    return "选项选对了。理由还要再写出题目里真正用到的关系。";
  }
  if (attempt.correct) {
    return "选项选对了。理由可以再对照题目条件写清楚一点。";
  }
  return "先回到题目：密度是不是就是轻重或大小？质量和体积怎样一起用？";
}

export function completeSamplesExamInput(
  patternId: string,
  timestamp: string,
): SamplesExamInput {
  const pattern = samplesExamPattern(patternId);
  if (!pattern) {
    throw new Error(`Missing canonical examPattern: ${patternId}`);
  }
  return {
    patternId,
    representation: intendedSamplesExamRepresentation(pattern),
    modelRecognition: intendedSamplesExamModel(pattern),
    selectedAnswer: pattern.correctAnswer,
    reasoning: `${pattern.requiredReasoning.join("，")}。`,
    timestamp,
  };
}

export function completedSamplesExamAttempts(timestamp = "t"): ExamAttempt[] {
  return SAMPLES_EXAM_PATTERN_IDS.map((id, index) =>
    buildSamplesExamAttempt(completeSamplesExamInput(id, `${timestamp}-${index}`)),
  );
}

export function looksLikeSamplesExamAnswerLeak(message: string): boolean {
  if (/正确答案是|应该选|答案就是|答案是\s*[ABCD]|选[ABCD][，。]/.test(message)) {
    return true;
  }
  return samplesExamCorrectAnswers().some(
    (answer) => answer.length > 0 && message.includes(answer),
  );
}

function stabilizeExamPatternIds(patternIds: readonly string[]): string[] {
  const allowed = new Set<string>(SAMPLES_EXAM_PATTERN_IDS);
  const kept = patternIds.filter((id) => allowed.has(id));
  if (kept.length > 0) {
    return kept;
  }
  return [...SAMPLES_EXAM_PATTERN_IDS];
}

function addressesExamReasoning(text: string, required: string[]): boolean {
  const normalized = text.replace(/\s+/g, "");
  if (!normalized) {
    return false;
  }
  return required.some((item) => {
    const tokens = item
      .replace(/[，。、]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length >= 2);
    return tokens.some((token) => normalized.includes(token));
  });
}

function classifySamplesExamReasoning(input: {
  correct: boolean;
  ownWords: boolean;
  addressesRequiredReasoning: boolean;
}): NonNullable<ExamAttempt["reasoningQuality"]> {
  if (!input.ownWords) {
    return "weak";
  }
  if (input.correct && input.addressesRequiredReasoning) {
    return "strong";
  }
  if (input.correct && !input.addressesRequiredReasoning) {
    return "weak";
  }
  return "adequate";
}
