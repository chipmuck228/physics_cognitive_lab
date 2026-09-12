import { forceChangesMotionStateAssessmentOverlay } from "@/content/physics-models/force-changes-motion-state/assessment-overlay";
import { examPatterns } from "@/content/physics-models/force-changes-motion-state/exam";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExamAttempt } from "@/types/learning";
import type { ExamPattern } from "@/types/physics-model";

/**
 * Production Exam World uses a stable representative subset of the
 * canonical examPatterns. The model library remains the full source.
 *
 * Coverage:
 * - force ≠ motion
 * - zero net force ≠ stationary
 * - opposite force can slow motion
 * - force direction need not equal motion direction
 * - balanced forces ≠ no forces
 */
export const CART_EXAM_PATTERN_IDS = [
  "exam-force-does-not-mean-motion",
  "exam-zero-net-force-not-must-stop",
  "exam-opposite-force-slows-down",
  "exam-force-motion-arrow-diagram",
  "exam-balanced-forces-not-no-forces",
] as const;

export const CART_EXAM_MAX_ATTEMPTS_PER_ITEM = 2;

export const CART_EXAM_DRAFT_KIND = "cart-exam-draft";

/**
 * Derived from AssessmentOverlay. Do not treat representationOptions[0]
 * or modelOptions[0] as the correctness contract.
 */
export const CART_EXAM_INTENDED_REPRESENTATION: Record<string, string> =
  Object.fromEntries(
    Object.entries(forceChangesMotionStateAssessmentOverlay.exam ?? {}).map(
      ([id, definition]) => [id, definition.intendedRepresentation],
    ),
  );

export type CartExamStep = "representation" | "model" | "answer";

export interface CartExamDraft {
  kind: typeof CART_EXAM_DRAFT_KIND;
  patternIds: string[];
  currentPatternId: string;
  step: CartExamStep;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  retiredPatternIds: string[];
}

export interface CartExamInput {
  patternId: string;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  timestamp: string;
}

export function cartExamPatterns(): ExamPattern[] {
  return CART_EXAM_PATTERN_IDS.map((id) => {
    const pattern = examPatterns.find((item) => item.id === id);
    if (!pattern) {
      throw new Error(`Missing canonical examPattern: ${id}`);
    }
    return pattern;
  });
}

export function cartExamPattern(patternId: string): ExamPattern | undefined {
  return examPatterns.find((item) => item.id === patternId);
}

export function cartExamCorrectAnswers(): string[] {
  return cartExamPatterns().map((pattern) => pattern.correctAnswer);
}

export function cartExamCognitiveActions(): string[] {
  return [
    ...new Set(
      cartExamPatterns().flatMap((pattern) => pattern.requiredCognitiveActions),
    ),
  ];
}

export function intendedCartExamRepresentation(pattern: ExamPattern): string {
  const intended =
    forceChangesMotionStateAssessmentOverlay.exam?.[pattern.id]
      ?.intendedRepresentation;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam representation: ${pattern.id}`);
  }
  return intended;
}

export function intendedCartExamModel(pattern: ExamPattern): string {
  const intended =
    forceChangesMotionStateAssessmentOverlay.exam?.[pattern.id]?.intendedModel;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam model: ${pattern.id}`);
  }
  return intended;
}

export function cartExamAnswerOptionsVisible(step: CartExamStep): boolean {
  return step === "answer";
}

export function emptyCartExamDraft(
  patternIds: readonly string[] = CART_EXAM_PATTERN_IDS,
): CartExamDraft {
  const ids = stabilizeExamPatternIds(patternIds);
  return {
    kind: CART_EXAM_DRAFT_KIND,
    patternIds: ids,
    currentPatternId: ids[0] ?? CART_EXAM_PATTERN_IDS[0],
    step: "representation",
    representation: "",
    modelRecognition: "",
    selectedAnswer: "",
    reasoning: "",
    retiredPatternIds: [],
  };
}

export function canCommitCartExamAttempt(input: CartExamInput): boolean {
  return (
    input.representation.trim().length > 0 &&
    input.modelRecognition.trim().length > 0 &&
    input.selectedAnswer.trim().length > 0 &&
    hasOwnWords(input.reasoning)
  );
}

