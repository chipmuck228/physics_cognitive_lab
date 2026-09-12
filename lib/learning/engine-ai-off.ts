import { chemicalEnergyMechanicalAssessmentOverlay } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/assessment-overlay";
import { independentChallenges } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/independent-challenges";
import { extractCausalSignals } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/evaluator";
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
 * owns student-facing judgments and the post-commit structured check so
 * official evaluation stays deterministic without LLM grading or a
 * disconnected question bank.
 */
export const ENGINE_AI_OFF_CHALLENGE_IDS = [
  "ai-off-unfamiliar-combustion-piston",
  "ai-off-condition-locked-mechanism",
] as const;

export const ENGINE_AI_OFF_DRAFT_KIND = "engine-ai-off-draft";

export const MIN_INDEPENDENT_HAN_CHARS = 8;

export type EngineAiOffStep = "response" | "post-check";

export type EngineAiOffJudgmentOption = IndependentJudgmentOption;
export type EngineAiOffPostCheckOption = IndependentPostCheckOption;

export interface EngineAiOffDraft {
  kind: typeof ENGINE_AI_OFF_DRAFT_KIND;
  challengeIds: string[];
  currentChallengeId: string;
  step: EngineAiOffStep;
  selectedAnswer: string;
  reasoning: string;
  postCheckSelections: string[];
  retiredChallengeIds: string[];
}

export interface EngineAiOffIndependentInput {
  challengeId: string;
  selectedAnswer: string;
  studentReasoning: string;
  timestamp: string;
}

export interface EngineAiOffPostCheckInput {
  challengeId: string;
  postCheckIds: string[];
}

export function engineAiOffChallenges(): IndependentChallenge[] {
  return ENGINE_AI_OFF_CHALLENGE_IDS.map((id) => {
    const challenge = independentChallenges.find((item) => item.id === id);
    if (!challenge) {
      throw new Error(`Missing canonical independent challenge: ${id}`);
    }
    return challenge;
  });
}

export function engineAiOffChallenge(challengeId: string): IndependentChallenge {
  const challenge = independentChallenges.find((item) => item.id === challengeId);
  if (!challenge) {
    throw new Error(`Missing canonical independent challenge: ${challengeId}`);
  }
  return challenge;
}

export function engineAiOffJudgments(
  challengeId: string,
): EngineAiOffJudgmentOption[] {
  return (
    chemicalEnergyMechanicalAssessmentOverlay.independent?.[challengeId]
      ?.judgments ?? []
  );
}

export function engineAiOffPostCheckOptions(
  challengeId: string,
): EngineAiOffPostCheckOption[] {
  return (
    chemicalEnergyMechanicalAssessmentOverlay.independent?.[challengeId]
      ?.postCheck ?? []
  );
}

export function engineAiOffPostCheckUnlocked(step: EngineAiOffStep): boolean {
  return step === "post-check";
}

export function intendedAiOffAnswerId(challengeId: string): string {
  const intended = engineAiOffJudgments(challengeId).find((option) => option.correct);
  if (!intended) {
    throw new Error(`Missing intended AI_OFF judgment: ${challengeId}`);
  }
  return intended.id;
}

export function intendedAiOffPostCheckIds(challengeId: string): string[] {
  return engineAiOffPostCheckOptions(challengeId)
    .filter((option) => option.required)
    .map((option) => option.id);
}

export function emptyEngineAiOffDraft(
  challengeIds: readonly string[] = ENGINE_AI_OFF_CHALLENGE_IDS,
): EngineAiOffDraft {
  const ids = stabilizeAiOffChallengeIds(challengeIds);
  return {
    kind: ENGINE_AI_OFF_DRAFT_KIND,
    challengeIds: ids,
    currentChallengeId: ids[0] ?? ENGINE_AI_OFF_CHALLENGE_IDS[0],
    step: "response",
    selectedAnswer: "",
    reasoning: "",
    postCheckSelections: [],
    retiredChallengeIds: [],
  };
}

