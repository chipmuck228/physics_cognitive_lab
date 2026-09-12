import {
  extractSpecificHeatSignals,
  hasAuthoredBoundarySignal,
  looksLikeGenericBoundaryTalk,
  looksLikePhysicsNounSandwich,
  REQUIRED_ICE_BOUNDARY_CONDITION_CHECKS,
} from "@/content/physics-models/specific-heat-capacity/evaluator";
import { independentChallenges } from "@/content/physics-models/specific-heat-capacity/independent-challenges";
import { specificHeatCapacityAssessmentOverlay } from "@/content/physics-models/specific-heat-capacity/assessment-overlay";
import { PRODUCTION_AI_OFF_IDS } from "@/content/physics-models/specific-heat-capacity/implementation-contract";
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

export const HEAT_AI_OFF_CHALLENGE_IDS = [...PRODUCTION_AI_OFF_IDS] as const;

export const HEAT_AI_OFF_ICE_CHALLENGE_ID = "ai-off-condition-ice-pack-stays-cold";
export const HEAT_AI_OFF_LUNCHBOXES_CHALLENGE_ID =
  "ai-off-unfamiliar-two-lunchboxes";

export const HEAT_AI_OFF_ICE_PRE_COMMIT_IDS = [
  ...REQUIRED_ICE_BOUNDARY_CONDITION_CHECKS,
] as const;

export const HEAT_AI_OFF_DRAFT_KIND = "heat-ai-off-draft";

export const MIN_HEAT_INDEPENDENT_HAN_CHARS = 8;

export type HeatAiOffStep = "response" | "post-check";

export type HeatAiOffJudgmentOption = IndependentJudgmentOption;
export type HeatAiOffPostCheckOption = IndependentPostCheckOption;

export interface HeatAiOffDraft {
  kind: typeof HEAT_AI_OFF_DRAFT_KIND;
  challengeIds: string[];
  currentChallengeId: string;
  step: HeatAiOffStep;
  selectedAnswer: string;
  reasoning: string;
  postCheckSelections: string[];
  preCommitEvidenceIds: string[];
  retiredChallengeIds: string[];
}

export interface HeatAiOffIndependentInput {
  challengeId: string;
  selectedAnswer: string;
  studentReasoning: string;
  preCommitEvidenceIds?: string[];
  timestamp: string;
}

export function heatAiOffChallenges(): IndependentChallenge[] {
  return HEAT_AI_OFF_CHALLENGE_IDS.map((id) => {
    const challenge = independentChallenges.find((item) => item.id === id);
    if (!challenge) {
      throw new Error(`Missing canonical independent challenge: ${id}`);
    }
    return challenge;
  });
}

export function heatAiOffChallenge(challengeId: string): IndependentChallenge {
  const challenge = independentChallenges.find((item) => item.id === challengeId);
  if (!challenge) {
    throw new Error(`Missing canonical independent challenge: ${challengeId}`);
  }
  return challenge;
}

export function heatAiOffJudgments(challengeId: string): HeatAiOffJudgmentOption[] {
  return (
    specificHeatCapacityAssessmentOverlay.independent?.[challengeId]?.judgments ?? []
  );
}

export function heatAiOffPostCheckOptions(
  challengeId: string,
): HeatAiOffPostCheckOption[] {
  return (
    specificHeatCapacityAssessmentOverlay.independent?.[challengeId]?.postCheck ?? []
  );
}

export function intendedHeatAiOffAnswerId(challengeId: string): string {
  const intended = heatAiOffJudgments(challengeId).find((option) => option.correct);
  if (!intended) {
    throw new Error(`Missing intended AI_OFF judgment: ${challengeId}`);
  }
  return intended.id;
}

export function intendedHeatAiOffPostCheckIds(challengeId: string): string[] {
  return heatAiOffPostCheckOptions(challengeId)
    .filter((option) => option.required)
    .map((option) => option.id);
}

export function emptyHeatAiOffDraft(
  challengeIds: readonly string[] = HEAT_AI_OFF_CHALLENGE_IDS,
): HeatAiOffDraft {
  const ids = stabilizeAiOffChallengeIds(challengeIds);
  return {
    kind: HEAT_AI_OFF_DRAFT_KIND,
    challengeIds: ids,
    currentChallengeId: ids[0] ?? HEAT_AI_OFF_CHALLENGE_IDS[0],
    step: "response",
    selectedAnswer: "",
    reasoning: "",
    postCheckSelections: [],
    preCommitEvidenceIds: [],
    retiredChallengeIds: [],
  };
}

