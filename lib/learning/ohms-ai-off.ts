import { independentChallenges } from "@/content/physics-models/ohms-law/independent-challenges";
import { ohmsLawAssessmentOverlay } from "@/content/physics-models/ohms-law/assessment-overlay";
import { PRODUCTION_AI_OFF_IDS } from "@/content/physics-models/ohms-law/implementation-contract";
import {
  evaluateOhmsRearrangementAuthored,
  evaluateOhmsTwoControlAuthored,
} from "@/lib/learning/ohms-authored";
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

export const OHMS_AI_OFF_CHALLENGE_IDS = [...PRODUCTION_AI_OFF_IDS] as const;
export const OHMS_AI_OFF_A = "ai-off-unfamiliar-toy-motor-resistor";
export const OHMS_AI_OFF_B = "ai-off-condition-r-not-made-by-division";
export const OHMS_AI_OFF_DRAFT_KIND = "ohms-ai-off-draft";
export const MIN_OHMS_INDEPENDENT_HAN_CHARS = 8;

export type OhmsAiOffStep = "response" | "post-check";

export interface OhmsAiOffDraft {
  kind: typeof OHMS_AI_OFF_DRAFT_KIND;
  challengeIds: string[];
  currentChallengeId: string;
  step: OhmsAiOffStep;
  selectedAnswer: string;
  reasoning: string;
  postCheckSelections: string[];
  preCommitEvidenceIds: string[];
  retiredChallengeIds: string[];
}

export function ohmsAiOffChallenges(): IndependentChallenge[] {
  return OHMS_AI_OFF_CHALLENGE_IDS.map((id) => {
    const challenge = independentChallenges.find((item) => item.id === id);
    if (!challenge) {
      throw new Error(`Missing canonical independent challenge: ${id}`);
    }
    return challenge;
  });
}

export function ohmsAiOffChallenge(challengeId: string): IndependentChallenge {
  const challenge = independentChallenges.find((item) => item.id === challengeId);
  if (!challenge) {
    throw new Error(`Missing canonical independent challenge: ${challengeId}`);
  }
  return challenge;
}

export function ohmsJudgmentLabelFor(challengeId: string, answerId: string): string {
  return (
    ohmsAiOffJudgments(challengeId).find((option) => option.id === answerId)?.label ??
    answerId
  );
}

export function isOhmsAiOffSessionOpen(
  assessment: IndependentAssessment | undefined,
  draft: Pick<OhmsAiOffDraft, "challengeIds" | "currentChallengeId" | "retiredChallengeIds">,
): boolean {
  return currentOhmsAiOffChallengeId(assessment, draft) !== null;
}

export function ohmsAiOffJudgments(challengeId: string): IndependentJudgmentOption[] {
  return ohmsLawAssessmentOverlay.independent?.[challengeId]?.judgments ?? [];
}

export function ohmsAiOffPostCheckOptions(
  challengeId: string,
): IndependentPostCheckOption[] {
  return ohmsLawAssessmentOverlay.independent?.[challengeId]?.postCheck ?? [];
}

export function intendedOhmsAiOffAnswerId(challengeId: string): string {
  const intended = ohmsAiOffJudgments(challengeId).find((option) => option.correct);
  if (!intended) {
    throw new Error(`Missing intended AI_OFF judgment: ${challengeId}`);
  }
  return intended.id;
}

export function intendedOhmsAiOffPostCheckIds(challengeId: string): string[] {
  return ohmsAiOffPostCheckOptions(challengeId)
    .filter((option) => option.required && !option.distractor)
    .map((option) => option.id);
}

export function intendedOhmsAiOffPreCommitIds(challengeId: string): string[] {
  if (challengeId === OHMS_AI_OFF_A) {
    return ["change-u-same-r", "change-r-same-u"];
  }
  return ["r-is-property", "same-relation"];
}

