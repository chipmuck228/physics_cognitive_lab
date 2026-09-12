import { energyInternalEnergyTemperatureAssessmentOverlay } from "@/content/physics-models/energy-internal-energy-temperature/assessment-overlay";
import { independentChallenges } from "@/content/physics-models/energy-internal-energy-temperature/independent-challenges";
import { PRODUCTION_AI_OFF_IDS } from "@/content/physics-models/energy-internal-energy-temperature/implementation-contract";
import type {
  IndependentJudgmentOption,
  IndependentPostCheckOption,
} from "@/lib/runtime/types";
import {
  hasAuthoredIceBoundary,
  hasAuthoredOrdinaryApplication,
  looksLikeGenericAuthored,
  looksLikeHeatSlogan,
  looksLikeNounSandwich,
} from "@/lib/learning/microwave-text";
import { LearningStage } from "@/types/learning";
import type {
  IndependentAssessment,
  IndependentChallengeAttempt,
  IndependentReasoningSignals,
  LearningSession,
} from "@/types/learning";
import type { IndependentChallenge } from "@/types/physics-model";

export const MICROWAVE_AI_OFF_CHALLENGE_IDS = [...PRODUCTION_AI_OFF_IDS] as const;

export const MICROWAVE_AI_OFF_SPOON_ID = "ai-off-unfamiliar-metal-spoon";
export const MICROWAVE_AI_OFF_ICE_ID = "ai-off-condition-ice-absorbs-energy";

export const MICROWAVE_AI_OFF_A_PRE_COMMIT_IDS = [
  "energy-enters-spoon",
  "spoon-u-changes",
  "t-rose-as-observable",
  "heat-not-stored",
] as const;

export const MICROWAVE_AI_OFF_B_PRE_COMMIT_IDS = [
  "energy-can-enter",
  "t-need-not-rise",
  "t-unchanged-not-u-unchanged",
] as const;

export const MICROWAVE_AI_OFF_DRAFT_KIND = "microwave-ai-off-draft";

export const MIN_MICROWAVE_INDEPENDENT_HAN_CHARS = 8;

export type MicrowaveAiOffStep = "response" | "post-check";

export interface MicrowaveAiOffDraft {
  kind: typeof MICROWAVE_AI_OFF_DRAFT_KIND;
  challengeIds: string[];
  currentChallengeId: string;
  step: MicrowaveAiOffStep;
  selectedAnswer: string;
  reasoning: string;
  postCheckSelections: string[];
  preCommitEvidenceIds: string[];
  retiredChallengeIds: string[];
}

export interface MicrowaveAiOffIndependentInput {
  challengeId: string;
  selectedAnswer: string;
  studentReasoning: string;
  preCommitEvidenceIds?: string[];
  timestamp: string;
}

export function microwaveAiOffChallenges(): IndependentChallenge[] {
  return MICROWAVE_AI_OFF_CHALLENGE_IDS.map((id) => {
    const challenge = independentChallenges.find((item) => item.id === id);
    if (!challenge) {
      throw new Error(`Missing canonical independent challenge: ${id}`);
    }
    return challenge;
  });
}

export function microwaveAiOffChallenge(challengeId: string): IndependentChallenge {
  const challenge = independentChallenges.find((item) => item.id === challengeId);
  if (!challenge) {
    throw new Error(`Missing canonical independent challenge: ${challengeId}`);
  }
  return challenge;
}

export function microwaveAiOffJudgments(
  challengeId: string,
): IndependentJudgmentOption[] {
  return (
    energyInternalEnergyTemperatureAssessmentOverlay.independent?.[challengeId]
      ?.judgments ?? []
  );
}

export function microwaveAiOffPostCheckOptions(
  challengeId: string,
): IndependentPostCheckOption[] {
  return (
    energyInternalEnergyTemperatureAssessmentOverlay.independent?.[challengeId]
      ?.postCheck ?? []
  );
}

export function intendedMicrowaveAiOffAnswerId(challengeId: string): string {
  const intended = microwaveAiOffJudgments(challengeId).find((option) => option.correct);
  if (!intended) {
    throw new Error(`Missing intended AI_OFF judgment: ${challengeId}`);
  }
  return intended.id;
}