export function hasMeaningfulHeatIndependentReasoning(text: string): boolean {
  const trimmed = text.trim();
  const han = trimmed.match(/[\u4e00-\u9fff]/g) ?? [];
  return han.length >= MIN_HEAT_INDEPENDENT_HAN_CHARS;
}

export function intendedHeatAiOffPreCommitIds(challengeId: string): string[] {
  if (challengeId === HEAT_AI_OFF_ICE_CHALLENGE_ID) {
    return [...HEAT_AI_OFF_ICE_PRE_COMMIT_IDS];
  }
  return [];
}

export function hasRequiredHeatAiOffPreCommitEvidence(
  challengeId: string,
  preCommitEvidenceIds: readonly string[],
): boolean {
  const required = intendedHeatAiOffPreCommitIds(challengeId);
  if (required.length === 0) {
    return true;
  }
  const selected = new Set(preCommitEvidenceIds);
  return required.every((id) => selected.has(id));
}

export function canCommitHeatAiOffResponse(
  input: HeatAiOffIndependentInput,
): boolean {
  return (
    input.selectedAnswer.trim().length > 0 &&
    hasMeaningfulHeatIndependentReasoning(input.studentReasoning) &&
    hasRequiredHeatAiOffPreCommitEvidence(
      input.challengeId,
      input.preCommitEvidenceIds ?? [],
    )
  );
}

