import { extractForceMotionSignals } from "@/content/physics-models/force-changes-motion-state/evaluator";
import { independentChallenges } from "@/content/physics-models/force-changes-motion-state/independent-challenges";
import { forceChangesMotionStateAssessmentOverlay } from "@/content/physics-models/force-changes-motion-state/assessment-overlay";
import type {
  IndependentJudgmentOption,
  IndependentPostCheckOption,
} from "@/lib/runtime/types";
import { LearningStage } from "@/types/learning";
import type {
  IndependentAssessment,
  IndependentChallengeAttempt,
  IndependentReasoningSignals,
  LearningSession,
} from "@/types/learning";
import type { IndependentChallenge } from "@/types/physics-model";

/**
 * Production AI_OFF uses the Physics Model independent challenges.
 * IndependentChallenge has no options or correctAnswer; AssessmentOverlay
 * owns student-facing judgments and the post-commit structured check.
 */
export const CART_AI_OFF_CHALLENGE_IDS = [
  "ai-off-unfamiliar-hover-sled",
  "ai-off-condition-tug-moving-crate",
] as const;

export const CART_AI_OFF_DRAFT_KIND = "cart-ai-off-draft";

export const MIN_CART_INDEPENDENT_HAN_CHARS = 8;

export type CartAiOffStep = "response" | "post-check";

export type CartAiOffJudgmentOption = IndependentJudgmentOption;
export type CartAiOffPostCheckOption = IndependentPostCheckOption;

export interface CartAiOffDraft {
  kind: typeof CART_AI_OFF_DRAFT_KIND;
  challengeIds: string[];
  currentChallengeId: string;
  step: CartAiOffStep;
  selectedAnswer: string;
  reasoning: string;
  postCheckSelections: string[];
  retiredChallengeIds: string[];
}

export interface CartAiOffIndependentInput {
  challengeId: string;
  selectedAnswer: string;
  studentReasoning: string;
  timestamp: string;
}

export interface CartAiOffPostCheckInput {
  challengeId: string;
  postCheckIds: string[];
}

export function cartAiOffChallenges(): IndependentChallenge[] {
  return CART_AI_OFF_CHALLENGE_IDS.map((id) => {
    const challenge = independentChallenges.find((item) => item.id === id);
    if (!challenge) {
      throw new Error(`Missing canonical independent challenge: ${id}`);
    }
    return challenge;
  });
}

export function cartAiOffChallenge(challengeId: string): IndependentChallenge {
  const challenge = independentChallenges.find((item) => item.id === challengeId);
  if (!challenge) {
    throw new Error(`Missing canonical independent challenge: ${challengeId}`);
  }
  return challenge;
}

export function cartAiOffJudgments(challengeId: string): CartAiOffJudgmentOption[] {
  return (
    forceChangesMotionStateAssessmentOverlay.independent?.[challengeId]?.judgments ??
    []
  );
}

export function cartAiOffPostCheckOptions(
  challengeId: string,
): CartAiOffPostCheckOption[] {
  return (
    forceChangesMotionStateAssessmentOverlay.independent?.[challengeId]?.postCheck ??
    []
  );
}

export function intendedCartAiOffAnswerId(challengeId: string): string {
  const intended = cartAiOffJudgments(challengeId).find((option) => option.correct);
  if (!intended) {
    throw new Error(`Missing intended AI_OFF judgment: ${challengeId}`);
  }
  return intended.id;
}

export function intendedCartAiOffPostCheckIds(challengeId: string): string[] {
  return cartAiOffPostCheckOptions(challengeId)
    .filter((option) => option.required)
    .map((option) => option.id);
}

export function emptyCartAiOffDraft(
  challengeIds: readonly string[] = CART_AI_OFF_CHALLENGE_IDS,
): CartAiOffDraft {
  const ids = stabilizeAiOffChallengeIds(challengeIds);
  return {
    kind: CART_AI_OFF_DRAFT_KIND,
    challengeIds: ids,
    currentChallengeId: ids[0] ?? CART_AI_OFF_CHALLENGE_IDS[0],
    step: "response",
    selectedAnswer: "",
    reasoning: "",
    postCheckSelections: [],
    retiredChallengeIds: [],
  };
}

export function hasMeaningfulCartIndependentReasoning(text: string): boolean {
  const trimmed = text.trim();
  const han = trimmed.match(/[\u4e00-\u9fff]/g) ?? [];
  return han.length >= MIN_CART_INDEPENDENT_HAN_CHARS;
}

export function canCommitCartAiOffResponse(
  input: CartAiOffIndependentInput,
): boolean {
  return (
    input.selectedAnswer.trim().length > 0 &&
    hasMeaningfulCartIndependentReasoning(input.studentReasoning)
  );
}