export function intendedMicrowaveAiOffPostCheckIds(challengeId: string): string[] {
  return microwaveAiOffPostCheckOptions(challengeId)
    .filter((option) => option.required && !option.distractor)
    .map((option) => option.id);
}

export function emptyMicrowaveAiOffDraft(
  challengeIds: readonly string[] = MICROWAVE_AI_OFF_CHALLENGE_IDS,
): MicrowaveAiOffDraft {
  const ids = stabilizeAiOffChallengeIds(challengeIds);
  return {
    kind: MICROWAVE_AI_OFF_DRAFT_KIND,
    challengeIds: ids,
    currentChallengeId: ids[0] ?? MICROWAVE_AI_OFF_CHALLENGE_IDS[0],
    step: "response",
    selectedAnswer: "",
    reasoning: "",
    postCheckSelections: [],
    preCommitEvidenceIds: [],
    retiredChallengeIds: [],
  };
}

export function hasMeaningfulMicrowaveIndependentReasoning(text: string): boolean {
  const han = text.trim().match(/[\u4e00-\u9fff]/g) ?? [];
  return han.length >= MIN_MICROWAVE_INDEPENDENT_HAN_CHARS;
}

export function intendedMicrowaveAiOffPreCommitIds(challengeId: string): string[] {
  if (challengeId === MICROWAVE_AI_OFF_SPOON_ID) {
    return [...MICROWAVE_AI_OFF_A_PRE_COMMIT_IDS];
  }
  if (challengeId === MICROWAVE_AI_OFF_ICE_ID) {
    return [...MICROWAVE_AI_OFF_B_PRE_COMMIT_IDS];
  }
  return [];
}

export function hasRequiredMicrowaveAiOffPreCommitEvidence(
  challengeId: string,
  preCommitEvidenceIds: readonly string[],
): boolean {
  const required = intendedMicrowaveAiOffPreCommitIds(challengeId);
  const selected = new Set(preCommitEvidenceIds);
  return required.every((id) => selected.has(id));
}

export function canCommitMicrowaveAiOffResponse(
  input: MicrowaveAiOffIndependentInput,
): boolean {
  return (
    input.selectedAnswer.trim().length > 0 &&
    hasMeaningfulMicrowaveIndependentReasoning(input.studentReasoning) &&
    hasRequiredMicrowaveAiOffPreCommitEvidence(
      input.challengeId,
      input.preCommitEvidenceIds ?? [],
    )
  );
}

export function postCheckMatchesRequired(
  challengeId: string,
  postCheckIds: readonly string[],
): boolean {
  const options = microwaveAiOffPostCheckOptions(challengeId);
  const selected = new Set(postCheckIds);
  const required = options.filter((option) => option.required && !option.distractor);
  const distractors = options.filter((option) => option.distractor);
  if (required.length === 0) {
    return false;
  }
  return (
    required.every((option) => selected.has(option.id)) &&
    distractors.every((option) => !selected.has(option.id))
  );
}

