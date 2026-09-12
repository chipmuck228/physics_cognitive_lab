import { specificHeatCapacityAssessmentOverlay } from "@/content/physics-models/specific-heat-capacity/assessment-overlay";
import { examPatterns } from "@/content/physics-models/specific-heat-capacity/exam";
import { PRODUCTION_EXAM_PATTERN_IDS } from "@/content/physics-models/specific-heat-capacity/implementation-contract";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExamAttempt } from "@/types/learning";
import type { ExamPattern } from "@/types/physics-model";

export const HEAT_EXAM_PATTERN_IDS = [...PRODUCTION_EXAM_PATTERN_IDS] as const;

export const HEAT_EXAM_MAX_ATTEMPTS_PER_ITEM = 2;

export const HEAT_EXAM_DRAFT_KIND = "heat-exam-draft";

export type HeatExamStep = "representation" | "model" | "answer";

export interface HeatExamDraft {
  kind: typeof HEAT_EXAM_DRAFT_KIND;
  patternIds: string[];
  currentPatternId: string;
  step: HeatExamStep;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  retiredPatternIds: string[];
}

export interface HeatExamInput {
  patternId: string;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  timestamp: string;
}

export function heatExamPatterns(): ExamPattern[] {
  return HEAT_EXAM_PATTERN_IDS.map((id) => {
    const pattern = examPatterns.find((item) => item.id === id);
    if (!pattern) {
      throw new Error(`Missing canonical examPattern: ${id}`);
    }
    return pattern;
  });
}

export function heatExamPattern(patternId: string): ExamPattern | undefined {
  return examPatterns.find((item) => item.id === patternId);
}

export function heatExamCorrectAnswers(): string[] {
  return heatExamPatterns().map((pattern) => pattern.correctAnswer);
}

export function intendedHeatExamRepresentation(pattern: ExamPattern): string {
  const intended =
    specificHeatCapacityAssessmentOverlay.exam?.[pattern.id]?.intendedRepresentation;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam representation: ${pattern.id}`);
  }
  return intended;
}

export function intendedHeatExamModel(pattern: ExamPattern): string {
  const intended =
    specificHeatCapacityAssessmentOverlay.exam?.[pattern.id]?.intendedModel;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam model: ${pattern.id}`);
  }
  return intended;
}

export function heatExamAnswerOptionsVisible(step: HeatExamStep): boolean {
  return step === "answer";
}

export function emptyHeatExamDraft(
  patternIds: readonly string[] = HEAT_EXAM_PATTERN_IDS,
): HeatExamDraft {
  const ids = stabilizeExamPatternIds(patternIds);
  return {
    kind: HEAT_EXAM_DRAFT_KIND,
    patternIds: ids,
    currentPatternId: ids[0] ?? HEAT_EXAM_PATTERN_IDS[0],
    step: "representation",
    representation: "",
    modelRecognition: "",
    selectedAnswer: "",
    reasoning: "",
    retiredPatternIds: [],
  };
}

export function canCommitHeatExamAttempt(input: HeatExamInput): boolean {
  return (
    input.representation.trim().length > 0 &&
    input.modelRecognition.trim().length > 0 &&
    input.selectedAnswer.trim().length > 0 &&
    hasOwnWords(input.reasoning)
  );
}