export function postCheckMatchesRequired(
  challengeId: string,
  postCheckIds: readonly string[],
): boolean {
  const options = heatAiOffPostCheckOptions(challengeId);
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

export function evaluateHeatAiOffAttempt(input: {
  challengeId: string;
  selectedAnswer: string;
  studentReasoning: string;
  postCheckIds: readonly string[];
  preCommitEvidenceIds?: readonly string[];
  llmUsed: boolean;
}): {
  answerCorrect: boolean;
  accepted: boolean;
  reasoningSignals: IndependentReasoningSignals;
} {
  const selected = new Set(input.postCheckIds);
  const signals = extractSpecificHeatSignals(input.studentReasoning);
  const answerCorrect =
    input.selectedAnswer === intendedHeatAiOffAnswerId(input.challengeId);
  const hasOwnWords = hasMeaningfulHeatIndependentReasoning(input.studentReasoning);
  const matchesPostCheck = postCheckMatchesRequired(
    input.challengeId,
    input.postCheckIds,
  );
  const avoidsHeatMisconception =
    !signals.claimsHotterMeansMoreHeat &&
    !signals.claimsSameTimeSameRise &&
    !signals.claimsMoreMassHotter &&
    !signals.claimsHeatingAlwaysRaisesTemperature &&
    !looksLikeSurfaceOnly(input.studentReasoning);
  const conclusionOnlyReasoning =
    signals.conclusionOnlyMaterialReasoning === true;
  const considersTogether = signals.considersQMassAndDeltaTTogether === true;
  const preCommitBoundaryReasoning = hasPreCommitHeatBoundaryReasoning({
    challengeId: input.challengeId,
    studentReasoning: input.studentReasoning,
    preCommitEvidenceIds: input.preCommitEvidenceIds ?? [],
  });
  const identifiesConditionOrBoundary =
    input.challengeId === HEAT_AI_OFF_ICE_CHALLENGE_ID
      ? preCommitBoundaryReasoning && avoidsHeatMisconception
      : considersTogether &&
        avoidsHeatMisconception &&
        !conclusionOnlyReasoning;

  const reasoningSignals: IndependentReasoningSignals = {
    identifiesHeatEnergy: selected.has("identifiesHeatEnergy"),
    identifiesMass: selected.has("identifiesMass"),
    identifiesTemperatureChange: selected.has("identifiesTemperatureChange"),
    usesHeatMassTempRelation: selected.has("usesHeatMassTempRelation"),
    distinguishesHeatFromTemperature: avoidsHeatMisconception,
    checksNoPhaseChangeCondition: selected.has("checksNoPhaseChangeCondition"),
    identifiesConditionOrBoundary,
    considersQMassAndDeltaTTogether: considersTogether,
    avoidsHeatMisconception,
    conclusionOnlyReasoning,
    preCommitBoundaryReasoning,
    hasOwnWords,
    postCheckMatchesRequired: matchesPostCheck,
  };

  const accepted =
    answerCorrect &&
    hasOwnWords &&
    matchesPostCheck &&
    avoidsHeatMisconception &&
    identifiesConditionOrBoundary === true &&
    conclusionOnlyReasoning === false &&
    input.llmUsed === false;

  return { answerCorrect, accepted, reasoningSignals };
}

export function buildHeatAiOffAttempt(
  input: HeatAiOffIndependentInput,
  postCheckIds: readonly string[] = [],
  llmUsed = false,
): IndependentChallengeAttempt {
  const preCommitEvidenceIds = [...(input.preCommitEvidenceIds ?? [])];
  const evaluation = evaluateHeatAiOffAttempt({
    challengeId: input.challengeId,
    selectedAnswer: input.selectedAnswer,
    studentReasoning: input.studentReasoning,
    postCheckIds,
    preCommitEvidenceIds,
    llmUsed,
  });
  return {
    challengeId: input.challengeId,
    selectedAnswer: input.selectedAnswer,
    studentReasoning: input.studentReasoning,
    answerCorrect: evaluation.answerCorrect,
    reasoningSignals: evaluation.reasoningSignals,
    postCheckIds: [...postCheckIds],
    preCommitEvidenceIds,
    timestamp: input.timestamp,
    accepted: evaluation.accepted,
    llmUsed: false,
    completedWithoutAI: true,
  };
}

export function applyHeatAiOffPostCheck(
  attempt: IndependentChallengeAttempt,
  postCheckIds: readonly string[],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateHeatAiOffAttempt({
    challengeId: attempt.challengeId,
    selectedAnswer: attempt.selectedAnswer,
    studentReasoning: attempt.studentReasoning,
    postCheckIds,
    preCommitEvidenceIds: attempt.preCommitEvidenceIds ?? [],
    llmUsed,
  });
  return {
    ...attempt,
    selectedAnswer: attempt.selectedAnswer,
    studentReasoning: attempt.studentReasoning,
    answerCorrect: evaluation.answerCorrect,
    reasoningSignals: evaluation.reasoningSignals,
    postCheckIds: [...postCheckIds],
    preCommitEvidenceIds: [...(attempt.preCommitEvidenceIds ?? [])],
    accepted: evaluation.accepted,
    llmUsed: false,
    completedWithoutAI: true,
  };
}

export function heatAiOffAttemptsFor(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): IndependentChallengeAttempt[] {
  return (assessment?.challengeAttempts ?? []).filter(
    (attempt) => attempt.challengeId === challengeId,
  );
}

export function hasAcceptedHeatAiOffChallenge(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): boolean {
  return heatAiOffAttemptsFor(assessment, challengeId).some(
    (attempt) =>
      attempt.accepted &&
      attempt.llmUsed === false &&
      attempt.completedWithoutAI === true,
  );
}

export function hasAcceptedHeatAiOffChallenges(
  assessment: IndependentAssessment | undefined,
  challengeIds: readonly string[] = HEAT_AI_OFF_CHALLENGE_IDS,
): boolean {
  return stabilizeAiOffChallengeIds(challengeIds).every((id) =>
    hasAcceptedHeatAiOffChallenge(assessment, id),
  );
}

export function heatTutorUsedDuringIndependent(session: LearningSession): boolean {
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

export function hasCompletedHeatAiOff(session: LearningSession): boolean {
  return (
    hasAcceptedHeatAiOffChallenges(session.independentAssessment) &&
    session.independentAssessment?.llmUsed === false &&
    session.independentAssessment.completedWithoutAI === true &&
    !heatTutorUsedDuringIndependent(session)
  );
}

export function currentHeatAiOffChallengeId(
  assessment: IndependentAssessment | undefined,
  draft: Pick<
    HeatAiOffDraft,
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
    !hasAcceptedHeatAiOffChallenge(assessment, current)
  ) {
    return current;
  }
  return (
    challengeIds.find(
      (id) => !retired.has(id) && !hasAcceptedHeatAiOffChallenge(assessment, id),
    ) ?? null
  );
}

export function isHeatAiOffSessionOpen(
  assessment: IndependentAssessment | undefined,
  draft: Pick<
    HeatAiOffDraft,
    "challengeIds" | "currentChallengeId" | "retiredChallengeIds"
  >,
): boolean {
  return currentHeatAiOffChallengeId(assessment, draft) !== null;
}

export function nextHeatAiOffDraft(
  assessment: IndependentAssessment | undefined,
  previous: HeatAiOffDraft,
  justChallengeId: string,
): HeatAiOffDraft {
  const challengeIds = stabilizeAiOffChallengeIds(previous.challengeIds);
  const retired = new Set(previous.retiredChallengeIds);
  if (hasAcceptedHeatAiOffChallenge(assessment, justChallengeId)) {
    retired.add(justChallengeId);
  }
  const nextId = currentHeatAiOffChallengeId(assessment, {
    challengeIds,
    currentChallengeId: "",
    retiredChallengeIds: [...retired],
  });
  if (!nextId) {
    return {
      ...emptyHeatAiOffDraft(challengeIds),
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
    ...emptyHeatAiOffDraft(challengeIds),
    currentChallengeId: nextId,
    retiredChallengeIds: [...retired],
  };
}

export function retryHeatAiOffDraft(
  previous: HeatAiOffDraft,
  challengeId: string,
): HeatAiOffDraft {
  return {
    ...previous,
    currentChallengeId: challengeId,
    step: "response",
    selectedAnswer: "",
    reasoning: "",
    postCheckSelections: [],
    preCommitEvidenceIds: [],
  };
}

export function buildHeatAiOffAssessment(
  attempts: IndependentChallengeAttempt[],
  llmUsed: boolean,
): IndependentAssessment {
  const accepted = hasAcceptedHeatAiOffChallenges({
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

export function completeHeatAiOffInput(
  challengeId: string,
  timestamp: string,
): HeatAiOffIndependentInput & { postCheckIds: string[] } {
  const lunchboxes = challengeId === HEAT_AI_OFF_LUNCHBOXES_CHALLENGE_ID;
  return {
    challengeId,
    selectedAnswer: intendedHeatAiOffAnswerId(challengeId),
    studentReasoning: lunchboxes
      ? "两个饭盒质量几乎相同，加热时间只说明能量可以看成相近。材料比热容不同，所以温度变化不同。"
      : "加热器仍可能把能量送进冰袋。冰在熔化，温度几乎不变，不能只用 Q = c m ΔT 写完。",
    timestamp,
    postCheckIds: intendedHeatAiOffPostCheckIds(challengeId),
    preCommitEvidenceIds: intendedHeatAiOffPreCommitIds(challengeId),
  };
}

export function completeHeatAiOffAttempt(
  challengeId: string,
  timestamp: string,
): IndependentChallengeAttempt {
  const input = completeHeatAiOffInput(challengeId, timestamp);
  return buildHeatAiOffAttempt(input, input.postCheckIds, false);
}

export function heatJudgmentLabelFor(challengeId: string, answerId: string): string {
  return (
    heatAiOffJudgments(challengeId).find((option) => option.id === answerId)?.label ??
    answerId
  );
}

function hasPreCommitHeatBoundaryReasoning(input: {
  challengeId: string;
  studentReasoning: string;
  preCommitEvidenceIds: readonly string[];
}): boolean {
  if (input.challengeId !== HEAT_AI_OFF_ICE_CHALLENGE_ID) {
    return (
      extractSpecificHeatSignals(input.studentReasoning)
        .considersQMassAndDeltaTTogether === true &&
      !looksLikePhysicsNounSandwich(input.studentReasoning)
    );
  }
  return (
    hasRequiredHeatAiOffPreCommitEvidence(
      input.challengeId,
      input.preCommitEvidenceIds,
    ) &&
    hasAuthoredBoundarySignal(input.studentReasoning) &&
    !looksLikePhysicsNounSandwich(input.studentReasoning) &&
    !looksLikeGenericBoundaryTalk(input.studentReasoning)
  );
}

function looksLikeSurfaceOnly(text: string): boolean {
  const normalized = text.replace(/\s+/g, "");
  const surface =
    normalized.includes("都是加热") ||
    normalized.includes("看起来像") ||
    normalized.includes("课堂上见过");
  const structure =
    normalized.includes("质量") ||
    normalized.includes("温度") ||
    normalized.includes("比热") ||
    normalized.includes("能量");
  return surface && !structure;
}

function stabilizeAiOffChallengeIds(challengeIds: readonly string[]): string[] {
  const allowed = new Set<string>(HEAT_AI_OFF_CHALLENGE_IDS);
  const kept = challengeIds.filter((id) => allowed.has(id));
  if (kept.length > 0) {
    return kept;
  }
  return [...HEAT_AI_OFF_CHALLENGE_IDS];
}
