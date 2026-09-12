import { energyInternalEnergyTemperatureAssessmentOverlay } from "@/content/physics-models/energy-internal-energy-temperature/assessment-overlay";
import { examPatterns } from "@/content/physics-models/energy-internal-energy-temperature/exam";
import { PRODUCTION_EXAM_PATTERN_IDS } from "@/content/physics-models/energy-internal-energy-temperature/implementation-contract";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExamAttempt } from "@/types/learning";
import type { ExamPattern } from "@/types/physics-model";

export const MICROWAVE_EXAM_PATTERN_IDS = [...PRODUCTION_EXAM_PATTERN_IDS] as const;

export const MICROWAVE_EXAM_MAX_ATTEMPTS_PER_ITEM = 2;

export const MICROWAVE_EXAM_DRAFT_KIND = "microwave-exam-draft";

export type MicrowaveExamStep = "representation" | "model" | "answer";

export interface MicrowaveExamDraft {
  kind: typeof MICROWAVE_EXAM_DRAFT_KIND;
  patternIds: string[];
  currentPatternId: string;
  step: MicrowaveExamStep;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  retiredPatternIds: string[];
}

export interface MicrowaveExamInput {
  patternId: string;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  timestamp: string;
}

export function microwaveExamPatterns(): ExamPattern[] {
  return MICROWAVE_EXAM_PATTERN_IDS.map((id) => {
    const pattern = examPatterns.find((item) => item.id === id);
    if (!pattern) {
      throw new Error(`Missing canonical examPattern: ${id}`);
    }
    return pattern;
  });
}

export function microwaveExamPattern(patternId: string): ExamPattern | undefined {
  return examPatterns.find((item) => item.id === patternId);
}

export function microwaveExamCorrectAnswers(): string[] {
  return microwaveExamPatterns().map((pattern) => pattern.correctAnswer);
}

export function intendedMicrowaveExamRepresentation(pattern: ExamPattern): string {
  const intended =
    energyInternalEnergyTemperatureAssessmentOverlay.exam?.[pattern.id]
      ?.intendedRepresentation;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam representation: ${pattern.id}`);
  }
  return intended;
}

export function intendedMicrowaveExamModel(pattern: ExamPattern): string {
  const intended =
    energyInternalEnergyTemperatureAssessmentOverlay.exam?.[pattern.id]?.intendedModel;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam model: ${pattern.id}`);
  }
  return intended;
}

export function microwaveExamAnswerOptionsVisible(step: MicrowaveExamStep): boolean {
  return step === "answer";
}

export function emptyMicrowaveExamDraft(
  patternIds: readonly string[] = MICROWAVE_EXAM_PATTERN_IDS,
): MicrowaveExamDraft {
  const ids = stabilizeExamPatternIds(patternIds);
  return {
    kind: MICROWAVE_EXAM_DRAFT_KIND,
    patternIds: ids,
    currentPatternId: ids[0] ?? MICROWAVE_EXAM_PATTERN_IDS[0],
    step: "representation",
    representation: "",
    modelRecognition: "",
    selectedAnswer: "",
    reasoning: "",
    retiredPatternIds: [],
  };
}

export function canCommitMicrowaveExamAttempt(input: MicrowaveExamInput): boolean {
  return (
    input.representation.trim().length > 0 &&
    input.modelRecognition.trim().length > 0 &&
    input.selectedAnswer.trim().length > 0 &&
    hasOwnWords(input.reasoning)
  );
}

