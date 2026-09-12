import { chemicalEnergyMechanicalAssessmentOverlay } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/assessment-overlay";
import { examPatterns } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/exam";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import type { ExamAttempt } from "@/types/learning";
import type { ExamPattern } from "@/types/physics-model";

/**
 * Production Exam World uses a stable representative subset of the
 * canonical examPatterns. The model library remains the full source.
 *
 * Coverage:
 * A. model recognition — exam-power-stroke-energy-conversion
 * B. causal / condition reasoning — exam-why-power-stroke-works
 * C. representation variation — exam-stroke-diagram-energy-flow
 */
export const ENGINE_EXAM_PATTERN_IDS = [
  "exam-power-stroke-energy-conversion",
  "exam-why-power-stroke-works",
  "exam-stroke-diagram-energy-flow",
] as const;

export const ENGINE_EXAM_MAX_ATTEMPTS_PER_ITEM = 2;

export const ENGINE_EXAM_DRAFT_KIND = "engine-exam-draft";

/**
 * Derived from AssessmentOverlay. Do not treat representationOptions[0]
 * or modelOptions[0] as the correctness contract.
 */
export const ENGINE_EXAM_INTENDED_REPRESENTATION: Record<string, string> =
  Object.fromEntries(
    Object.entries(chemicalEnergyMechanicalAssessmentOverlay.exam ?? {}).map(
      ([id, definition]) => [id, definition.intendedRepresentation],
    ),
  );

export type EngineExamStep = "representation" | "model" | "answer";

export interface EngineExamDraft {
  kind: typeof ENGINE_EXAM_DRAFT_KIND;
  patternIds: string[];
  currentPatternId: string;
  step: EngineExamStep;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  retiredPatternIds: string[];
}

export interface EngineExamInput {
  patternId: string;
  representation: string;
  modelRecognition: string;
  selectedAnswer: string;
  reasoning: string;
  timestamp: string;
}

export function engineExamPatterns(): ExamPattern[] {
  return ENGINE_EXAM_PATTERN_IDS.map((id) => {
    const pattern = examPatterns.find((item) => item.id === id);
    if (!pattern) {
      throw new Error(`Missing canonical examPattern: ${id}`);
    }
    return pattern;
  });
}

export function engineExamPattern(patternId: string): ExamPattern | undefined {
  return examPatterns.find((item) => item.id === patternId);
}

export function engineExamCorrectAnswers(): string[] {
  return engineExamPatterns().map((pattern) => pattern.correctAnswer);
}

export function engineExamCognitiveActions(): string[] {
  return [
    ...new Set(
      engineExamPatterns().flatMap((pattern) => pattern.requiredCognitiveActions),
    ),
  ];
}