export function emptyOhmsAiOffDraft(
  challengeIds: readonly string[] = OHMS_AI_OFF_CHALLENGE_IDS,
): OhmsAiOffDraft {
  const ids = [...challengeIds];
  return {
    kind: OHMS_AI_OFF_DRAFT_KIND,
    challengeIds: ids,
    currentChallengeId: ids[0] ?? OHMS_AI_OFF_A,
    step: "response",
    selectedAnswer: "",
    reasoning: "",
    postCheckSelections: [],
    preCommitEvidenceIds: [],
    retiredChallengeIds: [],
  };
}

export function hasMeaningfulOhmsIndependentReasoning(text: string): boolean {
  const han = text.trim().match(/[\u4e00-\u9fff]/g) ?? [];
  return han.length >= MIN_OHMS_INDEPENDENT_HAN_CHARS;
}

export function hasRequiredOhmsAiOffPreCommitEvidence(
  challengeId: string,
  preCommitEvidenceIds: readonly string[],
): boolean {
  const required = intendedOhmsAiOffPreCommitIds(challengeId);
  const selected = new Set(preCommitEvidenceIds);
  return required.every((id) => selected.has(id));
}

export function canCommitOhmsAiOffResponse(input: {
  selectedAnswer: string;
  studentReasoning: string;
  challengeId: string;
  preCommitEvidenceIds?: string[];
}): boolean {
  return (
    input.selectedAnswer.trim().length > 0 &&
    hasMeaningfulOhmsIndependentReasoning(input.studentReasoning) &&
    hasRequiredOhmsAiOffPreCommitEvidence(
      input.challengeId,
      input.preCommitEvidenceIds ?? [],
    )
  );
}

export function postCheckMatchesRequired(
  challengeId: string,
  postCheckIds: readonly string[],
): boolean {
  const options = ohmsAiOffPostCheckOptions(challengeId);
  const selected = new Set(postCheckIds);
  const required = options.filter((option) => option.required && !option.distractor);
  const distractors = options.filter((option) => option.distractor);
  return (
    required.length > 0 &&
    required.every((option) => selected.has(option.id)) &&
    distractors.every((option) => !selected.has(option.id))
  );
}