export function buildMicrowaveExamAttempt(input: MicrowaveExamInput): ExamAttempt {
  const pattern = microwaveExamPattern(input.patternId);
  const evaluation = evaluateMicrowaveExamAttempt(input);
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

export function evaluateMicrowaveExamAttempt(input: MicrowaveExamInput): {
  correct: boolean;
  representationMatchesIntended: boolean;
  modelMatchesIntended: boolean;
  reasoningQuality: NonNullable<ExamAttempt["reasoningQuality"]>;
  reasoningSignals: NonNullable<ExamAttempt["reasoningSignals"]>;
} {
  const pattern = microwaveExamPattern(input.patternId);
  const correct = Boolean(pattern && input.selectedAnswer === pattern.correctAnswer);
  const representationMatchesIntended = Boolean(
    pattern && input.representation === intendedMicrowaveExamRepresentation(pattern),
  );
  const modelMatchesIntended = Boolean(
    pattern && input.modelRecognition === intendedMicrowaveExamModel(pattern),
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
    reasoningQuality: classifyMicrowaveExamReasoning({
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

export function hasStructuredMicrowaveExamEvidence(attempt: ExamAttempt): boolean {
  const representation = attempt.representation ?? [];
  const model = attempt.modelRecognition ?? attempt.modelFocus ?? "";
  return (
    representation.length > 0 &&
    model.length > 0 &&
    Boolean(attempt.selectedAnswer) &&
    hasOwnWords(attempt.reasoning ?? "")
  );
}

export function microwaveExamAttemptsFor(
  attempts: ExamAttempt[],
  patternId: string,
): ExamAttempt[] {
  return attempts.filter(
    (attempt) => (attempt.patternId ?? attempt.questionId) === patternId,
  );
}

export function hasCompletedMicrowaveExamItem(
  attempts: ExamAttempt[],
  patternId: string,
): boolean {
  return microwaveExamAttemptsFor(attempts, patternId).some(
    hasStructuredMicrowaveExamEvidence,
  );
}

export function canRetryMicrowaveExamItem(
  attempts: ExamAttempt[],
  patternId: string,
): boolean {
  const forItem = microwaveExamAttemptsFor(attempts, patternId).filter(
    hasStructuredMicrowaveExamEvidence,
  );
  const latest = forItem.at(-1);
  if (!latest || latest.correct) {
    return false;
  }
  return forItem.length < MICROWAVE_EXAM_MAX_ATTEMPTS_PER_ITEM;
}

export function hasCompletedMicrowaveExam(
  attempts: ExamAttempt[],
  patternIds: readonly string[] = MICROWAVE_EXAM_PATTERN_IDS,
): boolean {
  return stabilizeExamPatternIds(patternIds).every((id) =>
    hasCompletedMicrowaveExamItem(attempts, id),
  );
}

export function currentMicrowaveExamPatternId(
  attempts: ExamAttempt[],
  draft: Pick<
    MicrowaveExamDraft,
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
    (canRetryMicrowaveExamItem(attempts, current) ||
      !hasCompletedMicrowaveExamItem(attempts, current))
  ) {
    return current;
  }
  return (
    patternIds.find(
      (id) =>
        !retired.has(id) &&
        (canRetryMicrowaveExamItem(attempts, id) ||
          !hasCompletedMicrowaveExamItem(attempts, id)),
    ) ?? null
  );
}

export function nextMicrowaveExamDraft(
  attempts: ExamAttempt[],
  previous: MicrowaveExamDraft,
  justAnsweredPatternId: string,
): MicrowaveExamDraft {
  const patternIds = stabilizeExamPatternIds(previous.patternIds);
  const retired = new Set(previous.retiredPatternIds);

  if (canRetryMicrowaveExamItem(attempts, justAnsweredPatternId)) {
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
  const nextId = currentMicrowaveExamPatternId(attempts, {
    patternIds,
    currentPatternId: "",
    retiredPatternIds: [...retired],
  });

  if (!nextId) {
    return {
      ...emptyMicrowaveExamDraft(patternIds),
      currentPatternId: justAnsweredPatternId,
      step: "answer",
      retiredPatternIds: [...retired],
    };
  }

  return {
    ...emptyMicrowaveExamDraft(patternIds),
    currentPatternId: nextId,
    retiredPatternIds: [...retired],
  };
}

export function summarizeMicrowaveExamAttempt(attempt: ExamAttempt): string {
  if (attempt.correct && attempt.reasoningQuality === "strong") {
    return "这题的选择和理由都用到了刚才的关系。";
  }
  if (attempt.correct) {
    return "选项选对了。理由可以再对照温度、内能和条件写清楚一点。";
  }
  return "先回到题目：温度是不是内能？能量进入是不是一定升温？";
}

export function completeMicrowaveExamInput(
  patternId: string,
  timestamp: string,
): MicrowaveExamInput {
  const pattern = microwaveExamPattern(patternId);
  if (!pattern) {
    throw new Error(`Missing canonical examPattern: ${patternId}`);
  }
  return {
    patternId,
    representation: intendedMicrowaveExamRepresentation(pattern),
    modelRecognition: intendedMicrowaveExamModel(pattern),
    selectedAnswer: pattern.correctAnswer,
    reasoning: `${pattern.requiredReasoning.join("，")}。`,
    timestamp,
  };
}

export function completedMicrowaveExamAttempts(timestamp = "t"): ExamAttempt[] {
  return MICROWAVE_EXAM_PATTERN_IDS.map((id, index) =>
    buildMicrowaveExamAttempt(completeMicrowaveExamInput(id, `${timestamp}-${index}`)),
  );
}

export function looksLikeMicrowaveExamAnswerLeak(message: string): boolean {
  if (/正确答案是|应该选|答案就是|答案是\s*[ABCD]|选[ABCD][，。]/.test(message)) {
    return true;
  }
  return microwaveExamCorrectAnswers().some(
    (answer) => answer.length > 0 && message.includes(answer),
  );
}

function stabilizeExamPatternIds(patternIds: readonly string[]): string[] {
  const allowed = new Set<string>(MICROWAVE_EXAM_PATTERN_IDS);
  const kept = patternIds.filter((id) => allowed.has(id));
  if (kept.length > 0) {
    return kept;
  }
  return [...MICROWAVE_EXAM_PATTERN_IDS];
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

function classifyMicrowaveExamReasoning(input: {
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