export function hasMeaningfulIndependentReasoning(text: string): boolean {
  const trimmed = text.trim();
  const han = trimmed.match(/[\u4e00-\u9fff]/g) ?? [];
  return han.length >= MIN_INDEPENDENT_HAN_CHARS;
}

export function canCommitEngineAiOffResponse(
  input: EngineAiOffIndependentInput,
): boolean {
  return (
    input.selectedAnswer.trim().length > 0 &&
    hasMeaningfulIndependentReasoning(input.studentReasoning)
  );
}

export function treatsCombustionAsDirectMotion(text: string): boolean {
  return extractCausalSignals(text).treatsCombustionAsDirectOutput;
}

export function treatsCombustionAsGuaranteedOutput(text: string): boolean {
  const normalized = text.replace(/\s+/g, "");
  return (
    /燃烧.{0,12}(一定|保证|肯定).{0,8}(输出|转动|机械能)/.test(normalized) ||
    normalized.includes("燃烧了就有输出") ||
    normalized.includes("燃烧就能输出")
  );
}

export function postCheckMatchesRequired(
  challengeId: string,
  postCheckIds: readonly string[],
): boolean {
  const options = engineAiOffPostCheckOptions(challengeId);
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

export function evaluateEngineAiOffAttempt(input: {
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
  const answerCorrect = input.selectedAnswer === intendedAiOffAnswerId(input.challengeId);
  const hasOwnWords = hasMeaningfulIndependentReasoning(input.studentReasoning);
  const selected = new Set(input.postCheckIds);
  const matchesPostCheck = postCheckMatchesRequired(
    input.challengeId,
    input.postCheckIds,
  );
  const avoidsDirect =
    !treatsCombustionAsDirectMotion(input.studentReasoning) &&
    !selected.has("distractor-direct-combustion") &&
    !selected.has("combustion-turns-cutter");
  const conditionLocked =
    input.challengeId === "ai-off-condition-locked-mechanism";
  const preCommitWorkRelation = hasPreCommitEngineWorkRelation(
    input.studentReasoning,
  );
  const preCommitConditionOrBoundary = conditionLocked
    ? hasPreCommitEngineLockedCondition(input.studentReasoning)
    : undefined;
  const postCheckWorkRelation = selected.has("identifiesWorkProcess");
  const postCheckConditionOrBoundary = conditionLocked
    ? selected.has("checksNecessaryConditions") &&
      selected.has("identifiesWorkProcess") &&
      !selected.has("distractor-combustion-guarantees")
    : undefined;

  const reasoningSignals: IndependentReasoningSignals = {
    identifiesWorkingSubstanceChange: selected.has("identifiesInternalEnergyChange"),
    identifiesMechanicalInteraction:
      selected.has("identifiesWorkProcess") || selected.has("identifiesMechanicalOutput"),
    identifiesWorkRelation: preCommitWorkRelation,
    identifiesConditionOrBoundary: preCommitConditionOrBoundary,
    avoidsDirectCombustionToMotion: avoidsDirect,
    preCommitWorkRelation,
    preCommitConditionOrBoundary,
    postCheckWorkRelation,
    postCheckConditionOrBoundary,
    hasOwnWords,
    postCheckMatchesRequired: matchesPostCheck,
  };

  const accepted =
    answerCorrect &&
    hasOwnWords &&
    matchesPostCheck &&
    avoidsDirect &&
    (conditionLocked
      ? preCommitConditionOrBoundary === true
      : preCommitWorkRelation) &&
    input.llmUsed === false;

  return { answerCorrect, accepted, reasoningSignals };
}

export function buildEngineAiOffAttempt(
  input: EngineAiOffIndependentInput,
  postCheckIds: readonly string[] = [],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateEngineAiOffAttempt({
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

export function applyEngineAiOffPostCheck(
  attempt: IndependentChallengeAttempt,
  postCheckIds: readonly string[],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateEngineAiOffAttempt({
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

export function engineAiOffAttemptsFor(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): IndependentChallengeAttempt[] {
  return (assessment?.challengeAttempts ?? []).filter(
    (attempt) => attempt.challengeId === challengeId,
  );
}

export function latestEngineAiOffAttempt(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): IndependentChallengeAttempt | undefined {
  return engineAiOffAttemptsFor(assessment, challengeId).at(-1);
}

export function hasAcceptedEngineAiOffChallenge(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): boolean {
  return engineAiOffAttemptsFor(assessment, challengeId).some(
    (attempt) =>
      attempt.accepted &&
      attempt.llmUsed === false &&
      attempt.completedWithoutAI === true,
  );
}

export function hasAcceptedEngineAiOffChallenges(
  assessment: IndependentAssessment | undefined,
  challengeIds: readonly string[] = ENGINE_AI_OFF_CHALLENGE_IDS,
): boolean {
  return stabilizeAiOffChallengeIds(challengeIds).every((id) =>
    hasAcceptedEngineAiOffChallenge(assessment, id),
  );
}

export function engineTutorUsedDuringIndependent(
  session: LearningSession,
): boolean {
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

export function hasCompletedEngineAiOff(session: LearningSession): boolean {
  return (
    hasAcceptedEngineAiOffChallenges(session.independentAssessment) &&
    session.independentAssessment?.llmUsed === false &&
    session.independentAssessment.completedWithoutAI === true &&
    !engineTutorUsedDuringIndependent(session)
  );
}

export function currentEngineAiOffChallengeId(
  assessment: IndependentAssessment | undefined,
  draft: Pick<
    EngineAiOffDraft,
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
    !hasAcceptedEngineAiOffChallenge(assessment, current)
  ) {
    return current;
  }
  return (
    challengeIds.find(
      (id) => !retired.has(id) && !hasAcceptedEngineAiOffChallenge(assessment, id),
    ) ?? null
  );
}

export function isEngineAiOffSessionOpen(
  assessment: IndependentAssessment | undefined,
  draft: Pick<
    EngineAiOffDraft,
    "challengeIds" | "currentChallengeId" | "retiredChallengeIds"
  >,
): boolean {
  return currentEngineAiOffChallengeId(assessment, draft) !== null;
}

export function nextEngineAiOffDraft(
  assessment: IndependentAssessment | undefined,
  previous: EngineAiOffDraft,
  justChallengeId: string,
): EngineAiOffDraft {
  const challengeIds = stabilizeAiOffChallengeIds(previous.challengeIds);
  const retired = new Set(previous.retiredChallengeIds);
  if (hasAcceptedEngineAiOffChallenge(assessment, justChallengeId)) {
    retired.add(justChallengeId);
  }
  const nextId = currentEngineAiOffChallengeId(assessment, {
    challengeIds,
    currentChallengeId: "",
    retiredChallengeIds: [...retired],
  });
  if (!nextId) {
    return {
      ...emptyEngineAiOffDraft(challengeIds),
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
    ...emptyEngineAiOffDraft(challengeIds),
    currentChallengeId: nextId,
    retiredChallengeIds: [...retired],
  };
}

export function retryEngineAiOffDraft(
  previous: EngineAiOffDraft,
  challengeId: string,
): EngineAiOffDraft {
  return {
    ...previous,
    currentChallengeId: challengeId,
    step: "response",
    selectedAnswer: "",
    reasoning: "",
    postCheckSelections: [],
  };
}

export function latestEngineAiOffDraft(
  events: Array<{ metadata?: Record<string, unknown> }>,
): EngineAiOffDraft | null {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const metadata = events[index]?.metadata;
    if (metadata?.kind !== ENGINE_AI_OFF_DRAFT_KIND) {
      continue;
    }
    const challengeIds = stabilizeAiOffChallengeIds(
      Array.isArray(metadata.challengeIds)
        ? (metadata.challengeIds as string[])
        : ENGINE_AI_OFF_CHALLENGE_IDS,
    );
    const currentChallengeId =
      typeof metadata.currentChallengeId === "string"
        ? metadata.currentChallengeId
        : challengeIds[0] ?? ENGINE_AI_OFF_CHALLENGE_IDS[0];
    const step = metadata.step === "post-check" ? "post-check" : "response";
    const retiredChallengeIds = Array.isArray(metadata.retiredChallengeIds)
      ? (metadata.retiredChallengeIds as string[]).filter(
          (id) => typeof id === "string",
        )
      : [];
    return {
      kind: ENGINE_AI_OFF_DRAFT_KIND,
      challengeIds,
      currentChallengeId,
      step,
      selectedAnswer:
        typeof metadata.selectedAnswer === "string" ? metadata.selectedAnswer : "",
      reasoning: typeof metadata.reasoning === "string" ? metadata.reasoning : "",
      postCheckSelections: Array.isArray(metadata.postCheckSelections)
        ? (metadata.postCheckSelections as string[]).filter(
            (id) => typeof id === "string",
          )
        : [],
      retiredChallengeIds,
    };
  }
  return null;
}

export function buildEngineAiOffAssessment(
  attempts: IndependentChallengeAttempt[],
  llmUsed: boolean,
): IndependentAssessment {
  const accepted = hasAcceptedEngineAiOffChallenges({
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

export function completeEngineAiOffInput(
  challengeId: string,
  timestamp: string,
): EngineAiOffIndependentInput & { postCheckIds: string[] } {
  return {
    challengeId,
    selectedAnswer: intendedAiOffAnswerId(challengeId),
    studentReasoning:
      challengeId === "ai-off-condition-locked-mechanism"
        ? "燃烧可以发生，气体也会变热，但机械卡住后没法做功，所以不能按原来方式输出。"
        : "燃料燃烧后气体先发生变化，再推动可以运动的部分，刀具才转起来。",
    timestamp,
    postCheckIds: intendedAiOffPostCheckIds(challengeId),
  };
}

export function completeEngineAiOffAttempt(
  challengeId: string,
  timestamp: string,
): IndependentChallengeAttempt {
  const input = completeEngineAiOffInput(challengeId, timestamp);
  return buildEngineAiOffAttempt(input, input.postCheckIds, false);
}

export function judgmentLabelFor(challengeId: string, answerId: string): string {
  return (
    engineAiOffJudgments(challengeId).find((option) => option.id === answerId)
      ?.label ?? answerId
  );
}

export function hasPreCommitEngineWorkRelation(text: string): boolean {
  const normalized = text.replace(/\s+/g, "");
  if (treatsCombustionAsDirectMotion(text)) {
    return false;
  }
  if (/没有做功|不做功|跳过做功|直接让/.test(normalized)) {
    return false;
  }
  return (
    /(气体|工作物质|气缸)/.test(normalized) &&
    /(推动|做功)/.test(normalized) &&
    /(机械|活塞|刀具|可以运动|运动的部分)/.test(normalized)
  );
}

export function hasPreCommitEngineLockedCondition(text: string): boolean {
  const normalized = text.replace(/\s+/g, "");
  if (treatsCombustionAsGuaranteedOutput(text)) {
    return false;
  }
  const stateOrEnergy = /(变热|内能|状态|燃烧)/.test(normalized);
  const workNeedsMotion =
    /(做功|推动)/.test(normalized) &&
    /(卡住|不能运动|没法动|锁住|无法运动|可以运动)/.test(normalized);
  const outputBlocked =
    /(不能.{0,8}输出|没法.{0,8}输出|没有.{0,8}输出|做不成|没法做功|做功没法|不能按原来)/.test(
      normalized,
    );
  return stateOrEnergy && workNeedsMotion && outputBlocked;
}

function stabilizeAiOffChallengeIds(challengeIds: readonly string[]): string[] {
  const allowed = new Set<string>(ENGINE_AI_OFF_CHALLENGE_IDS);
  const kept = challengeIds.filter((id) => allowed.has(id));
  if (kept.length > 0) {
    return kept;
  }
  return [...ENGINE_AI_OFF_CHALLENGE_IDS];
}