export function evaluateOhmsAiOffAttempt(input: {
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
  const answerCorrect = input.selectedAnswer === intendedOhmsAiOffAnswerId(input.challengeId);
  const hasOwnWords = hasMeaningfulOhmsIndependentReasoning(input.studentReasoning);
  const matchesPostCheck = postCheckMatchesRequired(input.challengeId, input.postCheckIds);
  const preCommitOk = hasRequiredOhmsAiOffPreCommitEvidence(
    input.challengeId,
    input.preCommitEvidenceIds ?? [],
  );
  const authored = analyzeOhmsIndependentText(input.challengeId, input.studentReasoning);
  const preCommitRelation =
    preCommitOk && authored.ok && !authored.formulaOnly && !authored.generic;
  const reasoningSignals: IndependentReasoningSignals = {
    identifiesCurrent: authored.mentionsCurrent,
    identifiesVoltage: authored.mentionsVoltage,
    identifiesResistance: authored.mentionsResistance,
    usesCurrentVoltageResistanceRelation: authored.usesRelation,
    checksControlledComparison: authored.hasControl,
    distinguishesRearrangementFromCause: authored.rejectsManufacture,
    rejectsResistanceCreatedByUI: authored.rejectsManufacture,
    preCommitTwoControls: input.challengeId === OHMS_AI_OFF_A ? preCommitRelation : undefined,
    preCommitRIsProperty: input.challengeId === OHMS_AI_OFF_B ? preCommitRelation : undefined,
    identifiesConditionOrBoundary: preCommitRelation,
    avoidsOhmsMisconception: !authored.formulaOnly && !authored.manufacturesR,
    conclusionOnlyReasoning: authored.formulaOnly,
    hasOwnWords,
    postCheckMatchesRequired: matchesPostCheck,
  };

  const accepted =
    answerCorrect &&
    hasOwnWords &&
    matchesPostCheck &&
    preCommitRelation &&
    input.llmUsed === false &&
    !authored.formulaOnly &&
    !authored.manufacturesR &&
    !authored.resistivityLecture;

  return { answerCorrect, accepted, reasoningSignals };
}

export function buildOhmsAiOffAttempt(
  input: {
    challengeId: string;
    selectedAnswer: string;
    studentReasoning: string;
    timestamp: string;
    preCommitEvidenceIds?: string[];
  },
  postCheckIds: readonly string[] = [],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateOhmsAiOffAttempt({
    ...input,
    postCheckIds,
    preCommitEvidenceIds: input.preCommitEvidenceIds ?? [],
    llmUsed,
  });
  return {
    challengeId: input.challengeId,
    selectedAnswer: input.selectedAnswer,
    studentReasoning: input.studentReasoning,
    answerCorrect: evaluation.answerCorrect,
    reasoningSignals: evaluation.reasoningSignals,
    postCheckIds: [...postCheckIds],
    preCommitEvidenceIds: [...(input.preCommitEvidenceIds ?? [])],
    timestamp: input.timestamp,
    accepted: evaluation.accepted,
    llmUsed: false,
    completedWithoutAI: true,
  };
}

export function applyOhmsAiOffPostCheck(
  attempt: IndependentChallengeAttempt,
  postCheckIds: readonly string[],
  llmUsed = false,
): IndependentChallengeAttempt {
  const evaluation = evaluateOhmsAiOffAttempt({
    challengeId: attempt.challengeId,
    selectedAnswer: attempt.selectedAnswer,
    studentReasoning: attempt.studentReasoning,
    postCheckIds,
    preCommitEvidenceIds: attempt.preCommitEvidenceIds ?? [],
    llmUsed,
  });
  return {
    ...attempt,
    reasoningSignals: evaluation.reasoningSignals,
    postCheckIds: [...postCheckIds],
    accepted: evaluation.accepted,
    llmUsed: false,
    completedWithoutAI: true,
  };
}

export function hasAcceptedOhmsAiOffChallenge(
  assessment: IndependentAssessment | undefined,
  challengeId: string,
): boolean {
  return (assessment?.challengeAttempts ?? []).some(
    (attempt) =>
      attempt.challengeId === challengeId &&
      attempt.accepted &&
      attempt.llmUsed === false,
  );
}

export function hasAcceptedOhmsAiOffChallenges(
  assessment: IndependentAssessment | undefined,
): boolean {
  return OHMS_AI_OFF_CHALLENGE_IDS.every((id) =>
    hasAcceptedOhmsAiOffChallenge(assessment, id),
  );
}

export function ohmsTutorUsedDuringIndependent(session: LearningSession): boolean {
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

export function hasCompletedOhmsAiOff(session: LearningSession): boolean {
  return (
    hasAcceptedOhmsAiOffChallenges(session.independentAssessment) &&
    session.independentAssessment?.llmUsed === false &&
    session.independentAssessment.completedWithoutAI === true &&
    !ohmsTutorUsedDuringIndependent(session)
  );
}

export function currentOhmsAiOffChallengeId(
  assessment: IndependentAssessment | undefined,
  draft: Pick<OhmsAiOffDraft, "challengeIds" | "currentChallengeId" | "retiredChallengeIds">,
): string | null {
  const retired = new Set(draft.retiredChallengeIds);
  if (
    draft.currentChallengeId &&
    !retired.has(draft.currentChallengeId) &&
    !hasAcceptedOhmsAiOffChallenge(assessment, draft.currentChallengeId)
  ) {
    return draft.currentChallengeId;
  }
  return (
    draft.challengeIds.find(
      (id) => !retired.has(id) && !hasAcceptedOhmsAiOffChallenge(assessment, id),
    ) ?? null
  );
}

export function nextOhmsAiOffDraft(
  assessment: IndependentAssessment | undefined,
  previous: OhmsAiOffDraft,
  justChallengeId: string,
): OhmsAiOffDraft {
  const retired = new Set(previous.retiredChallengeIds);
  if (hasAcceptedOhmsAiOffChallenge(assessment, justChallengeId)) {
    retired.add(justChallengeId);
  }
  const nextId = currentOhmsAiOffChallengeId(assessment, {
    challengeIds: previous.challengeIds,
    currentChallengeId: "",
    retiredChallengeIds: [...retired],
  });
  if (!nextId || nextId !== justChallengeId) {
    return {
      ...emptyOhmsAiOffDraft(previous.challengeIds),
      currentChallengeId: nextId ?? justChallengeId,
      retiredChallengeIds: [...retired],
    };
  }
  return {
    ...previous,
    step: "post-check",
    retiredChallengeIds: [...retired],
  };
}

export function retryOhmsAiOffDraft(
  previous: OhmsAiOffDraft,
  challengeId: string,
): OhmsAiOffDraft {
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

export function buildOhmsAiOffAssessment(
  attempts: IndependentChallengeAttempt[],
  llmUsed: boolean,
): IndependentAssessment {
  const accepted = hasAcceptedOhmsAiOffChallenges({
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

export function completeOhmsAiOffInput(challengeId: string, timestamp: string) {
  const isA = challengeId === OHMS_AI_OFF_A;
  return {
    challengeId,
    selectedAnswer: intendedOhmsAiOffAnswerId(challengeId),
    studentReasoning: isA
      ? "换更高电压的电池时电阻可以看成不变，电流更大；换更大电阻时电压可以看成不变，电流更小。"
      : "R = U / I 只是同一个关系。电压变了并没有制造新的电阻，电阻仍可看成不变，电流会变大。",
    timestamp,
    postCheckIds: intendedOhmsAiOffPostCheckIds(challengeId),
    preCommitEvidenceIds: intendedOhmsAiOffPreCommitIds(challengeId),
  };
}

function analyzeOhmsIndependentText(challengeId: string, text: string) {
  const compact = text.replace(/\s+/g, "");
  const formulaOnly =
    /^(电流等于电压除以电阻|I=U\/R|套公式就行)+[。.!！]*$/i.test(compact) ||
    (/I=U\/R|电流等于电压除以电阻/.test(compact) &&
      !/电阻.{0,6}(不变|相同|没变)|电压.{0,6}(不变|相同|没变)/.test(compact));
  const generic = /^(好好|我觉得这样|不知道)+[。.!！]*$/.test(compact);
  const manufacturesR =
    !/没有制造|不是制造|并没有制造/.test(compact) &&
    /制造.{0,6}电阻|电阻一定变成一个新的|分子变大所以电阻变大/.test(compact);
  const resistivityLecture = /电阻率|微观|电子碰撞/.test(compact) && !/属性/.test(compact);
  const mentionsCurrent = /电流/.test(compact);
  const mentionsVoltage = /电压/.test(compact);
  const mentionsResistance = /电阻/.test(compact);
  const hasControl = /电阻.{0,6}(不变|相同|没变)|电压.{0,6}(不变|相同|没变)/.test(compact);
  const rejectsManufacture = /没有制造|不是制造|并没有制造|不是被?算出来才有|电阻是.{0,8}属性/.test(
    compact,
  );
  const usesRelation = mentionsCurrent && mentionsVoltage && mentionsResistance;
  const authored =
    challengeId === OHMS_AI_OFF_A
      ? evaluateOhmsTwoControlAuthored(text)
      : evaluateOhmsRearrangementAuthored(text);
  const ok = authored.ok;
  return {
    ok,
    formulaOnly,
    generic,
    manufacturesR,
    resistivityLecture,
    mentionsCurrent,
    mentionsVoltage,
    mentionsResistance,
    hasControl,
    rejectsManufacture,
    usesRelation,
  };
}