export function postCheckMatchesRequired(
  challengeId: string,
  postCheckIds: readonly string[],
): boolean {
  const options = cartAiOffPostCheckOptions(challengeId);
  const selected = new Set(postCheckIds);
  const required = options.filter((option) => option.required);
  const distractors = options.filter((option) => option.distractor);
  if (required.length === 0) {
    return false;
  }
  return (
    required.every((option) => selected.has(option.id)) &&
    distractors.every((option) => !selected.has(option.id))
  );
}

export function evaluateCartAiOffAttempt(input: {
  challengeId: string;
  selectedAnswer: string;
  studentReasoning: string;
  postCheckIds: readonly string[];
  llmUsed: boolean;
}): {
  answerCorrect: boolean;
  accepted: boolean;
  reasoningSignals: IndependentReasoningSignals;
} {
  const selected = new Set(input.postCheckIds);
  const signals = extractForceMotionSignals(input.studentReasoning);
  const answerCorrect =
    input.selectedAnswer === intendedCartAiOffAnswerId(input.challengeId);
  const hasOwnWords = hasMeaningfulCartIndependentReasoning(input.studentReasoning);
  const matchesPostCheck = postCheckMatchesRequired(
    input.challengeId,
    input.postCheckIds,
  );
  const crateChallenge = input.challengeId === "ai-off-condition-tug-moving-crate";
  const avoidsForceMotionMisconception =
    !signals.claimsForceMeansMotion &&
    !signals.claimsMotionNeedsForwardForce &&
    !signals.claimsZeroNetForceMustStop &&
    !signals.claimsBalancedMeansNoForce &&
    !looksLikeWheelsOnly(input.studentReasoning) &&
    !looksLikeCartIndependentNounSandwich(input.studentReasoning);
  const preCommitCurrentMotionState = hasPreCommitCartCurrentMotion(
    input.studentReasoning,
  );
  const preCommitNetForceCondition = hasPreCommitCartNetForce(
    input.studentReasoning,
    crateChallenge,
  );
  const preCommitRelation = hasPreCommitCartUnchangedRelation(
    input.studentReasoning,
  );
  const preCommitConditionOrBoundary = crateChallenge
    ? hasPreCommitCartCrateBoundary(input.studentReasoning)
    : preCommitCurrentMotionState &&
      preCommitNetForceCondition &&
      preCommitRelation;
  const postCheckCurrentMotionState = selected.has("identifiesCurrentMotionState");
  const postCheckNetForceCondition = selected.has("identifiesNetForceCondition");
  const postCheckConditionOrBoundary = crateChallenge
    ? selected.has("distinguishesBalancedFromAbsentForce") &&
      selected.has("checksZeroNetForceUnchangedCondition")
    : selected.has("identifiesMotionStateChange") &&
      selected.has("identifiesNetForceCondition");

  const reasoningSignals: IndependentReasoningSignals = {
    identifiesCurrentMotionState: preCommitCurrentMotionState,
    identifiesNetForceCondition: preCommitNetForceCondition,
    identifiesMotionStateChange: preCommitRelation,
    distinguishesForceFromMotion: avoidsForceMotionMisconception,
    checksZeroNetForceUnchangedCondition: preCommitRelation,
    distinguishesBalancedFromAbsentForce: crateChallenge
      ? preCommitConditionOrBoundary
      : false,
    identifiesConditionOrBoundary: preCommitConditionOrBoundary,
    avoidsForceMotionMisconception,
    preCommitCurrentMotionState,
    preCommitNetForceCondition,
    preCommitRelation,
    preCommitConditionOrBoundary,
    postCheckCurrentMotionState,
    postCheckNetForceCondition,
    postCheckConditionOrBoundary,
    hasOwnWords,
    postCheckMatchesRequired: matchesPostCheck,
  };

  const accepted =
    answerCorrect &&
    hasOwnWords &&
    matchesPostCheck &&
    avoidsForceMotionMisconception &&
    preCommitCurrentMotionState &&
    preCommitNetForceCondition &&
    preCommitRelation &&
    preCommitConditionOrBoundary === true &&
    input.llmUsed === false;

  return { answerCorrect, accepted, reasoningSignals };
}

export function buildCartAiOffAttempt(
  input: CartAiOffIndependentInput,
  postCheckIds: readonly string[] = [],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateCartAiOffAttempt({
    challengeId: input.challengeId,
    selectedAnswer: input.selectedAnswer,
    studentReasoning: input.studentReasoning,
    postCheckIds,
    llmUsed,
  });
  return {
    challengeId: input.challengeId,
    selectedAnswer: input.selectedAnswer,
    studentReasoning: input.studentReasoning,
    answerCorrect: evaluation.answerCorrect,
    reasoningSignals: evaluation.reasoningSignals,
    postCheckIds: [...postCheckIds],
    timestamp: input.timestamp,
    accepted: evaluation.accepted,
    llmUsed: false,
    completedWithoutAI: true,
  };
}