export function evaluateMicrowaveAiOffAttempt(input: {
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
  const preCommit = new Set(input.preCommitEvidenceIds ?? []);
  const postCheck = new Set(input.postCheckIds);
  const answerCorrect =
    input.selectedAnswer === intendedMicrowaveAiOffAnswerId(input.challengeId);
  const authorshipFloor = hasMeaningfulMicrowaveIndependentReasoning(
    input.studentReasoning,
  );
  const matchesPostCheck = postCheckMatchesRequired(
    input.challengeId,
    input.postCheckIds,
  );
  const weakText =
    looksLikeNounSandwich(input.studentReasoning) ||
    looksLikeHeatSlogan(input.studentReasoning) ||
    looksLikeGenericAuthored(input.studentReasoning);

  const preCommitEnergyTransfer =
    input.challengeId === MICROWAVE_AI_OFF_SPOON_ID
      ? preCommit.has("energy-enters-spoon")
      : preCommit.has("energy-can-enter");
  const preCommitInternalEnergyChange =
    input.challengeId === MICROWAVE_AI_OFF_SPOON_ID
      ? preCommit.has("spoon-u-changes")
      : preCommit.has("t-unchanged-not-u-unchanged");
  const preCommitTemperatureRelation =
    input.challengeId === MICROWAVE_AI_OFF_SPOON_ID
      ? preCommit.has("t-rose-as-observable")
      : preCommit.has("t-need-not-rise");
  const preCommitConditionOrBoundary =
    input.challengeId === MICROWAVE_AI_OFF_ICE_ID &&
    preCommit.has("t-need-not-rise") &&
    hasAuthoredIceBoundary(input.studentReasoning) &&
    !weakText;

  const ordinaryApplication =
    input.challengeId === MICROWAVE_AI_OFF_SPOON_ID &&
    hasRequiredMicrowaveAiOffPreCommitEvidence(input.challengeId, [...preCommit]) &&
    hasAuthoredOrdinaryApplication(input.studentReasoning) &&
    !weakText;

  const identifiesEnergyTransfer = preCommitEnergyTransfer && !weakText;
  const identifiesInternalEnergyChange = preCommitInternalEnergyChange && !weakText;
  const identifiesTemperatureChange = preCommitTemperatureRelation && !weakText;
  const identifiesConditionOrBoundary = preCommitConditionOrBoundary;
  const treatsHeatAsProcess =
    input.challengeId === MICROWAVE_AI_OFF_SPOON_ID
      ? preCommit.has("heat-not-stored") && ordinaryApplication
      : true;

  const reasoningSignals: IndependentReasoningSignals = {
    identifiesEnergyTransfer,
    identifiesInternalEnergyChange,
    identifiesTemperatureChange,
    identifiesConditionOrBoundary,
    treatsHeatAsProcess,
    preCommitEnergyTransfer,
    preCommitInternalEnergyChange,
    preCommitTemperatureRelation,
    preCommitConditionOrBoundary,
    postCheckEnergyTransfer: postCheck.has("identifiesEnergyTransfer"),
    postCheckInternalEnergyChange: postCheck.has("identifiesInternalEnergyChange"),
    postCheckConditionOrBoundary: postCheck.has("identifiesConditionOrBoundary"),
    hasOwnWords: authorshipFloor,
    postCheckMatchesRequired: matchesPostCheck,
  };

  const accepted =
    answerCorrect &&
    authorshipFloor &&
    matchesPostCheck &&
    input.llmUsed === false &&
    !weakText &&
    (input.challengeId === MICROWAVE_AI_OFF_SPOON_ID
      ? ordinaryApplication && treatsHeatAsProcess
      : identifiesConditionOrBoundary === true);

  return { answerCorrect, accepted, reasoningSignals };
}

export function buildMicrowaveAiOffAttempt(
  input: MicrowaveAiOffIndependentInput,
  postCheckIds: readonly string[] = [],
  llmUsed = false,
): IndependentChallengeAttempt {
  const preCommitEvidenceIds = [...(input.preCommitEvidenceIds ?? [])];
  const evaluation = evaluateMicrowaveAiOffAttempt({
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

export function applyMicrowaveAiOffPostCheck(
  attempt: IndependentChallengeAttempt,
  postCheckIds: readonly string[],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateMicrowaveAiOffAttempt({
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

export function microwaveAiOffAttemptsFor(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): IndependentChallengeAttempt[] {
  return (assessment?.challengeAttempts ?? []).filter(
    (attempt) => attempt.challengeId === challengeId,
  );
}

export function hasAcceptedMicrowaveAiOffChallenge(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): boolean {
  return microwaveAiOffAttemptsFor(assessment, challengeId).some(
    (attempt) =>
      attempt.accepted &&
      attempt.llmUsed === false &&
      attempt.completedWithoutAI === true,
  );
}

export function hasAcceptedMicrowaveAiOffChallenges(
  assessment: IndependentAssessment | undefined,
  challengeIds: readonly string[] = MICROWAVE_AI_OFF_CHALLENGE_IDS,
): boolean {
  return stabilizeAiOffChallengeIds(challengeIds).every((id) =>
    hasAcceptedMicrowaveAiOffChallenge(assessment, id),
  );
}

export function microwaveTutorUsedDuringIndependent(session: LearningSession): boolean {
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

export function hasCompletedMicrowaveAiOff(session: LearningSession): boolean {
  return (
    hasAcceptedMicrowaveAiOffChallenges(session.independentAssessment) &&
    session.independentAssessment?.llmUsed === false &&
    session.independentAssessment.completedWithoutAI === true &&
    !microwaveTutorUsedDuringIndependent(session)
  );
}

export function currentMicrowaveAiOffChallengeId(
  assessment: IndependentAssessment | undefined,
  draft: Pick<
    MicrowaveAiOffDraft,
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
    !hasAcceptedMicrowaveAiOffChallenge(assessment, current)
  ) {
    return current;
  }
  return (
    challengeIds.find(
      (id) => !retired.has(id) && !hasAcceptedMicrowaveAiOffChallenge(assessment, id),
    ) ?? null
  );
}

export function nextMicrowaveAiOffDraft(
  assessment: IndependentAssessment | undefined,
  previous: MicrowaveAiOffDraft,
  justChallengeId: string,
): MicrowaveAiOffDraft {
  const challengeIds = stabilizeAiOffChallengeIds(previous.challengeIds);
  const retired = new Set(previous.retiredChallengeIds);
  if (hasAcceptedMicrowaveAiOffChallenge(assessment, justChallengeId)) {
    retired.add(justChallengeId);
  }
  const nextId = currentMicrowaveAiOffChallengeId(assessment, {
    challengeIds,
    currentChallengeId: "",
    retiredChallengeIds: [...retired],
  });
  if (!nextId) {
    return {
      ...emptyMicrowaveAiOffDraft(challengeIds),
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
    ...emptyMicrowaveAiOffDraft(challengeIds),
    currentChallengeId: nextId,
    retiredChallengeIds: [...retired],
  };
}

export function retryMicrowaveAiOffDraft(
  previous: MicrowaveAiOffDraft,
  challengeId: string,
): MicrowaveAiOffDraft {
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

export function buildMicrowaveAiOffAssessment(
  attempts: IndependentChallengeAttempt[],
  llmUsed: boolean,
): IndependentAssessment {
  const accepted = hasAcceptedMicrowaveAiOffChallenges({
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

export function completeMicrowaveAiOffInput(
  challengeId: string,
  timestamp: string,
): MicrowaveAiOffIndependentInput & { postCheckIds: string[] } {
  const spoon = challengeId === MICROWAVE_AI_OFF_SPOON_ID;
  return {
    challengeId,
    selectedAnswer: intendedMicrowaveAiOffAnswerId(challengeId),
    studentReasoning: spoon
      ? "能量进入勺子，勺子的内能改变，温度升高。温度不是内能，热不是装在勺子里的东西。"
      : "能量还可以进入冰块，内能或状态可以变，但温度不一定升高。",
    timestamp,
    postCheckIds: intendedMicrowaveAiOffPostCheckIds(challengeId),
    preCommitEvidenceIds: intendedMicrowaveAiOffPreCommitIds(challengeId),
  };
}

export function completeMicrowaveAiOffAttempt(
  challengeId: string,
  timestamp: string,
): IndependentChallengeAttempt {
  const input = completeMicrowaveAiOffInput(challengeId, timestamp);
  return buildMicrowaveAiOffAttempt(input, input.postCheckIds, false);
}

export function microwaveJudgmentLabelFor(challengeId: string, answerId: string): string {
  return (
    microwaveAiOffJudgments(challengeId).find((option) => option.id === answerId)
      ?.label ?? answerId
  );
}

function stabilizeAiOffChallengeIds(challengeIds: readonly string[]): string[] {
  const allowed = new Set<string>(MICROWAVE_AI_OFF_CHALLENGE_IDS);
  const kept = challengeIds.filter((id) => allowed.has(id));
  if (kept.length > 0) {
    return kept;
  }
  return [...MICROWAVE_AI_OFF_CHALLENGE_IDS];
}
