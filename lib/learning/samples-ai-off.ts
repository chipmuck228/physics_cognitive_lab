import { extractDensitySignals } from "@/content/physics-models/density-mass-volume/evaluator";
import { independentChallenges } from "@/content/physics-models/density-mass-volume/independent-challenges";
import { densityMassVolumeAssessmentOverlay } from "@/content/physics-models/density-mass-volume/assessment-overlay";
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

export const SAMPLES_AI_OFF_CHALLENGE_IDS = [
  "ai-off-unfamiliar-sealed-packages",
  "ai-off-condition-cut-uniform-bar",
] as const;

export const SAMPLES_AI_OFF_DRAFT_KIND = "samples-ai-off-draft";

export const MIN_SAMPLES_INDEPENDENT_HAN_CHARS = 8;

export type SamplesAiOffStep = "response" | "post-check";

export type SamplesAiOffJudgmentOption = IndependentJudgmentOption;
export type SamplesAiOffPostCheckOption = IndependentPostCheckOption;

export interface SamplesAiOffDraft {
  kind: typeof SAMPLES_AI_OFF_DRAFT_KIND;
  challengeIds: string[];
  currentChallengeId: string;
  step: SamplesAiOffStep;
  selectedAnswer: string;
  reasoning: string;
  postCheckSelections: string[];
  retiredChallengeIds: string[];
}

export interface SamplesAiOffIndependentInput {
  challengeId: string;
  selectedAnswer: string;
  studentReasoning: string;
  timestamp: string;
}

export interface SamplesAiOffPostCheckInput {
  challengeId: string;
  postCheckIds: string[];
}

export function samplesAiOffChallenges(): IndependentChallenge[] {
  return SAMPLES_AI_OFF_CHALLENGE_IDS.map((id) => {
    const challenge = independentChallenges.find((item) => item.id === id);
    if (!challenge) {
      throw new Error(`Missing canonical independent challenge: ${id}`);
    }
    return challenge;
  });
}

export function samplesAiOffChallenge(challengeId: string): IndependentChallenge {
  const challenge = independentChallenges.find((item) => item.id === challengeId);
  if (!challenge) {
    throw new Error(`Missing canonical independent challenge: ${challengeId}`);
  }
  return challenge;
}

export function samplesAiOffJudgments(
  challengeId: string,
): SamplesAiOffJudgmentOption[] {
  return (
    densityMassVolumeAssessmentOverlay.independent?.[challengeId]?.judgments ?? []
  );
}

export function samplesAiOffPostCheckOptions(
  challengeId: string,
): SamplesAiOffPostCheckOption[] {
  return (
    densityMassVolumeAssessmentOverlay.independent?.[challengeId]?.postCheck ?? []
  );
}

export function intendedSamplesAiOffAnswerId(challengeId: string): string {
  const intended = samplesAiOffJudgments(challengeId).find((option) => option.correct);
  if (!intended) {
    throw new Error(`Missing intended AI_OFF judgment: ${challengeId}`);
  }
  return intended.id;
}

export function intendedSamplesAiOffPostCheckIds(challengeId: string): string[] {
  return samplesAiOffPostCheckOptions(challengeId)
    .filter((option) => option.required)
    .map((option) => option.id);
}

export function emptySamplesAiOffDraft(
  challengeIds: readonly string[] = SAMPLES_AI_OFF_CHALLENGE_IDS,
): SamplesAiOffDraft {
  const ids = stabilizeAiOffChallengeIds(challengeIds);
  return {
    kind: SAMPLES_AI_OFF_DRAFT_KIND,
    challengeIds: ids,
    currentChallengeId: ids[0] ?? SAMPLES_AI_OFF_CHALLENGE_IDS[0],
    step: "response",
    selectedAnswer: "",
    reasoning: "",
    postCheckSelections: [],
    retiredChallengeIds: [],
  };
}

export function hasMeaningfulSamplesIndependentReasoning(text: string): boolean {
  const trimmed = text.trim();
  const han = trimmed.match(/[\u4e00-\u9fff]/g) ?? [];
  return han.length >= MIN_SAMPLES_INDEPENDENT_HAN_CHARS;
}

export function canCommitSamplesAiOffResponse(
  input: SamplesAiOffIndependentInput,
): boolean {
  return (
    input.selectedAnswer.trim().length > 0 &&
    hasMeaningfulSamplesIndependentReasoning(input.studentReasoning)
  );
}