export function buildHeatExamAttempt(input: HeatExamInput): ExamAttempt {
  const pattern = heatExamPattern(input.patternId);
  const evaluation = evaluateHeatExamAttempt(input);
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

export function evaluateHeatExamAttempt(input: HeatExamInput): {
  correct: boolean;
  representationMatchesIntended: boolean;
  modelMatchesIntended: boolean;
  reasoningQuality: NonNullable<ExamAttempt["reasoningQuality"]>;
  reasoningSignals: NonNullable<ExamAttempt["reasoningSignals"]>;
} {
  const pattern = heatExamPattern(input.patternId);
  const correct = Boolean(pattern && input.selectedAnswer === pattern.correctAnswer);
  const representationMatchesIntended = Boolean(
    pattern && input.representation === intendedHeatExamRepresentation(pattern),
  );
  const modelMatchesIntended = Boolean(
    pattern && input.modelRecognition === intendedHeatExamModel(pattern),
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
    reasoningQuality: classifyHeatExamReasoning({
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

export function hasStructuredHeatExamEvidence(attempt: ExamAttempt): boolean {
  const representation = attempt.representation ?? [];
  const model = attempt.modelRecognition ?? attempt.modelFocus ?? "";
  return (
    representation.length > 0 &&
    model.length > 0 &&
    Boolean(attempt.selectedAnswer) &&
    hasOwnWords(attempt.reasoning ?? "")
  );
}

export function heatExamAttemptsFor(
  attempts: ExamAttempt[],
  patternId: string,
): ExamAttempt[] {
  return attempts.filter(
    (attempt) => (attempt.patternId ?? attempt.questionId) === patternId,
  );
}

export function hasCompletedHeatExamItem(
  attempts: ExamAttempt[],
  patternId: string,
): boolean {
  return heatExamAttemptsFor(attempts, patternId).some(hasStructuredHeatExamEvidence);
}

export function canRetryHeatExamItem(
  attempts: ExamAttempt[],
  patternId: string,
): boolean {
  const forItem = heatExamAttemptsFor(attempts, patternId).filter(
    hasStructuredHeatExamEvidence,
  );
  const latest = forItem.at(-1);
  if (!latest || latest.correct) {
    return false;
  }
  return forItem.length < HEAT_EXAM_MAX_ATTEMPTS_PER_ITEM;
}

export function hasCompletedHeatExam(
  attempts: ExamAttempt[],
  patternIds: readonly string[] = HEAT_EXAM_PATTERN_IDS,
): boolean {
  return stabilizeExamPatternIds(patternIds).every((id) =>
    hasCompletedHeatExamItem(attempts, id),
  );
}

export function currentHeatExamPatternId(
  attempts: ExamAttempt[],
  draft: Pick<HeatExamDraft, "patternIds" | "currentPatternId" | "retiredPatternIds">,
): string | null {
  const patternIds = stabilizeExamPatternIds(draft.patternIds);
  const retired = new Set(draft.retiredPatternIds);
  const current = draft.currentPatternId;
  if (
    current &&
    patternIds.includes(current) &&
    !retired.has(current) &&
    (canRetryHeatExamItem(attempts, current) ||
      !hasCompletedHeatExamItem(attempts, current))
  ) {
    return current;
  }
  return (
    patternIds.find(
      (id) =>
        !retired.has(id) &&
        (canRetryHeatExamItem(attempts, id) || !hasCompletedHeatExamItem(attempts, id)),
    ) ?? null
  );
}

export function isHeatExamSessionOpen(
  attempts: ExamAttempt[],
  draft: Pick<HeatExamDraft, "patternIds" | "currentPatternId" | "retiredPatternIds">,
): boolean {
  return currentHeatExamPatternId(attempts, draft) !== null;
}

export function nextHeatExamDraft(
  attempts: ExamAttempt[],
  previous: HeatExamDraft,
  justAnsweredPatternId: string,
): HeatExamDraft {
  const patternIds = stabilizeExamPatternIds(previous.patternIds);
  const retired = new Set(previous.retiredPatternIds);

  if (canRetryHeatExamItem(attempts, justAnsweredPatternId)) {
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
  const nextId = currentHeatExamPatternId(attempts, {
    patternIds,
    currentPatternId: "",
    retiredPatternIds: [...retired],
  });

  if (!nextId) {
    return {
      ...emptyHeatExamDraft(patternIds),
      currentPatternId: justAnsweredPatternId,
      step: "answer",
      retiredPatternIds: [...retired],
    };
  }

  return {
    ...emptyHeatExamDraft(patternIds),
    currentPatternId: nextId,
    retiredPatternIds: [...retired],
  };
}

export function summarizeHeatExamAttempt(attempt: ExamAttempt): string {
  if (attempt.correct && attempt.reasoningQuality === "strong") {
    return "这题的选择和理由都用到了刚才的关系。";
  }
  if (attempt.correct && attempt.reasoningQuality === "weak") {
    return "选项选对了。理由还要再写出题目里真正用到的关系。";
  }
  if (attempt.correct) {
    return "选项选对了。理由可以再对照题目条件写清楚一点。";
  }
  return "先回到题目：温度是不是就是能量？质量和比热容怎样一起用？";
}

export function completeHeatExamInput(
  patternId: string,
  timestamp: string,
): HeatExamInput {
  const pattern = heatExamPattern(patternId);
  if (!pattern) {
    throw new Error(`Missing canonical examPattern: ${patternId}`);
  }
  return {
    patternId,
    representation: intendedHeatExamRepresentation(pattern),
    modelRecognition: intendedHeatExamModel(pattern),
    selectedAnswer: pattern.correctAnswer,
    reasoning: `${pattern.requiredReasoning.join("，")}。`,
    timestamp,
  };
}

export function completedHeatExamAttempts(timestamp = "t"): ExamAttempt[] {
  return HEAT_EXAM_PATTERN_IDS.map((id, index) =>
    buildHeatExamAttempt(completeHeatExamInput(id, `${timestamp}-${index}`)),
  );
}

export function looksLikeHeatExamAnswerLeak(message: string): boolean {
  if (/正确答案是|应该选|答案就是|答案是\s*[ABCD]|选[ABCD][，。]/.test(message)) {
    return true;
  }
  return heatExamCorrectAnswers().some(
    (answer) => answer.length > 0 && message.includes(answer),
  );
}

function stabilizeExamPatternIds(patternIds: readonly string[]): string[] {
  const allowed = new Set<string>(HEAT_EXAM_PATTERN_IDS);
  const kept = patternIds.filter((id) => allowed.has(id));
  if (kept.length > 0) {
    return kept;
  }
  return [...HEAT_EXAM_PATTERN_IDS];
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

function classifyHeatExamReasoning(input: {
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