export function applyCartAiOffPostCheck(
  attempt: IndependentChallengeAttempt,
  postCheckIds: readonly string[],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateCartAiOffAttempt({
    challengeId: attempt.challengeId,
    selectedAnswer: attempt.selectedAnswer,
    studentReasoning: attempt.studentReasoning,
    postCheckIds,
    llmUsed,
  });
  return {
    ...attempt,
    selectedAnswer: attempt.selectedAnswer,
    studentReasoning: attempt.studentReasoning,
    answerCorrect: evaluation.answerCorrect,
    reasoningSignals: evaluation.reasoningSignals,
    postCheckIds: [...postCheckIds],
    accepted: evaluation.accepted,
    llmUsed: false,
    completedWithoutAI: true,
  };
}

export function cartAiOffAttemptsFor(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): IndependentChallengeAttempt[] {
  return (assessment?.challengeAttempts ?? []).filter(
    (attempt) => attempt.challengeId === challengeId,
  );
}

export function latestCartAiOffAttempt(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): IndependentChallengeAttempt | undefined {
  return cartAiOffAttemptsFor(assessment, challengeId).at(-1);
}

export function hasAcceptedCartAiOffChallenge(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): boolean {
  return cartAiOffAttemptsFor(assessment, challengeId).some(
    (attempt) =>
      attempt.accepted &&
      attempt.llmUsed === false &&
      attempt.completedWithoutAI === true,
  );
}

export function hasAcceptedCartAiOffChallenges(
  assessment: IndependentAssessment | undefined,
  challengeIds: readonly string[] = CART_AI_OFF_CHALLENGE_IDS,
): boolean {
  return stabilizeAiOffChallengeIds(challengeIds).every((id) =>
    hasAcceptedCartAiOffChallenge(assessment, id),
  );
}

export function cartTutorUsedDuringIndependent(session: LearningSession): boolean {
  if (session.independentAssessment?.llmUsed === true) {
    return true;
  }
  const blocked = new Set<string>([LearningStage.AI_OFF, LearningStage.COMPLETE]);
  if (session.aiInteractions.some((item) => blocked.has(item.stage))) {
    return true;
  }
  return session.events.some(
    (event) => event.type === "ai_interaction" && blocked.has(event.stage),
  );
}

export function hasCompletedCartAiOff(session: LearningSession): boolean {
  return (
    hasAcceptedCartAiOffChallenges(session.independentAssessment) &&
    session.independentAssessment?.llmUsed === false &&
    session.independentAssessment.completedWithoutAI === true &&
    !cartTutorUsedDuringIndependent(session)
  );
}

export function currentCartAiOffChallengeId(
  assessment: IndependentAssessment | undefined,
  draft: Pick<
    CartAiOffDraft,
    "challengeIds" | "currentChallengeId" | "retiredChallengeIds"
  >,
): string | null {
  const challengeIds = stabilizeAiOffChallengeIds(draft.challengeIds);
  const retired = new Set(draft.retiredChallengeIds);
  const current = draft.currentChallengeId;
  if (
    current &&
    challengeIds.includes(current) &&
    !retired.has(current) &&
    !hasAcceptedCartAiOffChallenge(assessment, current)
  ) {
    return current;
  }
  return (
    challengeIds.find(
      (id) => !retired.has(id) && !hasAcceptedCartAiOffChallenge(assessment, id),
    ) ?? null
  );
}

export function isCartAiOffSessionOpen(
  assessment: IndependentAssessment | undefined,
  draft: Pick<
    CartAiOffDraft,
    "challengeIds" | "currentChallengeId" | "retiredChallengeIds"
  >,
): boolean {
  return currentCartAiOffChallengeId(assessment, draft) !== null;
}

export function nextCartAiOffDraft(
  assessment: IndependentAssessment | undefined,
  previous: CartAiOffDraft,
  justChallengeId: string,
): CartAiOffDraft {
  const challengeIds = stabilizeAiOffChallengeIds(previous.challengeIds);
  const retired = new Set(previous.retiredChallengeIds);
  if (hasAcceptedCartAiOffChallenge(assessment, justChallengeId)) {
    retired.add(justChallengeId);
  }
  const nextId = currentCartAiOffChallengeId(assessment, {
    challengeIds,
    currentChallengeId: "",
    retiredChallengeIds: [...retired],
  });
  if (!nextId) {
    return {
      ...emptyCartAiOffDraft(challengeIds),
      currentChallengeId: justChallengeId,
      step: "post-check",
      retiredChallengeIds: [...retired],
    };
  }
  if (nextId === justChallengeId) {
    return {
      ...previous,
      challengeIds,
      currentChallengeId: nextId,
      step: "post-check",
      retiredChallengeIds: [...retired],
    };
  }
  return {
    ...emptyCartAiOffDraft(challengeIds),
    currentChallengeId: nextId,
    retiredChallengeIds: [...retired],
  };
}