export function postCheckMatchesRequired(
  challengeId: string,
  postCheckIds: readonly string[],
): boolean {
  const options = samplesAiOffPostCheckOptions(challengeId);
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

export function evaluateSamplesAiOffAttempt(input: {
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
  const signals = extractDensitySignals(input.studentReasoning);
  const answerCorrect =
    input.selectedAnswer === intendedSamplesAiOffAnswerId(input.challengeId);
  const hasOwnWords = hasMeaningfulSamplesIndependentReasoning(
    input.studentReasoning,
  );
  const matchesPostCheck = postCheckMatchesRequired(
    input.challengeId,
    input.postCheckIds,
  );
  const avoidsDensityMisconception =
    !signals.claimsBiggerMeansDenser &&
    !signals.claimsHeavierMeansDenser &&
    !signals.claimsCuttingLowersDensity &&
    !signals.claimsDensityExplainsFloating &&
    !looksLikeSurfaceOnly(input.studentReasoning);
  const conclusionOnlyReasoning = isConclusionOnlyReasoning(
    input.challengeId,
    input.studentReasoning,
    signals,
  );
  const considersMassAndVolumeTogether =
    signals.considersMassAndVolumeTogether === true;
  const usesProportionalInvariance =
    selected.has("usesProportionalInvariance") ||
    signals.usesProportionalInvariance === true;
  const identifiesConditionOrBoundary =
    input.challengeId === "ai-off-condition-cut-uniform-bar"
      ? selected.has("checksUniformMaterialCondition") &&
        selected.has("identifiesMass") &&
        selected.has("identifiesVolume") &&
        selected.has("usesProportionalInvariance") &&
        usesProportionalInvariance &&
        hasModelBasedCutReasoning(input.studentReasoning, signals) &&
        avoidsDensityMisconception
      : selected.has("usesMassVolumeRatio") &&
        selected.has("identifiesMass") &&
        selected.has("identifiesVolume") &&
        considersMassAndVolumeTogether &&
        avoidsDensityMisconception;

  const reasoningSignals: IndependentReasoningSignals = {
    identifiesMass: selected.has("identifiesMass"),
    identifiesVolume: selected.has("identifiesVolume"),
    usesMassVolumeRatio: selected.has("usesMassVolumeRatio"),
    distinguishesDensityFromMassOrSize: avoidsDensityMisconception,
    checksUniformMaterialCondition: selected.has("checksUniformMaterialCondition"),
    identifiesConditionOrBoundary,
    avoidsDensityMisconception,
    usesProportionalInvariance,
    considersMassAndVolumeTogether,
    conclusionOnlyReasoning,
    hasOwnWords,
    postCheckMatchesRequired: matchesPostCheck,
  };

  const accepted =
    answerCorrect &&
    hasOwnWords &&
    matchesPostCheck &&
    avoidsDensityMisconception &&
    identifiesConditionOrBoundary === true &&
    conclusionOnlyReasoning === false &&
    input.llmUsed === false;

  return { answerCorrect, accepted, reasoningSignals };
}

export function buildSamplesAiOffAttempt(
  input: SamplesAiOffIndependentInput,
  postCheckIds: readonly string[] = [],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateSamplesAiOffAttempt({
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

export function applySamplesAiOffPostCheck(
  attempt: IndependentChallengeAttempt,
  postCheckIds: readonly string[],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateSamplesAiOffAttempt({
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

export function samplesAiOffAttemptsFor(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): IndependentChallengeAttempt[] {
  return (assessment?.challengeAttempts ?? []).filter(
    (attempt) => attempt.challengeId === challengeId,
  );
}

export function latestSamplesAiOffAttempt(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): IndependentChallengeAttempt | undefined {
  return samplesAiOffAttemptsFor(assessment, challengeId).at(-1);
}

export function hasAcceptedSamplesAiOffChallenge(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): boolean {
  return samplesAiOffAttemptsFor(assessment, challengeId).some(
    (attempt) =>
      attempt.accepted &&
      attempt.llmUsed === false &&
      attempt.completedWithoutAI === true,
  );
}

export function hasAcceptedSamplesAiOffChallenges(
  assessment: IndependentAssessment | undefined,
  challengeIds: readonly string[] = SAMPLES_AI_OFF_CHALLENGE_IDS,
): boolean {
  return stabilizeAiOffChallengeIds(challengeIds).every((id) =>
    hasAcceptedSamplesAiOffChallenge(assessment, id),
  );
}

export function samplesTutorUsedDuringIndependent(
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

export function hasCompletedSamplesAiOff(session: LearningSession): boolean {
  return (
    hasAcceptedSamplesAiOffChallenges(session.independentAssessment) &&
    session.independentAssessment?.llmUsed === false &&
    session.independentAssessment.completedWithoutAI === true &&
    !samplesTutorUsedDuringIndependent(session)
  );
}

export function currentSamplesAiOffChallengeId(
  assessment: IndependentAssessment | undefined,
  draft: Pick<
    SamplesAiOffDraft,
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
    !hasAcceptedSamplesAiOffChallenge(assessment, current)
  ) {
    return current;
  }
  return (
    challengeIds.find(
      (id) => !retired.has(id) && !hasAcceptedSamplesAiOffChallenge(assessment, id),
    ) ?? null
  );
}

export function isSamplesAiOffSessionOpen(
  assessment: IndependentAssessment | undefined,
  draft: Pick<
    SamplesAiOffDraft,
    "challengeIds" | "currentChallengeId" | "retiredChallengeIds"
  >,
): boolean {
  return currentSamplesAiOffChallengeId(assessment, draft) !== null;
}

export function nextSamplesAiOffDraft(
  assessment: IndependentAssessment | undefined,
  previous: SamplesAiOffDraft,
  justChallengeId: string,
): SamplesAiOffDraft {
  const challengeIds = stabilizeAiOffChallengeIds(previous.challengeIds);
  const retired = new Set(previous.retiredChallengeIds);
  if (hasAcceptedSamplesAiOffChallenge(assessment, justChallengeId)) {
    retired.add(justChallengeId);
  }
  const nextId = currentSamplesAiOffChallengeId(assessment, {
    challengeIds,
    currentChallengeId: "",
    retiredChallengeIds: [...retired],
  });
  if (!nextId) {
    return {
      ...emptySamplesAiOffDraft(challengeIds),
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
    ...emptySamplesAiOffDraft(challengeIds),
    currentChallengeId: nextId,
    retiredChallengeIds: [...retired],
  };
}

export function retrySamplesAiOffDraft(
  previous: SamplesAiOffDraft,
  challengeId: string,
): SamplesAiOffDraft {
  return {
    ...previous,
    currentChallengeId: challengeId,
    step: "response",
    selectedAnswer: "",
    reasoning: "",
    postCheckSelections: [],
  };
}

export function buildSamplesAiOffAssessment(
  attempts: IndependentChallengeAttempt[],
  llmUsed: boolean,
): IndependentAssessment {
  const accepted = hasAcceptedSamplesAiOffChallenges({
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

export function completeSamplesAiOffInput(
  challengeId: string,
  timestamp: string,
): SamplesAiOffIndependentInput & { postCheckIds: string[] } {
  const packages = challengeId === "ai-off-unfamiliar-sealed-packages";
  return {
    challengeId,
    selectedAnswer: intendedSamplesAiOffAnswerId(challengeId),
    studentReasoning: packages
      ? "两个包装外形体积几乎相同，更沉的那个单位体积的质量更大，所以密度更大。"
      : "切开后质量和体积都按相同比例变小，m/V 的比值不变，所以密度不变。",
    timestamp,
    postCheckIds: intendedSamplesAiOffPostCheckIds(challengeId),
  };
}

export function completeSamplesAiOffAttempt(
  challengeId: string,
  timestamp: string,
): IndependentChallengeAttempt {
  const input = completeSamplesAiOffInput(challengeId, timestamp);
  return buildSamplesAiOffAttempt(input, input.postCheckIds, false);
}

export function samplesJudgmentLabelFor(
  challengeId: string,
  answerId: string,
): string {
  return (
    samplesAiOffJudgments(challengeId).find((option) => option.id === answerId)
      ?.label ?? answerId
  );
}

function hasModelBasedCutReasoning(
  text: string,
  signals: ReturnType<typeof extractDensitySignals>,
): boolean {
  return (
    (signals.considersMassAndVolumeTogether || signals.usesProportionalInvariance) &&
    !isConclusionOnlyReasoning("ai-off-condition-cut-uniform-bar", text, signals)
  );
}

function isConclusionOnlyReasoning(
  challengeId: string,
  text: string,
  signals: ReturnType<typeof extractDensitySignals>,
): boolean {
  if (challengeId === "ai-off-condition-cut-uniform-bar") {
    return (
      signals.claimsSameMaterialAlone &&
      !signals.considersMassAndVolumeTogether &&
      !signals.usesProportionalInvariance
    );
  }
  return (
    signals.claimsHeavierMeansDenser &&
    !signals.identifiesVolume &&
    !signals.usesMassVolumeRatio
  );
}

function looksLikeSurfaceOnly(text: string): boolean {
  const normalized = text.replace(/\s+/g, "");
  const surface =
    normalized.includes("都是包装") ||
    normalized.includes("看起来像") ||
    normalized.includes("课堂上见过");
  const structure =
    normalized.includes("质量") ||
    normalized.includes("体积") ||
    normalized.includes("密度") ||
    normalized.includes("单位体积");
  return surface && !structure;
}

function stabilizeAiOffChallengeIds(challengeIds: readonly string[]): string[] {
  const allowed = new Set<string>(SAMPLES_AI_OFF_CHALLENGE_IDS);
  const kept = challengeIds.filter((id) => allowed.has(id));
  if (kept.length > 0) {
    return kept;
  }
  return [...SAMPLES_AI_OFF_CHALLENGE_IDS];
}