export function intendedExamRepresentation(pattern: ExamPattern): string {
  const intended =
    chemicalEnergyMechanicalAssessmentOverlay.exam?.[pattern.id]
      ?.intendedRepresentation;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam representation: ${pattern.id}`);
  }
  return intended;
}

export function intendedExamModel(pattern: ExamPattern): string {
  const intended =
    chemicalEnergyMechanicalAssessmentOverlay.exam?.[pattern.id]?.intendedModel;
  if (!intended) {
    throw new Error(`Missing AssessmentOverlay exam model: ${pattern.id}`);
  }
  return intended;
}

export function engineExamAnswerOptionsVisible(step: EngineExamStep): boolean {
  return step === "answer";
}

export function emptyEngineExamDraft(
  patternIds: readonly string[] = ENGINE_EXAM_PATTERN_IDS,
): EngineExamDraft {
  const ids = stabilizeExamPatternIds(patternIds);
  return {
    kind: ENGINE_EXAM_DRAFT_KIND,
    patternIds: ids,
    currentPatternId: ids[0] ?? ENGINE_EXAM_PATTERN_IDS[0],
    step: "representation",
    representation: "",
    modelRecognition: "",
    selectedAnswer: "",
    reasoning: "",
    retiredPatternIds: [],
  };
}

export function canCommitEngineExamAttempt(input: EngineExamInput): boolean {
  return (
    input.representation.trim().length > 0 &&
    input.modelRecognition.trim().length > 0 &&
    input.selectedAnswer.trim().length > 0 &&
    hasOwnWords(input.reasoning)
  );
}

export function buildEngineExamAttempt(input: EngineExamInput): ExamAttempt {
  const pattern = engineExamPattern(input.patternId);
  const evaluation = evaluateEngineExamAttempt(input);
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

export function evaluateEngineExamAttempt(input: EngineExamInput): {
  correct: boolean;
  representationMatchesIntended: boolean;
  modelMatchesIntended: boolean;
  reasoningQuality: NonNullable<ExamAttempt["reasoningQuality"]>;
  reasoningSignals: NonNullable<ExamAttempt["reasoningSignals"]>;
} {
  const pattern = engineExamPattern(input.patternId);
  const correct = Boolean(
    pattern && input.selectedAnswer === pattern.correctAnswer,
  );
  const representationMatchesIntended = Boolean(
    pattern && input.representation === intendedExamRepresentation(pattern),
  );
  const modelMatchesIntended = Boolean(
    pattern && input.modelRecognition === intendedExamModel(pattern),
  );
  const ownWords = hasOwnWords(input.reasoning);
  const addressesRequiredReasoning = addressesExamReasoning(
    input.reasoning,
    pattern?.requiredReasoning ?? [],
  );
  const reasoningSignals = {
    hasOwnWords: ownWords,
    addressesRequiredReasoning,
  };

  return {
    correct,
    representationMatchesIntended,
    modelMatchesIntended,
    reasoningQuality: classifyEngineExamReasoning({
      correct,
      ownWords,
      addressesRequiredReasoning,
    }),
    reasoningSignals,
  };
}

export function hasStructuredEngineExamEvidence(attempt: ExamAttempt): boolean {
  const representation = attempt.representation ?? [];
  const model = attempt.modelRecognition ?? attempt.modelFocus ?? "";
  return (
    representation.length > 0 &&
    model.length > 0 &&
    Boolean(attempt.selectedAnswer) &&
    hasOwnWords(attempt.reasoning ?? "")
  );
}

export function engineExamAttemptsFor(
  attempts: ExamAttempt[],
  patternId: string,
): ExamAttempt[] {
  return attempts.filter(
    (attempt) => (attempt.patternId ?? attempt.questionId) === patternId,
  );
}

export function hasCompletedEngineExamItem(
  attempts: ExamAttempt[],
  patternId: string,
): boolean {
  return engineExamAttemptsFor(attempts, patternId).some(
    hasStructuredEngineExamEvidence,
  );
}

export function canRetryEngineExamItem(
  attempts: ExamAttempt[],
  patternId: string,
): boolean {
  const forItem = engineExamAttemptsFor(attempts, patternId).filter(
    hasStructuredEngineExamEvidence,
  );
  const latest = forItem.at(-1);
  if (!latest || latest.correct) {
    return false;
  }
  return forItem.length < ENGINE_EXAM_MAX_ATTEMPTS_PER_ITEM;
}

export function hasCompletedEngineExam(
  attempts: ExamAttempt[],
  patternIds: readonly string[] = ENGINE_EXAM_PATTERN_IDS,
): boolean {
  return stabilizeExamPatternIds(patternIds).every((id) =>
    hasCompletedEngineExamItem(attempts, id),
  );
}

export function currentEngineExamPatternId(
  attempts: ExamAttempt[],
  draft: Pick<EngineExamDraft, "patternIds" | "currentPatternId" | "retiredPatternIds">,
): string | null {
  const patternIds = stabilizeExamPatternIds(draft.patternIds);
  const retired = new Set(draft.retiredPatternIds);
  const current = draft.currentPatternId;
  if (
    current &&
    patternIds.includes(current) &&
    !retired.has(current) &&
    (canRetryEngineExamItem(attempts, current) ||
      !hasCompletedEngineExamItem(attempts, current))
  ) {
    return current;
  }
  return (
    patternIds.find(
      (id) =>
        !retired.has(id) &&
        (canRetryEngineExamItem(attempts, id) ||
          !hasCompletedEngineExamItem(attempts, id)),
    ) ?? null
  );
}

export function isEngineExamSessionOpen(
  attempts: ExamAttempt[],
  draft: Pick<EngineExamDraft, "patternIds" | "currentPatternId" | "retiredPatternIds">,
): boolean {
  return currentEngineExamPatternId(attempts, draft) !== null;
}

export function nextEngineExamDraft(
  attempts: ExamAttempt[],
  previous: EngineExamDraft,
  justAnsweredPatternId: string,
): EngineExamDraft {
  const patternIds = stabilizeExamPatternIds(previous.patternIds);
  const retired = new Set(previous.retiredPatternIds);

  if (canRetryEngineExamItem(attempts, justAnsweredPatternId)) {
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
  const nextId = currentEngineExamPatternId(attempts, {
    patternIds,
    currentPatternId: "",
    retiredPatternIds: [...retired],
  });

  if (!nextId) {
    return {
      ...emptyEngineExamDraft(patternIds),
      currentPatternId: justAnsweredPatternId,
      step: "answer",
      retiredPatternIds: [...retired],
    };
  }

  return {
    ...emptyEngineExamDraft(patternIds),
    currentPatternId: nextId,
    retiredPatternIds: [...retired],
  };
}

export function retireEngineExamDraft(
  attempts: ExamAttempt[],
  previous: EngineExamDraft,
): EngineExamDraft {
  const patternIds = stabilizeExamPatternIds(previous.patternIds);
  const retired = new Set(previous.retiredPatternIds);
  retired.add(previous.currentPatternId);
  const nextId = currentEngineExamPatternId(attempts, {
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
    ...emptyEngineExamDraft(patternIds),
    currentPatternId: nextId,
    retiredPatternIds: [...retired],
  };
}

export function latestEngineExamDraft(
  events: Array<{ metadata?: Record<string, unknown> }>,
): EngineExamDraft | null {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const metadata = events[index]?.metadata;
    if (metadata?.kind !== ENGINE_EXAM_DRAFT_KIND) {
      continue;
    }
    const patternIds = stabilizeExamPatternIds(
      Array.isArray(metadata.patternIds)
        ? (metadata.patternIds as string[])
        : ENGINE_EXAM_PATTERN_IDS,
    );
    const currentPatternId =
      typeof metadata.currentPatternId === "string"
        ? metadata.currentPatternId
        : patternIds[0] ?? ENGINE_EXAM_PATTERN_IDS[0];
    const step = metadata.step;
    const retiredPatternIds = Array.isArray(metadata.retiredPatternIds)
      ? (metadata.retiredPatternIds as string[]).filter(
          (id) => typeof id === "string",
        )
      : [];
    return {
      kind: ENGINE_EXAM_DRAFT_KIND,
      patternIds,
      currentPatternId,
      step:
        step === "model" || step === "answer" || step === "representation"
          ? step
          : "representation",
      representation:
        typeof metadata.representation === "string" ? metadata.representation : "",
      modelRecognition:
        typeof metadata.modelRecognition === "string"
          ? metadata.modelRecognition
          : "",
      selectedAnswer:
        typeof metadata.selectedAnswer === "string" ? metadata.selectedAnswer : "",
      reasoning: typeof metadata.reasoning === "string" ? metadata.reasoning : "",
      retiredPatternIds,
    };
  }
  return null;
}

export function summarizeEngineExamAttempt(attempt: ExamAttempt): string {
  if (attempt.correct && attempt.reasoningQuality === "strong") {
    return "这题的选择和理由都用到了刚才的关系。";
  }
  if (attempt.correct && attempt.reasoningQuality === "weak") {
    return "选项选对了。理由还要再写出题目里真正用到的关系。";
  }
  if (attempt.correct) {
    return "选项选对了。理由可以再对照题目条件写清楚一点。";
  }
  return "先回到题目里：哪个条件决定了机械输出能不能真正发生？";
}

export function completeEngineExamInput(
  patternId: string,
  timestamp: string,
): EngineExamInput {
  const pattern = engineExamPattern(patternId);
  if (!pattern) {
    throw new Error(`Missing canonical examPattern: ${patternId}`);
  }
  return {
    patternId,
    representation: intendedExamRepresentation(pattern),
    modelRecognition: intendedExamModel(pattern),
    selectedAnswer: pattern.correctAnswer,
    reasoning: `${pattern.requiredReasoning.join("，")}。`,
    timestamp,
  };
}

export function looksLikeEngineExamAnswerLeak(message: string): boolean {
  if (
    /正确答案是|应该选|答案就是|答案是\s*[ABCD]|选[ABCD][，。]/.test(message)
  ) {
    return true;
  }
  return engineExamCorrectAnswers().some(
    (answer) => answer.length > 0 && message.includes(answer),
  );
}

function stabilizeExamPatternIds(patternIds: readonly string[]): string[] {
  const allowed = new Set<string>(ENGINE_EXAM_PATTERN_IDS);
  const kept = patternIds.filter((id) => allowed.has(id));
  if (kept.length > 0) {
    return kept;
  }
  return [...ENGINE_EXAM_PATTERN_IDS];
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

function classifyEngineExamReasoning(input: {
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
  if (input.addressesRequiredReasoning) {
    return "adequate";
  }
  return "adequate";
}