export function retryCartAiOffDraft(
  previous: CartAiOffDraft,
  challengeId: string,
): CartAiOffDraft {
  return {
    ...previous,
    currentChallengeId: challengeId,
    step: "response",
    selectedAnswer: "",
    reasoning: "",
    postCheckSelections: [],
  };
}

export function buildCartAiOffAssessment(
  attempts: IndependentChallengeAttempt[],
  llmUsed: boolean,
): IndependentAssessment {
  const accepted = hasAcceptedCartAiOffChallenges({
    explanation: "",
    examResponses: {},
    completedWithoutAI: false,
    challengeAttempts: attempts,
  });
  const examResponses: Record<string, string> = {};
  for (const attempt of attempts) {
    examResponses[attempt.challengeId] = attempt.selectedAnswer;
  }
  return {
    explanation: attempts.map((attempt) => attempt.studentReasoning).join("\n"),
    examResponses,
    completedWithoutAI: accepted && !llmUsed,
    llmUsed,
    challengeAttempts: attempts,
  };
}

export function completeCartAiOffInput(
  challengeId: string,
  timestamp: string,
): CartAiOffIndependentInput & { postCheckIds: string[] } {
  const hover = challengeId === "ai-off-unfamiliar-hover-sled";
  return {
    challengeId,
    selectedAnswer: intendedCartAiOffAnswerId(challengeId),
    studentReasoning: hover
      ? "滑板原来已经在向右运动。这时水平合力可以看成零，运动状态保持不变，不必立刻停下。"
      : "两边的力大小几乎相等、方向相反，这是受力平衡，不是没有力。合力为零时，原来在滑动的木箱可以保持原来的运动。",
    timestamp,
    postCheckIds: intendedCartAiOffPostCheckIds(challengeId),
  };
}

export function completeCartAiOffAttempt(
  challengeId: string,
  timestamp: string,
): IndependentChallengeAttempt {
  const input = completeCartAiOffInput(challengeId, timestamp);
  return buildCartAiOffAttempt(input, input.postCheckIds, false);
}

export function cartJudgmentLabelFor(challengeId: string, answerId: string): string {
  return (
    cartAiOffJudgments(challengeId).find((option) => option.id === answerId)?.label ??
    answerId
  );
}

export function hasPreCommitCartCurrentMotion(text: string): boolean {
  return /(原来|已经在|正在|在滑|向右|向左|在运动)/.test(text.replace(/\s+/g, ""));
}

export function hasPreCommitCartNetForce(text: string, crateChallenge: boolean): boolean {
  const normalized = text.replace(/\s+/g, "");
  if (crateChallenge) {
    return /(合力为零|大小几乎相等|方向相反|受力平衡)/.test(normalized);
  }
  return /(合力.{0,8}零|看成零|接近零)/.test(normalized);
}

export function hasPreCommitCartUnchangedRelation(text: string): boolean {
  return /(保持|不必停|不用停|不变|继续运动)/.test(text.replace(/\s+/g, ""));
}

export function hasPreCommitCartCrateBoundary(text: string): boolean {
  const normalized = text.replace(/\s+/g, "");
  const balancedNotAbsent =
    /(受力平衡|平衡).{0,16}(不是没有力|不是一个力都没有|不是力不存在)/.test(
      normalized,
    ) || /不是没有力/.test(normalized);
  return (
    balancedNotAbsent &&
    hasPreCommitCartCurrentMotion(text) &&
    hasPreCommitCartUnchangedRelation(text)
  );
}

export function looksLikeCartIndependentNounSandwich(text: string): boolean {
  const normalized = text.replace(/\s+/g, "");
  const nouns = ["合力", "运动", "速度", "方向", "力"];
  const count = nouns.filter((noun) => normalized.includes(noun)).length;
  const hasRelation =
    /同一边|顶着|加快|减慢|保持|不变|为零|平衡|不必停/.test(normalized);
  return count >= 3 && !hasRelation;
}

function looksLikeWheelsOnly(text: string): boolean {
  const normalized = text.replace(/\s+/g, "");
  const surface = normalized.includes("轮子") || normalized.includes("都有轮");
  const structure =
    normalized.includes("合力") ||
    normalized.includes("运动状态") ||
    normalized.includes("平衡");
  return surface && !structure;
}

function stabilizeAiOffChallengeIds(challengeIds: readonly string[]): string[] {
  const allowed = new Set<string>(CART_AI_OFF_CHALLENGE_IDS);
  const kept = challengeIds.filter((id) => allowed.has(id));
  if (kept.length > 0) {
    return kept;
  }
  return [...CART_AI_OFF_CHALLENGE_IDS];
}