export function buildCartExamAttempt(input: CartExamInput): ExamAttempt {
  const pattern = cartExamPattern(input.patternId);
  const evaluation = evaluateCartExamAttempt(input);
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

export function evaluateCartExamAttempt(input: CartExamInput): {
  correct: boolean;
  representationMatchesIntended: boolean;
  modelMatchesIntended: boolean;
  reasoningQuality: NonNullable<ExamAttempt["reasoningQuality"]>;
  reasoningSignals: NonNullable<ExamAttempt["reasoningSignals"]>;
} {
  const pattern = cartExamPattern(input.patternId);
  const correct = Boolean(
    pattern && input.selectedAnswer === pattern.correctAnswer,
  );
  const representationMatchesIntended = Boolean(
    pattern && input.representation === intendedCartExamRepresentation(pattern),
  );
  const modelMatchesIntended = Boolean(
    pattern && input.modelRecognition === intendedCartExamModel(pattern),
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
    reasoningQuality: classifyCartExamReasoning({
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

export function hasStructuredCartExamEvidence(attempt: ExamAttempt): boolean {
  const representation = attempt.representation ?? [];
  const model = attempt.modelRecognition ?? attempt.modelFocus ?? "";
  return (
    representation.length > 0 &&
    model.length > 0 &&
    Boolean(attempt.selectedAnswer) &&
    hasOwnWords(attempt.reasoning ?? "")
  );
}

export function cartExamAttemptsFor(
  attempts: ExamAttempt[],
  patternId: string,
): ExamAttempt[] {
  return attempts.filter(
    (attempt) => (attempt.patternId ?? attempt.questionId) === patternId,
  );
}

export function hasCompletedCartExamItem(
  attempts: ExamAttempt[],
  patternId: string,
): boolean {
  return cartExamAttemptsFor(attempts, patternId).some(hasStructuredCartExamEvidence);
}

export function canRetryCartExamItem(
  attempts: ExamAttempt[],
  patternId: string,
): boolean {
  const forItem = cartExamAttemptsFor(attempts, patternId).filter(
    hasStructuredCartExamEvidence,
  );
  const latest = forItem.at(-1);
  if (!latest || latest.correct) {
    return false;
  }
  return forItem.length < CART_EXAM_MAX_ATTEMPTS_PER_ITEM;
}

export function hasCompletedCartExam(
  attempts: ExamAttempt[],
  patternIds: readonly string[] = CART_EXAM_PATTERN_IDS,
): boolean {
  return stabilizeExamPatternIds(patternIds).every((id) =>
    hasCompletedCartExamItem(attempts, id),
  );
}

export function currentCartExamPatternId(
  attempts: ExamAttempt[],
  draft: Pick<CartExamDraft, "patternIds" | "currentPatternId" | "retiredPatternIds">,
): string | null {
  const patternIds = stabilizeExamPatternIds(draft.patternIds);
  const retired = new Set(draft.retiredPatternIds);
  const current = draft.currentPatternId;
  if (
    current &&
    patternIds.includes(current) &&
    !retired.has(current) &&
    (canRetryCartExamItem(attempts, current) ||
      !hasCompletedCartExamItem(attempts, current))
  ) {
    return current;
  }
  return (
    patternIds.find(
      (id) =>
        !retired.has(id) &&
        (canRetryCartExamItem(attempts, id) || !hasCompletedCartExamItem(attempts, id)),
    ) ?? null
  );
}

export function isCartExamSessionOpen(
  attempts: ExamAttempt[],
  draft: Pick<CartExamDraft, "patternIds" | "currentPatternId" | "retiredPatternIds">,
): boolean {
  return currentCartExamPatternId(attempts, draft) !== null;
}

export function nextCartExamDraft(
  attempts: ExamAttempt[],
  previous: CartExamDraft,
  justAnsweredPatternId: string,
): CartExamDraft {
  const patternIds = stabilizeExamPatternIds(previous.patternIds);
  const retired = new Set(previous.retiredPatternIds);

  if (canRetryCartExamItem(attempts, justAnsweredPatternId)) {
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
  const nextId = currentCartExamPatternId(attempts, {
    patternIds,
    currentPatternId: "",
    retiredPatternIds: [...retired],
  });

  if (!nextId) {
    return {
      ...emptyCartExamDraft(patternIds),
      currentPatternId: justAnsweredPatternId,
      step: "answer",
      retiredPatternIds: [...retired],
    };
  }

  return {
    ...emptyCartExamDraft(patternIds),
    currentPatternId: nextId,
    retiredPatternIds: [...retired],
  };
}

export function retireCartExamDraft(
  attempts: ExamAttempt[],
  previous: CartExamDraft,
): CartExamDraft {
  const patternIds = stabilizeExamPatternIds(previous.patternIds);
  const retired = new Set(previous.retiredPatternIds);
  retired.add(previous.currentPatternId);
  const nextId = currentCartExamPatternId(attempts, {
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
    ...emptyCartExamDraft(patternIds),
    currentPatternId: nextId,
    retiredPatternIds: [...retired],
  };
}

export function summarizeCartExamAttempt(attempt: ExamAttempt): string {
  if (attempt.correct && attempt.reasoningQuality === "strong") {
    return "这题的选择和理由都用到了刚才的关系。";
  }
  if (attempt.correct && attempt.reasoningQuality === "weak") {
    return "选项选对了。理由还要再写出题目里真正用到的关系。";
  }
  if (attempt.correct) {
    return "选项选对了。理由可以再对照题目条件写清楚一点。";
  }
  return "先回到题目：力和运动是不是同一件事？合力为零是不是一定静止？";
}

export function completeCartExamInput(
  patternId: string,
  timestamp: string,
): CartExamInput {
  const pattern = cartExamPattern(patternId);
  if (!pattern) {
    throw new Error(`Missing canonical examPattern: ${patternId}`);
  }
  return {
    patternId,
    representation: intendedCartExamRepresentation(pattern),
    modelRecognition: intendedCartExamModel(pattern),
    selectedAnswer: pattern.correctAnswer,
    reasoning: `${pattern.requiredReasoning.join("，")}。`,
    timestamp,
  };
}

export function completedCartExamAttempts(timestamp = "t"): ExamAttempt[] {
  return CART_EXAM_PATTERN_IDS.map((id, index) =>
    buildCartExamAttempt(completeCartExamInput(id, `${timestamp}-${index}`)),
  );
}

export function looksLikeCartExamAnswerLeak(message: string): boolean {
  if (/正确答案是|应该选|答案就是|答案是\s*[ABCD]|选[ABCD][，。]/.test(message)) {
    return true;
  }
  return cartExamCorrectAnswers().some(
    (answer) => answer.length > 0 && message.includes(answer),
  );
}

function stabilizeExamPatternIds(patternIds: readonly string[]): string[] {
  const allowed = new Set<string>(CART_EXAM_PATTERN_IDS);
  const kept = patternIds.filter((id) => allowed.has(id));
  if (kept.length > 0) {
    return kept;
  }
  return [...CART_EXAM_PATTERN_IDS];
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

function classifyCartExamReasoning(input: {
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
